/**
 * Subjects Module - Gerenciamento de disciplinas
 * Manipula as disciplinas, progresso e conteúdo das matérias
 */

class SubjectsManager {
    constructor(app) {
        this.app = app;
        this.subjects = this.loadSubjectsData();
        this.currentSubject = null;
        this.subjectProgress = this.loadSubjectProgress();
        
        this.init();
    }
    
    init() {
        this.setupSubjectEventListeners();
        this.updateAllSubjectProgress();
        console.log('📚 Subjects Manager inicializado');
    }
    
    /**
     * Carrega dados das disciplinas
     */
    loadSubjectsData() {
        const savedSubjects = localStorage.getItem('subjectsData');
        if (savedSubjects) {
            return JSON.parse(savedSubjects);
        }
        
        // Default subjects data
        return [
            {
                id: 'portugues',
                name: 'Língua Portuguesa',
                category: 'lenguas',
                icon: 'fas fa-spell-check',
                color: '#3b82f6',
                description: 'Gramática, interpretação de texto, ortografia e mais',
                totalQuestions: 150,
                totalLessons: 25,
                progress: 0,
                topics: [
                    { id: 'gramatica', name: 'Gramática', questions: 40, lessons: 8 },
                    { id: 'interpretacao', name: 'Interpretação de Texto', questions: 50, lessons: 10 },
                    { id: 'ortografia', name: 'Ortografia', questions: 30, lessons: 4 },
                    { id: 'pontuacao', name: 'Pontuação', questions: 30, lessons: 3 }
                ]
            },
            {
                id: 'ingles',
                name: 'Língua Inglesa',
                category: 'lenguas',
                icon: 'fas fa-language',
                color: '#10b981',
                description: 'Gramática, vocabulário, interpretação e conversação',
                totalQuestions: 120,
                totalLessons: 20,
                progress: 0,
                topics: [
                    { id: 'gramatica-ingles', name: 'Gramática Inglesa', questions: 30, lessons: 6 },
                    { id: 'vocabulario', name: 'Vocabulário', questions: 35, lessons: 7 },
                    { id: 'interpretacao-ingles', name: 'Interpretação', questions: 35, lessons: 5 },
                    { id: 'conversacao', name: 'Conversação', questions: 20, lessons: 2 }
                ]
            },
            {
                id: 'matematica',
                name: 'Matemática',
                category: 'exatas',
                icon: 'fas fa-calculator',
                color: '#f59e0b',
                description: 'Álgebra, geometria, trigonometria e estatística',
                totalQuestions: 200,
                totalLessons: 35,
                progress: 0,
                topics: [
                    { id: 'algebra', name: 'Álgebra', questions: 60, lessons: 12 },
                    { id: 'geometria', name: 'Geometria', questions: 50, lessons: 10 },
                    { id: 'trigonometria', name: 'Trigonometria', questions: 40, lessons: 8 },
                    { id: 'estatistica', name: 'Estatística', questions: 50, lessons: 5 }
                ]
            },
            {
                id: 'logica',
                name: 'Raciocínio Lógico',
                category: 'exatas',
                icon: 'fas fa-brain',
                color: '#8b5cf6',
                description: 'Lógica proposicional, diagramas, sequências e análise',
                totalQuestions: 180,
                totalLessons: 30,
                progress: 0,
                topics: [
                    { id: 'logica-proposicional', name: 'Lógica Proposicional', questions: 50, lessons: 10 },
                    { id: 'diagramas', name: 'Diagramas', questions: 45, lessons: 8 },
                    { id: 'sequencias', name: 'Sequências', questions: 45, lessons: 7 },
                    { id: 'analise-logica', name: 'Análise Lógica', questions: 40, lessons: 5 }
                ]
            },
            {
                id: 'constitucional',
                name: 'Direito Constitucional',
                category: 'direito',
                icon: 'fas fa-balance-scale',
                color: '#dc2626',
                description: 'Constituição, direitos fundamentais, organização do Estado',
                totalQuestions: 160,
                totalLessons: 28,
                progress: 0,
                topics: [
                    { id: 'constituicao', name: 'Constituição', questions: 40, lessons: 8 },
                    { id: 'direitos-fundamentais', name: 'Direitos Fundamentais', questions: 45, lessons: 10 },
                    { id: 'organizacao-estado', name: 'Organização do Estado', questions: 40, lessons: 7 },
                    { id: 'controle-constitucional', name: 'Controle Constitucional', questions: 35, lessons: 3 }
                ]
            },
            {
                id: 'administrativo',
                name: 'Direito Administrativo',
                category: 'direito',
                icon: 'fas fa-building',
                color: '#059669',
                description: 'Atos administrativos, serviços públicos, licitações',
                totalQuestions: 140,
                totalLessons: 25,
                progress: 0,
                topics: [
                    { id: 'atos-administrativos', name: 'Atos Administrativos', questions: 35, lessons: 7 },
                    { id: 'servicos-publicos', name: 'Serviços Públicos', questions: 35, lessons: 6 },
                    { id: 'licitacoes', name: 'Licitações', questions: 35, lessons: 8 },
                    { id: 'contratos-administrativos', name: 'Contratos', questions: 35, lessons: 4 }
                ]
            },
            {
                id: 'financeira',
                name: 'Matemática Financeira',
                category: 'exatas',
                icon: 'fas fa-coins',
                color: '#d97706',
                description: 'Juros, descontos, taxas, amortização',
                totalQuestions: 100,
                totalLessons: 18,
                progress: 0,
                topics: [
                    { id: 'juros', name: 'Juros', questions: 30, lessons: 6 },
                    { id: 'descontos', name: 'Descontos', questions: 25, lessons: 4 },
                    { id: 'taxas', name: 'Taxas', questions: 25, lessons: 5 },
                    { id: 'amortizacao', name: 'Amortização', questions: 20, lessons: 3 }
                ]
            },
            {
                id: 'bancarios',
                name: 'Conhecimentos Bancários',
                category: 'tecnologia',
                icon: 'fas fa-university',
                color: '#7c3aed',
                description: 'Produtos, serviços, regulamentação bancária',
                totalQuestions: 130,
                totalLessons: 22,
                progress: 0,
                topics: [
                    { id: 'produtos-bancarios', name: 'Produtos', questions: 35, lessons: 6 },
                    { id: 'servicos-bancarios', name: 'Serviços', questions: 35, lessons: 8 },
                    { id: 'regulamentacao', name: 'Regulamentação', questions: 30, lessons: 5 },
                    { id: 'tecnologia-bancaria', name: 'Tecnologia', questions: 30, lessons: 3 }
                ]
            },
            {
                id: 'informatica',
                name: 'Noções de Informática',
                category: 'tecnologia',
                icon: 'fas fa-laptop-code',
                color: '#0891b2',
                description: 'Hardware, software, internet, segurança digital',
                totalQuestions: 110,
                totalLessons: 20,
                progress: 0,
                topics: [
                    { id: 'hardware', name: 'Hardware', questions: 25, lessons: 5 },
                    { id: 'software', name: 'Software', questions: 25, lessons: 5 },
                    { id: 'internet', name: 'Internet', questions: 30, lessons: 6 },
                    { id: 'seguranca-digital', name: 'Segurança', questions: 30, lessons: 4 }
                ]
            }
        ];
    }
    
