/**
 * JavaScript para o Dashboard do Passageiro
 * Implementa funcionalidades de chamada de mototaxista
 */

// Elementos DOM
const userName = document.getElementById('userName');
const userPhone = document.getElementById('userPhone');
const statusAlert = document.getElementById('statusAlert');
const statusText = document.getElementById('statusText');
const callButton = document.getElementById('callButton');
const rideInfo = document.getElementById('rideInfo');
const mototaxistaName = document.getElementById('mototaxistaName');
const mototaxistaPhone = document.getElementById('mototaxistaPhone');
const rideStatus = document.getElementById('rideStatus');
const estimatedTime = document.getElementById('estimatedTime');

// Estado da aplicação
let currentRide = null;
let isRideActive = false;

/**
 * Inicialização da página
 */
document.addEventListener('DOMContentLoaded', function() {
    checkUserLogin();
    loadUserInfo();
    initializeEventListeners();
});

/**
 * Verifica se o usuário está logado
 */
function checkUserLogin() {
    const userData = localStorage.getItem('usuarioLogado');
    if (!userData) {
        // Se não estiver logado, redireciona para a tela de login
        window.location.href = 'passageiro.html';
        return;
    }
    
    const user = JSON.parse(userData);
    if (user.tipo !== 'passageiro') {
        // Se não for passageiro, redireciona para a tela de login
        window.location.href = 'passageiro.html';
        return;
    }
}

/**
 * Carrega informações do usuário
 */
function loadUserInfo() {
    const userData = localStorage.getItem('usuarioLogado');
    if (userData) {
        const user = JSON.parse(userData);
        userName.textContent = user.nome;
        userPhone.textContent = user.telefone;
    }
}

/**
 * Configura todos os event listeners
 */
function initializeEventListeners() {
    // Aqui podem ser adicionados event listeners específicos se necessário
}

/**
 * Chama um mototaxista
 */
function callMototaxista() {
    if (isRideActive) {
        return;
    }
    
    // Simula a busca por mototaxistas disponíveis
    showStatus('Buscando mototaxistas disponíveis...', 'info');
    callButton.disabled = true;
    callButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Buscando...';
    
    // Simula delay de busca
    setTimeout(() => {
        // Simula sucesso na busca
        const mototaxistas = [
            { name: 'João Silva', phone: '(11) 99999-9999', rating: 4.8, distance: '2.5 km' },
            { name: 'Maria Santos', phone: '(11) 88888-8888', rating: 4.9, distance: '1.8 km' },
            { name: 'Pedro Costa', phone: '(11) 77777-7777', rating: 4.7, distance: '3.2 km' }
        ];
        
        // Seleciona um mototaxista aleatório
        const selectedMototaxista = mototaxistas[Math.floor(Math.random() * mototaxistas.length)];
        
        // Ativa a corrida
        activateRide(selectedMototaxista);
        
    }, 2000);
}

/**
 * Ativa uma corrida
 * @param {Object} mototaxista - Dados do mototaxista selecionado
 */
function activateRide(mototaxista) {
    isRideActive = true;
    currentRide = {
        mototaxista: mototaxista,
        startTime: new Date(),
        status: 'searching'
    };
    
    // Atualiza a interface
    showStatus('Mototaxista encontrado! Aguardando confirmação...', 'success');
    callButton.innerHTML = '<i class="fas fa-check me-2"></i>Mototaxista Encontrado';
    callButton.disabled = true;
    
    // Mostra informações da corrida
    showRideInfo(mototaxista);
    
    // Simula confirmação do mototaxista
    setTimeout(() => {
        confirmRide();
    }, 3000);
}

/**
 * Confirma a corrida
 */
function confirmRide() {
    currentRide.status = 'confirmed';
    showStatus('Corrida confirmada! Mototaxista a caminho...', 'success');
    rideStatus.textContent = 'A caminho';
    rideStatus.className = 'badge bg-warning';
    
    // Simula chegada do mototaxista
    setTimeout(() => {
        arriveMototaxista();
    }, 5000);
}

/**
 * Simula chegada do mototaxista
 */
function arriveMototaxista() {
    currentRide.status = 'arrived';
    showStatus('Mototaxista chegou! Aguardando você...', 'success');
    rideStatus.textContent = 'Chegou';
    rideStatus.className = 'badge bg-success';
    
    // Simula início da corrida
    setTimeout(() => {
        startRide();
    }, 3000);
}

/**
 * Inicia a corrida
 */
function startRide() {
    currentRide.status = 'in_progress';
    showStatus('Corrida em andamento...', 'info');
    rideStatus.textContent = 'Em andamento';
    rideStatus.className = 'badge bg-primary';
    
    // Simula fim da corrida
    setTimeout(() => {
        finishRide();
    }, 10000);
}

/**
 * Finaliza a corrida
 */
function finishRide() {
    currentRide.status = 'completed';
    showStatus('Corrida finalizada! Obrigado por usar nossos serviços.', 'success');
    rideStatus.textContent = 'Concluída';
    rideStatus.className = 'badge bg-success';
    
    // Reseta a interface
    setTimeout(() => {
        resetRide();
    }, 3000);
}

/**
 * Reseta a corrida
 */
function resetRide() {
    isRideActive = false;
    currentRide = null;
    showStatus('Pronto para solicitar uma nova corrida', 'info');
    callButton.innerHTML = '<i class="fas fa-phone me-2"></i>Chamar Mototaxista';
    callButton.disabled = false;
    hideRideInfo();
}

/**
 * Mostra informações da corrida
 * @param {Object} mototaxista - Dados do mototaxista
 */
function showRideInfo(mototaxista) {
    mototaxistaName.textContent = mototaxista.name;
    mototaxistaPhone.textContent = mototaxista.phone;
    estimatedTime.textContent = '5-10 min';
    rideInfo.classList.remove('hidden');
}

/**
 * Oculta informações da corrida
 */
function hideRideInfo() {
    rideInfo.classList.add('hidden');
}

/**
 * Mostra status na tela
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo do status ('info', 'success', 'warning', 'danger')
 */
function showStatus(message, type) {
    statusText.textContent = message;
    statusAlert.className = `alert alert-${type}`;
    
    // Adiciona ícone apropriado
    const icon = getStatusIcon(type);
    statusAlert.innerHTML = `<i class="fas fa-${icon} me-2"></i>${message}`;
}

/**
 * Retorna o ícone apropriado para cada tipo de status
 * @param {string} type - Tipo do status
 * @returns {string} Nome do ícone
 */
function getStatusIcon(type) {
    const icons = {
        'info': 'info-circle',
        'success': 'check-circle',
        'warning': 'exclamation-triangle',
        'danger': 'exclamation-circle'
    };
    return icons[type] || 'info-circle';
}

/**
 * Cancela a corrida
 */
function cancelRide() {
    if (!isRideActive) {
        return;
    }
    
    if (confirm('Tem certeza que deseja cancelar a corrida?')) {
        currentRide.status = 'cancelled';
        showStatus('Corrida cancelada.', 'warning');
        resetRide();
    }
}

/**
 * Faz logout do usuário
 */
function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('usuarioLogado');
        window.location.href = 'passageiro.html';
    }
}
