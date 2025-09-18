# Sistema Moto Taxi

Sistema web simplificado para gestão de moto táxi com três módulos principais: Passageiro, Mototaxista e Administrador.

## 🚀 Tecnologias Utilizadas

- **HTML5** - Estrutura das páginas
- **CSS3** - Estilização com Bootstrap 5
- **JavaScript (Vanilla)** - Lógica de funcionamento
- **Bootstrap 5** - Framework CSS para interface responsiva
- **Font Awesome** - Ícones

## 📁 Estrutura do Projeto

```
Moto Taxi/
├── index.html                    # Página principal com navegação
├── passageiro.html              # Tela do passageiro (login/cadastro)
├── passageiro.js                # Lógica do passageiro
├── passageiro-dashboard.html    # Dashboard do passageiro logado
├── mototaxista.html             # Tela do mototaxista (cadastro)
├── mototaxista.js               # Lógica do mototaxista
├── mototaxista-login.html       # Tela de login do mototaxista
├── mototaxista-login.js         # Lógica de login do mototaxista
├── mototaxista-dashboard.html   # Dashboard do mototaxista logado
├── admin.html                   # Tela do administrador
├── admin.js                     # Lógica do administrador
├── teste-funcionalidades.html   # Página de teste de funcionalidades
└── README.md                    # Documentação
```

## 🎯 Funcionalidades Implementadas

### 1. Tela do Passageiro (`passageiro.html`)

#### Cadastro de Passageiro
- ✅ Formulário com campos: Nome completo, Telefone e Senha
- ✅ Validação JavaScript para campos obrigatórios
- ✅ Mensagem de erro clara quando campos estão vazios
- ✅ Simulação de cadastro bem-sucedido com mensagem de confirmação
- ✅ Ocultação do formulário após cadastro

#### Login de Passageiro
- ✅ Formulário com Telefone e Senha
- ✅ Validação de campos obrigatórios
- ✅ Simulação de diferentes cenários:
  - Login com sucesso
  - Senha incorreta
  - Cadastro inativo
- ✅ Link "Esqueci minha senha" com alerta de desenvolvimento

### 2. Tela do Mototaxista (`mototaxista.html`)

#### Cadastro de Mototaxista
- ✅ Formulário com campos: CNH, Documento do Veículo e Foto
- ✅ Upload de arquivo de imagem com validação
- ✅ Validação de campos obrigatórios
- ✅ Mensagem de confirmação após envio
- ✅ Simulação de análise manual pelo administrador

### 3. Tela do Administrador (`admin.html`)

#### Aprovação de Cadastros
- ✅ Interface com lista de cadastros pendentes
- ✅ Exibição das informações (CNH e Documento do Veículo)
- ✅ Botões Aprovar e Reprovar para cada cadastro
- ✅ Confirmação de ações com modal
- ✅ Remoção do item da lista após ação
- ✅ Mensagem de confirmação da ação
- ✅ Estatísticas de cadastros (pendentes, aprovados, reprovados)

## 🔧 Como Usar

1. **Acesse a página principal** (`index.html`)
2. **Escolha o módulo desejado:**
   - **Passageiro**: Para cadastrar-se ou fazer login
   - **Mototaxista**: Para cadastrar-se como mototaxista
   - **Administrador**: Para gerenciar cadastros pendentes

### Fluxo de Teste Recomendado

1. **Cadastre um mototaxista** na tela correspondente
2. **Acesse a área do administrador** para ver o cadastro pendente
3. **Aprove ou reprove** o cadastro
4. **Teste o cadastro de passageiro** com diferentes cenários
5. **Teste o login** com os dados cadastrados

## 💾 Armazenamento de Dados

O sistema utiliza **localStorage** para simular persistência de dados:
- Cadastros de mototaxistas pendentes
- Cadastros aprovados
- Cadastros reprovados
- Dados de usuários passageiros

## 🎨 Design e UX

- Interface moderna e responsiva
- Cores diferenciadas para cada módulo:
  - **Passageiro**: Azul/Roxo
  - **Mototaxista**: Verde
  - **Administrador**: Amarelo/Laranja
- Feedback visual claro para todas as ações
- Validações em tempo real
- Mensagens de erro e sucesso bem definidas

## 📱 Responsividade

Todas as telas são totalmente responsivas e funcionam em:
- Desktop
- Tablet
- Smartphone

## 🔒 Validações Implementadas

- Campos obrigatórios em todos os formulários
- Validação de formato de CNH (mínimo 11 dígitos)
- Validação de arquivo de imagem (JPG, PNG, GIF)
- Limite de tamanho de arquivo (5MB)
- Verificação de telefone já cadastrado
- Confirmação de ações críticas (aprovar/reprovar)
- **Controle de acesso**: Mototaxistas só podem fazer login após aprovação do administrador

## 🔧 Correções e Melhorias Implementadas

### Layout e UX
- ✅ **Corrigido**: Botões de navegação (Login/Cadastro) agora aparecem dentro dos formulários
- ✅ **Corrigido**: Alertas de login do mototaxista agora aparecem dentro do formulário
- ✅ **Melhorado**: Interface mais moderna com gradientes e animações

### Controle de Acesso
- ✅ **Implementado**: Mototaxistas não podem fazer login sem aprovação do administrador
- ✅ **Implementado**: Verificação de status de aprovação antes do login
- ✅ **Implementado**: Mensagens específicas para cadastros pendentes

### Funcionalidades Adicionais
- ✅ **Criado**: Dashboard do passageiro após login bem-sucedido
- ✅ **Criado**: Dashboard do mototaxista após login bem-sucedido
- ✅ **Implementado**: Sistema de logout com confirmação
- ✅ **Implementado**: Persistência de dados de usuário logado
- ✅ **Criado**: Página de teste de funcionalidades (`teste-funcionalidades.html`)

### Correções de Segurança e UX
- ✅ **Corrigido**: Mototaxistas reprovados são impedidos de fazer login
- ✅ **Corrigido**: Notificações de login agora são exibidas corretamente
- ✅ **Implementado**: Verificação de cadastros reprovados antes do login
- ✅ **Melhorado**: Mensagens de erro mais específicas e informativas

## 🚀 Execução

Para executar o projeto:

1. Abra o arquivo `index.html` em qualquer navegador moderno
2. Não é necessário servidor web - funciona localmente
3. Todos os recursos são carregados via CDN

## 📝 Observações Técnicas

- Código JavaScript bem comentado para facilitar entendimento
- Separação clara de responsabilidades
- Uso de funções modulares e reutilizáveis
- Tratamento de erros adequado
- Interface intuitiva e acessível

---

**Desenvolvido conforme especificações técnicas solicitadas.**
