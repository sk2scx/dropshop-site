import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';
import { Product } from '../types';

// Composant de test pour utiliser le contexte
const TestComponent: React.FC = () => {
  const { state, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();

  const mockProduct: Product = {
    id: '1',
    title: 'Test Product',
    description: 'Test Description',
    price: 29.99,
    imageUrl: 'test.jpg',
    category: 'Test',
    inStock: true,
  };

  return (
    <div>
      <div data-testid="total-items">{state.totalItems}</div>
      <div data-testid="total-price">{state.totalPrice.toFixed(2)}€</div>
      <button onClick={() => addToCart(mockProduct)}>Add to Cart</button>
      <button onClick={() => removeFromCart('1')}>Remove from Cart</button>
      <button onClick={() => updateQuantity('1', 3)}>Update Quantity</button>
      <button onClick={clearCart}>Clear Cart</button>
      {state.items.map(item => (
        <div key={item.product.id} data-testid={`item-${item.product.id}`}>
          {item.product.title} - Quantity: {item.quantity}
        </div>
      ))}
    </div>
  );
};

const renderWithProvider = () => {
  return render(
    <CartProvider>
      <TestComponent />
    </CartProvider>
  );
};

describe('CartContext', () => {
  test('should start with empty cart', () => {
    renderWithProvider();

    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    expect(screen.getByTestId('total-price')).toHaveTextContent('0.00€');
  });

  test('should add item to cart', () => {
    renderWithProvider();

    fireEvent.click(screen.getByText('Add to Cart'));

    expect(screen.getByTestId('total-items')).toHaveTextContent('1');
    expect(screen.getByTestId('total-price')).toHaveTextContent('29.99€');
    expect(screen.getByTestId('item-1')).toHaveTextContent('Test Product - Quantity: 1');
  });

  test('should increase quantity when adding same item', () => {
    renderWithProvider();
    
    fireEvent.click(screen.getByText('Add to Cart'));
    fireEvent.click(screen.getByText('Add to Cart'));
    
    expect(screen.getByTestId('total-items')).toHaveTextContent('2');
    expect(screen.getByTestId('total-price')).toHaveTextContent('59.98€');
    expect(screen.getByTestId('item-1')).toHaveTextContent('Test Product - Quantity: 2');
  });

  test('should remove item from cart', () => {
    renderWithProvider();
    
    fireEvent.click(screen.getByText('Add to Cart'));
    fireEvent.click(screen.getByText('Remove from Cart'));
    
    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    expect(screen.getByTestId('total-price')).toHaveTextContent('0.00€');
    expect(screen.queryByTestId('item-1')).not.toBeInTheDocument();
  });

  test('should update item quantity', () => {
    renderWithProvider();
    
    fireEvent.click(screen.getByText('Add to Cart'));
    fireEvent.click(screen.getByText('Update Quantity'));
    
    expect(screen.getByTestId('total-items')).toHaveTextContent('3');
    expect(screen.getByTestId('total-price')).toHaveTextContent('89.97€');
    expect(screen.getByTestId('item-1')).toHaveTextContent('Test Product - Quantity: 3');
  });

  test('should clear cart', () => {
    renderWithProvider();
    
    fireEvent.click(screen.getByText('Add to Cart'));
    fireEvent.click(screen.getByText('Clear Cart'));
    
    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    expect(screen.getByTestId('total-price')).toHaveTextContent('0.00€');
    expect(screen.queryByTestId('item-1')).not.toBeInTheDocument();
  });
});
