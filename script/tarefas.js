// ==== Variáveis ====
let tarefasFeitas = 0;
const form = document.querySelector('#form-tarefa');
const input = document.querySelector('#input-tarefa');
const lista = document.querySelector('#lista-tarefas');

// ==== Salva no LocalStorage ====
function salvarTarefas() {
    const tarefas = [];
    tarefasFeitas = 0;

    document.querySelectorAll('#lista-tarefas li').forEach((li) => {
        const feito = li.classList.contains('clicado');
        tarefas.push({
            texto: li.querySelector('span').textContent,
            feito
        });
        if (feito) tarefasFeitas++;
    });

    localStorage.setItem('tarefas', JSON.stringify(tarefas));

    if (typeof atualizarGrafico === "function") {
        atualizarGrafico(); // chama se a função existir
    }
}

// ==== Carrega do LocalStorage ====
function carregarTarefas() {
    const tarefasSalvas = localStorage.getItem('tarefas');
    if (!tarefasSalvas) return;

    const tarefas = JSON.parse(tarefasSalvas);
    tarefas.forEach(({ texto, feito }) => criarTarefa(texto, feito));

    salvarTarefas();
}

// ==== Cria elemento visual da tarefa ====
function criarTarefa(texto, feito = false) {
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
}

// ==== Inicializa Interface ====
if (form && input && lista) {
    carregarTarefas();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const texto = input.value.trim();
        if (texto === '') return;

        criarTarefa(texto);
        input.value = '';
        salvarTarefas();
    });
}

// ==== Exporta dados para gráfico ====
window.dadosTarefas = {
    get feitas() { return tarefasFeitas; }
};