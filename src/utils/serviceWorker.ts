// Service Worker registration and management
import React from 'react';

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);

interface ServiceWorkerConfig {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onOfflineReady?: () => void;
}

export function register(config?: ServiceWorkerConfig) {
  if ('serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL!, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/sw.js`;

      if (isLocalhost) {
        checkValidServiceWorker(swUrl, config);
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a service worker.'
          );
        });
      } else {
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl: string, config?: ServiceWorkerConfig) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      console.log('Service Worker registered successfully');
      
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log(
                'New content is available and will be used when all tabs for this page are closed.'
              );
              
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              console.log('Content is cached for offline use.');
              
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
              
              if (config && config.onOfflineReady) {
                config.onOfflineReady();
              }
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl: string, config?: ServiceWorkerConfig) {
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then(response => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        'No internet connection found. App is running in offline mode.'
      );
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error.message);
      });
  }
}

// Utilitaires pour interagir avec le Service Worker
export class ServiceWorkerManager {
  private static registration: ServiceWorkerRegistration | null = null;

  static setRegistration(registration: ServiceWorkerRegistration) {
    this.registration = registration;
  }

  // Forcer la mise à jour du Service Worker
  static async updateServiceWorker() {
    if (this.registration) {
      await this.registration.update();
    }
  }

  // Passer au nouveau Service Worker
  static skipWaiting() {
    if (this.registration && this.registration.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  // Mettre en cache des URLs spécifiques
  static cacheUrls(urls: string[]) {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_URLS',
        urls: urls
      });
    }
  }

  // Vérifier si l'app fonctionne hors ligne
  static isOfflineCapable(): boolean {
    return 'serviceWorker' in navigator && !!navigator.serviceWorker.controller;
  }

  // Obtenir des informations sur le cache
  static async getCacheInfo() {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      const cacheInfo = await Promise.all(
        cacheNames.map(async name => {
          const cache = await caches.open(name);
          const keys = await cache.keys();
          return {
            name,
            size: keys.length
          };
        })
      );
      return cacheInfo;
    }
    return [];
  }

  // Nettoyer le cache
  static async clearCache() {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(name => caches.delete(name))
      );
      console.log('All caches cleared');
    }
  }
}

// Hook React pour gérer les mises à jour du Service Worker
export const useServiceWorker = () => {
  const [isUpdateAvailable, setIsUpdateAvailable] = React.useState(false);
  const [isOfflineReady, setIsOfflineReady] = React.useState(false);

  React.useEffect(() => {
    register({
      onUpdate: (registration) => {
        setIsUpdateAvailable(true);
        ServiceWorkerManager.setRegistration(registration);
      },
      onOfflineReady: () => {
        setIsOfflineReady(true);
      }
    });
  }, []);

  const updateApp = () => {
    ServiceWorkerManager.skipWaiting();
    window.location.reload();
  };

  return {
    isUpdateAvailable,
    isOfflineReady,
    updateApp,
    isOfflineCapable: ServiceWorkerManager.isOfflineCapable()
  };
};
