import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type StoredOrder = {
  orderNumber: string;
  items: number;
  total: number;
  email: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  createdAt: string;
  paymentMethod?: string;
  totals?: {
    subtotal: number;
    discount: number;
    taxableBase: number;
    tax: number;
    ivaRate: number;
  };
  lines?: {
    id: number;
    name: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    lineTotal: number;
  }[];
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleString('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

export default function CustomerOrders() {
  const { isAuthenticated, user } = useAuth();
  const [invoiceOrder, setInvoiceOrder] = useState<StoredOrder | null>(null);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: '/orders', message: 'Inicia sesión para ver tus compras' }} />;
  }

  const orders: StoredOrder[] = [...((user?.orders as StoredOrder[] | undefined) ?? [])].reverse();

  const renderPaymentMethod = (method?: string) => {
    if (method === 'transfer') return 'Transferencia';
    if (method === 'cash') return 'Pago contra entrega';
    if (method === 'paypal') return 'PayPal (simulado)';
    return 'Tarjeta (simulado)';
  };

  const handleExportInvoicePDF = (order: StoredOrder) => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(20);
    doc.setTextColor(184, 134, 11);
    doc.text('Rondal Clothes', 105, 15, { align: 'center' });

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Factura Electrónica', 105, 25, { align: 'center' });

    // Número de orden
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Orden: ${order.orderNumber}`, 105, 35, { align: 'center' });

    // Información del cliente
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Información del Cliente', 14, 45);

    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text(`Email: ${order.email}`, 14, 52);
    doc.text(`Dirección: ${order.shippingAddress}`, 14, 58);
    doc.text(`Ciudad: ${order.city}, CP: ${order.postalCode}`, 14, 64);

    // Información de la orden
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Información de la Orden', 14, 73);

    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text(`Fecha: ${formatDate(order.createdAt)}`, 14, 80);
    doc.text(`Método de Pago: ${renderPaymentMethod(order.paymentMethod)}`, 14, 86);
    doc.text(`Cantidad de productos: ${order.items}`, 14, 92);

    // Tabla de productos
    const productData = (order.lines || []).map(line => [
      line.name,
      line.quantity.toString(),
      `$${line.unitPrice.toFixed(2)}`,
      line.discount > 0 ? `${line.discount}%` : '-',
      `$${line.lineTotal.toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 100,
      head: [['Producto', 'Cant.', 'Precio Unit.', 'Desc.', 'Subtotal']],
      body: productData,
      theme: 'striped',
      headStyles: {
        fillColor: [184, 134, 11],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9
      },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 30, halign: 'right' },
        3: { cellWidth: 25, halign: 'center' },
        4: { cellWidth: 35, halign: 'right' }
      },
      margin: { left: 14, right: 14 }
    });

    // Resumen de totales
    const finalY = (doc as any).lastAutoTable.finalY || 150;
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);

    let currentY = finalY + 10;
    doc.text('Subtotal:', 130, currentY);
    doc.text(`$${(order.totals?.subtotal ?? order.total).toFixed(2)}`, 175, currentY, { align: 'right' });

    currentY += 6;
    doc.text('Descuentos:', 130, currentY);
    doc.setTextColor(0, 128, 0);
    doc.text(`-$${(order.totals?.discount ?? 0).toFixed(2)}`, 175, currentY, { align: 'right' });

    currentY += 6;
    doc.setTextColor(80, 80, 80);
    doc.text('Subtotal con descuento:', 130, currentY);
    doc.text(`$${(order.totals?.taxableBase ?? order.total).toFixed(2)}`, 175, currentY, { align: 'right' });

    currentY += 6;
    doc.text(`IVA (${Math.round((order.totals?.ivaRate ?? 0) * 100)}%):`, 130, currentY);
    doc.text(`$${(order.totals?.tax ?? 0).toFixed(2)}`, 175, currentY, { align: 'right' });

    currentY += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('TOTAL:', 130, currentY);
    doc.setFontSize(14);
    doc.setTextColor(184, 134, 11);
    doc.text(`$${order.total.toFixed(2)}`, 175, currentY, { align: 'right' });

    // Pie de página
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Gracias por su compra - Rondal Clothes', 105, 280, { align: 'center' });
    doc.text('Factura electrónica válida', 105, 285, { align: 'center' });

    doc.save(`factura_${order.orderNumber}_${new Date().getTime()}.pdf`);

    // Mostrar alerta de éxito
    alert('✅ Factura descargada correctamente');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-10 space-y-8">
          <div className="text-center space-y-3">
            <p className="text-sm uppercase tracking-[0.4em] text-gray-500">Cuenta</p>
            <h1 className="text-4xl font-semibold text-gray-900">Historial de compras</h1>
            <p className="text-gray-600">
              Todas las compras que hayas realizado desde esta cuenta aparecen aquí. Puedes revisar totales, direcciones y productos asociados.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-3xl bg-gray-50 border border-dashed border-gray-200 p-10 text-center space-y-4">
              <p className="text-lg text-gray-800 font-semibold">Todavía no tienes compras registradas.</p>
              <p className="text-sm text-gray-500">
                Navega por nuestro catálogo y finaliza una compra para comenzar a ver tu historial.
              </p>
              <Link
                to="/catalog"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#b8860b] to-[#daa520] px-6 py-3 text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#b8860b]/50 transition-all"
              >
                Explorar catálogo
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <article key={order.orderNumber} className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200">
                  <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-gray-200">
                    <div>
                      <p className="text-xs uppercase tracking-[0.4em] text-gray-500">Pedido</p>
                      <p className="text-xl font-semibold text-gray-900">{order.orderNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.4em] text-gray-500">Fecha</p>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.4em] text-gray-500">Productos</p>
                      <p className="text-sm text-gray-500">
                        {order.items} {order.items === 1 ? 'producto' : 'productos'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.4em] text-gray-500">Total</p>
                      <p className="text-lg font-semibold text-[#daa520]">${order.total.toFixed(2)}</p>
                    </div>
                    <div className="text-right min-w-[180px]">
                      <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Correo</p>
                      <p className="text-sm text-gray-600">{order.email}</p>
                    </div>
                    <div className="text-right min-w-[220px]">
                      <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Dirección</p>
                      <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                      <p className="text-sm text-gray-600">
                        {order.city}, {order.postalCode}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
                    <p className="text-sm text-gray-600">
                      Forma de pago: <span className="font-semibold text-gray-800">{renderPaymentMethod(order.paymentMethod)}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setInvoiceOrder(order)}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#b8860b] to-[#daa520] px-4 py-2 text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#b8860b]/40 transition-all"
                    >
                      Ver factura electrónica
                    </button>
                  </div>
                </article>
              ))}
              <div className="text-center">
                <Link
                  to="/catalog"
                  className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-6 py-3 text-sm text-gray-700 hover:border-gray-400 hover:text-[#daa520] transition-colors"
                >
                  Seguir comprando
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {invoiceOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-gray-500">Factura electrónica</p>
                <p className="text-lg font-semibold text-gray-900">{invoiceOrder.orderNumber}</p>
              </div>
              <button
                type="button"
                onClick={() => setInvoiceOrder(null)}
                className="text-gray-500 hover:text-gray-800"
                aria-label="Cerrar"
              >
                X
              </button>
            </div>
            <div className="px-6 py-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Cliente</p>
                  <p className="text-sm text-gray-700">{invoiceOrder.email}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Fecha</p>
                  <p className="text-sm text-gray-700">{formatDate(invoiceOrder.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Dirección</p>
                  <p className="text-sm text-gray-700">{invoiceOrder.shippingAddress}</p>
                  <p className="text-sm text-gray-700">
                    {invoiceOrder.city}, {invoiceOrder.postalCode}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Pago</p>
                  <p className="text-sm text-gray-700">{renderPaymentMethod(invoiceOrder.paymentMethod)}</p>
                </div>
              </div>

              <div className="border rounded-2xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 text-xs uppercase tracking-[0.2em] text-gray-500">Detalle</div>
                <div className="divide-y">
                  {(invoiceOrder.lines ?? []).map((line) => (
                    <div key={`${invoiceOrder.orderNumber}-${line.id}`} className="flex items-center justify-between px-4 py-3 text-sm text-gray-700">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{line.name}</p>
                        <p className="text-xs text-gray-500">
                          {line.quantity} x ${line.unitPrice.toFixed(2)} {line.discount > 0 ? `(-${line.discount}%)` : ''}
                        </p>
                      </div>
                      <p className="font-semibold text-[#b8860b]">${line.lineTotal.toFixed(2)}</p>
                    </div>
                  ))}
                  {(invoiceOrder.lines ?? []).length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-500">No hay líneas detalladas para este pedido.</div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-700 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${(invoiceOrder.totals?.subtotal ?? invoiceOrder.total).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Descuentos</span>
                  <span className="text-green-700">-${(invoiceOrder.totals?.discount ?? 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal con descuento</span>
                  <span>${(invoiceOrder.totals?.taxableBase ?? invoiceOrder.total).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    IVA ({Math.round((invoiceOrder.totals?.ivaRate ?? 0) * 100)}%)
                  </span>
                  <span>${(invoiceOrder.totals?.tax ?? 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-[#b8860b]">${invoiceOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-between items-center gap-4">
              <p className="text-xs text-gray-500">Descarga o imprime este comprobante para tus registros.</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleExportInvoicePDF(invoiceOrder)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#b8860b] to-[#daa520] text-white rounded-lg hover:shadow-lg transition-all text-sm font-semibold"
                >
                  <Download size={16} />
                  Descargar PDF
                </button>
                <button
                  type="button"
                  onClick={() => setInvoiceOrder(null)}
                  className="text-sm text-gray-600 font-semibold hover:text-[#daa520] px-4 py-2"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
