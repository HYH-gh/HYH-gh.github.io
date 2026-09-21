
    const container = document.getElementById('container');
    const img = document.getElementById('myImage');

    // 更新容器高度的函数
    function updateContainerHeight() {
      const imgHeight = img.offsetHeight;
      container.style.height = `${imgHeight}px`;
    }

    // 图片加载完成后设置高度
    img.addEventListener('load', updateContainerHeight);

    // 若图片已缓存，直接触发
    if (img.complete) updateContainerHeight();

    // 窗口变化时重新设置高度
    window.addEventListener('resize', updateContainerHeight);