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
    paymentMethod?: string;
    totals?: {
      subtotal: number;
      discount: number;
      taxableBase: number;
      tax: number;
      ivaRate: number;
    };
  } | null>(null);

  useEffect(() => {
    const savedOrder = localStorage.getItem('lastOrder');

    if (savedOrder) {
      try {
        const parsed = JSON.parse(savedOrder);
        const fallbackTotals = parsed?.totals ?? {
          subtotal: parsed?.total ?? 0,
          discount: 0,
          taxableBase: parsed?.total ?? 0,
          tax: 0,
          ivaRate: 0.12,
        };
        setOrderData({
          ...parsed,
          totals: fallbackTotals,
        });
      } catch (error) {
        navigate('/catalog');
        return;
      }
      clearCart();
      localStorage.removeItem('lastOrder');
    } else {
      navigate('/catalog');
    }
  }, [clearCart, navigate]);

  if (!orderData) return null;

  const totals = orderData.totals;
  const ivaRate = totals ? Math.round(totals.ivaRate * 100) : 0;

  const timeline = [
    {
      title: 'Pago confirmado',
      description: 'El pago fue procesado y tu orden ya esta registrada en nuestros sistemas.',
    },
    {
      title: 'Preparando el envio',
      description: 'Empacamos tus productos con cuidado y generamos la guia de despacho.',
    },
    {
      title: 'Despacho en camino',
      description: 'Te notificaremos cuando el carrier inicie la ruta hacia tu direccion.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020202] via-[#050505] to-[#1a1a1a] text-white py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-[#111111] border border-white/10 rounded-3xl shadow-2xl p-8 lg:p-12 space-y-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="rounded-full border border-[#daa520] bg-gradient-to-br from-[#b8860b]/20 to-[#daa520]/30 p-5">
              <CheckCircle size={60} className="text-[#daa520]" />
            </div>
            <p className="text-xs uppercase tracking-[0.5em] text-white/60">Orden registrada</p>
            <h1 className="text-4xl font-bold text-white">Gracias por tu compra</h1>
            <p className="text-sm text-white/70 max-w-2xl">
              Ya estamos preparando todo para enviarte tu pedido. Revisa a continuacion los datos
              principales y accede a tu historial en cualquier momento.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">Numero de orden</p>
                <p className="text-2xl font-semibold text-[#daa520]">{orderData.orderNumber}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">Correo</p>
                <p className="text-sm text-white/80">{orderData.email}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">Total</p>
                <p className="text-2xl font-semibold text-white">${orderData.total.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">Productos</p>
                <p className="text-sm text-white/80">
                  {orderData.items} {orderData.items === 1 ? 'producto' : 'productos'}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">Forma de pago</p>
                <p className="text-sm text-white/80">
                  {orderData.paymentMethod === 'transfer'
                    ? 'Transferencia'
                    : orderData.paymentMethod === 'cash'
                      ? 'Pago contra entrega'
                      : 'Tarjeta (simulado)'}
                </p>
              </div>
            </div>
            <div className="bg-[#0b0b0b] border border-white/5 rounded-2xl p-4 text-sm text-white/80">
              Ya te enviamos un correo de confirmacion con los detalles y el numero de seguimiento
              tan pronto este disponible.
            </div>
            {totals && (
              <div className="bg-[#0b0b0b] border border-white/10 rounded-2xl p-4 text-sm text-white/80 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Descuentos</span>
                  <span className="text-green-400">-${totals.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal con descuento</span>
                  <span>${totals.taxableBase.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA ({ivaRate}%)</span>
                  <span>${totals.tax.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {timeline.map((step) => (
              <div key={step.title} className="bg-[#0b0b0b] border border-white/5 rounded-2xl p-5">
                <p className="text-xs uppercase tracking-[0.4em] text-white/40">{step.title}</p>
                <p className="text-sm text-white/70 mt-2">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/orders"
              className="inline-flex items-center justify-center gap-2 bg-[#111111] border border-[#b8860b] px-6 py-3 rounded-full text-sm font-semibold text-white hover:bg-[#b8860b] hover:text-black transition"
            >
              <ShoppingBag size={18} />
              Ver historial de compras
            </Link>
            <Link
              to="/catalog"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/40 text-sm font-semibold text-white/80 hover:border-[#daa520] hover:text-[#daa520] transition"
            >
              Seguir comprando
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-white/60 hover:text-white transition"
            >
              <Home size={16} />
              Volver al inicio
            </Link>
          </div>
        </div>
        <div className="text-center text-xs uppercase tracking-[0.4em] text-white/40">
          Necesitas ayuda? Escribenos a <a href="mailto:info@rondalclothes.com" className="text-[#daa520] hover:underline">info@rondalclothes.com</a> o llama al +593 99 999 9999
        </div>
      </div>
    </div>
  );
}
