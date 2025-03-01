// 1. 定义JSON文件列表（需手动添加所有文件名）
const jsonFiles = [
    'poet.song.1000.json'
    // 添加其他JSON文件名...
];

// 2. 加载并合并所有诗歌数据
let allPoems = [];

async function loadPoems() {
    for (const file of jsonFiles) {
        const response = await fetch(`res/${file}`);
        const data = await response.json();
        allPoems = allPoems.concat(data);
    }
    // 初始加载全部数据
    displayResults(allPoems);
}

// 3. 实现搜索功能
function searchPoems(keyword) {
    const lowerKeyword = keyword.toLowerCase();
    return allPoems.filter(poem => {
        const title = poem.title?.toLowerCase() || '';
        const author = poem.author?.toLowerCase() || '';
        const tags = poem.tags?.join(' ')?.toLowerCase() || '';
        return title.includes(lowerKeyword) || 
               author.includes(lowerKeyword) || 
               tags.includes(lowerKeyword);
    });
}

// 4. 显示搜索结果
function displayResults(poems) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    poems.forEach(poem => {
        const poemEl = document.createElement('div');
        poemEl.className = 'poem-item';
        
        // 拼接内容
        const content = poem.paragraphs.join('\n');
        const preview = content.slice(0, 100) + (content.length > 100 ? '...' : '');

        poemEl.innerHTML = `
            <div class="poem-title">${poem.title || '无题'}</div>
            <div class="poem-author">${poem.author || '未知作者'}</div>
            <div class="poem-preview">${preview}</div>
            ${poem.tags ? `<div class="poem-tags">关键词：${poem.tags.join(', ')}</div>` : ''}
        `;

poems.forEach(poem => {
        // 添加自动转换逻辑
        const title = convertText(poem.title || '無題');
        const author = convertText(poem.author || '未知作者');
        const content = poem.paragraphs.join('\n');
        const preview = convertText(content.slice(0, 100)) + (content.length > 100 ? '...' : '');
        const tags = poem.tags ? convertText(poem.tags.join(', ')) : '';

        poemEl.innerHTML = `
            <div class="poem-title">${title}</div>
            <div class="poem-author">${author}</div>
            <div class="poem-preview">${preview}</div>
            ${tags ? `<div class="poem-tags">關鍵詞：${tags}</div>` : ''}
        `;
        resultsDiv.appendChild(poemEl);
    });
}

// 5. 输入监听
document.getElementById('searchInput').addEventListener('input', (e) => {
    const keyword = e.target.value.trim();
    const results = keyword ? searchPoems(keyword) : allPoems;
    displayResults(results);
});

// 初始化加载数据
loadPoems();


// 在 app.js 中添加以下代码

// 初始化转换器（繁转简）
const converter = OpenCC.Converter({ from: 'tw', to: 'cn' });
let isSimplified = false; // 当前是否为简体

// 转换单个字符串
function convertText(text) {
    return isSimplified ? converter(text) : text;
}

// 转换整个页面内容
function convertAllElements() {
    // 转换界面文字
    document.getElementById('toggleLang').textContent = 
        isSimplified ? '切換到繁體' : '切換到简体';
    document.getElementById('searchInput').placeholder = 
        isSimplified ? '输入标题、作者或关键词...' : '輸入標題、作者或關鍵詞...';

    // 转换诗歌内容
    document.querySelectorAll('.poem-title, .poem-author, .poem-preview, .poem-tags').forEach(el => {
        el.textContent = convertText(el.textContent);
    });
}

// 切换按钮点击事件
document.getElementById('toggleLang').addEventListener('click', () => {
    isSimplified = !isSimplified;
    convertAllElements();
    localStorage.setItem('langMode', isSimplified ? 'cn' : 'tw'); // 保存状态
});

// 初始化时读取状态
const savedLang = localStorage.getItem('langMode');
if (savedLang === 'cn') {
    isSimplified = true;
    setTimeout(convertAllElements, 100); // 延迟确保DOM加载完成
}