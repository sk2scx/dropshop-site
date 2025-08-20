import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product as ProductType } from '../types';
import { useCart } from '../context/CartContext';
import SEO from '../components/SEO';
import { getProductById } from '../data/products';

const Product: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<ProductType | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    // Données de démonstration (en réalité, cela viendrait d'une API)
    const mockProducts: ProductType[] = [
        {
            id: '1',
            title: 'Écouteurs Bluetooth Sans Fil',
            description: 'Écouteurs haute qualité avec réduction de bruit active et autonomie de 24h. Ces écouteurs offrent une qualité sonore exceptionnelle avec des basses profondes et des aigus cristallins. La technologie de réduction de bruit active vous permet de vous immerger complètement dans votre musique.',
            price: 79.99,
            originalPrice: 129.99,
            imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
            images: [
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
                'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600',
                'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600'
            ],
            category: 'Électronique',
            brand: 'TechPro',
            rating: 4.5,
            reviewCount: 128,
            inStock: true,
            features: [
                'Bluetooth 5.0 pour une connexion stable',
                'Réduction de bruit active',
                '24h d\'autonomie avec le boîtier',
                'Résistant à l\'eau IPX4',
                'Contrôles tactiles intuitifs'
            ]
        },
        {
            id: '2',
            title: 'Montre Connectée Sport',
            description: 'Montre intelligente avec suivi fitness, GPS et notifications smartphone. Parfaite pour les sportifs et les amateurs de technologie.',
            price: 199.99,
            originalPrice: 299.99,
            imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
            category: 'Électronique',
            brand: 'FitWatch',
            rating: 4.3,
            reviewCount: 89,
            inStock: true,
            features: ['GPS intégré', 'Étanche IP68', 'Suivi santé', 'Autonomie 7 jours']
        },
        {
            id: '3',
            title: 'Sac à Dos Ordinateur',
            description: 'Sac à dos élégant et fonctionnel pour ordinateur portable jusqu\'à 15.6". Design moderne et compartiments organisés.',
            price: 49.99,
            originalPrice: 79.99,
            imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
            category: 'Accessoires',
            brand: 'UrbanStyle',
            rating: 4.7,
            reviewCount: 203,
            inStock: true,
            features: ['Compartiment laptop', 'Port USB', 'Résistant à l\'eau', 'Bretelles ergonomiques']
        }
    ];

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                // Simulation d'un petit délai de chargement
                await new Promise(resolve => setTimeout(resolve, 300));

                // Utiliser notre fonction pour récupérer le produit
                const foundProduct = getProductById(id || '');
                setProduct(foundProduct || null);
            } catch (error) {
                console.error('Erreur lors du chargement du produit:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadProduct();
        }
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            for (let i = 0; i < quantity; i++) {
                addToCart(product);
            }
            alert(`${quantity} ${product.title} ajouté(s) au panier !`);
        }
    };

    const handleBuyNow = () => {
        if (product) {
            handleAddToCart();
            navigate('/cart');
        }
    };

    if (loading) {
        return (
            <div className="product-page">
                <div className="loading">Chargement du produit...</div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-page">
                <div className="error">Produit non trouvé</div>
                <button onClick={() => navigate('/')}>Retour à l'accueil</button>
            </div>
        );
    }

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div className="product-page">
            <SEO
                title={`${product.title} - ${product.brand}`}
                description={product.description}
                keywords={`${product.title}, ${product.brand}, ${product.category}, dropshipping, e-commerce`}
                image={product.imageUrl}
                type="product"
                price={product.price}
                currency="EUR"
                availability={product.inStock ? 'in stock' : 'out of stock'}
                brand={product.brand}
                category={product.category}
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'Product',
                    name: product.title,
                    description: product.description,
                    image: product.images || [product.imageUrl],
                    brand: {
                        '@type': 'Brand',
                        name: product.brand
                    },
                    category: product.category,
                    aggregateRating: product.rating ? {
                        '@type': 'AggregateRating',
                        ratingValue: product.rating,
                        reviewCount: product.reviewCount
                    } : undefined,
                    offers: {
                        '@type': 'Offer',
                        price: product.price,
                        priceCurrency: 'EUR',
                        availability: `https://schema.org/${product.inStock ? 'InStock' : 'OutOfStock'}`,
                        seller: {
                            '@type': 'Organization',
                            name: 'DropShop'
                        },
                        ...(product.originalPrice && {
                            priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                        })
                    }
                }}
            />

            <div className="container">
                <div className="product-details">
                    <div className="product-images">
                        <div className="main-image">
                            <img
                                src={product.images?.[selectedImage] || product.imageUrl}
                                alt={product.title}
                            />
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div className="image-thumbnails">
                                {product.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`${product.title} ${index + 1}`}
                                        className={selectedImage === index ? 'active' : ''}
                                        onClick={() => setSelectedImage(index)}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Boutons d'achat déplacés sous les images */}
                        <div className="product-actions-moved">
                            <div className="quantity-selector">
                                <label htmlFor="quantity">Quantité :</label>
                                <select
                                    id="quantity"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                >
                                    {[...Array(10)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="action-buttons">
                                <button
                                    className="add-to-cart-btn"
                                    onClick={handleAddToCart}
                                    disabled={!product.inStock}
                                >
                                    Ajouter au panier
                                </button>
                                <button
                                    className="buy-now-btn"
                                    onClick={handleBuyNow}
                                    disabled={!product.inStock}
                                >
                                    Acheter maintenant
                                </button>
                            </div>
                        </div>

                        {/* Points forts déplacés sous les boutons d'achat */}
                        <div className="product-highlights-moved">
                            <h3>Points forts</h3>
                            <div className="highlights-grid">
                                <div className="highlight-item">
                                    <span className="highlight-icon">🚁</span>
                                    <span>Caméra 8K Ultra HD</span>
                                </div>
                                <div className="highlight-item">
                                    <span className="highlight-icon">🔋</span>
                                    <span>3 Batteries incluses</span>
                                </div>
                                <div className="highlight-item">
                                    <span className="highlight-icon">📱</span>
                                    <span>Contrôle smartphone</span>
                                </div>
                                <div className="highlight-item">
                                    <span className="highlight-icon">🌍</span>
                                    <span>Livraison gratuite</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="product-info">
                        <h1>{product.title}</h1>

                        <div className="product-rating">
                            <span className="stars">{'★'.repeat(Math.floor(product.rating || 0))}</span>
                            <span className="rating-text">
                                {product.rating} ({product.reviewCount} avis)
                            </span>
                        </div>

                        <div className="product-price">
                            <span className="current-price">{product.price.toFixed(2)}€</span>
                            {product.originalPrice && (
                                <>
                                    <span className="original-price">{product.originalPrice.toFixed(2)}€</span>
                                    <span className="discount">-{discount}%</span>
                                </>
                            )}
                        </div>

                        <div className="product-description">
                            <h3>Description</h3>
                            <p>{product.description}</p>
                        </div>

                        <div className="product-features">
                            <h3>Spécifications techniques</h3>
                            <ul className="features-list">
                                {product.features && product.features.map((feature, index) => (
                                    <li key={index}>
                                        <span className="feature-icon">✓</span>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>





                        <div className="product-guarantees">
                            <div className="guarantee">
                                <span>🚚</span>
                                <span>Livraison gratuite dès 50€</span>
                            </div>
                            <div className="guarantee">
                                <span>↩️</span>
                                <span>Retours gratuits sous 30 jours</span>
                            </div>
                            <div className="guarantee">
                                <span>🔒</span>
                                <span>Paiement 100% sécurisé</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = `
    .product-features {
        background: #f8f9fa;
        border-radius: 12px;
        padding: 25px;
        margin: 30px 0;
        border: 1px solid #e9ecef;
    }

    .product-features h3 {
        color: #2c3e50;
        font-size: 1.4rem;
        font-weight: 600;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .product-features h3:before {
        content: "⚡";
        font-size: 1.2em;
    }

    .features-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        gap: 12px;
    }

    .features-list li {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        background: white;
        border-radius: 8px;
        border-left: 4px solid #28a745;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        transition: all 0.3s ease;
    }

    .features-list li:hover {
        transform: translateX(5px);
        box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    }

    .feature-icon {
        color: #28a745;
        font-weight: bold;
        font-size: 1.1em;
        min-width: 20px;
    }

    .features-list li span:last-child {
        color: #495057;
        font-size: 0.95rem;
        line-height: 1.4;
    }

    /* Correction des Points forts - rendre le texte visible */
    .product-highlights {
        background: #f8f9fa !important;
        border-radius: 12px !important;
        padding: 20px !important;
        margin: 20px 0 !important;
        border: 1px solid #e9ecef !important;
    }

    .product-highlights h3 {
        color: #2c3e50 !important;
        font-size: 1.3rem !important;
        font-weight: 600 !important;
        margin-bottom: 15px !important;
    }

    .highlights-grid {
        display: grid !important;
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 12px !important;
    }

    .highlight-item {
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        padding: 12px 15px !important;
        background: white !important;
        border-radius: 8px !important;
        border: 1px solid #e9ecef !important;
        color: #2c3e50 !important;
        font-size: 0.9rem !important;
        font-weight: 500 !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
        transition: all 0.3s ease !important;
    }

    .highlight-item:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 16px rgba(0,0,0,0.1) !important;
    }

    .highlight-icon {
        font-size: 1.2em !important;
        min-width: 24px !important;
    }

    /* Styles pour les boutons déplacés sous les images */
    .product-actions-moved {
        margin-top: 20px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 12px;
        border: 1px solid #e9ecef;
    }

    .product-actions-moved .quantity-selector {
        margin-bottom: 15px;
    }

    .product-actions-moved .quantity-selector label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: #2c3e50;
    }

    .product-actions-moved .quantity-selector select {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 1rem;
        background: white;
    }

    .product-actions-moved .action-buttons {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .product-actions-moved .add-to-cart-btn,
    .product-actions-moved .buy-now-btn {
        width: 100%;
        padding: 12px 20px;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .product-actions-moved .add-to-cart-btn {
        background: #007bff;
        color: white;
    }

    .product-actions-moved .add-to-cart-btn:hover {
        background: #0056b3;
        transform: translateY(-2px);
    }

    .product-actions-moved .buy-now-btn {
        background: #28a745;
        color: white;
    }

    .product-actions-moved .buy-now-btn:hover {
        background: #1e7e34;
        transform: translateY(-2px);
    }

    .product-actions-moved .add-to-cart-btn:disabled,
    .product-actions-moved .buy-now-btn:disabled {
        background: #6c757d;
        cursor: not-allowed;
        transform: none;
    }

    /* Styles pour les Points forts déplacés sous les boutons */
    .product-highlights-moved {
        margin-top: 20px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 12px;
        border: 1px solid #e9ecef;
    }

    .product-highlights-moved h3 {
        color: #2c3e50;
        font-size: 1.3rem;
        font-weight: 600;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .product-highlights-moved h3:before {
        content: "⭐";
        font-size: 1.2em;
    }

    .product-highlights-moved .highlights-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 12px;
    }

    .product-highlights-moved .highlight-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 15px;
        background: white;
        border-radius: 8px;
        border: 1px solid #e9ecef;
        color: #2c3e50;
        font-size: 0.9rem;
        font-weight: 500;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        transition: all 0.3s ease;
    }

    .product-highlights-moved .highlight-item:hover {
        transform: translateX(5px);
        box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    }

    .product-highlights-moved .highlight-icon {
        font-size: 1.2em;
        min-width: 24px;
    }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
}

export default Product;