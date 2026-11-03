/* =========================================================
   首页 —— 搜索、自定义分级、分级网格
   ========================================================= */
(function (global) {
  'use strict'

  const W = (global.W = global.W || {})
  const h = W.dom.h
  const clear = W.dom.clear

  W.views = W.views || {}

  W.views.home = function (root) {
    const utils = W.utils
    const api = W.api

    let levels = []
    let total = 0
    let customs = utils.loadCustoms()

    const page = h('div', { class: 'home' })

    /* ---------------- 搜索 ---------------- */
    let searchTimer = null
    let resultsEl = null
    let results = []
    let searching = false
    let showResults = false
    let lastQuery = ''

    const searchInput = h('input', {
      attrs: { type: 'text', placeholder: '输入单词查询，如 study / abandon …' },
      on: {
        input: function () {
          clearTimeout(searchTimer)
          searchTimer = setTimeout(runSearch, 250)
        },
      },
    })
    const searchBox = h('div', { class: 'search-box' }, [searchInput])

    function hideResults() {
      showResults = false
      results = []
      renderResults()
    }

    async function runSearch() {
      const q = searchInput.value.trim()
      if (!q) {
        hideResults()
        return
      }
      lastQuery = q
      showResults = true
      searching = true
      renderResults()
      try {
        const list = await api.search(q)
        if (lastQuery !== q) return
        results = list
      } catch (e) {
        if (lastQuery !== q) return
        results = []
      } finally {
        if (lastQuery === q) searching = false
      }
      renderResults()
    }

    function renderResults() {
      if (resultsEl) {
        resultsEl.remove()
        resultsEl = null
      }
      if (!showResults) return
      const box = h('div', { class: 'results' })
      if (searching) {
        box.appendChild(h('div', { class: 'state' }, [h('span', { class: 'spinner' })]))
      } else if (results.length === 0) {
        box.appendChild(h('p', { class: 'no-result', text: '未找到匹配的单词' }))
      } else {
        for (const r of results) {
          box.appendChild(
            h(
              'button',
              {
                class: 'result-item',
                attrs: { type: 'button' },
                on: {
                  click: (function (word) {
                    return function () {
                      goSearchResult(word)
                    }
                  })(r.word),
                },
              },
              [
                h('span', { class: 'ri-word', text: r.word }),
                h('span', {
                  class: 'ri-level',
                  text:
                    r.levels.length + ' 个分级' + (r.levels.length ? ' · ' + r.levels[0] : ''),
                }),
              ]
            )
          )
        }
      }
      searchBox.appendChild(box)
      resultsEl = box
    }

    function goSearchResult(word) {
      W.router.push('/word/' + encodeURIComponent(word))
      searchInput.value = ''
      hideResults()
    }

    /* ---------------- 自定义分级 ---------------- */
    const customBody = h('div')
    const customBtn = h('button', {
      class: 'btn-minute',
      attrs: { type: 'button' },
      text: '＋ 新建自定义分级',
      on: { click: openBuilder },
    })

    function label(k) {
      const lv = levels.find(function (l) {
        return l.key === k
      })
      return lv ? lv.label : k
    }
    function fmtFormula(c) {
      const inc = c.inc.map(label).join(' ＋ ')
      const exc = c.exc
        .map(function (k) {
          return '− ' + label(k)
        })
        .join(' ')
      return exc ? inc + ' ' + exc : inc
    }

    function renderCustoms() {
      clear(customBody)
      if (customs.length === 0) {
        customBody.appendChild(
          h('p', { class: 'state-empty', text: '还没有自定义分级，点右上角「新建」创建。' })
        )
        return
      }
      const list = h('div', { class: 'custom-list' })
      for (const c of customs) {
        const main = h(
          'div',
          {
            class: 'cc-main',
            on: {
              click: (function (id) {
                return function () {
                  W.router.push('/custom/' + encodeURIComponent(id))
                }
              })(c.id),
            },
          },
          [
            h('span', { class: 'cc-name', text: c.name }),
            h('span', { class: 'cc-formula', text: fmtFormula(c) }),
          ]
        )
        const del = h('button', {
          class: 'cc-del',
          attrs: { type: 'button', title: '删除' },
          text: '✕',
          on: {
            click: (function (id) {
              return function () {
                customs = customs.filter(function (x) {
                  return x.id !== id
                })
                utils.saveCustoms(customs)
                renderCustoms()
              }
            })(c.id),
          },
        })
        list.appendChild(h('div', { class: 'custom-card' }, [main, del]))
      }
      customBody.appendChild(list)
    }

    /* ---------------- 新建自定义分级弹层 ---------------- */
    let builder = null
    let bName = ''
    let bInc = []
    let bExc = []
    let preview = null
    let previewTimer = null

    function syncChips() {
      if (!builder) return
      clear(builder.incChips)
      clear(builder.excChips)
      for (const lv of levels) {
        builder.incChips.appendChild(chipEl('inc', lv))
        builder.excChips.appendChild(chipEl('exc', lv))
      }
    }
    function chipEl(dest, lv) {
      const selected = (dest === 'inc' ? bInc : bExc).indexOf(lv.key) !== -1
      return h('button', {
        class: 'chip' + (selected ? ' sel' : ''),
        attrs: { type: 'button' },
        text: lv.label,
        on: {
          click: function () {
            toggle(dest, lv.key)
          },
        },
      })
    }

    function toggle(dest, key) {
      const arr = dest === 'inc' ? bInc : bExc
      const idx = arr.indexOf(key)
      if (idx >= 0) arr.splice(idx, 1)
      else arr.push(key)
      syncChips()
      syncSaveBtn()
      schedulePreview()
    }

    function syncSaveBtn() {
      if (!builder) return
      builder.saveBtn.disabled = !bName.trim() || bInc.length === 0
    }

    function schedulePreview() {
      clearTimeout(previewTimer)
      if (bInc.length === 0) {
        preview = null
        syncPreview()
        return
      }
      previewTimer = setTimeout(async function () {
        try {
          const res = await api.computeCustomWords(bInc.slice(), bExc.slice())
          preview = res.length
        } catch (e) {
          preview = null
        }
        syncPreview()
      }, 300)
    }

    function syncPreview() {
      if (!builder) return
      clear(builder.previewEl)
      if (preview === null) {
        builder.previewEl.textContent = '选择「包含」分级后预览词数'
      } else {
        builder.previewEl.appendChild(document.createTextNode('结果约 '))
        builder.previewEl.appendChild(h('b', { text: preview.toLocaleString() }))
        builder.previewEl.appendChild(document.createTextNode(' 词'))
      }
    }

    function openBuilder() {
      bName = ''
      bInc = []
      bExc = []
      preview = null

      const nameInput = h('input', {
        attrs: { type: 'text', placeholder: '如：四级新增词汇' },
        on: {
          input: function () {
            bName = nameInput.value
            syncSaveBtn()
          },
          keyup: function (e) {
            if (e.key === 'Enter') saveCustom()
          },
        },
      })
      const incChips = h('div', { class: 'bd-chips' })
      const excChips = h('div', { class: 'bd-chips' })
      const previewEl = h('div', { class: 'bd-preview' })
      const saveBtn = h('button', {
        class: 'bd-save',
        attrs: { type: 'button' },
        text: '保存并打开',
        on: { click: saveCustom },
      })
      const cancelBtn = h('button', {
        class: 'bd-cancel',
        attrs: { type: 'button' },
        text: '取消',
        on: { click: closeBuilder },
      })
      const closeBtn = h('button', {
        class: 'bd-close',
        attrs: { type: 'button' },
        text: '✕',
        on: { click: closeBuilder },
      })

      const dialog = h('div', { class: 'builder' }, [
        h('div', { class: 'bd-head' }, [h('h3', { text: '新建自定义分级' }), closeBtn]),
        h('label', { class: 'bd-name' }, [document.createTextNode('名称'), nameInput]),
        h('div', { class: 'bd-section' }, [
          h('div', { class: 'bd-label', text: '包含（取并集）' }),
          incChips,
        ]),
        h('div', { class: 'bd-op', text: '− 减 去 −' }),
        h('div', { class: 'bd-section' }, [
          h('div', { class: 'bd-label', text: '减去（取并集后排除）' }),
          excChips,
        ]),
        previewEl,
        h('div', { class: 'bd-actions' }, [cancelBtn, saveBtn]),
      ])

      const overlay = h(
        'div',
        {
          class: 'overlay',
          on: {
            click: function (e) {
              if (e.target === overlay) closeBuilder()
            },
          },
        },
        [dialog]
      )

      page.appendChild(overlay)
      builder = {
        overlay: overlay,
        incChips: incChips,
        excChips: excChips,
        previewEl: previewEl,
        saveBtn: saveBtn,
      }
      syncChips()
      syncPreview()
      syncSaveBtn()
      nameInput.focus()
    }

    function closeBuilder() {
      clearTimeout(previewTimer)
      if (builder) {
        builder.overlay.remove()
        builder = null
      }
    }

    function saveCustom() {
      const name = bName.trim()
      if (!name || bInc.length === 0) return
      const c = {
        id: 'c' + Date.now().toString(36),
        name: name,
        inc: bInc.slice(),
        exc: bExc.slice(),
      }
      customs = customs.concat([c])
      utils.saveCustoms(customs)
      closeBuilder()
      W.router.push('/custom/' + encodeURIComponent(c.id))
    }

    /* ---------------- 分级网格 ---------------- */
    const levelsSection = h('section', { class: 'levels' }, [
      h('h2', { class: 'section-title', text: '选择分级' }),
    ])
    const levelsSpinner = h('div', { class: 'state' }, [h('span', { class: 'spinner' })])
    levelsSection.appendChild(levelsSpinner)
    let levelsGrid = null

    function renderLevels() {
      if (levelsSpinner.parentNode) levelsSpinner.remove()
      if (levelsGrid) {
        levelsGrid.remove()
        levelsGrid = null
      }
      const grid = h('div', { class: 'grid' })
      for (const lv of levels) {
        grid.appendChild(
          h(
            'button',
            {
              class: 'level-card',
              attrs: { type: 'button' },
              on: {
                click: (function (key) {
                  return function () {
                    W.router.push('/level/' + encodeURIComponent(key))
                  }
                })(lv.key),
              },
            },
            [
              h('span', { class: 'lc-name', text: lv.label }),
              h('span', { class: 'lc-count', text: lv.count.toLocaleString() + ' 词' }),
            ]
          )
        )
      }
      levelsSection.appendChild(grid)
      levelsGrid = grid
    }

    /* ---------------- 组装页面 ---------------- */
    const sub = h('p', { class: 'sub' })
    const hero = h('section', { class: 'hero' }, [
      h('h1', { text: '查词 · 背单词 · 分级练习' }),
      sub,
      searchBox,
    ])

    const customSection = h('section', { class: 'custom' }, [
      h('div', { class: 'custom-head' }, [
        h('h2', { class: 'section-title slim', text: '自定义分级' }),
        customBtn,
      ]),
      h('p', {
        class: 'custom-hint',
        text: '用集合运算生成自己的词表，例如「CET4 − 高考 − 初中」即可得到四级新增词汇。',
      }),
      customBody,
    ])

    page.appendChild(hero)
    page.appendChild(customSection)
    page.appendChild(levelsSection)
    root.appendChild(page)

    renderCustoms()

    api
      .getMeta()
      .then(function (meta) {
        levels = meta.levels || []
        total = meta.total || 0
        sub.textContent =
          '收录 ' +
          total.toLocaleString() +
          ' 个单词，涵盖 ' +
          levels.length.toLocaleString() +
          ' 个常见分级。 点击分级查看词表，或直接搜索任意单词。'
        renderLevels()
        renderCustoms()
      })
      .catch(function (e) {
        if (levelsSpinner.parentNode) levelsSpinner.remove()
        levelsSection.appendChild(h('p', { class: 'state', text: e.message || '数据加载失败' }))
      })

    return function destroy() {
      clearTimeout(searchTimer)
      clearTimeout(previewTimer)
    }
  }
})(window)
