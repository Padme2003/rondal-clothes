import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { ProductProvider } from './contexts/ProductContext';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './components/Home';
import ProductCatalog from './components/ProductCatalog';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminLogin from './components/Admin/AdminLogin';
import ProtectedRoute from './components/Admin/ProtectedRoute';
import CustomerLogin from './components/Account/CustomerLogin';
import CustomerOrders from './components/Account/CustomerOrders';
import CustomerRegister from './components/Account/CustomerRegister';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <ErrorBoundary>
              <div className="min-h-screen flex flex-col">
                <Navigation />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/catalog" element={<ProductCatalog />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-confirmation" element={<OrderConfirmation />} />
                    <Route path="/orders" element={<CustomerOrders />} />
                    <Route path="/login" element={<CustomerLogin />} />
                    <Route path="/register" element={<CustomerRegister />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route
                      path="/admin/clients"
                      element={
                        <ProtectedRoute>
                          <AdminDashboard initialTab="clients" />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/reports"
                      element={
                        <ProtectedRoute>
                          <AdminDashboard initialTab="reports" />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/products"
                      element={
                        <ProtectedRoute>
                          <AdminDashboard initialTab="products" />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/orders"
                      element={
                        <ProtectedRoute>
                          <AdminDashboard initialTab="orders" />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </ErrorBoundary>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}
