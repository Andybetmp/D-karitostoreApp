import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const login = (userData) => {
    setUser(userData);
    setIsLoginModalOpen(false);
    // Aquí se conectará con el backend posteriormente
    console.log('User logged in:', userData);
  };

  const loginWithGoogle = (credentialResponse) => {
    // Aquí se procesará la respuesta de Google y se enviará al backend
    console.log('Google credential:', credentialResponse);
    // Por ahora, simulamos un usuario
    const googleUser = {
      name: 'Google User',
      email: 'user@gmail.com',
      picture: null,
      provider: 'google'
    };
    setUser(googleUser);
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    // Aquí se llamará al backend para cerrar sesión
    console.log('User logged out');
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const value = {
    user,
    isLoginModalOpen,
    login,
    loginWithGoogle,
    logout,
    openLoginModal,
    closeLoginModal
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
