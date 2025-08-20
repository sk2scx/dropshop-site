import axios, { AxiosResponse, AxiosError } from 'axios';
import { Product, User, Order, ShippingAddress } from '../types';

// Configuration de l'API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Instance Axios configurée
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Types pour les réponses API
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Service des produits
export class ProductService {
  static async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Product>> {
    try {
      const response = await apiClient.get('/products', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback avec données mockées en développement
      if (process.env.NODE_ENV === 'development') {
        return this.getMockProducts();
      }
      throw error;
    }
  }

  static async getProductById(id: string): Promise<Product> {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      // Fallback avec données mockées
      if (process.env.NODE_ENV === 'development') {
        return this.getMockProduct(id);
      }
      throw error;
    }
  }

  static async searchProducts(query: string): Promise<Product[]> {
    try {
      const response = await apiClient.get(`/products/search`, {
        params: { q: query }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  // Données mockées pour le développement
  private static getMockProducts(): PaginatedResponse<Product> {
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

    return {
      data: mockProducts,
      pagination: {
        page: 1,
        limit: 10,
        total: mockProducts.length,
        totalPages: 1
      }
    };
  }

  private static getMockProduct(id: string): Product {
    const mockProducts = this.getMockProducts().data;
    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }
}

// Service d'authentification
export class AuthService {
  static async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  static async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<{ user: User; token: string }> {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data.data;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  }

  static async refreshToken(): Promise<{ token: string }> {
    try {
      const response = await apiClient.post('/auth/refresh');
      return response.data.data;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }

  static async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put('/auth/profile', userData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
}

// Service des commandes
export class OrderService {
  static async createOrder(orderData: {
    items: Array<{ productId: string; quantity: number; price: number }>;
    shippingAddress: ShippingAddress;
    paymentIntentId: string;
    totalAmount: number;
  }): Promise<Order> {
    try {
      const response = await apiClient.post('/orders', orderData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  static async getOrders(): Promise<Order[]> {
    try {
      const response = await apiClient.get('/orders');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  static async getOrderById(id: string): Promise<Order> {
    try {
      const response = await apiClient.get(`/orders/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }
}

// Service des avis
export class ReviewService {
  static async getProductReviews(productId: string): Promise<any[]> {
    try {
      const response = await apiClient.get(`/products/${productId}/reviews`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }

  static async createReview(productId: string, reviewData: {
    rating: number;
    comment: string;
  }): Promise<any> {
    try {
      const response = await apiClient.post(`/products/${productId}/reviews`, reviewData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }
}

// Fonctions utilitaires
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'Une erreur inattendue s\'est produite';
};

export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Export des fonctions legacy pour compatibilité
export const fetchProducts = ProductService.getProducts;
export const fetchProductById = ProductService.getProductById;