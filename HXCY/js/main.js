// script.js
/**
 * 中华诗词网站核心逻辑
 * 数据源：GitHub chinese-poetry 开源库（分块加载）
 * 功能：诗词展示、搜索、朝代筛选、繁简转换
 */

// ==================== 全局变量 ====================
let allPoems = []; // 存储所有诗词数据（已转换简体）
const converter = OpenCC.Converter({ from: 'hk', to: 'cn' }); // 繁简转换器
const TANG_POEMS_COUNT = 10; // 唐诗分块数量（0-9）
const SONG_CI_COUNT = 10; // 宋词分块数量（0-9）

// ==================== 主初始化逻辑 ====================
window.onload = async function() {
    // 1. 加载诗词数据
    await loadAllPoems();
    
    // 2. 初始化每日推荐
    initDailyRecommend();
    
    // 3. 绑定搜索框回车事件
    document.getElementById('searchInput').addEventListener('keypress', e => {
        if (e.key === 'Enter') searchPoems();
    });
};

// ==================== 数据加载模块 ====================
/**
 * 分块加载诗词数据（避免单文件过大）
 */
async function loadAllPoems() {
    try {
        // 加载唐诗（分块加载 0-9）
        const tangPromises = Array.from({ length: TANG_POEMS_COUNT }, (_, i) =>
            fetch(`https://cdn.jsdelivr.net/gh/chinese-poetry/chinese-poetry/json/poet.tang.${i * 1000}.json`)
                .then(res => res.json())
                .catch(() => []) // 忽略加载失败的文件
        );

        // 加载宋词（分块加载 0-9）
        const songCiPromises = Array.from({ length: SONG_CI_COUNT }, (_, i) =>
            fetch(`https://cdn.jsdelivr.net/gh/chinese-poetry/chinese-poetry/ci/ci.song.${i * 1000}.json`)
                .then(res => res.json())
                .catch(() => []) // 忽略加载失败的文件
        );

        // 并行加载所有分块数据
        const [tangData, songCiData] = await Promise.all([
            Promise.all(tangPromises),
            Promise.all(songCiPromises)
        ]);

        // 合并并转换数据
        allPoems = [
            ...tangData.flat(),
            ...songCiData.flat()
        ].map((poem, index) => ({
            id: index, // 生成唯一ID
            title: converter(poem.title || '无题'),
            author: converter(poem.author || '未知'),
            paragraphs: (poem.paragraphs || []).map(p => converter(p)).filter(p => p.trim())
        }));

        console.log('诗词数据加载完成，总数:', allPoems.length);
    } catch (error) {
        console.error('数据加载失败:', error);
        alert('诗词加载失败，请刷新重试！');
    }
}

// ==================== 首页功能模块 ====================
/**
 * 初始化每日推荐（根据日期生成固定随机推荐）
 */
function initDailyRecommend() {
    const carousel = document.getElementById('carousel');
    if (!allPoems.length) return;

    // 基于日期的随机数生成（确保每日推荐相同）
    const today = new Date().toLocaleDateString();
    const seed = today.split('/').join('');
    const poem = allPoems[parseInt(seed) % allPoems.length];

    // 生成推荐卡片HTML
    carousel.innerHTML = `
        <div class="poem-card" onclick="showDetail(${poem.id})">
            <h3>${poem.title}</h3>
            <p>${poem.author}</p>
            <div class="preview">${poem.paragraphs.slice(0, 2).join('<br>')}</div>
        </div>
    `;
}

// ==================== 搜索功能模块 ====================
/**
 * 执行搜索（支持标题、作者、正文关键词）
 */
function searchPoems() {
    const keyword = document.getElementById('searchInput').value.trim().toLowerCase();
    if (!keyword) return alert('请输入搜索关键词！');

    // 计算匹配度评分
    const results = allPoems.map(poem => {
        let score = 0;
        const content = poem.paragraphs.join('');
        
        // 评分规则：标题3分，作者2分，正文1分/匹配
        if (poem.title.toLowerCase().includes(keyword)) score += 3;
        if (poem.author.toLowerCase().includes(keyword)) score += 2;
        score += (content.match(new RegExp(keyword, 'g')) || []).length;
        
        return { poem, score };
    }).filter(item => item.score > 0) // 过滤0分结果
      .sort((a, b) => b.score - a.score); // 按评分降序

    displayResults(results);
}

/**
 * 显示搜索结果（每页10条）
 */
function displayResults(results) {
    const container = document.getElementById('searchResults');
    if (!results.length) {
        container.innerHTML = '<p class="no-result">未找到相关诗词</p>';
        return;
    }

    // 生成结果卡片（示例只显示第一页）
    container.innerHTML = results.slice(0, 10).map(({ poem }) => `
        <div class="poem-card" onclick="showDetail(${poem.id})">
            <h3>${poem.title}</h3>
            <p>${poem.author}</p>
            <div class="preview">${poem.paragraphs[0]?.slice(0, 30) || '...'}</div>
        </div>
    `).join('');
}

