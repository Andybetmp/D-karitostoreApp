import { useState } from 'react';
import { useCart } from '../context/CartContext';
import './Checkout.css';

const Checkout = ({ onClose, onComplete }) => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVV: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      onComplete();
    }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="checkout-container" onClick={(e) => e.stopPropagation()}>
        <div className="checkout-header">
          <h2>💳 Finalizar Compra</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="checkout-content">
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-section">
                <h3>Información de Contacto</h3>
                <div className="form-group">
                  <label>Nombre completo *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Juan Pérez"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="juan@ejemplo.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Teléfono *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="555-1234"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Dirección de Envío</h3>
                <div className="form-group">
                  <label>Dirección *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Calle Principal 123"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Ciudad *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      placeholder="Ciudad"
                    />
                  </div>
                  <div className="form-group">
                    <label>Código Postal *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                      placeholder="12345"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Información de Pago</h3>
                <div className="form-group">
                  <label>Número de Tarjeta *</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    required
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                  />
                </div>
                <div className="form-group">
                  <label>Nombre en la Tarjeta *</label>
                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    required
                    placeholder="Juan Pérez"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha de Expiración *</label>
                    <input
                      type="text"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleChange}
                      required
                      placeholder="MM/AA"
                      maxLength="5"
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV *</label>
                    <input
                      type="text"
                      name="cardCVV"
                      value={formData.cardCVV}
                      onChange={handleChange}
                      required
                      placeholder="123"
                      maxLength="4"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="submit-order-btn"
                disabled={isProcessing}
              >
                {isProcessing ? 'Procesando...' : 'Confirmar Pedido'}
              </button>
            </form>
          </div>

          <div className="order-summary">
            <h3>Resumen del Pedido</h3>
            <div className="summary-items">
              {cartItems.map(item => (
                <div key={item.id} className="summary-item">
                  <div className="summary-item-info">
                    <span className="summary-item-name">{item.name}</span>
                    <span className="summary-item-quantity">x{item.quantity}</span>
                  </div>
                  <span className="summary-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="summary-divider"></div>
            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Envío:</span>
                <span className="free-shipping">Gratis</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
