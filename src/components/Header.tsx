import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import UserProfile from './UserProfile';
import ProductManager from './ProductManager';

const Header: React.FC = () => {
  const { state } = useCart();
  const { state: authState } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showProductManager, setShowProductManager] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <h1>DropShop</h1>
        </Link>
        
        <nav className="nav">
          <Link to="/" className="nav-link">Accueil</Link>
          <Link to="/products" className="nav-link">Produits</Link>
          <Link to="/about" className="nav-link">À propos</Link>
          <Link to="/contact" className="nav-link">Contact</Link>

          {/* Bouton gestionnaire de produits (mode développement uniquement) */}
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={() => setShowProductManager(true)}
              className="nav-link admin-btn"
              title="Gestionnaire de produits"
            >
              🛠️ Admin
            </button>
          )}
        </nav>
        
        <div className="header-actions">
          {authState.isAuthenticated ? (
            <div className="user-menu">
              <button
                className="user-button"
                onClick={() => setShowUserProfile(!showUserProfile)}
              >
                <img
                  src={authState.user?.avatar}
                  alt="Profile"
                  className="user-avatar"
                />
                <span>{authState.user?.firstName}</span>
              </button>

              {showUserProfile && (
                <div className="user-dropdown">
                  <UserProfile onClose={() => setShowUserProfile(false)} />
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <button
                className="auth-btn login-btn"
                onClick={() => {
                  setAuthMode('login');
                  setShowAuthModal(true);
                }}
              >
                Connexion
              </button>
              <button
                className="auth-btn register-btn"
                onClick={() => {
                  setAuthMode('register');
                  setShowAuthModal(true);
                }}
              >
                Inscription
              </button>
            </div>
          )}

          <Link to="/cart" className="cart-link">
            <span className="cart-icon">🛒</span>
            <span className="cart-count">{state.totalItems}</span>
            <span className="cart-total">${state.totalPrice.toFixed(2)}</span>
          </Link>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />

      {/* Gestionnaire de produits */}
      {showProductManager && (
        <ProductManager onClose={() => setShowProductManager(false)} />
      )}
    </header>
  );
};

export default Header;
