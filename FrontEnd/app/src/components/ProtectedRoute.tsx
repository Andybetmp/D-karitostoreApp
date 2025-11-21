import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
    requireAdmin?: boolean;
}

/**
 * Componente para proteger rutas que requieren autenticación
 * @param children - Componentes hijos a renderizar si está autenticado
 * @param requireAdmin - Si es true, solo usuarios con rol ADMIN pueden acceder
 */
const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
    const { user, isAdmin, openLoginModal } = useAuth();

    // Si no hay usuario, redirigir a home y abrir modal de login
    if (!user) {
        openLoginModal();
        return <Navigate to="/" replace />;
    }

    // Si requiere admin y el usuario no es admin, redirigir a home
    if (requireAdmin && !isAdmin()) {
        console.warn('Access denied: Admin role required');
        return <Navigate to="/" replace />;
    }

    // Usuario autenticado y con permisos correctos
    return <>{children}</>;
};

export default ProtectedRoute;
