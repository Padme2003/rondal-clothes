import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useMemo, useState } from 'react';
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

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotals } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const canCheckout = isAuthenticated && user?.role === 'customer';
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingRemoval, setPendingRemoval] = useState<{ id: number; name: string } | null>(null);
  const handleConfirmRemoval = () => {
    if (!pendingRemoval) return;
    removeFromCart(pendingRemoval.id);
    setPendingRemoval(null);
  };
  const totals = useMemo(() => getCartTotals(), [cart]);
  const shipping = 0;
  const ivaPercent = `${Math.round(totals.ivaRate * 100)}%`;
  const handleDecrease = (id: number, qty: number) => updateQuantity(id, qty);
  const handleIncrease = (id: number, qty: number) => updateQuantity(id, qty);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingBag size={80} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-3xl mb-4 text-gray-700">Tu carrito está vacío</h2>
            <p className="text-gray-600 mb-8">Agrega productos para comenzar tu compra</p>
            <Link
              to="/catalog"
              className="inline-block bg-gradient-to-r from-[#b8860b] to-[#daa520] text-white px-8 py-3 rounded-full hover:shadow-lg hover:shadow-[#b8860b]/50 transition-all"
            >
              Explorar Catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl mb-2 bg-gradient-to-r from-[#b8860b] via-[#c9a227] to-[#daa520] bg-clip-text text-transparent">
              Carrito de Compras
            </h1>
            <p className="text-gray-600">{cart.length} {cart.length === 1 ? 'producto' : 'productos'} en tu carrito</p>
          </div>
          <button
            onClick={clearCart}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
          >
            <Trash2 size={20} />
            Vaciar Carrito
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const unitPrice = item.price * (1 - item.discount / 100);
              const lineTotal = unitPrice * item.quantity;
              const atLimit = item.quantity >= item.stock;
              const remaining = Math.max(0, item.stock - item.quantity);

              return (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500';
                      }}
                    />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <div>
                          <h3 className="text-lg">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.category}</p>
                          <p className="text-xs text-gray-500">Stock disponible: {remaining} / {item.stock}</p>
                        </div>
                        <button
                          onClick={() =>
                            setPendingRemoval({
                              id: item.id,
                              name: item.name,
                            })
                          }
                          className="text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleDecrease(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-[#daa520] hover:text-white transition-colors flex items-center justify-center"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-12 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleIncrease(item.id, item.quantity + 1)}
                            disabled={atLimit}
                            className={`w-8 h-8 rounded-full transition-colors flex items-center justify-center ${
                              atLimit
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-200 hover:bg-[#daa520] hover:text-white'
                            }`}
                            aria-label="Aumentar cantidad"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-lg bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                            ${lineTotal.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${unitPrice.toFixed(2)} c/u
                          </p>
                          {item.discount > 0 && (
                            <p className="text-xs text-green-600">-{item.discount}% aplicado</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
              <h2 className="text-2xl mb-6 bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                Resumen del Pedido
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Descuentos</span>
                  <span className="text-green-700">-${totals.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal con descuento</span>
                  <span>${totals.taxableBase.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>IVA ({ivaPercent})</span>
                  <span>${totals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envio</span>
                  <span className="text-green-600">GRATIS</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl">
                  <span>Total</span>
                  <span className="bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                    ${(totals.total + shipping).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-green-700 text-center">
                  Envio gratis en este pedido!
                </p>
              </div>

            <button
              type="button"
              onClick={() => {
                if (!canCheckout) {
                  setShowAuthModal(true);
                  return;
                }
                navigate('/checkout');
              }}
              className="block w-full bg-gradient-to-r from-[#b8860b] to-[#daa520] text-white text-center py-3 rounded-lg hover:shadow-lg hover:shadow-[#b8860b]/50 transition-all mb-3"
            >
              Proceder al Checkout
            </button>

            {!canCheckout && (
              <p className="text-xs text-gray-500 text-center mb-3">
                Debes iniciar sesión o registrarte antes de pagar.
              </p>
            )}

            {showAuthModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
                <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    ¿Quieres iniciar sesión?
                  </h3>
                  <p className="text-sm text-gray-600">
                    Para continuar con tu compra necesitamos que tengas una cuenta. Puedes iniciar sesión o registrarte ahora.
                  </p>
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/login"
                      state={{ from: '/checkout', message: 'Inicia sesión para finalizar tu pedido' }}
                      onClick={() => setShowAuthModal(false)}
                      className="w-full text-center rounded-2xl bg-gradient-to-r from-[#b8860b] to-[#daa520] py-3 text-white font-semibold transition hover:opacity-95"
                    >
                      Iniciar sesión
                    </Link>
                    <Link
                      to="/register"
                      state={{ from: '/checkout' }}
                      onClick={() => setShowAuthModal(false)}
                      className="w-full text-center rounded-2xl border border-gray-300 py-3 text-gray-800 hover:border-[#daa520] hover:text-[#daa520] transition"
                    >
                      Crear cuenta
                    </Link>
                    <button
                      type="button"
                      onClick={() => setShowAuthModal(false)}
                      className="w-full text-center rounded-2xl py-3 text-sm font-medium text-[#b8860b] hover:text-[#daa520] transition"
                    >
                      No, volver al carrito
                    </button>
                  </div>
                </div>
              </div>
            )}

              <Link
                to="/catalog"
                className="block w-full text-center text-gray-600 hover:text-[#daa520] transition-colors"
              >
                Continuar Comprando
              </Link>
              <AlertDialog
                open={Boolean(pendingRemoval)}
                onOpenChange={(open) => {
                  if (!open) {
                    setPendingRemoval(null);
                  }
                }}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      ¿Eliminar{' '}
                      <span className="font-semibold">
                        {pendingRemoval?.name || 'este producto'}
                      </span>{' '}
                      del carrito?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción eliminará el producto del carrito, pero puedes volver a agregarlo
                      cuando quieras.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="mt-2">
                    <AlertDialogCancel onClick={() => setPendingRemoval(null)}>
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleConfirmRemoval}
                      className="bg-red-600 hover:bg-red-500"
                    >
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




