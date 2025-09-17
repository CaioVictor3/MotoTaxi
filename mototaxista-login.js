/**
 * JavaScript para a tela de Login do Mototaxista
 * Implementa funcionalidade de login com verificação de aprovação
 */

// Elementos DOM
const loginForm = document.getElementById('loginForm');
const alertContainer = document.getElementById('alertContainer');
const forgotPasswordLink = document.getElementById('forgotPassword');

// Formulário
const loginFormElement = document.getElementById('loginFormElement');

// Chaves para localStorage
const MOTOTAXISTAS_KEY = 'mototaxistasAprovados';
const PENDING_KEY = 'pendingMototaxistaRegistrations';

/**
 * Inicialização da página
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadApprovedMototaxistas();
});

/**
 * Configura todos os event listeners
 */
function initializeEventListeners() {
    // Submissão do formulário
    loginFormElement.addEventListener('submit', handleLogin);
    
    // Recuperação de senha
    forgotPasswordLink.addEventListener('click', handleForgotPassword);
}

/**
 * Carrega mototaxistas aprovados do localStorage
 */
function loadApprovedMototaxistas() {
    const stored = localStorage.getItem(MOTOTAXISTAS_KEY);
    if (stored) {
        try {
            const mototaxistas = JSON.parse(stored);
            // Se não for um array, inicializa como array vazio
            if (!Array.isArray(mototaxistas)) {
                localStorage.setItem(MOTOTAXISTAS_KEY, JSON.stringify([]));
            }
        } catch (e) {
            // Se houver erro ao fazer parse, inicializa como array vazio
            localStorage.setItem(MOTOTAXISTAS_KEY, JSON.stringify([]));
        }
    } else {
        // Se não existir, inicializa com alguns mototaxistas de exemplo
        const defaultMototaxistas = [
            { 
                phone: '11999999999', 
                password: '123456', 
                name: 'João Silva', 
                cnh: '12345678901',
                status: 'approved',
                rating: 4.8,
                totalRides: 150
            },
            { 
                phone: '11888888888', 
                password: 'senha123', 
                name: 'Maria Santos', 
                cnh: '98765432109',
                status: 'approved',
                rating: 4.9,
                totalRides: 200
            }
        ];
        localStorage.setItem(MOTOTAXISTAS_KEY, JSON.stringify(defaultMototaxistas));
    }
}

/**
 * Obtém mototaxistas aprovados do localStorage
 * @returns {Array} Array de mototaxistas aprovados
 */
function getApprovedMototaxistas() {
    const stored = localStorage.getItem(MOTOTAXISTAS_KEY);
    return stored ? JSON.parse(stored) : [];
}

/**
 * Manipula o envio do formulário de login
 * @param {Event} event - Evento de submit
 */
function handleLogin(event) {
    event.preventDefault();
    
    const phone = document.getElementById('loginPhone').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
    // Validação: campos obrigatórios
    if (!phone || !password) {
        showAlert('Todos os campos são obrigatórios.', 'danger');
        return;
    }
    
    // Obtém mototaxistas aprovados do localStorage
    const approvedMototaxistas = getApprovedMototaxistas();
    
    // Busca o mototaxista pelo telefone
    const mototaxista = approvedMototaxistas.find(m => m.phone === phone.replace(/\D/g, ''));
    
    if (!mototaxista) {
        // Verifica se existe cadastro pendente
        const pendingRegistrations = JSON.parse(localStorage.getItem(PENDING_KEY) || '[]');
        const pendingMototaxista = pendingRegistrations.find(m => m.cnh === phone.replace(/\D/g, ''));
        
        if (pendingMototaxista) {
            showAlert('Seu cadastro ainda está sob análise. Aguarde a aprovação do administrador.', 'warning');
            return;
        }
        
        // Mototaxista não encontrado
        showAlert('Telefone não cadastrado ou não aprovado.', 'danger');
        return;
    }
    
    if (mototaxista.password !== password) {
        // Senha incorreta
        showAlert('Senha incorreta.', 'danger');
        return;
    }
    
    if (mototaxista.status !== 'approved') {
        // Mototaxista não aprovado
        showAlert('Seu cadastro ainda não foi aprovado. Aguarde a aprovação do administrador.', 'warning');
        return;
    }
    
    // Login bem-sucedido - redireciona para o dashboard do mototaxista
    showAlert(`Bem-vindo(a), ${mototaxista.name}! Redirecionando...`, 'success');
    
    // Salva dados do usuário logado
    localStorage.setItem('usuarioLogado', JSON.stringify({
        tipo: 'mototaxista',
        nome: mototaxista.name,
        telefone: mototaxista.phone,
        cnh: mototaxista.cnh,
        rating: mototaxista.rating,
        totalRides: mototaxista.totalRides
    }));
    
    // Limpa o formulário
    loginFormElement.reset();
    
    // Redireciona após 2 segundos
    setTimeout(() => {
        window.location.href = 'mototaxista-dashboard.html';
    }, 2000);
}

/**
 * Manipula o clique em "Esqueci minha senha"
 * @param {Event} event - Evento de clique
 */
function handleForgotPassword(event) {
    event.preventDefault();
    alert('Funcionalidade de recuperação de senha em desenvolvimento.');
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
