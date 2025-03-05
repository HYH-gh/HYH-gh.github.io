// script.js
// 配置信息
const CONFIG = {
    BASE_URL: 'https://hyh-gh.github.io/chinese-poetry-master/',
    CACHE_KEY: 'poetryCache',
    CACHE_EXPIRE: 86400000 // 24小时
};

// 初始化转换器（繁体转简体）
const converter = new OpenCC.Converter('t2s');

// 诗词数据缓存
let poetryCache = {
    data: {},
    timestamp: Date.now()
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    checkCache();
    showDailyRecommend();
});

// 检查缓存有效性
function checkCache() {
    const cache = localStorage.getItem(CONFIG.CACHE_KEY);
    if (cache) {
        const { data, timestamp } = JSON.parse(cache);
        if (Date.now() - timestamp < CONFIG.CACHE_EXPIRE) {
            poetryCache = { data, timestamp };
        }
    }
}

// 通用数据获取函数
async function fetchPoetryData(category, page = 0) {
    const cacheKey = `${category}_${page}`;
    
    // 检查缓存
    if (poetryCache.data[cacheKey]) {
        return poetryCache.data[cacheKey];
    }

    try {
        const response = await fetch(`${CONFIG.BASE_URL}${category}/ci.song.${page}.json`);
        const data = await response.json();
        
        // 转换繁体到简体
        const simplifiedData = data.map(poem => ({
            ...poem,
            title: converter.convert(poem.title),
            author: converter.convert(poem.author),
            paragraphs: poem.paragraphs.map(p => converter.convert(p))
        }));

        // 更新缓存
        poetryCache.data[cacheKey] = simplifiedData;
        localStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify(poetryCache));
        
        return simplifiedData;
    } catch (error) {
        console.error('获取诗词数据失败:', error);
        return [];
    }
}

// 显示每日推荐
async function showDailyRecommend() {
    const carousel = document.getElementById('carousel');
    const today = new Date().getDate();
    
    // 获取随机诗词数据
    const data = await fetchPoetryData('宋词', Math.floor(Math.random() * 4) * 1000);
    
    // 生成轮播内容
    carousel.innerHTML = data.slice(0, 5).map((poem, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <h3>${poem.title}</h3>
            <p class="author">${poem.author}</p>
            <div class="excerpt">${poem.paragraphs.slice(0, 2).join('<br>')}</div>
            <button onclick="showPoetryDetail('${poem.id}')">查看详情</button>
        </div>
    `).join('');

    // 启动轮播动画
    startCarousel();
}

// 搜索处理函数
async function handleSearch() {
    const keyword = document.getElementById('searchInput').value.trim();
    if (!keyword) return;

    // 实现搜索逻辑（需要遍历所有可能的数据源）
    const results = [];
    // 示例搜索（实际需要遍历所有朝代和分页）
    const data = await fetchPoetryData('宋词', 0);
    results.push(...data.filter(poem => 
        poem.title.includes(keyword) ||
        poem.author.includes(keyword) ||
        poem.paragraphs.some(p => p.includes(keyword))
    ));

    displaySearchResults(results);
}

// 显示搜索结果
function displaySearchResults(results, page = 1) {
    const itemsPerPage = 10;
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    
    document.getElementById('resultList').innerHTML = results
        .slice(start, end)
        .map(poem => `
            <div class="result-item">
                <h4>${poem.title}</h4>
                <p class="author">${poem.author}</p>
                <p class="excerpt">${poem.paragraphs[0].substring(0, 30)}...</p>
                <button onclick="showPoetryDetail('${poem.id}')">查看</button>
            </div>
        `).join('');

    // 生成分页按钮
    const totalPages = Math.ceil(results.length / itemsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = Array.from({length: totalPages}, (_, i) => `
        <button ${i+1 === page ? 'disabled' : ''} onclick="displaySearchResults(results, ${i+1})">
            ${i+1}
        </button>
    `).join('');
}

// 显示诗词详情
function showPoetryDetail(poemId) {
    // 实现详情查找和显示逻辑
    // （需要遍历缓存数据查找对应ID的诗词）
}

// 轮播动画控制
function startCarousel() {
    let currentIndex = 0;
    const items = document.querySelectorAll('.carousel-item');
    
    setInterval(() => {
        items[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % items.length;
        items[currentIndex].classList.add('active');
    }, 5000);
}