/* =========================================================
   AI 设置页 —— 供应商配置、提示词模板、连接测试、清除
   ========================================================= */
(function (global) {
  'use strict'

  const W = (global.W = global.W || {})
  const h = W.dom.h

  W.views = W.views || {}

  W.views.settings = function (root) {
    const utils = W.utils
    const ai = W.ai

    const saved = utils.loadAISettings()

    const baseURLInput = h('input', {
      attrs: { type: 'text', placeholder: '如 https://api.deepseek.com/v1' },
    })
    baseURLInput.value = saved.baseURL

    const apiKeyInput = h('input', {
      attrs: { type: 'password', placeholder: 'sk-…', autocomplete: 'off' },
    })
    apiKeyInput.value = saved.apiKey

    const modelInput = h('input', {
      attrs: { type: 'text', placeholder: '如 deepseek-chat / gpt-4o-mini' },
    })
    modelInput.value = saved.model

    const promptArea = h('textarea', { class: 'prompt-area', attrs: { rows: '10' } })
    promptArea.value = utils.loadAIPrompt() || ai.DEFAULT_PROMPT

    const statusP = h('p', { class: 'test-status', hidden: true })
    let savedTimer = null
    let testCtrl = null
    let destroyed = false

    function setStatus(text) {
      statusP.textContent = text
      statusP.hidden = !text
    }

    function currentSettings() {
      return {
        baseURL: baseURLInput.value.trim(),
        apiKey: apiKeyInput.value.trim(),
        model: modelInput.value.trim(),
      }
    }

    const testBtn = h('button', { class: 'btn-ghost', attrs: { type: 'button' }, text: '测试连接' })
    const saveBtn = h('button', { class: 'btn-save', attrs: { type: 'button' }, text: '保存设置' })
    const clearBtn = h('button', {
      class: 'btn-danger',
      attrs: { type: 'button' },
      text: '清除密钥与缓存',
    })
    const resetBtn = h('button', {
      class: 'link',
      attrs: { type: 'button' },
      text: '恢复默认',
      on: {
        click: function () {
          promptArea.value = ai.DEFAULT_PROMPT
        },
      },
    })

    function save() {
      utils.saveAISettings(currentSettings())
      const p = promptArea.value.trim()
      utils.saveAIPrompt(p === ai.DEFAULT_PROMPT ? '' : p)
      saveBtn.textContent = '已保存 ✓'
      clearTimeout(savedTimer)
      savedTimer = setTimeout(function () {
        saveBtn.textContent = '保存设置'
      }, 2000)
    }

    async function testConn() {
      const settings = currentSettings()
      if (!utils.aiConfigured(settings)) {
        setStatus('请先填写完整的 baseURL、API Key 与模型名')
        return
      }
      testBtn.disabled = true
      testBtn.textContent = '连接中…'
      setStatus('连接中…')
      let got = false
      testCtrl = new AbortController()
      try {
        await ai.streamChat({
          settings: settings,
          prompt: '请只回复两个字母：ok',
          signal: testCtrl.signal,
          onDelta: function () {
            got = true
          },
        })
        setStatus(got ? '连接成功，返回正常 ✓' : '连接成功（无内容返回）✓')
      } catch (e) {
        setStatus('失败：' + (e.message || String(e)))
      } finally {
        testBtn.disabled = false
        testBtn.textContent = '测试连接'
        testCtrl = null
      }
    }

    function clearAll() {
      utils.clearAISettings()
      utils.clearAICache()
      baseURLInput.value = ''
      apiKeyInput.value = ''
      modelInput.value = ''
      setStatus('')
    }

    testBtn.addEventListener('click', testConn)
    saveBtn.addEventListener('click', save)
    clearBtn.addEventListener('click', clearAll)

    const page = h('div', { class: 'settings' }, [
      h('div', { class: 'title-row' }, [
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
        h('h1', { text: 'AI 设置' }),
      ]),
      h('p', {
        class: 'tip',
        text:
          '仅在本项目内使用，填入任意的 OpenAI 兼容接口（按 curl 方式请求）。API Key 只做本地简单混淆存储，' +
          '不发送到除你所填供应商之外的任何地方；可随时「清除并删除密钥」。',
      }),
      h('section', { class: 'card' }, [
        h('h3', { text: '供应商' }),
        h('label', {}, [document.createTextNode('接口地址 Base URL'), baseURLInput]),
        h('label', {}, [document.createTextNode('API Key'), apiKeyInput]),
        h('label', {}, [document.createTextNode('模型 Model'), modelInput]),
      ]),
      h('section', { class: 'card' }, [
        h('div', { class: 'card-head' }, [h('h3', { text: '提示词模板' }), resetBtn]),
        promptArea,
        h('p', {
          class: 'hint',
          text: '可用占位符：{word} {phonetic} {pos} {meaning} {exchange}',
        }),
      ]),
      h('div', { class: 'actions' }, [testBtn, saveBtn, clearBtn]),
      statusP,
    ])

    root.appendChild(page)

    return function destroy() {
      destroyed = true
      clearTimeout(savedTimer)
      if (testCtrl) testCtrl.abort()
    }
  }
})(window)
