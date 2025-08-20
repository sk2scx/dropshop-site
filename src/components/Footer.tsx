import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>DropShop</h3>
            <p>Votre boutique en ligne de confiance pour tous vos besoins.</p>
          </div>
          
          <div className="footer-section">
            <h4>Liens rapides</h4>
            <ul>
              <li><a href="/">Accueil</a></li>
              <li><a href="/products">Produits</a></li>
              <li><a href="/about">À propos</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Service client</h4>
            <ul>
              <li><a href="/shipping">Livraison</a></li>
              <li><a href="/returns">Retours</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/support">Support</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Suivez-nous</h4>
            <div className="social-links">
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">Instagram</a>
              <a href="#" className="social-link">Twitter</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 DropShop. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
