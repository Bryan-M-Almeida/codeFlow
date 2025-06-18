const inputClear = document.querySelector('#resetar');

inputClear.addEventListener('click', function () {
    const confirmacao = prompt('Tem certeza? (1:sim 2: não)');

    if (confirmacao == '1') {
        localStorage.clear();
        alert('dados apagados');
        location.reload();
    } else{
        alert('Dados intactos')
    }



})