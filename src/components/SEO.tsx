import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  price?: number;
  currency?: string;
  availability?: 'in stock' | 'out of stock';
  brand?: string;
  category?: string;
  structuredData?: object;
}

const SEO: React.FC<SEOProps> = ({
  title = 'DropShop - Votre boutique en ligne de confiance',
  description = 'Découvrez notre sélection de produits de qualité à prix imbattables. Livraison gratuite dès 50€, retours faciles et paiement sécurisé.',
  keywords = 'dropshipping, e-commerce, boutique en ligne, produits qualité, livraison gratuite',
  image = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200',
  url = window.location.href,
  type = 'website',
  price,
  currency = 'EUR',
  availability = 'in stock',
  brand,
  category,
  structuredData
}) => {
  const siteName = 'DropShop';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  // Structured Data par défaut
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': type === 'product' ? 'Product' : 'WebSite',
    name: title,
    description,
    url,
    ...(type === 'website' && {
      potentialAction: {
        '@type': 'SearchAction',
        target: `${window.location.origin}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    }),
    ...(type === 'product' && {
      image,
      brand: brand ? { '@type': 'Brand', name: brand } : undefined,
      category,
      offers: price ? {
        '@type': 'Offer',
        price: price.toString(),
        priceCurrency: currency,
        availability: `https://schema.org/${availability === 'in stock' ? 'InStock' : 'OutOfStock'}`,
        seller: {
          '@type': 'Organization',
          name: siteName
        }
      } : undefined
    })
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  useEffect(() => {
    // Mise à jour du titre de la page
    document.title = fullTitle;

    // Mise à jour des meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;

      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Meta tags de base
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', siteName);
    updateMetaTag('robots', 'index, follow');

    // Open Graph
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:site_name', siteName, true);

    // Twitter
    updateMetaTag('twitter:card', 'summary_large_image', true);
    updateMetaTag('twitter:title', fullTitle, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:image', image, true);

    // Meta tags pour les produits
    if (type === 'product' && price) {
      updateMetaTag('product:price:amount', price.toString(), true);
      updateMetaTag('product:price:currency', currency, true);
      updateMetaTag('product:availability', availability, true);
      if (brand) updateMetaTag('product:brand', brand, true);
      if (category) updateMetaTag('product:category', category, true);
    }

    // Données structurées JSON-LD
    const updateStructuredData = (data: any, id: string) => {
      let script = document.querySelector(`script[data-seo="${id}"]`);
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.setAttribute('data-seo', id);
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(data);
    };

    updateStructuredData(finalStructuredData, 'main');
  }, [fullTitle, description, keywords, siteName, type, url, image, price, currency, availability, brand, category, finalStructuredData]);

  return null; // Ce composant ne rend rien visuellement
};

export default SEO;
