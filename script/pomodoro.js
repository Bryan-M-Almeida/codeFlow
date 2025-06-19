const somAlarme = new Audio("assets/alarme.ogg");

// ==== Elementos DOM ====
const pomodoroSection = document.getElementById('pomodoro');
const historicoTimer = document.querySelector('#historico-timer');
const historicoTimerHoras = document.querySelector('#historico-timer-horas');
const cicloDisplay = document.querySelector('#ciclos');
const pausaDisplay = document.querySelector('#pausas-historico');
const displayUltima = document.getElementById('ultima-execucao');

const timerDisplay = document.createElement('h2');
pomodoroSection.appendChild(timerDisplay);

// Cria os botões
const controls = document.createElement('div');
controls.innerHTML = `
    <button id="start">Iniciar</button>
    <button id="pause" class="brilho">Pausar</button>
    <button id="reset">Resetar</button>
`;
pomodoroSection.appendChild(controls);

// ==== Variáveis ====
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

// ==== Inicializa Interface ====
updateDisplay();
historicoTimer.innerHTML = `${dataTimer} Minutos de estudos`;
cicloDisplay.innerHTML = `${ciclos} ${(ciclos > 1) ? "Ciclos" : "ciclo"}`;
pausaDisplay.innerHTML = pausas;
historicoTimerHoras.innerHTML = formatarHorasEMinutos(timerHoras);
displayUltima.textContent = `Último ciclo: ${ultimaExecucao}`;

// ==== Funções Auxiliares ====
function formatarHorasEMinutos(decimal) {
    const h = Math.floor(decimal);
    const m = Math.round((decimal - h) * 60);
    return `${h}h ${m}min`;
}

function updateDisplay() {
    const min = String(Math.floor(time / 60)).padStart(2, '0');
    const seg = String(time % 60).padStart(2, '0');
    timerDisplay.textContent = `${min}:${seg}`;
}

function notificarUsuario(titulo, mensagem) {
    if (Notification.permission === "granted") {
        new Notification(titulo, {
            body: mensagem,
            icon: "https://images.vexels.com/media/users/3/291333/isolated/preview/9bfb5cba71105268a6a1d7e156701259-bonito-desenho-de-gato-preto.png"
        });
    }
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

    if (typeof atualizarGrafico === "function") {
        atualizarGrafico(); // gráfico atualiza com dados globais
    }
}

// ==== Lógica Pomodoro ====
function finalizarPomodoro() {
    clearInterval(interval);

    if (Notification.permission !== "denied" && Notification.permission === "granted") {
        somAlarme.play();
        notificarUsuario("Pomodoro finalizado", "Hora de fazer uma pausa!");
    }


    dataTimer += 25;
    ciclos++;
    timerHoras += 25 / 60;
    ultimaExecucao = new Date().toLocaleString("pt-BR");

    time = defaultTime;
    isRunning = false;
    startTimestamp = null;

    // Atualiza UI
    historicoTimer.innerHTML = `${dataTimer} Minutos de estudos`;
    cicloDisplay.innerHTML = `${ciclos} ${(ciclos > 1) ? "Ciclos" : "ciclo"}`;
    historicoTimerHoras.innerHTML = formatarHorasEMinutos(timerHoras);
    displayUltima.textContent = `Último ciclo: ${ultimaExecucao}`;

    if (Notification.permission === "denied") {
        alert('as notificações foram negadas, mude nas configurações do navegador')
    }

    salvarProgresso();
    updateDisplay();
}

function startTimer() {
    // ==== Permissões & Sons ====
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
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

// ==== Listeners ====
document.getElementById('start').addEventListener('click', startTimer);
document.getElementById('pause').addEventListener('click', pauseTimer);
document.getElementById('reset').addEventListener('click', resetTimer);

// ==== Se estava rodando antes da recarga ====
if (isRunning && startTimestamp) retomarTimer();

window.dadosPomodoro = {
    get ciclos() { return ciclos; },
    get tempoTotalMinutos() { return dataTimer; },
    get tempoTotalHoras() { return timerHoras; },
    get pausas() { return pausas; }
};