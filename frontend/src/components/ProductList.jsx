import { useState } from 'react';
import ProductCard from './ProductCard';
import './ProductList.css';

const ProductList = ({ products, categories, onViewDetails }) => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const filteredProducts = products
    .filter(product => {
      const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  return (
    <div className="product-list-container">
      <div className="filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="sort-container">
          <label>Ordenar por: </label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
            <option value="name">Nombre</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="rating">Calificación</option>
          </select>
        </div>
      </div>

      <div className="products-count">
        Mostrando {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
      </div>

      <div className="product-grid">
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <p>No se encontraron productos que coincidan con tu búsqueda.</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product}
              onViewDetails={onViewDetails}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;
