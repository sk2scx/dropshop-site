const CACHE_NAME = 'dropshop-v1.0.0';
const STATIC_CACHE = 'dropshop-static-v1.0.0';
const DYNAMIC_CACHE = 'dropshop-dynamic-v1.0.0';
const IMAGE_CACHE = 'dropshop-images-v1.0.0';

// Ressources à mettre en cache immédiatement
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico'
];

// Ressources à mettre en cache dynamiquement
const CACHE_STRATEGIES = {
  // Cache First - pour les assets statiques
  CACHE_FIRST: 'cache-first',
  // Network First - pour les données dynamiques
  NETWORK_FIRST: 'network-first',
  // Stale While Revalidate - pour les images
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// Installation du Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Error caching static assets', error);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // Supprimer les anciens caches
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== IMAGE_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Interception des requêtes
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-HTTP
  if (!request.url.startsWith('http')) {
    return;
  }

  // Stratégie selon le type de ressource
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (isImage(request)) {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
  } else if (isAPIRequest(request)) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  } else {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  }
});

// Stratégie Cache First
async function cacheFirst(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache First strategy failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Stratégie Network First
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback pour les pages HTML
    if (request.destination === 'document') {
      return caches.match('/');
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Stratégie Stale While Revalidate
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  // Fetch en arrière-plan pour mettre à jour le cache
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(error => {
    console.log('Background fetch failed:', error);
  });

  // Retourner immédiatement la réponse du cache si disponible
  if (cachedResponse) {
    return cachedResponse;
  }

  // Sinon attendre la réponse réseau
  return fetchPromise;
}

// Utilitaires pour identifier les types de requêtes
function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/static/') ||
         url.pathname.endsWith('.js') ||
         url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.woff') ||
         url.pathname.endsWith('.woff2');
}

function isImage(request) {
  return request.destination === 'image' ||
         request.url.includes('images.unsplash.com') ||
         /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(request.url);
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/') ||
         url.hostname !== self.location.hostname;
}

// Gestion des messages du client
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls;
    cacheUrls(urls);
  }
});

// Fonction pour mettre en cache des URLs spécifiques
async function cacheUrls(urls) {
  const cache = await caches.open(DYNAMIC_CACHE);
  try {
    await cache.addAll(urls);
    console.log('URLs cached successfully:', urls);
  } catch (error) {
    console.error('Error caching URLs:', error);
  }
}

// Nettoyage périodique du cache
self.addEventListener('periodicsync', event => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupCache());
  }
});

async function cleanupCache() {
  const cacheNames = await caches.keys();
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 jours
  const now = Date.now();

  for (const cacheName of cacheNames) {
    if (cacheName.includes('dynamic') || cacheName.includes('images')) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      for (const request of requests) {
        const response = await cache.match(request);
        const dateHeader = response.headers.get('date');
        if (dateHeader) {
          const responseDate = new Date(dateHeader).getTime();
          if (now - responseDate > maxAge) {
            await cache.delete(request);
          }
        }
      }
    }
  }
}
