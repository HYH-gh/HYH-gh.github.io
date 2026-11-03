/* =========================================================
   dom.js —— 极简 DOM 构建辅助
   用函数式写法代替模板编译，避免引入任何框架
   ========================================================= */
(function (global) {
  'use strict'

  const W = (global.W = global.W || {})

  // 把数组 / 单个节点 / 文本追加到父节点
  function append(parent, children) {
    const list = Array.isArray(children) ? children : [children]
    for (const child of list) {
      if (child === null || child === undefined || child === false) continue
      parent.appendChild(child.nodeType ? child : document.createTextNode(String(child)))
    }
    return parent
  }

  /**
   * h('div', { class, text, html, attrs, on, style, hidden }, children)
   *  - class  : className
   *  - text   : textContent
   *  - html   : innerHTML（仅用于已转义的内容）
   *  - attrs  : 属性表，值为 false/null/undefined 时跳过，true 时写成空属性
   *  - on     : 事件表，如 { click: fn }
   *  - style  : 样式表，键写 CSS 属性名（支持 --custom-prop）
   */
  function h(tag, opts, children) {
    const node = document.createElement(tag)
    if (opts) {
      if (opts.class) node.className = opts.class
      if (opts.text !== undefined && opts.text !== null) node.textContent = opts.text
      if (opts.html !== undefined && opts.html !== null) node.innerHTML = opts.html
      if (opts.attrs) {
        for (const name in opts.attrs) {
          const value = opts.attrs[name]
          if (value === null || value === undefined || value === false) continue
          node.setAttribute(name, value === true ? '' : value)
        }
      }
      if (opts.style) {
        for (const prop in opts.style) node.style.setProperty(prop, opts.style[prop])
      }
      if (opts.on) {
        for (const type in opts.on) node.addEventListener(type, opts.on[type])
      }
      if (opts.hidden !== undefined) node.hidden = !!opts.hidden
    }
    if (children !== undefined) append(node, children)
    return node
  }

  // 清空子节点
  function clear(node) {
    node.replaceChildren()
    return node
  }

  W.dom = { h: h, append: append, clear: clear }
})(window)
