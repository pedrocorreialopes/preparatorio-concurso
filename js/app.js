/**
 * Estudos Concursos - Main Application JavaScript
 * Gerencia toda a interatividade da plataforma de estudos
 */

class EstudosConcursosApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.userProgress = this.loadUserProgress();
        this.subjects = this.initializeSubjects();
        this.charts = {};
        
        this.init();
    }
    
    /**
     * Inicializa a aplicação
     */
    init() {
        this.setupEventListeners();
        this.setupThemeToggle();
        this.setupNavigation();
        this.loadDashboard();
        this.setupIntersectionObserver();
        this.setupServiceWorker();
        
        console.log('🎓 Estudos Concursos - Aplicação inicializada com sucesso!');
    }
    
    /**
     * Configura os event listeners principais
     */
    setupEventListeners() {
        // Navigation toggle (mobile)
        const navToggle = document.querySelector('.nav__toggle');
        if (navToggle) {
            navToggle.addEventListener('click', () => this.toggleMobileNav());
        }
        
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterClick(e));
        });
        
        // Category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleCategoryClick(e));
        });
        
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Online/offline events
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
        
        // Before unload
        window.addEventListener('beforeunload', () => this.saveUserProgress());
    }
    
    /**
     * Configura o toggle de tema claro/escuro
     */
    setupThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) return;
        
        // Load saved theme or detect system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else if (systemPrefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Dispatch theme change event
            window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: newTheme } }));
        });
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        });
    }
    
    /**
     * Configura a navegação principal
     */
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav__link[data-section]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.navigateToSection(section);
            });
        });
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.section) {
                this.navigateToSection(e.state.section, false);
            }
        });
    }
    
    /**
     * Navega para uma seção específica
     */
    navigateToSection(section, updateHistory = true) {
        if (section === this.currentSection) return;
        
        // Hide current section
        const currentSectionEl = document.querySelector(`[data-section="${this.currentSection}"]`);
        if (currentSectionEl) {
            currentSectionEl.classList.remove('section--active');
        }
        
        // Show new section
        const newSectionEl = document.querySelector(`[data-section="${section}"]`);
        if (newSectionEl) {
            newSectionEl.classList.add('section--active');
            
            // Load section-specific content
            this.loadSectionContent(section);
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // Update navigation
        document.querySelectorAll('.nav__link').forEach(link => {
            link.classList.remove('nav__link--active');
        });
        
        const activeLink = document.querySelector(`[data-section="${section}"]`);
        if (activeLink) {
            activeLink.classList.add('nav__link--active');
        }
        
        // Update history
        if (updateHistory) {
            const url = `#${section}`;
            history.pushState({ section }, '', url);
        }
        
        this.currentSection = section;
        
        // Close mobile nav if open
        this.closeMobileNav();
        
        // Track navigation
        this.trackEvent('navigation', 'section_change', section);
    }
    
    /**
     * Carrega conteúdo específico da seção
     */
    loadSectionContent(section) {
        switch (section) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'materias':
                this.loadSubjects();
                break;
            case 'testes':
                this.loadTests();
                break;
            case 'videoaulas':
                this.loadVideos();
                break;
            case 'progresso':
                this.loadProgress();
                break;
        }
    }
    
    /**
     * Carrega o dashboard com dados do usuário
     */
    async loadDashboard() {
        await this.loadSubjectsFromAPI();
        this.updateProgressOverview();
        this.updateStats();
        this.updateRecentActivity();
        this.updateCharts();
    }
    
    /**
     * Atualiza a visão geral do progresso
     */
    updateProgressOverview() {
        const totalQuestions = this.getTotalQuestions();
        const answeredQuestions = this.getAnsweredQuestions();
        const progressPercentage = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
        
        // Update progress bar
        const progressFill = document.querySelector('.progress-bar__fill');
        const progressText = document.querySelector('.progress-percentage');
        const progressLabel = document.querySelector('.progress-text');
        
        if (progressFill) {
            progressFill.style.width = `${progressPercentage}%`;
            progressFill.setAttribute('data-progress', progressPercentage);
        }
        
        if (progressText) {
            progressText.textContent = `${progressPercentage}%`;
        }
        
        if (progressLabel) {
            progressLabel.textContent = `${answeredQuestions} de ${totalQuestions} questões resolvidas`;
        }
    }
    
    /**
     * Atualiza as estatísticas
     */
    updateStats() {
        const stats = this.calculateStats();
        
        // Update study time
        const studyTimeEl = document.querySelector('.stat-value');
        if (studyTimeEl) {
            studyTimeEl.textContent = `${stats.studyTime}h`;
        }
        
        // Update correct answers
        const correctEl = document.querySelectorAll('.stat-value')[1];
        if (correctEl) {
            correctEl.textContent = stats.correctAnswers;
        }
        
        // Update streak
        const streakEl = document.querySelectorAll('.stat-value')[2];
        if (streakEl) {
            streakEl.textContent = `${stats.streak} dias`;
        }
    }
    
    /**
     * Atualiza atividades recentes
     */
    updateRecentActivity() {
        const activityList = document.getElementById('recent-activity');
        if (!activityList) return;
        
        const recentActivities = this.getRecentActivities(5);
        
        if (recentActivities.length === 0) {
            activityList.innerHTML = `
                <div class="activity-empty">
                    <i class="fas fa-book-open"></i>
                    <p>Comece seus estudos hoje!</p>
                </div>
            `;
            return;
        }
        
        activityList.innerHTML = recentActivities.map(activity => `
            <div class="activity-item">
                <div class="activity-item__icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-item__content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                    <small>${activity.time}</small>
                </div>
            </div>
        `).join('');
    }
    
    /**
     * Configura o Intersection Observer para animações
     */
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-slide-in');
                }
            });
        }, observerOptions);
        
        // Observe cards and elements for animation
        document.querySelectorAll('.subject-card, .test-card, .video-card, .stat-card, .progress-card').forEach(el => {
            observer.observe(el);
        });
    }
    
    /**
     * Configura Service Worker para funcionalidade offline
     */
    async setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('./sw.js');
                console.log('SW registered: ', registration);
            } catch (error) {
                console.log('SW registration failed: ', error);
            }
        }
    }
    
    /**
     * Manipula filtros de disciplinas
     */
    handleFilterClick(e) {
        const filterBtn = e.target;
        const filter = filterBtn.getAttribute('data-filter');
        
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        filterBtn.classList.add('active');
        
        // Filter subjects
        this.filterSubjects(filter);
        
        this.trackEvent('filter', 'subject_filter', filter);
    }
    
    /**
     * Filtra disciplinas por categoria
     */
    filterSubjects(filter) {
        const subjectCards = document.querySelectorAll('.subject-card');
        
        subjectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                card.classList.add('fade-in');
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    /**
     * Manipula categorias de vídeos
     */
    handleCategoryClick(e) {
        const categoryBtn = e.target;
        const category = categoryBtn.getAttribute('data-category');
        
        // Update active button
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        categoryBtn.classList.add('active');
        
        // Filter videos
        this.filterVideos(category);
        
        this.trackEvent('filter', 'video_filter', category);
    }
    
    /**
     * Alterna navegação mobile
     */
    toggleMobileNav() {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.querySelector('.nav__toggle');
        
        if (!navMenu || !navToggle) return;
        
        const isOpen = navMenu.classList.contains('nav__menu--active');
        
        if (isOpen) {
            this.closeMobileNav();
        } else {
            navMenu.classList.add('nav__menu--active');
            navToggle.classList.add('nav__toggle--active');
            navToggle.setAttribute('aria-expanded', 'true');
        }
    }
    
    /**
     * Fecha navegação mobile
     */
    closeMobileNav() {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.querySelector('.nav__toggle');
        
        if (navMenu) {
            navMenu.classList.remove('nav__menu--active');
        }
        
        if (navToggle) {
            navToggle.classList.remove('nav__toggle--active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    }
    
    /**
     * Manipula redimensionamento da janela
     */
    handleResize() {
        // Close mobile nav on desktop
        if (window.innerWidth > 768) {
            this.closeMobileNav();
        }
        
        // Redraw charts
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }
    
    /**
     * Manipula evento online
     */
    handleOnline() {
        console.log('📶 Conexão restaurada');
        this.showNotification('Conexão restaurada', 'success');
        this.syncData();
    }
    
    /**
     * Manipula evento offline
     */
    handleOffline() {
        console.log('📶 Sem conexão com a internet');
        this.showNotification('Você está offline. Os dados serão sincronizados quando a conexão for restaurada.', 'warning');
    }
    
    /**
     * Mostra notificação toast
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification__close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    /**
     * Obtém ícone de notificação
     */
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
    
    /**
     * Rastreia eventos (analytics placeholder)
     */
    trackEvent(category, action, label = '') {
        // Implement analytics tracking here
        console.log(`📊 Analytics: ${category} - ${action} - ${label}`);
        
        // Example: gtag('event', action, {
        //     'event_category': category,
        //     'event_label': label
        // });
    }
    
    /**
     * Métodos que serão implementados pelos módulos específicos
     */
    loadSubjects() { /* Implementado em subjects.js */ }
    loadTests() { /* Implementado em tests.js */ }
    loadVideos() { /* Implementado em videos.js */ }
    loadProgress() { /* Implementado em progress.js */ }
    updateCharts() { /* Implementado em progress.js */ }
    filterVideos(filter) { /* Implementado em videos.js */ }
    syncData() { /* Implementado conforme necessário */ }
    
    /**
     * Carrega disciplinas da API
     */
    async loadSubjectsFromAPI() {
        try {
            const response = await fetch('tables/subjects');
            const data = await response.json();
            
            if (data.data && data.data.length > 0) {
                this.subjects = data.data.map(subject => ({
                    id: subject.id,
                    name: subject.name,
                    category: subject.category,
                    description: subject.description,
                    totalQuestions: subject.total_questions,
                    totalLessons: subject.total_lessons,
                    progress: subject.progress || 0,
                    icon: subject.icon,
                    color: subject.color,
                    topics: subject.topics ? JSON.parse(subject.topics) : []
                }));
                
    /**
     * Atualiza interface de disciplinas
     */
    updateSubjectsUI() {
        const subjectsGrid = document.getElementById('subjects-grid');
        if (!subjectsGrid || !this.subjects.length) return;
        
        subjectsGrid.innerHTML = this.subjects.map(subject => `
            <article class="subject-card" data-category="${subject.category}" data-subject-id="${subject.id}">
                <div class="subject-card__header">
                    <div class="subject-card__icon">
                        <i class="${subject.icon}"></i>
                    </div>
                    <div class="subject-card__progress">
                        <div class="progress-ring">
                            <svg class="progress-ring__svg" viewBox="0 0 120 120">
                                <circle class="progress-ring__circle" cx="60" cy="60" r="54" fill="none" stroke="#e6e6e6" stroke-width="8"/>
                                <circle class="progress-ring__progress" cx="60" cy="60" r="54" fill="none" stroke="${subject.color}" stroke-width="8" stroke-dasharray="339.292" stroke-dashoffset="${339.292 - (339.292 * subject.progress / 100)}"/>
                            </svg>
                            <span class="progress-ring__text">${subject.progress}%</span>
                        </div>
                    </div>
                </div>
                <div class="subject-card__content">
                    <h3>${subject.name}</h3>
                    <p>${subject.description}</p>
                    <div class="subject-card__stats">
                        <span><i class="fas fa-question-circle"></i> ${subject.totalQuestions} questões</span>
                        <span><i class="fas fa-video"></i> ${subject.totalLessons} aulas</span>
                    </div>
                </div>
                <div class="subject-card__actions">
                    <button class="btn btn--primary" onclick="window.openSubject('${subject.id}')">Estudar</button>
                    <button class="btn btn--outline" onclick="window.viewSubjectProgress('${subject.id}')">Progresso</button>
                </div>
            </article>
        `).join('');
    }

    getTotalQuestions() { 
        return this.subjects.reduce((total, subject) => total + (subject.totalQuestions || 0), 0);
    }
    getAnsweredQuestions() { 
        // This would be calculated from progress data
        return Math.floor(this.getTotalQuestions() * 0.15); // 15% for demo
    }
    getRecentActivities(limit) { 
        // Demo activities
        return [
            {
                icon: 'fas fa-book',
                title: 'Estudo de Português',
                description: 'Completou 10 questões de gramática',
                time: '2 horas atrás'
            },
            {
                icon: 'fas fa-video',
                title: 'Videoaula de Matemática',
                description: 'Assistiu à aula sobre álgebra',
                time: '1 dia atrás'
            },
            {
                icon: 'fas fa-trophy',
                title: 'Conquista Desbloqueada',
                description: 'Primeiro lugar em simulado',
                time: '2 dias atrás'
            }
        ].slice(0, limit);
    }
    calculateStats() { 
        return {
            studyTime: 12,
            correctAnswers: 156,
            streak: 7
        };
    }
    getTotalQuestions() { 
        return this.subjects.reduce((total, subject) => total + (subject.totalQuestions || 0), 0);
    }
    getAnsweredQuestions() { 
        // This would be calculated from progress data
        return Math.floor(this.getTotalQuestions() * 0.15); // 15% for demo
    }
    getRecentActivities(limit) { 
        // Demo activities
        return [
            {
                icon: 'fas fa-book',
                title: 'Estudo de Português',
                description: 'Completou 10 questões de gramática',
                time: '2 horas atrás'
            },
            {
                icon: 'fas fa-video',
                title: 'Videoaula de Matemática',
                description: 'Assistiu à aula sobre álgebra',
                time: '1 dia atrás'
            },
            {
                icon: 'fas fa-trophy',
                title: 'Conquista Desbloqueada',
                description: 'Primeiro lugar em simulado',
                time: '2 dias atrás'
            }
        ].slice(0, limit);
    }
    calculateStats() { 
        return {
            studyTime: 12,
            correctAnswers: 156,
            streak: 7
        };
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.estudosApp = new EstudosConcursosApp();
});

// Global functions (serão implementados pelos módulos específicos)
window.openSubject = function(subjectId) {
    console.log(`Abrindo disciplina: ${subjectId}`);
    // Implementado em subjects.js
};

window.viewSubjectProgress = function(subjectId) {
    console.log(`Visualizando progresso da disciplina: ${subjectId}`);
    // Implementado em subjects.js
};

window.startQuickTest = function() {
    console.log('Iniciando simulado rápido');
    // Implementado em tests.js
};

window.startFullTest = function() {
    console.log('Iniciando simulado completo');
    // Implementado em tests.js
};

window.selectTopicTest = function() {
    console.log('Selecionando teste por tópico');
    // Implementado em tests.js
};