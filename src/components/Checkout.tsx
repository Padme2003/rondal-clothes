import { useState, FormEvent, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';
import { ShoppingBag, Lock, CheckCircle } from 'lucide-react';

type PaymentMethod = 'transfer' | 'cash' | 'card' | 'paypal';

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
  const [showCardSimulation, setShowCardSimulation] = useState(false);
  const [showPayPalSimulation, setShowPayPalSimulation] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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
      newErrors.email = 'Email no es válido';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Teléfono es requerido';
    } else if (formData.phone.replace(/\D/g, '').length !== 10) {
      newErrors.phone = 'Teléfono debe tener 10 dígitos';
    }
    if (!formData.address.trim()) newErrors.address = 'Dirección es requerida';
    if (!formData.city.trim()) newErrors.city = 'Ciudad es requerida';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Código postal es requerido';

    if (paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'Número de tarjeta es requerido';
      } else if (formData.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Número de tarjeta debe tener 16 dígitos';
      }
      if (!formData.cardName.trim()) newErrors.cardName = 'Nombre en tarjeta es requerido';
      if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Fecha de expiración es requerida';
      if (!formData.cvv.trim()) {
        newErrors.cvv = 'CVV es requerido';
      } else if (formData.cvv.length < 3) {
        newErrors.cvv = 'CVV debe tener al menos 3 dígitos';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Si es tarjeta o PayPal, mostrar simulación de pago primero
    if (paymentMethod === 'card') {
      setShowCardSimulation(true);
      return;
    }
    if (paymentMethod === 'paypal') {
      setShowPayPalSimulation(true);
      return;
    }

    // Para otros métodos de pago, procesar directamente
    processOrder();
  };

  const processOrder = () => {
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

  const handleCardPayment = () => {
    setIsProcessingPayment(true);
    // Simular procesamiento de pago con tarjeta (2 segundos)
    setTimeout(() => {
      setIsProcessingPayment(false);
      setShowCardSimulation(false);
      processOrder();
    }, 2000);
  };

  const handlePayPalPayment = () => {
    setIsProcessingPayment(true);
    // Simular procesamiento de pago con PayPal (2 segundos)
    setTimeout(() => {
      setIsProcessingPayment(false);
      setShowPayPalSimulation(false);
      processOrder();
    }, 2000);
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
            <h2 className="text-3xl mb-4 text-gray-700">Tu carrito está vacío</h2>
            <p className="text-gray-600 mb-8">Agrega productos antes de proceder al checkout</p>
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

  if (!customerLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 flex items-center justify-center">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-10 text-center space-y-6">
          <Lock className="mx-auto text-[#daa520] h-16 w-16" />
          <h2 className="text-3xl font-semibold text-gray-800">Necesitas iniciar sesión para pagar</h2>
          <p className="text-gray-500">
            Por tu seguridad y para guardar el pedido, solo puedes procesar compras con una cuenta activa.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/login"
              state={{ from: '/checkout', message: 'Inicia sesión para finalizar tu pedido' }}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#b8860b] to-[#daa520] text-white shadow-lg shadow-[#b8860b]/40"
            >
              Iniciar sesión
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
          <p className="text-gray-600">Completa tu información para proceder el pedido</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl mb-6 bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                  Información Personal
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
                      placeholder="Juan Pérez"
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
                    <label className="block text-sm mb-2 text-gray-700">Teléfono *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#daa520] ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0999999999"
                      maxLength={10}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl mb-6 bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                  Dirección de Envío
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-2 text-gray-700">Dirección *</label>
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
                    <label className="block text-sm mb-2 text-gray-700">Código Postal *</label>
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
                    <span>Operación segura y sin cobro inmediato</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Elige tu forma de pago preferida. Para transferencia o pago contra entrega, contáctanos por WhatsApp para coordinar.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
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
                    <p className="text-xs text-gray-500">Datos bancarios al confirmar.</p>
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
                    <p className="font-semibold">Contra entrega</p>
                    <p className="text-xs text-gray-500">Paga al recibir.</p>
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
                    <p className="font-semibold flex items-center gap-1">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" fill="none" strokeWidth="2"/>
                        <path d="M2 10h20" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Tarjeta
                    </p>
                    <p className="text-xs text-gray-500">Simulación de pago.</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`rounded-lg border px-4 py-3 text-left transition ${
                      paymentMethod === 'paypal'
                        ? 'border-[#0070ba] bg-[#e6f3ff] text-[#0070ba]'
                        : 'border-gray-200 text-gray-700 hover:border-[#0070ba]'
                    }`}
                  >
                    <p className="font-semibold flex items-center gap-1">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506L9.95 13.81a.641.641 0 0 1 .633-.74h2.19c2.352 0 4.524-.881 5.991-2.362.81-.818 1.45-1.761 1.898-2.79a9.722 9.722 0 0 0 .56-2.001z"/>
                      </svg>
                      PayPal
                    </p>
                    <p className="text-xs text-gray-500">Pago rápido y seguro.</p>
                  </button>
                </div>

                {paymentMethod === 'card' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-2 text-gray-700">Número de Tarjeta *</label>
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
                      <label className="block text-sm mb-2 text-gray-700">Fecha de Expiración *</label>
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
                {paymentMethod === 'paypal' && (
                  <div className="rounded-lg border border-dashed border-[#0070ba] bg-[#e6f3ff] p-4 space-y-3">
                    <p className="text-sm text-gray-700 flex items-center gap-2">
                      <Lock size={16} className="text-[#0070ba]" />
                      Al confirmar la compra, se abrirá una ventana de simulación de pago con PayPal.
                    </p>
                    <p className="text-xs text-gray-600">
                      Esta es una simulación educativa. No se realizará ningún cargo real a tu cuenta.
                    </p>
                  </div>
                )}
                {(paymentMethod === 'transfer' || paymentMethod === 'cash') && (
                  <div className="rounded-lg border border-dashed border-[#daa520] bg-[#fff7e0] p-4 space-y-3">
                    <p className="text-sm text-gray-700">
                      Para coordinar {paymentMethod === 'transfer' ? 'la transferencia' : 'el pago contra entrega'}, contáctanos por WhatsApp.
                    </p>
                    <a
                      href="https://wa.me/593999999999?text=Hola%2C%20quiero%20coordinar%20mi%20pedido%20con%20forma%20de%20pago%3A%20{paymentMethod === 'transfer' ? 'Transferencia' : 'Pago%20contra%20entrega'}"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-lg hover:bg-[#20BA5A] transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      Contactar por WhatsApp
                    </a>
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
                    <span>Envío</span>
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
                  <p className="text-sm text-green-700">Tu pedido se registrará con factura electrónica.</p>
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
              <h3 className="text-2xl font-semibold text-gray-800">¡Tu pedido está en camino!</h3>
              <p className="text-sm text-gray-500">
                {successModalData.items} {successModalData.items === 1 ? 'producto' : 'productos'} por ${successModalData.total.toFixed(2)}.
              </p>
              <p className="text-xs text-gray-500">
                Forma de pago: {
                  successModalData.paymentMethod === 'transfer' ? 'Transferencia' :
                  successModalData.paymentMethod === 'cash' ? 'Pago contra entrega' :
                  successModalData.paymentMethod === 'paypal' ? 'PayPal (simulado)' :
                  'Tarjeta (simulado)'
                }
              </p>
            </div>
            <div className="space-y-1 text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Número de orden</p>
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

      {/* Card Payment Simulation Modal */}
      {showCardSimulation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-[#b8860b] to-[#daa520] flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="5" width="20" height="14" rx="2" strokeWidth="2"/>
                  <path d="M2 10h20" strokeWidth="2"/>
                  <circle cx="7" cy="15" r="1" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Simulación de Pago con Tarjeta
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Procesando tu pago de forma segura
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tarjeta:</span>
                <span className="font-mono">**** **** **** {formData.cardNumber.slice(-4)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Titular:</span>
                <span>{formData.cardName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Monto a pagar:</span>
                <span className="text-lg font-semibold bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                  ${totalWithShipping.toFixed(2)}
                </span>
              </div>
            </div>

            {isProcessingPayment ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#daa520]"></div>
                <p className="text-sm text-gray-600 mt-4">Procesando pago...</p>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleCardPayment}
                  className="w-full bg-gradient-to-r from-[#b8860b] to-[#daa520] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold"
                >
                  Confirmar Pago
                </button>
                <button
                  onClick={() => setShowCardSimulation(false)}
                  className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            )}

            <p className="text-xs text-center text-gray-500">
              Esta es una simulación educativa. No se realizará ningún cargo real.
            </p>
          </div>
        </div>
      )}

      {/* PayPal Payment Simulation Modal */}
      {showPayPalSimulation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-[#0070ba] flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506L9.95 13.81a.641.641 0 0 1 .633-.74h2.19c2.352 0 4.524-.881 5.991-2.362.81-.818 1.45-1.761 1.898-2.79a9.722 9.722 0 0 0 .56-2.001z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Pagar con PayPal
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                La forma más rápida y segura de pagar
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                <div className="w-10 h-10 rounded-full bg-[#0070ba] flex items-center justify-center text-white font-semibold">
                  {formData.email.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{formData.fullName}</p>
                  <p className="text-xs text-gray-600">{formData.email}</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                <span className="text-sm text-gray-600">Monto a pagar:</span>
                <span className="text-xl font-bold text-[#0070ba]">
                  ${totalWithShipping.toFixed(2)}
                </span>
              </div>
            </div>

            {isProcessingPayment ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#0070ba]"></div>
                <p className="text-sm text-gray-600 mt-4">Conectando con PayPal...</p>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handlePayPalPayment}
                  className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white px-6 py-3 rounded-lg transition-all font-semibold"
                >
                  Continuar con PayPal
                </button>
                <button
                  onClick={() => setShowPayPalSimulation(false)}
                  className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            )}

            <p className="text-xs text-center text-gray-500">
              Esta es una simulación educativa. No se realizará ningún cargo real a tu cuenta PayPal.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