// ==================== 朝代筛选模块 ====================
/**
 * 按朝代筛选诗词（适配远程数据格式）
 * 示例数据作者格式："[唐] 李白"
 */
function filterByDynasty(dynasty) {
    const results = allPoems.filter(poem => {
        if (!dynasty) return true; // 显示全部
        return poem.author.startsWith(`[${dynasty}]`);
    });
    displayResults(results.map(poem => ({ poem, score: 1 })));
}

// ==================== 详情展示模块 ====================
/**
 * 显示诗词详情弹窗
 */
function showDetail(id) {
    const poem = allPoems.find(p => p.id === id);
    if (!poem) return;

    const modal = document.getElementById('poemDetail');
    document.getElementById('detailTitle').textContent = poem.title;
    document.getElementById('detailAuthor').textContent = `作者：${poem.author}`;
    document.getElementById('detailContent').innerHTML = poem.paragraphs.join('<br>');
    modal.style.display = 'block';
}

/**
 * 关闭详情弹窗
 */
function closeDetail() {
    document.getElementById('poemDetail').style.display = 'none';
}





/*=====================================================================================*/







//原始获取本地文件代码（已废弃）
/*


// 初始化变量
let allPoems = []; // 存储所有诗歌数据
const converter = OpenCC.Converter({ from: 'hk', to: 'cn' }); // 繁转简转换器

// 页面加载完成后执行
window.onload = async function() {
    // 加载所有JSON文件
    await loadAllPoems();
    
    // 初始化每日推荐
    initDailyRecommend();
    
    // 监听搜索输入回车键
    document.getElementById('searchInput').addEventListener('keypress', e => {
        if (e.key === 'Enter') searchPoems();
    });
};

// 加载所有JSON文件
async function loadAllPoems() {
    try {
        // 获取所有JSON文件（假设文件名为 poems_1.json, poems_2.json 等）
        const response = await fetch('./res/poet.song.1000.json'); // 根据实际文件修改
        const data = await response.json();
        allPoems = data.map(poem => ({
            ...poem,
            // 转换繁体字段为简体
            title: converter(poem.title),
            author: converter(poem.author),
            paragraphs: poem.paragraphs.map(p => converter(p))
        }));
    } catch (error) {''
        console.error('加载诗词数据失败:', error);
    }
}

// 初始化每日推荐
function initDailyRecommend() {
    const carousel = document.getElementById('carousel');
    // 根据日期生成随机数（确保每日相同）
    const today = new Date().toISOString().slice(0, 10);
    const seed = today.split('-').join('');
    const index = parseInt(seed) % allPoems.length;
    
    const poem = allPoems[index];
    const html = `
        <div class="poem-card" onclick="showDetail('${poem.id}')">
            <h3>${poem.title}</h3>
            <p>${poem.author}</p>
            <div class="preview">${poem.paragraphs.slice(0, 2).join('<br>')}</div>
        </div>
    `;
    carousel.innerHTML = html;
}

// 搜索诗词
function searchPoems() {
    const keyword = document.getElementById('searchInput').value.trim().toLowerCase();
    if (!keyword) return;
    
    // 计算匹配度
    const results = allPoems.map(poem => {
        let score = 0;
        if (poem.title.toLowerCase().includes(keyword)) score += 3;
        if (poem.author.toLowerCase().includes(keyword)) score += 2;
        if (poem.paragraphs.join('').includes(keyword)) score += 1;
        return { poem, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);
    
    displayResults(results);
}

// 显示搜索结果
function displayResults(results) {
    const container = document.getElementById('searchResults');
    container.innerHTML = results.slice(0, 10).map(({ poem }) => `
        <div class="poem-card" onclick="showDetail('${poem.id}')">
            <h3>${poem.title}</h3>
            <p>${poem.author}</p>
            <div class="preview">${poem.paragraphs[0]}</div>
        </div>
    `).join('');
}

// 显示诗词详情
function showDetail(id) {
    const poem = allPoems.find(p => p.id === id);
    if (!poem) return;
    
    const modal = document.getElementById('poemDetail');
    document.getElementById('detailTitle').textContent = poem.title;
    document.getElementById('detailAuthor').textContent = `作者：${poem.author}`;
    document.getElementById('detailContent').innerHTML = poem.paragraphs.join('<br>');
    modal.style.display = 'block';
}

// 关闭详情弹窗
function closeDetail() {
    document.getElementById('poemDetail').style.display = 'none';
}

// 按朝代筛选
function filterByDynasty(dynasty) {
    const results = allPoems.filter(poem => 
        dynasty ? poem.author.includes(`${dynasty}代`) : true
    );
    displayResults(results.map(poem => ({ poem, score: 1 })));
}





*/