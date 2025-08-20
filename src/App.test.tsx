import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock react-router-dom pour les tests
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Route: ({ element }: { element: React.ReactNode }) => <div>{element}</div>,
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

test('renders DropShop header', () => {
  render(<App />);
  const headerElement = screen.getByText(/DropShop/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders welcome message', () => {
  render(<App />);
  const welcomeElement = screen.getByText(/Bienvenue chez DropShop/i);
  expect(welcomeElement).toBeInTheDocument();
});

test('renders cart link', () => {
  render(<App />);
  const cartElement = screen.getByText(/🛒/);
  expect(cartElement).toBeInTheDocument();
});
