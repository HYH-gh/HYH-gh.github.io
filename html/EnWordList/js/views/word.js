/* =========================================================
   单词详情页 —— 释义、所属分级、AI 讲解（流式）
   ========================================================= */
(function (global) {
  'use strict'

  const W = (global.W = global.W || {})
  const h = W.dom.h
  const clear = W.dom.clear

  W.views = W.views || {}

  // 轻量 markdown 渲染（安全：先转义再替换）
  const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return ESCAPES[c]
    })
  }
  function renderMd(text) {
    return esc(text)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/^###\s*(.+)$/gm, '<h4>$1</h4>')
      .replace(/^##\s*(.+)$/gm, '<h4>$1</h4>')
      .replace(/^#\s*(.+)$/gm, '<h4>$1</h4>')
      .replace(/^- (.+)$/gm, '• $1')
      .replace(/\n{2,}/g, '\n')
  }

  W.views.word = function (root, params) {
    const utils = W.utils
    const api = W.api
    const ai = W.ai
    const wordKey = params.word

    const page = h('div', { class: 'word-page' })
    page.appendChild(
      h('div', { class: 'back-row' }, [
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
      ])
    )
    const spinner = h('div', { class: 'state' }, [h('span', { class: 'spinner' })])
    page.appendChild(spinner)
    root.appendChild(page)

    /* ---------------- AI 状态 ---------------- */
    const aiSettings = utils.loadAISettings()
    const aiEnabled = utils.aiConfigured(aiSettings)

    let wordData = null
    let output = ''
    let cached = false
    let aiLoading = false
    let aiError = ''
    let aiCtrl = null
    let aiNodes = null
    let raf = 0
    let destroyed = false

    function aiCacheKey() {
      return aiSettings.model + ':' + wordKey
    }

    function syncAI() {
      if (!aiNodes) return
      const n = aiNodes
      n.cacheTag.hidden = !(cached && !aiLoading)
      n.stopBtn.hidden = !aiLoading
      n.genBtn.disabled = aiLoading
      n.genBtn.textContent = aiLoading ? '生成中…' : output ? '重新生成' : '生成 AI 讲解'
      n.errorP.hidden = !aiError
      n.errorP.textContent = aiError ? '生成失败：' + aiError : ''
      if (aiError) {
        n.emptyP.hidden = true
        n.md.hidden = true
        return
      }
      if (!output && !aiLoading) {
        n.emptyP.hidden = false
        n.md.hidden = true
        return
      }
      n.emptyP.hidden = true
      n.md.hidden = false
      n.md.innerHTML = renderMd(output)
    }

    function scheduleSync() {
      if (raf) return
      raf = requestAnimationFrame(function () {
        raf = 0
        syncAI()
      })
    }

    function stopAI() {
      if (aiCtrl) aiCtrl.abort()
    }

    async function requestAI(force) {
      if (!aiEnabled || aiLoading) return
      if (!force) {
        const hit = utils.loadAICache()[aiCacheKey()]
        if (hit) {
          output = hit
          cached = true
          aiError = ''
          syncAI()
          return
        }
      }
      aiCtrl = new AbortController()
      aiLoading = true
      output = ''
      cached = false
      aiError = ''
      syncAI()

      const prompt = ai.buildPrompt(utils.loadAIPrompt() || ai.DEFAULT_PROMPT, {
        word: wordKey,
        phonetic: (wordData && wordData.phonetic) || '',
        pos: (wordData && wordData.pos) || '',
        meaning: (wordData && wordData.meaning) || '',
        exchange: (wordData && wordData.exchange) || '',
      })

      try {
        await ai.streamChat({
          settings: aiSettings,
          prompt: prompt,
          signal: aiCtrl.signal,
          onDelta: function (d) {
            if (destroyed) return
            output += d
            scheduleSync()
          },
        })
        const cache = utils.loadAICache()
        cache[aiCacheKey()] = output
        utils.saveAICache(cache)
      } catch (e) {
        if (e.name !== 'AbortError') aiError = e.message || String(e)
      } finally {
        aiLoading = false
        syncAI()
      }
    }

    function buildAiCard() {
      const cacheTag = h('span', { class: 'ai-cache', text: '已缓存', hidden: true })
      const stopBtn = h('button', {
        class: 'ai-btn ghost',
        attrs: { type: 'button' },
        text: '停止',
        hidden: true,
        on: { click: stopAI },
      })
      const genBtn = h('button', {
        class: 'ai-btn',
        attrs: { type: 'button' },
        text: '生成 AI 讲解',
        on: {
          click: function () {
            requestAI(false)
          },
        },
      })
      const errorP = h('p', { class: 'ai-error', hidden: true })
      const emptyP = h('p', {
        class: 'ai-empty',
        text: '点击生成，可获取不同词义的例句、用法搭配、特殊语法与易错辨析（流式输出）。',
      })
      const md = h('div', { class: 'ai-md', hidden: true })

      const card = h('section', { class: 'card ai' }, [
        h('div', { class: 'ai-head' }, [
          h('h3', { text: 'AI 讲解' }),
          h('div', { class: 'ai-actions' }, [cacheTag, stopBtn, genBtn]),
        ]),
        errorP,
        emptyP,
        md,
      ])

      aiNodes = {
        card: card,
        cacheTag: cacheTag,
        stopBtn: stopBtn,
        genBtn: genBtn,
        errorP: errorP,
        emptyP: emptyP,
        md: md,
      }
      return card
    }

    /* ---------------- 数据加载与渲染 ---------------- */
    ;(async function () {
      let word = null
      let levelsOf = []
      let labels = {}
      try {
        word = await api.getWord(wordKey)
        const res = await Promise.all([api.getLevelsOf(wordKey), api.getMeta()])
        levelsOf = res[0]
        for (const l of res[1].levels) labels[l.key] = l.label
      } catch (e) {
        /* 网络异常时按未找到处理 */
      }
      if (destroyed) return
      spinner.remove()

      if (!word) {
        page.appendChild(h('p', { class: 'state', text: '抱歉，未找到单词「' + wordKey + '」' }))
        return
      }
      wordData = word

      // 主卡片：单词 / 音标 / 词性
      page.appendChild(
        h('section', { class: 'card main-card' }, [
          h('span', { class: 'big-word', text: wordKey }),
          h('span', { class: 'big-phonetic', text: utils.phon(word.phonetic) }),
          h('p', { class: 'pos-block', text: word.pos || '' }),
        ])
      )

      // 释义
      const senses = utils.meaningLines(word.meaning)
      const senseCard = h('section', { class: 'card sense' }, [h('h3', { text: '释义' })])
      if (senses.length === 0) {
        senseCard.appendChild(h('p', { class: 'meaning', text: '（该词暂缺释义）' }))
      } else {
        for (const line of senses) {
          senseCard.appendChild(
            h('p', { class: 'meaning sense-line' }, [
              h('span', { class: 'sense-tag', text: '•' }),
              document.createTextNode(line),
            ])
          )
        }
      }
      page.appendChild(senseCard)

      // AI 讲解
      if (aiEnabled) page.appendChild(buildAiCard())

      // 所属分级
      if (levelsOf.length) {
        const chips = h('div', { class: 'chips' })
        for (const lk of levelsOf) {
          chips.appendChild(
            h(
              'button',
              {
                class: 'chip',
                attrs: { type: 'button' },
                text: labels[lk] || lk,
                on: {
                  click: (function (key) {
                    return function () {
                      W.router.push('/level/' + encodeURIComponent(key))
                    }
                  })(lk),
                },
              }
            )
          )
        }
        page.appendChild(h('section', { class: 'card aff' }, [h('h3', { text: '所属分级' }), chips]))
      }

      if (aiEnabled) syncAI()
    })()

    return function destroy() {
      destroyed = true
      if (raf) cancelAnimationFrame(raf)
      if (aiCtrl) aiCtrl.abort()
    }
  }
})(window)
