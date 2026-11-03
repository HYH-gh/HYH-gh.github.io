/* =========================================================
   分级页 —— 展示某个分级的完整词表
   ========================================================= */
(function (global) {
  'use strict'

  const W = (global.W = global.W || {})
  const h = W.dom.h

  W.views = W.views || {}

  W.views.level = function (root, params) {
    const api = W.api
    const key = params.key

    const page = h('div', { class: 'level-page' })
    const title = h('h1', { class: 'title', text: key })

    page.appendChild(
      h('div', { class: 'top' }, [
        h('button', {
          class: 'back',
          attrs: { type: 'button' },
          text: '← 返回',
          on: {
            click: function () {
              W.router.back()
            },
          },
        }),
        title,
      ])
    )

    const spinner = h('div', { class: 'state' }, [h('span', { class: 'spinner' })])
    page.appendChild(spinner)
    root.appendChild(page)

    let dispose = null
    let destroyed = false

    ;(async function () {
      let level = null
      try {
        const res = await Promise.all([api.getLevel(key), api.getMeta()])
        level = res[0]
        const labels = {}
        for (const l of res[1].levels) labels[l.key] = l.label
        title.textContent = labels[key] || key
      } catch (e) {
        /* 元信息加载失败时退回用 key 当标题 */
      }
      if (destroyed) return
      spinner.remove()
      if (!level) {
        page.appendChild(h('p', { class: 'state', text: '未见该分级，可能已失效。' }))
        return
      }
      title.appendChild(
        h('span', { class: 'count', text: level.words.length.toLocaleString() + ' 词' })
      )
      dispose = W.components.wordList(page, { words: level.words, storageKey: key })
    })()

    return function destroy() {
      destroyed = true
      if (dispose) dispose()
    }
  }
})(window)
