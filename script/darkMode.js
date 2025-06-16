document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById('toggle-tema');
    if (toggle) {
        toggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode');
        });
    }
});

const darkBtn = document.getElementById('dark-mode-btn');
const img = darkBtn.querySelector('img');

darkBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    img.src = document.body.classList.contains('dark-mode')
        ? 'assets/preto.png'
        : 'assets/branco.png';
});