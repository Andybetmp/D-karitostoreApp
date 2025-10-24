import { useCart } from '../context/CartContext.js';
import './ProductDetail.css';

const ProductDetail = ({ product, onClose }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        
        <div className="product-detail-container">
          <div className="product-detail-image">
            <img src={product.image} alt={product.name} />
          </div>
          
          <div className="product-detail-info">
            <span className="product-detail-category">{product.category}</span>
            <h2 className="product-detail-name">{product.name}</h2>
            
            <div className="product-detail-rating">
              {'⭐'.repeat(Math.floor(product.rating))}
              <span className="rating-value">{product.rating} / 5</span>
            </div>
            
            <p className="product-detail-description">{product.description}</p>
            
            <div className="product-detail-price-section">
              <div className="price-container">
                <span className="price-label">Precio:</span>
                <span className="product-detail-price">${product.price.toFixed(2)}</span>
              </div>
              
              <div className="stock-info">
                {product.stock > 0 ? (
                  <>
                    <span className="stock-available">✓ En stock</span>
                    <span className="stock-quantity">({product.stock} disponibles)</span>
                  </>
                ) : (
                  <span className="stock-unavailable">✕ Sin stock</span>
                )}
              </div>
            </div>
            
            <div className="product-detail-features">
              <h3>Características:</h3>
              <ul>
                <li>Envío gratis en compras mayores a $50</li>
                <li>Garantía del fabricante</li>
                <li>Devolución en 30 días</li>
                <li>Atención al cliente 24/7</li>
              </ul>
            </div>
            
            <button 
              className="add-to-cart-detail-btn"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Sin stock' : '🛒 Agregar al carrito'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
