import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Product } from '../types';

interface ProductRecommendationsProps {
  currentProductId?: string;
  category?: string;
  title?: string;
  maxItems?: number;
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  currentProductId,
  category,
  title = 'Produits recommandés',
  maxItems = 4
}) => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock products data
  const mockProducts: Product[] = [
    {
      id: '1',
      title: 'Écouteurs Bluetooth Sans Fil',
      description: 'Écouteurs haute qualité avec réduction de bruit active et autonomie de 24h',
      price: 79.99,
      originalPrice: 129.99,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      category: 'Électronique',
      brand: 'TechPro',
      rating: 4.5,
      reviewCount: 128,
      inStock: true,
      features: ['Bluetooth 5.0', 'Réduction de bruit', '24h d\'autonomie']
    },
    {
      id: '2',
      title: 'Montre Connectée Sport',
      description: 'Montre intelligente avec suivi fitness, GPS et notifications smartphone',
      price: 199.99,
      originalPrice: 299.99,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      category: 'Électronique',
      brand: 'FitWatch',
      rating: 4.3,
      reviewCount: 89,
      inStock: true,
      features: ['GPS intégré', 'Étanche IP68', 'Suivi santé']
    },
    {
      id: '3',
      title: 'Sac à Dos Ordinateur',
      description: 'Sac à dos élégant et fonctionnel pour ordinateur portable jusqu\'à 15.6"',
      price: 49.99,
      originalPrice: 79.99,
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
      category: 'Accessoires',
      brand: 'UrbanStyle',
      rating: 4.7,
      reviewCount: 203,
      inStock: true,
      features: ['Compartiment laptop', 'Port USB', 'Résistant à l\'eau']
    },
    {
      id: '4',
      title: 'Lampe LED Bureau',
      description: 'Lampe de bureau LED avec variateur d\'intensité et port de charge USB',
      price: 34.99,
      originalPrice: 59.99,
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      category: 'Maison',
      brand: 'LightPro',
      rating: 4.4,
      reviewCount: 156,
      inStock: true,
      features: ['Variateur d\'intensité', 'Port USB', 'Bras articulé']
    },
    {
      id: '5',
      title: 'Chargeur Sans Fil Rapide',
      description: 'Station de charge sans fil compatible avec tous les smartphones Qi',
      price: 24.99,
      originalPrice: 39.99,
      imageUrl: 'https://images.unsplash.com/photo-1609592806596-b43bada2f4b8?w=400',
      category: 'Électronique',
      brand: 'ChargeFast',
      rating: 4.2,
      reviewCount: 94,
      inStock: true,
      features: ['Charge rapide 15W', 'Compatible Qi', 'LED indicateur']
    },
    {
      id: '6',
      title: 'Coussin Ergonomique',
      description: 'Coussin orthopédique en mousse à mémoire pour chaise de bureau',
      price: 39.99,
      originalPrice: 69.99,
      imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      category: 'Maison',
      brand: 'ComfortPlus',
      rating: 4.6,
      reviewCount: 167,
      inStock: true,
      features: ['Mousse à mémoire', 'Housse lavable', 'Support lombaire']
    },
    {
      id: '7',
      title: 'Clavier Mécanique RGB',
      description: 'Clavier gaming mécanique avec rétroéclairage RGB personnalisable',
      price: 89.99,
      originalPrice: 149.99,
      imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400',
      category: 'Électronique',
      brand: 'GamePro',
      rating: 4.8,
      reviewCount: 245,
      inStock: true,
      features: ['Switches mécaniques', 'RGB personnalisable', 'Anti-ghosting']
    },
    {
      id: '8',
      title: 'Support Téléphone Ajustable',
      description: 'Support universel pour smartphone et tablette, ajustable et pliable',
      price: 19.99,
      originalPrice: 34.99,
      imageUrl: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400',
      category: 'Accessoires',
      brand: 'FlexiStand',
      rating: 4.1,
      reviewCount: 78,
      inStock: true,
      features: ['Ajustable', 'Pliable', 'Antidérapant']
    }
  ];

  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filteredProducts = mockProducts;
      
      // Exclude current product
      if (currentProductId) {
        filteredProducts = filteredProducts.filter(p => p.id !== currentProductId);
      }
      
      // Filter by category if specified
      if (category) {
        filteredProducts = filteredProducts.filter(p => p.category === category);
      }
      
      // Sort by rating and popularity
      filteredProducts.sort((a, b) => {
        const scoreA = (a.rating || 0) * Math.log(a.reviewCount || 1);
        const scoreB = (b.rating || 0) * Math.log(b.reviewCount || 1);
        return scoreB - scoreA;
      });
      
      // Limit results
      const recommendations = filteredProducts.slice(0, maxItems);
      
      setRecommendations(recommendations);
      setLoading(false);
    };

    loadRecommendations();
  }, [currentProductId, category, maxItems]);

  if (loading) {
    return (
      <div className="recommendations-section">
        <h3>{title}</h3>
        <div className="recommendations-loading">
          <div className="loading-grid">
            {[...Array(maxItems)].map((_, index) => (
              <div key={index} className="loading-card">
                <div className="loading-image"></div>
                <div className="loading-content">
                  <div className="loading-line"></div>
                  <div className="loading-line short"></div>
                  <div className="loading-line"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="recommendations-section">
      <h3>{title}</h3>
      <div className="recommendations-grid">
        {recommendations.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendations;
