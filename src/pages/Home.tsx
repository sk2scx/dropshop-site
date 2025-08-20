import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { Product } from '../types';
import { products, getFeaturedProducts } from '../data/products';

const Home: React.FC = () => {
    const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Données de démonstration pour le dropshipping
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
        }
    ];

    useEffect(() => {
        // Charger les produits depuis notre fichier de configuration
        const loadProducts = async () => {
            try {
                setLoading(true);
                // Simulation d'un petit délai de chargement
                await new Promise(resolve => setTimeout(resolve, 500));

                // Utiliser les produits de notre fichier de données
                setDisplayProducts(products);
            } catch (err) {
                setError('Erreur lors du chargement des produits');
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    if (loading) {
        return (
            <div className="home">
                <div className="loading">Chargement des produits...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="home">
                <div className="error">{error}</div>
            </div>
        );
    }

    return (
        <div className="home">
            <SEO
                title="DropShop - Votre boutique en ligne de confiance"
                description="Découvrez notre sélection de produits de qualité à prix imbattables. Écouteurs Bluetooth, montres connectées, accessoires tech et plus encore. Livraison gratuite dès 50€."
                keywords="dropshipping, e-commerce, boutique en ligne, écouteurs bluetooth, montre connectée, accessoires tech, livraison gratuite"
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'WebSite',
                    name: 'DropShop',
                    description: 'Boutique en ligne spécialisée dans les produits tech et accessoires de qualité',
                    url: window.location.href,
                    potentialAction: {
                        '@type': 'SearchAction',
                        target: `${window.location.origin}/search?q={search_term_string}`,
                        'query-input': 'required name=search_term_string'
                    },
                    publisher: {
                        '@type': 'Organization',
                        name: 'DropShop',
                        logo: {
                            '@type': 'ImageObject',
                            url: `${window.location.origin}/logo.png`
                        }
                    }
                }}
            />

            <section className="hero">
                <div className="hero-content">
                    <h1>Bienvenue chez DropShop</h1>
                    <p>Découvrez notre sélection de produits de qualité à prix imbattables</p>
                    <button className="cta-button">Découvrir nos produits</button>
                </div>
            </section>

            <section className="featured-products">
                <h2>Produits en vedette</h2>
                <div className="product-grid">
                    {displayProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {displayProducts.length === 0 && (
                    <div className="no-products">
                        <p>Aucun produit disponible pour le moment.</p>
                        <p>Ajoutez vos produits dans <code>src/data/products.ts</code></p>
                    </div>
                )}
            </section>

            <section className="features">
                <h2>Pourquoi choisir DropShop ?</h2>
                <div className="features-grid">
                    <div className="feature">
                        <h3>🚚 Livraison Gratuite</h3>
                        <p>Livraison gratuite pour toute commande supérieure à 50€</p>
                    </div>
                    <div className="feature">
                        <h3>🔒 Paiement Sécurisé</h3>
                        <p>Vos données sont protégées par un cryptage SSL</p>
                    </div>
                    <div className="feature">
                        <h3>↩️ Retours Faciles</h3>
                        <p>Retours gratuits sous 30 jours</p>
                    </div>
                    <div className="feature">
                        <h3>📞 Support 24/7</h3>
                        <p>Notre équipe est disponible pour vous aider</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;