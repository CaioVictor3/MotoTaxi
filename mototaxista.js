/**
 * JavaScript para a tela do Mototaxista
 * Implementa funcionalidade de cadastro conforme requisitos
 */

// Elementos DOM
const mototaxistaForm = document.getElementById('mototaxistaForm');
const registrationForm = document.getElementById('registrationForm');
const successMessage = document.getElementById('successMessage');
const alertContainer = document.getElementById('alertContainer');
const photoInput = document.getElementById('photo');
const fileLabel = document.getElementById('fileLabel');
const newRegistrationBtn = document.getElementById('newRegistration');

// Array para simular armazenamento de cadastros pendentes
let pendingRegistrations = [];

/**
 * Inicialização da página
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadPendingRegistrations();
});

/**
 * Configura todos os event listeners
 */
function initializeEventListeners() {
    // Submissão do formulário
    mototaxistaForm.addEventListener('submit', handleRegistration);
    
    // Upload de arquivo
    photoInput.addEventListener('change', handleFileUpload);
    
    // Novo cadastro
    newRegistrationBtn.addEventListener('click', resetForm);
}

/**
 * Manipula o envio do formulário de cadastro
 * @param {Event} event - Evento de submit
 */
function handleRegistration(event) {
    event.preventDefault();
    
    const cnh = document.getElementById('cnh').value.trim();
    const vehicleDocument = document.getElementById('vehicleDocument').value.trim();
    const password = document.getElementById('password').value.trim();
    const photo = photoInput.files[0];
    
    // Validação: campos obrigatórios
    if (!cnh || !vehicleDocument || !password || !photo) {
        showAlert('Todos os campos são obrigatórios.', 'danger');
        return;
    }
    
    // Validação da senha
    if (password.length < 6) {
        showAlert('A senha deve ter pelo menos 6 caracteres.', 'warning');
        return;
    }
    
    // Validação básica do CNH (deve ter pelo menos 11 dígitos)
    if (cnh.length < 11) {
        showAlert('CNH deve ter pelo menos 11 dígitos.', 'warning');
        return;
    }
    
    // Validação básica do documento do veículo
    if (vehicleDocument.length < 5) {
        showAlert('Documento do veículo deve ter pelo menos 5 caracteres.', 'warning');
        return;
    }
    
    // Validação do arquivo de foto
    if (!isValidImageFile(photo)) {
        showAlert('Por favor, selecione uma imagem válida (JPG, PNG ou GIF).', 'warning');
        return;
    }
    
    // Simula o cadastro bem-sucedido
    const registrationData = {
        id: Date.now(), // ID único baseado no timestamp
        cnh: cnh,
        vehicleDocument: vehicleDocument,
        password: password,
        photoName: photo.name,
        photoSize: photo.size,
        registrationDate: new Date().toLocaleString('pt-BR'),
        status: 'pending'
    };
    
    // Adiciona aos cadastros pendentes
    pendingRegistrations.push(registrationData);
    
    // Salva no localStorage para simular persistência
    savePendingRegistrations();
    
    // Oculta formulário e mostra mensagem de sucesso
    registrationForm.classList.add('hidden');
    successMessage.classList.remove('hidden');
    
    // Limpa o formulário
    resetFormData();
}

/**
 * Manipula o upload de arquivo de foto
 * @param {Event} event - Evento de mudança no input
 */
function handleFileUpload(event) {
    const file = event.target.files[0];
    
    if (file) {
        // Atualiza o label para mostrar que um arquivo foi selecionado
        fileLabel.classList.add('has-file');
        fileLabel.innerHTML = `
            <i class="fas fa-check-circle fa-2x mb-2 text-success"></i>
            <div><strong>Arquivo selecionado:</strong></div>
            <div class="text-muted">${file.name}</div>
            <small class="text-muted">${formatFileSize(file.size)}</small>
        `;
    } else {
        // Reseta o label
        fileLabel.classList.remove('has-file');
        fileLabel.innerHTML = `
            <i class="fas fa-cloud-upload-alt fa-2x mb-2"></i>
            <div>Clique para selecionar uma foto</div>
            <small class="text-muted">Formatos aceitos: JPG, PNG, GIF</small>
        `;
    }
}

/**
 * Valida se o arquivo é uma imagem válida
 * @param {File} file - Arquivo a ser validado
 * @returns {boolean} True se válido, false caso contrário
 */
function isValidImageFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
        return false;
    }
    
    if (file.size > maxSize) {
        showAlert('A imagem deve ter no máximo 5MB.', 'warning');
        return false;
    }
    
    return true;
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
 * Reseta o formulário para permitir novo cadastro
 */
function resetForm() {
    successMessage.classList.add('hidden');
    registrationForm.classList.remove('hidden');
    resetFormData();
}

/**
 * Limpa todos os dados do formulário
 */
function resetFormData() {
    mototaxistaForm.reset();
    fileLabel.classList.remove('has-file');
    fileLabel.innerHTML = `
        <i class="fas fa-cloud-upload-alt fa-2x mb-2"></i>
        <div>Clique para selecionar uma foto</div>
        <small class="text-muted">Formatos aceitos: JPG, PNG, GIF</small>
    `;
    clearAlerts();
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
    
    // Remove o alerta automaticamente após 5 segundos
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
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

/**
 * Carrega cadastros pendentes do localStorage
 */
function loadPendingRegistrations() {
    const stored = localStorage.getItem('pendingMototaxistaRegistrations');
    if (stored) {
        pendingRegistrations = JSON.parse(stored);
    }
}

/**
 * Salva cadastros pendentes no localStorage
 */
function savePendingRegistrations() {
    localStorage.setItem('pendingMototaxistaRegistrations', JSON.stringify(pendingRegistrations));
}
