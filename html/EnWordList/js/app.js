/* =========================================================
   app.js —— 应用外壳与启动
   ========================================================= */
(function (global) {
  'use strict'

  const W = (global.W = global.W || {})
  const h = W.dom.h

  const appEl = document.getElementById('app')

  /* ---------------- 导航 ---------------- */
  const NAV = [
    { label: '分级', path: '/', match: ['home', 'level', 'word', 'custom'] },
    { label: 'AI 设置', path: '/settings', match: ['settings'] },
  ]

  const nav = h('nav', { class: 'nav' })
  const navLinks = NAV.map(function (item) {
    const link = h('a', { attrs: { href: '#' + item.path }, text: item.label })
    nav.appendChild(link)
    return { item: item, el: link }
  })

  function syncNav(route) {
    for (const link of navLinks) {
      link.el.classList.toggle('active', link.item.match.indexOf(route.name) !== -1)
    }
  }

  /* ---------------- 外壳 ---------------- */
  const brand = h('button', {
    class: 'brand',
    attrs: { type: 'button' },
    text: '📚 分级词库',
    on: {
      click: function () {
        W.router.push('/')
      },
    },
  })

  const main = h('main', { class: 'main' })

  const shell = h('div', { class: 'app' }, [
    h('header', { class: 'header' }, [
      h('div', { class: 'header-inner' }, [brand, nav]),
    ]),
    main,
    h('footer', {
      class: 'footer',
      text: '共 20 个分级 · 数据基于 open-source 词表补全（ECDICT）',
    }),
  ])

  appEl.replaceChildren(shell)
  W.router.start(main, { onChange: syncNav })
})(window)
