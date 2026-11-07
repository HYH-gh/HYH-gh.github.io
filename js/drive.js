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

    // ---------- 全局加载指示（顶部进度条 + 引用计数） ----------
    var loadingCount = 0;
    function ensureLoadingBar() {
        var bar = document.getElementById('globalLoadingBar');
        if (bar) return bar;
        bar = document.createElement('div');
        bar.id = 'globalLoadingBar';
        bar.className = 'global-loading-bar';
        document.body.appendChild(bar);
        return bar;
    }
    function startLoading() {
        loadingCount++;
        ensureLoadingBar().classList.add('active');
    }
    function endLoading() {
        loadingCount = Math.max(0, loadingCount - 1);
        if (loadingCount === 0) {
            var bar = document.getElementById('globalLoadingBar');
            if (bar) bar.classList.remove('active');
        }
    }

    // ---------- 通用健壮性工具 ----------
    // 带超时的请求封装：避免网络异常时 Promise 永久悬挂
    function withTimeout(promise, ms, label) {
        return new Promise(function (resolve, reject) {
            var done = false;
            var t = setTimeout(function () {
                if (done) return;
                done = true;
                reject(new Error(label + '超时，请检查网络后重试'));
            }, ms || 20000);
            promise.then(function (v) {
                if (done) return; done = true; clearTimeout(t); resolve(v);
            }, function (e) {
                if (done) return; done = true; clearTimeout(t); reject(e);
            });
        });
    }

    // 把 Supabase / 网络错误翻译成用户可读的中文
    function svcErrMsg(err) {
        if (!err) return '操作失败，请稍后再试';
        var msg = (typeof err === 'string') ? err : (err.message || String(err));
        if (/Failed to fetch|NetworkError|network|Load failed/i.test(msg))
            return '网络连接失败，请检查网络后重试';
        if (/timeout|aborted/i.test(msg))
            return '请求超时，请检查网络后重试';
        if (/rate limit|too many/i.test(msg))
            return '操作过于频繁，请稍后再试';
        if (/not found|does not exist|InvalidKey/i.test(msg))
            return '文件或文件夹不存在（可能已被删除或移动），请刷新列表';
        if (/Duplicate|already exists/i.test(msg))
            return '同名文件或文件夹已存在';
        if (/Payload Too Large|exceed/i.test(msg))
            return '文件过大或超出限制';
        if (/Unauthorized|JWT|401|invalid claim/i.test(msg))
            return '登录状态已过期，请重新登录';
        if (/row-level security|permission|forbidden/i.test(msg))
            return '没有执行此操作的权限';
        return msg;
    }

    // 操作互斥：破坏性/复杂操作进行中时禁止并发触发同类操作
    var opBusy = null;   // null | 'upload' | 'rename' | 'delete'
    function isBusy() { return opBusy !== null; }
    function tryBeginOp(name) {
        if (isBusy()) { showToast('正在处理上一个操作，请稍候…', 'info'); return false; }
        opBusy = name;
        return true;
    }
    function endOp() { opBusy = null; }

    // 列表/预览的“过期响应”防护：只接受最新一次请求的结果
    var listToken = 0;
    var previewToken = 0;

    // 登录态过期时统一处理：提示后跳回主页
    var sessionExpired = false;
    function handleSessionExpired() {
        if (sessionExpired) return;
        sessionExpired = true;
        showToast('登录状态已过期，即将返回主页重新登录…', 'error');
        setTimeout(function () { window.location.href = 'index.html'; }, 1500);
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
        if (!currentUser || !supabase) {
            listEl.innerHTML = '<div class="storage-empty">' + (currentUser ? '存储服务不可用' : '未登录') + '</div>';
            return;
        }
        listEl.innerHTML = '<div class="storage-progress">正在加载…</div>';
        loadStorageUsage();

        // 过期响应防护：快速连续切换目录时，只渲染最后一次请求的结果
        var token = ++listToken;

        // 根目录直接枚举用户自己的文件夹（{uid}），而不是桶根，避免暴露用户 id 目录
        var opts = { sortBy: { column: 'name', order: 'asc' } };
        startLoading();
        withTimeout(supabase.storage.from(STORAGE_BUCKET).list(basePath(), opts), 20000, '文件列表加载')
            .then(function (res) {
                endLoading();
                if (token !== listToken) return;   // 已有更新的请求，丢弃本结果
                if (res.error) {
                    var msg = svcErrMsg(res.error);
                    if (/登录状态已过期/.test(msg)) handleSessionExpired();
                    listEl.innerHTML = '<div class="storage-empty">加载失败：' + escapeHtml(msg) + '</div>';
                    showToast('文件列表加载失败：' + msg, 'error');
                    return;
                }
                renderStorageList(res.data || []);
            })
            .catch(function (e) {
                endLoading();
                if (token !== listToken) return;
                var msg = svcErrMsg(e);
                if (/登录状态已过期/.test(msg)) handleSessionExpired();
                listEl.innerHTML = '<div class="storage-empty">加载失败：' + escapeHtml(msg) + '</div>';
                showToast('文件列表加载失败：' + msg, 'error');
            });
    }

    // ---------- 存储用量（依赖后端 RPC：public.get_my_storage_usage） ----------
    function loadStorageUsage() {
        var textEl = document.getElementById('storageUsageText');
        var fillEl = document.getElementById('storageUsageFill');
        if (!currentUser) return;
        startLoading();
        withTimeout(supabase.rpc('get_my_storage_usage'), 15000, '存储用量查询')
            .then(function (res) {
                endLoading();
                if (res.error) { textEl.textContent = '—'; fillEl.style.width = '0%'; return; }
                var used = (res.data && res.data.used_bytes != null) ? Number(res.data.used_bytes) : 0;
                var objCount = (res.data && res.data.objects) ? Number(res.data.objects) : 0;
                // 优先用后端按用户返回的配额，否则用前端默认值兜底；防御非法值
                var quota = (res.data && Number(res.data.quota_bytes) > 0) ? Number(res.data.quota_bytes) : STORAGE_QUOTA;
                var remain = Math.max(0, quota - used);
                var pct = quota ? Math.min(100, (used / quota) * 100) : 0;
                textEl.textContent = '已用 ' + formatBytes(used) + ' · 剩余 ' + formatBytes(remain) + '（' + objCount + ' 个对象）';
                fillEl.style.width = pct.toFixed(1) + '%';
                fillEl.style.background = (pct > 90) ? 'var(--danger, #e5534b)' : 'var(--accent)';
            })
            .catch(function (e) {
                endLoading();
                textEl.textContent = '—';
                fillEl.style.width = '0%';
                console.warn('存储用量查询失败:', e);
            });
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
    var MAX_UPLOAD_SIZE = 50 * 1024 * 1024;   // 单文件上限 50MB（Storage 服务通常另有限制）
    var UPLOAD_CONCURRENCY = 3;               // 并发上传数，避免一次拖几十个文件把浏览器打爆

    // 过滤不合法的文件并给出提示；返回可上传的文件数组
    function pickUploadableFiles(files) {
        var ok = [];
        var rejected = [];
        files.forEach(function (file) {
            var name = file.name;
            if (!isValidName(name)) { rejected.push(name + '（文件名不合法）'); return; }
            if (file.size > MAX_UPLOAD_SIZE) { rejected.push(name + '（超过 ' + formatBytes(MAX_UPLOAD_SIZE) + ' 上限）'); return; }
            ok.push(file);
        });
        if (rejected.length) {
            showToast('已跳过 ' + rejected.length + ' 个文件：' + rejected.slice(0, 3).join('、') + (rejected.length > 3 ? ' 等' : ''), 'error');
        }
        return ok;
    }

    function uploadOne(file, path) {
        return withTimeout(
            supabase.storage.from(STORAGE_BUCKET).upload(path, file, { cacheControl: '3600' }),
            120000, '「' + file.name + '」上传'
        ).then(function (res) {
            if (res.error) throw res.error;
        });
    }

    function uploadStorageFiles(fileList) {
        if (!fileList || !fileList.length) return;
        if (!currentUser || !supabase) { showToast('未登录或存储服务不可用', 'error'); return; }
        if (isBusy()) { showToast('正在处理上一个操作，请稍候…', 'info'); return; }

        var files = pickUploadableFiles(Array.prototype.slice.call(fileList));
        if (!files.length) return;

        // 覆盖保护：与现有文件同名的跳过并提示（避免拖拽时无意覆盖已有文件）
        var existing = {};
        (window.__items || []).forEach(function (it) { if (!it._folder) existing[it._name] = true; });
        var overwrite = files.filter(function (f) { return existing[f.name]; });
        var todo = files.filter(function (f) { return !existing[f.name]; });
        if (overwrite.length) {
            showToast('已跳过同名文件：' + overwrite.slice(0, 3).map(function (f) { return f.name; }).join('、') + (overwrite.length > 3 ? ' 等' : '') + '（如需替换请先删除）', 'error');
        }
        if (!todo.length) return;

        opBusy = 'upload';
        var doneCount = 0, failCount = 0;
        var cursor = 0;

        startLoading();

        // 简单的并发池：最多 UPLOAD_CONCURRENCY 个同时在传
        function next() {
            if (cursor >= todo.length) {
                if (doneCount === todo.length) {
                    endOp();
                    endLoading();
                    if (failCount === 0) showToast('上传完成（' + doneCount + ' 个文件）', 'success');
                    else showToast('上传结束：成功 ' + (doneCount - failCount) + ' 个，失败 ' + failCount + ' 个', 'error');
                    listStorageFiles();
                }
                return;
            }
            var file = todo[cursor++];
            uploadOne(file, childPath(file.name))
                .then(function () { doneCount++; })
                .catch(function (e) {
                    doneCount++; failCount++;
                    showToast('上传失败「' + file.name + '」：' + svcErrMsg(e), 'error');
                })
                .then(next);   // 无论成败继续下一个
        }
        for (var i = 0; i < Math.min(UPLOAD_CONCURRENCY, todo.length); i++) next();
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
        if (isBusy()) { showToast('正在处理上一个操作，请稍候…', 'info'); return; }
        promptName('新建文件夹', '文件夹名称', '', function (name) {
            if (!tryBeginOp('folder')) return;
            startLoading();
            var marker = childPath(name) + '/.gitkeep';
            withTimeout(
                supabase.storage.from(STORAGE_BUCKET).upload(marker, new Blob(['']), { contentType: 'text/plain' }),
                30000, '新建文件夹'
            )
                .then(function (res) {
                    endLoading();
                    endOp();
                    if (res.error) { showToast('新建失败：' + svcErrMsg(res.error), 'error'); return; }
                    showToast('已创建文件夹「' + name + '」', 'success');
                    listStorageFiles();
                })
                .catch(function (e) {
                    endLoading();
                    endOp();
                    showToast('新建失败：' + svcErrMsg(e), 'error');
                });
        });
    };

    // ---------- 重命名 ----------
    // 递归移动一个文件夹内所有子项（用于文件夹重命名）
    // 与单文件 move 兼容，避免 Supabase 对“文件夹整体 move”前缀语义的多端差异
    // 失败时收集已成功/失败数量，供上层提示“部分成功”
    function moveFolderItems(from, to, stats) {
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
                        tasks.push(moveFolderItems(oldChild, newChild, stats));
                    } else {
                        tasks.push(
                            supabase.storage.from(STORAGE_BUCKET).move(oldChild, newChild)
                                .then(function (r) {
                                    if (r.error) throw r.error;
                                    stats.ok++;
                                })
                                .catch(function (e) {
                                    stats.fail++;
                                    stats.errors.push(name + '：' + (e && e.message ? e.message : e));
                                    if (stats.fail > 20) throw new Error('失败项过多，已中止');   // 防雪崩
                                })
                        );
                    }
                });
                return Promise.all(tasks);
            });
    }

    window.renameEntry = function (index) {
        var item = (window.__items || [])[index];
        if (!item) return;
        if (isBusy()) { showToast('正在处理上一个操作，请稍候…', 'info'); return; }
        var oldName = item._name;
        // 文件才剥扩展名：选中起始位置 = 最后一个 . 的下标（排除扩展名）；文件夹则全选
        var selTo = null;
        if (!item._folder) {
            var dot = oldName.lastIndexOf('.');
            if (dot > 0) selTo = dot;
        }
        promptName('重命名', '新名称', oldName, function (newName) {
            if (newName === oldName) return;
            if (!tryBeginOp('rename')) return;

            // 同名冲突预检查（尽力而为；后端仍会兜底）
            var conflict = (window.__items || []).some(function (it) { return it._name === newName; });
            if (conflict) {
                endOp();
                showToast('「' + newName + '」已存在，请换一个名称', 'error');
                return;
            }

            var fromPath = childPath(oldName);
            var toPath = childPath(newName);
            var stats = { ok: 0, fail: 0, errors: [] };

            var task = item._folder
                ? moveFolderItems(fromPath, toPath, stats)
                : supabase.storage.from(STORAGE_BUCKET).move(fromPath, toPath)
                    .then(function (r) { if (r.error) throw r.error; });

            startLoading();
            withTimeout(task, 120000, '重命名')
                .then(function () {
                    endLoading();
                    endOp();
                    showToast('已重命名为「' + newName + '」', 'success');
                    listStorageFiles();
                })
                .catch(function (e) {
                    endLoading();
                    endOp();
                    var msg = svcErrMsg(e);
                    if (stats.fail > 0) {
                        // 文件夹重命名部分成功：明确告知残留情况，建议刷新查看
                        showToast('重命名部分成功：已移动 ' + stats.ok + ' 个，失败 ' + stats.fail + ' 个，请刷新后检查', 'error');
                    } else {
                        showToast('重命名失败：' + msg, 'error');
                    }
                    listStorageFiles();
                });
        }, selTo);
    };

    // ---------- 下载 ----------
    window.downloadFile = function (index) {
        var item = (window.__items || [])[index];
        if (!item || item._folder) return;
        if (!supabase) { showToast('存储服务不可用', 'error'); return; }
        var path = childPath(item._name);
        startLoading();
        // 与预览一致走 download()+Blob，避免 createSignedUrl 的 MIME/CORS 问题
        withTimeout(supabase.storage.from(STORAGE_BUCKET).download(path), 60000, '「' + item._name + '」下载')
            .then(function (res) {
                endLoading();
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
            .catch(function (e) {
                endLoading();
                var msg = svcErrMsg(e);
                if (/登录状态已过期/.test(msg)) handleSessionExpired();
                showToast('下载失败：' + msg, 'error');
            });
    };

    // ---------- 删除 ----------
    window.deleteEntry = function (index) {
        var item = (window.__items || [])[index];
        if (!item) return;
        if (isBusy()) { showToast('正在处理上一个操作，请稍候…', 'info'); return; }
        var hint = item._folder
            ? '文件夹「' + item._name + '」及其内部的全部内容'
            : '文件「' + item._name + '」';
        openAppDialog({
            title: '删除确认',
            message: '确定删除' + hint + '吗？此操作不可撤销。',
            onOk: function () {
                if (!tryBeginOp('delete')) return;
                startLoading();
                // remove 对传入路径做前缀匹配，文件夹直接传 uid/名 即可（不带尾斜杠）
                var paths = [childPath(item._name)];
                withTimeout(supabase.storage.from(STORAGE_BUCKET).remove(paths), 60000, '删除')
                    .then(function (res) {
                        endLoading();
                        endOp();
                        if (res.error) { showToast('删除失败：' + svcErrMsg(res.error), 'error'); return; }
                        showToast('已删除「' + item._name + '」', 'info');
                        listStorageFiles();
                    })
                    .catch(function (e) {
                        endLoading();
                        endOp();
                        showToast('删除失败：' + svcErrMsg(e), 'error');
                    });
            }
        });
    };

    // ---------- 预览 ----------
    window.__previewUrl = null;

    window.previewFile = function (index) {
        var item = (window.__items || [])[index];
        if (!item || item._folder) return;
        if (!supabase) { showToast('存储服务不可用', 'error'); return; }
        var name = item._name;
        var path = childPath(name);
        document.getElementById('driveContainer').classList.add('preview-open');
        document.getElementById('previewTitle').textContent = name;
        var body = document.getElementById('previewBody');
        body.innerHTML = '<div class="storage-progress">正在加载预览…</div>';

        // 过期响应防护：快速切换预览目标时，只渲染最后一次请求
        var token = ++previewToken;
        startLoading();

        function fail(e) {
            endLoading();
            if (token !== previewToken) return;
            var msg = svcErrMsg(e);
            if (/登录状态已过期/.test(msg)) handleSessionExpired();
            body.innerHTML = '<div class="storage-empty">预览失败：' + escapeHtml(msg) + '</div>';
        }

        function finish(blob, render) {
            endLoading();
            if (token !== previewToken) return;   // 已切换到其他文件，丢弃
            render(blob);
        }

        if (isImage(name)) {
            // 与文本预览一致使用 download()，再转成 object URL，绕开 createSignedUrl 的 MIME/CORS 渲染问题
            withTimeout(supabase.storage.from(STORAGE_BUCKET).download(path), 30000, '预览加载')
                .then(function (res) {
                    if (res.error || !res.data) throw (res.error || new Error('无内容'));
                    finish(res.data, function (blob) {
                        if (window.__previewUrl) URL.revokeObjectURL(window.__previewUrl);
                        window.__previewUrl = URL.createObjectURL(blob);
                        body.innerHTML = '<div class="preview-img-wrap"><img class="preview-img" src="' + window.__previewUrl + '" alt="' + escapeHtml(name) + '"></div>';
                    });
                })
                .catch(fail);
        } else if (isText(name)) {
            withTimeout(supabase.storage.from(STORAGE_BUCKET).download(path), 30000, '预览加载')
                .then(function (res) {
                    if (res.error || !res.data) throw (res.error || new Error('无内容'));
                    return res.data.text().then(function (text) {
                        finish(text, function (t) {
                            body.innerHTML = '<pre class="preview-text">' + escapeHtml(t) + '</pre>';
                        });
                    });
                })
                .catch(fail);
        }
    };

    function closePreview() {
        previewToken++;          // 使还在路上的预览响应作废
        if (window.__previewUrl) { URL.revokeObjectURL(window.__previewUrl); window.__previewUrl = null; }
        document.getElementById('driveContainer').classList.remove('preview-open');
        document.getElementById('previewBody').innerHTML = '';
    }
    window.closePreview = closePreview;

    // ---------- 退出 ----------
    window.logout = function () {
        if (isBusy()) { showToast('正在处理操作，请稍候再退出', 'info'); return; }
        if (!supabase) { window.location.href = 'index.html'; return; }
        supabase.auth.signOut()
            .catch(function () { /* 网络失败也照常返回主页 */ })
            .then(function () { window.location.href = 'index.html'; });
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
        list.innerHTML = '<div class="storage-progress">正在加载…</div>';
        startLoading();
        withTimeout(supabase.rpc('get_quota_config'), 15000, '配额配置加载')
            .then(function (res) {
                endLoading();
                if (res.error) {
                    list.innerHTML = '<div class="storage-empty">加载失败：' + escapeHtml(svcErrMsg(res.error)) + '</div>';
                    return;
                }
                var d = res.data || {};
                document.getElementById('quotaDefaultInput').value = d.default_quota_bytes;
                renderQuotaUsers(d.members || [], d.default_quota_bytes);
            })
            .catch(function (e) {
                endLoading();
                list.innerHTML = '<div class="storage-empty">加载失败：' + escapeHtml(svcErrMsg(e)) + '</div>';
            });
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

    // RPC 调用的统一封装：超时 + 加载条 + 错误提示
    function rpc(name, params, okMsg, after) {
        startLoading();
        withTimeout(supabase.rpc(name, params), 15000, '操作')
            .then(function (res) {
                endLoading();
                if (res.error) { showToast('操作失败：' + svcErrMsg(res.error), 'error'); return; }
                showToast(okMsg, 'success');
                if (after) after();
            })
            .catch(function (e) {
                endLoading();
                showToast('操作失败：' + svcErrMsg(e), 'error');
            });
    }

    window.saveDefaultQuota = function () {
        if (!isAdmin) return;
        var bytes = parseInt(document.getElementById('quotaDefaultInput').value, 10);
        if (!(bytes >= 0)) { showToast('请输入有效的字节数（非负整数）', 'error'); return; }
        rpc('set_default_quota', { p_bytes: bytes }, '默认配额已更新', loadStorageUsage);
    };

    window.saveUserQuota = function (email, btn) {
        if (!isAdmin) return;
        var input = btn.closest('.quota-user-row').querySelector('.quota-user-input');
        var bytes = parseInt(input.value, 10);
        if (!(bytes >= 0)) { showToast('请输入有效的字节数（非负整数）', 'error'); return; }
        rpc('set_user_quota', { p_email: email, p_bytes: bytes }, '已为该用户设置配额', loadStorageUsage);
    };

    window.clearUserQuota = function (email) {
        if (!isAdmin) return;
        rpc('clear_user_quota', { p_email: email }, '已恢复默认配额', function () {
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
        startLoading();   // 鉴权+首次列表加载期间显示进度条
        if (!supabase) {
            endLoading();
            document.getElementById('storageList').innerHTML = '<div class="storage-empty">存储服务不可用，请刷新页面重试</div>';
            return;
        }
        withTimeout(supabase.auth.getUser(), 15000, '登录状态获取')
            .then(function (res) {
                if (!res || !res.data || !res.data.user) {
                    endLoading();
                    window.location.href = 'index.html';
                    return;
                }
                var user = res.data.user;
                var name = (user.user_metadata && user.user_metadata.username) ? user.user_metadata.username : user.email;
                currentUser = { id: user.id, email: user.email, name: name };
                var badge = document.getElementById('userBadge');
                badge.textContent = name;
                badge.className = 'admin-tag role-user';
                badge.style.display = 'inline-block';
                listStorageFiles();          // 各自管理自己的加载计数
                loadStorageUsage();
                // 管理员判定：邮箱在 admins 表内（失败按普通用户处理，不阻断）
                withTimeout(
                    supabase.from('admins').select('email').eq('email', currentUser.email).maybeSingle(),
                    10000, '权限查询'
                )
                    .then(function (r) {
                        isAdmin = !!(r && !r.error && r.data);
                    })
                    .catch(function (e) {
                        console.warn('管理员身份查询失败，按普通用户处理:', e);
                        isAdmin = false;
                    })
                    .then(function () {
                        endLoading();
                        var btn = document.getElementById('quotaAdminBtn');
                        if (btn) btn.style.display = isAdmin ? 'inline-block' : 'none';
                    });
            })
            .catch(function (e) {
                // 网络异常导致拿不到用户信息：明确提示而非跳转（避免误伤已登录用户）
                endLoading();
                document.getElementById('storageList').innerHTML =
                    '<div class="storage-empty">加载失败：' + escapeHtml(svcErrMsg(e)) + '<br>' +
                    '<button class="btn btn-secondary" style="margin-top:12px" onclick="window.location.reload()">重新加载</button></div>';
            });
    }

    init();
})();