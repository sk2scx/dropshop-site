import React, { useState } from 'react';

interface SearchFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
  categories: string[];
  brands: string[];
}

export interface SearchFilters {
  search: string;
  category: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'price' | 'rating' | 'title' | 'createdAt';
  sortOrder: 'asc' | 'desc';
  inStock: boolean;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  onFiltersChange,
  categories,
  brands
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    category: '',
    brand: '',
    minPrice: 0,
    maxPrice: 1000,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    inStock: true,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: SearchFilters = {
      search: '',
      category: '',
      brand: '',
      minPrice: 0,
      maxPrice: 1000,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      inStock: true,
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  return (
    <div className="search-filters">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher des produits..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="search-input"
        />
        <button
          type="button"
          className="advanced-toggle"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? 'Masquer les filtres' : 'Filtres avancés'}
        </button>
      </div>

      {showAdvanced && (
        <div className="advanced-filters">
          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="category">Catégorie</label>
              <select
                id="category"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">Toutes les catégories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="brand">Marque</label>
              <select
                id="brand"
                value={filters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
              >
                <option value="">Toutes les marques</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="sortBy">Trier par</label>
              <select
                id="sortBy"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value as any)}
              >
                <option value="createdAt">Date d'ajout</option>
                <option value="price">Prix</option>
                <option value="rating">Note</option>
                <option value="title">Nom</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="sortOrder">Ordre</label>
              <select
                id="sortOrder"
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value as any)}
              >
                <option value="desc">Décroissant</option>
                <option value="asc">Croissant</option>
              </select>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="minPrice">Prix minimum (€)</label>
              <input
                type="number"
                id="minPrice"
                min="0"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="maxPrice">Prix maximum (€)</label>
              <input
                type="number"
                id="maxPrice"
                min="0"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
              />
            </div>

            <div className="filter-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                />
                <span>En stock uniquement</span>
              </label>
            </div>

            <div className="filter-group">
              <button
                type="button"
                className="reset-filters-btn"
                onClick={resetFilters}
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
