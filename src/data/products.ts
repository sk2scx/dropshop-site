import { Product } from '../types';

// 🛍️ VOS PRODUITS - Modifiez ce fichier pour ajouter vos propres produits
export const products: Product[] = [
  {
    id: 'drone-xiaomi-d16-8k',
    title: 'Drone Xiaomi D16 Caméra 8K HD - Professionnel avec 3 Batteries',
    description: `🚁 **DÉCOUVREZ LE DRONE RÉVOLUTIONNAIRE XIAOMI D16 !**

✨ **POURQUOI CHOISIR CE DRONE ?**
Transformez vos aventures en souvenirs inoubliables avec ce drone professionnel équipé d'une caméra 8K ultra-haute définition ! Que vous soyez débutant ou expert, ce drone vous offre une expérience de vol exceptionnelle.

🎥 **QUALITÉ D'IMAGE ÉPOUSTOUFLANTE**
• Caméra double HD 8K pour des vidéos cinématographiques
• Stabilisation professionnelle pour des images nettes
• Mode photo et vidéo haute résolution
• Transmission en temps réel sur votre smartphone

🔋 **AUTONOMIE EXCEPTIONNELLE**
• 3 batteries incluses pour jusqu'à 90 minutes de vol
• Moteur sans brosse haute performance
• Charge rapide et indicateur de batterie

🛡️ **TECHNOLOGIE AVANCÉE**
• Système de flux optique pour un vol stable
• Mode retour automatique à la maison
• Résistance au vent jusqu'à niveau 6
• Contrôle par application mobile intuitive

🎯 **PARFAIT POUR :**
• Photographie aérienne professionnelle
• Vidéos de voyage et aventures
• Surveillance de propriété
• Loisirs et apprentissage du pilotage

📦 **PACK COMPLET INCLUS :**
• 1 Drone Xiaomi D16 avec caméra 8K
• 3 batteries longue durée
• Télécommande professionnelle
• Câbles de charge et accessoires
• Manuel en français
• Hélices de rechange

✅ **GARANTIES & SERVICES :**
• Garantie constructeur 2 ans
• Livraison gratuite et rapide
• Support technique en français
• Retours sous 30 jours satisfait ou remboursé

🔥 **OFFRE LIMITÉE : -40% jusqu'à épuisement des stocks !**

⭐ **Plus de 2000 clients satisfaits - Note moyenne 4.8/5**

Commandez maintenant et rejoignez la révolution du drone professionnel !`,
    price: 299.99,
    originalPrice: 499.99,
    imageUrl: 'https://ae01.alicdn.com/kf/S70bf5009264e415c8eb279698b6544c9n.jpg',
    images: [
      'https://ae01.alicdn.com/kf/S70bf5009264e415c8eb279698b6544c9n.jpg',
      'https://ae01.alicdn.com/kf/S554cc3acb4774243a1aa5181a8ee9168x.jpg',
      'https://ae01.alicdn.com/kf/S15f0d619845149cb9f45f671a0e93a20E.jpg',
      'https://ae01.alicdn.com/kf/Sd3719bb52e914ee08b9db9967b05c8d5s.jpg',
      'https://ae01.alicdn.com/kf/S3e79451b141d42cca5738a79927b36a03.jpg',
      'https://ae01.alicdn.com/kf/Sf56d1c25198c4497a4b236f55b26f15cO.jpg'
    ],
    category: 'High-Tech',
    brand: 'Xiaomi',
    rating: 4.8,
    reviewCount: 2156,
    inStock: true,
    features: [
      'Caméra 8K HD double objectif',
      '3 batteries incluses - 90min de vol total',
      'Moteur sans brosse professionnel',
      'Système de flux optique avancé',
      'Retour automatique à la maison',
      'Résistance au vent niveau 6',
      'Application mobile de contrôle',
      'Transmission temps réel',
      'Mode débutant et expert',
      'Garantie 2 ans constructeur'
    ],
    seoTitle: 'Drone Xiaomi D16 8K HD Professionnel - 3 Batteries | DropShop',
    seoDescription: 'Drone Xiaomi D16 avec caméra 8K HD, 3 batteries, moteur sans brosse. Qualité professionnelle, livraison gratuite, garantie 2 ans. ⭐4.8/5',
    tags: ['drone', 'xiaomi', 'camera-8k', 'professionnel', 'promo', 'populaire', 'high-tech']
  },
  {
    id: '2',
    title: 'Écouteurs Bluetooth Sans Fil Premium',
    description: 'Écouteurs haute qualité avec réduction de bruit active et autonomie de 24h. Son cristallin et confort optimal.',
    price: 79.99,
    originalPrice: 129.99,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    category: 'Électronique',
    brand: 'AudioPro',
    rating: 4.5,
    reviewCount: 89,
    inStock: true,
    features: [
      'Bluetooth 5.0 ultra-stable',
      'Réduction de bruit active',
      '24h d\'autonomie totale',
      'Résistance IPX7'
    ]
  },
  // Ajoutez autant de produits que vous voulez ici...
];

// 📂 CATÉGORIES - Définissez vos catégories de produits
export const categories = [
  {
    id: 'high-tech',
    name: 'High-Tech',
    description: 'Drones, gadgets et technologies avancées',
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400'
  },
  {
    id: 'electronique',
    name: 'Électronique',
    description: 'Gadgets et appareils électroniques',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400'
  },
  {
    id: 'accessoires',
    name: 'Accessoires',
    description: 'Accessoires et équipements',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'
  },
  {
    id: 'maison',
    name: 'Maison & Jardin',
    description: 'Articles pour la maison',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
  }
  // Ajoutez vos catégories ici...
];

// 🏷️ MARQUES - Listez vos marques
export const brands = [
  'Votre Marque',
  'Marque Partenaire 1',
  'Marque Partenaire 2'
  // Ajoutez vos marques ici...
];

// 🎯 PRODUITS EN VEDETTE - IDs des produits à mettre en avant
export const featuredProductIds = ['drone-xiaomi-d16-8k', '2'];

// 🔥 PRODUITS POPULAIRES - IDs des produits les plus vendus
export const popularProductIds = ['drone-xiaomi-d16-8k'];

// 💰 OFFRES SPÉCIALES - Produits en promotion
export const saleProductIds = ['drone-xiaomi-d16-8k', '2'];

// Fonctions utilitaires
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (categoryId: string): Product[] => {
  return products.filter(product => 
    product.category.toLowerCase() === categoryId.toLowerCase()
  );
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => featuredProductIds.includes(product.id));
};

export const getPopularProducts = (): Product[] => {
  return products.filter(product => popularProductIds.includes(product.id));
};

export const getSaleProducts = (): Product[] => {
  return products.filter(product => saleProductIds.includes(product.id));
};

export const searchProducts = (query: string): Product[] => {
  const searchTerm = query.toLowerCase();
  return products.filter(product =>
    product.title.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.brand?.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm) ||
    product.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};
