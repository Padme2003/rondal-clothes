import { FormEvent, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type LocationState = {
  from?: string;
  message?: string;
};

export default function CustomerLogin() {
  const { user, isAuthenticated, loginCustomer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;
  const destination = state.from || '/';

  const isCustomer = user?.role === 'customer';
  if (isAuthenticated && isCustomer) {
    return <Navigate to={destination} replace />;
  }

  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;

    setError('');
    setIsSubmitting(true);

    const result = await loginCustomer(formData.identifier, formData.password);

    setIsSubmitting(false);

    if (result.success) {
      navigate(state.from || '/checkout', { replace: true });
    } else {
      setError(result.error || 'No se pudo iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#151515] to-[#0b0b0b] px-4 flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6 bg-gradient-to-br from-[#0f0f0f]/80 to-[#1d1d1d]/60 p-8 text-white">
            <div className="flex items-center gap-3 text-sm uppercase tracking-[0.4em] text-[#daa520]">
              <ShieldCheck size={20} />
              Bienvenido
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-semibold mb-2 bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                Inicia sesión en Rondal Clothes
              </h1>
              <p className="text-gray-300 text-lg">
                Para proteger tu pedido necesitamos que ingreses tu cuenta antes de completar el pago.
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-gray-400">
                ¿Nuevo por aquí?{' '}
                <Link to="/register" state={{ from: state.from }} className="text-white hover:text-[#daa520]">
                  Crea tu cuenta
                </Link>{' '}
                y comienza tu viaje.
              </p>
              {state.message && (
                <p className="text-sm text-yellow-300">
                  {state.message}
                </p>
              )}
            </div>
          </div>

          <div className="bg-white p-8 space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Accede con tu cuenta</p>
            </div>
            {error && <p className="text-sm text-center text-red-500">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="identifier" className="text-sm font-medium text-gray-700">
                  Correo electrónico o usuario
                </label>
                <input
                  id="identifier"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  autoComplete="username"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#daa520] focus:ring-0 transition"
                  placeholder="usuario@correo.com"
                />
              </div>

              <div className="space-y-2 relative">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#daa520] focus:ring-0 transition pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#b8860b] to-[#daa520] text-white font-semibold shadow-lg shadow-[#b8860b]/40 transition hover:opacity-95"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Validando...' : 'Iniciar sesión'}
              </button>
            </form>

            <div className="text-center text-sm text-gray-500">
              ¿No puedes acceder a tu cuenta?{' '}
              <Link to="/register" state={{ from: state.from }} className="text-[#b8860b] hover:text-[#daa520]">
                Crear cuenta
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
