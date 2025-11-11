import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StyledButton = styled(motion.button)`
  background-color: ${props => `rgba(${props.theme.textRgba}, 0.9)`};
  color: ${props => props.theme.body};
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 25px;
  font-size: ${props => props.theme.fontsm};
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.text};
    transform: scale(1.05);
  }

  @media (max-width: 40em) {
    padding: 0.5rem 1rem;
    font-size: ${props => props.theme.fontxs};
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: ${props => props.theme.text};

  @media (max-width: 40em) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => `rgba(${props.theme.textRgba}, 0.2)`};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: ${props => props.theme.text};
  border: 2px solid ${props => props.theme.text};

  @media (max-width: 40em) {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
`;

const UserName = styled.span`
  font-size: ${props => props.theme.fontmd};
  font-weight: 500;

  @media (max-width: 40em) {
    font-size: ${props => props.theme.fontsm};
  }
`;

const LogoutButton = styled(motion.button)`
  background: none;
  border: 2px solid ${props => props.theme.text};
  color: ${props => props.theme.text};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: ${props => props.theme.fontsm};
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.text};
    color: ${props => props.theme.body};
    transform: scale(1.05);
  }

  @media (max-width: 40em) {
    padding: 0.4rem 0.8rem;
    font-size: ${props => props.theme.fontxs};
  }
`;

const LoginButton = () => {
  const { user, openLoginModal, logout } = useAuth();

  if (user) {
    return (
      <ButtonContainer>
        <UserInfo>
          <UserAvatar>
            <FaUser />
          </UserAvatar>
          <UserName>{user.name}</UserName>
        </UserInfo>
        <LogoutButton
          onClick={logout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaSignOutAlt />
          Salir
        </LogoutButton>
      </ButtonContainer>
    );
  }

  return (
    <StyledButton
      onClick={openLoginModal}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <FaUser />
      Iniciar Sesión
    </StyledButton>
  );
};

export default LoginButton;
