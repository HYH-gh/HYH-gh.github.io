/* =========================================================
   utils.js —— 确定性乱序、本地存储、文本格式化
   ========================================================= */
(function (global) {
  'use strict'

  const W = (global.W = global.W || {})

  /* ---------------- 本地存储键 ---------------- */
  const SEED_KEY = 'words.seedText.v1'
  const SHUFFLE_KEY = 'words.shuffleOn.v1'
  const PRESET_KEY = 'words.preset.v1'
  const CUSTOMS_KEY = 'words.customs.v1'
  const AI_KEY = 'words.ai.v1'
  const AI_PROMPT_KEY = 'words.ai.prompt.v1'
  const AI_CACHE_KEY = 'words.ai.cache.v1'

  /* ---------------- 确定性乱序 ---------------- */

  // FNV-1a 32-bit 哈希：把任意文本映射为一个 32 位无符号整数种子
  function hashText(str) {
    let h = 0x811c9dc5
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i)
      h = Math.imul(h, 0x01000193)
      h >>>= 0
    }
    return h >>> 0
  }

  // mulberry32：32 位种子的确定性伪随机数生成器，返回 [0,1) 区间
  function mulberry32(seed) {
    let a = seed >>> 0
    return function () {
      a |= 0
      a = (a + 0x6d2b79f5) | 0
      let t = Math.imul(a ^ (a >>> 15), 1 | a)
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
  }

  // 确定性洗牌（Fisher–Yates），不修改原数组
  function seededShuffle(arr, seed) {
    const rng = mulberry32(hashText(String(seed)))
    const a = arr.slice()
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      const t = a[i]
      a[i] = a[j]
      a[j] = t
    }
    return a
  }

  /* ---------------- 种子 / 开关持久化 ---------------- */
  function loadSeedText() {
    try {
      return localStorage.getItem(SEED_KEY) || ''
    } catch (e) {
      return ''
    }
  }
  function saveSeedText(s) {
    try {
      if (s) localStorage.setItem(SEED_KEY, s)
      else localStorage.removeItem(SEED_KEY)
    } catch (e) {
      /* 忽略存储不可用 */
    }
  }

  function loadShuffleOn() {
    try {
      return localStorage.getItem(SHUFFLE_KEY) === '1'
    } catch (e) {
      return false
    }
  }
  function saveShuffleOn(on) {
    try {
      if (on) localStorage.setItem(SHUFFLE_KEY, '1')
      else localStorage.removeItem(SHUFFLE_KEY)
    } catch (e) {
      /* 忽略存储不可用 */
    }
  }

  /* ---------------- 页码持久化（按分级分别记忆） ---------------- */
  function pageKey(key) {
    return 'words.page.' + key
  }
  function loadPage(key) {
    try {
      const n = parseInt(localStorage.getItem(pageKey(key)), 10)
      return Number.isFinite(n) && n > 0 ? n : 1
    } catch (e) {
      return 1
    }
  }
  function savePage(key, page) {
    try {
      localStorage.setItem(pageKey(key), String(page))
    } catch (e) {
      /* 忽略存储不可用 */
    }
  }

  /* ---------------- 布局预设持久化 ---------------- */
  function loadPreset() {
    try {
      return localStorage.getItem(PRESET_KEY) || 'normal'
    } catch (e) {
      return 'normal'
    }
  }
  function savePreset(key) {
    try {
      localStorage.setItem(PRESET_KEY, key)
    } catch (e) {
      /* 忽略存储不可用 */
    }
  }

  /* ---------------- 文本格式化 ---------------- */

  // 音标统一用双斜线包裹：/ʃ../
  function phon(str) {
    if (!str) return ''
    const s = String(str).replace(/^[/\\]|[/\\]$/g, '').trim()
    return '/' + s + '/'
  }

  // 把释义拆成多行：兼容真实换行与字面量 \n（数据里历史遗留的 "\n" 两个字符）
  function meaningLines(str) {
    if (!str) return []
    const s = String(str)
      .replace(/\\r\\n/g, '\n')
      .replace(/\\r/g, '\n')
      .replace(/\\n/g, '\n')
    return s
      .split('\n')
      .map(function (l) {
        return l.trim()
      })
      .filter(Boolean)
  }

  /* ---------------- 自定义分级定义持久化 ---------------- */
  // 每项：{ id, name, inc:[分级key], exc:[分级key] }
  function loadCustoms() {
    try {
      const list = JSON.parse(localStorage.getItem(CUSTOMS_KEY))
      return Array.isArray(list) ? list : []
    } catch (e) {
      return []
    }
  }
  function saveCustoms(list) {
    try {
      localStorage.setItem(CUSTOMS_KEY, JSON.stringify(list))
    } catch (e) {
      /* 忽略存储不可用 */
    }
  }

  /* ---------------- AI 供应商配置 ---------------- */
  // 仅做 base64 混淆，避免明文直露；真正的安全无法在前端保证，用户可随时清除
  function obfuscate(str) {
    return btoa(unescape(encodeURIComponent(str)))
  }
  function deobfuscate(str) {
    try {
      return decodeURIComponent(escape(atob(str)))
    } catch (e) {
      return ''
    }
  }

  function aiConfigured(settings) {
    return !!settings && !!(settings.baseURL && settings.apiKey && settings.model)
  }

  function loadAISettings() {
    try {
      const raw = JSON.parse(localStorage.getItem(AI_KEY))
      return {
        baseURL: (raw && raw.baseURL) || '',
        apiKey: raw && raw.apiKey ? deobfuscate(raw.apiKey) : '',
        model: (raw && raw.model) || '',
      }
    } catch (e) {
      return { baseURL: '', apiKey: '', model: '' }
    }
  }
  function saveAISettings(settings) {
    try {
      localStorage.setItem(
        AI_KEY,
        JSON.stringify({
          baseURL: settings.baseURL || '',
          apiKey: settings.apiKey ? obfuscate(settings.apiKey) : '',
          model: settings.model || '',
        })
      )
    } catch (e) {
      /* 忽略存储不可用 */
    }
  }
  function clearAISettings() {
    try {
      localStorage.removeItem(AI_KEY)
    } catch (e) {
      /* 忽略存储不可用 */
    }
  }

  function loadAIPrompt() {
    try {
      return localStorage.getItem(AI_PROMPT_KEY) || ''
    } catch (e) {
      return ''
    }
  }
  function saveAIPrompt(p) {
    try {
      if (p) localStorage.setItem(AI_PROMPT_KEY, p)
      else localStorage.removeItem(AI_PROMPT_KEY)
    } catch (e) {
      /* 忽略存储不可用 */
    }
  }

  /* ---------------- AI 讲解结果缓存（按 model:word 记录） ---------------- */
  function loadAICache() {
    try {
      return JSON.parse(localStorage.getItem(AI_CACHE_KEY)) || {}
    } catch (e) {
      return {}
    }
  }
  function saveAICache(cache) {
    try {
      localStorage.setItem(AI_CACHE_KEY, JSON.stringify(cache))
    } catch (e) {
      /* 忽略存储不可用 */
    }
  }
  function clearAICache() {
    try {
      localStorage.removeItem(AI_CACHE_KEY)
    } catch (e) {
      /* 忽略存储不可用 */
    }
  }

  global.W.utils = {
    hashText: hashText,
    mulberry32: mulberry32,
    seededShuffle: seededShuffle,
    loadSeedText: loadSeedText,
    saveSeedText: saveSeedText,
    loadShuffleOn: loadShuffleOn,
    saveShuffleOn: saveShuffleOn,
    loadPage: loadPage,
    savePage: savePage,
    loadPreset: loadPreset,
    savePreset: savePreset,
    phon: phon,
    meaningLines: meaningLines,
    loadCustoms: loadCustoms,
    saveCustoms: saveCustoms,
    aiConfigured: aiConfigured,
    loadAISettings: loadAISettings,
    saveAISettings: saveAISettings,
    clearAISettings: clearAISettings,
    loadAIPrompt: loadAIPrompt,
    saveAIPrompt: saveAIPrompt,
    loadAICache: loadAICache,
    saveAICache: saveAICache,
    clearAICache: clearAICache,
  }
})(window)
