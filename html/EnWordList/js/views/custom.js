/* =========================================================
   自定义分级页 —— 用集合运算（并集 − 并集）生成词表
   ========================================================= */
(function (global) {
  'use strict'

  const W = (global.W = global.W || {})
  const h = W.dom.h

  W.views = W.views || {}

  W.views.custom = function (root, params) {
    const utils = W.utils
    const api = W.api
    const id = params.id

    const page = h('div', { class: 'level-page is-custom' })
    const title = h('h1', { class: 'title', text: '自定义分级' })

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
      let def = null
      let labels = {}
      let words = []
      let computeError = ''
      let notFound = false

      try {
        const meta = await api.getMeta()
        for (const l of meta.levels) labels[l.key] = l.label
        def = utils.loadCustoms().find(function (c) {
          return c.id === id
        }) || null
        if (!def) {
          notFound = true
        } else if (!def.inc || def.inc.length === 0) {
          computeError = '该自定义分级未包含任何分级'
        } else {
          words = await api.computeCustomWords(def.inc, def.exc || [])
        }
      } catch (e) {
        notFound = true
      }

      if (destroyed) return
      spinner.remove()

      if (notFound) {
        page.appendChild(h('p', { class: 'state', text: '未找到该自定义分级，可能已被删除。' }))
        return
      }

      title.textContent = def.name
      title.appendChild(h('span', { class: 'count', text: words.length.toLocaleString() + ' 词' }))

      const inc = def.inc
        .map(function (k) {
          return labels[k] || k
        })
        .join(' + ')
      const exc = (def.exc || [])
        .map(function (k) {
          return labels[k] || k
        })
        .map(function (s) {
          return '− ' + s
        })
        .join(' ')
      const formula = exc ? inc + ' ' + exc : inc
      if (formula) page.appendChild(h('p', { class: 'formula', text: formula }))

      if (computeError) {
        page.appendChild(h('p', { class: 'state', text: computeError }))
        return
      }

      dispose = W.components.wordList(page, { words: words, storageKey: 'custom:' + id })
    })()

    return function destroy() {
      destroyed = true
      if (dispose) dispose()
    }
  }
})(window)
