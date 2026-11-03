/* =========================================================
   词表组件 —— 筛选 / 布局预设 / 乱序 / 分页
   用法：W.components.wordList(container, { words, storageKey })
   返回销毁函数（断开 ResizeObserver）
   ========================================================= */
(function (global) {
  'use strict'

  const W = (global.W = global.W || {})

  // 布局预设：列数 × 行高，决定一页能放多少词
  const PRESETS = [
    { key: 'compact', label: '紧凑', cols: 2, rowH: 38 },
    { key: 'normal', label: '标准', cols: 1, rowH: 52 },
    { key: 'relaxed', label: '宽松', cols: 1, rowH: 68 },
  ]

  W.components = W.components || {}

  W.components.wordList = function (container, options) {
    const h = W.dom.h
    const clear = W.dom.clear
    const utils = W.utils
    const api = W.api

    const opts = options || {}
    const words = opts.words || []
    const storageKey = opts.storageKey || 'level'

    /* ---------------- 状态 ---------------- */
    let presetKey = utils.loadPreset()
    let showShuffle = false
    let shuffleOn = utils.loadShuffleOn()
    let seedText = utils.loadSeedText()
    let filterText = ''
    let page = utils.loadPage(storageKey)
    let wordsDict = {}
    let listH = 0
    let ro = null
    let disposed = false

    function preset() {
      for (const p of PRESETS) if (p.key === presetKey) return p
      return PRESETS[1]
    }
    function shuffleActive() {
      return shuffleOn && seedText.trim() !== ''
    }
    function basedWords() {
      return shuffleActive() ? utils.seededShuffle(words, seedText) : words
    }
    function filteredWords() {
      const q = filterText.trim().toLowerCase()
      const base = basedWords()
      if (!q) return base
      return base.filter(function (w) {
        return w.indexOf(q) !== -1
      })
    }
    function pageSize() {
      if (!listH) return 20
      return Math.max(1, Math.floor(listH / preset().rowH)) * preset().cols
    }
    function pageCount() {
      return Math.max(1, Math.ceil(filteredWords().length / pageSize()))
    }
    function shownWords() {
      const size = pageSize()
      const start = (page - 1) * size
      return filteredWords().slice(start, start + size)
    }

    /* ---------------- 结构 ---------------- */
    const root = h('div', { class: 'wb' })

    // 筛选框
    const filterInput = h('input', {
      class: 'filter',
      attrs: {
        type: 'text',
        placeholder: '筛选 ' + words.length.toLocaleString() + ' 词，如 ab…',
      },
      on: {
        input: function () {
          filterText = filterInput.value
          page = 1
          utils.savePage(storageKey, page)
          renderList()
          renderPager()
        },
      },
    })

    // 布局预设分段按钮
    const presetSeg = h('div', { class: 'preset-seg' })
    const presetBtns = PRESETS.map(function (p) {
      const btn = h('button', {
        class: 'pg seg',
        attrs: {
          type: 'button',
          title: p.label + '：' + (p.cols === 2 ? '两列' : '一列') + ' ' + p.rowH + 'px 行高',
        },
        text: p.label,
        on: {
          click: function () {
            presetKey = p.key
            utils.savePreset(p.key)
            syncPresetBtns()
            clampPage()
            renderList()
            renderPager()
          },
        },
      })
      presetSeg.appendChild(btn)
      return { def: p, el: btn }
    })
    function syncPresetBtns() {
      for (const item of presetBtns) item.el.classList.toggle('active', item.def.key === presetKey)
    }

    // 乱序开关按钮
    const shuffleBtn = h('button', {
      class: 'btn-mini shuffle-btn',
      attrs: { type: 'button' },
      on: {
        click: function () {
          showShuffle = !showShuffle
          syncShuffle()
        },
      },
    })

    // 乱序面板
    const shuffleToggle = h('input', {
      attrs: { type: 'checkbox' },
      on: {
        change: function () {
          shuffleOn = shuffleToggle.checked
          utils.saveShuffleOn(shuffleOn)
          page = 1
          utils.savePage(storageKey, page)
          syncShuffle()
          renderList()
          renderPager()
        },
      },
    })

    const seedInput = h('input', {
      class: 'seed-input',
      attrs: { type: 'text', placeholder: '任意文本作为种子，自动保存，再来仍是同一乱序' },
      on: {
        input: function () {
          seedText = seedInput.value
          utils.saveSeedText(seedText.trim())
          page = 1
          utils.savePage(storageKey, page)
          syncShuffle()
          renderList()
          renderPager()
        },
      },
    })

    const diceBtn = h('button', {
      class: 'btn-mini dice',
      attrs: { type: 'button', title: '随机生成种子' },
      text: '🎲',
      on: {
        click: function () {
          seedText = Math.random().toString(36).slice(2, 10)
          seedInput.value = seedText
          utils.saveSeedText(seedText)
          page = 1
          utils.savePage(storageKey, page)
          syncShuffle()
          renderList()
          renderPager()
        },
      },
    })

    const resetBtn = h('button', {
      class: 'btn-mini',
      attrs: { type: 'button' },
      text: '恢复原序',
      on: {
        click: function () {
          shuffleOn = false
          seedText = ''
          shuffleToggle.checked = false
          seedInput.value = ''
          utils.saveShuffleOn(false)
          utils.saveSeedText('')
          page = 1
          utils.savePage(storageKey, page)
          syncShuffle()
          renderList()
          renderPager()
        },
      },
    })

    const seedHint = h('span', { class: 'seed-hint' })

    const shuffleBar = h('div', { class: 'shuffle-bar', hidden: true }, [
      h('label', { class: 'shuffle-toggle' }, [shuffleToggle, h('span', { text: '乱序背诵' })]),
      seedInput,
      diceBtn,
      resetBtn,
      seedHint,
    ])

    const listArea = h('div', { class: 'list-area' })
    const pager = h('nav', { class: 'pager', hidden: true })

    // 页码跳转：输入框与表单常驻，重建分页按钮时不丢失已输入内容
    const jumpInput = h('input', { attrs: { type: 'number', min: '1', placeholder: '页码' } })
    const jumpLabel = h('span')
    const jumpForm = h(
      'form',
      {
        class: 'pager-jump',
        on: {
          submit: function (e) {
            e.preventDefault()
            setPage(parseInt(jumpInput.value, 10) || 1)
            jumpInput.value = ''
          },
        },
      },
      [jumpLabel, jumpInput, h('button', { class: 'btn-mini', attrs: { type: 'submit' }, text: '跳转' })]
    )

    root.appendChild(h('div', { class: 'ctrl' }, [filterInput, presetSeg, shuffleBtn]))
    root.appendChild(shuffleBar)
    root.appendChild(listArea)
    root.appendChild(pager)
    container.appendChild(root)

    /* ---------------- 渲染 ---------------- */
    function syncShuffle() {
      const active = shuffleActive()
      shuffleBar.hidden = !showShuffle
      shuffleToggle.checked = shuffleOn
      seedInput.disabled = !shuffleOn
      diceBtn.disabled = !shuffleOn
      shuffleBtn.classList.toggle('on', active)
      shuffleBtn.textContent = '乱序' + (active ? ' ●' : '') + ' ' + (showShuffle ? '▾' : '▸')
      seedHint.textContent = active ? '种子 #' + utils.hashText(seedText) : ''
    }

    function detail(word) {
      return wordsDict[word] || null
    }
    function headMeaning(word) {
      const lines = utils.meaningLines(detail(word) && detail(word).meaning)
      return lines[0] || '（无释义）'
    }

    function rowEl(word) {
      const d = detail(word)
      return h(
        'button',
        {
          class: 'row',
          attrs: { type: 'button' },
          on: {
            click: function () {
              W.router.push('/word/' + encodeURIComponent(word))
            },
          },
        },
        [
          h('span', { class: 'c-word', text: word }),
          h('span', { class: 'c-phonetic', text: utils.phon(d && d.phonetic) }),
          h('span', { class: 'c-pos', text: (d && d.pos) || '' }),
          h('span', { class: 'c-meaning', text: headMeaning(word) }),
        ]
      )
    }

    function renderList() {
      clear(listArea)
      if (words.length === 0) {
        listArea.appendChild(h('p', { class: 'state', text: '该词表为空，请调整选取条件' }))
        return
      }
      const list = filteredWords()
      if (list.length === 0) {
        listArea.appendChild(h('p', { class: 'state', text: '无匹配单词' }))
        return
      }
      const conf = preset()
      const rows = h('div', {
        class: 'rows' + (conf.cols === 2 ? ' two-col' : ''),
        style: { '--row-h': conf.rowH + 'px' },
      })
      for (const w of shownWords()) rows.appendChild(rowEl(w))
      listArea.appendChild(rows)
    }

    function pageWindow() {
      const total = pageCount()
      const cur = page
      const delta = 2
      const lo = Math.max(2, cur - delta)
      const hi = Math.min(total - 1, cur + delta)
      const items = [1]
      if (lo > 2) items.push('…')
      for (let i = lo; i <= hi; i++) items.push(i)
      if (hi < total - 1) items.push('…')
      if (total > 1) items.push(total)
      return items
    }

    function pgBtn(label, disabled, onClick, active) {
      return h('button', {
        class: 'pg' + (active ? ' active' : ''),
        attrs: { type: 'button', disabled: disabled || null },
        text: label,
        on: { click: onClick },
      })
    }

    function renderPager() {
      clear(pager)
      const count = pageCount()
      if (count <= 1) {
        pager.hidden = true
        return
      }
      pager.hidden = false
      const btns = h('div', { class: 'pager-btns' })
      btns.appendChild(
        pgBtn('«', page === 1, function () {
          setPage(1)
        })
      )
      btns.appendChild(
        pgBtn('‹', page === 1, function () {
          setPage(page - 1)
        })
      )
      for (const it of pageWindow()) {
        if (it === '…') {
          btns.appendChild(h('span', { class: 'pg-ellipsis', text: '…' }))
        } else {
          btns.appendChild(
            pgBtn(
              String(it),
              false,
              (function (target) {
                return function () {
                  setPage(target)
                }
              })(it),
              it === page
            )
          )
        }
      }
      btns.appendChild(
        pgBtn('›', page === count, function () {
          setPage(page + 1)
        })
      )
      btns.appendChild(
        pgBtn('»', page === count, function () {
          setPage(count)
        })
      )
      jumpLabel.textContent = '第 ' + page + '/' + count + ' 页'
      jumpInput.setAttribute('max', String(count))
      pager.appendChild(btns)
      pager.appendChild(jumpForm)
    }

    /* ---------------- 分页计算 ---------------- */
    function clampPage() {
      const target = Math.min(Math.max(1, page), pageCount())
      page = target
      utils.savePage(storageKey, page)
    }
    function setPage(p) {
      const target = Math.min(Math.max(1, Math.floor(p) || 1), pageCount())
      if (target === page) {
        utils.savePage(storageKey, page)
        return
      }
      page = target
      utils.savePage(storageKey, page)
      renderList()
      renderPager()
    }

    /* ---------------- 测量与首次渲染 ---------------- */
    function measure() {
      listH = listArea.clientHeight
    }

    syncPresetBtns()
    seedInput.value = seedText
    syncShuffle()
    measure()
    clampPage()
    renderList()
    renderPager()

    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(function () {
        const prev = listH
        measure()
        if (listH === prev) return
        clampPage()
        renderList()
        renderPager()
      })
      ro.observe(listArea)
    }

    // 释义字典按需加载，到货后补上音标 / 词性 / 释义
    api
      .getWords()
      .then(function (dict) {
        if (disposed) return
        wordsDict = dict
        renderList()
      })
      .catch(function () {
        /* 释义缺失时列表仍然可用 */
      })

    return function destroy() {
      disposed = true
      if (ro) {
        ro.disconnect()
        ro = null
      }
    }
  }
})(window)
