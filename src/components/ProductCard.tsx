import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(product);
    };

    return (
        <div className="product-card">
            <Link to={`/product/${product.id}`} className="product-link">
                <img src={product.imageUrl} alt={product.title} className="product-image" />
            </Link>
            <div className="product-info">
                <Link to={`/product/${product.id}`} className="product-title-link">
                    <h3 className="product-title">{product.title}</h3>
                </Link>
                <p className="product-description">{product.description.substring(0, 100)}...</p>
                <div className="product-footer">
                    <span className="product-price">{product.price.toFixed(2)}€</span>
                    <button className="add-to-cart-button" onClick={handleAddToCart}>
                        Ajouter au panier
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;