    /**
     * Configura event listeners para disciplinas
     */
    setupSubjectEventListeners() {
        // Subject card clicks
        document.addEventListener('click', (e) => {
            const subjectCard = e.target.closest('.subject-card');
            if (subjectCard) {
                const subjectId = subjectCard.getAttribute('data-subject-id');
                if (subjectId) {
                    this.openSubject(subjectId);
                }
            }
        });
        
        // Subject progress buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn--outline') && e.target.textContent.includes('Progresso')) {
                const subjectCard = e.target.closest('.subject-card');
                if (subjectCard) {
                    const subjectId = subjectCard.getAttribute('data-subject-id');
                    if (subjectId) {
                        this.viewSubjectProgress(subjectId);
                    }
                }
            }
        });
    }
    
    /**
     * Abre uma disciplina específica
     */
    openSubject(subjectId) {
        const subject = this.subjects.find(s => s.id === subjectId);
        if (!subject) return;
        
        this.currentSubject = subject;
        this.app.trackEvent('subject', 'open', subjectId);
        
        // Create subject modal or navigate to subject page
        this.showSubjectModal(subject);
    }
    
    /**
     * Mostra modal com conteúdo da disciplina
     */
    showSubjectModal(subject) {
        const modal = document.createElement('div');
        modal.className = 'modal modal--subject';
        modal.innerHTML = `
            <div class="modal__backdrop" onclick="this.parentElement.remove()"></div>
            <div class="modal__content">
                <div class="modal__header">
                    <div class="subject-header">
                        <div class="subject-header__icon" style="background-color: ${subject.color}">
                            <i class="${subject.icon}"></i>
                        </div>
                        <div class="subject-header__info">
                            <h2>${subject.name}</h2>
                            <p>${subject.description}</p>
                        </div>
                    </div>
                    <button class="modal__close" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="modal__body">
                    <div class="subject-stats">
                        <div class="stat-item">
                            <i class="fas fa-question-circle"></i>
                            <span>${subject.totalQuestions} questões</span>
                        </div>
                        <div class="stat-item">
                            <i class="fas fa-video"></i>
                            <span>${subject.totalLessons} aulas</span>
                        </div>
                        <div class="stat-item">
                            <i class="fas fa-chart-line"></i>
                            <span>${subject.progress}% completo</span>
                        </div>
                    </div>
                    
                    <div class="subject-topics">
                        <h3>Tópicos</h3>
                        <div class="topics-grid">
                            ${subject.topics.map(topic => `
                                <div class="topic-card" data-topic-id="${topic.id}">
                                    <h4>${topic.name}</h4>
                                    <div class="topic-stats">
                                        <span><i class="fas fa-question-circle"></i> ${topic.questions} questões</span>
                                        <span><i class="fas fa-video"></i> ${topic.lessons} aulas</span>
                                    </div>
                                    <div class="topic-progress">
                                        <div class="progress-bar">
                                            <div class="progress-bar__fill" style="width: ${this.getTopicProgress(subject.id, topic.id)}%"></div>
                                        </div>
                                        <span class="progress-text">${this.getTopicProgress(subject.id, topic.id)}%</span>
                                    </div>
                                    <div class="topic-actions">
                                        <button class="btn btn--primary" onclick="window.subjectsManager.startTopicStudy('${subject.id}', '${topic.id}')">
                                            Estudar
                                        </button>
                                        <button class="btn btn--outline" onclick="window.subjectsManager.startTopicTest('${subject.id}', '${topic.id}')">
                                            Testar
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="modal__footer">
                    <button class="btn btn--primary" onclick="window.subjectsManager.startSubjectStudy('${subject.id}')">
                        <i class="fas fa-play"></i> Começar Estudo
                    </button>
                    <button class="btn btn--outline" onclick="window.subjectsManager.startSubjectTest('${subject.id}')">
                        <i class="fas fa-clipboard-check"></i> Simulado
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add modal styles if not already added
        this.addModalStyles();
    }
    
    /**
     * Adiciona estilos para modais
     */
    addModalStyles() {
        if (document.getElementById('modal-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'modal-styles';
        styles.textContent = `
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: var(--z-modal);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: var(--spacing-lg);
            }
            
            .modal__backdrop {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(4px);
            }
            
            .modal__content {
                position: relative;
                background-color: var(--color-bg-card);
                border-radius: var(--border-radius-lg);
                box-shadow: var(--shadow-xl);
                max-width: 800px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                animation: slideInUp 0.3s ease-out;
            }
            
            .modal__header {
                padding: var(--spacing-xl);
                border-bottom: var(--border-width) solid var(--color-border);
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: var(--spacing-lg);
            }
            
            .modal__body {
                padding: var(--spacing-xl);
            }
            
            .modal__footer {
                padding: var(--spacing-xl);
                border-top: var(--border-width) solid var(--color-border);
                display: flex;
                gap: var(--spacing-md);
                justify-content: flex-end;
            }
            
            .modal__close {
                background: none;
                border: none;
                font-size: var(--font-size-xl);
                color: var(--color-text-secondary);
                cursor: pointer;
                padding: var(--spacing-xs);
                border-radius: var(--border-radius-md);
                transition: all var(--transition-fast);
            }
            
            .modal__close:hover {
                color: var(--color-text-primary);
                background-color: var(--color-bg-hover);
            }
            
            .subject-header {
                display: flex;
                align-items: center;
                gap: var(--spacing-lg);
            }
            
            .subject-header__icon {
                width: 60px;
                height: 60px;
                border-radius: var(--border-radius-lg);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: var(--font-size-xl);
                flex-shrink: 0;
            }
            
            .subject-header__info h2 {
                margin: 0 0 var(--spacing-xs) 0;
                font-size: var(--font-size-xl);
            }
            
            .subject-header__info p {
                margin: 0;
                color: var(--color-text-secondary);
                font-size: var(--font-size-sm);
            }
            
            .subject-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: var(--spacing-lg);
                margin-bottom: var(--spacing-xl);
                padding: var(--spacing-lg);
                background-color: var(--color-bg-secondary);
                border-radius: var(--border-radius-md);
            }
            
            .stat-item {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
                font-size: var(--font-size-sm);
                color: var(--color-text-secondary);
            }
            
            .stat-item i {
                color: var(--color-primary);
            }
            
            .topics-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: var(--spacing-lg);
            }
            
            .topic-card {
                padding: var(--spacing-lg);
                border: var(--border-width) solid var(--color-border);
                border-radius: var(--border-radius-md);
                transition: all var(--transition-fast);
            }
            
            .topic-card:hover {
                border-color: var(--color-primary);
                box-shadow: var(--shadow-md);
            }
            
            .topic-card h4 {
                margin: 0 0 var(--spacing-sm) 0;
                font-size: var(--font-size-base);
            }
            
            .topic-stats {
                display: flex;
                gap: var(--spacing-md);
                font-size: var(--font-size-xs);
                color: var(--color-text-secondary);
                margin-bottom: var(--spacing-md);
            }
            
            .topic-progress {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
                margin-bottom: var(--spacing-md);
            }
            
            .topic-progress .progress-bar {
                flex: 1;
                height: 6px;
            }
            
            .topic-progress .progress-text {
                font-size: var(--font-size-xs);
                font-weight: 600;
                color: var(--color-text-secondary);
                min-width: 30px;
                text-align: right;
            }
            
            .topic-actions {
                display: flex;
                gap: var(--spacing-sm);
            }
            
            .topic-actions .btn {
                flex: 1;
                padding: var(--spacing-xs) var(--spacing-sm);
                font-size: var(--font-size-xs);
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
    
    /**
     * Visualiza progresso de uma disciplina
     */
    viewSubjectProgress(subjectId) {
        const subject = this.subjects.find(s => s.id === subjectId);
        if (!subject) return;
        
        this.app.trackEvent('subject', 'view_progress', subjectId);
        
        // Show progress modal or navigate to progress section
        this.showProgressModal(subject);
    }
    
    /**
     * Mostra modal de progresso da disciplina
     */
    showProgressModal(subject) {
        const progressData = this.getSubjectProgressData(subject.id);
        
        const modal = document.createElement('div');
        modal.className = 'modal modal--progress';
        modal.innerHTML = `
            <div class="modal__backdrop" onclick="this.parentElement.remove()"></div>
            <div class="modal__content">
                <div class="modal__header">
                    <h2>Progresso - ${subject.name}</h2>
                    <button class="modal__close" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="modal__body">
                    <div class="progress-overview">
                        <div class="progress-circle">
                            <svg class="progress-circle__svg" viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="54" fill="none" stroke="#e6e6e6" stroke-width="8"/>
                                <circle cx="60" cy="60" r="54" fill="none" stroke="${subject.color}" stroke-width="8" 
                                        stroke-dasharray="339.292" stroke-dashoffset="${339.292 - (339.292 * subject.progress / 100)}"/>
                            </svg>
                            <div class="progress-circle__text">
                                <span class="progress-circle__percentage">${subject.progress}%</span>
                                <small>completo</small>
                            </div>
                        </div>
                        
                        <div class="progress-stats">
                            <div class="progress-stat">
                                <strong>Questões Respondidas:</strong>
                                <span>${progressData.answeredQuestions}/${progressData.totalQuestions}</span>
                            </div>
                            <div class="progress-stat">
                                <strong>Taxa de Acerto:</strong>
                                <span>${progressData.accuracyRate}%</span>
                            </div>
                            <div class="progress-stat">
                                <strong>Tempo de Estudo:</strong>
                                <span>${progressData.studyTime}h</span>
                            </div>
                            <div class="progress-stat">
                                <strong>Última Atividade:</strong>
                                <span>${progressData.lastActivity}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="topic-progress-list">
                        <h3>Progresso por Tópico</h3>
                        ${subject.topics.map(topic => {
                            const topicProgress = this.getTopicProgressData(subject.id, topic.id);
                            return `
                                <div class="topic-progress-item">
                                    <div class="topic-info">
                                        <h4>${topic.name}</h4>
                                        <span>${topicProgress.answeredQuestions}/${topic.questions} questões</span>
                                    </div>
                                    <div class="topic-progress-bar">
                                        <div class="progress-bar">
                                            <div class="progress-bar__fill" style="width: ${topicProgress.progress}%"></div>
                                        </div>
                                        <span class="topic-progress-text">${topicProgress.progress}%</span>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.addProgressModalStyles();
    }
    
    /**
     * Adiciona estilos para modal de progresso
     */
    addProgressModalStyles() {
        if (document.getElementById('progress-modal-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'progress-modal-styles';
        styles.textContent = `
            .progress-overview {
                display: grid;
                grid-template-columns: 200px 1fr;
                gap: var(--spacing-xl);
                margin-bottom: var(--spacing-3xl);
                align-items: center;
            }
            
            .progress-circle {
                position: relative;
                width: 120px;
                height: 120px;
                margin: 0 auto;
            }
            
            .progress-circle__svg {
                width: 100%;
                height: 100%;
                transform: rotate(-90deg);
            }
            
            .progress-circle__text {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
            }
            
            .progress-circle__percentage {
                display: block;
                font-size: var(--font-size-2xl);
                font-weight: 700;
                color: var(--color-text-primary);
            }
            
            .progress-circle__text small {
                color: var(--color-text-secondary);
                font-size: var(--font-size-xs);
            }
            
            .progress-stats {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-md);
            }
            
            .progress-stat {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--spacing-sm) var(--spacing-md);
                background-color: var(--color-bg-secondary);
                border-radius: var(--border-radius-md);
            }
            
            .progress-stat strong {
                color: var(--color-text-primary);
                font-size: var(--font-size-sm);
            }
            
            .progress-stat span {
                color: var(--color-text-secondary);
                font-size: var(--font-size-sm);
            }
            
            .topic-progress-list h3 {
                margin-bottom: var(--spacing-lg);
                font-size: var(--font-size-lg);
            }
            
            .topic-progress-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--spacing-md) 0;
                border-bottom: var(--border-width) solid var(--color-border-light);
            }
            
            .topic-progress-item:last-child {
                border-bottom: none;
            }
            
            .topic-info h4 {
                margin: 0 0 var(--spacing-xs) 0;
                font-size: var(--font-size-base);
            }
            
            .topic-info span {
                color: var(--color-text-secondary);
                font-size: var(--font-size-xs);
            }
            
            .topic-progress-bar {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
                min-width: 200px;
            }
            
            .topic-progress-bar .progress-bar {
                flex: 1;
                height: 8px;
            }
            
            .topic-progress-text {
                font-size: var(--font-size-sm);
                font-weight: 600;
                color: var(--color-text-secondary);
                min-width: 40px;
                text-align: right;
            }
            
            @media (max-width: 768px) {
                .progress-overview {
                    grid-template-columns: 1fr;
                    gap: var(--spacing-lg);
                }
                
                .topic-progress-item {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: var(--spacing-sm);
                }
                
                .topic-progress-bar {
                    width: 100%;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
    
    /**
     * Atualiza progresso de todas as disciplinas
     */
    updateAllSubjectProgress() {
        this.subjects.forEach(subject => {
            const progress = this.calculateSubjectProgress(subject.id);
            subject.progress = progress;
            
            // Update UI
            const subjectCard = document.querySelector(`[data-subject-id="${subject.id}"]`);
            if (subjectCard) {
                const progressFill = subjectCard.querySelector('.progress-ring__progress');
                const progressText = subjectCard.querySelector('.progress-ring__text');
                
                if (progressFill) {
                    const circumference = 2 * Math.PI * 54;
                    const offset = circumference - (progress / 100) * circumference;
                    progressFill.style.strokeDashoffset = offset;
                }
                
                if (progressText) {
                    progressText.textContent = `${progress}%`;
                }
            }
        });
        
        this.saveSubjectsData();
    }
    
    /**
     * Calcula progresso de uma disciplina
     */
    calculateSubjectProgress(subjectId) {
        const progressData = this.subjectProgress[subjectId] || {};
        const subject = this.subjects.find(s => s.id === subjectId);
        
        if (!subject) return 0;
        
        let totalProgress = 0;
        let topicCount = 0;
        
        subject.topics.forEach(topic => {
            const topicProgress = progressData[topic.id] || 0;
            totalProgress += topicProgress;
            topicCount++;
        });
        
        return topicCount > 0 ? Math.round(totalProgress / topicCount) : 0;
    }
    
    /**
     * Obtém progresso de um tópico específico
     */
    getTopicProgress(subjectId, topicId) {
        const progressData = this.subjectProgress[subjectId] || {};
        return progressData[topicId] || 0;
    }
    
    /**
     * Carrega progresso das disciplinas
     */
    loadSubjectProgress() {
        const savedProgress = localStorage.getItem('subjectProgress');
        return savedProgress ? JSON.parse(savedProgress) : {};
    }
    
    /**
     * Salva progresso das disciplinas
     */
    saveSubjectProgress() {
        localStorage.setItem('subjectProgress', JSON.stringify(this.subjectProgress));
    }
    
    /**
     * Salva dados das disciplinas
     */
    saveSubjectsData() {
        localStorage.setItem('subjectsData', JSON.stringify(this.subjects));
    }
    
    /**
     * Obtém dados de progresso de uma disciplina
     */
    getSubjectProgressData(subjectId) {
        const defaultData = {
            answeredQuestions: 0,
            totalQuestions: 0,
            accuracyRate: 0,
            studyTime: 0,
            lastActivity: 'Nunca'
        };
        
        return this.subjectProgress[subjectId] || defaultData;
    }
    
    /**
     * Obtém dados de progresso de um tópico
     */
    getTopicProgressData(subjectId, topicId) {
        const subjectData = this.getSubjectProgressData(subjectId);
        const topicData = subjectData[topicId] || {};
        
        return {
            progress: topicData.progress || 0,
            answeredQuestions: topicData.answeredQuestions || 0,
            totalQuestions: topicData.totalQuestions || 0
        };
    }
    
    /**
     * Inicia estudo de uma disciplina
     */
    startSubjectStudy(subjectId) {
        const subject = this.subjects.find(s => s.id === subjectId);
        if (!subject) return;
        
        this.app.trackEvent('subject', 'start_study', subjectId);
        
        // Navigate to study mode
        this.app.showNotification(`Iniciando estudo de ${subject.name}`, 'success');
        
        // Remove modal
        const modal = document.querySelector('.modal--subject');
        if (modal) modal.remove();
    }
    
    /**
     * Inicia teste de uma disciplina
     */
    startSubjectTest(subjectId) {
        const subject = this.subjects.find(s => s.id === subjectId);
        if (!subject) return;
        
        this.app.trackEvent('subject', 'start_test', subjectId);
        
        // Navigate to test mode
        this.app.showNotification(`Iniciando teste de ${subject.name}`, 'success');
        
        // Remove modal
        const modal = document.querySelector('.modal--subject');
        if (modal) modal.remove();
    }
    
    /**
     * Inicia estudo de um tópico
     */
    startTopicStudy(subjectId, topicId) {
        this.app.trackEvent('topic', 'start_study', `${subjectId}-${topicId}`);
        this.app.showNotification('Iniciando estudo do tópico', 'success');
    }
    
    /**
     * Inicia teste de um tópico
     */
    startTopicTest(subjectId, topicId) {
        this.app.trackEvent('topic', 'start_test', `${subjectId}-${topicId}`);
        this.app.showNotification('Iniciando teste do tópico', 'success');
    }
    
    /**
     * Atualiza interface do usuário
     */
    updateUI() {
        this.updateAllSubjectProgress();
    }
}

// Adiciona ao app principal
if (window.estudosApp) {
    window.estudosApp.loadSubjects = function() {
        if (!this.subjectsManager) {
            this.subjectsManager = new SubjectsManager(this);
        }
        this.subjectsManager.updateUI();
    };
    
    // Global functions
    window.openSubject = function(subjectId) {
        if (window.estudosApp && window.estudosApp.subjectsManager) {
            window.estudosApp.subjectsManager.openSubject(subjectId);
        }
    };
    
    window.viewSubjectProgress = function(subjectId) {
        if (window.estudosApp && window.estudosApp.subjectsManager) {
            window.estudosApp.subjectsManager.viewSubjectProgress(subjectId);
        }
    };
}