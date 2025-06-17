document.addEventListener("DOMContentLoaded", () => {
    // ==== Menu Responsivo ====
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('open');
        });
    }
});