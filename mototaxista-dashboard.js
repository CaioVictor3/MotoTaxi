/**
 * JavaScript para o Dashboard do Mototaxista
 * Implementa funcionalidades de gerenciamento de corridas
 */

// Elementos DOM
const userName = document.getElementById('userName');
const userPhone = document.getElementById('userPhone');
const userRating = document.getElementById('userRating');
const statusText = document.getElementById('statusText');
const toggleStatusBtn = document.getElementById('toggleStatusBtn');
const availableRides = document.getElementById('availableRides');
const acceptedRides = document.getElementById('acceptedRides');
const totalRides = document.getElementById('totalRides');
const averageRating = document.getElementById('averageRating');
const totalEarnings = document.getElementById('totalEarnings');

// Estado da aplicação
let isOnline = true;
let currentUser = null;
let availableRidesList = [];
let acceptedRidesList = [];

// Dados fictícios de corridas
const mockRides = [
    {
        id: 1,
        passenger: 'João Silva',
        phone: '(11) 99999-9999',
        pickup: 'Rua das Flores, 123',
        destination: 'Shopping Center',
        distance: '5.2 km',
        estimatedTime: '15 min',
        price: 'R$ 18,50',
        status: 'available',
        rating: 4.8
    },
    {
        id: 2,
        passenger: 'Maria Santos',
        phone: '(11) 88888-8888',
        pickup: 'Av. Paulista, 1000',
        destination: 'Aeroporto',
        distance: '12.5 km',
        estimatedTime: '25 min',
        price: 'R$ 35,00',
        status: 'available',
        rating: 4.9
    },
    {
        id: 3,
        passenger: 'Pedro Costa',
        phone: '(11) 77777-7777',
        pickup: 'Rua da Consolação, 500',
        destination: 'Estação de Metrô',
        distance: '3.8 km',
        estimatedTime: '12 min',
        price: 'R$ 15,00',
        status: 'available',
        rating: 4.7
    },
    {
        id: 4,
        passenger: 'Ana Oliveira',
        phone: '(11) 66666-6666',
        pickup: 'Rua Augusta, 200',
        destination: 'Hospital',
        distance: '8.1 km',
        estimatedTime: '20 min',
        price: 'R$ 25,00',
        status: 'available',
        rating: 4.6
    }
];

/**
 * Inicialização da página
 */
document.addEventListener('DOMContentLoaded', function() {
    checkUserLogin();
    loadUserInfo();
    initializeEventListeners();
    loadAvailableRides();
    updateStatistics();
});

/**
 * Verifica se o usuário está logado
 */
function checkUserLogin() {
    const userData = localStorage.getItem('usuarioLogado');
    if (!userData) {
        // Se não estiver logado, redireciona para a tela de login
        window.location.href = 'mototaxista-login.html';
        return;
    }
    
    const user = JSON.parse(userData);
    if (user.tipo !== 'mototaxista') {
        // Se não for mototaxista, redireciona para a tela de login
        window.location.href = 'mototaxista-login.html';
        return;
    }
    
    currentUser = user;
}

/**
 * Carrega informações do usuário
 */
function loadUserInfo() {
    if (currentUser) {
        userName.textContent = currentUser.nome;
        userPhone.textContent = currentUser.telefone;
        userRating.textContent = `${currentUser.rating || 4.8} ⭐`;
    }
}

/**
 * Configura todos os event listeners
 */
function initializeEventListeners() {
    // Aqui podem ser adicionados event listeners específicos se necessário
}

/**
 * Carrega corridas disponíveis
 */
function loadAvailableRides() {
    availableRidesList = mockRides.filter(ride => ride.status === 'available');
    renderAvailableRides();
}

/**
 * Renderiza corridas disponíveis
 */
