/* ============================================================
   云便签 — notes.js
   私密便签（notes 表，RLS 每用户隔离，占配额，不过期）
   公开便签（public_notes 表，游客可建可查，创建后不可改删，到期失效）
   Markdown：内置精简渲染器（先转义再渲染，天然防 XSS）
   ============================================================ */

(function () {
    'use strict';

    var SUPABASE_URL = 'https://gxpnjnnhzicmdlcnweve.supabase.co';
    var SUPABASE_KEY = 'sb_publishable_UYsnk3V791ZgZzPBn-mL-w_v7mRAmbC';
    var NOTES_TABLE = 'notes';
    var PUBLIC_TABLE = 'public_notes';

    var currentUser = null;
    var supabase = (typeof window.supabase !== 'undefined')
        ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
        : null;

    var mode = 'public';            // public | private（默认公开便签）
    var myNotes = [];
    var editBusy = false;
    var pubBusy = false;
    var MAX_CONTENT = 100 * 1024;   // 单条便签内容上限 100KB，防御滥用
    var panelToken = 0;             // 右侧面板过期响应防护

    // ---------- 主题 ----------
    function initTheme() {
        var saved = localStorage.getItem('theme');
        document.documentElement.setAttribute('data-theme', (saved === 'dark' || saved === 'light') ? saved : 'light');
    }
    window.toggleTheme = function () {
        var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    };

    // ---------- 基础工具 ----------
    function escapeHtml(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    function showToast(msg, type) {
        var container = document.getElementById('toastContainer');
        var el = document.createElement('div');
        el.className = 'toast toast-' + (type || 'info');
        el.textContent = msg;
        container.appendChild(el);
        setTimeout(function () {
            el.style.opacity = '0';
            el.style.transition = 'opacity 0.3s ease';
            setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 300);
        }, 3000);
    }
    function fmtTime(iso) {
        if (!iso) return '';
        try {
            var d = new Date(iso);
            return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
                ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
        } catch (e) { return iso; }
    }
    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function fmtRemain(iso) {
        var ms = new Date(iso).getTime() - Date.now();
        if (ms <= 0) return '已过期';
        var h = Math.floor(ms / 3600000);
        if (h >= 24) return '剩余 ' + Math.floor(h / 24) + ' 天';
        if (h >= 1) return '剩余 ' + h + ' 小时';
        return '剩余 ' + Math.max(1, Math.floor(ms / 60000)) + ' 分钟';
    }

    // 带超时的请求封装
    function withTimeout(promise, ms, label) {
        return new Promise(function (resolve, reject) {
            var done = false;
            var t = setTimeout(function () {
                if (done) return; done = true;
                reject(new Error(label + '超时，请检查网络后重试'));
            }, ms || 15000);
            promise.then(function (v) { if (done) return; done = true; clearTimeout(t); resolve(v); },
                         function (e) { if (done) return; done = true; clearTimeout(t); reject(e); });
        });
    }
    function errMsg(e) {
        var msg = (e && e.message) ? e.message : String(e || '操作失败');
        if (/Failed to fetch|NetworkError|network|Load failed/i.test(msg)) return '网络连接失败，请检查网络后重试';
        if (/timeout/i.test(msg)) return '请求超时，请检查网络后重试';
        if (/row-level security|permission/i.test(msg)) return '没有执行此操作的权限';
        if (/JWT|401/i.test(msg)) return '登录状态已过期，请刷新页面重新登录';
        if (/超出配额/.test(msg)) return msg;
        return msg;
    }

    // ============================================================
    // Markdown 渲染（安全版：先 HTML 转义，再解析有限语法）
    // 支持者：标题、粗斜体、行内代码、代码块、引用、列表、链接、
    //        分隔线、表格；链接仅 http(s)，自动加 rel/防御
    // ============================================================
    function renderInline(text) {
        var s = escapeHtml(text);
        // 行内代码（先处理，避免内部再被其他语法加工）
        s = s.replace(/`([^`\n]+)`/g, '<code>$1</code>');
        // 图片语法不支持（防外链追踪/大图），仅链接
        s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
            '<a href="$2" target="_blank" rel="noopener noreferrer nofollow">$1</a>');
        s = s.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
        s = s.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
        return s;
    }

    function renderMarkdown(src) {
        var lines = String(src || '').replace(/\r\n/g, '\n').split('\n');
        var html = '';
        var inCode = false, codeBuf = [];
        var listType = null;   // 'ul' | 'ol' | null
        var inQuote = false;
        var tableBuf = null;

        function closeList() { if (listType) { html += '</' + listType + '>'; listType = null; } }
        function closeQuote() { if (inQuote) { html += '</blockquote>'; inQuote = false; } }
        function closeTable() {
            if (tableBuf) {
                var rows = tableBuf;
                var head = rows[0].split('|').map(function (c) { return c.trim(); }).filter(function (c) { return c !== ''; });
                html += '<table><thead><tr>';
                head.forEach(function (c) { html += '<th>' + renderInline(c) + '</th>'; });
                html += '</tr></thead><tbody>';
                rows.slice(2).forEach(function (r) {
                    var cells = r.split('|').map(function (c) { return c.trim(); }).filter(function (c) { return c !== ''; });
                    html += '<tr>';
                    cells.forEach(function (c) { html += '<td>' + renderInline(c) + '</td>'; });
                    html += '</tr>';
                });
                html += '</tbody></table>';
                tableBuf = null;
            }
        }
        function closeAll() { closeList(); closeQuote(); closeTable(); }

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];

            if (/^```/.test(line)) {
                if (inCode) {
                    html += '<pre><code>' + escapeHtml(codeBuf.join('\n')) + '</code></pre>';
                    codeBuf = []; inCode = false;
                } else {
                    closeAll();
                    inCode = true;
                }
                continue;
            }
            if (inCode) { codeBuf.push(line); continue; }

            // 表格：首行含 |，第二行是 |---|---|
            if (/\|/.test(line) && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(lines[i + 1])) {
                closeList(); closeQuote();
                if (!tableBuf) tableBuf = [];
                tableBuf.push(line.replace(/^\s*\|/, '').replace(/\|\s*$/, ''));
                continue;
            }
            closeTable();

            var h = line.match(/^(#{1,6})\s+(.*)$/);
            if (h) {
                closeAll();
                var lvl = h[1].length;
                html += '<h' + lvl + '>' + renderInline(h[2]) + '</h' + lvl + '>';
                continue;
            }
            if (/^\s*(---+|\*\*\*+)\s*$/.test(line)) {
                closeAll();
                html += '<hr>';
                continue;
            }
            var q = line.match(/^>\s?(.*)$/);
            if (q) {
                closeList();
                if (!inQuote) { html += '<blockquote>'; inQuote = true; }
                html += '<p>' + renderInline(q[1]) + '</p>';
                continue;
            }
            closeQuote();

            var ul = line.match(/^\s*[-*+]\s+(.*)$/);
            var ol = line.match(/^\s*\d+[.)]\s+(.*)$/);
            if (ul || ol) {
                closeTable();
                var want = ul ? 'ul' : 'ol';
                if (listType !== want) {
                    closeList();
                    html += '<' + want + '>';
                    listType = want;
                }
                html += '<li>' + renderInline((ul || ol)[1]) + '</li>';
                continue;
            }
            closeList();

            if (line.trim() === '') continue;
            html += '<p>' + renderInline(line) + '</p>';
        }
        // flush 代码块
        if (inCode) html += '<pre><code>' + escapeHtml(codeBuf.join('\n')) + '</code></pre>';
        closeAll();
        return html;
    }

    // ============================================================
    // 模式切换
    // ============================================================
    window.switchMode = function (m) {
        mode = m;
        document.getElementById('tabPublic').classList.toggle('active', m === 'public');
        document.getElementById('tabPrivate').classList.toggle('active', m === 'private');
        document.getElementById('publicPane').style.display = m === 'public' ? '' : 'none';
        document.getElementById('privatePane').style.display = m === 'private' ? '' : 'none';
        if (m === 'private') loadMyNotes();
    };

    // ============================================================
    // 私密便签
    // ============================================================
    function loadMyNotes() {
        var listEl = document.getElementById('privateList');
        var hintEl = document.getElementById('privateHint');
        if (!currentUser) return;
        hintEl.textContent = '正在加载…';
        withTimeout(
            supabase.from(NOTES_TABLE).select('*').order('updated_at', { ascending: false }),
            15000, '便签加载'
        )
            .then(function (res) {
                if (res.error) { hintEl.textContent = '加载失败：' + errMsg(res.error); return; }
                myNotes = res.data || [];
                hintEl.textContent = '共 ' + myNotes.length + ' 条便签（占存储配额，永不过期）';
                renderMyNotes();
            })
            .catch(function (e) { hintEl.textContent = '加载失败：' + errMsg(e); });
    }

    function renderMyNotes() {
        var listEl = document.getElementById('privateList');
        if (!myNotes.length) {
            listEl.innerHTML = '<div class="storage-empty">暂无私密便签，点击「新建便签」开始记录</div>';
            return;
        }
        var html = '';
        myNotes.forEach(function (n, idx) {
            var preview = (n.content || '').replace(/[#>*`|\-\[\]()]/g, '').trim().slice(0, 60);
            html += '<div class="note-item" onclick="viewNote(' + idx + ')">' +
                '<div class="note-item-info">' +
                    '<div class="note-item-title">' + escapeHtml(n.title || '(无标题)') + '</div>' +
                    (preview ? '<div class="note-item-preview">' + escapeHtml(preview) + '</div>' : '') +
                    '<div class="note-item-meta"><span>更新于 ' + fmtTime(n.updated_at) + '</span><span>' + (n.content || '').length + ' 字符</span></div>' +
                '</div>' +
                '<div class="note-item-actions">' +
                    '<button class="btn btn-sm btn-secondary" onclick="event.stopPropagation();openNoteEdit(' + idx + ')">编辑</button>' +
                    '<button class="btn btn-sm btn-secondary" onclick="event.stopPropagation();publishNote(' + idx + ')">发布</button>' +
                    '<button class="btn btn-sm btn-danger" onclick="event.stopPropagation();deleteNote(' + idx + ')">删除</button>' +
                '</div>' +
            '</div>';
        });
        listEl.innerHTML = html;
    }

    // ============================================================
    // 右侧面板：空态 / 查看 / 编辑（私密） / 创建公开
    // ============================================================
    function showPanel(which) {
        document.getElementById('panelEmpty').style.display = which === 'empty' ? '' : 'none';
        document.getElementById('panelView').style.display = which === 'view' ? '' : 'none';
        document.getElementById('panelEdit').style.display = which === 'edit' ? '' : 'none';
        document.getElementById('panelPublicEdit').style.display = which === 'publicEdit' ? '' : 'none';
        // 面板展开时容器收窄列表（与云盘 preview-open 行为一致）
        document.getElementById('notesContainer').classList.toggle('preview-open', which !== 'empty');
    }
    window.closePanel = function () {
        panelToken++;
        showPanel('empty');
    };

    // 复制文本到剪贴板（Clipboard API + 老浏览器回退）
    function copyText(text, okMsg) {
        function fallback() {
            var ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand('copy');
                showToast(okMsg, 'success');
            } catch (e) {
                showToast('复制失败，请手动选择内容复制', 'error');
            }
            document.body.removeChild(ta);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
                .then(function () { showToast(okMsg, 'success'); })
                .catch(fallback);
        } else {
            fallback();
        }
    }
    window.copyViewNote = function () {
        // 根据当前面板内容判断来源：公开便签行 or 私密便签行
        var n = null;
        if (window.__viewingPublic != null) {
            n = (window.__publicRows || [])[window.__viewingPublic];
        } else if (window.__viewingPrivate != null) {
            n = myNotes[window.__viewingPrivate];
        }
        if (!n) { showToast('复制失败，请重新打开便签', 'error'); return; }
        copyText((n.title ? n.title + '\n\n' : '') + (n.content || ''), '已复制完整内容到剪贴板');
    };

    // 查看私密便签
    window.viewNote = function (idx) {
        var n = myNotes[idx];
        if (!n) return;
        var token = ++panelToken;
        window.__viewingPublic = null;
        window.__viewingPrivate = idx;
        document.getElementById('viewTitle').textContent = n.title || '(无标题)';
        document.getElementById('viewMeta').innerHTML = '<span>更新于 ' + fmtTime(n.updated_at) + '</span><span>' + (n.content || '').length + ' 字符</span>';
        document.getElementById('viewBody').innerHTML = renderMarkdown(n.content);
        document.getElementById('viewHeadActions').innerHTML =
            '<button class="btn btn-secondary" onclick="copyViewNote()">复制</button>' +
            '<button class="btn btn-secondary" onclick="closePanel()">关闭</button>' +
            '<button class="btn btn-accent" onclick="openNoteEdit(' + idx + ')">编辑</button>';
        showPanel('view');
        if (token !== panelToken) return;
    };

    // 打开私密便签编辑（新建 idx=-1）
    window.openNoteEdit = function (idx) {
        var editTitle = document.getElementById('editTitle');
        if (idx === -1) {
            editTitle.textContent = '新建便签';
            document.getElementById('noteTitle').value = '';
            document.getElementById('noteContent').value = '';
            document.getElementById('noteEditId').value = '';
        } else {
            var n = myNotes[idx];
            if (!n) return;
            editTitle.textContent = '编辑便签';
            document.getElementById('noteTitle').value = n.title || '';
            document.getElementById('noteContent').value = n.content || '';
            document.getElementById('noteEditId').value = n.id;
        }
        var msgEl = document.getElementById('noteEditMsg');
        msgEl.style.display = 'none';
        document.getElementById('notePreview').innerHTML = renderMarkdown(document.getElementById('noteContent').value);
        showPanel('edit');
        setTimeout(function () { document.getElementById('noteTitle').focus(); }, 100);
    };

    document.getElementById('noteContent').addEventListener('input', function () {
        document.getElementById('notePreview').innerHTML = renderMarkdown(this.value);
    });
    document.getElementById('pubNoteContent').addEventListener('input', function () {
        document.getElementById('pubNotePreview').innerHTML = renderMarkdown(this.value);
    });

    window.saveNote = function () {
        if (!currentUser) { showToast('请先登录', 'error'); return; }
        if (editBusy) { showToast('正在保存，请稍候…', 'info'); return; }
        var id = document.getElementById('noteEditId').value;
        var title = document.getElementById('noteTitle').value.trim();
        var content = document.getElementById('noteContent').value;
        if (!title && !content.trim()) { showToast('标题和内容不能都为空', 'error'); return; }
        if (content.length > MAX_CONTENT) { showToast('内容超过 ' + MAX_CONTENT / 1024 + 'KB 上限', 'error'); return; }

        var msgEl = document.getElementById('noteEditMsg');
        editBusy = true;
        document.getElementById('noteSaveBtn').disabled = true;
        msgEl.textContent = '正在保存…';
        msgEl.className = 'auth-inline-msg auth-msg-info';
        msgEl.style.display = 'block';

        var task = id
            ? supabase.from(NOTES_TABLE).update({ title: title, content: content, format: 'markdown' }).eq('id', id)
            : supabase.from(NOTES_TABLE).insert({
                user_id: currentUser.id,
                title: title,
                content: content,
                format: 'markdown'
            });

        withTimeout(task, 20000, '保存')
            .then(function (res) {
                if (res.error) throw res.error;
                showToast('便签已保存', 'success');
                closePanel();
                loadMyNotes();
            })
            .catch(function (e) {
                msgEl.textContent = '保存失败：' + errMsg(e);
                msgEl.className = 'auth-inline-msg auth-msg-error';
            })
            .then(function () {
                editBusy = false;
                document.getElementById('noteSaveBtn').disabled = false;
            });
    };

    // ---------- 自定义确认对话框（替代浏览器 confirm） ----------
    var dialogOnOk = null;
    window.confirmDialog = function (title, message, onOk) {
        dialogOnOk = onOk || null;
        document.getElementById('noteDialogTitle').textContent = title;
        document.getElementById('noteDialogMsg').textContent = message;
        document.getElementById('noteDialog').classList.add('active');
    };
    window.closeNoteDialog = function () {
        document.getElementById('noteDialog').classList.remove('active');
        dialogOnOk = null;
    };
    window.noteDialogOk = function () {
        var cb = dialogOnOk;
        closeNoteDialog();
        if (cb) cb();
    };
    document.getElementById('noteDialog').addEventListener('click', function (e) {
        if (e.target === this) closeNoteDialog();
    });

    window.deleteNote = function (idx) {
        var n = myNotes[idx];
        if (!n) return;
        confirmDialog('删除确认', '确定删除便签「' + (n.title || '(无标题)') + '」吗？此操作不可撤销。', function () {
            withTimeout(supabase.from(NOTES_TABLE).delete().eq('id', n.id), 15000, '删除')
                .then(function (res) {
                    if (res.error) { showToast('删除失败：' + errMsg(res.error), 'error'); return; }
                    showToast('已删除', 'info');
                    closePanel();
                    loadMyNotes();
                })
                .catch(function (e) { showToast('删除失败：' + errMsg(e), 'error'); });
        });
    };

    // 把私密便签发布为公开便签
    window.publishNote = function (idx) {
        var n = myNotes[idx];
        if (!n) return;
        switchMode('public');
        openPublicEdit();
        document.getElementById('pubNoteTitle').value = n.title || '';
        document.getElementById('pubNoteContent').value = n.content || '';
        document.getElementById('pubNotePreview').innerHTML = renderMarkdown(n.content || '');
        showToast('已带入便签内容，请填写公开名称与保留时长', 'info');
    };

    // ============================================================
    // 公开便签
    // ============================================================
    window.searchPublicNotes = function () {
        var listEl = document.getElementById('publicList');
        var hintEl = document.getElementById('publicHint');
        var q = document.getElementById('publicSearch').value.trim();
        if (!q) { showToast('请输入便签名称', 'error'); return; }
        hintEl.textContent = '正在查询…';
        withTimeout(
            supabase.from(PUBLIC_TABLE)
                .select('*')
                .ilike('note_name', '%' + q.replace(/[%_]/g, '\\$&') + '%')
                .order('created_at', { ascending: false })
                .limit(20),
            15000, '查询'
        )
            .then(function (res) {
                if (res.error) { hintEl.textContent = '查询失败：' + errMsg(res.error); return; }
                var rows = res.data || [];
                renderPublicList(rows);
                hintEl.textContent = rows.length
                    ? '找到 ' + rows.length + ' 条公开便签'
                    : '没有找到名称包含「' + q + '」的公开便签';
            })
            .catch(function (e) { hintEl.textContent = '查询失败：' + errMsg(e); });
    };

    function renderPublicList(rows) {
        var listEl = document.getElementById('publicList');
        if (!rows.length) {
            listEl.innerHTML = '<div class="storage-empty">无结果</div>';
            return;
        }
        var html = '';
        rows.forEach(function (n, idx) {
            var expired = n.expires_at && new Date(n.expires_at).getTime() <= Date.now();
            html += '<div class="note-item" onclick="viewPublicNote(' + idx + ')">' +
                '<div class="note-item-info">' +
                    '<div class="note-item-title">' + escapeHtml(n.title || '(无标题)') + '</div>' +
                    '<div class="note-item-meta">' +
                        '<span class="note-name-badge">' + escapeHtml(n.note_name) + '</span>' +
                        (expired
                            ? '<span class="note-expired-badge">已过期</span>'
                            : '<span>' + (n.expires_at ? fmtRemain(n.expires_at) : '永不过期') + '</span>') +
                        '<span>创建于 ' + fmtTime(n.created_at) + '</span>' +
                    '</div>' +
                '</div>' +
                '<div class="note-item-actions">' +
                    (currentUser && !expired ? '<button class="btn btn-sm btn-accent" onclick="event.stopPropagation();savePublicToPrivate(' + idx + ')">转存</button>' : '') +
                '</div>' +
            '</div>';
        });
        listEl.innerHTML = html;
        window.__publicRows = rows;
    }

    window.viewPublicNote = function (idx) {
        var n = (window.__publicRows || [])[idx];
        if (!n) return;
        ++panelToken;
        window.__viewingPublic = idx;
        window.__viewingPrivate = null;
        document.getElementById('viewTitle').textContent = n.title || '(无标题)';
        var expired = n.expires_at && new Date(n.expires_at).getTime() <= Date.now();
        document.getElementById('viewMeta').innerHTML =
            '<span class="note-name-badge">' + escapeHtml(n.note_name) + '</span>' +
            '<span>创建于 ' + fmtTime(n.created_at) + '</span>' +
            (expired ? '<span class="note-expired-badge">已过期</span>'
                     : '<span>' + (n.expires_at ? fmtRemain(n.expires_at) : '永不过期') + '</span>');
        document.getElementById('viewBody').innerHTML = renderMarkdown(n.content);
        document.getElementById('viewHeadActions').innerHTML =
            '<button class="btn btn-secondary" onclick="copyViewNote()">复制</button>' +
            '<button class="btn btn-secondary" onclick="closePanel()">关闭</button>' +
            (currentUser && !expired
                ? '<button class="btn btn-accent" onclick="savePublicToPrivate(' + idx + ')">转存到我的便签</button>'
                : '');
        showPanel('view');
    };

    // 登录用户一键转存公开便签为私密便签
    window.savePublicToPrivate = function (idx) {
        if (!currentUser) { showToast('请先登录后再转存', 'error'); return; }
        var n = (window.__publicRows || [])[idx];
        if (!n) return;
        if (!n.title && n.content.trim() === '') { showToast('该便签内容为空，无需转存', 'info'); return; }
        if (n.content.length > MAX_CONTENT) { showToast('内容超过单条便签上限，无法转存', 'error'); return; }
        withTimeout(
            supabase.from(NOTES_TABLE).insert({
                user_id: currentUser.id,
                title: (n.title ? n.title : n.note_name),
                content: n.content,
                format: n.format || 'markdown'
            }),
            15000, '转存'
        )
            .then(function (res) {
                if (res.error) { showToast('转存失败：' + errMsg(res.error), 'error'); return; }
                showToast('已转存到我的便签', 'success');
            })
            .catch(function (e) { showToast('转存失败：' + errMsg(e), 'error'); });
    };

    window.openPublicEdit = function () {
        document.getElementById('pubNoteName').value = '';
        document.getElementById('pubNoteTitle').value = '';
        document.getElementById('pubNoteContent').value = '';
        document.getElementById('pubNotePreview').innerHTML = '';
        document.getElementById('pubEditMsg').style.display = 'none';
        // 游客隐藏「永不过期」选项
        var sel = document.getElementById('pubExpiry');
        var opt = sel.querySelector('option[value="0"]');
        if (currentUser) { if (opt) opt.style.display = ''; }
        else {
            if (opt) opt.style.display = 'none';
            if (sel.value === '0') sel.value = '24';
        }
        showPanel('publicEdit');
        setTimeout(function () { document.getElementById('pubNoteName').focus(); }, 100);
    };

    window.savePublicNote = function () {
        if (pubBusy) { showToast('正在创建，请稍候…', 'info'); return; }
        var name = document.getElementById('pubNoteName').value.trim();
        var title = document.getElementById('pubNoteTitle').value.trim();
        var content = document.getElementById('pubNoteContent').value;
        var hours = parseInt(document.getElementById('pubExpiry').value, 10);
        if (!name) { showPubMsg('请填写便签名称（查询凭据）', 'error'); return; }
        if (!title && !content.trim()) { showPubMsg('标题和内容不能都为空', 'error'); return; }
        if (content.length > MAX_CONTENT) { showPubMsg('内容超过 ' + MAX_CONTENT / 1024 + 'KB 上限', 'error'); return; }
        if (!currentUser && !hours) { showPubMsg('游客创建的公开便签必须选择保留时长', 'error'); return; }

        var payload = {
            note_name: name,
            title: title,
            content: content,
            format: 'markdown',
            expires_at: hours > 0
                ? new Date(Date.now() + hours * 3600000).toISOString()
                : null
        };

        pubBusy = true;
        document.getElementById('pubSaveBtn').disabled = true;
        showPubMsg('正在创建…', 'info');

        withTimeout(supabase.from(PUBLIC_TABLE).insert(payload), 20000, '创建')
            .then(function (res) {
                if (res.error) throw res.error;
                closePanel();
                showToast('公开便签已创建！请记住名称「' + name + '」，之后凭此查询', 'success');
                document.getElementById('publicSearch').value = name;
                searchPublicNotes();
            })
            .catch(function (e) {
                var msg = errMsg(e);
                if (/duplicate key|unique/i.test(msg)) msg = '该便签名称已被使用，请换一个名称';
                if (/public_notes_insert_any|check/i.test(msg)) msg = '保留时长不合法（游客最长 3 天）';
                showPubMsg('创建失败：' + msg, 'error');
            })
            .then(function () {
                pubBusy = false;
                document.getElementById('pubSaveBtn').disabled = false;
            });
    };

    function showPubMsg(msg, type) {
        var el = document.getElementById('pubEditMsg');
        el.textContent = msg;
        el.className = 'auth-inline-msg auth-msg-' + (type || 'info');
        el.style.display = 'block';
    }

    window.closeModal = function (id) { document.getElementById(id).classList.remove('active'); };

    // ---------- 初始化 ----------
    function init() {
        initTheme();
        // 确认对话框遮罩点击关闭
        document.getElementById('noteDialog').addEventListener('click', function (e) {
            if (e.target === this) closeNoteDialog();
        });

        if (!supabase) {
            document.getElementById('privateHint').textContent = '存储服务不可用';
            document.getElementById('publicHint').textContent = '存储服务不可用，无法创建或查询公开便签';
            return;
        }

        // 识别登录态：不强制登录（游客也能用公开便签）
        withTimeout(supabase.auth.getUser(), 10000, '登录状态获取')
            .then(function (res) {
                if (res && res.data && res.data.user) {
                    var u = res.data.user;
                    currentUser = {
                        id: u.id,
                        email: u.email,
                        name: (u.user_metadata && u.user_metadata.username) ? u.user_metadata.username : u.email
                    };
                    var badge = document.getElementById('userBadge');
                    badge.textContent = currentUser.name;
                    badge.className = 'admin-tag role-user';
                    badge.style.display = 'inline-block';
                    document.getElementById('logoutBtn').style.display = '';
                }
                loadMyNotes();   // 游客时由函数内部跳过，提示改为登录引导
                if (!currentUser) {
                    document.getElementById('privateHint').textContent = '登录后可使用私密便签（长期保存、占用云盘配额）';
                    document.getElementById('privateList').innerHTML =
                        '<div class="storage-empty">私密便签需要登录使用<br>' +
                        '<a class="btn btn-accent" style="margin-top:12px;display:inline-block;text-decoration:none" href="index.html">去主页登录</a></div>';
                }
            })
            .catch(function () {
                document.getElementById('privateHint').textContent = '登录状态获取失败，公开便签仍可使用';
            });
    }

    // ---------- 退出 ----------
    window.logout = function () {
        if (!supabase) { window.location.href = 'index.html'; return; }
        supabase.auth.signOut()
            .catch(function () {})
            .then(function () { window.location.href = 'index.html'; });
    };

    init();
})();
