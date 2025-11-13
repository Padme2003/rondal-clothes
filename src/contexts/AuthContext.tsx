import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  role: 'admin';
  lastLogin: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkSession: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Credenciales de administrador mock (en producción esto sería en el backend)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'RondalClothes2024!', // Contraseña segura para el proyecto académico
};

// Configuración de sesión
const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hora en milisegundos
const SESSION_KEY = 'rondal_admin_session';
const SESSION_TIMESTAMP_KEY = 'rondal_admin_session_timestamp';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar sesión existente al cargar
  useEffect(() => {
    checkStoredSession();
  }, []);

  // Verificar inactividad cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      if (user && !checkSession()) {
        logout();
      }
    }, 60000); // Revisar cada minuto

    return () => clearInterval(interval);
  }, [user]);

  const checkStoredSession = () => {
    try {
      const storedUser = localStorage.getItem(SESSION_KEY);
      const timestamp = localStorage.getItem(SESSION_TIMESTAMP_KEY);

      if (storedUser && timestamp) {
        const sessionAge = Date.now() - parseInt(timestamp, 10);
        
        // Verificar si la sesión no ha expirado
        if (sessionAge < SESSION_TIMEOUT) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } else {
          // Sesión expirada, limpiar
          clearSession();
        }
      }
    } catch (error) {
      console.error('Error al verificar sesión:', error);
      clearSession();
    } finally {
      setIsLoading(false);
    }
  };

  const checkSession = (): boolean => {
    const timestamp = localStorage.getItem(SESSION_TIMESTAMP_KEY);
    if (!timestamp) return false;

    const sessionAge = Date.now() - parseInt(timestamp, 10);
    return sessionAge < SESSION_TIMEOUT;
  };

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Validaciones de entrada
      if (!username || !password) {
        return { success: false, error: 'Usuario y contraseña son requeridos' };
      }

      // Sanitizar entrada (remover espacios)
      const sanitizedUsername = username.trim();
      const sanitizedPassword = password.trim();

      // Verificar longitud mínima
      if (sanitizedUsername.length < 3) {
        return { success: false, error: 'Usuario inválido' };
      }

      if (sanitizedPassword.length < 6) {
        return { success: false, error: 'Contraseña inválida' };
      }

      // Simular delay de autenticación (más realista)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Verificar credenciales
      if (
        sanitizedUsername === ADMIN_CREDENTIALS.username &&
        sanitizedPassword === ADMIN_CREDENTIALS.password
      ) {
        const newUser: User = {
          id: 'admin-001',
          username: sanitizedUsername,
          role: 'admin',
          lastLogin: new Date(),
        };

        // Guardar sesión
        localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
        localStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
        
        setUser(newUser);
        return { success: true };
      } else {
        // Credenciales incorrectas
        return { success: false, error: 'Usuario o contraseña incorrectos' };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: 'Error al procesar la solicitud' };
    }
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  const clearSession = () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_TIMESTAMP_KEY);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
