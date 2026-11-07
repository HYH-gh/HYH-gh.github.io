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
    var currentCategory = 'internal';
    var LOG_STORAGE = 'hub_log_items';

    var CATEGORIES = ['internal', 'external', 'special'];
    var CATEGORY_NAMES = { internal: '站内工具', external: '外部工具', special: '特殊工具' };

    // ============================================================
    // 1b. Auth 流转状态：防止重复提交 / 并发登录 / 超时悬挂
    // authBusy: null | 'login' | 'register' | 'profile'
    // ============================================================
    var authBusy = null;

    function setAuthBusy(mode) {
        authBusy = mode || null;
        var btn = document.getElementById('loginActionBtn');
        if (btn) {
            btn.disabled = !!authBusy;
            btn.textContent = authBusy === 'login' ? '登录中…'
                : authBusy === 'register' ? '注册中…'
                : '登录';
        }
    }
    function isAuthBusy() { return authBusy !== null; }

    // 把 Supabase 的英文错误翻译成用户可读的中文提示
    function authErrMsg(err) {
        if (!err) return '操作失败，请稍后再试';
        var msg = (typeof err === 'string') ? err : (err.message || String(err));
        if (/Failed to fetch|NetworkError|network|Load failed/i.test(msg))
            return '网络连接失败，请检查网络后重试';
        if (/timeout|aborted/i.test(msg))
            return '请求超时，请检查网络后重试';
        if (/Invalid login credentials/i.test(msg))
            return '邮箱或密码不正确';
        if (/Email not confirmed/i.test(msg))
            return '该邮箱尚未完成验证，请先查收验证邮件；如未收到可在下方重新发送';
        if (/already registered|already exists/i.test(msg))
            return '该邮箱已注册，请直接登录';
        if (/rate limit|too many/i.test(msg))
            return '操作过于频繁，请稍后再试';
        if (/Password should be at least/i.test(msg))
            return '密码至少需要 6 位';
        if (/unable to validate email|invalid format/i.test(msg))
            return '邮箱格式不正确';
        if (/same as the old password/i.test(msg))
            return '新密码不能与当前密码相同';
        return msg;
    }

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
    // 1c. 全局加载指示：顶部进度条 + 引用计数（并发请求叠加）
    // ============================================================
    var loadingCount = 0;
    var loadingMinTimer = null;

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
        var bar = ensureLoadingBar();
        bar.classList.add('active');
    }

    function endLoading() {
        loadingCount = Math.max(0, loadingCount - 1);
        if (loadingCount === 0) {
            var bar = document.getElementById('globalLoadingBar');
            if (bar) bar.classList.remove('active');
            if (loadingMinTimer) { clearTimeout(loadingMinTimer); loadingMinTimer = null; }
        }
    }

    // 给任意 Promise 套上加载指示：开始时显示、结束时隐藏
    function withLoading(promise) {
        startLoading();
        return promise.then(
            function (v) { endLoading(); return v; },
            function (e) { endLoading(); throw e; }
        );
    }

    // ============================================================
    // 3. Data — 从 Supabase 加载导航（日志为浏览器本地缓存）
    // ============================================================
    var GRID_LOADING_HTML = '<div class="nav-loading">' +
        '<div class="nav-loading-spinner"></div>' +
        '<span>正在加载导航…</span>' +
        '</div>';

    function renderGridLoading() {
        // 三个分类区都显示加载占位
        CATEGORIES.forEach(function (cat) {
            var grid = document.getElementById('navGrid' + cat.charAt(0).toUpperCase() + cat.slice(1));
            if (grid) grid.innerHTML = GRID_LOADING_HTML;
        });
    }

    function loadNavItems() {
        renderGridLoading();
        if (!supabase) { navItems = []; renderGrid(); return; }
        startLoading();
        supabase.from(NAV_TABLE)
            .select('*')
            .order('sort', { ascending: true })
            .then(function (res) {
                endLoading();
                if (res.error) {
                    console.warn('Supabase 读取失败:', res.error);
                    navItems = [];
                    renderGrid();
                    showToast('导航数据加载失败：' + authErrMsg(res.error), 'error');
                    return;
                }
                navItems = Array.isArray(res.data) ? res.data : [];
                renderGrid();
            })
            .catch(function (e) {
                endLoading();
                console.warn('Supabase 请求异常:', e);
                navItems = [];
                renderGrid();
                showToast('导航数据加载失败：' + authErrMsg(e), 'error');
            });
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
    // 8. Render grid — 按分类分区渲染
    // ============================================================
    // 分类归一化：数据库无 category 的旧数据按 type 推断
    function itemCategory(item) {
        if (CATEGORIES.indexOf(item.category) !== -1) return item.category;
        return item.type === 'url' ? 'external' : 'internal';
    }

    // 特殊工具的固定卡片（云盘 + 云便签）
    function driveCardHtml() {
        var loggedIn = !!currentUser;
        var desc = loggedIn ? '进入我的云盘' : '登录后可用';
        return '<div class="card card-special" onclick="window.NavHub.openDrive()">' +
            '<div class="card-icon">' + driveIconSVG() + '</div>' +
            '<div class="card-body">' +
                '<div style="display:flex;align-items:center;gap:8px">' +
                    '<div class="card-title">云盘</div>' +
                    '<span class="card-badge card-badge-path">SPECIAL</span>' +
                '</div>' +
                '<div class="card-path">' + desc + '</div>' +
            '</div>' +
            '<div class="card-arrow">' + driveIconSVG() + '</div>' +
        '</div>';
    }

    function notesCardHtml() {
        return '<div class="card card-special" onclick="window.NavHub.openNotes()">' +
            '<div class="card-icon">' + notesIconSVG() + '</div>' +
            '<div class="card-body">' +
                '<div style="display:flex;align-items:center;gap:8px">' +
                    '<div class="card-title">云便签</div>' +
                    '<span class="card-badge card-badge-path">SPECIAL</span>' +
                '</div>' +
                '<div class="card-path">' + (currentUser ? '私密便签 · 公开便签' : '私密需登录 · 公开随便看') + '</div>' +
            '</div>' +
            '<div class="card-arrow">' + notesIconSVG() + '</div>' +
        '</div>';
    }

    function driveIconSVG() {
        return '<svg viewBox="0 0 24 24" width="22" height="22">' +
            '<rect x="2" y="13" width="20" height="8" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/>' +
            '<circle cx="6.5" cy="17" r="1" fill="currentColor"/>' +
            '<path d="M6 13l2.5-6h7L18 13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>' +
        '</svg>';
    }

    function notesIconSVG() {
        return '<svg viewBox="0 0 24 24" width="22" height="22">' +
            '<path d="M4 4h16v13a3 3 0 0 1-3 3H4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>' +
            '<path d="M16 20v-4h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>' +
            '<line x1="8" y1="9" x2="16" y2="9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
            '<line x1="8" y1="13" x2="13" y2="13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
        '</svg>';
    }

    function cardHtml(item, index) {
        var isUrl = item.type === 'url';
        var iconHtml = isUrl ? urlIconSVG() : (item.icon || cardIconSVG());
        var badgeHtml = isUrl
            ? '<span class="card-badge card-badge-url">URL</span>'
            : '<span class="card-badge card-badge-path">PATH</span>';

        var html = '<div class="card" onclick="window.NavHub.navigate(\'' + escapeAttr(item.path) + '\', ' + isUrl + ')">';
        if (isAdmin) {
            html += '<div class="card-actions">' +
                '<button class="mini-btn mini-btn-edit" onclick="event.stopPropagation();window.NavHub.openEdit(' + index + ')">编辑</button>' +
                '<button class="mini-btn mini-btn-del" onclick="event.stopPropagation();window.NavHub.deleteItem(' + index + ')">删除</button>' +
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
        return html;
    }

    function emptyGridHtml(msg) {
        return '<div class="nav-empty">' +
            '<svg viewBox="0 0 24 24" width="36" height="36" style="color:var(--text-tertiary)"><rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' +
            '<span>' + escHtml(msg) + '</span>' +
        '</div>';
    }

    function renderGrid() {
        var loading = document.getElementById('navGridLoading');
        var grouped = { internal: [], external: [], special: [] };
        navItems.forEach(function (item) {
            grouped[itemCategory(item)].push(item);
        });
        // 每个分类内部按 sort 升序
        CATEGORIES.forEach(function (cat) {
            grouped[cat].sort(function (a, b) { return (a.sort || 0) - (b.sort || 0); });
        });

        // 站内工具
        var gInt = document.getElementById('navGridInternal');
        gInt.innerHTML = grouped.internal.length
            ? grouped.internal.map(cardHtml).join('')
            : emptyGridHtml('暂无站内工具，管理员登录后可添加');

        // 外部工具
        var gExt = document.getElementById('navGridExternal');
        gExt.innerHTML = grouped.external.length
            ? grouped.external.map(cardHtml).join('')
            : emptyGridHtml('暂无外部工具，管理员登录后可添加');

        // 特殊工具：云盘 + 云便签固定入口（不再依赖数据库记录）
        document.getElementById('navGridSpecial').innerHTML = driveCardHtml() + notesCardHtml();

        // 首次渲染完成后移除加载占位（一次性）
        if (loading && !loading._removed) {
            loading.style.display = 'none';
            loading._removed = true;
        }
    }

    // 游客点击云盘卡片 → 提示登录；已登录 → 跳转云盘
    window.openDrive = function () {
        if (!currentUser) {
            showToast('云盘需要登录后使用，请先登录或注册', 'info');
            switchLoginMode('login');
            openModal('loginModal');
            setTimeout(function () {
                var el = document.getElementById('loginUser');
                if (el) el.focus();
            }, 150);
            return;
        }
        window.location.href = 'drive.html';
    };

    // 云便签：游客可直接使用公开便签，页面内自行引导登录
    window.openNotes = function () {
        window.location.href = 'notes.html';
    };

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
    // 11b. 登录弹窗内联提示（比 toast 更持久的就地反馈）
    // ============================================================
    function showAuthMsg(msg, type) {
        var el = document.getElementById('loginMsg');
        if (!el) { showToast(msg, type); return; }
        el.textContent = msg;
        el.className = 'auth-inline-msg auth-msg-' + (type || 'info');
        el.style.display = 'block';
    }
    function hideAuthMsg() {
        var el = document.getElementById('loginMsg');
        if (el) { el.style.display = 'none'; el.textContent = ''; el.className = 'auth-inline-msg'; }
    }
    window.clearAuthMsg = hideAuthMsg;   // 输入时清掉旧提示（index.html 已引用）

    function getLoginEmail() { return (document.getElementById('loginUser').value || '').trim(); }
    function getLoginPass() { return document.getElementById('loginPass').value || ''; }

    // ============================================================
    // 11c. 验证邮件重发（60s 冷却）
    // ============================================================
    var resendCooldown = 0;
    var resendTimer = null;
    function startResendCooldown() {
        resendCooldown = 60;
        updateResendLink();
        if (resendTimer) clearInterval(resendTimer);
        resendTimer = setInterval(function () {
            resendCooldown--;
            if (resendCooldown <= 0) { clearInterval(resendTimer); resendTimer = null; resendCooldown = 0; }
            updateResendLink();
        }, 1000);
    }
    function updateResendLink() {
        var link = document.getElementById('resendLink');
        if (!link) return;
        if (resendCooldown > 0) {
            link.textContent = '重新发送验证邮件（' + resendCooldown + 's）';
            link.style.pointerEvents = 'none';
            link.style.opacity = '0.5';
        } else {
            link.textContent = '重新发送验证邮件';
            link.style.pointerEvents = '';
            link.style.opacity = '';
        }
    }
    window.resendConfirmation = function () {
        if (resendCooldown > 0) return;
        if (!supabase) { showAuthMsg('Supabase 未连接', 'error'); return; }
        var email = getLoginEmail();
        if (!email) { showAuthMsg('请先在上方输入注册时使用的邮箱', 'error'); return; }
        supabase.auth.resend({ type: 'signup', email: email })
            .then(function (res) {
                if (res.error) { showAuthMsg('发送失败：' + authErrMsg(res.error), 'error'); return; }
                startResendCooldown();
                showAuthMsg('验证邮件已发送，请查收（注意垃圾邮件箱）', 'success');
            })
            .catch(function (e) { showAuthMsg('发送失败：' + authErrMsg(e), 'error'); });
    };

    // ============================================================
    // 11d. 带超时的请求封装：避免网络异常时按钮永久卡在“登录中…”
    // ============================================================
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
        if (isAuthBusy()) { showToast('正在处理请求，请稍候…', 'info'); return; }
        loginMode = mode;
        hideAuthMsg();
        var resend = document.getElementById('resendLink');
        if (resend) resend.style.display = 'none';
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
        if (isAuthBusy()) { showAuthMsg('正在处理上一次请求，请稍候…', 'info'); return; }
        var email = getLoginEmail();
        var pass = getLoginPass();
        if (!email || !pass) { showAuthMsg('请输入邮箱和密码', 'error'); return; }
        if (!supabase) { showAuthMsg('Supabase 未连接，请刷新页面重试', 'error'); return; }

        setAuthBusy('login');
        hideAuthMsg();

        withTimeout(supabase.auth.signInWithPassword({ email: email, password: pass }), 20000, '登录请求')
            .then(function (res) {
                if (res.error) {
                    var m = authErrMsg(res.error);
                    // 未验证邮箱 → 展示重发入口
                    if (/Email not confirmed/i.test(res.error.message || '')) {
                        showResendLink();
                    }
                    showAuthMsg(m, 'error');
                    setAuthBusy(null);
                    return;
                }
                return resolveUser(res.data.user).then(function () {
                    setAuthBusy(null);
                    finishLogin();
                });
            })
            .catch(function (e) {
                setAuthBusy(null);
                showAuthMsg(authErrMsg(e), 'error');
            });
    }

    function showResendLink() {
        var link = document.getElementById('resendLink');
        if (link) { updateResendLink(); link.style.display = 'block'; }
    }

    function doRegister() {
        if (isAuthBusy()) { showAuthMsg('正在处理上一次请求，请稍候…', 'info'); return; }
        var email = getLoginEmail();
        var pass = getLoginPass();
        var confirm = document.getElementById('loginPass2').value;
        var username = (document.getElementById('loginName').value || '').trim();
        if (!email || !pass) { showAuthMsg('请输入邮箱和密码', 'error'); return; }
        if (pass.length < 6) { showAuthMsg('密码至少需 6 位', 'error'); return; }
        if (pass !== confirm) { showAuthMsg('两次密码不一致', 'error'); return; }
        if (!supabase) { showAuthMsg('Supabase 未连接，请刷新页面重试', 'error'); return; }

        setAuthBusy('register');
        hideAuthMsg();

        withTimeout(supabase.auth.signUp({
                email: email,
                password: pass,
                options: { data: { username: username } }
            }), 20000, '注册请求')
            .then(function (res) {
                if (res.error) {
                    // “已注册”分两种情况：未验证（引导重发验证邮件）或已验证（引导直接登录）
                    var raw = res.error.message || '';
                    if (/already registered|already exists/i.test(raw)) {
                        // 尝试用所填密码验证该账号状态：能登录说明已验证，直接帮其登录
                        return supabase.auth.signInWithPassword({ email: email, password: pass })
                            .then(function (lres) {
                                if (!lres.error) {
                                    return resolveUser(lres.data.user).then(function () {
                                        setAuthBusy(null);
                                        showAuthMsg('该邮箱已注册，已直接为你登录', 'success');
                                        setTimeout(function () { finishLogin(); }, 600);
                                    });
                                }
                                if (/Email not confirmed/i.test(lres.error.message || '')) {
                                    showResendLink();
                                    showAuthMsg('该邮箱已注册但尚未验证，请查收验证邮件，或在下方重新发送', 'error');
                                } else {
                                    showAuthMsg('该邮箱已注册，请直接登录', 'error');
                                }
                                setAuthBusy(null);
                            });
                    }
                    showAuthMsg(authErrMsg(res.error), 'error');
                    setAuthBusy(null);
                    return;
                }
                if (res.data.session) {
                    return resolveUser(res.data.session.user).then(function () {
                        setAuthBusy(null);
                        finishLogin();
                    });
                }
                // 注册成功但需要邮箱验证：不关闭弹窗，明确告知后续步骤
                setAuthBusy(null);
                showResendLink();
                showAuthMsg('注册成功！验证邮件已发送到 ' + email + '，请查收并点击验证链接后登录（注意垃圾邮件箱）', 'success');
            })
            .catch(function (e) {
                setAuthBusy(null);
                showAuthMsg(authErrMsg(e), 'error');
            });
    }

    function resolveUser(user) {
        if (!user) { currentUser = null; isAdmin = false; return Promise.resolve(); }
        var email = user.email;
        var name = (user.user_metadata && user.user_metadata.username) ? user.user_metadata.username : email;
        currentUser = { id: user.id, email: email, name: name, role: 'user' };
        isAdmin = false;   // 先按普通用户处理，查询成功后再提权
        if (!supabase) return Promise.resolve();
        return withTimeout(
            supabase.from(ADMINS_TABLE).select('email').eq('email', email).maybeSingle(),
            10000, '权限查询'
        )
            .then(function (res) {
                if (res && !res.error && res.data) {
                    currentUser.role = 'admin';
                    isAdmin = true;
                }
            })
            .catch(function (e) {
                // 查询失败不阻断登录，按普通用户放行并提示
                console.warn('管理员身份查询失败，按普通用户处理:', e);
                showToast('身份校验暂时不可用，已按普通用户登录', 'info');
            });
    }

    function finishLogin() {
        document.getElementById('loginUser').value = '';
        document.getElementById('loginPass').value = '';
        if (document.getElementById('loginPass2')) document.getElementById('loginPass2').value = '';
        if (document.getElementById('loginName')) document.getElementById('loginName').value = '';
        setAuthBusy(null);
        hideAuthMsg();
        var resend = document.getElementById('resendLink');
        if (resend) resend.style.display = 'none';
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
        if (isAuthBusy()) { showToast('正在处理登录请求，请稍候再退出', 'info'); return; }
        if (supabase) {
            supabase.auth.signOut().catch(function () {
                // 网络原因登出请求失败也无妨：本地状态照常清理
            });
        }
        isAdmin = false;
        currentUser = null;
        loginMode = 'login';
        setAuthBusy(null);
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
        if (!supabase) { updateAuthUI(); return; }
        startLoading();
        supabase.auth.getSession().then(function (res) {
            if (res.data && res.data.session) {
                resolveUser(res.data.session.user).then(function () {
                    endLoading();
                    updateAuthUI();
                });
            } else {
                endLoading();
                updateAuthUI();
            }
        }).catch(function () {
            endLoading();
            updateAuthUI();
        });
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
        if (isAuthBusy()) { showToast('正在处理上一次请求，请稍候…', 'info'); return; }
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
            if (newPass === oldPass) { showToast('新密码不能与当前密码相同', 'error'); return; }
        }

        setAuthBusy('profile');

        var verify = passChange
            ? withTimeout(supabase.auth.signInWithPassword({ email: email, password: oldPass }), 15000, '密码验证')
            : Promise.resolve({ error: null });

        verify.then(function (vres) {
            if (vres && vres.error) { throw new Error('当前密码不正确'); }
            var updates = {};
            if (newName && newName !== currentUser.name) { updates.data = { username: newName }; }
            if (newPass) { updates.password = newPass; }
            if (Object.keys(updates).length === 0) {
                setAuthBusy(null);
                showToast('没有需要修改的内容', 'info');
                return null;
            }
            return withTimeout(supabase.auth.updateUser(updates), 20000, '资料更新');
        }).then(function (res) {
            if (res === null) return;   // 本地提示已发过
            if (res && res.error) { throw new Error(res.error.message); }
            return supabase.auth.getUser().then(function (gres) {
                if (gres && gres.data && gres.data.user) {
                    var u = gres.data.user;
                    currentUser.name = (u.user_metadata && u.user_metadata.username) || u.email;
                }
                setAuthBusy(null);
                updateAuthUI();
                document.getElementById('profileOldPass').value = '';
                document.getElementById('profileNewPass').value = '';
                document.getElementById('profileConfirmPass').value = '';
                closeModal('profileModal');
                showToast('资料已更新', 'success');
            });
        }).catch(function (e) {
            setAuthBusy(null);
            var msg = authErrMsg(e);
            // 改密码导致旧会话失效时引导重新登录
            if (/session|logged in|401/i.test((e && e.message) || '')) {
                msg = '会话已过期，请重新登录后再试';
            }
            showToast(msg, 'error');
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
            var catLabel = CATEGORY_NAMES[itemCategory(item)];
            html += '<div class="admin-item">' +
                '<div class="admin-item-info">' +
                    '<div style="display:flex;align-items:center;gap:6px">' +
                        '<div class="admin-item-name">' + escHtml(item.name) + '</div>' +
                        '<span class="card-badge ' + typeClass + '" style="font-size:9px;padding:1px 5px">' + typeLabel + '</span>' +
                        '<span class="card-badge card-badge-path" style="font-size:9px;padding:1px 5px">' + escHtml(catLabel) + '</span>' +
                    '</div>' +
                    '<div class="admin-item-path">' + escHtml(item.path) + ' · 排序 ' + (item.sort || 0) + '</div>' +
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
    // ============================================================
    // 10b. 分类选择（添加/编辑弹窗中的分段按钮）
    // ============================================================
    window.setCategory = function (cat) {
        if (CATEGORIES.indexOf(cat) === -1) return;
        currentCategory = cat;
        var seg = document.getElementById('categorySeg');
        var btns = seg.querySelectorAll('.toggle-seg-btn');
        for (var i = 0; i < btns.length; i++) {
            var btn = btns[i];
            if (btn.getAttribute('data-cat') === cat) btn.classList.add('active');
            else btn.classList.remove('active');
        }
    };

    function openAddModal() {
        document.getElementById('itemModalTitle').textContent = '添加导航项';
        document.getElementById('itemName').value = '';
        document.getElementById('itemPath').value = '';
        document.getElementById('itemSort').value = '';
        document.getElementById('editIndex').value = '-1';
        document.getElementById('itemSaveBtn').textContent = '添加';
        window.setPathType('path');
        window.setCategory('internal');
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
        document.getElementById('itemSort').value = (item.sort != null) ? item.sort : '';
        document.getElementById('editIndex').value = index;
        document.getElementById('itemSaveBtn').textContent = '保存';
        window.setPathType(item.type === 'url' ? 'url' : 'path');
        window.setCategory(itemCategory(item));
        openModal('itemModal');
        setTimeout(function () {
            var el = document.getElementById('itemName');
            if (el) el.focus();
        }, 150);
    }

    function reloadNavFromDB() {
        if (!supabase) { renderGrid(); renderAdminList(); return; }
        startLoading();
        supabase.from(NAV_TABLE).select('*').order('sort', { ascending: true })
            .then(function (res) {
                endLoading();
                if (!res.error && Array.isArray(res.data)) { navItems = res.data; }
                renderGrid();
                renderAdminList();
            })
            .catch(function () {
                endLoading();
                renderGrid();
                renderAdminList();
                showToast('导航数据刷新失败，请稍后重试', 'error');
            });
    }

    function saveItem() {
        var name = document.getElementById('itemName').value.trim();
        var path = document.getElementById('itemPath').value.trim();
        var sortRaw = document.getElementById('itemSort').value.trim();
        if (!name) { showToast('请输入名称', 'error'); return; }
        if (!path) { showToast('请输入路径', 'error'); return; }
        var sort = (sortRaw === '') ? null : parseInt(sortRaw, 10);
        if (sort !== null && !(sort >= 0)) { showToast('排序值需为非负整数', 'error'); return; }

        var editIndex = parseInt(document.getElementById('editIndex').value, 10);

        // Supabase 不可用时的本地回退
        if (!supabase) {
            var localItem = { name: name, path: path, type: currentPathType, category: currentCategory, sort: sort || 0 };
            if (editIndex === -1) { navItems.push(localItem); showToast('添加成功', 'success'); }
            else { navItems[editIndex] = localItem; showToast('修改成功', 'success'); }
            closeModal('itemModal');
            renderGrid();
            renderAdminList();
            return;
        }

        if (editIndex === -1) {
            var effectiveSort = (sort !== null) ? sort : (navItems.length || 0);
            startLoading();
            supabase.from(NAV_TABLE).insert({ name: name, path: path, type: currentPathType, category: currentCategory, sort: effectiveSort })
                .then(function (res) {
                    endLoading();
                    if (res.error) { showToast('添加失败：' + res.error.message, 'error'); return; }
                    closeModal('itemModal');
                    showToast('添加成功', 'success');
                    reloadNavFromDB();
                })
                .catch(function (e) {
                    endLoading();
                    showToast('添加失败：' + (e.message || e), 'error');
                });
        } else {
            var item = navItems[editIndex];
            if (!item || item.id === undefined) { showToast('该记录无效，请刷新后重试', 'error'); return; }
            var updates = { name: name, path: path, type: currentPathType, category: currentCategory };
            if (sort !== null) updates.sort = sort;
            startLoading();
            supabase.from(NAV_TABLE).update(updates).eq('id', item.id)
                .then(function (res) {
                    endLoading();
                    if (res.error) { showToast('修改失败：' + res.error.message, 'error'); return; }
                    closeModal('itemModal');
                    showToast('修改成功', 'success');
                    reloadNavFromDB();
                })
                .catch(function (e) {
                    endLoading();
                    showToast('修改失败：' + (e.message || e), 'error');
                });
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
        startLoading();
        supabase.from(NAV_TABLE).delete().eq('id', item.id)
            .then(function (res) {
                endLoading();
                if (res.error) { showToast('删除失败：' + res.error.message, 'error'); return; }
                showToast('已删除「' + name + '」', 'info');
                reloadNavFromDB();
            })
            .catch(function (e) {
                endLoading();
                showToast('删除失败：' + (e.message || e), 'error');
            });
    }

    // ============================================================
    // 13b. 导航排序（管理员）
    // ============================================================
    var sortCategory = 'internal';

    window.openSortModal = function () {
        if (!isAdmin) return;
        switchSortCat('internal');
        openModal('sortModal');
    };

    window.switchSortCat = function (cat) {
        if (CATEGORIES.indexOf(cat) === -1) return;
        sortCategory = cat;
        var seg = document.getElementById('sortCatSeg');
        var btns = seg.querySelectorAll('.toggle-seg-btn');
        for (var i = 0; i < btns.length; i++) {
            var btn = btns[i];
            if (btn.getAttribute('data-cat') === cat) btn.classList.add('active');
            else btn.classList.remove('active');
        }
        renderSortList();
    };

    function renderSortList() {
        var container = document.getElementById('sortList');
        var items = navItems
            .filter(function (it) { return itemCategory(it) === sortCategory; })
            .sort(function (a, b) { return (a.sort || 0) - (b.sort || 0); });

        if (!items.length) {
            container.innerHTML = '<div style="text-align:center;padding:32px 0;color:var(--text-tertiary);">该分类暂无导航项</div>';
            return;
        }
        var html = '';
        items.forEach(function (it, idx) {
            var globalIndex = navItems.indexOf(it);
            html += '<div class="sort-item">' +
                '<span class="sort-item-order">' + (idx + 1) + '</span>' +
                '<div class="sort-item-info">' +
                    '<div class="sort-item-name">' + escHtml(it.name) + '</div>' +
                    '<div class="sort-item-path">' + escHtml(it.path) + '</div>' +
                '</div>' +
                '<div class="sort-item-actions">' +
                    '<button class="btn btn-sm btn-secondary" onclick="window.NavHub.moveItem(' + globalIndex + ',-1)"' + (idx === 0 ? ' disabled' : '') + '>↑</button>' +
                    '<button class="btn btn-sm btn-secondary" onclick="window.NavHub.moveItem(' + globalIndex + ',1)"' + (idx === items.length - 1 ? ' disabled' : '') + '>↓</button>' +
                '</div>' +
            '</div>';
        });
        container.innerHTML = html;
    }

    // dir: -1 上移 / 1 下移。交换同分类内相邻两项的 sort 值
    function moveItem(index, dir) {
        if (!isAdmin) return;
        var item = navItems[index];
        if (!item) return;
        var cat = itemCategory(item);
        var siblings = navItems
            .filter(function (it) { return itemCategory(it) === cat; })
            .sort(function (a, b) { return (a.sort || 0) - (b.sort || 0); });
        var pos = siblings.indexOf(item);
        var target = siblings[pos + dir];
        if (!target) return;

        var mySort = (item.sort != null) ? item.sort : pos;
        var otherSort = (target.sort != null) ? target.sort : (pos + dir);
        if (mySort === otherSort) otherSort = mySort + dir;   // 兜底：sort 值撞车时错开

        startLoading();
        supabase.from(NAV_TABLE).update({ sort: otherSort }).eq('id', item.id)
            .then(function (res) {
                if (res.error) throw res.error;
                return supabase.from(NAV_TABLE).update({ sort: mySort }).eq('id', target.id);
            })
            .then(function (res) {
                endLoading();
                if (res.error) { showToast('排序失败：' + res.error.message, 'error'); reloadNavFromDB(); return; }
                item.sort = otherSort;
                target.sort = mySort;
                renderSortList();
                renderGrid();
                renderAdminList();
            })
            .catch(function (e) {
                endLoading();
                showToast('排序失败：' + svcErr(e), 'error');
                reloadNavFromDB();
            });
    }

    // 简易错误提示（main.js 无 svcErrMsg，用简版）
    function svcErr(e) {
        var msg = (e && e.message) ? e.message : String(e || '未知错误');
        if (/Failed to fetch|NetworkError|network/i.test(msg)) return '网络连接失败，请检查网络后重试';
        return msg;
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
                    category: (CATEGORIES.indexOf(it.category) !== -1 ? it.category : (it.type === 'url' ? 'external' : 'internal')),
                    sort: (it.sort != null ? it.sort : i)
                };
            });
            if (!rows.length) { showToast('导入内容为空', 'info'); return; }
            startLoading();
            supabase.from(NAV_TABLE).insert(rows)
                .then(function (res) {
                    endLoading();
                    if (res.error) { showToast('导入失败：' + res.error.message, 'error'); return; }
                    showToast('导入成功 ' + rows.length + ' 项', 'success');
                    reloadNavFromDB();
                })
                .catch(function (err) {
                    endLoading();
                    showToast('导入失败：' + (err.message || err), 'error');
                });
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
        deleteLog: deleteLog,
        moveItem: moveItem,
        openDrive: openDrive,
        openNotes: openNotes
    };

    // Expose for inline onclick
    window.toggleLogin = toggleLogin;
    window.doLogin = doLogin;
    window.doLogout = doLogout;
    window.openProfile = openProfile;
    window.saveProfile = saveProfile;
    window.openAddModal = openAddModal;
    window.saveItem = saveItem;
    window.setCategory = window.setCategory;
    window.openSortModal = openSortModal;
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
    // 初始加载指示由 initAuth() 与 loadNavItems() 各自负责
    // （引用计数保证并发请求全部结束后进度条才消失）
    initTheme();
    bindModals();
    initAuth();
    loadNavItems();
})();