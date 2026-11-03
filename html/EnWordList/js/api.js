/* =========================================================
   api.js —— 数据访问层
   ---------------------------------------------------------
   数据用 <script> 注入而不是 fetch：
   file:// 下浏览器禁止 fetch 读取本地文件（会报 "Failed to fetch"），
   但允许加载同目录脚本。这样双击 index.html 也能正常工作。

   数据文件由 tools/build-data.mjs 从 data/web/*.json 生成，
   内容形如 window.__WORD_DATA__['meta'] = {...}。
   每个文件只加载一次，结果同时保留在内存里。
   ========================================================= */
(function (global) {
  'use strict'

  const W = (global.W = global.W || {})

  // 相对路径：站点可放在任意子目录，与 index.html 同级部署
  const DATA_DIR = './data/'
  const store = (global.__WORD_DATA__ = global.__WORD_DATA__ || {})
  const pending = new Map()

  function load(name) {
    if (store[name]) return Promise.resolve(store[name])
    if (pending.has(name)) return pending.get(name)

    const promise = new Promise(function (resolve, reject) {
      const script = document.createElement('script')
      script.src = DATA_DIR + name + '.js'
      script.async = true
      script.onload = function () {
        script.remove()
        if (store[name]) resolve(store[name])
        else reject(new Error('data/' + name + '.js 中没有 ' + name + ' 数据'))
      }
      script.onerror = function () {
        script.remove()
        reject(new Error('加载 data/' + name + '.js 失败，请确认该文件存在'))
      }
      document.head.appendChild(script)
    })

    pending.set(name, promise)
    // 失败后允许重试，成功则一直复用
    promise.catch(function () {
      pending.delete(name)
    })
    return promise
  }

  /* ---------------- 元信息 ---------------- */
  let metaPromise = null
  function getMeta() {
    if (!metaPromise) metaPromise = load('meta')
    return metaPromise
  }

  /* ---------------- 分级词表 ---------------- */
  let levelsPromise = null
  function getLevels() {
    if (!levelsPromise) levelsPromise = load('levels')
    return levelsPromise
  }
  async function getLevel(key) {
    const all = await getLevels()
    return all[key] || null
  }

  // 自定义分级集合：取 included 各分级单词的并集，减去 excluded 各分级的并集
  async function computeCustomWords(included, excluded) {
    const all = await getLevels()
    const base = new Set()
    for (const k of included) {
      const words = all[k] && all[k].words
      if (Array.isArray(words)) for (const w of words) base.add(w)
    }
    const drop = new Set()
    for (const k of excluded) {
      const words = all[k] && all[k].words
      if (Array.isArray(words)) for (const w of words) drop.add(w)
    }
    const result = []
    for (const w of base) if (!drop.has(w)) result.push(w)
    result.sort()
    return result
  }

  /* ---------------- 单词释义 ---------------- */
  let wordsPromise = null
  function getWords() {
    if (!wordsPromise) wordsPromise = load('words')
    return wordsPromise
  }
  async function getWord(word) {
    const all = await getWords()
    return all[String(word).toLowerCase()] || null
  }

  /* ---------------- 单词 → 所属分级 ---------------- */
  let indexPromise = null
  function getIndex() {
    if (!indexPromise) indexPromise = load('index')
    return indexPromise
  }
  async function getLevelsOf(word) {
    const all = await getIndex()
    return all[String(word).toLowerCase()] || []
  }

  /* ---------------- 全局搜索 ---------------- */
  // 前缀优先，其次包含匹配；返回前 limit 条
  async function search(q, limit) {
    const max = limit || 60
    const query = String(q).trim().toLowerCase()
    if (!query) return []
    const all = await getIndex()
    const keys = Object.keys(all)
    const prefix = []
    const substr = []
    for (const w of keys) {
      if (w.startsWith(query)) prefix.push(w)
      else if (w.indexOf(query) !== -1) substr.push(w)
    }
    prefix.sort(function (a, b) {
      return a.length - b.length
    })
    substr.sort(function (a, b) {
      return a.length - b.length
    })
    return prefix.concat(substr).slice(0, max).map(function (w) {
      return { word: w, levels: all[w] }
    })
  }

  W.api = {
    getMeta: getMeta,
    getLevels: getLevels,
    getLevel: getLevel,
    computeCustomWords: computeCustomWords,
    getWords: getWords,
    getWord: getWord,
    getIndex: getIndex,
    getLevelsOf: getLevelsOf,
    search: search,
  }
})(window)
