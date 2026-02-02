/**
 * Videos Module - Catálogo de Videoaulas
 * Gerencia o catálogo e reprodução de vídeos educacionais
 */

class VideosManager {
    constructor(app) {
        this.app = app;
        this.currentVideo = null;
        this.videos = [];
        
        this.init();
    }
    
    init() {
        this.setupVideoEventListeners();
        console.log('🎥 Videos Manager inicializado');
    }
    
    /**
     * Configura event listeners para vídeos
     */
    setupVideoEventListeners() {
        // Video card clicks
        document.addEventListener('click', (e) => {
            const videoCard = e.target.closest('.video-card');
            if (videoCard) {
                const videoId = videoCard.getAttribute('data-video-id');
                if (videoId) {
                    this.playVideo(videoId);
                }
            }
        });
    }
    
    /**
     * Carrega vídeos da API
     */
    async loadVideos() {
        try {
            const response = await fetch('tables/videos');
            const data = await response.json();
            
            if (data.data && data.data.length > 0) {
                this.videos = data.data.map(video => ({
                    id: video.id,
                    title: video.title,
                    description: video.description,
                    videoUrl: video.video_url,
                    thumbnailUrl: video.thumbnail_url,
                    duration: video.duration,
                    subjectId: video.subject_id,
                    topicId: video.topic_id,
                    category: video.category,
                    tags: video.tags ? JSON.parse(video.tags) : [],
                    views: video.views || 0,
                    publishedAt: video.published_at
                }));
                
                this.displayVideos();
            } else {
                this.loadDemoVideos();
            }
        } catch (error) {
            console.error('Erro ao carregar vídeos:', error);
            this.loadDemoVideos();
        }
    }
    
    /**
     * Carrega vídeos de demonstração
     */
    loadDemoVideos() {
        this.videos = [
            {
                id: 'portugues-gramatica-001',
                title: 'Gramática Portuguesa - Aula 1',
                description: 'Aprenda os fundamentos da gramática portuguesa com foco em concordância verbal e nominal',
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                thumbnailUrl: 'https://via.placeholder.com/320x180?text=Gramática',
                duration: 900, // 15 minutes
                subjectId: 'portugues',
                topicId: 'gramatica',
                category: 'portuguese',
                tags: ['gramática', 'concordância', 'português'],
                views: 1250,
                publishedAt: '2024-01-15T10:00:00Z'
            },
            {
                id: 'matematica-algebra-001',
                title: 'Álgebra - Equações do 1º Grau',
                description: 'Aprenda a resolver equações do primeiro grau com exemplos práticos',
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                thumbnailUrl: 'https://via.placeholder.com/320x180?text=Álgebra',
                duration: 1200, // 20 minutes
                subjectId: 'matematica',
                topicId: 'algebra',
                category: 'mathematics',
                tags: ['álgebra', 'equações', 'matemática'],
                views: 890,
                publishedAt: '2024-01-16T14:30:00Z'
            },
            {
                id: 'direito-constitucional-001',
                title: 'Direitos Fundamentais - Aula 1',
                description: 'Introdução aos direitos fundamentais na Constituição Federal',
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                thumbnailUrl: 'https://via.placeholder.com/320x180?text=Direitos',
                duration: 1500, // 25 minutes
                subjectId: 'constitucional',
                topicId: 'direitos-fundamentais',
                category: 'law',
                tags: ['direitos', 'constituição', 'fundamental'],
                views: 650,
                publishedAt: '2024-01-17T09:15:00Z'
            },
            {
                id: 'logica-proposicional-001',
                title: 'Lógica Proposicional - Introdução',
                description: 'Conceitos básicos de lógica proposicional para concursos',
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                thumbnailUrl: 'https://via.placeholder.com/320x180?text=Lógica',
                duration: 1050, // 17.5 minutes
                subjectId: 'logica',
                topicId: 'logica-proposicional',
                category: 'logic',
                tags: ['lógica', 'proposicional', 'razão'],
                views: 720,
                publishedAt: '2024-01-18T11:45:00Z'
            }
        ];
        
        this.displayVideos();
    }
    
