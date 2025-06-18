document.addEventListener("DOMContentLoaded", () => {
    /* Tarefas */
    const form = document.getElementById('form-tarefa');
    const input = document.getElementById('input-tarefa');
    const lista = document.getElementById('lista-tarefas');

    let tarefasFeitas = 0;

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

    // ==== Pomodoro Timer ====

    // Constantes
    const pomodoroSection = document.getElementById('pomodoro');
    const timerDisplay = document.createElement('h2');
    const historicoTimer = document.querySelector('#historico-timer');
    const historicoTimerHoras = document.querySelector('#historico-timer-horas');
    const cicloDisplay = document.querySelector('#ciclos');
    const pausaDisplay = document.querySelector('#pausas-historico');
    const displayUltima = document.getElementById('ultima-execucao');

    // Botões de controle
    const controls = document.createElement('div');
    controls.innerHTML = `
    <button id="start">Iniciar</button>
    <button id="pause">Pausar</button>
    <button id="reset">Resetar</button>
`;
    pomodoroSection.appendChild(timerDisplay);
    pomodoroSection.appendChild(controls);

    // Tempo padrão
    const defaultTime = 25 * 60;

    // Recuperar dados salvos
    let time = parseInt(localStorage.getItem('time')) || defaultTime;
    let isRunning = JSON.parse(localStorage.getItem('isRunning')) || false;
    let dataTimer = parseInt(localStorage.getItem('dataTimer')) || 0;
    let ciclos = parseInt(localStorage.getItem('ciclos')) || 0;
    let pausas = parseInt(localStorage.getItem('pausas')) || 0;
    let timerHoras = parseFloat(localStorage.getItem('timerHoras')) || 0;
    let startTimestamp = parseInt(localStorage.getItem('startTimestamp')) || null;
    let ultimaExecucao = localStorage.getItem('ultimaExecucao') || '--';

    let interval;

    // dados anteriores
    historicoTimer.innerHTML = `${dataTimer} Minutos de estudos`;
    cicloDisplay.innerHTML = `${ciclos} ${(ciclos > 1) ? "Ciclos" : "ciclo"}`;
    pausaDisplay.innerHTML = pausas;
    historicoTimerHoras.innerHTML = formatarHorasEMinutos(timerHoras);
    displayUltima.textContent = `Último ciclo: ${ultimaExecucao}`;

    // formatar decimal de horas
    function formatarHorasEMinutos(valorDecimal) {
        const horas = Math.floor(valorDecimal);
        const minutos = Math.round((valorDecimal - horas) * 60);
        return `${horas}h ${minutos}min`;
    }

    // salvar progresso
    function salvarProgresso() {
        localStorage.setItem('time', time);
        localStorage.setItem('isRunning', JSON.stringify(isRunning));
        localStorage.setItem('dataTimer', dataTimer);
        localStorage.setItem('ciclos', ciclos);
        localStorage.setItem('pausas', pausas);
        localStorage.setItem('timerHoras', timerHoras);
        localStorage.setItem('startTimestamp', startTimestamp);
        localStorage.setItem('ultimaExecucao', ultimaExecucao);
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

    if (isRunning && startTimestamp) {
        retomarTimer();
    }

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

    // ==== Gráfico de Progresso ====
    const pgxCanvas = document.getElementById('progresso-grafico');
    if (pgxCanvas) {
        const pgx = pgxCanvas.getContext('2d');
        new Chart(pgx, {
            type: 'bar',
            data: {
                labels: ['Tempo de Estudo (Em minutos)', 'Tarefas'],
                datasets: [{
                    label: ['Progresso'],
                    data: [time / 60, tarefasFeitas],
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

});