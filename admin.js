/**
 * JavaScript para a tela do Administrador
 * Implementa funcionalidade de aprovação de cadastros conforme requisitos
 */

// Elementos DOM
const alertContainer = document.getElementById('alertContainer');
const pendingRegistrationsList = document.getElementById('pendingRegistrationsList');
const emptyState = document.getElementById('emptyState');
const refreshBtn = document.getElementById('refreshBtn');
const addSampleBtn = document.getElementById('addSampleBtn');
const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const confirmBtn = document.getElementById('confirmBtn');

// Contadores
const pendingCount = document.getElementById('pendingCount');
const approvedCount = document.getElementById('approvedCount');
const rejectedCount = document.getElementById('rejectedCount');

// Variáveis para controle
let currentAction = null;
let currentRegistrationId = null;

// Dados simulados
let pendingRegistrations = [];
let approvedRegistrations = [];
let rejectedRegistrations = [];

/**
 * Inicialização da página
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadData();
    renderPendingRegistrations();
    updateStatistics();
});

/**
 * Configura todos os event listeners
 */
function initializeEventListeners() {
    // Botão de atualizar
    refreshBtn.addEventListener('click', () => {
        loadData();
        renderPendingRegistrations();
        updateStatistics();
        showAlert('Lista atualizada com sucesso!', 'success');
    });
    
    // Botão para adicionar cadastro de teste
    addSampleBtn.addEventListener('click', addSampleRegistration);
    
    // Confirmação de ação
    confirmBtn.addEventListener('click', executeAction);
}

/**
 * Carrega dados do localStorage
 */
function loadData() {
    // Carrega cadastros pendentes
    const storedPending = localStorage.getItem('pendingMototaxistaRegistrations');
    if (storedPending) {
        pendingRegistrations = JSON.parse(storedPending);
    }
    
    // Carrega cadastros aprovados
    const storedApproved = localStorage.getItem('approvedMototaxistaRegistrations');
    if (storedApproved) {
        approvedRegistrations = JSON.parse(storedApproved);
    }
    
    // Carrega cadastros rejeitados
    const storedRejected = localStorage.getItem('rejectedMototaxistaRegistrations');
    if (storedRejected) {
        rejectedRegistrations = JSON.parse(storedRejected);
    }
}

/**
 * Renderiza a lista de cadastros pendentes
 */
