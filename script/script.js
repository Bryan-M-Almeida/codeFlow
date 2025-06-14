const btnMode = document.querySelector('#dark-mode-btn')
const img = document.querySelector('.icone')

btnMode.addEventListener('click', function () {
    if (img.src.includes('branco.png')) {
        img.src = 'assets/preto.png'
    } else {
        img.src = 'assets/branco.png'
    }

    document.body.classList.toggle('dark-mode')
})

