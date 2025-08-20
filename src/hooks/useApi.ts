import { useState, useEffect, useCallback } from 'react';
import { handleApiError, isOnline } from '../utils/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

// Hook générique pour les appels API
export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
) {
  const { immediate = false, onSuccess, onError } = options;
  
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (...args: any[]) => {
    if (!isOnline()) {
      const errorMsg = 'Pas de connexion internet';
      setState(prev => ({ ...prev, error: errorMsg, loading: false }));
      if (onError) onError(errorMsg);
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiFunction(...args);
      setState({ data: result, loading: false, error: null });
      if (onSuccess) onSuccess(result);
      return result;
    } catch (error) {
      const errorMsg = handleApiError(error);
      setState(prev => ({ ...prev, error: errorMsg, loading: false }));
      if (onError) onError(errorMsg);
      throw error;
    }
  }, [apiFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    ...state,
    execute,
    reset,
  };
}

// Hook spécialisé pour les listes paginées
export function usePaginatedApi<T>(
  apiFunction: (params: any) => Promise<{ data: T[]; pagination: any }>,
  initialParams: any = {}
) {
  const [params, setParams] = useState(initialParams);
  const [allData, setAllData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<any>(null);

  const { data, loading, error, execute } = useApi(apiFunction);

  useEffect(() => {
    if (data) {
      if (params.page === 1) {
        setAllData(data.data);
      } else {
        setAllData(prev => [...prev, ...data.data]);
      }
      setPagination(data.pagination);
    }
  }, [data, params.page]);

  const loadMore = useCallback(() => {
    if (pagination && pagination.page < pagination.totalPages) {
      setParams((prev: any) => ({ ...prev, page: prev.page + 1 }));
    }
  }, [pagination]);

  const refresh = useCallback(() => {
    setParams((prev: any) => ({ ...prev, page: 1 }));
    setAllData([]);
  }, []);

  const updateParams = useCallback((newParams: any) => {
    setParams({ ...initialParams, ...newParams, page: 1 });
    setAllData([]);
  }, [initialParams]);

  useEffect(() => {
    execute(params);
  }, [params, execute]);

  return {
    data: allData,
    pagination,
    loading,
    error,
    loadMore,
    refresh,
    updateParams,
    hasMore: pagination ? pagination.page < pagination.totalPages : false,
  };
}

// Hook pour les mutations (POST, PUT, DELETE)
export function useMutation<T, P = any>(
  apiFunction: (params: P) => Promise<T>,
  options: UseApiOptions = {}
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(async (params: P) => {
    if (!isOnline()) {
      const errorMsg = 'Pas de connexion internet';
      setState(prev => ({ ...prev, error: errorMsg }));
      if (options.onError) options.onError(errorMsg);
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiFunction(params);
      setState({ data: result, loading: false, error: null });
      if (options.onSuccess) options.onSuccess(result);
      return result;
    } catch (error) {
      const errorMsg = handleApiError(error);
      setState(prev => ({ ...prev, error: errorMsg, loading: false }));
      if (options.onError) options.onError(errorMsg);
      throw error;
    }
  }, [apiFunction, options]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
}

// Hook pour gérer le cache local
export function useCache<T>(key: string, defaultValue: T | null = null) {
  const [data, setData] = useState<T | null>(() => {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      return cached ? JSON.parse(cached) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const updateCache = useCallback((newData: T | null) => {
    setData(newData);
    if (newData === null) {
      localStorage.removeItem(`cache_${key}`);
    } else {
      localStorage.setItem(`cache_${key}`, JSON.stringify(newData));
    }
  }, [key]);

  const clearCache = useCallback(() => {
    setData(null);
    localStorage.removeItem(`cache_${key}`);
  }, [key]);

  return {
    data,
    updateCache,
    clearCache,
  };
}

// Hook pour détecter l'état de la connexion
export function useOnlineStatus() {
  const [isOnlineStatus, setIsOnlineStatus] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnlineStatus(true);
    const handleOffline = () => setIsOnlineStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnlineStatus;
}
