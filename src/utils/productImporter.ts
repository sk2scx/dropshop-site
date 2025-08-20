import { Product } from '../types';

// Utilitaire pour importer des produits depuis différents formats

export interface CSVProduct {
  id: string;
  title: string;
  description: string;
  price: string;
  originalPrice?: string;
  imageUrl: string;
  category: string;
  brand: string;
  inStock: string;
  features: string; // Séparées par des virgules
}

export interface ImportResult {
  success: boolean;
  products: Product[];
  errors: string[];
}

// Convertir un produit CSV en produit typé
export const convertCSVToProduct = (csvProduct: CSVProduct): Product => {
  return {
    id: csvProduct.id,
    title: csvProduct.title,
    description: csvProduct.description,
    price: parseFloat(csvProduct.price),
    originalPrice: csvProduct.originalPrice ? parseFloat(csvProduct.originalPrice) : undefined,
    imageUrl: csvProduct.imageUrl,
    category: csvProduct.category,
    brand: csvProduct.brand,
    rating: 4.5, // Valeur par défaut
    reviewCount: 0, // Valeur par défaut
    inStock: csvProduct.inStock.toLowerCase() === 'true' || csvProduct.inStock === '1',
    features: csvProduct.features ? csvProduct.features.split(',').map(f => f.trim()) : []
  };
};

// Parser un fichier CSV
export const parseCSV = (csvContent: string): ImportResult => {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const errors: string[] = [];
  const products: Product[] = [];

  if (lines.length < 2) {
    return {
      success: false,
      products: [],
      errors: ['Le fichier CSV doit contenir au moins un en-tête et une ligne de données']
    };
  }

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const expectedHeaders = ['id', 'title', 'description', 'price', 'imageUrl', 'category', 'brand', 'inStock'];
  
  // Vérifier les en-têtes requis
  const missingHeaders = expectedHeaders.filter(header => !headers.includes(header));
  if (missingHeaders.length > 0) {
    errors.push(`En-têtes manquants: ${missingHeaders.join(', ')}`);
  }

  // Parser chaque ligne
  for (let i = 1; i < lines.length; i++) {
    try {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const csvProduct: any = {};
      
      headers.forEach((header, index) => {
        csvProduct[header] = values[index] || '';
      });

      // Validation basique
      if (!csvProduct.id || !csvProduct.title || !csvProduct.price) {
        errors.push(`Ligne ${i + 1}: ID, titre et prix sont requis`);
        continue;
      }

      if (isNaN(parseFloat(csvProduct.price))) {
        errors.push(`Ligne ${i + 1}: Prix invalide`);
        continue;
      }

      const product = convertCSVToProduct(csvProduct as CSVProduct);
      products.push(product);
    } catch (error) {
      errors.push(`Ligne ${i + 1}: Erreur de parsing - ${error}`);
    }
  }

  return {
    success: errors.length === 0,
    products,
    errors
  };
};

// Générer un template CSV
export const generateCSVTemplate = (): string => {
  const headers = [
    'id',
    'title', 
    'description',
    'price',
    'originalPrice',
    'imageUrl',
    'category',
    'brand',
    'inStock',
    'features'
  ];

  const exampleRow = [
    'prod-001',
    'Écouteurs Bluetooth Premium',
    'Écouteurs sans fil avec réduction de bruit active et 24h d\'autonomie',
    '79.99',
    '129.99',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    'Électronique',
    'AudioPro',
    'true',
    'Bluetooth 5.0,Réduction de bruit,24h autonomie,Résistant à l\'eau'
  ];

  return [headers.join(','), exampleRow.join(',')].join('\n');
};

// Exporter des produits vers CSV
export const exportToCSV = (products: Product[]): string => {
  const headers = [
    'id',
    'title',
    'description', 
    'price',
    'originalPrice',
    'imageUrl',
    'category',
    'brand',
    'inStock',
    'features'
  ];

  const rows = products.map(product => [
    product.id,
    `"${product.title}"`,
    `"${product.description}"`,
    product.price.toString(),
    product.originalPrice?.toString() || '',
    product.imageUrl,
    product.category,
    product.brand || '',
    product.inStock.toString(),
    `"${product.features?.join(',') || ''}"`
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
};

// Importer depuis un fournisseur dropshipping (format générique)
export interface DropshippingProduct {
  sku: string;
  name: string;
  description: string;
  price: number;
  compare_at_price?: number;
  image_url: string;
  category: string;
  vendor: string;
  available: boolean;
  tags?: string[];
}

export const convertDropshippingProduct = (
  dsProduct: DropshippingProduct,
  idPrefix: string = 'ds'
): Product => {
  return {
    id: `${idPrefix}-${dsProduct.sku}`,
    title: dsProduct.name,
    description: dsProduct.description,
    price: dsProduct.price,
    originalPrice: dsProduct.compare_at_price,
    imageUrl: dsProduct.image_url,
    category: dsProduct.category,
    brand: dsProduct.vendor,
    rating: 4.5,
    reviewCount: 0,
    inStock: dsProduct.available,
    features: dsProduct.tags || []
  };
};

// Utilitaires pour télécharger/uploader des fichiers
export const downloadCSV = (content: string, filename: string = 'products.csv') => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const uploadCSV = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) {
        reject(new Error('Aucun fichier sélectionné'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
      reader.readAsText(file);
    };

    input.click();
  });
};

// Validation avancée des produits
export const validateProduct = (product: Partial<Product>): string[] => {
  const errors: string[] = [];

  if (!product.id) errors.push('ID requis');
  if (!product.title) errors.push('Titre requis');
  if (!product.description) errors.push('Description requise');
  if (!product.price || product.price <= 0) errors.push('Prix valide requis');
  if (!product.imageUrl) errors.push('URL d\'image requise');
  if (!product.category) errors.push('Catégorie requise');

  // Validation URL image
  if (product.imageUrl && !isValidUrl(product.imageUrl)) {
    errors.push('URL d\'image invalide');
  }

  // Validation prix
  if (product.originalPrice && product.originalPrice <= product.price!) {
    errors.push('Le prix original doit être supérieur au prix de vente');
  }

  return errors;
};

const isValidUrl = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};
