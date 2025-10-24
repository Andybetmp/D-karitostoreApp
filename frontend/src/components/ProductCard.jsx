import { useState } from 'react';
import { useCart } from '../context/CartContext.js';
import './ProductCard.css';

const ProductCard = ({ product, onViewDetails }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="product-card">
      <div className="product-image-container" onClick={() => onViewDetails(product)}>
        <img src={product.image} alt={product.name} className="product-image" />
        {product.stock < 10 && (
          <span className="stock-badge">¡Últimas {product.stock} unidades!</span>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <div className="product-rating">
          {'⭐'.repeat(Math.floor(product.rating))}
          <span className="rating-value">{product.rating}</span>
        </div>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <button 
          className={`add-to-cart-btn ${added ? 'added' : ''}`}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          {added ? '✓ Agregado' : product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