    /**
     * Mostra vídeos na interface
     */
    displayVideos(filter = 'all') {
        const videoGrid = document.getElementById('video-grid');
        if (!videoGrid) return;
        
        const filteredVideos = filter === 'all' 
            ? this.videos 
            : this.videos.filter(video => video.category === filter);
        
        if (filteredVideos.length === 0) {
            videoGrid.innerHTML = `
                <div class="video-empty">
                    <i class="fas fa-video"></i>
                    <p>Nenhum vídeo disponível nesta categoria.</p>
                </div>
            `;
            return;
        }
        
        videoGrid.innerHTML = filteredVideos.map(video => `
            <div class="video-card" data-video-id="${video.id}">
                <div class="video-card__thumbnail">
                    <img src="${video.thumbnailUrl}" alt="${video.title}" loading="lazy">
                    <div class="video-card__play">
                        <i class="fas fa-play"></i>
                    </div>
                    <div class="video-card__duration">${this.formatDuration(video.duration)}</div>
                </div>
                <div class="video-card__content">
                    <h3 class="video-card__title">${video.title}</h3>
                    <div class="video-card__meta">
                        <span><i class="fas fa-eye"></i> ${video.views}</span>
                        <span><i class="fas fa-clock"></i> ${this.formatDuration(video.duration)}</span>
                    </div>
                    <p class="video-card__description">${video.description}</p>
                </div>
            </div>
        `).join('');
    }
    
    /**
     * Reproduz vídeo
     */
    playVideo(videoId) {
        const video = this.videos.find(v => v.id === videoId);
        if (!video) return;
        
        this.currentVideo = video;
        this.app.trackEvent('video', 'play', videoId);
        
        // Show video player modal
        this.showVideoPlayer(video);
        
        // Increment view count
        this.incrementViewCount(videoId);
    }
    
