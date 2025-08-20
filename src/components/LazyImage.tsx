import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNoYXJnZW1lbnQuLi48L3RleHQ+PC9zdmc+',
  width,
  height,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setHasError(true);
    if (onError) onError();
  };

  const getOptimizedSrc = (originalSrc: string, width?: number) => {
    // Si l'image vient d'Unsplash, on peut optimiser la taille
    if (originalSrc.includes('unsplash.com')) {
      const url = new URL(originalSrc);
      if (width) {
        url.searchParams.set('w', width.toString());
        url.searchParams.set('q', '80'); // Qualité 80%
        url.searchParams.set('fm', 'webp'); // Format WebP si supporté
      }
      return url.toString();
    }
    return originalSrc;
  };

  return (
    <div 
      ref={imgRef}
      className={`lazy-image-container ${className}`}
      style={{ 
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <img
          src={placeholder}
          alt=""
          className="lazy-image-placeholder"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(5px)',
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      {/* Image principale */}
      {isInView && (
        <img
          src={getOptimizedSrc(src, width)}
          alt={alt}
          className={`lazy-image ${isLoaded ? 'loaded' : 'loading'}`}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: isLoaded ? 'static' : 'absolute',
            top: 0,
            left: 0,
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      {/* Image d'erreur */}
      {hasError && (
        <div 
          className="lazy-image-error"
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f0f0',
            color: '#999',
            fontSize: '14px'
          }}
        >
          Image non disponible
        </div>
      )}

      {/* Indicateur de chargement */}
      {isInView && !isLoaded && !hasError && (
        <div 
          className="lazy-image-loading"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#999',
            fontSize: '12px'
          }}
        >
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
