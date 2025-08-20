import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShippingAddress } from '../types';
import StripePayment from '../components/StripePayment';

const Checkout: React.FC = () => {
    const { state, clearCart } = useCart();
    const navigate = useNavigate();
    
    const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'France',
        phone: ''
    });
    
    const [paymentMethod, setPaymentMethod] = useState('stripe');
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);

    const shippingCost = state.totalPrice >= 50 ? 0 : 9.99;
    const finalTotal = state.totalPrice + shippingCost;

    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};
        
        if (!shippingAddress.firstName.trim()) {
            newErrors.firstName = 'Le prénom est requis';
        }
        if (!shippingAddress.lastName.trim()) {
            newErrors.lastName = 'Le nom est requis';
        }
        if (!shippingAddress.address.trim()) {
            newErrors.address = 'L\'adresse est requise';
        }
        if (!shippingAddress.city.trim()) {
            newErrors.city = 'La ville est requise';
        }
        if (!shippingAddress.postalCode.trim()) {
            newErrors.postalCode = 'Le code postal est requis';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handlePaymentSuccess = (paymentIntentId: string) => {
        setPaymentSuccess(true);
        setPaymentError(null);

        // Sauvegarder la commande
        const orderData = {
            paymentIntentId,
            shippingAddress,
            items: state.items,
            totalAmount: finalTotal,
            createdAt: new Date(),
        };

        // Ici vous pourriez envoyer les données à votre backend
        console.log('Commande créée:', orderData);

        // Vider le panier et rediriger
        setTimeout(() => {
            clearCart();
            alert('Commande confirmée ! Vous recevrez un email de confirmation.');
            navigate('/');
        }, 2000);
    };

    const handlePaymentError = (error: string) => {
        setPaymentError(error);
        setPaymentSuccess(false);
        setIsProcessing(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (paymentMethod === 'paypal') {
            // Logique PayPal (simulation)
            setIsProcessing(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 2000));
                handlePaymentSuccess('paypal_mock_payment');
            } catch (error) {
                handlePaymentError('Erreur PayPal');
            }
        }
        // Pour Stripe, le paiement est géré par le composant StripePayment
    };

    if (state.items.length === 0) {
        return (
            <div className="checkout-page">
                <div className="container">
                    <div className="empty-cart">
                        <h1>Votre panier est vide</h1>
                        <p>Ajoutez des produits à votre panier avant de procéder au paiement</p>
                        <button onClick={() => navigate('/')}>
                            Retour à l'accueil
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="container">
                <h1>Finaliser ma commande</h1>
                
                <div className="checkout-content">
                    <div className="checkout-form">
                        <form onSubmit={handleSubmit}>
                            <section className="shipping-section">
                                <h2>Adresse de livraison</h2>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="firstName">Prénom *</label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={shippingAddress.firstName}
                                            onChange={handleInputChange}
                                            className={errors.firstName ? 'error' : ''}
                                        />
                                        {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="lastName">Nom *</label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={shippingAddress.lastName}
                                            onChange={handleInputChange}
                                            className={errors.lastName ? 'error' : ''}
                                        />
                                        {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="address">Adresse *</label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={shippingAddress.address}
                                        onChange={handleInputChange}
                                        className={errors.address ? 'error' : ''}
                                    />
                                    {errors.address && <span className="error-message">{errors.address}</span>}
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="city">Ville *</label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={shippingAddress.city}
                                            onChange={handleInputChange}
                                            className={errors.city ? 'error' : ''}
                                        />
                                        {errors.city && <span className="error-message">{errors.city}</span>}
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="postalCode">Code postal *</label>
                                        <input
                                            type="text"
                                            id="postalCode"
                                            name="postalCode"
                                            value={shippingAddress.postalCode}
                                            onChange={handleInputChange}
                                            className={errors.postalCode ? 'error' : ''}
                                        />
                                        {errors.postalCode && <span className="error-message">{errors.postalCode}</span>}
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="country">Pays</label>
                                    <select
                                        id="country"
                                        name="country"
                                        value={shippingAddress.country}
                                        onChange={handleInputChange}
                                    >
                                        <option value="France">France</option>
                                        <option value="Belgique">Belgique</option>
                                        <option value="Suisse">Suisse</option>
                                        <option value="Canada">Canada</option>
                                    </select>
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="phone">Téléphone</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={shippingAddress.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </section>
                            
                            <section className="payment-section">
                                <h2>Mode de paiement</h2>

                                <div className="payment-method-selector">
                                    <div
                                        className={`payment-method-option ${paymentMethod === 'stripe' ? 'active' : ''}`}
                                        onClick={() => setPaymentMethod('stripe')}
                                    >
                                        <h4>💳 Carte bancaire</h4>
                                        <p>Paiement sécurisé par Stripe</p>
                                    </div>

                                    <div
                                        className={`payment-method-option ${paymentMethod === 'paypal' ? 'active' : ''}`}
                                        onClick={() => setPaymentMethod('paypal')}
                                    >
                                        <h4>💰 PayPal</h4>
                                        <p>Paiement via PayPal</p>
                                    </div>
                                </div>

                                {paymentError && (
                                    <div className="payment-error">
                                        <p>❌ {paymentError}</p>
                                    </div>
                                )}

                                {paymentSuccess && (
                                    <div className="payment-success">
                                        <p>✅ Paiement réussi ! Redirection en cours...</p>
                                    </div>
                                )}
                            </section>
                            
                            {paymentMethod === 'stripe' ? (
                                <StripePayment
                                    amount={finalTotal}
                                    onSuccess={handlePaymentSuccess}
                                    onError={handlePaymentError}
                                />
                            ) : (
                                <button
                                    type="submit"
                                    className="place-order-btn"
                                    disabled={isProcessing || paymentSuccess}
                                >
                                    {isProcessing ? 'Traitement en cours...' :
                                     paymentSuccess ? 'Paiement réussi !' :
                                     `Payer avec PayPal - ${finalTotal.toFixed(2)}€`}
                                </button>
                            )}
                        </form>
                    </div>
                    
                    <div className="order-summary">
                        <h2>Résumé de la commande</h2>
                        
                        <div className="order-items">
                            {state.items.map(item => (
                                <div key={item.product.id} className="order-item">
                                    <img src={item.product.imageUrl} alt={item.product.title} />
                                    <div className="item-info">
                                        <h4>{item.product.title}</h4>
                                        <p>Quantité: {item.quantity}</p>
                                        <p>{(item.product.price * item.quantity).toFixed(2)}€</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="order-totals">
                            <div className="total-line">
                                <span>Sous-total:</span>
                                <span>{state.totalPrice.toFixed(2)}€</span>
                            </div>
                            <div className="total-line">
                                <span>Livraison:</span>
                                <span>{shippingCost === 0 ? 'Gratuite' : `${shippingCost.toFixed(2)}€`}</span>
                            </div>
                            <div className="total-line final-total">
                                <span>Total:</span>
                                <span>{finalTotal.toFixed(2)}€</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
