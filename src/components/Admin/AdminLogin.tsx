import { useState, FormEvent } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, User, Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error al escribir
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.username.trim()) {
      setError('El nombre de usuario es requerido');
      return false;
    }

    if (!formData.password.trim()) {
      setError('La contraseña es requerida');
      return false;
    }

    if (formData.username.length < 3) {
      setError('El nombre de usuario debe tener al menos 3 caracteres');
      return false;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Verificar si está bloqueado por múltiples intentos
    if (isLocked) {
      setError('Demasiados intentos fallidos. Por favor, espera 1 minuto.');
      return;
    }

    // Validar formulario
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(formData.username, formData.password);

      if (result.success) {
        // Login exitoso
        setLoginAttempts(0);
        navigate('/admin', { replace: true });
      } else {
        // Login fallido
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        setError(result.error || 'Error al iniciar sesión');

        // Bloquear después de 5 intentos fallidos
        if (newAttempts >= 5) {
          setIsLocked(true);
          setError('Demasiados intentos fallidos. Cuenta bloqueada temporalmente por 1 minuto.');
          
          // Desbloquear después de 1 minuto
          setTimeout(() => {
            setIsLocked(false);
            setLoginAttempts(0);
            setError('');
          }, 60000);
        }
      }
    } catch (err) {
      setError('Error inesperado. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#b8860b] to-[#daa520] rounded-full mb-4">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-4xl mb-2 bg-gradient-to-r from-[#b8860b] via-[#c9a227] to-[#daa520] bg-clip-text text-transparent">
            Panel de Administración
          </h1>
          <p className="text-gray-400">
            Rondal Clothes - Acceso Restringido
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Información de credenciales para el proyecto académico */}
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-sm">
                <strong>Credenciales de prueba:</strong><br />
                Usuario: <code className="bg-blue-100 px-1 rounded">admin</code><br />
                Contraseña: <code className="bg-blue-100 px-1 rounded">RondalClothes2024!</code>
              </AlertDescription>
            </Alert>

            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Ingresa tu usuario"
                  className="pl-10"
                  disabled={isSubmitting || isLocked}
                  autoComplete="username"
                  maxLength={50}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Ingresa tu contraseña"
                  className="pl-10 pr-10"
                  disabled={isSubmitting || isLocked}
                  autoComplete="current-password"
                  maxLength={100}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isSubmitting || isLocked}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Login Attempts Warning */}
            {loginAttempts > 0 && loginAttempts < 5 && (
              <p className="text-sm text-amber-600">
                Intento {loginAttempts} de 5. {5 - loginAttempts} intentos restantes.
              </p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || isLocked}
              className="w-full bg-gradient-to-r from-[#b8860b] to-[#daa520] hover:from-[#c9a227] hover:to-[#daa520] text-white py-6"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Iniciando sesión...
                </>
              ) : isLocked ? (
                'Cuenta Bloqueada'
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-start space-x-2 text-sm text-gray-600">
              <ShieldCheck size={16} className="mt-0.5 flex-shrink-0 text-[#daa520]" />
              <p>
                Esta es una zona de acceso restringido. Todas las actividades son monitoreadas.
                Proyecto académico del Instituto Yavirac.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-6">
          © 2024 Rondal Clothes. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
