/**
 * JavaScript para a tela do Passageiro
 * Implementa funcionalidades de cadastro e login conforme requisitos
 */

// Elementos DOM
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const successMessage = document.getElementById('successMessage');
const alertContainer = document.getElementById('alertContainer');
const forgotPasswordLink = document.getElementById('forgotPassword');
const backToLoginBtn = document.getElementById('backToLogin');

// Formulários
const loginFormElement = document.getElementById('loginFormElement');
const registerFormElement = document.getElementById('registerFormElement');

// Chave para localStorage
const PASSAGEIROS_KEY = 'passageirosRegistrados';

/**
 * Inicialização da página
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadRegisteredUsers();
});

/**
 * Configura todos os event listeners
 */
function initializeEventListeners() {
    // Navegação entre abas
    loginTab.addEventListener('click', () => switchTab('login'));
    registerTab.addEventListener('click', () => switchTab('register'));
    
    // Submissão dos formulários
    loginFormElement.addEventListener('submit', handleLogin);
    registerFormElement.addEventListener('submit', handleRegister);
    
    // Recuperação de senha
    forgotPasswordLink.addEventListener('click', handleForgotPassword);
    
    // Voltar ao login após cadastro
    backToLoginBtn.addEventListener('click', () => {
        successMessage.classList.add('hidden');
        switchTab('login');
    });
}

/**
 * Carrega usuários registrados do localStorage
 */
function loadRegisteredUsers() {
    const stored = localStorage.getItem(PASSAGEIROS_KEY);
    if (stored) {
        try {
            const users = JSON.parse(stored);
            // Se não for um array, inicializa como array vazio
            if (!Array.isArray(users)) {
                localStorage.setItem(PASSAGEIROS_KEY, JSON.stringify([]));
            }
        } catch (e) {
            // Se houver erro ao fazer parse, inicializa como array vazio
            localStorage.setItem(PASSAGEIROS_KEY, JSON.stringify([]));
        }
    } else {
        // Se não existir, inicializa com alguns usuários de exemplo
        const defaultUsers = [
            { phone: '11999999999', password: '123456', name: 'João Silva', active: true },
            { phone: '11888888888', password: 'senha123', name: 'Maria Santos', active: true }
        ];
        localStorage.setItem(PASSAGEIROS_KEY, JSON.stringify(defaultUsers));
    }
}

/**
 * Obtém usuários registrados do localStorage
 * @returns {Array} Array de usuários registrados
 */
function getRegisteredUsers() {
    const stored = localStorage.getItem(PASSAGEIROS_KEY);
    return stored ? JSON.parse(stored) : [];
}

/**
 * Salva usuários registrados no localStorage
 * @param {Array} users - Array de usuários para salvar
 */
function saveRegisteredUsers(users) {
    localStorage.setItem(PASSAGEIROS_KEY, JSON.stringify(users));
}

/**
 * Alterna entre as abas de login e cadastro
 * @param {string} tab - 'login' ou 'register'
 */
function switchTab(tab) {
    // Limpa mensagens de erro
    clearAlerts();
    
    if (tab === 'login') {
        loginTab.classList.remove('btn-outline-primary');
        loginTab.classList.add('btn-primary');
        registerTab.classList.remove('btn-primary');
        registerTab.classList.add('btn-outline-primary');
        
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    } else {
        registerTab.classList.remove('btn-outline-primary');
        registerTab.classList.add('btn-primary');
        loginTab.classList.remove('btn-primary');
        loginTab.classList.add('btn-outline-primary');
        
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    }
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
    
    // Obtém usuários do localStorage
    const registeredUsers = getRegisteredUsers();
    
    // Simula diferentes cenários de login
    const user = registeredUsers.find(u => u.phone === phone.replace(/\D/g, ''));
    
    if (!user) {
        // Usuário não encontrado
        showAlert('Telefone não cadastrado.', 'danger');
        return;
    }
    
    if (user.password !== password) {
        // Senha incorreta
        showAlert('Senha incorreta.', 'danger');
        return;
    }
    
    if (!user.active) {
        // Cadastro inativo
        showAlert('Seu cadastro está inativo. Entre em contato com o suporte.', 'warning');
        return;
    }
    
    // Login bem-sucedido - redireciona para a tela do passageiro
    showAlert(`Bem-vindo(a), ${user.name}! Redirecionando...`, 'success');
    
    // Salva dados do usuário logado
    localStorage.setItem('usuarioLogado', JSON.stringify({
        tipo: 'passageiro',
        nome: user.name,
        telefone: user.phone
    }));
    
    // Limpa o formulário
    loginFormElement.reset();
    
    // Redireciona após 2 segundos
    setTimeout(() => {
        window.location.href = 'passageiro-dashboard.html';
    }, 2000);
}

/**
 * Manipula o envio do formulário de cadastro
 * @param {Event} event - Evento de submit
 */
function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value.trim();
    const phone = document.getElementById('registerPhone').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    
    // Validação: campos obrigatórios
    if (!name || !phone || !password) {
        showAlert('Todos os campos são obrigatórios.', 'danger');
        return;
    }
    
    // Obtém usuários do localStorage
    const registeredUsers = getRegisteredUsers();
    
    // Verifica se o telefone já está cadastrado
    const phoneNumbers = phone.replace(/\D/g, '');
    const existingUser = registeredUsers.find(u => u.phone === phoneNumbers);
    
    if (existingUser) {
        showAlert('Este telefone já está cadastrado.', 'warning');
        return;
    }
    
    // Cria novo usuário
    const newUser = {
        phone: phoneNumbers,
        password: password,
        name: name,
        active: true // Passageiros são ativados automaticamente
    };
    
    // Adiciona o novo usuário
    registeredUsers.push(newUser);
    
    // Salva no localStorage
    saveRegisteredUsers(registeredUsers);
    
    // Oculta formulário e mostra mensagem de sucesso
    registerForm.classList.add('hidden');
    successMessage.classList.remove('hidden');
    
    // Limpa o formulário
    registerFormElement.reset();
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
    // Verifica se o container existe
    if (!alertContainer) {
        console.error('Container de alertas não encontrado');
        return;
    }
    
    clearAlerts();
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show alert-custom mb-3`;
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
