import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const FloatingButton = styled(motion.div as any)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: ${props => props.theme.text};
  color: ${props => props.theme.body};
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  font-size: ${props => props.theme.fontlg};
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.grey};
    transform: scale(1.1);
  }

  @media (max-width: 48em) {
    width: 50px;
    height: 50px;
    bottom: 1.5rem;
    right: 1.5rem;
    font-size: ${props => props.theme.fontmd};
  }
`;

const CartCount = styled(motion.span)`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: ${props => props.theme.body};
  color: ${props => props.theme.text};
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.fontxs};
  font-weight: bold;
  border: 2px solid ${props => props.theme.grey};
`;

const FloatingCartButton: React.FC = () => {
  const { getTotalItems, openCart } = useCart();
  const totalItems = getTotalItems();

  return (
    <FloatingButton
      onClick={openCart}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <FaShoppingCart />
      {totalItems > 0 && (
        <CartCount
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500 }}
        >
          {totalItems}
        </CartCount>
      )}
    </FloatingButton>
  );
};

export default FloatingCartButton;
