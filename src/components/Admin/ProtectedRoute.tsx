import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, checkSession } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la sesión
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 mx-auto text-[#daa520] mb-4" />
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Verificar si la sesión sigue siendo válida
  if (isAuthenticated && !checkSession()) {
    // Sesión expirada
    return (
      <Navigate
        to="/admin/login"
        state={{ from: location, message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.' }}
        replace
      />
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Usuario autenticado, mostrar contenido
  return <>{children}</>;
}