function renderAvailableRides() {
    if (availableRidesList.length === 0) {
        availableRides.innerHTML = `
            <div class="text-center text-muted py-4">
                <i class="fas fa-info-circle fa-3x mb-3"></i>
                <p>Nenhuma corrida disponível no momento.</p>
            </div>
        `;
        return;
    }
    
    availableRides.innerHTML = availableRidesList.map(ride => `
        <div class="ride-card" id="ride-${ride.id}">
            <div class="row align-items-center">
                <div class="col-md-8">
                    <h5 class="mb-2">
                        <i class="fas fa-user me-2"></i>
                        ${ride.passenger}
                    </h5>
                    <p class="text-muted mb-1">
                        <i class="fas fa-phone me-2"></i>
                        ${ride.phone}
                    </p>
                    <p class="text-muted mb-1">
                        <i class="fas fa-map-marker-alt me-2"></i>
                        <strong>De:</strong> ${ride.pickup}
                    </p>
                    <p class="text-muted mb-1">
                        <i class="fas fa-flag me-2"></i>
                        <strong>Para:</strong> ${ride.destination}
                    </p>
                    <p class="text-muted mb-0">
                        <i class="fas fa-route me-2"></i>
                        ${ride.distance} • ${ride.estimatedTime}
                    </p>
                </div>
                <div class="col-md-4 text-end">
                    <h4 class="text-success mb-3">${ride.price}</h4>
                    <div class="mb-3">
                        <span class="badge bg-warning status-badge">
                            <i class="fas fa-star me-1"></i>
                            ${ride.rating}
                        </span>
                    </div>
                    <div class="btn-group" role="group">
                        <button class="btn btn-success btn-sm" onclick="acceptRide(${ride.id})">
                            <i class="fas fa-check me-1"></i>Aceitar
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="rejectRide(${ride.id})">
                            <i class="fas fa-times me-1"></i>Recusar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Renderiza corridas aceitas
 */
function renderAcceptedRides() {
    if (acceptedRidesList.length === 0) {
        acceptedRides.innerHTML = `
            <div class="text-center text-muted py-4">
                <i class="fas fa-info-circle fa-3x mb-3"></i>
                <p>Nenhuma corrida aceita no momento.</p>
            </div>
        `;
        return;
    }
    
    acceptedRides.innerHTML = acceptedRidesList.map(ride => `
        <div class="ride-card accepted" id="accepted-ride-${ride.id}">
            <div class="row align-items-center">
                <div class="col-md-8">
                    <h5 class="mb-2">
                        <i class="fas fa-user me-2"></i>
                        ${ride.passenger}
                    </h5>
                    <p class="text-muted mb-1">
                        <i class="fas fa-phone me-2"></i>
                        ${ride.phone}
                    </p>
                    <p class="text-muted mb-1">
                        <i class="fas fa-map-marker-alt me-2"></i>
                        <strong>De:</strong> ${ride.pickup}
                    </p>
                    <p class="text-muted mb-1">
                        <i class="fas fa-flag me-2"></i>
                        <strong>Para:</strong> ${ride.destination}
                    </p>
                    <p class="text-muted mb-0">
                        <i class="fas fa-route me-2"></i>
                        ${ride.distance} • ${ride.estimatedTime}
                    </p>
                </div>
                <div class="col-md-4 text-end">
                    <h4 class="text-success mb-3">${ride.price}</h4>
                    <div class="mb-3">
                        <span class="badge bg-success status-badge">
                            <i class="fas fa-check me-1"></i>
                            Aceita
                        </span>
                    </div>
                    <div class="btn-group" role="group">
                        <button class="btn btn-primary btn-sm" onclick="startRide(${ride.id})">
                            <i class="fas fa-play me-1"></i>Iniciar
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="cancelRide(${ride.id})">
                            <i class="fas fa-times me-1"></i>Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Aceita uma corrida
 * @param {number} rideId - ID da corrida
 */
function acceptRide(rideId) {
    const ride = availableRidesList.find(r => r.id === rideId);
    if (!ride) return;
    
    // Remove da lista de disponíveis
    availableRidesList = availableRidesList.filter(r => r.id !== rideId);
    
    // Adiciona à lista de aceitas
    ride.status = 'accepted';
    acceptedRidesList.push(ride);
    
    // Atualiza a interface
    renderAvailableRides();
    renderAcceptedRides();
    
    // Mostra notificação
    showNotification(`Corrida aceita! Passageiro: ${ride.passenger}`, 'success');
}

/**
 * Recusa uma corrida
 * @param {number} rideId - ID da corrida
 */
function rejectRide(rideId) {
    const ride = availableRidesList.find(r => r.id === rideId);
    if (!ride) return;
    
    // Remove da lista de disponíveis
    availableRidesList = availableRidesList.filter(r => r.id !== rideId);
    
    // Atualiza a interface
    renderAvailableRides();
    
    // Mostra notificação
    showNotification(`Corrida recusada: ${ride.passenger}`, 'info');
}

/**
 * Inicia uma corrida
 * @param {number} rideId - ID da corrida
 */
function startRide(rideId) {
    const ride = acceptedRidesList.find(r => r.id === rideId);
    if (!ride) return;
    
    // Simula início da corrida
    ride.status = 'in_progress';
    
    // Mostra notificação
    showNotification(`Corrida iniciada! Passageiro: ${ride.passenger}`, 'success');
    
    // Simula fim da corrida após 5 segundos
    setTimeout(() => {
        finishRide(rideId);
    }, 5000);
}

/**
 * Finaliza uma corrida
 * @param {number} rideId - ID da corrida
 */
function finishRide(rideId) {
    const ride = acceptedRidesList.find(r => r.id === rideId);
    if (!ride) return;
    
    // Remove da lista de aceitas
    acceptedRidesList = acceptedRidesList.filter(r => r.id !== rideId);
    
    // Atualiza estatísticas
    updateStatistics();
    
    // Atualiza a interface
    renderAcceptedRides();
    
    // Mostra notificação
    showNotification(`Corrida finalizada! Ganho: ${ride.price}`, 'success');
}

/**
 * Cancela uma corrida
 * @param {number} rideId - ID da corrida
 */
function cancelRide(rideId) {
    const ride = acceptedRidesList.find(r => r.id === rideId);
    if (!ride) return;
    
    // Remove da lista de aceitas
    acceptedRidesList = acceptedRidesList.filter(r => r.id !== rideId);
    
    // Adiciona de volta à lista de disponíveis
    ride.status = 'available';
    availableRidesList.push(ride);
    
    // Atualiza a interface
    renderAvailableRides();
    renderAcceptedRides();
    
    // Mostra notificação
    showNotification(`Corrida cancelada: ${ride.passenger}`, 'warning');
}

/**
 * Alterna status online/offline
 */
function toggleStatus() {
    isOnline = !isOnline;
    
    if (isOnline) {
        statusText.textContent = 'Online';
        statusText.className = 'text-success';
        toggleStatusBtn.innerHTML = '<i class="fas fa-toggle-on me-2"></i>Ficar Offline';
        toggleStatusBtn.className = 'btn btn-outline-success btn-custom';
        
        // Carrega corridas disponíveis
        loadAvailableRides();
    } else {
        statusText.textContent = 'Offline';
        statusText.className = 'text-danger';
        toggleStatusBtn.innerHTML = '<i class="fas fa-toggle-off me-2"></i>Ficar Online';
        toggleStatusBtn.className = 'btn btn-outline-danger btn-custom';
        
        // Limpa corridas disponíveis
        availableRides.innerHTML = `
            <div class="text-center text-muted py-4">
                <i class="fas fa-toggle-off fa-3x mb-3"></i>
                <p>Você está offline. Ative para ver corridas disponíveis.</p>
            </div>
        `;
    }
}

/**
 * Atualiza estatísticas
 */
function updateStatistics() {
    if (currentUser) {
        totalRides.textContent = currentUser.totalRides || 0;
        averageRating.textContent = currentUser.rating || 4.8;
        
        // Calcula ganhos totais (simulado)
        const totalRidesCount = currentUser.totalRides || 0;
        const averageEarnings = 20; // R$ 20,00 por corrida em média
        const totalEarningsValue = totalRidesCount * averageEarnings;
        totalEarnings.textContent = `R$ ${totalEarningsValue.toFixed(2)}`;
    }
}

/**
 * Mostra notificação
 * @param {string} message - Mensagem da notificação
 * @param {string} type - Tipo da notificação
 */
function showNotification(message, type) {
    // Cria elemento de notificação
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Remove automaticamente após 3 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

/**
 * Faz logout do usuário
 */
function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('usuarioLogado');
        window.location.href = 'mototaxista-login.html';
    }
}
