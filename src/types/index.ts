export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    originalPrice?: number;
    imageUrl: string;
    images?: string[];
    category: string;
    brand?: string;
    rating?: number;
    reviewCount?: number;
    inStock: boolean;
    features?: string[];
    seoTitle?: string;
    seoDescription?: string;
    tags?: string[];
}

export interface CartItem {
    productId: string;
    quantity: number;
}

export interface Cart {
    items: CartItem[];
    totalPrice: number;
}

export interface Customer {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface ShippingAddress {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
}

export interface Order {
    id: string;
    customerId: string;
    items: CartItem[];
    shippingAddress: ShippingAddress;
    totalAmount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: Date;
}