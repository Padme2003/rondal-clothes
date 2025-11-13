import { useState } from 'react';
import { Package, ShoppingCart, DollarSign, Users, TrendingUp, LogOut } from 'lucide-react';
import { useProducts } from '../../contexts/ProductContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProductManager from './ProductManager';
import OrdersView from './OrdersView';
import ClientsManager from './ClientsManager';
import ReportsView from './ReportsView';
import SessionWarning from './SessionWarning';
import SecurityInfo from './SecurityInfo';
import { Button } from '../ui/button';

export default function AdminDashboard() {
  const { products } = useProducts();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'clients' | 'reports'>('overview');

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Mock statistics
  const stats = {
    totalProducts: products.length,
    totalOrders: 48,
    totalRevenue: 12547.89,
    totalCustomers: 156
  };

  return (
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
              onClick={handleLogout}
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
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-[#daa520] text-[#daa520]'
                  : 'border-transparent text-gray-600 hover:text-[#daa520]'
              }`}
            >
              Resumen
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'products'
                  ? 'border-[#daa520] text-[#daa520]'
                  : 'border-transparent text-gray-600 hover:text-[#daa520]'
              }`}
            >
              Productos
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'border-[#daa520] text-[#daa520]'
                  : 'border-transparent text-gray-600 hover:text-[#daa520]'
              }`}
            >
              Órdenes
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'clients'
                  ? 'border-[#daa520] text-[#daa520]'
                  : 'border-transparent text-gray-600 hover:text-[#daa520]'
              }`}
            >
              Clientes
            </button>
            <button
              onClick={() => setActiveTab('reports')}
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
                  {Array.from(new Set(products.map(p => p.category))).map(category => {
                    const count = products.filter(p => p.category === category).length;
                    const percentage = (count / products.length) * 100;
                    return (
                      <div key={category}>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-700">{category}</span>
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
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl mb-4 bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                  Acciones Rápidas
                </h2>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('products')}
                    className="w-full bg-gradient-to-r from-[#b8860b] to-[#daa520] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all text-left"
                  >
                    ➕ Agregar Nuevo Producto
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all text-left"
                  >
                    📦 Ver Todas las Órdenes
                  </button>
                  <button 
                    onClick={() => setActiveTab('clients')}
                    className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all text-left"
                  >
                    👥 Gestionar Clientes
                  </button>
                  <button 
                    onClick={() => setActiveTab('reports')}
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
  );
}