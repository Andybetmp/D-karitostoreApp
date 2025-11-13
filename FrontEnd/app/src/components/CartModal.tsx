import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTrash } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
`;

const ModalContent = styled(motion.div)`
  width: 400px;
  max-width: 90vw;
  height: 100vh;
  background-color: ${props => props.theme.body};
  color: ${props => props.theme.text};
  padding: 2rem;
  overflow-y: auto;

  @media (max-width: 48em) {
    width: 100vw;
    padding: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${props => props.theme.grey};
  padding-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: ${props => props.theme.fontlg};
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text};
  font-size: ${props => props.theme.fontlg};
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.grey};
  }
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid ${props => props.theme.grey};
  border-radius: 8px;
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 1rem;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemTitle = styled.h3`
  font-size: ${props => props.theme.fontmd};
  margin: 0 0 0.5rem 0;
`;

const ItemPrice = styled.p`
  font-size: ${props => props.theme.fontsm};
  color: ${props => props.theme.grey};
  margin: 0;
`;

const ItemQuantity = styled.span`
  font-size: ${props => props.theme.fontsm};
  margin-left: 0.5rem;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
  font-size: ${props => props.theme.fontmd};

  &:hover {
    color: #ff5252;
  }
`;

const TotalSection = styled.div`
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.grey};
`;

const TotalText = styled.p`
  font-size: ${props => props.theme.fontlg};
  font-weight: 600;
  margin: 0 0 1rem 0;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: ${props => props.theme.fontmd};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &.clear {
    background-color: #ff6b6b;
    color: white;

    &:hover {
      background-color: #ff5252;
    }
  }

  &.checkout {
    background-color: ${props => props.theme.text};
    color: ${props => props.theme.body};

    &:hover {
      background-color: ${props => props.theme.grey};
    }
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  margin-top: 4rem;
`;

const EmptyCartText = styled.p`
  font-size: ${props => props.theme.fontlg};
  color: ${props => props.theme.grey};
`;

const CartModal: React.FC = () => {
  const { cart, isCartOpen, closeCart, removeFromCart, clearCart, getTotalPrice } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCart}
        >
          <ModalContent
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            onClick={e => e.stopPropagation()}
          >
            <Header>
              <Title>Carrito de Compras</Title>
              <CloseButton onClick={closeCart}>
                <FaTimes />
              </CloseButton>
            </Header>

            {cart.length === 0 ? (
              <EmptyCart>
                <EmptyCartText>Tu carrito está vacío</EmptyCartText>
              </EmptyCart>
            ) : (
              <>
                {cart.map(item => (
                  <CartItem key={item.id}>
                    <ItemImage src={item.img} alt={item.title} />
                    <ItemDetails>
                      <ItemTitle>{item.title}</ItemTitle>
                      <ItemPrice>
                        ${item.price || 0} <ItemQuantity>x{item.quantity}</ItemQuantity>
                      </ItemPrice>
                    </ItemDetails>
                    <RemoveButton onClick={() => removeFromCart(item.id)}>
                      <FaTrash />
                    </RemoveButton>
                  </CartItem>
                ))}

                <TotalSection>
                  <TotalText>Total: ${getTotalPrice().toFixed(2)}</TotalText>
                  <ActionButtons>
                    <Button className="clear" onClick={clearCart}>
                      Vaciar Carrito
                    </Button>
                    <Button className="checkout" onClick={handleCheckout}>
                      Proceder al Pago
                    </Button>
                  </ActionButtons>
                </TotalSection>
              </>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default CartModal;
