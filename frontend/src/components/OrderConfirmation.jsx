import './OrderConfirmation.css';

const OrderConfirmation = ({ onClose }) => {
  // Generate a more unique order number using timestamp and random values
  const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="confirmation-container" onClick={(e) => e.stopPropagation()}>
        <div className="confirmation-icon">
          <div className="checkmark">✓</div>
        </div>
        <h2>¡Pedido Confirmado!</h2>
        <p className="confirmation-message">
          Tu pedido ha sido procesado exitosamente.
        </p>
        <div className="order-details">
          <div className="order-number">
            <span className="label">Número de pedido:</span>
            <span className="value">{orderNumber}</span>
          </div>
          <p className="order-info">
            Recibirás un correo electrónico con los detalles de tu pedido y 
            el seguimiento del envío.
          </p>
        </div>
        <button className="close-confirmation-btn" onClick={onClose}>
          Continuar Comprando
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
