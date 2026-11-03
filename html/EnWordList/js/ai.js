/* =========================================================
   ai.js —— AI 客户端
   OpenAI 兼容 /chat/completions，流式输出（SSE），自动跳过推理段
   ========================================================= */
(function (global) {
  'use strict'

  const W = (global.W = global.W || {})

  // 内置默认提示词模板，可按需覆盖
  const DEFAULT_PROMPT = `你是一位耐心的英语老师。请根据下面的单词信息，用中文详细讲解「{word}」：

- 音标：{phonetic}
- 词性：{pos}
- 词义：{meaning}
- 词形变化：{exchange}

要求：
1. 按词义逐条给出 1~2 个地道英文例句，并附中文翻译；
2. 讲解常见用法与固定搭配（介词搭配、习惯用法、常用句型）；
3. 指出特殊语法点、易错点，以及常见的近义词/形近词辨析；
4. 用 Markdown 分段排版，重点内容用 **加粗**，例句用斜体。

请直接输出讲解内容，不要输出任何思考过程。`

  function buildPrompt(text, wordInfo) {
    return String(text)
      .replaceAll('{word}', wordInfo.word || '')
      .replaceAll('{phonetic}', wordInfo.phonetic || '')
      .replaceAll('{pos}', wordInfo.pos || '')
      .replaceAll('{meaning}', wordInfo.meaning || '')
      .replaceAll('{exchange}', wordInfo.exchange || '')
  }

  // 流式请求：onDelta(reasoning 之外的正文增量)；异常抛 Error
  async function streamChat(options) {
    const settings = options.settings
    const onDelta = options.onDelta
    const base = String(settings.baseURL).replace(/\/+$/, '')
    const res = await fetch(base + '/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + settings.apiKey,
      },
      body: JSON.stringify({
        model: settings.model,
        messages: [{ role: 'user', content: options.prompt }],
        stream: true,
      }),
      signal: options.signal,
    })

    if (!res.ok || !res.body) {
      let detail = ''
      try {
        detail = await res.text()
      } catch (e) {
        /* 忽略 */
      }
      const msg = detail ? '：' + detail.slice(0, 200) : ''
      throw new Error('AI 请求失败 (' + res.status + ')' + msg)
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buf = ''
    for (;;) {
      const chunk = await reader.read()
      if (chunk.done) break
      buf += decoder.decode(chunk.value, { stream: true })
      let idx
      while ((idx = buf.indexOf('\n')) !== -1) {
        const line = buf.slice(0, idx).trim()
        buf = buf.slice(idx + 1)
        if (line.indexOf('data:') !== 0) continue
        const data = line.slice(5).trim()
        if (data === '[DONE]') return
        let j
        try {
          j = JSON.parse(data)
        } catch (e) {
          continue
        }
        const delta = j.choices && j.choices[0] && j.choices[0].delta
        if (!delta) continue
        // 跳过思考段（如 DeepSeek 的 reasoning_content）
        if (typeof delta.reasoning_content === 'string' && delta.reasoning_content) continue
        if (typeof delta.content === 'string' && delta.content) onDelta(delta.content)
      }
    }
  }

  W.ai = {
    DEFAULT_PROMPT: DEFAULT_PROMPT,
    buildPrompt: buildPrompt,
    streamChat: streamChat,
  }
})(window)
