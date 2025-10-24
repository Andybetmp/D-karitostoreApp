import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = ({ onClose, onCheckout }) => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const handleCheckout = () => {
    onCheckout();
  };

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-container" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>🛍️ Tu Carrito</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Tu carrito está vacío</p>
            <p className="empty-cart-subtitle">¡Agrega algunos productos!</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p className="cart-item-price">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="cart-item-actions">
                    <div className="quantity-controls">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="quantity-btn"
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="quantity-btn"
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="remove-btn"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="cart-item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Total:</span>
                <span className="total-amount">${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="cart-actions">
                <button onClick={clearCart} className="clear-cart-btn">
                  Vaciar Carrito
                </button>
                <button onClick={handleCheckout} className="checkout-btn">
                  Proceder al Pago
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
