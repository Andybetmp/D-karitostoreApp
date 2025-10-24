import { useState } from 'react';
import { CartProvider } from './context/CartContext.jsx';
import Header from './components/Header';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import ProductDetail from './components/ProductDetail';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import { products, categories } from './data/products';
import './App.css';

function App() {
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  const handleCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  const handleOrderComplete = () => {
    setShowCheckout(false);
    setShowConfirmation(true);
  };

  const handleHomeClick = () => {
    setShowCart(false);
    setSelectedProduct(null);
    setShowCheckout(false);
    setShowConfirmation(false);
  };

  return (
    <CartProvider>
      <div className="app">
        <Header 
          onCartClick={() => setShowCart(true)}
          onHomeClick={handleHomeClick}
        />
        
        <main className="main-content">
          <ProductList 
            products={products}
            categories={categories}
            onViewDetails={handleViewDetails}
          />
        </main>

        {showCart && (
          <Cart 
            onClose={() => setShowCart(false)}
            onCheckout={handleCheckout}
          />
        )}

        {selectedProduct && (
          <ProductDetail 
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}

        {showCheckout && (
          <Checkout 
            onClose={() => setShowCheckout(false)}
            onComplete={handleOrderComplete}
          />
        )}

        {showConfirmation && (
          <OrderConfirmation 
            onClose={() => setShowConfirmation(false)}
          />
        )}

        <footer className="footer">
          <div className="footer-content">
            <p>&copy; 2025 D-karitoStore. Todos los derechos reservados.</p>
            <p>Tu tienda electrónica de confianza</p>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}

export default App;

