const loadingHTML = `
<div class="loading">
  <div class="loader"></div>
  <div class="loading-text">正在加载，请稍候...</div>
</div>
`;

const loadingCSS = `
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 9999;
  transition: opacity 0.5s ease-in-out;
}

.loader {
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-radius: 50%;
  /* border-top: 3px solid #3498db; 蓝色*/
  border-top: 3px solid #db4834;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.loading-text {
  color: #333;
  font-family: Arial, sans-serif;
  font-size: 1.2em;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.your-existing-content {
  opacity: 0;
  transition: opacity 0.3s;
}
`;

// 确保只插入一次
if (!document.querySelector('.loading')) {
  document.head.insertAdjacentHTML('beforeend', `<style>${loadingCSS}</style>`);
  document.body.insertAdjacentHTML('afterbegin', loadingHTML);
}

// 单例模式获取元素
let loaderElement = null;
function getLoader() {
  if (!loaderElement) {
    loaderElement = document.querySelector('.loading');
  }
  return loaderElement;
}

function showLoading() {
  const loader = document.querySelector('.loading');
  if (loader) {
    loader.style.display = 'flex';
    setTimeout(() => (loader.style.opacity = '1'), 10);
  }
}

function hideLoading() {
  const loader = document.querySelector('.loading');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => (loader.style.display = 'none'), 500);
  }
}


function handleNavigation(e) {
  const link = e.target.closest('a');
  if (!link) return;

  // 使用URL对象解析链接
  const url = new URL(link.href, window.location.href);
  const currentUrl = new URL(window.location.href);

  // 判断条件
  const isSameOrigin = url.origin === currentUrl.origin;
  const isSamePath = url.pathname === currentUrl.pathname;
  const hasHash = url.hash.length > 0;
  const excludePatterns = ['javascript:', 'mailto:', 'tel:'];
  const isSpecialLink = excludePatterns.some(p => link.href.startsWith(p));

  // 锚点有效性检测
  let isValidAnchor = false;
  if (isSameOrigin && isSamePath && hasHash) {
    const targetId = url.hash.substring(1); // 去除#号
    isValidAnchor = !!document.getElementById(targetId);
  }

  // 处理逻辑
  if (
    !isSameOrigin ||          // 跨域链接
    link.target === '_blank' || // 新标签页
    isSpecialLink ||          // 特殊协议
    (hasHash && !isValidAnchor) // 无效锚点
  ) {
    if (hasHash && !isValidAnchor) {
      e.preventDefault(); // 阻止无效锚点默认行为
    }
    return; // 放行其他情况
  }

  // 有效锚点处理
  if (isValidAnchor) {
    e.preventDefault();
    const targetElement = document.getElementById(url.hash.substring(1));
    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    return;
  }

  // 正常页面跳转
  e.preventDefault();
  showLoading();
  requestAnimationFrame(() => {
    setTimeout(() => {
      window.location.href = link.href;
    }, 50);
  });
}

// 初始化事件监听（确保唯一性）
document.removeEventListener('click', handleNavigation);
document.addEventListener('click', handleNavigation);

function hideLoading() {
  const loader = getLoader();
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 500);
  }
}

// 清理旧事件监听器
document.removeEventListener('click', handleNavigation);
document.addEventListener('click', handleNavigation);

// 优化加载完成处理
window.addEventListener('load', () => {
  hideLoading();
  clearTimeout(fallbackTimer);
});

// 安全回退机制
const fallbackTimer = setTimeout(hideLoading, 10000); // 10秒后强制隐藏

// 确保页面刷新时隐藏
window.addEventListener('beforeunload', hideLoading);