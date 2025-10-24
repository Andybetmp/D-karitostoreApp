import './OrderConfirmation.css';

const OrderConfirmation = ({ onClose }) => {
  const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();

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
