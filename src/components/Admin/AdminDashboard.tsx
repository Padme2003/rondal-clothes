import { useEffect, useState } from 'react';
import { Package, ShoppingCart, DollarSign, Users, TrendingUp, LogOut } from 'lucide-react';
import { useProducts } from '../../contexts/ProductContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import ProductManager from './ProductManager';
import OrdersView from './OrdersView';
import ClientsManager from './ClientsManager';
import ReportsView from './ReportsView';
import SessionWarning from './SessionWarning';
import SecurityInfo from './SecurityInfo';
import { Button } from '../ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

type AdminTab = 'overview' | 'products' | 'orders' | 'clients' | 'reports';

interface AdminDashboardProps {
  initialTab?: AdminTab;
}

export default function AdminDashboard({ initialTab }: AdminDashboardProps = {}) {
  const { products } = useProducts();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab ?? 'overview');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab ?? 'overview');
  }, [initialTab]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const getTabFromPath = (pathname: string): AdminTab => {
    if (pathname.startsWith('/admin/clients')) return 'clients';
    if (pathname.startsWith('/admin/reports')) return 'reports';
    if (pathname.startsWith('/admin/products')) return 'products';
    if (pathname.startsWith('/admin/orders')) return 'orders';
    return 'overview';
  };

  useEffect(() => {
    if (!initialTab) {
      setActiveTab(getTabFromPath(location.pathname));
    }
  }, [initialTab, location.pathname]);

  const tabRoutes: Record<AdminTab, string> = {
    overview: '/admin',
    products: '/admin/products',
    orders: '/admin/orders',
    clients: '/admin/clients',
    reports: '/admin/reports',
  };

  const handleTabClick = (tab: AdminTab) => {
    setActiveTab(tab);
    const target = tabRoutes[tab];
    if (location.pathname !== target) {
      navigate(target);
    }
  };

  const normalizeCategory = (category: string) =>
    category?.trim().toLowerCase().replace(/\s+/g, ' ') || 'sin categoría';

  const categoriesCount = products.reduce<Record<string, number>>((acc, product) => {
    const key = normalizeCategory(product.category);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Mock statistics
  const stats = {
    totalProducts: products.length,
    totalOrders: 48,
    totalRevenue: 12547.89,
    totalCustomers: 156
  };

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      <SessionWarning />
      <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl mb-2 bg-gradient-to-r from-[#b8860b] via-[#c9a227] to-[#daa520] bg-clip-text text-transparent">
                Panel de Administración
              </h1>
              <p className="text-gray-300">Gestiona tu tienda Rondal Clothes</p>
              {user && (
                <p className="text-sm text-gray-400 mt-1">
                  Bienvenido, {user.username} • Última sesión: {new Date(user.lastLogin).toLocaleString('es-ES')}
                </p>
              )}
            </div>
            <Button
              onClick={() => setShowLogoutConfirm(true)}
              variant="outline"
              className="bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              <LogOut size={16} className="mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => handleTabClick('overview')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-[#daa520] text-[#daa520]'
                  : 'border-transparent text-gray-600 hover:text-[#daa520]'
              }`}
            >
              Resumen
            </button>
            <button
              onClick={() => handleTabClick('products')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'products'
                  ? 'border-[#daa520] text-[#daa520]'
                  : 'border-transparent text-gray-600 hover:text-[#daa520]'
              }`}
            >
              Productos
            </button>
            <button
              onClick={() => handleTabClick('orders')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'border-[#daa520] text-[#daa520]'
                  : 'border-transparent text-gray-600 hover:text-[#daa520]'
              }`}
            >
              Órdenes
            </button>
            <button
              onClick={() => handleTabClick('clients')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'clients'
                  ? 'border-[#daa520] text-[#daa520]'
                  : 'border-transparent text-gray-600 hover:text-[#daa520]'
              }`}
            >
              Clientes
            </button>
            <button
              onClick={() => handleTabClick('reports')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'reports'
                  ? 'border-[#daa520] text-[#daa520]'
                  : 'border-transparent text-gray-600 hover:text-[#daa520]'
              }`}
            >
              Reportes
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Package className="text-blue-600" size={24} />
                  </div>
                  <TrendingUp className="text-green-500" size={20} />
                </div>
                <p className="text-gray-600 text-sm mb-1">Total Productos</p>
                <p className="text-3xl bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                  {stats.totalProducts}
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <ShoppingCart className="text-purple-600" size={24} />
                  </div>
                  <TrendingUp className="text-green-500" size={20} />
                </div>
                <p className="text-gray-600 text-sm mb-1">Total Órdenes</p>
                <p className="text-3xl bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                  {stats.totalOrders}
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <DollarSign className="text-green-600" size={24} />
                  </div>
                  <TrendingUp className="text-green-500" size={20} />
                </div>
                <p className="text-gray-600 text-sm mb-1">Ingresos Totales</p>
                <p className="text-3xl bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                  ${stats.totalRevenue.toFixed(2)}
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <Users className="text-yellow-600" size={24} />
                  </div>
                  <TrendingUp className="text-green-500" size={20} />
                </div>
                <p className="text-gray-600 text-sm mb-1">Total Clientes</p>
                <p className="text-3xl bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                  {stats.totalCustomers}
                </p>
              </div>
            </div>

            {/* Security Info */}
            <div className="mb-8">
              <SecurityInfo />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Products by Category */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl mb-4 bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                  Productos por Categoría
                </h2>
                <div className="space-y-3">
                  {Object.entries(categoriesCount).map(([key, count]) => {
                    const label = key
                      .split(' ')
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(' ');
                    const percentage = products.length ? (count / products.length) * 100 : 0;
                    return (
                      <div key={key}>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-700">{label}</span>
                          <span className="text-gray-600">{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-[#b8860b] to-[#daa520] h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {products.length === 0 && (
                    <p className="text-sm text-gray-500">Aún no hay productos para agrupar.</p>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl mb-4 bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                  Acciones Rápidas
                </h2>
                <div className="space-y-3">
                  <button
                    onClick={() => handleTabClick('products')}
                    className="w-full bg-gradient-to-r from-[#b8860b] to-[#daa520] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all text-left"
                  >
                    ➕ Agregar Nuevo Producto
                  </button>
                  <button
                    onClick={() => handleTabClick('orders')}
                    className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all text-left"
                  >
                    📦 Ver Todas las Órdenes
                  </button>
                  <button 
                    onClick={() => handleTabClick('clients')}
                    className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all text-left"
                  >
                    👥 Gestionar Clientes
                  </button>
                  <button 
                    onClick={() => handleTabClick('reports')}
                    className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all text-left"
                  >
                    📊 Ver Reportes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && <ProductManager />}

        {/* Orders Tab */}
        {activeTab === 'orders' && <OrdersView />}

        {/* Clients Tab */}
        {activeTab === 'clients' && <ClientsManager />}

        {/* Reports Tab */}
        {activeTab === 'reports' && <ReportsView />}
      </div>
    </div>
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cerrar sesión del panel?</AlertDialogTitle>
            <AlertDialogDescription>
              Se cerrará tu sesión de administrador. Podrás volver a ingresar con tus credenciales.
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
    </>
  );
}
