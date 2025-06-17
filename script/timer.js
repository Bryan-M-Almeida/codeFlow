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