let tarefasFeitas = 0;
let chart;

// ==== Pomodoro Timer ====
const pomodoroSection = document.getElementById('pomodoro');
const timerDisplay = document.createElement('h2');
const historicoTimer = document.querySelector('#historico-timer');
const historicoTimerHoras = document.querySelector('#historico-timer-horas');
const cicloDisplay = document.querySelector('#ciclos');
const pausaDisplay = document.querySelector('#pausas-historico');
const displayUltima = document.getElementById('ultima-execucao');

const controls = document.createElement('div');
controls.innerHTML = `
    <button id="start">Iniciar</button>
    <button id="pause">Pausar</button>
    <button id="reset">Resetar</button>
`;
pomodoroSection.appendChild(timerDisplay);
pomodoroSection.appendChild(controls);

const defaultTime = 25 * 60;
let time = parseInt(localStorage.getItem('time')) || defaultTime;
let isRunning = JSON.parse(localStorage.getItem('isRunning')) || false;
let dataTimer = parseInt(localStorage.getItem('dataTimer')) || 0;
let ciclos = parseInt(localStorage.getItem('ciclos')) || 0;
let pausas = parseInt(localStorage.getItem('pausas')) || 0;
let timerHoras = parseFloat(localStorage.getItem('timerHoras')) || 0;
let startTimestamp = parseInt(localStorage.getItem('startTimestamp')) || null;
let ultimaExecucao = localStorage.getItem('ultimaExecucao') || '--';
let interval;

historicoTimer.innerHTML = `${dataTimer} Minutos de estudos`;
cicloDisplay.innerHTML = `${ciclos} ${(ciclos > 1) ? "Ciclos" : "ciclo"}`;
pausaDisplay.innerHTML = pausas;
historicoTimerHoras.innerHTML = formatarHorasEMinutos(timerHoras);
displayUltima.textContent = `Último ciclo: ${ultimaExecucao}`;

function formatarHorasEMinutos(valorDecimal) {
    const horas = Math.floor(valorDecimal);
    const minutos = Math.round((valorDecimal - horas) * 60);
    return `${horas}h ${minutos}min`;
}

function salvarProgresso() {
    localStorage.setItem('time', time);
    localStorage.setItem('isRunning', JSON.stringify(isRunning));
    localStorage.setItem('dataTimer', dataTimer);
    localStorage.setItem('ciclos', ciclos);
    localStorage.setItem('pausas', pausas);
    localStorage.setItem('timerHoras', timerHoras);
    localStorage.setItem('startTimestamp', startTimestamp);
    localStorage.setItem('ultimaExecucao', ultimaExecucao);
    atualizarGrafico();
}

function updateDisplay() {
    const minutes = String(Math.floor(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

function retomarTimer() {
    const agora = Date.now();
    const tempoPassado = Math.floor((agora - startTimestamp) / 1000);
    time -= tempoPassado;

    if (time <= 0) {
        time = 0;
        isRunning = false;
        finalizarPomodoro();
        return;
    }

    updateDisplay();
    interval = setInterval(() => {
        if (time > 0) {
            time--;
            updateDisplay();
        } else {
            finalizarPomodoro();
        }
    }, 1000);
}

if (isRunning && startTimestamp) retomarTimer();
updateDisplay();

function finalizarPomodoro() {
    clearInterval(interval);
    alert("Pomodoro finalizado!");
    dataTimer += 25;
    ciclos++;
    timerHoras += 25 / 60;
    ultimaExecucao = new Date().toLocaleString("pt-BR");

    historicoTimer.innerHTML = `${dataTimer} Minutos de estudos`;
    cicloDisplay.innerHTML = `${ciclos} ${(ciclos > 1) ? "Ciclos" : "ciclo"}`;
    historicoTimerHoras.innerHTML = formatarHorasEMinutos(timerHoras);
    displayUltima.textContent = `Último ciclo: ${ultimaExecucao}`;

    time = defaultTime;
    isRunning = false;
    startTimestamp = null;
    salvarProgresso();
    updateDisplay();
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startTimestamp = Date.now();
        interval = setInterval(() => {
            if (time > 0) {
                time--;
                updateDisplay();
            } else {
                finalizarPomodoro();
            }
        }, 1000);
        salvarProgresso();
    }
}

function pauseTimer() {
    if (isRunning) {
        clearInterval(interval);
        isRunning = false;
        startTimestamp = null;
        pausas++;
        pausaDisplay.innerHTML = pausas;
        salvarProgresso();
        updateDisplay();
    }
}

function resetTimer() {
    clearInterval(interval);
    time = defaultTime;
    isRunning = false;
    startTimestamp = null;
    salvarProgresso();
    updateDisplay();
}

document.getElementById('start').addEventListener('click', startTimer);
document.getElementById('pause').addEventListener('click', pauseTimer);
document.getElementById('reset').addEventListener('click', resetTimer);

// ==== Lista de Tarefas ====
const form = document.querySelector('#form-tarefa');
const input = document.querySelector('#input-tarefa');
const lista = document.querySelector('#lista-tarefas');

function salvarTarefas() {
    const tarefas = [];
    tarefasFeitas = 0;

    document.querySelectorAll('#lista-tarefas li').forEach((li) => {
        const feito = li.classList.contains('clicado');
        tarefas.push({
            texto: li.querySelector('span').textContent,
            feito: feito
        });
        if (feito) tarefasFeitas++;
    });

    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    atualizarGrafico();
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

    salvarTarefas();
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

// ==== Gráfico de Progresso ====
const pgxCanvas = document.getElementById('progresso-grafico');
if (pgxCanvas) {
    const pgx = pgxCanvas.getContext('2d');
    chart = new Chart(pgx, {
        type: 'bar',
        data: {
            labels: ['Tempo de Estudo (Minutos)', 'Tarefas Concluídas'],
            datasets: [{
                label: 'Progresso',
                data: [dataTimer, tarefasFeitas],
                backgroundColor: ['rgba(59, 130, 246, 0.6)', 'red'],
                borderColor: 'rgb(0, 0, 0)',
                borderWidth: 1.5
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function atualizarGrafico() {
    if (chart) {
        chart.data.datasets[0].data[0] = dataTimer;
        chart.data.datasets[0].data[1] = tarefasFeitas;
        chart.update();
    }
}
