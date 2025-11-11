import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  picture: string | null;
  provider: string;
}

interface AuthContextType {
  user: User | null;
  isLoginModalOpen: boolean;
  login: (userData: User) => void;
  loginWithGoogle: (credentialResponse: any) => void;
  logout: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const login = (userData: User) => {
    setUser(userData);
    setIsLoginModalOpen(false);
    // Aquí se conectará con el backend posteriormente
    console.log('User logged in:', userData);
  };

  const loginWithGoogle = (credentialResponse: any) => {
    // Aquí se procesará la respuesta de Google y se enviará al backend
    console.log('Google credential:', credentialResponse);
    // Por ahora, simulamos un usuario
    const googleUser: User = {
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

  const value: AuthContextType = {
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
