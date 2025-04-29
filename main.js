/**
 * Script principal para o portfólio de Tercio Alves Parente
 */

// Aguardar que o DOM seja completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todos os componentes
    initializeSmoothScrolling();
    initializeFormValidation();
    initializeAnimations();
    initializeProjectFilters();
    initializeThemeToggle();
});

/**
 * Inicializa o scroll suave para links de âncora
 */
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calcular a posição de scroll com um pequeno offset para o cabeçalho fixo
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Atualizar URL sem recarregar a página
                history.pushState(null, null, targetId);
            }
        });
    });
}

/**
 * Inicializa a validação do formulário de contato
 */
function initializeFormValidation() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            if (!this.checkValidity()) {
                event.stopPropagation();
                this.classList.add('was-validated');
                return;
            }
            
            // Obter os dados do formulário
            const formData = new FormData(this);
            const formDataObject = {};
            
            formData.forEach((value, key) => {
                formDataObject[key] = value;
            });
            
            // Simulação de envio bem-sucedido
            // Em uma implementação real, você enviaria os dados para um servidor
            console.log('Dados do formulário:', formDataObject);
            
            // Feedback visual para o usuário
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
            
            // Simular uma resposta do servidor após 1,5 segundos
            setTimeout(() => {
                // Exibir mensagem de sucesso
                showNotification('Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
                
                // Resetar o formulário e restaurar o botão
                this.reset();
                this.classList.remove('was-validated');
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }, 1500);
        });
    }
}

/**
 * Exibe uma notificação temporária
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo de notificação (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // Verificar se já existe uma notificação e removê-la
    const existingNotification = document.querySelector('.notification-toast');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification-toast alert alert-${type} alert-dismissible fade show`;
    notification.role = 'alert';
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '1050';
    notification.style.minWidth = '300px';
    notification.style.boxShadow = '0 0.5rem 1rem rgba(0, 0, 0, 0.15)';
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    `;
    
    // Adicionar ao corpo do documento
    document.body.appendChild(notification);
    
    // Auto-ocultar após 5 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

/**
 * Inicializa as animações de entrada dos elementos
 */
function initializeAnimations() {
    // Identificar todos os elementos que devem ser animados
    const animatedElements = [
        { selector: '#about', className: 'slide-in-left' },
        { selector: '#skills', className: 'slide-in-right' },
        { selector: '#projects .card', className: 'fade-in', staggered: true },
        { selector: '#education .card', className: 'slide-in-left' },
        { selector: '#contact', className: 'fade-in' }
    ];
    
    // Configurar o observador de interseção
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2, // Disparar quando pelo menos 20% do elemento estiver visível
        rootMargin: '0px 0px -100px 0px' // Disparar antes que o elemento entre completamente na viewport
    });
    
    // Aplicar classes e configurar observador
    animatedElements.forEach(item => {
        const elements = document.querySelectorAll(item.selector);
        
        elements.forEach((element, index) => {
            // Remover quaisquer classes de animação existentes da biblioteca animate.css
            element.classList.remove('animate__animated', 'animate__fadeInDown', 'animate__fadeInLeft', 
                'animate__fadeInRight', 'animate__fadeInUp');
            
            // Adicionar nova classe de animação personalizada
            element.classList.add(item.className);
            
            // Inicialmente, esconder o elemento
            element.style.opacity = '0';
            
            // Para animações escalonadas, adicionar atraso incremental
            if (item.staggered) {
                element.style.animationDelay = `${index * 0.2}s`;
            }
            
            // Adicionar manipulador para quando a animação começar
            element.addEventListener('animationstart', () => {
                element.style.opacity = '1';
            });
            
            // Observar o elemento
            observer.observe(element);
        });
    });
    
    // Adicionar manipulador de scroll para ativar animações
    document.addEventListener('scroll', () => {
        document.querySelectorAll('.slide-in-left, .slide-in-right, .fade-in').forEach(element => {
            const position = element.getBoundingClientRect();
            
            // Verificar se o elemento está visível na viewport
            if (position.top < window.innerHeight && position.bottom >= 0) {
                element.classList.add('animate');
            }
        });
    }, { passive: true });
}

/**
 * Inicializa filtros para projetos (se existirem)
 */
function initializeProjectFilters() {
    const filterButtons = document.querySelectorAll('.project-filter');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remover classe ativa de todos os botões
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Adicionar classe ativa ao botão clicado
                this.classList.add('active');
                
                // Obter categoria de filtro
                const filterValue = this.getAttribute('data-filter');
                
                // Filtrar projetos
                const projects = document.querySelectorAll('.project-card');
                
                projects.forEach(project => {
                    if (filterValue === 'all') {
                        project.style.display = 'block';
                    } else {
                        const projectCategories = project.getAttribute('data-category');
                        
                        if (projectCategories && projectCategories.includes(filterValue)) {
                            project.style.display = 'block';
                        } else {
                            project.style.display = 'none';
                        }
                    }
                });
            });
        });
    }
}

/**
 * Inicializa o botão de alternância entre tema claro/escuro (se existir)
 */
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        // Verificar preferência do usuário salva
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.checked = true;
        }
        
        themeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
            }
        });
    }
}

/**
 * Muda dinamicamente a imagem de fundo do cabeçalho (se houver)
 */
function cycleBackgroundImages() {
    const header = document.querySelector('header');
    const backgroundImages = [
        'url("background1.jpg")',
        'url("background2.jpg")',
        'url("background3.jpg")'
    ];
    let currentImageIndex = 0;
    
    // Mudar a imagem a cada 10 segundos
    setInterval(() => {
        currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;
        
        if (header) {
            header.style.backgroundImage = backgroundImages[currentImageIndex];
            header.style.transition = 'background-image 1s ease-in-out';
        }
    }, 10000);
}

/**
 * Função para exibir os anos de experiência atualizados dinamicamente
 */
function updateExperienceYears() {
    const startYear = 2022;
    const currentYear = new Date().getFullYear();
    const experienceYears = currentYear - startYear;
    
    const experienceElement = document.getElementById('experience-years');
    
    if (experienceElement) {
        experienceElement.textContent = experienceYears > 0 ? experienceYears : '< 1';
    }
}

/**
 * Verifica se o navegador suporta recursos modernos de CSS e JavaScript
 */
function checkBrowserSupport() {
    // Verificar suporte a CSS Grid
    const supportsGrid = window.CSS && CSS.supports && CSS.supports('display', 'grid');
    
    // Verificar suporte a Intersection Observer
    const supportsIntersectionObserver = 'IntersectionObserver' in window;
    
    if (!supportsGrid || !supportsIntersectionObserver) {
        console.warn('Seu navegador pode não suportar alguns recursos modernos usados neste site.');
    }
}

// Executar verificação de suporte de navegador
checkBrowserSupport();

// Atualizar anos de experiência
updateExperienceYears();