/**
 * Progress Module - Sistema de Acompanhamento de Progresso
 * Gerencia gráficos, estatísticas e análise de desempenho
 */

class ProgressManager {
    constructor(app) {
        this.app = app;
        this.charts = {};
        this.progressData = {};
        
        this.init();
    }
    
    init() {
        this.setupProgressEventListeners();
        console.log('📊 Progress Manager inicializado');
    }
    
    /**
     * Configura event listeners para progresso
     */
    setupProgressEventListeners() {
        // Chart interactions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('chart-export-btn')) {
                const chartType = e.target.getAttribute('data-chart-type');
                this.exportChart(chartType);
            }
        });
        
        // Achievement interactions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('achievement-card')) {
                const achievementId = e.target.getAttribute('data-achievement-id');
                this.showAchievementDetails(achievementId);
            }
        });
    }
    
    /**
     * Carrega dados de progresso
     */
    async loadProgress() {
        try {
            // Load progress data from API
            const progressResponse = await fetch('tables/progress');
            const progressData = await progressResponse.json();
            
            // Load test results
            const testsResponse = await fetch('tables/tests');
            const testsData = await testsResponse.json();
            
            // Load activities
            const activitiesResponse = await fetch('tables/activities');
            const activitiesData = await activitiesResponse.json();
            
            // Process data
            this.processProgressData(progressData.data || [], testsData.data || [], activitiesData.data || []);
            
            // Update UI
            this.updateProgressUI();
            this.updateCharts();
            this.loadAchievements();
            
        } catch (error) {
            console.error('Erro ao carregar dados de progresso:', error);
            this.loadDemoProgressData();
        }
    }
    
    /**
     * Processa dados de progresso
     */
    processProgressData(progressData, testsData, activitiesData) {
        this.progressData = {
            bySubject: this.groupBySubject(progressData),
            byTime: this.groupByTime(testsData, activitiesData),
            testResults: this.processTestResults(testsData),
            activities: activitiesData
        };
    }
    
    /**
     * Agrupa dados por disciplina
     */
    groupBySubject(progressData) {
        const grouped = {};
        
        progressData.forEach(item => {
            if (!grouped[item.subject_id]) {
                grouped[item.subject_id] = {
                    subjectId: item.subject_id,
                    progress: 0,
                    answeredQuestions: 0,
                    correctAnswers: 0,
                    studyTime: 0
                };
            }
            
            grouped[item.subject_id].progress = Math.max(grouped[item.subject_id].progress, item.progress || 0);
            grouped[item.subject_id].answeredQuestions += item.answered_questions || 0;
            grouped[item.subject_id].correctAnswers += item.correct_answers || 0;
            grouped[item.subject_id].studyTime += item.study_time || 0;
        });
        
        return Object.values(grouped);
    }
    
    /**
     * Agrupa dados por tempo
     */
    groupByTime(testsData, activitiesData) {
        const dailyData = {};
        const now = new Date();
        
        // Initialize last 30 days
        for (let i = 29; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];
            dailyData[dateKey] = {
                date: dateKey,
                tests: 0,
                studyTime: 0,
                questionsAnswered: 0,
                correctAnswers: 0
            };
        }
        
        // Process test data
        testsData.forEach(test => {
            const date = new Date(test.started_at).toISOString().split('T')[0];
            if (dailyData[date]) {
                dailyData[date].tests++;
                dailyData[date].questionsAnswered += test.total_questions || 0;
                dailyData[date].correctAnswers += test.correct_answers || 0;
            }
        });
        
        // Process activity data
        activitiesData.forEach(activity => {
            const date = new Date(activity.timestamp).toISOString().split('T')[0];
            if (dailyData[date] && activity.activity_type === 'study') {
                const metadata = activity.metadata ? JSON.parse(activity.metadata) : {};
                dailyData[date].studyTime += metadata.studyTime || 0;
            }
        });
        
        return Object.values(dailyData);
    }
    
    /**
     * Processa resultados de testes
     */
    processTestResults(testsData) {
        return testsData.map(test => ({
            id: test.id,
            type: test.test_type,
            score: test.score || 0,
            correctAnswers: test.correct_answers || 0,
            wrongAnswers: test.wrong_answers || 0,
            totalQuestions: test.total_questions || 0,
            date: new Date(test.started_at),
            duration: test.duration || 0
        }));
    }
    
    /**
     * Carrega dados de demonstração
     */
    loadDemoProgressData() {
        this.progressData = {
            bySubject: [
                { subjectId: 'portugues', progress: 65, answeredQuestions: 98, correctAnswers: 78, studyTime: 450 },
                { subjectId: 'matematica', progress: 45, answeredQuestions: 90, correctAnswers: 68, studyTime: 380 },
                { subjectId: 'constitucional', progress: 30, answeredQuestions: 48, correctAnswers: 38, studyTime: 220 },
                { subjectId: 'logica', progress: 55, answeredQuestions: 99, correctAnswers: 71, studyTime: 340 },
                { subjectId: 'ingles', progress: 25, answeredQuestions: 30, correctAnswers: 25, studyTime: 180 }
            ],
            byTime: this.generateDemoTimeData(),
            testResults: this.generateDemoTestResults(),
            activities: this.generateDemoActivities()
        };
        
        this.updateProgressUI();
        this.updateCharts();
        this.loadAchievements();
    }
    
    /**
     * Gera dados de tempo de demonstração
     */
    generateDemoTimeData() {
        const data = [];
        const now = new Date();
        
        for (let i = 29; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            data.push({
                date: date.toISOString().split('T')[0],
                tests: Math.floor(Math.random() * 3),
                studyTime: Math.floor(Math.random() * 60) + 10,
                questionsAnswered: Math.floor(Math.random() * 20) + 5,
                correctAnswers: Math.floor(Math.random() * 15) + 3
            });
        }
        
        return data;
    }
    
    /**
     * Gera resultados de teste de demonstração
     */
    generateDemoTestResults() {
        const results = [];
        const now = new Date();
        
        for (let i = 0; i < 10; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() - i * 3);
            
            const totalQuestions = Math.floor(Math.random() * 30) + 10;
            const correctAnswers = Math.floor(Math.random() * totalQuestions);
            const score = Math.round((correctAnswers / totalQuestions) * 100);
            
            results.push({
                id: `demo-test-${i}`,
                type: i % 2 === 0 ? 'quick' : 'full',
                score: score,
                correctAnswers: correctAnswers,
                wrongAnswers: totalQuestions - correctAnswers,
                totalQuestions: totalQuestions,
                date: date,
                duration: Math.floor(Math.random() * 60) + 15
            });
        }
        
        return results;
    }
    
    /**
     * Gera atividades de demonstração
     */
    generateDemoActivities() {
        return [
            {
                id: 'act-001',
                title: 'Estudo de Português - Gramática',
                description: 'Completou 15 questões de concordância verbal',
                icon: 'fas fa-book',
                type: 'study',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
            },
            {
                id: 'act-002',
                title: 'Simulado Rápido - Matemática',
                description: 'Acertou 8 de 10 questões',
                icon: 'fas fa-clipboard-check',
                type: 'test',
                timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
            },
            {
                id: 'act-003',
                title: 'Videoaula - Direito Constitucional',
                description: 'Assistiu à aula sobre direitos fundamentais',
                icon: 'fas fa-video',
                type: 'video',
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
            }
        ];
    }
    
    /**
     * Atualiza interface de progresso
     */
    updateProgressUI() {
        // Update overall progress
        const overallProgress = this.calculateOverallProgress();
        
        // Update progress cards
        this.updateProgressCards();
        
        // Update recent activities
        this.updateRecentActivities();
    }
    
    /**
     * Calcula progresso geral
     */
    calculateOverallProgress() {
        if (!this.progressData.bySubject || this.progressData.bySubject.length === 0) {
            return 0;
        }
        
        const totalProgress = this.progressData.bySubject.reduce((sum, subject) => sum + (subject.progress || 0), 0);
        return Math.round(totalProgress / this.progressData.bySubject.length);
    }
    
    /**
     * Atualiza cards de progresso
     */
    updateProgressCards() {
        // This would update individual progress cards if needed
    }
    
    /**
     * Atualiza atividades recentes
     */
    updateRecentActivities() {
        const activities = this.progressData.activities || [];
        const recentActivities = activities.slice(0, 5);
        
        // Update dashboard if available
        if (this.app && this.app.updateRecentActivity) {
            this.app.updateRecentActivity(recentActivities);
        }
    }
    
    /**
     * Atualiza gráficos
     */
    updateCharts() {
        this.createSubjectChart();
        this.createTimelineChart();
        this.createPerformanceChart();
    }
    
    /**
     * Cria gráfico de desempenho por disciplina
     */
    createSubjectChart() {
        const ctx = document.getElementById('subjectChart');
        if (!ctx) return;
        
        const data = this.progressData.bySubject;
        const labels = data.map(item => this.getSubjectName(item.subjectId));
        const progressData = data.map(item => item.progress);
        
        if (this.charts.subjectChart) {
            this.charts.subjectChart.destroy();
        }
        
        this.charts.subjectChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Progresso (%)',
                    data: progressData,
                    backgroundColor: 'rgba(37, 99, 235, 0.8)',
                    borderColor: 'rgba(37, 99, 235, 1)',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Progresso por Disciplina'
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }
    
    /**
     * Cria gráfico de evolução temporal
     */
    createTimelineChart() {
        const ctx = document.getElementById('timelineChart');
        if (!ctx) return;
        
        const data = this.progressData.byTime;
        const labels = data.map(item => new Date(item.date).toLocaleDateString());
        const studyTimeData = data.map(item => item.studyTime);
        const questionsData = data.map(item => item.questionsAnswered);
        
        if (this.charts.timelineChart) {
            this.charts.timelineChart.destroy();
        }
        
        this.charts.timelineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Tempo de Estudo (min)',
                    data: studyTimeData,
                    borderColor: 'rgba(37, 99, 235, 1)',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Questões Respondidas',
                    data: questionsData,
                    borderColor: 'rgba(124, 58, 237, 1)',
                    backgroundColor: 'rgba(124, 58, 237, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Evolução Temporal'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    /**
     * Cria gráfico de performance
     */
    createPerformanceChart() {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) return;
        
        const testResults = this.progressData.testResults;
        if (!testResults || testResults.length === 0) return;
        
        const labels = testResults.map((result, index) => `Teste ${index + 1}`);
        const scores = testResults.map(result => result.score);
        
        if (this.charts.performanceChart) {
            this.charts.performanceChart.destroy();
        }
        
        this.charts.performanceChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Português', 'Matemática', 'Direito', 'Lógica', 'Inglês'],
                datasets: [{
                    label: 'Desempenho (%)',
                    data: [75, 60, 45, 70, 30],
                    backgroundColor: 'rgba(37, 99, 235, 0.2)',
                    borderColor: 'rgba(37, 99, 235, 1)',
                    pointBackgroundColor: 'rgba(37, 99, 235, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(37, 99, 235, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Desempenho por Área'
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
    
    /**
     * Carrega conquistas
     */
    async loadAchievements() {
        const achievements = this.generateDemoAchievements();
        this.displayAchievements(achievements);
    }
    
    /**
     * Gera conquistas de demonstração
     */
    generateDemoAchievements() {
        return [
            {
                id: 'first-test',
                title: 'Primeiro Teste',
                description: 'Complete seu primeiro teste',
                icon: 'fas fa-star',
                color: '#fbbf24',
                unlocked: true,
                unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
            },
            {
                id: 'study-streak-7',
                title: 'Maratonista',
                description: 'Estude por 7 dias consecutivos',
                icon: 'fas fa-fire',
                color: '#ef4444',
                unlocked: true,
                unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
            },
            {
                id: 'score-80',
                title: 'Excelência',
                description: 'Atingir 80% de acerto em um teste',
                icon: 'fas fa-trophy',
                color: '#f59e0b',
                unlocked: true,
                unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            },
            {
                id: 'study-10-hours',
                title: 'Dedicado',
                description: 'Complete 10 horas de estudo',
                icon: 'fas fa-clock',
                color: '#10b981',
                unlocked: false
            },
            {
                id: 'perfect-score',
                title: 'Perfeição',
                description: 'Acerte 100% das questões em um teste',
                icon: 'fas fa-gem',
                color: '#8b5cf6',
                unlocked: false
            },
            {
                id: 'all-subjects',
                title: 'Polivalente',
                description: 'Estude todas as disciplinas',
                icon: 'fas fa-graduation-cap',
                color: '#6366f1',
                unlocked: false
            }
        ];
    }
    
    /**
     * Mostra conquistas
     */
    displayAchievements(achievements) {
        const container = document.getElementById('achievements-grid');
        if (!container) return;
        
        container.innerHTML = achievements.map(achievement => `
            <div class="achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}" 
                 data-achievement-id="${achievement.id}">
                <div class="achievement-icon" style="background-color: ${achievement.color}">
                    <i class="${achievement.icon}"></i>
                </div>
                <h4 class="achievement-title">${achievement.title}</h4>
                <p class="achievement-description">${achievement.description}</p>
                ${achievement.unlocked ? `
                    <div class="achievement-date">
                        <small>Desbloqueado em</small>
                        <span>${new Date(achievement.unlockedAt).toLocaleDateString()}</span>
                    </div>
                ` : `
                    <div class="achievement-status">
                        <i class="fas fa-lock"></i>
                        <span>Bloqueado</span>
                    </div>
                `}
            </div>
        `).join('');
        
        this.addAchievementStyles();
    }
    
    /**
     * Adiciona estilos de conquistas
     */
    addAchievementStyles() {
        if (document.getElementById('achievement-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'achievement-styles';
        styles.textContent = `
            .achievements h2 {
                margin-bottom: var(--spacing-lg);
                font-size: var(--font-size-xl);
            }
            
            .badges-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: var(--spacing-lg);
            }
            
            .achievement-card {
                text-align: center;
                padding: var(--spacing-lg);
                border-radius: var(--border-radius-lg);
                background-color: var(--color-bg-card);
                border: var(--border-width) solid var(--color-border);
                transition: all var(--transition-normal);
                cursor: pointer;
            }
            
            .achievement-card:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-md);
            }
            
            .achievement-card.unlocked {
                border-color: var(--color-success);
                background-color: rgba(16, 185, 129, 0.05);
            }
            
            .achievement-card.locked {
                opacity: 0.6;
                cursor: not-allowed;
            }
            
            .achievement-icon {
                width: 60px;
                height: 60px;
                border-radius: var(--border-radius-full);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: var(--font-size-xl);
                margin: 0 auto var(--spacing-sm);
            }
            
            .achievement-title {
                margin: 0 0 var(--spacing-xs) 0;
                font-size: var(--font-size-sm);
                font-weight: 600;
                color: var(--color-text-primary);
            }
            
            .achievement-description {
                font-size: var(--font-size-xs);
                color: var(--color-text-secondary);
                margin: 0 0 var(--spacing-sm) 0;
                line-height: 1.4;
            }
            
            .achievement-date {
                margin-top: var(--spacing-sm);
                padding-top: var(--spacing-sm);
                border-top: var(--border-width) solid var(--color-border-light);
            }
            
            .achievement-date small {
                display: block;
                color: var(--color-text-tertiary);
                font-size: var(--font-size-xs);
                margin-bottom: var(--spacing-xs);
            }
            
            .achievement-date span {
                font-size: var(--font-size-xs);
                color: var(--color-text-secondary);
            }
            
            .achievement-status {
                margin-top: var(--spacing-sm);
                padding-top: var(--spacing-sm);
                border-top: var(--border-width) solid var(--color-border-light);
                color: var(--color-text-tertiary);
                font-size: var(--font-size-xs);
            }
            
            .achievement-status i {
                display: block;
                font-size: var(--font-size-lg);
                margin-bottom: var(--spacing-xs);
            }
        `;
        
        document.head.appendChild(styles);
    }
    
    /**
     * Exporta gráfico
     */
    exportChart(chartType) {
        const chart = this.charts[chartType + 'Chart'];
        if (!chart) return;
        
        const link = document.createElement('a');
        link.download = `grafico-${chartType}.png`;
        link.href = chart.toBase64Image();
        link.click();
        
        this.app.trackEvent('progress', 'chart_exported', chartType);
    }
    
    /**
     * Mostra detalhes de conquista
     */
    showAchievementDetails(achievementId) {
        const achievement = this.generateDemoAchievements().find(a => a.id === achievementId);
        if (!achievement) return;
        
        this.app.showNotification(`${achievement.title}: ${achievement.description}`, 'info');
    }
    
    /**
     * Obtém nome da disciplina
     */
    getSubjectName(subjectId) {
        const names = {
            'portugues': 'Português',
            'ingles': 'Inglês',
            'matematica': 'Matemática',
            'logica': 'Lógica',
            'constitucional': 'Direito Const.',
            'administrativo': 'Dir. Administrativo',
            'financeira': 'Matemática Financeira',
            'bancarios': 'Conhecimentos Bancários',
            'informatica': 'Informática'
        };
        return names[subjectId] || subjectId;
    }
    
    /**
     * Carrega interface de progresso
     */
    loadProgress() {
        this.loadProgress();
        this.addProgressPageStyles();
    }
    
    /**
     * Adiciona estilos da página de progresso
     */
    addProgressPageStyles() {
        if (document.getElementById('progress-page-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'progress-page-styles';
        styles.textContent = `
            .progress-charts {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: var(--spacing-3xl);
                margin-bottom: var(--spacing-3xl);
            }
            
            .chart-container {
                background-color: var(--color-bg-card);
                border-radius: var(--border-radius-lg);
                padding: var(--spacing-xl);
                box-shadow: var(--shadow-md);
                border: var(--border-width) solid var(--color-border);
            }
            
            .chart-container h3 {
                margin-bottom: var(--spacing-lg);
                font-size: var(--font-size-lg);
            }
            
            .chart-container canvas {
                max-width: 100%;
                height: auto;
            }
            
            .chart-actions {
                display: flex;
                gap: var(--spacing-sm);
                justify-content: flex-end;
                margin-top: var(--spacing-md);
            }
            
            .chart-export-btn {
                background-color: var(--color-bg-secondary);
                color: var(--color-text-secondary);
                border: var(--border-width) solid var(--color-border);
                padding: var(--spacing-xs) var(--spacing-sm);
                border-radius: var(--border-radius-md);
                font-size: var(--font-size-xs);
                cursor: pointer;
                transition: all var(--transition-fast);
            }
            
            .chart-export-btn:hover {
                background-color: var(--color-bg-hover);
                color: var(--color-text-primary);
                border-color: var(--color-border-dark);
            }
            
            .achievements {
                background-color: var(--color-bg-card);
                border-radius: var(--border-radius-lg);
                padding: var(--spacing-xl);
                box-shadow: var(--shadow-md);
                border: var(--border-width) solid var(--color-border);
            }
            
            .achievements h2 {
                margin-bottom: var(--spacing-lg);
                font-size: var(--font-size-xl);
            }
            
            @media (max-width: 768px) {
                .progress-charts {
                    grid-template-columns: 1fr;
                    gap: var(--spacing-xl);
                }
                
                .chart-container {
                    padding: var(--spacing-lg);
                }
                
                .chart-container canvas {
                    height: 250px !important;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
}

// Adiciona ao app principal
if (window.estudosApp) {
    window.estudosApp.loadProgress = function() {
        if (!this.progressManager) {
            this.progressManager = new ProgressManager(this);
        }
        this.progressManager.loadProgress();
    };
    
    window.estudosApp.updateCharts = function() {
        if (this.progressManager) {
            this.progressManager.updateCharts();
        }
    };
}