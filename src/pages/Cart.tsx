import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
    const { state, removeFromCart, updateQuantity, clearCart } = useCart();
    const navigate = useNavigate();

    const handleQuantityChange = (productId: string, newQuantity: number) => {
        if (newQuantity === 0) {
            removeFromCart(productId);
        } else {
            updateQuantity(productId, newQuantity);
        }
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const shippingCost = state.totalPrice >= 50 ? 0 : 9.99;
    const finalTotal = state.totalPrice + shippingCost;

    if (state.items.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="empty-cart">
                        <h1>Votre panier est vide</h1>
                        <p>Découvrez nos produits et ajoutez-les à votre panier</p>
                        <Link to="/" className="continue-shopping-btn">
                            Continuer mes achats
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <h1>Mon Panier ({state.totalItems} article{state.totalItems > 1 ? 's' : ''})</h1>

                <div className="cart-content">
                    <div className="cart-items">
                        {state.items.map(item => (
                            <div key={item.product.id} className="cart-item">
                                <div className="item-image">
                                    <img src={item.product.imageUrl} alt={item.product.title} />
                                </div>

                                <div className="item-details">
                                    <h3>{item.product.title}</h3>
                                    <p className="item-description">
                                        {item.product.description.substring(0, 100)}...
                                    </p>
                                    <p className="item-brand">Marque: {item.product.brand}</p>
                                </div>

                                <div className="item-quantity">
                                    <label>Quantité:</label>
                                    <div className="quantity-controls">
                                        <button
                                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="item-price">
                                    <span className="unit-price">{item.product.price.toFixed(2)}€ / unité</span>
                                    <span className="total-price">
                                        {(item.product.price * item.quantity).toFixed(2)}€
                                    </span>
                                </div>

                                <div className="item-actions">
                                    <button
                                        className="remove-btn"
                                        onClick={() => removeFromCart(item.product.id)}
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="cart-actions">
                            <button className="clear-cart-btn" onClick={clearCart}>
                                Vider le panier
                            </button>
                            <Link to="/" className="continue-shopping-link">
                                Continuer mes achats
                            </Link>
                        </div>
                    </div>

                    <div className="cart-summary">
                        <h2>Résumé de la commande</h2>

                        <div className="summary-line">
                            <span>Sous-total ({state.totalItems} articles):</span>
                            <span>{state.totalPrice.toFixed(2)}€</span>
                        </div>

                        <div className="summary-line">
                            <span>Livraison:</span>
                            <span>
                                {shippingCost === 0 ? (
                                    <span className="free-shipping">Gratuite</span>
                                ) : (
                                    `${shippingCost.toFixed(2)}€`
                                )}
                            </span>
                        </div>

                        {state.totalPrice < 50 && (
                            <div className="shipping-notice">
                                <p>Ajoutez {(50 - state.totalPrice).toFixed(2)}€ pour bénéficier de la livraison gratuite</p>
                            </div>
                        )}

                        <div className="summary-line total">
                            <span>Total:</span>
                            <span>{finalTotal.toFixed(2)}€</span>
                        </div>

                        <button className="checkout-btn" onClick={handleCheckout}>
                            Procéder au paiement
                        </button>

                        <div className="payment-security">
                            <p>🔒 Paiement 100% sécurisé</p>
                            <div className="payment-methods">
                                <span>💳 Visa</span>
                                <span>💳 Mastercard</span>
                                <span>💰 PayPal</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;