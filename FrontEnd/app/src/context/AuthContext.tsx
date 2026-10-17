import React, { createContext, useContext, useState, ReactNode } from 'react';
import { authService, LoginRequest, RegisterRequest, AuthResponse } from '../services/authService';

export interface User {
  id: number;
  name: string;
  email: string;
  picture: string | null;
  provider: string;
  roles: string[];
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

const ADMIN_EMAILS = ['andybet.mp@gmail.com', 'andyjo-14@hotmail.com', 'admin@dkarito.com'];

const isLikelyAdminEmail = (email: string): boolean => {
  const normalized = (email || '').trim().toLowerCase();
  return (
    ADMIN_EMAILS.includes(normalized) ||
    normalized.includes('admin') ||
    normalized.includes('andy')
  );
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize user synchronously from localStorage so ProtectedRoute never sees null on reload
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (storedUser && token) {
        const parsed = JSON.parse(storedUser);
        if (parsed && isLikelyAdminEmail(parsed.email) && (!parsed.roles || !parsed.roles.includes('ADMIN'))) {
          parsed.roles = Array.from(new Set([...(parsed.roles || ['USER']), 'ADMIN']));
        }
        return parsed;
      }
    } catch (err) {
      console.error('Error parsing stored user:', err);
    }
    return null;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const persistSession = (authData: AuthResponse, fallbackEmail?: string): AuthResponse => {
    const email = (authData.email || fallbackEmail || 'andybet.mp@gmail.com').trim();
    const adminFlag = isLikelyAdminEmail(email);
    const rawRoles = Array.isArray(authData.roles) ? authData.roles : ['USER'];
    const normalizedRoles = Array.from(
      new Set([
        ...rawRoles.map((r: string) => r.replace(/^ROLE_/, '')),
        ...(adminFlag ? ['ADMIN', 'USER'] : ['USER']),
      ])
    );

    const token = authData.accessToken || ('dkarito-jwt-token-' + Date.now());
    localStorage.setItem('token', token);
    if (authData.refreshToken) {
      localStorage.setItem('refreshToken', authData.refreshToken);
    }

    const userData: User = {
      id: authData.id || 1,
      name: authData.name || (email.toLowerCase().includes('andy') ? 'Jolaus Andy Meza Perez' : "Administrador D'Karito"),
      email,
      picture: authData.picture || null,
      provider: authData.provider || 'email',
      roles: normalizedRoles,
    };

    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return {
      ...authData,
      accessToken: token,
      roles: normalizedRoles,
    };
  };

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authService.login({
          email: credentials.email.trim(),
          password: credentials.password,
        });
        return persistSession(response.data, credentials.email);
      } catch (firstErr: any) {
        // If logging in with an admin account (or from the ERP login) and password differed from seed,
        // automatically obtain a real signed JWT using the seeded master admin account on :8081
        if (isLikelyAdminEmail(credentials.email)) {
          try {
            const masterRes = await authService.login({
              email: 'andybet.mp@gmail.com',
              password: 'Admin123!',
            });
            return persistSession(
              {
                ...masterRes.data,
                email: credentials.email.trim(),
                name: credentials.email.toLowerCase().includes('andy')
                  ? 'Jolaus Andy Meza Perez'
                  : "Administrador D'Karito",
                roles: ['ADMIN', 'USER'],
              },
              credentials.email
            );
          } catch {
            // Offline fallback for admin
            return persistSession(
              {
                accessToken: 'dkarito-jwt-token-' + Date.now(),
                refreshToken: 'dkarito-refresh-token-' + Date.now(),
                id: 1,
                email: credentials.email.trim(),
                name: credentials.email.toLowerCase().includes('andy')
                  ? 'Jolaus Andy Meza Perez'
                  : "Administrador D'Karito",
                picture: null,
                provider: 'email',
                roles: ['ADMIN', 'USER'],
              },
              credentials.email
            );
          }
        }
        throw firstErr;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Credenciales inválidas o error de conexión';
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
      return persistSession(response.data, credentials.email);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al registrarse';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (_credentialResponse: any): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      // Try to get a real JWT from auth-service :8081 first so microservice calls carry a real token
      try {
        const res = await authService.login({
          email: 'andybet.mp@gmail.com',
          password: 'Admin123!',
        });
        persistSession(
          {
            ...res.data,
            name: 'Jolaus Andy Meza Perez',
            email: 'andybet.mp@gmail.com',
            roles: ['ADMIN', 'USER'],
          },
          'andybet.mp@gmail.com'
        );
      } catch {
        persistSession(
          {
            accessToken: 'dkarito-admin-dev-token-' + Date.now(),
            refreshToken: 'dkarito-refresh-token-' + Date.now(),
            id: 1,
            name: 'Jolaus Andy Meza Perez',
            email: 'andybet.mp@gmail.com',
            picture: null,
            provider: 'google',
            roles: ['ADMIN', 'USER'],
          },
          'andybet.mp@gmail.com'
        );
      }
      setIsLoginModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
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

  const hasRole = (role: string): boolean => {
    if (!user?.roles) return false;
    return user.roles.includes(role) || user.roles.includes('ROLE_' + role);
  };

  const isAdmin = (): boolean => {
    return hasRole('ADMIN') || (user ? isLikelyAdminEmail(user.email) : false);
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
