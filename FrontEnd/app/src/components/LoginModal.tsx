import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { FaTimes, FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled(motion.div)`
  background-color: ${props => props.theme.body};
  border: 2px solid ${props => props.theme.text};
  border-radius: 20px;
  padding: 3rem;
  width: 90%;
  max-width: 450px;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);

  @media (max-width: 40em) {
    padding: 2rem;
    max-width: 90%;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: ${props => props.theme.text};
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const Title = styled.h2`
  color: ${props => props.theme.text};
  font-size: ${props => props.theme.fontxl};
  margin-bottom: 2rem;
  text-align: center;
  text-transform: uppercase;
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  color: ${props => props.theme.grey};
  font-size: 1.2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid ${props => props.theme.grey};
  border-radius: 10px;
  color: ${props => props.theme.text};
  font-size: ${props => props.theme.fontmd};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.text};
    background-color: rgba(255, 255, 255, 0.1);
  }

  &::placeholder {
    color: ${props => props.theme.grey};
  }
`;

const Button = styled.button`
  padding: 1rem;
  background-color: ${props => props.theme.text};
  color: ${props => props.theme.body};
  border: none;
  border-radius: 10px;
  font-size: ${props => props.theme.fontmd};
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: scale(1.02);
    box-shadow: 0 5px 15px rgba(255, 255, 255, 0.3);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: ${props => props.theme.grey};
  font-size: ${props => props.theme.fontsm};

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: ${props => props.theme.grey};
  }

  &::before {
    margin-right: 1rem;
  }

  &::after {
    margin-left: 1rem;
  }
`;

const GoogleButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  
  & > div {
    width: 100% !important;
  }

  & button {
    width: 100% !important;
    justify-content: center !important;
  }
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${props => props.theme.grey};
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 1rem;
  background: none;
  border: none;
  color: ${props => props.active ? props.theme.text : props.theme.grey};
  font-size: ${props => props.theme.fontmd};
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  border-bottom: 3px solid ${props => props.active ? props.theme.text : 'transparent'};
  transition: all 0.3s ease;
  margin-bottom: -2px;

  &:hover {
    color: ${props => props.theme.text};
  }
`;

const ForgotPassword = styled.a`
  color: ${props => props.theme.grey};
  font-size: ${props => props.theme.fontsm};
  text-align: right;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: ${props => props.theme.text};
  }
`;

const ErrorMessage = styled.div`
  background-color: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.3);
  border-radius: 8px;
  padding: 0.75rem;
  color: #ff6b6b;
  font-size: ${props => props.theme.fontsm};
  margin-bottom: 1rem;
  text-align: center;
`;

const LoginModal = () => {
  const { isLoginModalOpen, closeLoginModal, login, register, loginWithGoogle, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar error al escribir
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let authResponse;
      if (activeTab === 'login') {
        // Login
        authResponse = await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        // Register
        authResponse = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      }

      // Redirigir a la página principal tras éxito (según solicitud del usuario)
      navigate('/');

      // Cerrar modal
      closeLoginModal();

      // Limpiar formulario
      setFormData({
        email: '',
        password: '',
        name: ''
      });
    } catch (err) {
      // El error ya está manejado en AuthContext
      console.error('Authentication error:', err);
    }
  };

  const handleGoogleSuccess = (credentialResponse: any) => {
    loginWithGoogle(credentialResponse);
    navigate('/');
  };

  const handleGoogleError = () => {
    console.log('Google Login Failed');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    clearError();
  };

  return (
    <AnimatePresence>
      {isLoginModalOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLoginModal}
        >
          <ModalContainer
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={closeLoginModal}>
              <FaTimes />
            </CloseButton>

            <Title>{activeTab === 'login' ? 'Iniciar Sesión' : 'Registrarse'}</Title>

            <TabContainer>
              <Tab
                active={activeTab === 'login'}
                onClick={() => handleTabChange('login')}
              >
                Login
              </Tab>
              <Tab
                active={activeTab === 'signup'}
                onClick={() => handleTabChange('signup')}
              >
                Sign Up
              </Tab>
            </TabContainer>

            {error && (
              <ErrorMessage>
                {error}
              </ErrorMessage>
            )}

            <Form onSubmit={handleSubmit}>
              {activeTab === 'signup' && (
                <InputGroup>
                  <InputIcon>
                    <FaUser />
                  </InputIcon>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Nombre completo"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </InputGroup>
              )}

              <InputGroup>
                <InputIcon>
                  <FaEnvelope />
                </InputIcon>
                <Input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </InputGroup>

              <InputGroup>
                <InputIcon>
                  <FaLock />
                </InputIcon>
                <Input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </InputGroup>

              {activeTab === 'login' && (
                <ForgotPassword href="#">¿Olvidaste tu contraseña?</ForgotPassword>
              )}

              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? 'Procesando...'
                  : activeTab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'
                }
              </Button>
            </Form>

            <Divider>O continúa con</Divider>

            <GoogleButtonWrapper>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="filled_black"
                size="large"
                text={activeTab === 'login' ? 'signin_with' : 'signup_with'}
                shape="rectangular"
                logo_alignment="left"
              />
            </GoogleButtonWrapper>
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
