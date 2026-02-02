/**
 * Tests Module - Sistema de Testes e Simulados
 * Gerencia questões, simulados e análise de desempenho
 */

class TestsManager {
    constructor(app) {
        this.app = app;
        this.currentTest = null;
        this.questions = [];
        this.userAnswers = {};
        this.testStartTime = null;
        this.testTimer = null;
        
        this.init();
    }
    
    init() {
        this.setupTestEventListeners();
        console.log('📝 Tests Manager inicializado');
    }
    
    /**
     * Configura event listeners para testes
     */
    setupTestEventListeners() {
        // Test action buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn--test-action')) {
                const action = e.target.getAttribute('data-action');
                const testType = e.target.getAttribute('data-test-type');
                
                switch (action) {
                    case 'start':
                        this.startTest(testType);
                        break;
                    case 'pause':
                        this.pauseTest();
                        break;
                    case 'resume':
                        this.resumeTest();
                        break;
                    case 'submit':
                        this.submitTest();
                        break;
                }
            }
        });
        
        // Answer selection
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('answer-option')) {
                this.selectAnswer(e.target);
            }
        });
        
        // Question navigation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('question-nav__btn')) {
                const questionIndex = parseInt(e.target.getAttribute('data-question'));
                this.navigateToQuestion(questionIndex);
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.currentTest) {
                this.handleKeyboardNavigation(e);
            }
        });
    }
    
    /**
     * Inicia um novo teste
     */
    async startTest(testType) {
        try {
            this.app.showNotification(`Iniciando ${this.getTestTypeName(testType)}...`, 'info');
            
            // Load questions based on test type
            const questions = await this.loadQuestions(testType);
            
            if (!questions || questions.length === 0) {
                this.app.showNotification('Nenhuma questão disponível para este teste.', 'error');
                return;
            }
            
            // Create test object
            this.currentTest = {
                id: this.generateTestId(),
                type: testType,
                questions: questions,
                totalQuestions: questions.length,
                startTime: new Date(),
                timeLimit: this.getTestTimeLimit(testType),
                currentQuestion: 0,
                status: 'started'
            };
            
            this.testStartTime = Date.now();
            this.userAnswers = {};
            
            // Save test start
            await this.saveTestStart();
            
            // Show test interface
            this.showTestInterface();
            
            this.app.trackEvent('test', 'started', testType);
            
        } catch (error) {
            console.error('Erro ao iniciar teste:', error);
            this.app.showNotification('Erro ao iniciar teste. Tente novamente.', 'error');
        }
    }
    
    /**
     * Carrega questões para o teste
     */
    async loadQuestions(testType) {
        try {
            let questions = [];
            
            switch (testType) {
                case 'quick':
                    questions = await this.getQuickTestQuestions();
                    break;
                case 'full':
                    questions = await this.getFullTestQuestions();
                    break;
                case 'topic':
                    const subjectId = prompt('Digite o ID da disciplina:');
                    const topicId = prompt('Digite o ID do tópico:');
                    questions = await this.getTopicQuestions(subjectId, topicId);
                    break;
                default:
                    // Load from API
                    const response = await fetch('tables/questions');
                    const data = await response.json();
                    questions = data.data || [];
                    
                    // Filter by test type requirements
                    if (testType === 'quick') {
                        questions = questions.slice(0, 10);
                    } else if (testType === 'full') {
                        questions = questions.slice(0, 50);
                    }
            }
            
            return questions;
        } catch (error) {
            console.error('Erro ao carregar questões:', error);
            return this.getDemoQuestions(testType);
        }
    }
    
    /**
     * Obtém questões para teste rápido
     */
    getQuickTestQuestions() {
        return [
            {
                id: 'q-001',
                statement: 'Qual é a alternativa correta sobre concordância verbal?',
                options: ['A', 'B', 'C', 'D'],
                correct_answer: 'B',
                explanation: 'A concordância verbal deve estar em conformidade com o sujeito.',
                difficulty: 'medium',
                subject_id: 'portugues',
                topic_id: 'gramatica'
            },
            {
                id: 'q-002',
                statement: 'Assinale a alternativa onde o verbo está correto:',
                options: ['Os alunos estudam', 'O alunos estudam', 'Os aluno estuda', 'O aluno estudam'],
                correct_answer: 'A',
                explanation: 'A concordância deve respeitar número e pessoa.',
                difficulty: 'easy',
                subject_id: 'portugues',
                topic_id: 'gramatica'
            }
            // Add more demo questions...
        ];
    }
    
    /**
     * Obtém questões para teste completo
     */
    getFullTestQuestions() {
        const questions = [];
        for (let i = 1; i <= 50; i++) {
            questions.push({
                id: `q-${i.toString().padStart(3, '0')}`,
                statement: `Questão ${i}: Qual é a resposta correta?`,
                options: ['A', 'B', 'C', 'D'],
                correct_answer: 'B',
                explanation: `Explicação detalhada da questão ${i}.`,
                difficulty: i % 3 === 0 ? 'hard' : (i % 2 === 0 ? 'medium' : 'easy'),
                subject_id: 'portugues',
                topic_id: 'gramatica'
            });
        }
        return questions;
    }
    
    /**
     * Obtém questões por tópico
     */
    getTopicQuestions(subjectId, topicId) {
        // Filter questions by subject and topic
        return this.getDemoQuestions('topic').filter(q => 
            q.subject_id === subjectId && q.topic_id === topicId
        );
    }
    
    /**
     * Obtém questões de demonstração
     */
    getDemoQuestions(testType) {
        const count = testType === 'quick' ? 10 : (testType === 'full' ? 50 : 20);
        const questions = [];
        
        for (let i = 1; i <= count; i++) {
            questions.push({
                id: `demo-q-${i}`,
                statement: `Questão ${i}: Em qual alternativa o verbo está correto?`,
                options: ['Alternativa A', 'Alternativa B', 'Alternativa C', 'Alternativa D'],
                correct_answer: 'B',
                explanation: `A alternativa B está correta porque... (explicação da questão ${i}).`,
                difficulty: i % 3 === 0 ? 'hard' : (i % 2 === 0 ? 'medium' : 'easy'),
                subject_id: 'portugues',
                topic_id: 'gramatica'
            });
        }
        
        return questions;
    }
    
    /**
     * Mostra interface do teste
     */
    showTestInterface() {
        const testContainer = document.createElement('div');
        testContainer.className = 'test-container';
        testContainer.innerHTML = `
            <div class="test-header">
                <div class="test-info">
                    <h2>${this.getTestTypeName(this.currentTest.type)}</h2>
                    <span class="test-progress">Questão 1 de ${this.currentTest.totalQuestions}</span>
                </div>
                <div class="test-timer">
                    <i class="fas fa-clock"></i>
                    <span id="test-timer">${this.formatTime(this.currentTest.timeLimit * 60)}</span>
                </div>
            </div>
            
            <div class="test-content">
                <div class="question-container" id="question-container">
                    <!-- Questions will be loaded here -->
                </div>
                
                <div class="question-navigation">
                    <button class="btn btn--outline" onclick="window.testsManager.previousQuestion()" id="prev-btn" disabled>
                        <i class="fas fa-chevron-left"></i> Anterior
                    </button>
                    <div class="question-nav-grid" id="question-nav-grid">
                        <!-- Question numbers will be loaded here -->
                    </div>
                    <button class="btn btn--outline" onclick="window.testsManager.nextQuestion()" id="next-btn">
                        Próxima <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
            
            <div class="test-footer">
                <div class="test-stats">
                    <span>Respondidas: <strong id="answered-count">0</strong>/${this.currentTest.totalQuestions}</span>
                    <span>Tempo: <strong id="time-spent">00:00</strong></span>
                </div>
                <button class="btn btn--primary btn--test-action" data-action="submit" data-test-type="${this.currentTest.type}">
                    Finalizar Teste
                </button>
            </div>
        `;
        
        // Replace main content with test interface
        const mainContent = document.querySelector('.main');
        mainContent.style.display = 'none';
        
        const container = document.querySelector('.container');
        container.appendChild(testContainer);
        
        // Load first question
        this.loadQuestion(0);
        this.updateQuestionNavigation();
        this.startTimer();
        
        // Add test styles
        this.addTestStyles();
    }
    
    /**
     * Carrega questão específica
     */
    loadQuestion(index) {
        if (index < 0 || index >= this.currentTest.totalQuestions) return;
        
        this.currentTest.currentQuestion = index;
        const question = this.currentTest.questions[index];
        const container = document.getElementById('question-container');
        
        if (!container || !question) return;
        
        container.innerHTML = `
            <div class="question-item">
                <div class="question-header">
                    <div class="question-number">Questão ${index + 1}</div>
                    <div class="question-difficulty difficulty--${question.difficulty}">
                        ${this.getDifficultyLabel(question.difficulty)}
                    </div>
                </div>
                
                <div class="question-statement">
                    <p>${question.statement}</p>
                </div>
                
                <div class="question-options">
                    ${question.options.map((option, optIndex) => `
                        <div class="answer-option ${this.userAnswers[question.id] === option ? 'selected' : ''}" 
                             data-question="${question.id}" 
                             data-answer="${option}">
                            <span class="option-label">${String.fromCharCode(65 + optIndex)})</span>
                            <span class="option-text">${option}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Update navigation
        this.updateNavigationButtons();
        this.updateQuestionStatus();
        
        // Scroll to top
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    /**
     * Navega para questão anterior
     */
    previousQuestion() {
        const currentIndex = this.currentTest.currentQuestion;
        if (currentIndex > 0) {
            this.loadQuestion(currentIndex - 1);
        }
    }
    
    /**
     * Navega para próxima questão
     */
    nextQuestion() {
        const currentIndex = this.currentTest.currentQuestion;
        if (currentIndex < this.currentTest.totalQuestions - 1) {
            this.loadQuestion(currentIndex + 1);
        }
    }
    
    /**
     * Navega para questão específica
     */
    navigateToQuestion(index) {
        this.loadQuestion(index);
    }
    
    /**
     * Seleciona resposta
     */
    selectAnswer(optionElement) {
        const questionId = optionElement.getAttribute('data-question');
        const answer = optionElement.getAttribute('data-answer');
        
        // Remove previous selection
        document.querySelectorAll(`[data-question="${questionId}"]`).forEach(el => {
            el.classList.remove('selected');
        });
        
        // Select new answer
        optionElement.classList.add('selected');
        this.userAnswers[questionId] = answer;
        
        this.updateQuestionStatus();
        this.updateAnsweredCount();
        
        // Auto advance to next question (optional)
        setTimeout(() => {
            if (this.currentTest.currentQuestion < this.currentTest.totalQuestions - 1) {
                this.nextQuestion();
            }
        }, 500);
    }
    
    /**
     * Atualiza status da questão atual
     */
    updateQuestionStatus() {
        const question = this.currentTest.questions[this.currentTest.currentQuestion];
        const isAnswered = this.userAnswers.hasOwnProperty(question.id);
        
        // Update question navigation
        const navButton = document.querySelector(`[data-question-nav="${this.currentTest.currentQuestion}"]`);
        if (navButton) {
            navButton.classList.toggle('answered', isAnswered);
        }
    }
    
    /**
     * Atualiza contador de questões respondidas
     */
    updateAnsweredCount() {
        const answeredCount = Object.keys(this.userAnswers).length;
        const answeredEl = document.getElementById('answered-count');
        if (answeredEl) {
            answeredEl.textContent = answeredCount;
        }
    }
    
    /**
     * Atualiza botões de navegação
     */
    updateNavigationButtons() {
        const currentIndex = this.currentTest.currentQuestion;
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        if (prevBtn) {
            prevBtn.disabled = currentIndex === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = currentIndex === this.currentTest.totalQuestions - 1;
        }
    }
    
    /**
     * Atualiza navegação de questões
     */
    updateQuestionNavigation() {
        const navGrid = document.getElementById('question-nav-grid');
        if (!navGrid) return;
        
        navGrid.innerHTML = this.currentTest.questions.map((question, index) => `
            <button class="question-nav__btn ${this.userAnswers.hasOwnProperty(question.id) ? 'answered' : ''}" 
                    data-question="${index}" 
                    data-question-nav="${index}">
                ${index + 1}
            </button>
        `).join('');
    }
    
    /**
     * Manipula navegação por teclado
     */
    handleKeyboardNavigation(e) {
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.previousQuestion();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextQuestion();
                break;
            case '1':
            case '2':
            case '3':
            case '4':
                e.preventDefault();
                const optionIndex = parseInt(e.key) - 1;
                const option = document.querySelectorAll('.answer-option')[optionIndex];
                if (option) {
                    this.selectAnswer(option);
                }
                break;
        }
    }
    
    /**
     * Inicia temporizador do teste
     */
    startTimer() {
        const timeLimit = this.currentTest.timeLimit * 60; // Convert to seconds
        let timeRemaining = timeLimit;
        
        this.testTimer = setInterval(() => {
            timeRemaining--;
            
            // Update timer display
            const timerEl = document.getElementById('test-timer');
            if (timerEl) {
                timerEl.textContent = this.formatTime(timeRemaining);
            }
            
            // Update time spent
            const timeSpent = Math.floor((Date.now() - this.testStartTime) / 1000);
            const timeSpentEl = document.getElementById('time-spent');
            if (timeSpentEl) {
                timeSpentEl.textContent = this.formatTime(timeSpent);
            }
            
            // Check if time is up
            if (timeRemaining <= 0) {
                this.timeUp();
            }
        }, 1000);
    }
    
    /**
     * Finaliza teste por falta de tempo
     */
    timeUp() {
        clearInterval(this.testTimer);
        this.app.showNotification('Tempo esgotado! Finalizando teste...', 'warning');
        this.submitTest();
    }
    
    /**
     * Submete teste para correção
     */
    async submitTest() {
        if (this.currentTest.status === 'completed') return;
        
        clearInterval(this.testTimer);
        
        // Confirm submission
        const answeredCount = Object.keys(this.userAnswers).length;
        if (answeredCount < this.currentTest.totalQuestions) {
            const confirmSubmit = confirm(`Você respondeu ${answeredCount} de ${this.currentTest.totalQuestions} questões. Deseja finalizar mesmo assim?`);
            if (!confirmSubmit) return;
        }
        
        this.currentTest.status = 'completed';
        this.currentTest.endTime = new Date();
        
        // Calculate results
        const results = this.calculateResults();
        
        // Save test results
        await this.saveTestResults(results);
        
        // Show results
        this.showTestResults(results);
        
        this.app.trackEvent('test', 'completed', this.currentTest.type);
    }
    
    /**
     * Calcula resultados do teste
     */
    calculateResults() {
        let correctAnswers = 0;
        let wrongAnswers = 0;
        let unanswered = 0;
        
        this.currentTest.questions.forEach(question => {
            const userAnswer = this.userAnswers[question.id];
            
            if (!userAnswer) {
                unanswered++;
            } else if (userAnswer === question.correct_answer) {
                correctAnswers++;
            } else {
                wrongAnswers++;
            }
        });
        
        const totalAnswered = correctAnswers + wrongAnswers;
        const score = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;
        const timeSpent = Math.floor((Date.now() - this.testStartTime) / 1000);
        
        return {
            correctAnswers,
            wrongAnswers,
            unanswered,
            totalAnswered,
            score,
            timeSpent,
            totalQuestions: this.currentTest.totalQuestions
        };
    }
    
    /**
     * Mostra resultados do teste
     */
    showTestResults(results) {
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'test-results';
        resultsContainer.innerHTML = `
            <div class="results-header">
                <h2>Resultados do ${this.getTestTypeName(this.currentTest.type)}</h2>
                <div class="results-score">
                    <div class="score-circle">
                        <svg class="score-circle__svg" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="54" fill="none" stroke="#e6e6e6" stroke-width="8"/>
                            <circle cx="60" cy="60" r="54" fill="none" stroke="${this.getScoreColor(results.score)}" stroke-width="8" 
                                    stroke-dasharray="339.292" stroke-dashoffset="${339.292 - (339.292 * results.score / 100)}"/>
                        </svg>
                        <div class="score-text">
                            <span class="score-percentage">${results.score}%</span>
                            <small>de acerto</small>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="results-stats">
                <div class="stat-card">
                    <div class="stat-icon correct">
                        <i class="fas fa-check"></i>
                    </div>
                    <div class="stat-content">
                        <h4>Corretas</h4>
                        <span class="stat-value">${results.correctAnswers}</span>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon wrong">
                        <i class="fas fa-times"></i>
                    </div>
                    <div class="stat-content">
                        <h4>Erradas</h4>
                        <span class="stat-value">${results.wrongAnswers}</span>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon unanswered">
                        <i class="fas fa-question"></i>
                    </div>
                    <div class="stat-content">
                        <h4>Não respondidas</h4>
                        <span class="stat-value">${results.unanswered}</span>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon time">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="stat-content">
                        <h4>Tempo</h4>
                        <span class="stat-value">${this.formatTime(results.timeSpent)}</span>
                    </div>
                </div>
            </div>
            
            <div class="results-actions">
                <button class="btn btn--primary" onclick="window.testsManager.reviewTest()">
                    <i class="fas fa-eye"></i> Revisar Questões
                </button>
                <button class="btn btn--outline" onclick="window.testsManager.closeTest()">
                    <i class="fas fa-home"></i> Voltar ao Início
                </button>
            </div>
        `;
        
        // Replace test interface with results
        const testContainer = document.querySelector('.test-container');
        if (testContainer) {
            testContainer.replaceWith(resultsContainer);
        }
        
        this.addResultsStyles();
    }
    
    /**
     * Adiciona estilos para testes
     */
    addTestStyles() {
        if (document.getElementById('test-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'test-styles';
        styles.textContent = `
            .test-container {
                background-color: var(--color-bg-card);
                border-radius: var(--border-radius-lg);
                box-shadow: var(--shadow-lg);
                margin: var(--spacing-xl) 0;
                overflow: hidden;
            }
            
            .test-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--spacing-xl);
                border-bottom: var(--border-width) solid var(--color-border);
                background-color: var(--color-bg-secondary);
            }
            
            .test-info h2 {
                margin: 0 0 var(--spacing-xs) 0;
                font-size: var(--font-size-xl);
            }
            
            .test-progress {
                color: var(--color-text-secondary);
                font-size: var(--font-size-sm);
            }
            
            .test-timer {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
                font-size: var(--font-size-lg);
                font-weight: 600;
                color: var(--color-primary);
            }
            
            .test-content {
                padding: var(--spacing-xl);
            }
            
            .question-container {
                margin-bottom: var(--spacing-xl);
            }
            
            .question-item {
                background-color: var(--color-bg-primary);
                border: var(--border-width) solid var(--color-border);
                border-radius: var(--border-radius-lg);
                padding: var(--spacing-xl);
            }
            
            .question-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: var(--spacing-lg);
            }
            
            .question-number {
                font-size: var(--font-size-lg);
                font-weight: 600;
                color: var(--color-text-primary);
            }
            
            .question-difficulty {
                padding: var(--spacing-xs) var(--spacing-sm);
                border-radius: var(--border-radius-full);
                font-size: var(--font-size-xs);
                font-weight: 500;
                text-transform: uppercase;
            }
            
            .difficulty--easy {
                background-color: rgba(16, 185, 129, 0.1);
                color: var(--color-success);
            }
            
            .difficulty--medium {
                background-color: rgba(245, 158, 11, 0.1);
                color: var(--color-warning);
            }
            
            .difficulty--hard {
                background-color: rgba(239, 68, 68, 0.1);
                color: var(--color-error);
            }
            
            .question-statement {
                margin-bottom: var(--spacing-xl);
            }
            
            .question-statement p {
                font-size: var(--font-size-lg);
                line-height: 1.6;
                color: var(--color-text-primary);
            }
            
            .question-options {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-md);
            }
            
            .answer-option {
                display: flex;
                align-items: center;
                gap: var(--spacing-md);
                padding: var(--spacing-lg);
                border: var(--border-width) solid var(--color-border);
                border-radius: var(--border-radius-md);
                cursor: pointer;
                transition: all var(--transition-fast);
            }
            
            .answer-option:hover {
                border-color: var(--color-primary);
                background-color: rgba(37, 99, 235, 0.05);
            }
            
            .answer-option.selected {
                border-color: var(--color-primary);
                background-color: rgba(37, 99, 235, 0.1);
            }
            
            .option-label {
                font-weight: 600;
                color: var(--color-primary);
                min-width: 30px;
            }
            
            .option-text {
                color: var(--color-text-primary);
            }
            
            .question-navigation {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: var(--spacing-lg);
                margin-top: var(--spacing-xl);
            }
            
            .question-nav-grid {
                display: flex;
                gap: var(--spacing-xs);
                flex-wrap: wrap;
                justify-content: center;
            }
            
            .question-nav__btn {
                width: 40px;
                height: 40px;
                border: var(--border-width) solid var(--color-border);
                background-color: var(--color-bg-primary);
                border-radius: var(--border-radius-md);
                cursor: pointer;
                transition: all var(--transition-fast);
                font-size: var(--font-size-sm);
                font-weight: 500;
            }
            
            .question-nav__btn:hover {
                border-color: var(--color-primary);
                background-color: rgba(37, 99, 235, 0.1);
            }
            
            .question-nav__btn.answered {
                background-color: var(--color-success);
                color: white;
                border-color: var(--color-success);
            }
            
            .test-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--spacing-xl);
                border-top: var(--border-width) solid var(--color-border);
                background-color: var(--color-bg-secondary);
            }
            
            .test-stats {
                display: flex;
                gap: var(--spacing-lg);
                font-size: var(--font-size-sm);
                color: var(--color-text-secondary);
            }
            
            .test-stats strong {
                color: var(--color-text-primary);
            }
            
            @media (max-width: 768px) {
                .test-header {
                    flex-direction: column;
                    gap: var(--spacing-md);
                    text-align: center;
                }
                
                .question-navigation {
                    flex-direction: column;
                    gap: var(--spacing-md);
                }
                
                .question-nav-grid {
                    order: -1;
                }
                
                .test-footer {
                    flex-direction: column;
                    gap: var(--spacing-md);
                    text-align: center;
                }
                
                .test-stats {
                    flex-direction: column;
                    gap: var(--spacing-sm);
                    text-align: center;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
    
    /**
     * Adiciona estilos para resultados
     */
    addResultsStyles() {
        if (document.getElementById('results-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'results-styles';
        styles.textContent = `
            .test-results {
                background-color: var(--color-bg-card);
                border-radius: var(--border-radius-lg);
                box-shadow: var(--shadow-lg);
                margin: var(--spacing-xl) 0;
                padding: var(--spacing-xl);
            }
            
            .results-header {
                text-align: center;
                margin-bottom: var(--spacing-3xl);
            }
            
            .results-header h2 {
                margin: 0 0 var(--spacing-md) 0;
                font-size: var(--font-size-2xl);
            }
            
            .score-circle {
                position: relative;
                width: 150px;
                height: 150px;
                margin: 0 auto;
            }
            
            .score-circle__svg {
                width: 100%;
                height: 100%;
                transform: rotate(-90deg);
            }
            
            .score-text {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
            }
            
            .score-percentage {
                display: block;
                font-size: var(--font-size-3xl);
                font-weight: 700;
                color: var(--color-text-primary);
            }
            
            .score-text small {
                color: var(--color-text-secondary);
                font-size: var(--font-size-xs);
            }
            
            .results-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: var(--spacing-lg);
                margin: var(--spacing-3xl) 0;
            }
            
            .results-stats .stat-card {
                background-color: var(--color-bg-secondary);
                border: var(--border-width) solid var(--color-border);
            }
            
            .results-stats .stat-icon {
                width: 50px;
                height: 50px;
                border-radius: var(--border-radius-full);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: var(--font-size-lg);
                margin: 0 auto var(--spacing-sm);
            }
            
            .results-stats .stat-icon.correct {
                background-color: var(--color-success);
            }
            
            .results-stats .stat-icon.wrong {
                background-color: var(--color-error);
            }
            
            .results-stats .stat-icon.unanswered {
                background-color: var(--color-text-tertiary);
            }
            
            .results-stats .stat-icon.time {
                background-color: var(--color-primary);
            }
            
            .results-actions {
                display: flex;
                gap: var(--spacing-md);
                justify-content: center;
                margin-top: var(--spacing-3xl);
            }
            
            @media (max-width: 768px) {
                .results-actions {
                    flex-direction: column;
                }
                
                .results-stats {
                    grid-template-columns: 1fr;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
    
    /**
     * Revisa teste com gabarito
     */
    reviewTest() {
        this.app.showNotification('Funcionalidade de revisão em desenvolvimento...', 'info');
    }
    
    /**
     * Fecha teste e volta ao dashboard
     */
    closeTest() {
        // Remove test interface
        const resultsContainer = document.querySelector('.test-results');
        if (resultsContainer) {
            resultsContainer.remove();
        }
        
        // Show main content
        const mainContent = document.querySelector('.main');
        if (mainContent) {
            mainContent.style.display = 'block';
        }
        
        // Reset test state
        this.currentTest = null;
        this.userAnswers = {};
        this.testStartTime = null;
        
        // Navigate to dashboard
        if (this.app) {
            this.app.navigateToSection('dashboard');
        }
    }
    
    /**
     * Salva início do teste
     */
    async saveTestStart() {
        const testData = {
            id: this.currentTest.id,
            user_id: 'user-001', // Get from user session
            test_type: this.currentTest.type,
            total_questions: this.currentTest.totalQuestions,
            status: 'started',
            started_at: this.currentTest.startTime.toISOString()
        };
        
        try {
            await fetch('tables/tests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testData)
            });
        } catch (error) {
            console.error('Erro ao salvar início do teste:', error);
            // Store locally for sync
            this.storeTestDataLocally(testData);
        }
    }
    
    /**
     * Salva resultados do teste
     */
    async saveTestResults(results) {
        const testData = {
            correct_answers: results.correctAnswers,
            wrong_answers: results.wrongAnswers,
            score: results.score,
            duration: Math.floor(results.timeSpent / 60),
            status: 'completed',
            completed_at: new Date().toISOString()
        };
        
        try {
            await fetch(`tables/tests/${this.currentTest.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testData)
            });
        } catch (error) {
            console.error('Erro ao salvar resultados do teste:', error);
            // Store locally for sync
            this.storeTestDataLocally({ id: this.currentTest.id, ...testData });
        }
    }
    
    /**
     * Armazena dados do teste localmente (para sincronização offline)
     */
    storeTestDataLocally(testData) {
        const storedTests = JSON.parse(localStorage.getItem('pendingTests') || '[]');
        storedTests.push({
            ...testData,
            timestamp: new Date().toISOString(),
            synced: false
        });
        localStorage.setItem('pendingTests', JSON.stringify(storedTests));
    }
    
    /**
     * Obtém nome do tipo de teste
     */
    getTestTypeName(testType) {
        const names = {
            'quick': 'Simulado Rápido',
            'full': 'Simulado Completo',
            'topic': 'Teste por Tópico'
        };
        return names[testType] || 'Teste';
    }
    
    /**
     * Obtém limite de tempo do teste
     */
    getTestTimeLimit(testType) {
        const limits = {
            'quick': 15,    // 15 minutes
            'full': 120,    // 2 hours
            'topic': 30    // 30 minutes
        };
        return limits[testType] || 30;
    }
    
    /**
     * Obtém label de dificuldade
     */
    getDifficultyLabel(difficulty) {
        const labels = {
            'easy': 'Fácil',
            'medium': 'Médio',
            'hard': 'Difícil'
        };
        return labels[difficulty] || 'Médio';
    }
    
    /**
     * Formata tempo em minutos:segundos
     */
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    /**
     * Obtém cor baseada na pontuação
     */
    getScoreColor(score) {
        if (score >= 80) return 'var(--color-success)';
        if (score >= 60) return 'var(--color-warning)';
        return 'var(--color-error)';
    }
    
    /**
     * Gera ID único para teste
     */
    generateTestId() {
        return `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Carrega testes recentes
     */
    async loadRecentTests() {
        try {
            const response = await fetch('tables/tests?limit=5&sort=started_at:desc');
            const data = await response.json();
            
            const recentTests = data.data || [];
            this.displayRecentTests(recentTests);
        } catch (error) {
            console.error('Erro ao carregar testes recentes:', error);
            this.displayRecentTests([]);
        }
    }
    
    /**
     * Mostra testes recentes
     */
    displayRecentTests(tests) {
        const container = document.getElementById('recent-tests');
        if (!container) return;
        
        if (tests.length === 0) {
            container.innerHTML = `
                <div class="test-empty">
                    <i class="fas fa-clipboard-list"></i>
                    <p>Nenhum teste realizado ainda</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = tests.map(test => `
            <div class="test-item">
                <div class="test-item__info">
                    <h4>${this.getTestTypeName(test.test_type)}</h4>
                    <p>${test.total_questions} questões • ${test.score || 0}% acerto</p>
                    <small>${new Date(test.started_at).toLocaleDateString()}</small>
                </div>
                <div class="test-item__score">
                    <span class="score-badge ${this.getScoreClass(test.score || 0)}">
                        ${test.score || 0}%
                    </span>
                </div>
            </div>
        `).join('');
    }
    
    /**
     * Obtém classe CSS baseada na pontuação
     */
    getScoreClass(score) {
        if (score >= 80) return 'score-excellent';
        if (score >= 60) return 'score-good';
        return 'score-needs-improvement';
    }
    
    /**
     * Carrega interface de testes
     */
    loadTests() {
        this.loadRecentTests();
        this.addTestPageStyles();
    }
    
    /**
     * Adiciona estilos da página de testes
     */
    addTestPageStyles() {
        if (document.getElementById('test-page-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'test-page-styles';
        styles.textContent = `
            .test-options {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: var(--spacing-xl);
                margin-bottom: var(--spacing-3xl);
            }
            
            .test-card {
                background-color: var(--color-bg-card);
                border-radius: var(--border-radius-lg);
                padding: var(--spacing-xl);
                box-shadow: var(--shadow-md);
                border: var(--border-width) solid var(--color-border);
                text-align: center;
                transition: all var(--transition-normal);
            }
            
            .test-card:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-lg);
            }
            
            .test-card__header {
                margin-bottom: var(--spacing-lg);
            }
            
            .test-card__header i {
                font-size: var(--font-size-3xl);
                color: var(--color-primary);
                margin-bottom: var(--spacing-md);
            }
            
            .test-card__header h3 {
                margin: 0;
                font-size: var(--font-size-xl);
            }
            
            .test-card__content {
                margin-bottom: var(--spacing-xl);
            }
            
            .test-card__content p {
                margin: 0 0 var(--spacing-sm) 0;
                font-size: var(--font-size-sm);
            }
            
            .test-card__difficulty {
                display: inline-block;
                background-color: var(--color-bg-secondary);
                color: var(--color-text-secondary);
                padding: var(--spacing-xs) var(--spacing-sm);
                border-radius: var(--border-radius-full);
                font-size: var(--font-size-xs);
                font-weight: 500;
            }
            
            .recent-tests {
                background-color: var(--color-bg-card);
                border-radius: var(--border-radius-lg);
                padding: var(--spacing-xl);
                box-shadow: var(--shadow-md);
                border: var(--border-width) solid var(--color-border);
            }
            
            .recent-tests h2 {
                margin-bottom: var(--spacing-lg);
                font-size: var(--font-size-xl);
            }
            
            .tests-list {
                min-height: 150px;
            }
            
            .test-empty {
                text-align: center;
                padding: var(--spacing-xl);
                color: var(--color-text-secondary);
            }
            
            .test-empty i {
                font-size: var(--font-size-3xl);
                margin-bottom: var(--spacing-md);
                opacity: 0.5;
            }
            
            .test-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--spacing-md);
                border-bottom: var(--border-width) solid var(--color-border-light);
                transition: all var(--transition-fast);
            }
            
            .test-item:hover {
                background-color: var(--color-bg-hover);
            }
            
            .test-item:last-child {
                border-bottom: none;
            }
            
            .test-item__info h4 {
                margin: 0 0 var(--spacing-xs) 0;
                font-size: var(--font-size-base);
            }
            
            .test-item__info p {
                margin: 0 0 var(--spacing-xs) 0;
                font-size: var(--font-size-sm);
                color: var(--color-text-secondary);
            }
            
            .test-item__info small {
                color: var(--color-text-tertiary);
                font-size: var(--font-size-xs);
            }
            
            .test-item__score {
                text-align: right;
            }
            
            .score-badge {
                display: inline-block;
                padding: var(--spacing-xs) var(--spacing-sm);
                border-radius: var(--border-radius-full);
                font-size: var(--font-size-sm);
                font-weight: 600;
                min-width: 60px;
                text-align: center;
            }
            
            .score-excellent {
                background-color: var(--color-success);
                color: white;
            }
            
            .score-good {
                background-color: var(--color-warning);
                color: white;
            }
            
            .score-needs-improvement {
                background-color: var(--color-error);
                color: white;
            }
        `;
        
        document.head.appendChild(styles);
    }
}

// Adiciona ao app principal
if (window.estudosApp) {
    window.estudosApp.loadTests = function() {
        if (!this.testsManager) {
            this.testsManager = new TestsManager(this);
        }
        this.testsManager.loadTests();
    };
    
    // Global functions
    window.startQuickTest = function() {
        if (window.estudosApp && window.estudosApp.testsManager) {
            window.estudosApp.testsManager.startTest('quick');
        }
    };
    
    window.startFullTest = function() {
        if (window.estudosApp && window.estudosApp.testsManager) {
            window.estudosApp.testsManager.startTest('full');
        }
    };
    
    window.selectTopicTest = function() {
        if (window.estudosApp && window.estudosApp.testsManager) {
            window.estudosApp.testsManager.startTest('topic');
        }
    };
}