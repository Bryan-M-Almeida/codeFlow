document.addEventListener("DOMContentLoaded", () => {
    // ==== Lista de Tarefas ====
    const form = document.getElementById('form-tarefa');
    const input = document.getElementById('input-tarefa');
    const lista = document.getElementById('lista-tarefas');

    if (form && input && lista) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (input.value.trim() === '') return;

            const li = document.createElement('li');

            const spanTexto = document.createElement('span');
            spanTexto.textContent = input.value;

            const btnRemover = document.createElement('button');
            btnRemover.textContent = '✖';
            btnRemover.style.marginLeft = '1rem';
            btnRemover.onclick = (event) => {
                event.stopPropagation();
                li.remove();
            };

            li.appendChild(spanTexto);
            li.appendChild(btnRemover);

            li.addEventListener("click", () => {
                li.classList.toggle('clicado');
            });

            lista.appendChild(li);
            input.value = '';
        });
    }

});