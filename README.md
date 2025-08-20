# DropShop - Site de Dropshipping 🛒

Un site e-commerce moderne développé en React pour la vente de produits en dropshipping.

## 🚀 Fonctionnalités

- **Interface moderne et responsive** - Design adaptatif pour tous les appareils
- **Catalogue de produits** - Affichage des produits avec images, descriptions et prix
- **Panier d'achat** - Gestion complète du panier avec ajout/suppression d'articles
- **Page de détail produit** - Informations détaillées avec galerie d'images
- **Processus de commande** - Formulaire de checkout avec validation
- **Navigation intuitive** - Menu de navigation et liens vers toutes les pages

## 🛠️ Technologies utilisées

- **React 17** - Framework JavaScript pour l'interface utilisateur
- **TypeScript** - Typage statique pour un code plus robuste
- **React Router** - Navigation entre les pages
- **Context API** - Gestion d'état global pour le panier
- **CSS3** - Styles modernes avec animations et responsive design

## 📦 Installation

1. **Cloner le repository**
   ```bash
   git clone <url-du-repo>
   cd dropshipping-site
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement**
   ```bash
   npm start
   ```

4. **Ouvrir dans le navigateur**
   ```
   http://localhost:3000
   ```

## 🏗️ Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── Header.tsx      # En-tête avec navigation
│   ├── Footer.tsx      # Pied de page
│   └── ProductCard.tsx # Carte produit
├── pages/              # Pages de l'application
│   ├── Home.tsx        # Page d'accueil
│   ├── Product.tsx     # Détail produit
│   ├── Cart.tsx        # Panier
│   └── Checkout.tsx    # Processus de commande
├── context/            # Gestion d'état global
│   └── CartContext.tsx # Context du panier
├── types/              # Définitions TypeScript
│   └── index.ts        # Types de données
├── styles/             # Fichiers CSS
│   └── main.css        # Styles principaux
└── App.tsx             # Composant principal
```

## 🎨 Fonctionnalités détaillées

### Page d'accueil
- Hero section avec call-to-action
- Grille de produits en vedette
- Section des avantages (livraison, sécurité, etc.)

### Catalogue produits
- Affichage en grille responsive
- Images de qualité avec hover effects
- Prix avec réductions affichées
- Bouton d'ajout au panier

### Page produit
- Galerie d'images avec miniatures
- Informations détaillées (description, caractéristiques)
- Sélecteur de quantité
- Boutons "Ajouter au panier" et "Acheter maintenant"
- Garanties et informations de livraison

### Panier d'achat
- Liste des articles avec images et détails
- Modification des quantités
- Calcul automatique des totaux
- Frais de livraison (gratuit dès 50€)
- Bouton de validation vers le checkout

### Processus de commande
- Formulaire d'adresse de livraison avec validation
- Sélection du mode de paiement
- Résumé de commande
- Simulation de traitement de paiement

## 🔧 Personnalisation

### Ajouter des produits
Modifiez le tableau `mockProducts` dans `src/pages/Home.tsx` et `src/pages/Product.tsx` pour ajouter vos propres produits.

### Modifier les styles
Les styles sont centralisés dans `src/styles/main.css`. Vous pouvez :
- Changer les couleurs principales
- Modifier les espacements et tailles
- Ajouter des animations personnalisées

### Intégrer une API
Remplacez les données mockées par des appels API réels dans :
- `src/pages/Home.tsx` pour la liste des produits
- `src/pages/Product.tsx` pour les détails produit
- `src/pages/Checkout.tsx` pour le traitement des commandes

## 💳 Intégration paiement

Pour un site en production, intégrez un système de paiement réel :
- **Stripe** - Pour les cartes bancaires
- **PayPal** - Pour les paiements PayPal
- **Square** - Alternative complète

## 🚀 Déploiement

### Build de production
```bash
npm run build
```

### Déploiement recommandé
- **Netlify** - Déploiement automatique depuis Git
- **Vercel** - Optimisé pour React
- **GitHub Pages** - Gratuit pour les projets open source

## 📱 Responsive Design

Le site est entièrement responsive avec des breakpoints pour :
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (jusqu'à 767px)

## 🔒 Sécurité

- Validation des formulaires côté client
- Protection XSS avec React
- Données sensibles à sécuriser côté serveur (en production)

## 📈 Améliorations futures

- [ ] Système d'authentification utilisateur
- [ ] Gestion des favoris/wishlist
- [ ] Système de reviews et notes
- [ ] Filtres et recherche avancée
- [ ] Suivi des commandes
- [ ] Programme de fidélité
- [ ] Chat support client
- [ ] Optimisation SEO
- [ ] Analytics et tracking

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou support :
- Créer une issue sur GitHub
- Email : support@dropshop.com

---

**DropShop** - Votre solution e-commerce clé en main 🛒