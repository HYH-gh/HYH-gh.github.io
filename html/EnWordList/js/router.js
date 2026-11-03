/* =========================================================
   router.js —— 基于 hash 的极简路由
   任意静态托管（甚至本地文件服务器）都无需服务端改写规则
   ========================================================= */
(function (global) {
  'use strict'

  const W = (global.W = global.W || {})

  let mountEl = null
  let cleanup = null
  let onChange = null
  let lastHash = null
  // 应用内前进次数：为 0 时“返回”回到首页，避免直接打开详情页后按钮失灵
  let forwardCount = 0

  function segments() {
    let raw = global.location.hash.replace(/^#/, '')
    if (!raw) raw = '/'
    const parts = raw.split('/').filter(Boolean)
    return parts.map(function (p) {
      try {
        return decodeURIComponent(p)
      } catch (e) {
        return p
      }
    })
  }

  function resolve(parts) {
    if (parts.length === 0) return { name: 'home', params: {} }
    const head = parts[0]
    const second = parts[1]
    if (head === 'settings' && parts.length === 1) return { name: 'settings', params: {} }
    if (head === 'level' && second) return { name: 'level', params: { key: second } }
    if (head === 'word' && second) return { name: 'word', params: { word: second } }
    if (head === 'custom' && second) return { name: 'custom', params: { id: second } }
    return { name: 'home', params: {} }
  }

  function render() {
    if (!mountEl) return
    if (cleanup) {
      try {
        cleanup()
      } catch (e) {
        /* 忽略子页清理异常 */
      }
      cleanup = null
    }
    const route = resolve(segments())
    mountEl.replaceChildren()
    const view = W.views[route.name]
    cleanup = (view && view(mountEl, route.params)) || null
    global.scrollTo(0, 0)
    if (onChange) onChange(route)
  }

  function push(path) {
    const hash = '#' + (path.charAt(0) === '/' ? path : '/' + path)
    if (global.location.hash === hash) return
    forwardCount += 1
    global.location.hash = hash
  }

  function back() {
    if (forwardCount > 0) {
      forwardCount -= 1
      global.history.back()
      return
    }
    push('/')
  }

  function start(el, options) {
    mountEl = el
    onChange = (options && options.onChange) || null
    global.addEventListener('hashchange', function () {
      if (global.location.hash === lastHash) return
      lastHash = global.location.hash
      render()
    })
    if (!global.location.hash) global.location.hash = '#/'
    lastHash = global.location.hash
    render()
  }

  W.router = {
    start: start,
    push: push,
    back: back,
    current: function () {
      return resolve(segments())
    },
  }
})(window)
