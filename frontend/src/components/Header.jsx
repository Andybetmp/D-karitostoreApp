import { useCart } from '../context/CartContext';
import './Header.css';

const Header = ({ onCartClick, onHomeClick }) => {
  const { getCartCount } = useCart();

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo" onClick={onHomeClick} style={{ cursor: 'pointer' }}>
          <h1>🛒 D-karitoStore</h1>
          <p className="tagline">Tu tienda electrónica de confianza</p>
        </div>
        <nav className="nav">
          <button className="cart-button" onClick={onCartClick}>
            🛍️ Carrito
            {getCartCount() > 0 && (
              <span className="cart-badge">{getCartCount()}</span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
