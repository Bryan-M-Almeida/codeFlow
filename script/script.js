document.addEventListener("DOMContentLoaded", () => {

    /* Tarefas */
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

    // ==== Pomodoro Timer ====

    // Constantes
    const pomodoroSection = document.getElementById('pomodoro');
    const timerDisplay = document.createElement('h2');
    const historicoTimer = document.querySelector('#historico-timer');
    const historicoTimerHoras = document.querySelector('#historico-timer-horas');
    const cicloDisplay = document.querySelector('#ciclos');
    const pausaDisplay = document.querySelector('#pausas-historico')

    // Botões de controle
    const controls = document.createElement('div');
    controls.innerHTML = `
    <button id="start">Iniciar</button>
    <button id="pause">Pausar</button>
    <button id="reset">Resetar</button>
`;

    // Elementos adicionados à tela
    timerDisplay.textContent = '25:00';
    pomodoroSection.appendChild(timerDisplay);
    pomodoroSection.appendChild(controls);

    // Mutáveis
    let time = 25 * 60;
    let isRunning = false;
    let interval;
    let dataTimer = 0;
    let ciclos = 0;
    let pausas = 0;

    // Singular ou plural
    let contador = (ciclos > 1) ? "Ciclos" : "ciclo";

    // Tempo em horas
    let timerHoras = 0;

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

                    dataTimer += 25;
                    ciclos++;
                    timerHoras += 25 / 60

                    historicoTimer.innerHTML = `${dataTimer} Minutos de estudos`;
                    cicloDisplay.innerHTML = `${ciclos} ${contador}`;

                    if (dataTimer > 59 && ciclos > 2) {
                        historicoTimerHoras.innerHTML = timerHoras.toFixed(2);
                    }

                    isRunning = false;
                    time = 25 * 60;
                    updateDisplay();
                }
            }, 1000);
        }
    }


    function pauseTimer() {
        pausas++;
        pausaDisplay.innerHTML = pausas;
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
    const pgxCanvas = document.getElementById('progresso-grafico');
    if (pgxCanvas) {
        const pgx = pgxCanvas.getContext('2d');
        new Chart(pgx, {
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
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // ==== Gráfico Total ====
    const ctxCanvas = document.getElementById('grafico');
    if (ctxCanvas) {
        const ctx = ctxCanvas.getContext('2d');
        new Chart(ctx, {
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
                    y: { beginAtZero: true }
                }
            }
        });
    }




});