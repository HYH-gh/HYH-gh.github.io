/* ============================================================
   Win11-style Navigation Hub — main.js
   ============================================================ */

(function () {
    'use strict';

    // ============================================================
    // 1. Admin credentials
    // ============================================================
    var ADMIN_USER = 'admin';
    var ADMIN_PASS = 'admin888';

    // ============================================================
    // 2. State
    // ============================================================
    var isAdmin = false;
    var navItems = [];
    var logItems = [];
    var currentPathType = 'path';
    var NAV_PATH = 'data/nav.json';
    var LOG_PATH = 'data/log.json';
    var NAV_STORAGE = 'hub_nav_items';
    var LOG_STORAGE = 'hub_log_items';

    // ============================================================
    // 3. Theme
    // ============================================================
    function initTheme() {
        var saved = localStorage.getItem('theme');
        if (saved === 'dark' || saved === 'light') {
            document.documentElement.setAttribute('data-theme', saved);
        }
    }

    window.toggleTheme = function () {
        var current = document.documentElement.getAttribute('data-theme');
        var next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    };

    // ============================================================
    // 4. AJAX helper
    // ============================================================
    function fetchJSON(path, callback) {
        var req = new XMLHttpRequest();
        req.open('GET', path + '?t=' + Date.now(), true);
        req.onload = function () {
            if (req.status >= 200 && req.status < 300) {
                try {
                    var data = JSON.parse(req.responseText);
                    callback(data);
                } catch (e) {
                    console.warn('JSON parse error:', path, e);
                    callback(null);
                }
            } else {
                console.warn('Failed to load:', path, req.status);
                callback(null);
            }
        };
        req.onerror = function () {
            console.warn('Request error:', path);
            callback(null);
        };
        req.send();
    }

    // ============================================================
    // 5. Data - load nav & logs (localStorage 优先，JSON 文件为初始默认)
    // ============================================================
    function loadNavItems() {
        var stored = localStorage.getItem(NAV_STORAGE);
        if (stored) {
            try {
                navItems = JSON.parse(stored);
                renderGrid();
                return;
            } catch (e) { /* 损坏则走 JSON 加载 */ }
        }
        fetchJSON(NAV_PATH, function (data) {
            navItems = Array.isArray(data) ? data : [];
            saveNavToStorage();
            renderGrid();
        });
    }

    function loadLogItems() {
        var stored = localStorage.getItem(LOG_STORAGE);
        if (stored) {
            try {
                logItems = JSON.parse(stored);
                renderLogList();
                return;
            } catch (e) { /* 损坏则走 JSON 加载 */ }
        }
        fetchJSON(LOG_PATH, function (data) {
            logItems = Array.isArray(data) ? data : [];
            saveLogToStorage();
            renderLogList();
        });
    }

    function saveNavToStorage() {
        localStorage.setItem(NAV_STORAGE, JSON.stringify(navItems));
    }

    function saveLogToStorage() {
        localStorage.setItem(LOG_STORAGE, JSON.stringify(logItems));
    }

    // ============================================================
    // 6. Default SVG icon for cards
    // ============================================================
    function cardIconSVG() {
        return '<svg viewBox="0 0 24 24" width="22" height="22">' +
            '<rect x="4" y="2" width="16" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/>' +
            '<line x1="8" y1="7" x2="16" y2="7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>' +
            '<line x1="8" y1="11" x2="16" y2="11" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>' +
            '<line x1="8" y1="15" x2="12" y2="15" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>' +
        '</svg>';
    }

    function urlIconSVG() {
        return '<svg viewBox="0 0 24 24" width="22" height="22">' +
            '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
            '<line x1="15" y1="3" x2="21" y2="3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
            '<line x1="21" y1="3" x2="21" y2="9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
            '<line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
        '</svg>';
    }

    // ============================================================
    // 7. Render grid
    // ============================================================
    function renderGrid() {
        var grid = document.getElementById('navGrid');
        if (!navItems.length) {
            grid.innerHTML = '<div class="nav-empty">' +
                '<svg viewBox="0 0 24 24" width="36" height="36" style="color:var(--text-tertiary)"><rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' +
                '<span>暂无导航项，管理员登录后可添加</span>' +
                '</div>';
            return;
        }

        var html = '';
        for (var i = 0; i < navItems.length; i++) {
            var item = navItems[i];
            var isUrl = item.type === 'url';
            var iconHtml = isUrl ? urlIconSVG() : (item.icon || cardIconSVG());
            var badgeHtml = isUrl
                ? '<span class="card-badge card-badge-url">URL</span>'
                : '<span class="card-badge card-badge-path">PATH</span>';

            html += '<div class="card" onclick="window.NavHub.navigate(\'' + escapeAttr(item.path) + '\', ' + isUrl + ')">';
            if (isAdmin) {
                html += '<div class="card-actions">' +
                    '<button class="mini-btn mini-btn-edit" onclick="event.stopPropagation();window.NavHub.openEdit(' + i + ')">编辑</button>' +
                    '<button class="mini-btn mini-btn-del" onclick="event.stopPropagation();window.NavHub.deleteItem(' + i + ')">删除</button>' +
                '</div>';
            }
            html += '<div class="card-icon">' + iconHtml + '</div>';
            html += '<div class="card-body">' +
                '<div style="display:flex;align-items:center;gap:8px">' +
                    '<div class="card-title">' + escHtml(item.name) + '</div>' +
                    badgeHtml +
                '</div>' +
                '<div class="card-path">' + escHtml(item.path) + '</div>' +
            '</div>';
            html += '<div class="card-arrow">' +
                (isUrl
                    ? '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="15" y1="3" x2="21" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="21" y1="3" x2="21" y2="9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
                    : '<svg viewBox="0 0 24 24" width="18" height="18"><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="5" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="19" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
                ) +
            '</div>';
            html += '</div>';
        }
        grid.innerHTML = html;
    }

    function escHtml(s) {
        var d = document.createElement('div');
        d.textContent = s;
        return d.innerHTML;
    }

    function escapeAttr(s) {
        return s.replace(/'/g, "\\'").replace(/"/g, '&quot;');
    }

    // ============================================================
    // 8. Navigation
    // ============================================================
    function navigate(path, isUrl) {
        if (!path) return;
        if (isUrl || path.indexOf('http://') === 0 || path.indexOf('https://') === 0) {
            window.open(path, '_blank', 'noopener');
        } else {
            window.location.href = path;
        }
    }

    // ============================================================
    // 9. Path type segmented toggle
    // ============================================================
    window.setPathType = function (type) {
        currentPathType = type;
        var seg = document.getElementById('pathTypeSeg');
        var btns = seg.querySelectorAll('.toggle-seg-btn');
        for (var i = 0; i < btns.length; i++) {
            var btn = btns[i];
            if (btn.getAttribute('data-type') === type) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        }
        var pathInput = document.getElementById('itemPath');
        if (type === 'url') {
            pathInput.placeholder = '例如：https://example.com';
        } else {
            pathInput.placeholder = '例如：poetry/index.html';
        }
    };

    // ============================================================
    // 10. Admin Login / Logout
    // ============================================================
    function toggleLogin() {
        if (isAdmin) {
            openModal('adminModal');
            renderAdminList();
        } else {
            openModal('loginModal');
            setTimeout(function () {
                var el = document.getElementById('loginUser');
                if (el) el.focus();
            }, 150);
        }
    }

    function doLogin() {
        var user = document.getElementById('loginUser').value.trim();
        var pass = document.getElementById('loginPass').value.trim();
        if (user === ADMIN_USER && pass === ADMIN_PASS) {
            isAdmin = true;
            closeModal('loginModal');
            document.getElementById('loginUser').value = '';
            document.getElementById('loginPass').value = '';
            document.getElementById('adminBadge').style.display = 'inline';
            document.getElementById('adminBtn').textContent = '管理导航';
            renderGrid();
            showToast('登录成功', 'success');
            openModal('adminModal');
            renderAdminList();
        } else {
            showToast('账号或密码错误', 'error');
        }
    }

    function doLogout() {
        isAdmin = false;
        closeModal('adminModal');
        closeModal('logModal');
        closeModal('logEditModal');
        document.getElementById('adminBadge').style.display = 'none';
        document.getElementById('adminBtn').textContent = '管理员登录';
        renderGrid();
        showToast('已退出管理', 'info');
    }

    // ============================================================
    // 11. Admin list
    // ============================================================
    function renderAdminList() {
        var container = document.getElementById('adminList');
        if (!navItems.length) {
            container.innerHTML = '<div style="text-align:center;padding:32px 0;color:var(--text-tertiary);">暂无导航项</div>';
            return;
        }
        var html = '';
        for (var i = 0; i < navItems.length; i++) {
            var item = navItems[i];
            var typeLabel = item.type === 'url' ? 'URL' : 'PATH';
            var typeClass = item.type === 'url' ? 'card-badge-url' : 'card-badge-path';
            html += '<div class="admin-item">' +
                '<div class="admin-item-info">' +
                    '<div style="display:flex;align-items:center;gap:6px">' +
                        '<div class="admin-item-name">' + escHtml(item.name) + '</div>' +
                        '<span class="card-badge ' + typeClass + '" style="font-size:9px;padding:1px 5px">' + typeLabel + '</span>' +
                    '</div>' +
                    '<div class="admin-item-path">' + escHtml(item.path) + '</div>' +
                '</div>' +
                '<div class="admin-item-actions">' +
                    '<button class="btn btn-sm btn-secondary" onclick="window.NavHub.openEdit(' + i + ')">编辑</button>' +
                    '<button class="btn btn-sm btn-danger" onclick="window.NavHub.deleteItem(' + i + ')">删除</button>' +
                '</div>' +
            '</div>';
        }
        container.innerHTML = html;
    }

    // ============================================================
    // 12. Nav CRUD
    // ============================================================
    function openAddModal() {
        document.getElementById('itemModalTitle').textContent = '添加导航项';
        document.getElementById('itemName').value = '';
        document.getElementById('itemPath').value = '';
        document.getElementById('editIndex').value = '-1';
        document.getElementById('itemSaveBtn').textContent = '添加';
        window.setPathType('path');
        openModal('itemModal');
        setTimeout(function () {
            var el = document.getElementById('itemName');
            if (el) el.focus();
        }, 150);
    }

    function openEdit(index) {
        var item = navItems[index];
        if (!item) return;
        document.getElementById('itemModalTitle').textContent = '编辑导航项';
        document.getElementById('itemName').value = item.name || '';
        document.getElementById('itemPath').value = item.path || '';
        document.getElementById('editIndex').value = index;
        document.getElementById('itemSaveBtn').textContent = '保存';
        window.setPathType(item.type === 'url' ? 'url' : 'path');
        openModal('itemModal');
        setTimeout(function () {
            var el = document.getElementById('itemName');
            if (el) el.focus();
        }, 150);
    }

    function saveItem() {
        var name = document.getElementById('itemName').value.trim();
        var path = document.getElementById('itemPath').value.trim();
        if (!name) { showToast('请输入名称', 'error'); return; }
        if (!path) { showToast('请输入路径', 'error'); return; }

        var editIndex = parseInt(document.getElementById('editIndex').value, 10);
        var newItem = { name: name, path: path, type: currentPathType };

        if (editIndex === -1) {
            navItems.push(newItem);
            showToast('添加成功', 'success');
        } else {
            navItems[editIndex] = newItem;
            showToast('修改成功', 'success');
        }

        closeModal('itemModal');
        saveNavToStorage();
        renderGrid();
        renderAdminList();
    }

    function deleteItem(index) {
        if (index < 0 || index >= navItems.length) return;
        var name = navItems[index].name;
        if (!confirm('确定删除「' + name + '」吗？此操作不可撤销。')) return;
        navItems.splice(index, 1);
        saveNavToStorage();
        renderGrid();
        renderAdminList();
        showToast('已删除「' + name + '」', 'info');
    }

    // ============================================================
    // 13. Export / Import Nav Config
    // ============================================================
    function exportConfig() {
        downloadJSON(navItems, 'nav.json', 'nav.json 已下载，请手动替换 data/nav.json 后提交 Git');
    }

    function triggerImport() {
        document.getElementById('importInput').click();
    }

    function importConfig(e) {
        handleImportJSON(e, function (data) {
            navItems = data;
            saveNavToStorage();
            renderGrid();
            renderAdminList();
            showToast('导入成功', 'success');
        });
    }

    // ============================================================
    // 14. Generic JSON download / import helpers
    // ============================================================
    function downloadJSON(data, filename, msg) {
        var json = JSON.stringify(data, null, 2);
        var blob = new Blob([json], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast(msg, 'success');
    }

    function handleImportJSON(e, callback) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (ev) {
            try {
                var data = JSON.parse(ev.target.result);
                if (!Array.isArray(data)) throw new Error('格式错误：需要 JSON 数组');
                callback(data);
            } catch (err) {
                showToast('导入失败：' + err.message, 'error');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    // ============================================================
    // 15. Log Management
    // ============================================================
    function openLogModal() {
        loadLogItems();
        openModal('logModal');
    }

    function renderLogList() {
        var container = document.getElementById('logList');
        if (!logItems.length) {
            container.innerHTML = '<div style="text-align:center;padding:32px 0;color:var(--text-tertiary);">暂无日志</div>';
            return;
        }
        var html = '';
        for (var i = 0; i < logItems.length; i++) {
            var log = logItems[i];
            var preview = log.content || '';
            if (preview.length > 60) preview = preview.substring(0, 60) + '...';
            html += '<div class="log-entry">' +
                '<div class="log-entry-info" onclick="window.NavHub.openLogEdit(' + i + ')">' +
                    '<div class="log-entry-title">' + escHtml(log.title || '(无标题)') + '</div>' +
                    '<div class="log-entry-meta">' +
                        '<span class="log-entry-time">' + escHtml(log.time || '') + '</span>' +
                    '</div>' +
                    (log.content ? '<div class="log-entry-preview">' + escHtml(preview) + '</div>' : '') +
                '</div>' +
                '<div class="log-entry-actions">' +
                    '<button class="btn btn-sm btn-secondary" onclick="event.stopPropagation();window.NavHub.openLogEdit(' + i + ')">编辑</button>' +
                    '<button class="btn btn-sm btn-danger" onclick="event.stopPropagation();window.NavHub.deleteLog(' + i + ')">删除</button>' +
                '</div>' +
            '</div>';
        }
        container.innerHTML = html;
    }

    function openLogEdit(index) {
        if (index === -1) {
            document.getElementById('logEditTitle').textContent = '添加日志';
            document.getElementById('logTitle').value = '';
            document.getElementById('logContent').value = '';
            document.getElementById('logEditIndex').value = '-1';
        } else {
            var log = logItems[index];
            if (!log) return;
            document.getElementById('logEditTitle').textContent = '编辑日志';
            document.getElementById('logTitle').value = log.title || '';
            document.getElementById('logContent').value = log.content || '';
            document.getElementById('logEditIndex').value = index;
        }
        openModal('logEditModal');
        setTimeout(function () {
            var el = document.getElementById('logTitle');
            if (el) el.focus();
        }, 150);
    }

    function saveLog() {
        var title = document.getElementById('logTitle').value.trim();
        var content = document.getElementById('logContent').value.trim();
        if (!title && !content) { showToast('请至少填写标题或内容', 'error'); return; }

        var editIndex = parseInt(document.getElementById('logEditIndex').value, 10);
        var now = new Date();
        var timeStr = now.getFullYear() + '-' +
            pad(now.getMonth() + 1) + '-' +
            pad(now.getDate()) + ' ' +
            pad(now.getHours()) + ':' +
            pad(now.getMinutes());
        var newLog = { id: Date.now(), time: timeStr, title: title, content: content };

        if (editIndex === -1) {
            logItems.push(newLog);
            showToast('日志已添加', 'success');
        } else {
            newLog.id = logItems[editIndex].id;
            newLog.time = logItems[editIndex].time;
            logItems[editIndex] = newLog;
            showToast('日志已更新', 'success');
        }

        closeModal('logEditModal');
        saveLogToStorage();
        renderLogList();
    }

    function deleteLog(index) {
        if (index < 0 || index >= logItems.length) return;
        var title = logItems[index].title || '(无标题)';
        if (!confirm('确定删除日志「' + title + '」吗？此操作不可撤销。')) return;
        logItems.splice(index, 1);
        saveLogToStorage();
        renderLogList();
        showToast('已删除日志', 'info');
    }

    function exportLog() {
        downloadJSON(logItems, 'log.json', 'log.json 已下载，请手动替换 data/log.json 后提交 Git');
    }

    function triggerLogImport() {
        document.getElementById('logImportInput').click();
    }

    function importLogConfig(e) {
        handleImportJSON(e, function (data) {
            logItems = data;
            saveLogToStorage();
            renderLogList();
            showToast('日志导入成功', 'success');
        });
    }

    function pad(n) {
        return n < 10 ? '0' + n : '' + n;
    }

    // ============================================================
    // 16. Modal helpers
    // ============================================================
    function openModal(id) {
        document.getElementById(id).classList.add('active');
    }

    function closeModal(id) {
        document.getElementById(id).classList.remove('active');
    }

    function bindModals() {
        var overlays = document.querySelectorAll('.modal-overlay');
        for (var i = 0; i < overlays.length; i++) {
            overlays[i].addEventListener('click', function (e) {
                if (e.target === this) {
                    this.classList.remove('active');
                }
            });
        }
    }

    // ============================================================
    // 17. Toast
    // ============================================================
    function showToast(msg, type) {
        var container = document.getElementById('toastContainer');
        var el = document.createElement('div');
        el.className = 'toast toast-' + (type || 'info');
        el.textContent = msg;
        container.appendChild(el);
        setTimeout(function () {
            el.style.opacity = '0';
            el.style.transition = 'opacity 0.3s ease';
            setTimeout(function () {
                if (el.parentNode) el.parentNode.removeChild(el);
            }, 300);
        }, 2500);
    }

    // ============================================================
    // 18. Expose public API
    // ============================================================
    window.NavHub = {
        navigate: navigate,
        openEdit: openEdit,
        deleteItem: deleteItem,
        openLogEdit: openLogEdit,
        deleteLog: deleteLog
    };

    // Expose for inline onclick
    window.toggleLogin = toggleLogin;
    window.doLogin = doLogin;
    window.doLogout = doLogout;
    window.openAddModal = openAddModal;
    window.saveItem = saveItem;
    window.exportConfig = exportConfig;
    window.triggerImport = triggerImport;
    window.importConfig = importConfig;
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.setPathType = window.setPathType;
    window.openLogModal = openLogModal;
    window.saveLog = saveLog;
    window.exportLog = exportLog;
    window.triggerLogImport = triggerLogImport;
    window.importLogConfig = importLogConfig;
    window.openLogEdit = openLogEdit;    // 添加日志按钮直接调用

    // ============================================================
    // 19. Init
    // ============================================================
    initTheme();
    bindModals();
    loadNavItems();
})();