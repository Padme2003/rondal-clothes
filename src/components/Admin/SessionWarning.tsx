import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AlertCircle, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

const SESSION_WARNING_TIME = 5 * 60 * 1000; // 5 minutos antes de expirar
const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hora

export default function SessionWarning() {
  const { isAuthenticated, checkSession } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      const timestamp = localStorage.getItem('rondal_admin_session_timestamp');
      if (!timestamp) return;

      const sessionAge = Date.now() - parseInt(timestamp, 10);
      const remaining = SESSION_TIMEOUT - sessionAge;

      setTimeRemaining(remaining);

      // Mostrar advertencia si quedan menos de 5 minutos
      if (remaining < SESSION_WARNING_TIME && remaining > 0) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  if (!showWarning || !isAuthenticated) return null;

  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Alert className="bg-amber-50 border-amber-200">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>
              Tu sesión expirará en {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
