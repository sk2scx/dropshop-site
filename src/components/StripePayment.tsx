import React, { useState } from 'react';

interface StripePaymentProps {
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

// Version simplifiée sans Stripe (pour la démo)
const StripePayment: React.FC<StripePaymentProps> = ({ amount, onSuccess, onError }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);
    setPaymentError(null);

    // Validation simple
    if (!cardNumber || !expiryDate || !cvv) {
      setPaymentError('Veuillez remplir tous les champs');
      setIsProcessing(false);
      return;
    }

    // Simulation d'un paiement (remplacez par la vraie intégration Stripe)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulation délai

      // Simuler un succès (90% de chance)
      if (Math.random() > 0.1) {
        onSuccess('pi_demo_' + Date.now());
      } else {
        throw new Error('Paiement refusé par la banque');
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Erreur de paiement');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-payment-form">
      <div className="payment-section">
        <h3>💳 Informations de paiement</h3>

        <div className="demo-notice">
          <p>🧪 <strong>Mode Démo</strong> - Utilisez n'importe quels chiffres pour tester</p>
          <p>💡 Exemple : 4242 4242 4242 4242, 12/25, 123</p>
        </div>

        <div className="card-form">
          <div className="form-group">
            <label>Numéro de carte</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="4242 4242 4242 4242"
              maxLength={19}
              className="card-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date d'expiration</label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                placeholder="MM/AA"
                maxLength={5}
                className="card-input"
              />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, '').substring(0, 3))}
                placeholder="123"
                maxLength={3}
                className="card-input"
              />
            </div>
          </div>
        </div>

        {paymentError && (
          <div className="payment-error">
            ⚠️ {paymentError}
          </div>
        )}

        <div className="payment-summary">
          <div className="amount-display">
            <strong>Total à payer : {amount.toFixed(2)}€</strong>
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className={`payment-button ${isProcessing ? 'processing' : ''}`}
        >
          {isProcessing ? (
            <>
              <span className="spinner"></span>
              Traitement en cours...
            </>
          ) : (
            <>
              🔒 Payer {amount.toFixed(2)}€
            </>
          )}
        </button>

        <div className="payment-security">
          <p>🔒 Paiement sécurisé (Mode Démo)</p>
          <p>En production, utilisez Stripe pour la sécurité</p>
        </div>
      </div>
    </form>
  );
};

export default StripePayment;
