// Version simplifiée sans Stripe pour la démo

// Version démo - remplacez par la vraie intégration Stripe
export const stripePromise = null;

// Types pour les paiements
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

export interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  metadata?: {
    orderId?: string;
    customerId?: string;
  };
}

// Service de paiement
export class PaymentService {
  private static baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  // Créer un Payment Intent
  static async createPaymentIntent(data: CreatePaymentIntentRequest): Promise<PaymentIntent> {
    try {
      const response = await fetch(`${this.baseUrl}/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du paiement');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur PaymentService:', error);
      // En mode développement, simuler une réponse
      if (process.env.NODE_ENV === 'development') {
        return this.mockPaymentIntent(data);
      }
      throw error;
    }
  }

  // Confirmer un paiement
  static async confirmPayment(paymentIntentId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/confirm-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentIntentId }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la confirmation du paiement');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur confirmation paiement:', error);
      // En mode développement, simuler une confirmation
      if (process.env.NODE_ENV === 'development') {
        return { success: true };
      }
      return { success: false, error: 'Erreur de paiement' };
    }
  }

  // Mock pour le développement
  private static mockPaymentIntent(data: CreatePaymentIntentRequest): PaymentIntent {
    return {
      id: `pi_mock_${Date.now()}`,
      amount: data.amount,
      currency: data.currency,
      status: 'requires_payment_method',
      client_secret: `pi_mock_${Date.now()}_secret_mock`,
    };
  }
}

// Utilitaires pour formater les montants
export const formatAmount = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100); // Stripe utilise les centimes
};

// Convertir en centimes pour Stripe
export const toStripeAmount = (amount: number): number => {
  return Math.round(amount * 100);
};

// Validation des cartes
export const validateCardNumber = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, '');
  return /^\d{13,19}$/.test(cleaned);
};

export const validateExpiryDate = (expiry: string): boolean => {
  const [month, year] = expiry.split('/');
  if (!month || !year) return false;
  
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(`20${year}`, 10);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  return monthNum >= 1 && monthNum <= 12 && 
         (yearNum > currentYear || (yearNum === currentYear && monthNum >= currentMonth));
};

export const validateCVC = (cvc: string): boolean => {
  return /^\d{3,4}$/.test(cvc);
};