    /**
     * Mostra player de vídeo
     */
    showVideoPlayer(video) {
        const modal = document.createElement('div');
        modal.className = 'modal modal--video';
        modal.innerHTML = `
            <div class="modal__backdrop" onclick="this.parentElement.remove()"></div>
            <div class="modal__content modal__content--video">
                <div class="modal__header">
                    <h2>${video.title}</h2>
                    <button class="modal__close" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="modal__body">
                    <div class="video-player">
                        <iframe 
                            src="${video.videoUrl}" 
                            title="${video.title}"
                            frameborder="0" 
                            allowfullscreen
                            loading="lazy">
                        </iframe>
                    </div>
                    
                    <div class="video-info">
                        <h3>${video.title}</h3>
                        <p>${video.description}</p>
                        <div class="video-meta">
                            <span><i class="fas fa-eye"></i> ${video.views + 1} visualizações</span>
                            <span><i class="fas fa-clock"></i> ${this.formatDuration(video.duration)}</span>
                            <span><i class="fas fa-calendar"></i> ${new Date(video.publishedAt).toLocaleDateString()}</span>
                        </div>
                        <div class="video-tags">
                            ${video.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.addVideoPlayerStyles();
    }
    
    /**
     * Incrementa contador de visualizações
     */
    async incrementViewCount(videoId) {
        const video = this.videos.find(v => v.id === videoId);
        if (video) {
            video.views++;
            
            // Update in database (if online)
            try {
                await fetch(`tables/videos/${videoId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ views: video.views })
                });
            } catch (error) {
                console.warn('Não foi possível atualizar visualizações no servidor:', error);
            }
        }
    }
    
    /**
     * Filtra vídeos por categoria
     */
    filterVideos(filter) {
        this.displayVideos(filter);
    }
    
    /**
     * Formata duração em minutos:segundos
     */
    formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    /**
     * Adiciona estilos do player de vídeo
     */
    addVideoPlayerStyles() {
        if (document.getElementById('video-player-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'video-player-styles';
        styles.textContent = `
            .modal--video .modal__content {
                max-width: 900px;
                width: 95%;
            }
            
            .video-player {
                position: relative;
                width: 100%;
                padding-bottom: 56.25%; /* 16:9 aspect ratio */
                margin-bottom: var(--spacing-xl);
                border-radius: var(--border-radius-lg);
                overflow: hidden;
            }
            
            .video-player iframe {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: none;
            }
            
            .video-info h3 {
                margin: 0 0 var(--spacing-sm) 0;
                font-size: var(--font-size-lg);
            }
            
            .video-info p {
                margin: 0 0 var(--spacing-md) 0;
                color: var(--color-text-secondary);
                line-height: 1.6;
            }
            
            .video-meta {
                display: flex;
                gap: var(--spacing-lg);
                margin-bottom: var(--spacing-md);
                font-size: var(--font-size-sm);
                color: var(--color-text-secondary);
            }
            
            .video-meta span {
                display: flex;
                align-items: center;
                gap: var(--spacing-xs);
            }
            
            .video-tags {
                display: flex;
                flex-wrap: wrap;
                gap: var(--spacing-xs);
            }
            
            .tag {
                background-color: var(--color-bg-secondary);
                color: var(--color-text-secondary);
                padding: var(--spacing-xs) var(--spacing-sm);
                border-radius: var(--border-radius-full);
                font-size: var(--font-size-xs);
                font-weight: 500;
            }
            
            .video-card {
                background-color: var(--color-bg-card);
                border-radius: var(--border-radius-lg);
                overflow: hidden;
                box-shadow: var(--shadow-md);
                border: var(--border-width) solid var(--color-border);
                transition: all var(--transition-normal);
                cursor: pointer;
            }
            
            .video-card:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-lg);
            }
            
            .video-card__thumbnail {
                position: relative;
                aspect-ratio: 16/9;
                background-color: var(--color-bg-tertiary);
                overflow: hidden;
            }
            
            .video-card__thumbnail img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .video-card__play {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 60px;
                height: 60px;
                background-color: rgba(0, 0, 0, 0.7);
                border-radius: var(--border-radius-full);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: var(--font-size-xl);
                transition: all var(--transition-fast);
            }
            
            .video-card:hover .video-card__play {
                background-color: var(--color-primary);
                transform: translate(-50%, -50%) scale(1.1);
            }
            
            .video-card__duration {
                position: absolute;
                bottom: var(--spacing-xs);
                right: var(--spacing-xs);
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                padding: var(--spacing-xs) var(--spacing-sm);
                border-radius: var(--border-radius-sm);
                font-size: var(--font-size-xs);
                font-weight: 500;
            }
            
            .video-card__content {
                padding: var(--spacing-lg);
            }
            
            .video-card__title {
                margin: 0 0 var(--spacing-sm) 0;
                font-size: var(--font-size-base);
                font-weight: 600;
                color: var(--color-text-primary);
            }
            
            .video-card__meta {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: var(--font-size-xs);
                color: var(--color-text-secondary);
                margin-bottom: var(--spacing-sm);
            }
            
            .video-card__description {
                font-size: var(--font-size-sm);
                color: var(--color-text-secondary);
                margin: 0;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            
            .video-empty {
                text-align: center;
                padding: var(--spacing-3xl);
                color: var(--color-text-secondary);
                grid-column: 1 / -1;
            }
            
            .video-empty i {
                font-size: var(--font-size-4xl);
                margin-bottom: var(--spacing-md);
                opacity: 0.5;
            }
        `;
        
        document.head.appendChild(styles);
    }
    
    /**
     * Carrega interface de vídeos
     */
    loadVideos() {
        this.loadVideos();
    }
}

// Adiciona ao app principal
if (window.estudosApp) {
    window.estudosApp.loadVideos = function() {
        if (!this.videosManager) {
            this.videosManager = new VideosManager(this);
        }
        this.videosManager.loadVideos();
    };
}