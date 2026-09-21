document.addEventListener("DOMContentLoaded", function() {
    // 获取所有轮播图元素
    const slides = document.querySelectorAll('.img .slide');
    let currentSlide = 0;
    const slideInterval = 3000; // 3秒切换一次

    // 切换幻灯片函数
    function nextSlide() {
        // 移除当前幻灯片的 active 类
        slides[currentSlide].classList.remove('active');
        // 计算下一张幻灯片索引
        currentSlide = (currentSlide + 1) % slides.length;
        // 添加 active 类显示下一张
        slides[currentSlide].classList.add('active');
    }

    // 启动自动轮播
    let autoPlay = setInterval(nextSlide, slideInterval);

    // 可选：添加鼠标悬停暂停功能
    const imgContainer = document.querySelector('.img');
    imgContainer.addEventListener('mouseenter', () => {
        clearInterval(autoPlay);
    });
    imgContainer.addEventListener('mouseleave', () => {
        autoPlay = setInterval(nextSlide, slideInterval);
    });
});