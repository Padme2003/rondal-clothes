import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

export default function Navigation() {
  const { getCartItemsCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const cartCount = getCartItemsCount();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;
  
  // Ocultar navegación en páginas de admin
  const isAdminPage = location.pathname.startsWith('/admin');
  if (isAdminPage) return null;

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-[#b8860b] via-[#c9a227] to-[#daa520] bg-clip-text text-transparent text-2xl">
              <span className="tracking-wider">RONDAL</span>
            </div>
            <span className="text-white text-sm">CLOTHES</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm transition-colors ${
                isActive('/') ? 'text-[#daa520]' : 'text-white hover:text-[#daa520]'
              }`}
            >
              Inicio
            </Link>
            <Link
              to="/catalog"
              className={`text-sm transition-colors ${
                isActive('/catalog') ? 'text-[#daa520]' : 'text-white hover:text-[#daa520]'
              }`}
            >
              Catálogo
            </Link>
            <Link
              to="/cart"
              className={`relative text-sm transition-colors ${
                isActive('/cart') ? 'text-[#daa520]' : 'text-white hover:text-[#daa520]'
              }`}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#b8860b] to-[#daa520] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="bg-gradient-to-r from-[#b8860b] to-[#daa520] text-white px-6 py-2 rounded-full text-sm hover:shadow-lg hover:shadow-[#b8860b]/50 transition-all"
            >
              Checkout
            </button>
            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className={`text-sm transition-colors ${
                    isActive('/login') ? 'text-[#daa520]' : 'text-white hover:text-[#daa520]'
                  }`}
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className={`text-sm transition-colors ${
                    isActive('/register') ? 'text-[#daa520]' : 'text-white hover:text-[#daa520]'
                  }`}
                >
                  Registrarse
                </Link>
              </>
            )}
            {isAuthenticated && (
              <>
                <Link
                  to="/orders"
                  className={`text-sm transition-colors ${
                    isActive('/orders') ? 'text-[#daa520]' : 'text-white hover:text-[#daa520]'
                  }`}
                >
                  Mis compras
                </Link>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-white/80">Hola, {user?.username ?? 'Cliente'}</span>
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="text-sm text-white hover:text-[#daa520]"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 text-sm ${
                isActive('/') ? 'text-[#daa520]' : 'text-white'
              }`}
            >
              Inicio
            </Link>
            <Link
              to="/catalog"
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 text-sm ${
                isActive('/catalog') ? 'text-[#daa520]' : 'text-white'
              }`}
            >
              Catálogo
            </Link>
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 text-sm ${
                isActive('/cart') ? 'text-[#daa520]' : 'text-white'
              }`}
            >
              Carrito {cartCount > 0 && `(${cartCount})`}
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 text-sm ${
                isActive('/admin') ? 'text-[#daa520]' : 'text-white'
              }`}
            >
              Admin
            </Link>
            <Link
              to="/checkout"
              onClick={() => setMobileMenuOpen(false)}
              className="block bg-gradient-to-r from-[#b8860b] to-[#daa520] text-white px-6 py-2 rounded-full text-sm text-center"
            >
              Checkout
            </Link>
            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 text-sm ${
                    isActive('/login') ? 'text-[#daa520]' : 'text-white'
                  }`}
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 text-sm ${
                    isActive('/register') ? 'text-[#daa520]' : 'text-white'
                  }`}
                >
                  Registrarse
                </Link>
              </>
            )}
            {isAuthenticated && (
              <>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 text-sm ${
                    isActive('/orders') ? 'text-[#daa520]' : 'text-white'
                  }`}
                >
                  Mis compras
                </Link>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="block w-full text-left text-sm text-white hover:text-[#daa520] py-2"
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        )}
      </div>
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
            <AlertDialogDescription>
              Saldrás de tu cuenta actual. Podrás volver a iniciar sesión en cualquier momento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-500">
              Cerrar sesión
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  );
}
