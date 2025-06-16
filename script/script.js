const menuToggle = document.querySelector('.menu-toggle');
const navList = document.querySelector('.nav-list');

menuToggle.addEventListener('click', () => {
    navList.classList.toggle('open');
});

let estudo = document.querySelector('#inputEstudos');
let freela = document.querySelector('#inputFreela');
let projetos = document.querySelector('#inputProjeto');

const form = document.getElementById('form-tarefa');
const input = document.getElementById('input-tarefa');
const lista = document.getElementById('lista-tarefas');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (input.value.trim() === '') return;

    const li = document.createElement('li');

    // cria um span separado só pro texto
    const spanTexto = document.createElement('span');
    spanTexto.textContent = input.value;

    // botão de remover
    const btnRemover = document.createElement('button');
    btnRemover.textContent = '✖';
    btnRemover.style.marginLeft = '1rem';
    btnRemover.onclick = (event) => {
        event.stopPropagation(); // evita riscar ao clicar no botão
        li.remove();
    };

    // adiciona o texto e o botão no li
    li.appendChild(spanTexto);
    li.appendChild(btnRemover);

    // evento pra riscar o texto quando clicar no li
    li.addEventListener("click", function () {
        li.classList.toggle('clicado');
    });

    lista.appendChild(li);
    input.value = '';

});

// ==== Pomodoro Timer ====
const pomodoroSection = document.getElementById('pomodoro');
const timerDisplay = document.createElement('h2');
timerDisplay.textContent = '25:00';
pomodoroSection.appendChild(timerDisplay);

let time = 25 * 60; // 25 minutos
let isRunning = false;
let interval;

const controls = document.createElement('div');
controls.innerHTML = `
    <button id="start">Iniciar</button>
    <button id="pause">Pausar</button>
    <button id="reset">Resetar</button>
`;
pomodoroSection.appendChild(controls);

function updateDisplay() {
    const minutes = String(Math.floor(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        interval = setInterval(() => {
            if (time > 0) {
                time--;
                updateDisplay();
            } else {
                clearInterval(interval);
                alert("Pomodoro finalizado!");
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(interval);
    isRunning = false;
}

function resetTimer() {
    clearInterval(interval);
    time = 25 * 60;
    isRunning = false;
    updateDisplay();
}

document.getElementById('start').addEventListener('click', startTimer);
document.getElementById('pause').addEventListener('click', pauseTimer);
document.getElementById('reset').addEventListener('click', resetTimer);
updateDisplay();


// ==== Gráfico de Progresso ====
const pgx = document.getElementById('progresso-grafico').getContext('2d');
const progressoGrafico = new Chart(pgx, {
    type: 'bar',
    data: {
        labels: ['Tarefas', 'Tempo de Estudo'],
        datasets: [{
            label: 'Minutos focados',
            data: [0],
            backgroundColor: 'rgba(59, 130, 246, 0.6)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// ==== Gráfico total ====
const ctx = document.getElementById('grafico').getContext('2d');
const grafico = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
        datasets: [{
            label: 'Minutos focados',
            data: [0],
            backgroundColor: 'rgba(59, 130, 246, 0.6)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});