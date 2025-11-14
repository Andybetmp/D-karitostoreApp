import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const CartIconContainer = styled(motion.div as any)`
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.text};
  font-size: ${props => props.theme.fontlg};

  &:hover {
    color: ${props => props.theme.grey};
  }
`;

const CartCount = styled(motion.span as any)`
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: ${props => props.theme.body};
  color: ${props => props.theme.text};
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.fontxs};
  font-weight: bold;
  border: 2px solid ${props => props.theme.grey};
`;

const CartIcon: React.FC = () => {
  const { getTotalItems, openCart } = useCart();
  const totalItems = getTotalItems();

  return (
    <CartIconContainer
      onClick={openCart}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
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
    </CartIconContainer>
  );
};

export default CartIcon;
