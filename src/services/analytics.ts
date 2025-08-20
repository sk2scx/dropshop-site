// Google Analytics 4 (GA4) Integration
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    fbq: (...args: any[]) => void;
  }
}

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

interface EcommerceItem {
  item_id: string;
  item_name: string;
  category: string;
  quantity: number;
  price: number;
  item_brand?: string;
  item_variant?: string;
}

interface PurchaseEvent {
  transaction_id: string;
  value: number;
  currency: string;
  items: EcommerceItem[];
  coupon?: string;
  shipping?: number;
  tax?: number;
}

class AnalyticsService {
  private static gaTrackingId = process.env.REACT_APP_GA_TRACKING_ID;
  private static fbPixelId = process.env.REACT_APP_FB_PIXEL_ID;
  private static isInitialized = false;

  // Initialize Google Analytics
  static initializeGA() {
    if (!this.gaTrackingId || this.isInitialized) return;

    // Load GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaTrackingId}`;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', this.gaTrackingId, {
      page_title: document.title,
      page_location: window.location.href,
    });

    this.isInitialized = true;
    console.log('Google Analytics initialized');
  }

  // Initialize Facebook Pixel
  static initializeFBPixel() {
    if (!this.fbPixelId) return;

    // Load Facebook Pixel script
    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${this.fbPixelId}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);

    // Add noscript fallback
    const noscript = document.createElement('noscript');
    noscript.innerHTML = `
      <img height="1" width="1" style="display:none"
           src="https://www.facebook.com/tr?id=${this.fbPixelId}&ev=PageView&noscript=1"/>
    `;
    document.head.appendChild(noscript);

    console.log('Facebook Pixel initialized');
  }

  // Track page views
  static trackPageView(path: string, title?: string) {
    if (window.gtag) {
      window.gtag('config', this.gaTrackingId, {
        page_path: path,
        page_title: title || document.title,
      });
    }

    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
  }

  // Track custom events
  static trackEvent(event: AnalyticsEvent) {
    // Google Analytics
    if (window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
      });
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'CustomEvent', {
        event_name: event.action,
        event_category: event.category,
        event_label: event.label,
        value: event.value,
      });
    }
  }

  // E-commerce tracking
  static trackPurchase(purchase: PurchaseEvent) {
    // Google Analytics Enhanced Ecommerce
    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: purchase.transaction_id,
        value: purchase.value,
        currency: purchase.currency,
        items: purchase.items.map(item => ({
          item_id: item.item_id,
          item_name: item.item_name,
          category: item.category,
          quantity: item.quantity,
          price: item.price,
          item_brand: item.item_brand,
          item_variant: item.item_variant,
        })),
        coupon: purchase.coupon,
        shipping: purchase.shipping,
        tax: purchase.tax,
      });
    }

    // Facebook Pixel Purchase Event
    if (window.fbq) {
      window.fbq('track', 'Purchase', {
        value: purchase.value,
        currency: purchase.currency,
        content_ids: purchase.items.map(item => item.item_id),
        content_type: 'product',
        num_items: purchase.items.reduce((total, item) => total + item.quantity, 0),
      });
    }
  }

  // Track add to cart
  static trackAddToCart(item: EcommerceItem) {
    // Google Analytics
    if (window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency: 'EUR',
        value: item.price * item.quantity,
        items: [{
          item_id: item.item_id,
          item_name: item.item_name,
          category: item.category,
          quantity: item.quantity,
          price: item.price,
          item_brand: item.item_brand,
        }],
      });
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'AddToCart', {
        value: item.price * item.quantity,
        currency: 'EUR',
        content_ids: [item.item_id],
        content_type: 'product',
        content_name: item.item_name,
        content_category: item.category,
      });
    }
  }

  // Track view item
  static trackViewItem(item: EcommerceItem) {
    // Google Analytics
    if (window.gtag) {
      window.gtag('event', 'view_item', {
        currency: 'EUR',
        value: item.price,
        items: [{
          item_id: item.item_id,
          item_name: item.item_name,
          category: item.category,
          price: item.price,
          item_brand: item.item_brand,
        }],
      });
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'ViewContent', {
        value: item.price,
        currency: 'EUR',
        content_ids: [item.item_id],
        content_type: 'product',
        content_name: item.item_name,
        content_category: item.category,
      });
    }
  }

  // Track begin checkout
  static trackBeginCheckout(items: EcommerceItem[], value: number) {
    // Google Analytics
    if (window.gtag) {
      window.gtag('event', 'begin_checkout', {
        currency: 'EUR',
        value: value,
        items: items.map(item => ({
          item_id: item.item_id,
          item_name: item.item_name,
          category: item.category,
          quantity: item.quantity,
          price: item.price,
          item_brand: item.item_brand,
        })),
      });
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        value: value,
        currency: 'EUR',
        content_ids: items.map(item => item.item_id),
        content_type: 'product',
        num_items: items.reduce((total, item) => total + item.quantity, 0),
      });
    }
  }

  // Track search
  static trackSearch(searchTerm: string, resultsCount?: number) {
    this.trackEvent({
      action: 'search',
      category: 'engagement',
      label: searchTerm,
      value: resultsCount,
    });

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'Search', {
        search_string: searchTerm,
        content_type: 'product',
      });
    }
  }

  // Track user registration
  static trackRegistration(method: string = 'email') {
    // Google Analytics
    if (window.gtag) {
      window.gtag('event', 'sign_up', {
        method: method,
      });
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'CompleteRegistration');
    }
  }

  // Track user login
  static trackLogin(method: string = 'email') {
    // Google Analytics
    if (window.gtag) {
      window.gtag('event', 'login', {
        method: method,
      });
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'Login');
    }
  }
}

export default AnalyticsService;
