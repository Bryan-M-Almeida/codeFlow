document.addEventListener("DOMContentLoaded", () => {
    // Tenta esperar os dados estarem disponíveis
    function tentarCriarGrafico(retries = 10) {
        if (
            window.dadosPomodoro &&
            window.dadosTarefas &&
            typeof window.dadosPomodoro.tempoTotalMinutos === "number"
        ) {
            const ctx = document.getElementById('progresso-grafico').getContext('2d');
            window.chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Ciclos', 'Pausas', 'Tarefas Feitas'],
                    datasets: [{
                        label: 'Progresso Total',
                        data: [
                            window.dadosPomodoro.ciclos,
                            window.dadosPomodoro.pausas,
                            window.dadosTarefas.feitas
                        ],
                        backgroundColor: ['#36a2eb', '#4bc0c0', '#ff6384']
                    }]
                }
            });
        } else if (retries > 0) {
            setTimeout(() => tentarCriarGrafico(retries - 1), 200);
        } else {
            console.error("Dados do gráfico não disponíveis após esperar.");
        }
    }
    function atualizarGrafico() {
        if (!window.chart) return;
        window.chart.data.datasets[0].data = [
            window.dadosPomodoro.ciclos,
            window.dadosPomodoro.pausas,
            window.dadosTarefas.feitas
        ];
        window.chart.update();
    }
    window.atualizarGrafico = atualizarGrafico;

    tentarCriarGrafico();
});
