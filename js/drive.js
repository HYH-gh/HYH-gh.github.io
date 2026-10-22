/* ============================================================
   Win11-style Navigation Hub — drive.js (独立云盘子页面)
   支持文件夹浏览 / 新建文件夹 / 重命名 / 预览
   ============================================================ */

(function () {
    'use strict';

    var SUPABASE_URL = 'https://gxpnjnnhzicmdlcnweve.supabase.co';
    var SUPABASE_KEY = 'sb_publishable_UYsnk3V791ZgZzPBn-mL-w_v7mRAmbC';
    var STORAGE_BUCKET = 'Main';
    var currentUser = null;
    var isAdmin = false;
    var supabase = (typeof window.supabase !== 'undefined')
        ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
        : null;

    // 当前所在目录（相对用户根目录的子目录数组），根目录为 []
    var pathStack = [];

    var IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg', 'ico'];
    var TEXT_EXTS  = ['txt', 'md', 'json', 'log', 'csv', 'tsv', 'xml', 'html', 'htm', 'css', 'js', 'mjs', 'cjs', 'ts', 'yml', 'yaml', 'ini', 'conf'];
    var TEXT_PREVIEW_LIMIT = 2 * 1024 * 1024;  // 纯文本预览上限 2MB
    var IMAGE_PREVIEW_LIMIT = 16 * 1024 * 1024; // 图片预览上限 16MB
    // 用户存储配额（字节），剩余空间 = 配额 - 已用
    var STORAGE_QUOTA = 1024 * 1024 * 1024; // 1GB，可按需调整

    function initTheme() {
        var saved = localStorage.getItem('theme');
        document.documentElement.setAttribute('data-theme', (saved === 'dark' || saved === 'light') ? saved : 'light');
    }

    // ---------- 基础工具 ----------
    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    function fileExt(name) {
        var i = name.lastIndexOf('.');
        return i === -1 ? '' : name.slice(i + 1).toLowerCase();
    }
    function isImage(name) { return IMAGE_EXTS.indexOf(fileExt(name)) !== -1; }
    function isText(name) { return TEXT_EXTS.indexOf(fileExt(name)) !== -1; }

    function formatBytes(b) {
        if (b == null) return '';
        if (b < 1024) return b + ' B';
        if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
        if (b < 1073741824) return (b / 1048576).toFixed(1) + ' MB';
        return (b / 1073741824).toFixed(1) + ' GB';
    }
    function cleanName(n) { return (n || '').replace(/\/+$/, ''); }
    function isFolderEntry(f) { return !f.metadata || f.metadata.size == null; }
    function isValidName(n) {
        n = (n || '').trim();
        return !!n && n !== '.' && n !== '..' && !/[\\/\u0000-\u001f]/.test(n);
    }

    function currentFolder() { return pathStack.join('/'); }
    function basePath() { return currentUser.id + (pathStack.length ? '/' + currentFolder() : ''); }
    function childPath(name) { return basePath() + '/' + name; }

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
        }, 2500);
    }

    // ---------- 导航（面包屑） ----------
    function renderPath() {
        var el = document.getElementById('pathBar');
        var html = '<button class="path-crumb" onclick="goToRoot()">我的云盘</button>';
        for (var i = 0; i < pathStack.length; i++) {
            html += '<span class="path-sep">/</span>' +
                    '<button class="path-crumb" onclick="goToPath(' + i + ')">' + escapeHtml(pathStack[i]) + '</button>';
        }
        el.innerHTML = html;
    }
    window.goToRoot = function () { pathStack = []; listStorageFiles(); };
    window.goToPath = function (idx) { pathStack = pathStack.slice(0, idx + 1); listStorageFiles(); };

    // ---------- 列表 ----------
    function listStorageFiles() {
        var listEl = document.getElementById('storageList');
        var hintEl = document.getElementById('storageHint');
        renderPath();
        listEl.innerHTML = '<div class="storage-progress">加载中…</div>';
        if (!currentUser) { listEl.innerHTML = '<div class="storage-empty">未登录</div>'; return; }
        loadStorageUsage();

        // 根目录直接枚举用户自己的文件夹（{uid}），而不是桶根，避免暴露用户 id 目录
        var opts = { sortBy: { column: 'name', order: 'asc' } };
        supabase.storage.from(STORAGE_BUCKET).list(basePath(), opts)
            .then(function (res) {
                if (res.error) {
                    listEl.innerHTML = '<div class="storage-empty">加载失败：' + escapeHtml(res.error.message) + '</div>';
                    return;
                }
                renderStorageList(res.data || []);
            })
            .catch(function (e) { listEl.innerHTML = '<div class="storage-empty">加载失败：' + escapeHtml(e.message || e) + '</div>'; });
    }

    // ---------- 存储用量（依赖后端 RPC：public.get_my_storage_usage） ----------
    function loadStorageUsage() {
        var textEl = document.getElementById('storageUsageText');
        var fillEl = document.getElementById('storageUsageFill');
        if (!currentUser) return;
        supabase.rpc('get_my_storage_usage')
            .then(function (res) {
                if (res.error) { textEl.textContent = '—'; fillEl.style.width = '0%'; return; }
                var used = (res.data && res.data.used_bytes) ? Number(res.data.used_bytes) : 0;
                var objCount = (res.data && res.data.objects) ? Number(res.data.objects) : 0;
                // 优先用后端按用户返回的配额，否则用前端默认值兜底
                var quota = (res.data && res.data.quota_bytes) ? Number(res.data.quota_bytes) : STORAGE_QUOTA;
                var remain = Math.max(0, quota - used);
                var pct = quota ? Math.min(100, (used / quota) * 100) : 0;
                textEl.textContent = '已用 ' + formatBytes(used) + ' · 剩余 ' + formatBytes(remain) + '（' + objCount + ' 个对象）';
                fillEl.style.width = pct.toFixed(1) + '%';
                fillEl.style.background = (pct > 90) ? 'var(--danger, #e5534b)' : 'var(--accent)';
            })
            .catch(function () { textEl.textContent = '—'; fillEl.style.width = '0%'; });
    }

    function renderStorageList(files) {
        var listEl = document.getElementById('storageList');
        var hintEl = document.getElementById('storageHint');
        var items = (files || []).map(function (f) {
            f._name = cleanName(f.name);
            f._folder = isFolderEntry(f);
            return f;
        }).filter(function (f) { return f._name !== '.gitkeep' && f._name !== '.empty'; });
        var folders = items.filter(function (f) { return f._folder; });
        var fileItems = items.filter(function (f) { return !f._folder; });
        var all = folders.concat(fileItems);
        window.__items = all;
        hintEl.innerHTML = '共 ' + items.length + ' 项';

        if (!all.length) { listEl.innerHTML = '<div class="storage-empty">此文件夹为空</div>'; return; }
        var html = '';
        for (var i = 0; i < all.length; i++) {
            var f = all[i];
            if (f._folder) {
                html += '<div class="storage-item folder-row" ondblclick="openFolder(' + i + ')">' +
                    '<span class="storage-item-icon folder-icon">' + folderIconSVG() + '</span>' +
                    '<span class="storage-item-name" title="' + escapeHtml(f._name) + '">' + escapeHtml(f._name) + '</span>' +
                    '<span class="storage-item-size">文件夹</span>' +
                    '<span class="storage-item-actions">' +
                    '<button class="btn btn-secondary" onclick="renameEntry(' + i + ')">重命名</button>' +
                    '<button class="btn btn-secondary" onclick="deleteEntry(' + i + ')">删除</button>' +
                    '</span></div>';
            } else {
                var size = f.metadata && f.metadata.size != null ? formatBytes(f.metadata.size) : '';
                html += '<div class="storage-item">' +
                    '<span class="storage-item-icon">' + fileIconSVG() + '</span>' +
                    '<span class="storage-item-name" title="' + escapeHtml(f._name) + '">' + escapeHtml(f._name) + '</span>' +
                    '<span class="storage-item-size">' + size + '</span>' +
                    '<span class="storage-item-actions">' +
                    (canPreview(f) ? '<button class="btn btn-secondary" onclick="previewFile(' + i + ')">预览</button>' : '') +
                    '<button class="btn btn-secondary" onclick="renameEntry(' + i + ')">重命名</button>' +
                    '<button class="btn btn-secondary" onclick="downloadFile(' + i + ')">下载</button>' +
                    '<button class="btn btn-secondary" onclick="deleteEntry(' + i + ')">删除</button>' +
                    '</span></div>';
            }
        }
        listEl.innerHTML = html;
    }

    function canPreview(f) {
        var sz = f.metadata && f.metadata.size != null ? f.metadata.size : null;
        if (isImage(f._name)) return sz == null || sz <= IMAGE_PREVIEW_LIMIT;
        if (isText(f._name)) return sz == null || sz <= TEXT_PREVIEW_LIMIT;
        return false;
    }

    function folderIconSVG() {
        return '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';
    }
    function fileIconSVG() {
        return '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><polyline points="14 2 14 8 20 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }

    // ---------- 打开文件夹 ----------
    window.openFolder = function (index) {
        var item = (window.__items || [])[index];
        if (!item || !item._folder) return;
        pathStack.push(item._name);
        listStorageFiles();
    };

    // ---------- 上传 ----------
    function uploadStorageFiles(fileList) {
        if (!fileList || !fileList.length) return;
        var files = Array.prototype.slice.call(fileList);
        var todo = files.length, doneCount = 0;
        files.forEach(function (file) {
            var path = childPath(file.name);
            supabase.storage.from(STORAGE_BUCKET).upload(path, file, { upsert: true, cacheControl: '3600' })
                .then(function (res) {
                    doneCount++;
                    if (res.error) showToast('上传失败「' + file.name + '」：' + res.error.message, 'error');
                    if (doneCount === todo) { showToast('上传完成', 'success'); listStorageFiles(); }
                })
                .catch(function (e) {
                    doneCount++;
                    showToast('上传失败「' + file.name + '」：' + (e.message || e), 'error');
                    if (doneCount === todo) listStorageFiles();
                });
        });
    }

    // ---------- 自定义对话框（替换浏览器默认 prompt/confirm） ----------
    var dialogOpts = null;

    function openAppDialog(opts) {
        dialogOpts = opts || {};
        document.getElementById('appDialog').classList.add('active');
        document.getElementById('appDialogTitle').textContent = dialogOpts.title || '提示';
        document.getElementById('appDialogMsg').textContent = dialogOpts.message || '';
        var wrap = document.getElementById('appDialogInputWrap');
        var input = document.getElementById('appDialogInput');
        var err = document.getElementById('appDialogErr');
        err.textContent = '';
        if (dialogOpts.input) {
            wrap.style.display = 'block';
            input.value = dialogOpts.inputValue || '';
            input.placeholder = dialogOpts.placeholder || '';
            document.getElementById('appDialogOk').textContent = dialogOpts.okText || '确定';
            setTimeout(function () {
                input.focus();
                var len = input.value.length;
                if (dialogOpts.selectTo != null) {
                    var s = Math.max(0, Math.min(dialogOpts.selectTo, len));
                    input.setSelectionRange(0, s); // 只选中 [0, s)：即文件名部分，扩展名不选
                } else {
                    input.select();
                }
            }, 30);
        } else {
            wrap.style.display = 'none';
        }
    }

    window.appDialogOk = function () {
        if (!dialogOpts) return;
        if (dialogOpts.input) {
            var v = document.getElementById('appDialogInput').value.trim();
            if (dialogOpts.validate && !dialogOpts.validate(v)) {
                document.getElementById('appDialogErr').textContent = dialogOpts.invalidMsg || '输入不合法';
                return;
            }
            if (dialogOpts.onOk) dialogOpts.onOk(v);
        } else {
            if (dialogOpts.onOk) dialogOpts.onOk();
        }
        closeAppDialog();
    };

    function closeAppDialog() {
        document.getElementById('appDialog').classList.remove('active');
        dialogOpts = null;
    }
    window.closeAppDialog = closeAppDialog;

    // 名称型 Prompt 的便捷封装；selectTo 为选中起始位置（null=全选，用于重命名只选文件名）
    function promptName(title, placeholder, initial, onOk, selectTo) {
        openAppDialog({
            input: true,
            title: title,
            placeholder: placeholder,
            inputValue: initial,
            selectTo: (selectTo === undefined || selectTo === null) ? null : selectTo,
            validate: isValidName,
            invalidMsg: '名称不合法（不能为空或含非法字符）',
            onOk: onOk
        });
    }

    document.getElementById('appDialog').addEventListener('click', function (e) {
        if (e.target === this) closeAppDialog();
    });
    document.getElementById('appDialogInput').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') appDialogOk();
    });

    // ---------- 新建文件夹 ----------
    window.newFolder = function () {
        promptName('新建文件夹', '文件夹名称', '', function (name) {
            var marker = childPath(name) + '/.gitkeep';
            supabase.storage.from(STORAGE_BUCKET).upload(marker, new Blob(['']), { contentType: 'text/plain' })
                .then(function (res) {
                    if (res.error) { showToast('新建失败：' + res.error.message, 'error'); return; }
                    showToast('已创建文件夹', 'success');
                    listStorageFiles();
                })
                .catch(function (e) { showToast('新建失败：' + (e.message || e), 'error'); });
        });
    };

    // ---------- 重命名 ----------
    // 递归移动一个文件夹内所有子项（用于文件夹重命名）
    // 与单文件 move 兼容，避免 Supabase 对“文件夹整体 move”前缀语义的多端差异
    function moveFolderItems(from, to) {
        return supabase.storage.from(STORAGE_BUCKET).list(from, { sortBy: { column: 'name', order: 'asc' } })
            .then(function (res) {
                if (res.error) throw res.error;
                var items = res.data || [];
                var tasks = [];
                items.forEach(function (it) {
                    var name = cleanName(it.name);
                    if (!name) return;
                    var oldChild = from + '/' + name;
                    var newChild = to + '/' + name;
                    if (isFolderEntry(it)) {
                        tasks.push(moveFolderItems(oldChild, newChild));
                    } else {
                        tasks.push(supabase.storage.from(STORAGE_BUCKET).move(oldChild, newChild)
                            .then(function (r) { if (r.error) throw r.error; }));
                    }
                });
                return Promise.all(tasks);
            });
    }

    window.renameEntry = function (index) {
        var item = (window.__items || [])[index];
        if (!item) return;
        var oldName = item._name;
        // 文件才剥扩展名：选中起始位置 = 最后一个 . 的下标（排除扩展名）；文件夹则全选
        var selTo = null;
        if (!item._folder) {
            var dot = oldName.lastIndexOf('.');
            if (dot > 0) selTo = dot;
        }
        promptName('重命名', '新名称', oldName, function (newName) {
            if (newName === oldName) return;
            var fromPath = childPath(oldName);
            var toPath = childPath(newName);

            var task = item._folder
                ? moveFolderItems(fromPath, toPath)
                : supabase.storage.from(STORAGE_BUCKET).move(fromPath, toPath)
                    .then(function (r) { if (r.error) throw r.error; });

            task.then(function () {
                showToast('已重命名', 'success');
                listStorageFiles();
            }).catch(function (e) {
                showToast('重命名失败：' + ((e && e.message) || e), 'error');
            });
        }, selTo);
    };

    // ---------- 下载 ----------
    window.downloadFile = function (index) {
        var item = (window.__items || [])[index];
        if (!item || item._folder) return;
        var path = childPath(item._name);
        // 与预览一致走 download()+Blob，避免 createSignedUrl 的 MIME/CORS 问题
        supabase.storage.from(STORAGE_BUCKET).download(path)
            .then(function (res) {
                if (res.error || !res.data) throw (res.error || new Error('无内容'));
                var url = URL.createObjectURL(res.data);
                var a = document.createElement('a');
                a.href = url;
                a.download = item._name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
            })
            .catch(function (e) { showToast('下载失败：' + ((e && e.message) || e), 'error'); });
    };

    // ---------- 删除 ----------
    window.deleteEntry = function (index) {
        var item = (window.__items || [])[index];
        if (!item) return;
        openAppDialog({
            title: '删除确认',
            message: '确定删除「' + item._name + '」吗？此操作不可撤销。',
            onOk: function () {
                // remove 对传入路径做前缀匹配，文件夹直接传 uid/名 即可（不带尾斜杠）
                var paths = [childPath(item._name)];
                supabase.storage.from(STORAGE_BUCKET).remove(paths)
                    .then(function (res) {
                        if (res.error) { showToast('删除失败：' + res.error.message, 'error'); return; }
                        showToast('已删除「' + item._name + '」', 'info');
                        listStorageFiles();
                    })
                    .catch(function (e) { showToast('删除失败：' + (e.message || e), 'error'); });
            }
        });
    };

    // ---------- 预览 ----------
    window.__previewUrl = null;

    window.previewFile = function (index) {
        var item = (window.__items || [])[index];
        if (!item || item._folder) return;
        var name = item._name;
        var path = childPath(name);
        document.getElementById('driveContainer').classList.add('preview-open');
        document.getElementById('previewTitle').textContent = name;
        var body = document.getElementById('previewBody');
        body.innerHTML = '<div class="storage-progress">加载中…</div>';

        if (isImage(name)) {
            // 与文本预览一致使用 download()，再转成 object URL，绕开 createSignedUrl 的 MIME/CORS 渲染问题
            supabase.storage.from(STORAGE_BUCKET).download(path)
                .then(function (res) {
                    if (res.error || !res.data) throw (res.error || new Error('无内容'));
                    if (window.__previewUrl) URL.revokeObjectURL(window.__previewUrl);
                    window.__previewUrl = URL.createObjectURL(res.data);
                    body.innerHTML = '<div class="preview-img-wrap"><img class="preview-img" src="' + window.__previewUrl + '" alt="' + escapeHtml(name) + '"></div>';
                })
                .catch(function (e) { body.innerHTML = '<div class="storage-empty">预览失败：' + escapeHtml(e.message || e) + '</div>'; });
        } else if (isText(name)) {
            supabase.storage.from(STORAGE_BUCKET).download(path)
                .then(function (res) {
                    if (res.error || !res.data) throw (res.error || new Error('无内容'));
                    return res.data.text().then(function (text) {
                        body.innerHTML = '<pre class="preview-text">' + escapeHtml(text) + '</pre>';
                    });
                })
                .catch(function (e) { body.innerHTML = '<div class="storage-empty">预览失败：' + escapeHtml(e.message || e) + '</div>'; });
        }
    };

    function closePreview() {
        if (window.__previewUrl) { URL.revokeObjectURL(window.__previewUrl); window.__previewUrl = null; }
        document.getElementById('driveContainer').classList.remove('preview-open');
        document.getElementById('previewBody').innerHTML = '';
    }
    window.closePreview = closePreview;

    // ---------- 退出 ----------
    window.logout = function () {
        supabase.auth.signOut().then(function () { window.location.href = 'index.html'; });
    };

    // ---------- 绑定上传 ----------
    function bindStorage() {
        var drop = document.getElementById('storageDrop');
        var input = document.getElementById('storageFileInput');
        input.addEventListener('change', function () {
            uploadStorageFiles(input.files);
            input.value = '';
        });
        drop.addEventListener('click', function (e) {
            if (e.target.closest('button')) return;
            input.click();
        });
        ['dragenter', 'dragover'].forEach(function (ev) {
            drop.addEventListener(ev, function (e) { e.preventDefault(); e.stopPropagation(); drop.classList.add('dragover'); });
        });
        ['dragleave', 'drop'].forEach(function (ev) {
            drop.addEventListener(ev, function (e) { e.preventDefault(); e.stopPropagation(); drop.classList.remove('dragover'); });
        });
        drop.addEventListener('drop', function (e) {
            var dt = e.dataTransfer;
            if (dt && dt.files && dt.files.length) uploadStorageFiles(dt.files);
        });
    }

    // ---------- 配额管理（仅管理员） ----------
    function emailEscape(s) { return (s || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'"); }

    window.openQuotaManager = function () {
        if (!isAdmin) return;
        document.getElementById('quotaModal').classList.add('active');
        var list = document.getElementById('quotaUserList');
        list.innerHTML = '<div class="storage-progress">加载中…</div>';
        supabase.rpc('get_quota_config').then(function (res) {
            if (res.error) { list.innerHTML = '<div class="storage-empty">加载失败：' + escapeHtml(res.error.message || res.error) + '</div>'; return; }
            var d = res.data;
            document.getElementById('quotaDefaultInput').value = d.default_quota_bytes;
            renderQuotaUsers(d.members || [], d.default_quota_bytes);
        }).catch(function (e) { list.innerHTML = '<div class="storage-empty">加载失败：' + escapeHtml(e.message || e) + '</div>'; });
    };

    function renderQuotaUsers(members, def) {
        var list = document.getElementById('quotaUserList');
        if (!members.length) { list.innerHTML = '<div class="storage-empty">暂无用户</div>'; return; }
        var hasCustom = members.some(function (m) { return m.quota_bytes !== def; });
        var html = '<div class="quota-legend">' + (hasCustom ? '标记 ⚑ 为用户单独配额，数字为该用户当前生效配额' : '所有用户均使用默认配额') + '</div>';
        members.forEach(function (m) {
            var custom = m.quota_bytes !== def;
            var pct = m.quota_bytes ? Math.min(100, (Number(m.used_bytes) / m.quota_bytes) * 100) : 0;
            html += '<div class="quota-user-row' + (custom ? ' is-custom' : '') + '">' +
                '<div class="quota-user-main">' +
                    '<span class="quota-user-email">' + (custom ? '⚑ ' : '') + escapeHtml(m.email || '（无邮箱）') + '</span>' +
                    '<span class="quota-user-used">已用 ' + formatBytes(m.used_bytes) + ' · ' + (m.objects || 0) + ' 个对象 · 占 ' + pct.toFixed(1) + '%</span>' +
                    '<div class="quota-user-bar"><div class="quota-user-bar-fill" style="width:' + pct.toFixed(1) + '%"></div></div>' +
                '</div>' +
                '<div class="quota-user-actions">' +
                    '<input type="number" min="0" class="quota-user-input" value="' + m.quota_bytes + '">' +
                    '<button class="btn btn-secondary" onclick="saveUserQuota(\'' + emailEscape(m.email) + '\', this)">保存</button>' +
                    '<button class="btn btn-secondary" onclick="clearUserQuota(\'' + emailEscape(m.email) + '\')">恢复默认</button>' +
                '</div>' +
            '</div>';
        });
        list.innerHTML = html;
    }

    window.saveDefaultQuota = function () {
        var bytes = parseInt(document.getElementById('quotaDefaultInput').value, 10);
        if (!(bytes >= 0)) { showToast('请输入有效的字节数', 'error'); return; }
        supabase.rpc('set_default_quota', { p_bytes: bytes }).then(function (res) {
            if (res.error) { showToast('保存失败：' + (res.error.message || res.error), 'error'); return; }
            showToast('默认配额已更新');
            loadStorageUsage();
        });
    };

    window.saveUserQuota = function (email, btn) {
        var input = btn.closest('.quota-user-row').querySelector('.quota-user-input');
        var bytes = parseInt(input.value, 10);
        if (!(bytes >= 0)) { showToast('请输入有效的字节数', 'error'); return; }
        supabase.rpc('set_user_quota', { p_email: email, p_bytes: bytes }).then(function (res) {
            if (res.error) { showToast('保存失败：' + (res.error.message || res.error), 'error'); return; }
            showToast('已为该用户设置配额');
            loadStorageUsage();
        });
    };

    window.clearUserQuota = function (email) {
        supabase.rpc('clear_user_quota', { p_email: email }).then(function (res) {
            if (res.error) { showToast('操作失败：' + (res.error.message || res.error), 'error'); return; }
            showToast('已恢复默认配额');
            openQuotaManager();
            loadStorageUsage();
        });
    };

    function closeQuotaManager() {
        document.getElementById('quotaModal').classList.remove('active');
    }
    window.closeQuotaManager = closeQuotaManager;

    // ---------- 初始化 ----------
    function init() {
        initTheme();
        bindStorage();
        if (!supabase) {
            document.getElementById('storageList').innerHTML = '<div class="storage-empty">存储服务不可用</div>';
            return;
        }
        supabase.auth.getUser().then(function (res) {
            if (!res || !res.data || !res.data.user) { window.location.href = 'index.html'; return; }
            var user = res.data.user;
            var name = (user.user_metadata && user.user_metadata.username) ? user.user_metadata.username : user.email;
            currentUser = { id: user.id, email: user.email, name: name };
            var badge = document.getElementById('userBadge');
            badge.textContent = name;
            badge.className = 'admin-tag role-user';
            badge.style.display = 'inline-block';
            listStorageFiles();
            loadStorageUsage();
            // 管理员判定：邮箱在 admins 表内
            supabase.from('admins').select('email').eq('email', currentUser.email).maybeSingle()
                .then(function (r) {
                    isAdmin = !!(r && !r.error && r.data);
                    var btn = document.getElementById('quotaAdminBtn');
                    if (btn) btn.style.display = isAdmin ? 'inline-block' : 'none';
                })
                .catch(function () { isAdmin = false; });
        });
    }

    init();
})();