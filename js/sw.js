/**
 * Service Worker para Estudos Concursos
 * Gerencia cache e funcionalidade offline
 */

const CACHE_NAME = 'estudos-concursos-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/responsive.css',
  '/js/app.js',
  '/js/subjects.js',
  '/js/tests.js',
  '/js/videos.js',
  '/js/progress.js'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retorna do cache se disponível, senão busca na rede
        if (response) {
          return response;
        }
        
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then((response) => {
          // Verifica se recebeu uma resposta válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clona a resposta
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
  );
});

// Sincronização em background (quando online)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

// Mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * Sincroniza dados com o servidor
 */
async function syncData() {
  try {
    // Busca dados pendentes no IndexedDB
    const pendingData = await getPendingData();
    
    if (pendingData.length === 0) {
      return;
    }
    
    // Envia dados para o servidor
    for (const data of pendingData) {
      const response = await fetch(data.endpoint, {
        method: data.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data.payload)
      });
      
      if (response.ok) {
        // Remove dos pendentes
        await removePendingData(data.id);
      }
    }
    
    console.log('Dados sincronizados com sucesso');
  } catch (error) {
    console.error('Erro ao sincronizar dados:', error);
  }
}

/**
 * Busca dados pendentes no IndexedDB
 */
async function getPendingData() {
  // Implementar busca de dados pendentes
  return [];
}

/**
 * Remove dados pendentes
 */
async function removePendingData(id) {
  // Implementar remoção de dados pendentes
}

/**
 * Notificações push
 */
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação',
    icon: '/images/icon-192x192.png',
    badge: '/images/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('Estudos Concursos', options)
  );
});