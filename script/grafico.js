document.addEventListener("DOMContentLoaded", () => {

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