document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById('toggle-tema');
    const darkBtn = document.getElementById('dark-mode-btn');
    const img = darkBtn?.querySelector('img');

    const darkModeAtivado = localStorage.getItem('darkMode') === 'true';
    if (darkModeAtivado) {
        document.body.classList.add('dark-mode');
    }

    if (toggle) {
        toggle.checked = darkModeAtivado;
        toggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode');
            const ativo = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', ativo);
            if (img) img.src = ativo ? 'assets/preto.png' : 'assets/branco.png';
        });
    }

    if (darkBtn) {
        darkBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const ativo = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', ativo);
            if (img) img.src = ativo ? 'assets/preto.png' : 'assets/branco.png';
            if (toggle) toggle.checked = ativo;
        });

        if (img) {
            img.src = darkModeAtivado ? 'assets/preto.png' : 'assets/branco.png';
        }
    }
    // ==== Menu Responsivo ====
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('open');
        });
    }
});
