// 在index.js中添加
const menuToggle = document.createElement('div');
menuToggle.className = 'menu-toggle';
menuToggle.innerHTML = '<span></span><span></span><span></span>';
document.querySelector('.nav-content').prepend(menuToggle);

menuToggle.addEventListener('click', () => {
    document.querySelector('.list').classList.toggle('active');
    menuToggle.classList.toggle('active');
});