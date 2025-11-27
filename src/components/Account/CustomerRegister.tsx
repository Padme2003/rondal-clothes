import { FormEvent, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type LocationState = {
  from?: string;
};

export default function CustomerRegister() {
  const { user, isAuthenticated, registerCustomer, loginCustomer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;
  const destination = state.from || '/checkout';
  const isCustomer = user?.role === 'customer';

  if (isAuthenticated && isCustomer) {
    return <Navigate to={state.from || '/'} replace />;
  }

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const registrationResult = await registerCustomer({
      fullName: formData.fullName,
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });

    if (!registrationResult.success) {
      setError(registrationResult.error || 'No se pudo crear la cuenta');
      setIsSubmitting(false);
      return;
    }

    const loginResult = await loginCustomer(formData.username, formData.password);
    setIsSubmitting(false);

    if (loginResult.success) {
      navigate(destination, { replace: true });
      return;
    }

    setError('Cuenta creada, pero no se pudo iniciar sesión automáticamente');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#161616] to-[#0f0f0f] px-4 flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto">
        <div className="relative w-full overflow-hidden rounded-[40px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6 bg-white/5 p-8 text-white">
            <div className="flex items-center gap-3 text-[#b8860b] uppercase text-xs tracking-[0.3em]">
              <UserPlus size={20} />
              Crea tu cuenta
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-semibold mb-2 bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                Bienvenido a la familia Rondal
              </h1>
              <p className="text-gray-300 text-lg">
                Registra tu cuenta para guardar favoritos, ver pedidos anteriores y mantener tu checkout rápido y seguro.
              </p>
            </div>
            <div className="text-sm text-gray-400">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" state={{ from: state.from }} className="text-white hover:text-[#daa520]">
                Inicia sesión
              </Link>{' '}
              y continúa con tu compra.
            </div>
          </div>

          <div className="bg-white rounded-r-[40px] p-8 space-y-6 lg:rounded-none">
            <div className="text-center">
              <p className="text-sm text-gray-500">Completa tus datos para crear la cuenta</p>
            </div>
            {error && <p className="text-sm text-center text-red-500">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                    Nombre completo
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#daa520] focus:ring-0 transition"
                    placeholder="Ej. María López"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium text-gray-700">
                    Usuario
                  </label>
                  <input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#daa520] focus:ring-0 transition"
                    placeholder="Tu nombre de usuario"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#daa520] focus:ring-0 transition"
                  placeholder="correo@dominio.com"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
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
                    autoComplete="new-password"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#daa520] focus:ring-0 transition pr-12"
                    placeholder="Crea una contraseña segura"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="space-y-2 relative">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirmar contraseña
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#daa520] focus:ring-0 transition pr-12"
                    placeholder="Confirma tu contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#b8860b] to-[#daa520] text-white font-semibold shadow-lg shadow-[#b8860b]/40 transition hover:opacity-95"
              >
                {isSubmitting ? 'Creando cuenta...' : 'Registrar cuenta'}
              </button>
            </form>

            <div className="text-center text-sm text-gray-500">
              Al registrarte aceptas nuestras <span className="text-[#b8860b]">políticas</span> y{' '}
              <span className="text-[#b8860b]">términos</span>.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
