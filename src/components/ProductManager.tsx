import React, { useState } from 'react';
import { Product } from '../types';
import { products, categories, brands } from '../data/products';

interface ProductManagerProps {
  onClose: () => void;
}

const ProductManager: React.FC<ProductManagerProps> = ({ onClose }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({});

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData(product);
    setIsEditing(true);
  };

  const handleSave = () => {
    // Ici vous pourriez sauvegarder dans une base de données
    console.log('Produit sauvegardé:', formData);
    alert('Produit sauvegardé ! (En mode démo, les changements ne sont pas persistants)');
    setIsEditing(false);
    setSelectedProduct(null);
  };

  const handleDelete = (productId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      console.log('Produit supprimé:', productId);
      alert('Produit supprimé ! (En mode démo)');
    }
  };

  const generateProductCode = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `prod-${timestamp}-${random}`;
  };

  const exportProducts = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'products.json';
    link.click();
  };

  return (
    <div className="product-manager-overlay">
      <div className="product-manager">
        <div className="manager-header">
          <h2>🛍️ Gestionnaire de Produits</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="manager-actions">
          <button onClick={exportProducts} className="btn btn-secondary">
            📥 Exporter les produits
          </button>
          <button 
            onClick={() => {
              setFormData({
                id: generateProductCode(),
                title: '',
                description: '',
                price: 0,
                category: categories[0]?.name || '',
                brand: brands[0] || '',
                inStock: true,
                rating: 4.5,
                reviewCount: 0,
                features: []
              });
              setIsEditing(true);
              setSelectedProduct(null);
            }}
            className="btn btn-primary"
          >
            ➕ Nouveau produit
          </button>
        </div>

        {isEditing ? (
          <div className="product-form">
            <h3>{selectedProduct ? 'Modifier le produit' : 'Nouveau produit'}</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>ID du produit</label>
                <input
                  type="text"
                  value={formData.id || ''}
                  onChange={(e) => setFormData({...formData, id: e.target.value})}
                  placeholder="prod-001"
                />
              </div>
              
              <div className="form-group">
                <label>Titre</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Nom de votre produit"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Description détaillée qui donne envie d'acheter..."
                rows={4}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Prix (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                />
              </div>
              
              <div className="form-group">
                <label>Prix original (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.originalPrice || ''}
                  onChange={(e) => setFormData({...formData, originalPrice: parseFloat(e.target.value)})}
                  placeholder="Prix barré (optionnel)"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Catégorie</label>
                <select
                  value={formData.category || ''}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Marque</label>
                <input
                  type="text"
                  value={formData.brand || ''}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  placeholder="Nom de la marque"
                />
              </div>
            </div>

            <div className="form-group">
              <label>URL de l'image principale</label>
              <input
                type="url"
                value={formData.imageUrl || ''}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                placeholder="https://images.unsplash.com/photo-..."
              />
            </div>

            <div className="form-actions">
              <button onClick={handleSave} className="btn btn-primary">
                💾 Sauvegarder
              </button>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setSelectedProduct(null);
                }}
                className="btn btn-secondary"
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <div className="products-list">
            <h3>Vos produits ({products.length})</h3>
            
            {products.length === 0 ? (
              <div className="empty-state">
                <p>Aucun produit configuré.</p>
                <p>Ajoutez vos produits dans <code>src/data/products.ts</code></p>
              </div>
            ) : (
              <div className="products-table">
                {products.map(product => (
                  <div key={product.id} className="product-row">
                    <div className="product-info">
                      <img src={product.imageUrl} alt={product.title} className="product-thumb" />
                      <div>
                        <h4>{product.title}</h4>
                        <p>{product.price}€ - {product.category}</p>
                        <span className={`stock-status ${product.inStock ? 'in-stock' : 'out-stock'}`}>
                          {product.inStock ? '✅ En stock' : '❌ Rupture'}
                        </span>
                      </div>
                    </div>
                    <div className="product-actions">
                      <button onClick={() => handleEdit(product)} className="btn-edit">
                        ✏️ Modifier
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="btn-delete">
                        🗑️ Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="manager-help">
          <h4>💡 Aide rapide</h4>
          <ul>
            <li><strong>Images :</strong> Utilisez Unsplash, Cloudinary ou vos propres URLs</li>
            <li><strong>Prix :</strong> Utilisez des prix psychologiques (19.99€, 29.99€)</li>
            <li><strong>Descriptions :</strong> Mettez en avant les bénéfices, pas juste les caractéristiques</li>
            <li><strong>Catégories :</strong> Modifiez les catégories dans <code>src/data/products.ts</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductManager;
