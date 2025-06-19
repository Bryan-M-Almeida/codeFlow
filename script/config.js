document.addEventListener("DOMContentLoaded", () => {
    const inputNotification = document.getElementById('notificar');
    const inputClear = document.querySelector('#resetar');
    const explicacao = document.getElementById('explicacao-notificacao');
    const textoDesativar = "As notificações estão ativadas (Para desativar, vá nas configurações do navegador)"
    if (inputClear) {
        inputClear.addEventListener('click', function () {
            const confirmacao = prompt('Tem certeza? (1:sim 2: não)');
            if (confirmacao == '1') {
                localStorage.clear();
                alert('dados apagados');
                location.reload();
            } else {
                alert('Dados intactos');
            }
        });
    }



    if (!inputNotification || !explicacao) return;

    const estado = Notification.permission;

    if (estado === "granted") {
        inputNotification.checked = true;
        inputNotification.disabled = true;
        explicacao.textContent = textoDesativar;
    } else if (estado === "denied") {
        inputNotification.checked = false;
        inputNotification.disabled = true;
        explicacao.textContent = "Você bloqueou as notificações. Para ativar, vá nas configurações do navegador.";
    } else {
        inputNotification.checked = false;
        inputNotification.disabled = false;
        explicacao.textContent = "Ative as notificações aqui";
    }

    inputNotification.addEventListener('change', async () => {
        if (inputNotification.checked) {
            const permission = await Notification.requestPermission();

            if (permission === "granted") {
                localStorage.setItem('notificacoesAtivas', true);
                inputNotification.checked = true;
                inputNotification.disabled = true;
                explicacao.textContent = textoDesativar;
            } else {
                inputNotification.checked = false;
                inputNotification.disabled = true;
                localStorage.setItem('notificacoesAtivas', false);
                explicacao.textContent = "Você bloqueou as notificações. Para ativar, vá nas configurações do navegador.";
            }
        }
    });

    inputNotification.addEventListener('click', () => {
        if (inputNotification.disabled) {
            if (estado === "granted") {
                explicacao.textContent = textoDesativar;
            } else if (estado === "denied") {
                explicacao.textContent = "Você bloqueou as notificações. Para ativar, vá nas configurações do navegador.";
            }
        }
    });
});

// 🔔 Função global de notificação
function notificarUsuario(titulo = "Pomodoro", mensagem = "Hora de fazer uma pausa!") {
    const ativado = localStorage.getItem('notificacoesAtivas') !== 'false';
    if (ativado && Notification.permission === "granted") {
        new Notification(titulo, { body: mensagem });
    }
}