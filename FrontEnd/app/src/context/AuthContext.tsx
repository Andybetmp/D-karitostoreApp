import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, LoginRequest, RegisterRequest, AuthResponse } from '../services/authService';

interface User {
  id: number;
  name: string;
  email: string;
  picture: string | null;
  provider: string;
  roles: string[]; // Array de roles del usuario
}

interface AuthContextType {
  user: User | null;
  isLoginModalOpen: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  register: (credentials: RegisterRequest) => Promise<AuthResponse>;
  loginWithGoogle: (credentialResponse: any) => Promise<void>;
  logout: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  clearError: () => void;
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-login con token almacenado
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.login(credentials);
      const authData: AuthResponse = response.data;

      // Almacenar token
      localStorage.setItem('token', authData.accessToken);
      if (authData.refreshToken) {
        localStorage.setItem('refreshToken', authData.refreshToken);
      }

      // Crear objeto de usuario con roles
      const userData: User = {
        id: authData.id,
        name: authData.name,
        email: authData.email,
        picture: authData.picture || null,
        provider: authData.provider || 'email',
        roles: authData.roles || ['USER'] // Roles del backend
      };

      // Almacenar usuario
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      console.log('Login successful:', userData);
      console.log('User roles:', userData.roles);

      return authData; // Retornar datos de autenticación
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al iniciar sesión';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterRequest): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.register(credentials);
      const authData: AuthResponse = response.data;

      // Almacenar token
      localStorage.setItem('token', authData.accessToken);
      if (authData.refreshToken) {
        localStorage.setItem('refreshToken', authData.refreshToken);
      }

      // Crear objeto de usuario con roles
      const userData: User = {
        id: authData.id,
        name: authData.name,
        email: authData.email,
        picture: authData.picture || null,
        provider: authData.provider || 'email',
        roles: authData.roles || ['USER']
      };

      // Almacenar usuario
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      console.log('Registration successful:', userData);

      return authData; // Retornar datos de autenticación
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al registrarse';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (credentialResponse: any): Promise<void> => {
    // Aquí se procesará la respuesta de Google y se enviará al backend
    console.log('Google credential:', credentialResponse);
    // Por ahora, simulamos un usuario
    const googleUser: User = {
      id: 0,
      name: 'Google User',
      email: 'user@gmail.com',
      picture: null,
      provider: 'google',
      roles: ['ADMIN']
    };
    setUser(googleUser);
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    console.log('User logged out');
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setError(null);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role: string): boolean => {
    return user?.roles?.includes(role) || false;
  };

  // Verificar si el usuario es admin
  const isAdmin = (): boolean => {
    return hasRole('ADMIN');
  };

  const value: AuthContextType = {
    user,
    isLoginModalOpen,
    isLoading,
    error,
    login,
    register,
    loginWithGoogle,
    logout,
    openLoginModal,
    closeLoginModal,
    clearError,
    hasRole,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
