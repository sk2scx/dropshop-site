import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AnalyticsService from '../services/analytics';
import { Product } from '../types';

// Hook pour initialiser et utiliser les analytics
export const useAnalytics = () => {
  const location = useLocation();

  // Initialiser les services d'analytics au montage
  useEffect(() => {
    AnalyticsService.initializeGA();
    AnalyticsService.initializeFBPixel();
  }, []);

  // Tracker les changements de page
  useEffect(() => {
    AnalyticsService.trackPageView(location.pathname);
  }, [location]);

  // Fonctions utilitaires pour tracker les événements
  const trackAddToCart = (product: Product, quantity: number = 1) => {
    AnalyticsService.trackAddToCart({
      item_id: product.id,
      item_name: product.title,
      category: product.category,
      quantity: quantity,
      price: product.price,
      item_brand: product.brand,
    });
  };

  const trackViewProduct = (product: Product) => {
    AnalyticsService.trackViewItem({
      item_id: product.id,
      item_name: product.title,
      category: product.category,
      quantity: 1,
      price: product.price,
      item_brand: product.brand,
    });
  };

  const trackPurchase = (
    transactionId: string,
    items: Array<{ product: Product; quantity: number }>,
    totalValue: number,
    shipping?: number,
    tax?: number
  ) => {
    AnalyticsService.trackPurchase({
      transaction_id: transactionId,
      value: totalValue,
      currency: 'EUR',
      items: items.map(item => ({
        item_id: item.product.id,
        item_name: item.product.title,
        category: item.product.category,
        quantity: item.quantity,
        price: item.product.price,
        item_brand: item.product.brand,
      })),
      shipping,
      tax,
    });
  };

  const trackBeginCheckout = (items: Array<{ product: Product; quantity: number }>, totalValue: number) => {
    AnalyticsService.trackBeginCheckout(
      items.map(item => ({
        item_id: item.product.id,
        item_name: item.product.title,
        category: item.product.category,
        quantity: item.quantity,
        price: item.product.price,
        item_brand: item.product.brand,
      })),
      totalValue
    );
  };

  const trackSearch = (searchTerm: string, resultsCount?: number) => {
    AnalyticsService.trackSearch(searchTerm, resultsCount);
  };

  const trackUserRegistration = () => {
    AnalyticsService.trackRegistration();
  };

  const trackUserLogin = () => {
    AnalyticsService.trackLogin();
  };

  const trackCustomEvent = (action: string, category: string, label?: string, value?: number) => {
    AnalyticsService.trackEvent({
      action,
      category,
      label,
      value,
    });
  };

  return {
    trackAddToCart,
    trackViewProduct,
    trackPurchase,
    trackBeginCheckout,
    trackSearch,
    trackUserRegistration,
    trackUserLogin,
    trackCustomEvent,
  };
};

// Hook pour tracker les performances
export const usePerformanceTracking = () => {
  useEffect(() => {
    // Tracker les Core Web Vitals
    if ('web-vital' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS((metric) => {
          AnalyticsService.trackEvent({
            action: 'CLS',
            category: 'Web Vitals',
            value: Math.round(metric.value * 1000),
          });
        });

        getFID((metric) => {
          AnalyticsService.trackEvent({
            action: 'FID',
            category: 'Web Vitals',
            value: Math.round(metric.value),
          });
        });

        getFCP((metric) => {
          AnalyticsService.trackEvent({
            action: 'FCP',
            category: 'Web Vitals',
            value: Math.round(metric.value),
          });
        });

        getLCP((metric) => {
          AnalyticsService.trackEvent({
            action: 'LCP',
            category: 'Web Vitals',
            value: Math.round(metric.value),
          });
        });

        getTTFB((metric) => {
          AnalyticsService.trackEvent({
            action: 'TTFB',
            category: 'Web Vitals',
            value: Math.round(metric.value),
          });
        });
      });
    }

    // Tracker les erreurs JavaScript
    const handleError = (event: ErrorEvent) => {
      AnalyticsService.trackEvent({
        action: 'JavaScript Error',
        category: 'Error',
        label: `${event.filename}:${event.lineno} - ${event.message}`,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      AnalyticsService.trackEvent({
        action: 'Unhandled Promise Rejection',
        category: 'Error',
        label: event.reason?.toString() || 'Unknown error',
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
};

// Hook pour tracker l'engagement utilisateur
export const useEngagementTracking = () => {
  useEffect(() => {
    let startTime = Date.now();
    let isActive = true;

    const trackTimeOnPage = () => {
      if (isActive) {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        AnalyticsService.trackEvent({
          action: 'Time on Page',
          category: 'Engagement',
          value: timeSpent,
        });
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isActive = false;
        trackTimeOnPage();
      } else {
        isActive = true;
        startTime = Date.now();
      }
    };

    const handleBeforeUnload = () => {
      trackTimeOnPage();
    };

    // Tracker le temps passé sur la page
    const timeInterval = setInterval(() => {
      if (isActive) {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        if (timeSpent > 0 && timeSpent % 30 === 0) { // Toutes les 30 secondes
          AnalyticsService.trackEvent({
            action: 'Time Milestone',
            category: 'Engagement',
            label: `${timeSpent}s`,
            value: timeSpent,
          });
        }
      }
    }, 1000);

    // Tracker les clics sur les liens externes
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href) {
        const url = new URL(link.href);
        if (url.hostname !== window.location.hostname) {
          AnalyticsService.trackEvent({
            action: 'External Link Click',
            category: 'Engagement',
            label: url.hostname,
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleClick);

    return () => {
      clearInterval(timeInterval);
      trackTimeOnPage();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleClick);
    };
  }, []);
};
