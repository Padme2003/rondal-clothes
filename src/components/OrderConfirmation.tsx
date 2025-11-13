import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export default function OrderConfirmation() {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<{
    orderNumber: string;
    email: string;
    total: number;
    items: number;
  } | null>(null);

  useEffect(() => {
    // Get order data from localStorage
    const savedOrder = localStorage.getItem('lastOrder');
    
    if (savedOrder) {
      setOrderData(JSON.parse(savedOrder));
      // Clear the cart
      clearCart();
      // Clear the order from localStorage
      localStorage.removeItem('lastOrder');
    } else {
      // If no order data, redirect to catalog
      navigate('/catalog');
    }
  }, [clearCart, navigate]);

  if (!orderData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="bg-green-100 rounded-full p-4 animate-pulse">
              <CheckCircle size={80} className="text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl mb-4 bg-gradient-to-r from-[#b8860b] via-[#c9a227] to-[#daa520] bg-clip-text text-transparent">
            ¡Pedido Confirmado!
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Gracias por tu compra en Rondal Clothes
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm text-gray-600 mb-1">Número de Orden</p>
                <p className="text-lg bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                  {orderData.orderNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Email de Confirmación</p>
                <p className="text-lg text-gray-700">{orderData.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Pagado</p>
                <p className="text-lg text-gray-700">${orderData.total.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Productos</p>
                <p className="text-lg text-gray-700">{orderData.items} {orderData.items === 1 ? 'producto' : 'productos'}</p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-800">
              📧 Hemos enviado un email de confirmación a <strong>{orderData.email}</strong> con los detalles de tu pedido.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-yellow-800">
              📦 Tu pedido será procesado y enviado en las próximas <strong>24-48 horas</strong>.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-green-800">
              🚚 Tiempo estimado de entrega: <strong>3-5 días hábiles</strong>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/catalog"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#b8860b] to-[#daa520] text-white px-8 py-3 rounded-full hover:shadow-lg hover:shadow-[#b8860b]/50 transition-all"
            >
              <ShoppingBag size={20} />
              Seguir Comprando
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-white border-2 border-[#daa520] text-[#daa520] px-8 py-3 rounded-full hover:bg-[#daa520] hover:text-white transition-all"
            >
              <Home size={20} />
              Volver al Inicio
            </Link>
          </div>

          {/* Thank You Message */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-2">
              ¿Tienes alguna pregunta sobre tu pedido?
            </p>
            <p className="text-sm text-gray-500">
              Contáctanos en: <a href="mailto:info@rondalclothes.com" className="text-[#daa520] hover:underline">info@rondalclothes.com</a> o llama al +593 99 999 9999
            </p>
          </div>
        </div>

        {/* Additional Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            ¡Gracias por confiar en Rondal Clothes! 💛
          </p>
          <p className="text-sm text-gray-500">
            Te invitamos a seguirnos en nuestras redes sociales para estar al tanto de nuevas colecciones y promociones exclusivas.
          </p>
        </div>
      </div>
    </div>
  );
}
