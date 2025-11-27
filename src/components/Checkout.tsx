import { useState, FormEvent, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';
import { ShoppingBag, Lock, CheckCircle } from 'lucide-react';

type PaymentMethod = 'transfer' | 'cash' | 'card';

export default function Checkout() {
  const { cart, getCartTotals, clearCart } = useCart();
  const { adjustStock } = useProducts();
  const navigate = useNavigate();
  const { isAuthenticated, user, recordOrder } = useAuth();
  const customerLoggedIn = isAuthenticated && user?.role === 'customer';

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transfer');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successModalData, setSuccessModalData] = useState<{
    orderNumber: string;
    total: number;
    items: number;
    paymentMethod: PaymentMethod;
  } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const totals = useMemo(() => getCartTotals(), [cart]);
  const shipping = 0;
  const totalWithShipping = totals.total + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Nombre completo es requerido';
    if (!formData.email.trim()) {
      newErrors.email = 'Email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email no es v�lido';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Tel�fono es requerido';
    if (!formData.address.trim()) newErrors.address = 'Direcci�n es requerida';
    if (!formData.city.trim()) newErrors.city = 'Ciudad es requerida';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'C�digo postal es requerido';

    if (paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'N�mero de tarjeta es requerido';
      } else if (formData.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'N�mero de tarjeta debe tener 16 d�gitos';
      }
      if (!formData.cardName.trim()) newErrors.cardName = 'Nombre en tarjeta es requerido';
      if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Fecha de expiraci�n es requerida';
      if (!formData.cvv.trim()) {
        newErrors.cvv = 'CVV es requerido';
      } else if (formData.cvv.length < 3) {
        newErrors.cvv = 'CVV debe tener al menos 3 d�gitos';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const orderNumber = `RC-${Date.now().toString().slice(-8)}`;
    const itemsCount = cart.reduce((count, item) => count + item.quantity, 0);
    const lines = cart.map((item) => {
      const unitPrice = item.price;
      const finalUnit = unitPrice * (1 - item.discount / 100);
      const lineTotal = finalUnit * item.quantity;
      return {
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        unitPrice,
        discount: item.discount,
        lineTotal,
      };
    });

    const orderSummary = {
      orderNumber,
      email: formData.email,
      total: totalWithShipping,
      items: itemsCount,
      shippingAddress: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      paymentMethod,
      lines,
      totals: { ...totals, total: totalWithShipping },
    };

    localStorage.setItem('lastOrder', JSON.stringify(orderSummary));
    recordOrder(orderSummary);
    adjustStock(cart.map(({ id, quantity }) => ({ id, quantity })));
    clearCart();
    setSuccessModalData({ orderNumber, total: totalWithShipping, items: itemsCount, paymentMethod });
    setShowSuccessModal(true);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const goToOrderConfirmation = () => {
    closeSuccessModal();
    navigate('/order-confirmation');
  };

  const continueShopping = () => {
    closeSuccessModal();
    navigate('/catalog');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingBag size={80} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-3xl mb-4 text-gray-700">Tu carrito est� vac�o</h2>
            <p className="text-gray-600 mb-8">Agrega productos antes de proceder al checkout</p>
            <Link
              to="/catalog"
              className="inline-block bg-gradient-to-r from-[#b8860b] to-[#daa520] text-white px-8 py-3 rounded-full hover:shadow-lg hover:shadow-[#b8860b]/50 transition-all"
            >
              Explorar Cat�logo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!customerLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 flex items-center justify-center">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-10 text-center space-y-6">
          <Lock className="mx-auto text-[#daa520] h-16 w-16" />
          <h2 className="text-3xl font-semibold text-gray-800">Necesitas iniciar sesi�n para pagar</h2>
          <p className="text-gray-500">
            Por tu seguridad y para guardar el pedido, solo puedes procesar compras con una cuenta activa.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/login"
              state={{ from: '/checkout', message: 'Inicia sesi�n para finalizar tu pedido' }}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#b8860b] to-[#daa520] text-white shadow-lg shadow-[#b8860b]/40"
            >
              Iniciar sesi�n
            </Link>
            <Link
              to="/register"
              state={{ from: '/checkout' }}
              className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 hover:border-[#daa520] hover:text-[#daa520]"
            >
              Crear cuenta
            </Link>
          </div>
          <Link to="/cart" className="text-sm text-gray-500 hover:text-gray-700 underline">
            Volver al carrito
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl mb-2 bg-gradient-to-r from-[#b8860b] via-[#c9a227] to-[#daa520] bg-clip-text text-transparent">
            Finalizar Compra
          </h1>
          <p className="text-gray-600">Completa tu informaci�n para procesar el pedido</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl mb-6 bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                  Informaci�n Personal
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-2 text-gray-700">Nombre Completo *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#daa520] ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Juan P�rez"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#daa520] ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="juan@ejemplo.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Tel�fono *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#daa520] ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+593 99 999 9999"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl mb-6 bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                  Direcci�n de Env�o
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-2 text-gray-700">Direcci�n *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#daa520] ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Av. Principal 123 y Calle Secundaria"
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Ciudad *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#daa520] ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Quito"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">C�digo Postal *</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#daa520] ${
                        errors.postalCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="170150"
                    />
                    {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                    Forma de pago
                  </h2>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Lock size={16} className="text-green-600" />
                    <span>Operaci�n segura y sin cobro inmediato</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Por ahora no procesamos cobros en l�nea. Elige transferencia o pago contra entrega y te enviaremos las
                  instrucciones para confirmar tu pedido.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('transfer')}
                    className={`rounded-lg border px-4 py-3 text-left transition ${
                      paymentMethod === 'transfer'
                        ? 'border-[#daa520] bg-[#fff7e0] text-[#b8860b]'
                        : 'border-gray-200 text-gray-700 hover:border-[#daa520]'
                    }`}
                  >
                    <p className="font-semibold">Transferencia</p>
                    <p className="text-xs text-gray-500">Te mostramos los datos bancarios al confirmar.</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`rounded-lg border px-4 py-3 text-left transition ${
                      paymentMethod === 'cash'
                        ? 'border-[#daa520] bg-[#fff7e0] text-[#b8860b]'
                        : 'border-gray-200 text-gray-700 hover:border-[#daa520]'
                    }`}
                  >
                    <p className="font-semibold">Pago contra entrega</p>
                    <p className="text-xs text-gray-500">Cancela al recibir tu paquete.</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`rounded-lg border px-4 py-3 text-left transition ${
                      paymentMethod === 'card'
                        ? 'border-[#daa520] bg-[#fff7e0] text-[#b8860b]'
                        : 'border-gray-200 text-gray-700 hover:border-[#daa520]'
                    }`}
                  >
                    <p className="font-semibold">Tarjeta (simulado)</p>
                    <p className="text-xs text-gray-500">Capturamos datos pero no cobramos en l�nea.</p>
                  </button>
                </div>

                {paymentMethod === 'card' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-2 text-gray-700">N�mero de Tarjeta *</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#daa520] ${
                          errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                      {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-2 text-gray-700">Nombre en la Tarjeta *</label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#daa520] ${
                          errors.cardName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="JUAN PEREZ"
                      />
                      {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm mb-2 text-gray-700">Fecha de Expiraci�n *</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#daa520] ${
                          errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="MM/AA"
                        maxLength={5}
                      />
                      {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                    </div>
                    <div>
                      <label className="block text-sm mb-2 text-gray-700">CVV *</label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#daa520] ${
                          errors.cvv ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="123"
                        maxLength={4}
                      />
                      {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                    </div>
                  </div>
                )}
                {paymentMethod !== 'card' && (
                  <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-700">
                    Te enviaremos las instrucciones para {paymentMethod === 'transfer' ? 'transferencia' : 'pago contra entrega'} junto con tu comprobante electr�nico.
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                <h2 className="text-2xl mb-6 bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                  Resumen del Pedido
                </h2>

                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item) => {
                    const lineTotal = item.price * (1 - item.discount / 100) * item.quantity;
                    return (
                      <div key={item.id} className="flex gap-3 pb-3 border-b">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500';
                        }}
                      />
                        <div className="flex-1">
                          <p className="text-sm line-clamp-1">{item.name}</p>
                          <p className="text-xs text-gray-600">Cantidad: {item.quantity}</p>
                          <p className="text-sm text-[#daa520]">${lineTotal.toFixed(2)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

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
                    <span>IVA ({Math.round(totals.ivaRate * 100)}%)</span>
                    <span>${totals.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Env�o</span>
                    <span className="text-green-600">GRATIS</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-xl">
                    <span>Total</span>
                    <span className="bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                      ${totalWithShipping.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 flex items-center gap-2">
                  <Lock size={16} className="text-green-600" />
                  <p className="text-sm text-green-700">Tu pedido se registrar� con factura electr�nica.</p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#b8860b] to-[#daa520] text-white px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-[#b8860b]/50 transition-all"
                >
                  Confirmar Compra
                </button>

                <Link to="/cart" className="block w-full text-center text-gray-600 hover:text-[#daa520] transition-colors mt-3">
                  Volver al Carrito
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
      {showSuccessModal && successModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-6 border border-white/30">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="rounded-full border border-[#daa520] bg-[#fff7e0] p-5">
                <CheckCircle size={40} className="text-[#b8860b]" />
              </div>
              <p className="text-sm uppercase tracking-[0.4em] text-[#b8860b]">Compra registrada</p>
              <h3 className="text-2xl font-semibold text-gray-800">�Tu pedido est� en camino!</h3>
              <p className="text-sm text-gray-500">
                {successModalData.items} {successModalData.items === 1 ? 'producto' : 'productos'} por ${successModalData.total.toFixed(2)}.
              </p>
              <p className="text-xs text-gray-500">
                Forma de pago: {successModalData.paymentMethod === 'transfer' ? 'Transferencia' : successModalData.paymentMethod === 'cash' ? 'Pago contra entrega' : 'Tarjeta (simulado)'}
              </p>
            </div>
            <div className="space-y-1 text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-gray-400">N�mero de orden</p>
              <p className="text-lg font-bold text-[#b8860b]">{successModalData.orderNumber}</p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={goToOrderConfirmation}
                className="w-full bg-gradient-to-r from-[#b8860b] to-[#daa520] text-white px-4 py-3 rounded-2xl text-sm font-semibold hover:opacity-95 transition"
              >
                Ver detalles del pedido
              </button>
              <button
                type="button"
                onClick={continueShopping}
                className="w-full border border-gray-200 px-4 py-3 rounded-2xl text-sm font-semibold text-gray-700 hover:border-[#daa520] hover:text-[#b8860b] transition"
              >
                Seguir comprando
              </button>
              <button
                type="button"
                onClick={closeSuccessModal}
                className="w-full text-xs text-gray-500 hover:text-gray-700 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
