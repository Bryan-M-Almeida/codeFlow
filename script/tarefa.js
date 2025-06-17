document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('form-tarefa');
    const input = document.getElementById('input-tarefa');
    const lista = document.getElementById('lista-tarefas');

    function salvarTarefas() {
        const tarefas = [];
        document.querySelectorAll('#lista-tarefas li').forEach((li) => {
            tarefas.push({
                texto: li.querySelector('span').textContent,
                feito: li.classList.contains('clicado')
            });
        });
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
    }

    function carregarTarefas() {
        const tarefasSalvas = localStorage.getItem('tarefas');
        if (!tarefasSalvas) return;

        const tarefas = JSON.parse(tarefasSalvas);
        tarefas.forEach(({ texto, feito }) => {
            const li = document.createElement('li');

            const spanTexto = document.createElement('span');
            spanTexto.textContent = texto;

            const btnRemover = document.createElement('button');
            btnRemover.textContent = '✖';
            btnRemover.style.marginLeft = '1rem';
            btnRemover.onclick = (event) => {
                event.stopPropagation();
                li.remove();
                salvarTarefas();
            };

            li.appendChild(spanTexto);
            li.appendChild(btnRemover);

            if (feito) li.classList.add('clicado');

            li.addEventListener("click", () => {
                li.classList.toggle('clicado');
                salvarTarefas();
            });

            lista.appendChild(li);
        });
    }

    if (form && input && lista) {
        carregarTarefas();

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
                salvarTarefas();
            };

            li.appendChild(spanTexto);
            li.appendChild(btnRemover);

            li.addEventListener("click", () => {
                li.classList.toggle('clicado');
                salvarTarefas();
            });

            lista.appendChild(li);
            input.value = '';

            salvarTarefas();
        });
    }
});
