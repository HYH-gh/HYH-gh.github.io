/* ============================================================
   Win11-style Navigation Hub — main.js
   ============================================================ */

(function () {
    'use strict';

    // ============================================================
    // 1. State
    // ============================================================
    var isAdmin = false;
    var navItems = [];
    var logItems = [];
    var currentPathType = 'path';
    var LOG_STORAGE = 'hub_log_items';

    // ============================================================
    // 2b. Supabase 配置（连接动态数据库）
    // ============================================================
    var SUPABASE_URL = 'https://gxpnjnnhzicmdlcnweve.supabase.co';
    var SUPABASE_KEY = 'sb_publishable_UYsnk3V791ZgZzPBn-mL-w_v7mRAmbC';
    var NAV_TABLE = 'nav_items';
    var ADMINS_TABLE = 'admins';
    var loginMode = 'login';
    var currentUser = null;   // null=游客 | { email, role:'admin'|'user' }
    var supabase = (typeof window.supabase !== 'undefined')
        ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
        : null;

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
    // 3. Data — 从 Supabase 加载导航（日志为浏览器本地缓存）
    // ============================================================
    function loadNavItems() {
        if (!supabase) { renderGrid(); return; }
        supabase.from(NAV_TABLE)
            .select('*')
            .order('sort', { ascending: true })
            .then(function (res) {
                if (res.error) {
                    console.warn('Supabase 读取失败:', res.error);
                    renderGrid();
                    return;
                }
                navItems = Array.isArray(res.data) ? res.data : [];
                renderGrid();
            })
            .catch(function (e) { console.warn('Supabase 请求异常:', e); renderGrid(); });
    }

    function loadLogItems() {
        var stored = localStorage.getItem(LOG_STORAGE);
        if (stored) {
            try {
                logItems = JSON.parse(stored);
                renderLogList();
                return;
            } catch (e) {
                logItems = [];
                renderLogList();
            }
        } else {
            logItems = [];
            renderLogList();
        }
    }

    function saveLogToStorage() {
        localStorage.setItem(LOG_STORAGE, JSON.stringify(logItems));
    }

    // ============================================================
    // 7. Default SVG icon for cards
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
    // 8. Render grid
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
    // 9. Navigation
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
    // 10. Path type segmented toggle
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
    // 11. Auth: Login / Register / Logout
    // ============================================================
    function openAdminPanel() {
        if (!isAdmin) return;
        openModal('adminModal');
        renderAdminList();
    }

    function toggleLogin() {
        if (currentUser) {
            if (isAdmin) {
                openAdminPanel();
            } else {
                doLogout();
            }
        } else {
            switchLoginMode('login');
            openModal('loginModal');
            setTimeout(function () {
                var el = document.getElementById('loginUser');
                if (el) el.focus();
            }, 150);
        }
    }

    window.switchLoginMode = function () {
        var next = document.getElementById('loginMode').value === 'login' ? 'register' : 'login';
        switchLoginMode(next);
    };

    function switchLoginMode(mode) {
        loginMode = mode;
        var title = document.getElementById('loginTitle');
        var nameGroup = document.getElementById('loginNameGroup');
        var pass2Group = document.getElementById('loginPass2Group');
        var actionBtn = document.getElementById('loginActionBtn');
        var switchLink = document.getElementById('loginSwitchLink');
        var modeInput = document.getElementById('loginMode');
        if (mode === 'register') {
            title.textContent = '注册账号';
            nameGroup.style.display = '';
            pass2Group.style.display = '';
            actionBtn.textContent = '注册';
            switchLink.textContent = '已有账号？去登录';
            modeInput.value = 'register';
        } else {
            title.textContent = '登录';
            nameGroup.style.display = 'none';
            pass2Group.style.display = 'none';
            actionBtn.textContent = '登录';
            switchLink.textContent = '没有账号？去注册';
            modeInput.value = 'login';
        }
    }

    window.dispatchAuthAction = function () {
        if (loginMode === 'register') doRegister(); else doLogin();
    };

    function doLogin() {
        var email = document.getElementById('loginUser').value.trim();
        var pass = document.getElementById('loginPass').value;
        if (!email || !pass) { showToast('请输入邮箱和密码', 'error'); return; }
        if (!supabase) { showToast('Supabase 未连接', 'error'); return; }
        supabase.auth.signInWithPassword({ email: email, password: pass })
            .then(function (res) {
                if (res.error) { showToast('登录失败：' + res.error.message, 'error'); return; }
                return resolveUser(res.data.user);
            })
            .then(function () { finishLogin(); })
            .catch(function (e) { showToast('登录异常：' + (e.message || e), 'error'); });
    }

    function doRegister() {
        var email = document.getElementById('loginUser').value.trim();
        var pass = document.getElementById('loginPass').value;
        var confirm = document.getElementById('loginPass2').value;
        var username = (document.getElementById('loginName').value || '').trim();
        if (!email || !pass) { showToast('请输入邮箱和密码', 'error'); return; }
        if (pass.length < 6) { showToast('密码至少需 6 位', 'error'); return; }
        if (pass !== confirm) { showToast('两次密码不一致', 'error'); return; }
        if (!supabase) { showToast('Supabase 未连接', 'error'); return; }
        supabase.auth.signUp({
                email: email,
                password: pass,
                options: { data: { username: username } }
            })
            .then(function (res) {
                if (res.error) { showToast('注册失败：' + res.error.message, 'error'); return; }
                if (res.data.session) {
                    return resolveUser(res.data.session.user).then(function () { finishLogin(); });
                }
                closeModal('loginModal');
                showToast('注册成功，请到邮箱确认后登录', 'success');
            })
            .catch(function (e) { showToast('注册异常：' + (e.message || e), 'error'); });
    }

    function resolveUser(user) {
        if (!user) { currentUser = null; isAdmin = false; return Promise.resolve(); }
        var email = user.email;
        var name = (user.user_metadata && user.user_metadata.username) ? user.user_metadata.username : email;
        currentUser = { id: user.id, email: email, name: name, role: 'user' };
        if (!supabase) { isAdmin = false; return Promise.resolve(); }
        return supabase.from(ADMINS_TABLE)
            .select('email')
            .eq('email', email)
            .maybeSingle()
            .then(function (res) {
                var admin = res && !res.error && res.data;
                currentUser.role = admin ? 'admin' : 'user';
                isAdmin = !!admin;
            })
            .catch(function () { isAdmin = false; });
    }

    function finishLogin() {
        document.getElementById('loginUser').value = '';
        document.getElementById('loginPass').value = '';
        if (document.getElementById('loginPass2')) document.getElementById('loginPass2').value = '';
        if (document.getElementById('loginName')) document.getElementById('loginName').value = '';
        closeModal('loginModal');
        var who = (currentUser && currentUser.name) ? currentUser.name : '';
        if (isAdmin) {
            showToast('管理员 ' + who + ' 登录成功', 'success');
        } else {
            showToast('登录成功，欢迎 ' + who, 'success');
        }
        updateAuthUI();
        renderGrid();
        if (isAdmin) {
            openAdminPanel();
        }
    }

    function doLogout() {
        if (supabase) {
            supabase.auth.signOut().catch(function () {});
        }
        isAdmin = false;
        currentUser = null;
        loginMode = 'login';
        closeModal('adminModal');
        closeModal('logModal');
        closeModal('logEditModal');
        updateAuthUI();
        renderGrid();
        showToast('已退出登录', 'info');
    }

    function updateAuthUI() {
        var badge = document.getElementById('adminBadge');
        var btn = document.getElementById('adminBtn');
        var profileBtn = document.getElementById('profileBtn');
        var storageBtn = document.getElementById('storageBtn');
        if (!currentUser) {
            badge.style.display = 'none';
            badge.className = 'admin-tag';
            if (profileBtn) profileBtn.style.display = 'none';
            if (storageBtn) storageBtn.style.display = 'none';
            btn.textContent = '登录 / 注册';
        } else if (isAdmin) {
            badge.style.display = 'inline-block';
            badge.className = 'admin-tag role-admin';
            badge.textContent = '管理员：' + ((currentUser && currentUser.name) ? currentUser.name : '');
            if (profileBtn) profileBtn.style.display = '';
            if (storageBtn) storageBtn.style.display = '';
            btn.textContent = '管理导航';
        } else {
            badge.style.display = 'inline-block';
            badge.className = 'admin-tag role-user';
            badge.textContent = (currentUser && currentUser.name) ? currentUser.name : '用户';
            if (profileBtn) profileBtn.style.display = '';
            if (storageBtn) storageBtn.style.display = '';
            btn.textContent = '退出';
        }
    }

    function initAuth() {
        if (!supabase) return;
        supabase.auth.getSession().then(function (res) {
            if (res.data && res.data.session) {
                resolveUser(res.data.session.user).then(function () {
                    updateAuthUI();
                });
            } else {
                updateAuthUI();
            }
        }).catch(function () { updateAuthUI(); });
    }

    function openProfile() {
        if (!currentUser) return;
        document.getElementById('profileName').value = currentUser.name || '';
        document.getElementById('profileOldPass').value = '';
        document.getElementById('profileNewPass').value = '';
        document.getElementById('profileConfirmPass').value = '';
        openModal('profileModal');
        setTimeout(function () {
            var el = document.getElementById('profileName');
            if (el) el.focus();
        }, 150);
    }

    function saveProfile() {
        if (!currentUser || !supabase) { showToast('请先登录', 'error'); return; }
        var newName = document.getElementById('profileName').value.trim();
        var oldPass = document.getElementById('profileOldPass').value;
        var newPass = document.getElementById('profileNewPass').value;
        var confPass = document.getElementById('profileConfirmPass').value;
        var email = currentUser.email;

        if (newName.length > 30) { showToast('用户名过长', 'error'); return; }
        var passChange = !!(newPass || oldPass || confPass);
        if (passChange) {
            if (!oldPass) { showToast('修改密码需先填写当前密码', 'error'); return; }
            if (newPass.length < 6) { showToast('新密码至少需 6 位', 'error'); return; }
            if (newPass !== confPass) { showToast('两次新密码不一致', 'error'); return; }
        }

        var verify = passChange
            ? supabase.auth.signInWithPassword({ email: email, password: oldPass })
            : Promise.resolve({ error: null });

        verify.then(function (vres) {
            if (vres && vres.error) { throw new Error('当前密码不正确'); }
            var updates = {};
            if (newName && newName !== currentUser.name) { updates.data = { username: newName }; }
            if (newPass) { updates.password = newPass; }
            if (Object.keys(updates).length === 0) {
                showToast('没有需要修改的内容', 'info');
                return Promise.resolve(null);
            }
            return supabase.auth.updateUser(updates);
        }).then(function (res) {
            if (res && res.error) { throw new Error(res.error.message); }
            if (res === null) {
                closeModal('profileModal');
                return;
            }
            return supabase.auth.getUser();
        }).then(function (gres) {
            if (gres && gres.data && gres.data.user) {
                var u = gres.data.user;
                currentUser.name = (u.user_metadata && u.user_metadata.username) || u.email;
                isAdmin = (currentUser.role === 'admin');
            }
            updateAuthUI();
            document.getElementById('profileOldPass').value = '';
            document.getElementById('profileNewPass').value = '';
            document.getElementById('profileConfirmPass').value = '';
            closeModal('profileModal');
            showToast('资料已更新', 'success');
        }).catch(function (e) {
            showToast((e && e.message) ? e.message : '更新失败', 'error');
        });
    }

    // ============================================================
    // 12. Admin list
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
    // 13. Nav CRUD
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

    function reloadNavFromDB() {
        if (!supabase) { renderGrid(); renderAdminList(); return; }
        supabase.from(NAV_TABLE).select('*').order('sort', { ascending: true })
            .then(function (res) {
                if (!res.error && Array.isArray(res.data)) { navItems = res.data; }
                renderGrid();
                renderAdminList();
            })
            .catch(function () { renderGrid(); renderAdminList(); });
    }

    function saveItem() {
        var name = document.getElementById('itemName').value.trim();
        var path = document.getElementById('itemPath').value.trim();
        if (!name) { showToast('请输入名称', 'error'); return; }
        if (!path) { showToast('请输入路径', 'error'); return; }

        var editIndex = parseInt(document.getElementById('editIndex').value, 10);

        // Supabase 不可用时的本地回退
        if (!supabase) {
            var localItem = { name: name, path: path, type: currentPathType };
            if (editIndex === -1) { navItems.push(localItem); showToast('添加成功', 'success'); }
            else { navItems[editIndex] = localItem; showToast('修改成功', 'success'); }
            closeModal('itemModal');
            renderGrid();
            renderAdminList();
            return;
        }

        if (editIndex === -1) {
            var sort = navItems.length || 0;
            supabase.from(NAV_TABLE).insert({ name: name, path: path, type: currentPathType, sort: sort })
                .then(function (res) {
                    if (res.error) { showToast('添加失败：' + res.error.message, 'error'); return; }
                    closeModal('itemModal');
                    showToast('添加成功', 'success');
                    reloadNavFromDB();
                })
                .catch(function (e) { showToast('添加失败：' + (e.message || e), 'error'); });
        } else {
            var item = navItems[editIndex];
            if (!item || item.id === undefined) { showToast('该记录无效，请刷新后重试', 'error'); return; }
            supabase.from(NAV_TABLE).update({ name: name, path: path, type: currentPathType }).eq('id', item.id)
                .then(function (res) {
                    if (res.error) { showToast('修改失败：' + res.error.message, 'error'); return; }
                    closeModal('itemModal');
                    showToast('修改成功', 'success');
                    reloadNavFromDB();
                })
                .catch(function (e) { showToast('修改失败：' + (e.message || e), 'error'); });
        }
    }

    function deleteItem(index) {
        if (index < 0 || index >= navItems.length) return;
        var item = navItems[index];
        var name = item.name;
        if (!confirm('确定删除「' + name + '」吗？此操作不可撤销。')) return;

        if (!supabase || item.id === undefined) {
            navItems.splice(index, 1);
            renderGrid();
            renderAdminList();
            showToast('已删除「' + name + '」', 'info');
            return;
        }
        supabase.from(NAV_TABLE).delete().eq('id', item.id)
            .then(function (res) {
                if (res.error) { showToast('删除失败：' + res.error.message, 'error'); return; }
                showToast('已删除「' + name + '」', 'info');
                reloadNavFromDB();
            })
            .catch(function (e) { showToast('删除失败：' + (e.message || e), 'error'); });
    }

    // ============================================================
    // 14. Export / Import Nav Config
    // ============================================================
    function exportConfig() {
        downloadJSON(navItems, 'nav.json', 'nav.json 已下载，请手动替换 data/nav.json 后提交 Git');
    }

    function triggerImport() {
        document.getElementById('importInput').click();
    }

    function importConfig(e) {
        handleImportJSON(e, function (data) {
            if (!supabase) { showToast('导入失败：未连接数据库', 'error'); return; }
            var rows = data.map(function (it, i) {
                return {
                    name: it.name || '',
                    path: it.path || '',
                    type: (it.type === 'url' ? 'url' : 'path'),
                    sort: (it.sort != null ? it.sort : i)
                };
            });
            if (!rows.length) { showToast('导入内容为空', 'info'); return; }
            supabase.from(NAV_TABLE).insert(rows)
                .then(function (res) {
                    if (res.error) { showToast('导入失败：' + res.error.message, 'error'); return; }
                    showToast('导入成功 ' + rows.length + ' 项', 'success');
                    reloadNavFromDB();
                })
                .catch(function (err) { showToast('导入失败：' + (err.message || err), 'error'); });
        });
    }

    // ============================================================
    // 15. Generic JSON download / import helpers
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
    // 16. Log Management
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
    // 17. Modal helpers
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
    // 18. Toast
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
    // 19. Expose public API
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
    window.openProfile = openProfile;
    window.saveProfile = saveProfile;
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
    // 20. Init
    // ============================================================
    initTheme();
    bindModals();
    initAuth();
    loadNavItems();
})();