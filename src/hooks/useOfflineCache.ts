import { useState, useEffect, useCallback } from 'react';

interface CacheConfig {
  key: string;
  ttl?: number; // Time to live en millisecondes
  version?: string;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  version: string;
  ttl: number;
}

// Hook pour gérer le cache local avec TTL
export const useLocalCache = <T>(config: CacheConfig) => {
  const { key, ttl = 5 * 60 * 1000, version = '1.0' } = config; // TTL par défaut: 5 minutes

  const getCachedData = useCallback((): T | null => {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (!cached) return null;

      const entry: CacheEntry<T> = JSON.parse(cached);
      
      // Vérifier la version
      if (entry.version !== version) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }

      // Vérifier l'expiration
      const now = Date.now();
      if (now - entry.timestamp > entry.ttl) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  }, [key, version]);

  const setCachedData = useCallback((data: T) => {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        version,
        ttl
      };
      localStorage.setItem(`cache_${key}`, JSON.stringify(entry));
    } catch (error) {
      console.error('Error writing to cache:', error);
    }
  }, [key, version, ttl]);

  const clearCache = useCallback(() => {
    localStorage.removeItem(`cache_${key}`);
  }, [key]);

  return {
    getCachedData,
    setCachedData,
    clearCache
  };
};

// Hook pour détecter l'état de connexion
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Détecter le type de connexion si disponible
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setConnectionType(connection.effectiveType || 'unknown');
      
      const handleConnectionChange = () => {
        setConnectionType(connection.effectiveType || 'unknown');
      };
      
      connection.addEventListener('change', handleConnectionChange);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection.removeEventListener('change', handleConnectionChange);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, connectionType };
};

// Hook pour les requêtes avec cache et fallback hors ligne
export const useCachedFetch = <T>(
  url: string,
  options: RequestInit = {},
  cacheConfig: CacheConfig
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const { getCachedData, setCachedData } = useLocalCache<T>(cacheConfig);
  const { isOnline } = useNetworkStatus();

  const fetchData = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    // Essayer d'abord le cache si on n'est pas en ligne ou si on ne force pas le refresh
    if (!forceRefresh && (!isOnline || !forceRefresh)) {
      const cachedData = getCachedData();
      if (cachedData) {
        setData(cachedData);
        setFromCache(true);
        setLoading(false);
        return;
      }
    }

    // Si on est hors ligne et qu'il n'y a pas de cache, afficher une erreur
    if (!isOnline) {
      setError('Pas de connexion internet et aucune donnée en cache');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Cache-Control': 'no-cache',
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      setCachedData(result);
      setFromCache(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      
      // En cas d'erreur, essayer de récupérer les données du cache
      const cachedData = getCachedData();
      if (cachedData) {
        setData(cachedData);
        setFromCache(true);
        setError(`${errorMessage} (données du cache utilisées)`);
      }
    } finally {
      setLoading(false);
    }
  }, [url, options, isOnline, getCachedData, setCachedData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    fromCache,
    refresh,
    isOnline
  };
};

// Hook pour précharger les ressources critiques
export const usePreloader = () => {
  const [loadedResources, setLoadedResources] = useState<Set<string>>(new Set());

  const preloadImage = useCallback((src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (loadedResources.has(src)) {
        resolve();
        return;
      }

      const img = new Image();
      img.onload = () => {
        setLoadedResources(prev => new Set(prev).add(src));
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  }, [loadedResources]);

  const preloadImages = useCallback(async (sources: string[]) => {
    const promises = sources.map(src => preloadImage(src));
    try {
      await Promise.all(promises);
    } catch (error) {
      console.warn('Some images failed to preload:', error);
    }
  }, [preloadImage]);

  const preloadScript = useCallback((src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (loadedResources.has(src)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        setLoadedResources(prev => new Set(prev).add(src));
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }, [loadedResources]);

  const isResourceLoaded = useCallback((src: string) => {
    return loadedResources.has(src);
  }, [loadedResources]);

  return {
    preloadImage,
    preloadImages,
    preloadScript,
    isResourceLoaded,
    loadedResources: Array.from(loadedResources)
  };
};