function renderPendingRegistrations() {
    if (pendingRegistrations.length === 0) {
        pendingRegistrationsList.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    const html = pendingRegistrations.map(registration => `
        <div class="registration-item p-4 border-bottom">
            <div class="row align-items-center">
                <div class="col-md-8">
                    <div class="d-flex align-items-center mb-2">
                        <span class="status-badge bg-warning text-dark me-3">
                            <i class="fas fa-clock me-1"></i>Pendente
                        </span>
                        <small class="text-muted">
                            <i class="fas fa-calendar me-1"></i>${registration.registrationDate}
                        </small>
                    </div>
                    <div class="row">
                        <div class="col-sm-6">
                            <strong><i class="fas fa-id-card me-2"></i>CNH:</strong><br>
                            <span class="text-muted">${registration.cnh}</span>
                        </div>
                        <div class="col-sm-6">
                            <strong><i class="fas fa-file-alt me-2"></i>Documento do Veículo:</strong><br>
                            <span class="text-muted">${registration.vehicleDocument}</span>
                        </div>
                    </div>
                    <div class="mt-2">
                        <strong><i class="fas fa-camera me-2"></i>Foto:</strong><br>
                        <span class="text-muted">${registration.photoName} (${formatFileSize(registration.photoSize)})</span>
                    </div>
                </div>
                <div class="col-md-4 text-end">
                    <button class="btn btn-success btn-custom me-2" onclick="showApprovalConfirmation(${registration.id})">
                        <i class="fas fa-check me-1"></i>Aprovar
                    </button>
                    <button class="btn btn-danger btn-custom" onclick="showRejectionConfirmation(${registration.id})">
                        <i class="fas fa-times me-1"></i>Reprovar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    pendingRegistrationsList.innerHTML = html;
}

/**
 * Atualiza as estatísticas na tela
 */
function updateStatistics() {
    pendingCount.textContent = pendingRegistrations.length;
    approvedCount.textContent = approvedRegistrations.length;
    rejectedCount.textContent = rejectedRegistrations.length;
}

/**
 * Mostra confirmação para aprovação
 * @param {number} registrationId - ID do cadastro
 */
function showApprovalConfirmation(registrationId) {
    const registration = pendingRegistrations.find(r => r.id === registrationId);
    if (!registration) return;
    
    currentAction = 'approve';
    currentRegistrationId = registrationId;
    
    modalTitle.innerHTML = '<i class="fas fa-check-circle text-success me-2"></i>Aprovar Cadastro';
    modalBody.innerHTML = `
        <p>Tem certeza que deseja <strong>aprovar</strong> este cadastro?</p>
        <div class="alert alert-info">
            <strong>CNH:</strong> ${registration.cnh}<br>
            <strong>Documento:</strong> ${registration.vehicleDocument}
        </div>
        <p class="text-muted">O mototaxista receberá uma notificação de aprovação.</p>
    `;
    
    confirmBtn.className = 'btn btn-success';
    confirmBtn.innerHTML = '<i class="fas fa-check me-2"></i>Aprovar';
    
    confirmationModal.show();
}

/**
 * Mostra confirmação para rejeição
 * @param {number} registrationId - ID do cadastro
 */
function showRejectionConfirmation(registrationId) {
    const registration = pendingRegistrations.find(r => r.id === registrationId);
    if (!registration) return;
    
    currentAction = 'reject';
    currentRegistrationId = registrationId;
    
    modalTitle.innerHTML = '<i class="fas fa-times-circle text-danger me-2"></i>Reprovar Cadastro';
    modalBody.innerHTML = `
        <p>Tem certeza que deseja <strong>reprovar</strong> este cadastro?</p>
        <div class="alert alert-warning">
            <strong>CNH:</strong> ${registration.cnh}<br>
            <strong>Documento:</strong> ${registration.vehicleDocument}
        </div>
        <p class="text-muted">O mototaxista receberá uma notificação de reprovação.</p>
    `;
    
    confirmBtn.className = 'btn btn-danger';
    confirmBtn.innerHTML = '<i class="fas fa-times me-2"></i>Reprovar';
    
    confirmationModal.show();
}

/**
 * Executa a ação confirmada (aprovar ou reprovar)
 */
function executeAction() {
    if (!currentAction || !currentRegistrationId) return;
    
    const registrationIndex = pendingRegistrations.findIndex(r => r.id === currentRegistrationId);
    if (registrationIndex === -1) return;
    
    const registration = pendingRegistrations[registrationIndex];
    
    if (currentAction === 'approve') {
        // Move para aprovados
        registration.status = 'approved';
        registration.processedDate = new Date().toLocaleString('pt-BR');
        approvedRegistrations.push(registration);
        
        // Adiciona à lista de mototaxistas aprovados para login
        const approvedMototaxista = {
            phone: registration.cnh, // Usando CNH como telefone para login
            password: '123456', // Senha padrão
            name: `Mototaxista ${registration.cnh.slice(-4)}`, // Nome baseado no CNH
            cnh: registration.cnh,
            status: 'approved',
            rating: 4.5,
            totalRides: 0
        };
        
        // Salva na lista de mototaxistas aprovados
        const existingApproved = JSON.parse(localStorage.getItem('mototaxistasAprovados') || '[]');
        existingApproved.push(approvedMototaxista);
        localStorage.setItem('mototaxistasAprovados', JSON.stringify(existingApproved));
        
        showAlert('Cadastro aprovado com sucesso!', 'success');
    } else if (currentAction === 'reject') {
        // Move para rejeitados
        registration.status = 'rejected';
        registration.processedDate = new Date().toLocaleString('pt-BR');
        rejectedRegistrations.push(registration);
        
        showAlert('Cadastro reprovado.', 'warning');
    }
    
    // Remove dos pendentes
    pendingRegistrations.splice(registrationIndex, 1);
    
    // Salva no localStorage
    saveData();
    
    // Atualiza a interface
    renderPendingRegistrations();
    updateStatistics();
    
    // Fecha o modal
    confirmationModal.hide();
    
    // Limpa as variáveis
    currentAction = null;
    currentRegistrationId = null;
}

/**
 * Adiciona um cadastro de teste para demonstração
 */
function addSampleRegistration() {
    const sampleData = {
        id: Date.now(),
        cnh: '12345678901',
        vehicleDocument: 'CRLV-2024-001234',
        photoName: 'foto_mototaxista.jpg',
        photoSize: 2048576, // 2MB
        registrationDate: new Date().toLocaleString('pt-BR'),
        status: 'pending'
    };
    
    pendingRegistrations.push(sampleData);
    saveData();
    renderPendingRegistrations();
    updateStatistics();
    
    showAlert('Cadastro de teste adicionado!', 'info');
}

/**
 * Salva todos os dados no localStorage
 */
function saveData() {
    localStorage.setItem('pendingMototaxistaRegistrations', JSON.stringify(pendingRegistrations));
    localStorage.setItem('approvedMototaxistaRegistrations', JSON.stringify(approvedRegistrations));
    localStorage.setItem('rejectedMototaxistaRegistrations', JSON.stringify(rejectedRegistrations));
}

/**
 * Formata o tamanho do arquivo para exibição
 * @param {number} bytes - Tamanho em bytes
 * @returns {string} Tamanho formatado
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Exibe uma mensagem de alerta na tela
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo do alerta ('success', 'danger', 'warning', 'info')
 */
function showAlert(message, type) {
    clearAlerts();
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show alert-custom`;
    alertDiv.innerHTML = `
        <i class="fas fa-${getAlertIcon(type)} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    alertContainer.appendChild(alertDiv);
    
    // Remove o alerta automaticamente após 4 segundos
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 4000);
}

/**
 * Retorna o ícone apropriado para cada tipo de alerta
 * @param {string} type - Tipo do alerta
 * @returns {string} Nome do ícone
 */
function getAlertIcon(type) {
    const icons = {
        'success': 'check-circle',
        'danger': 'exclamation-triangle',
        'warning': 'exclamation-circle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

/**
 * Remove todas as mensagens de alerta da tela
 */
function clearAlerts() {
    alertContainer.innerHTML = '';
}
