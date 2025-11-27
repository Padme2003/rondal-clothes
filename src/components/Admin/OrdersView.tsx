import { useState } from 'react';
import { Package, Eye, X, MapPin, Phone, Mail, Calendar, CreditCard, Truck, FileText, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  customerName: string;
  email: string;
  phone?: string;
  address?: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  items: number;
  products?: OrderItem[];
  paymentMethod?: string;
  trackingNumber?: string;
}

export default function OrdersView() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Mock orders data con productos
  const [orders] = useState<Order[]>([
    {
      id: 'RC-12345678',
      customerName: 'María González',
      email: 'maria@ejemplo.com',
      phone: '+593 99 123 4567',
      address: 'Av. 6 de Diciembre N34-350, Quito, Ecuador',
      date: '2025-10-20',
      status: 'delivered',
      total: 234.97,
      items: 3,
      paymentMethod: 'Tarjeta de Crédito',
      trackingNumber: 'TRK-2025-001',
      products: [
        {
          id: 1,
          name: 'Camisa Formal Ejecutiva',
          price: 89.99,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400'
        },
        {
          id: 2,
          name: 'Pantalón de Vestir',
          price: 79.99,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400'
        },
        {
          id: 3,
          name: 'Cinturón de Cuero',
          price: 64.99,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1624222247344-550fb60583bd?w=400'
        }
      ]
    },
    {
      id: 'RC-12345677',
      customerName: 'Carlos Pérez',
      email: 'carlos@ejemplo.com',
      phone: '+593 98 765 4321',
      address: 'Calle 9 de Octubre 100, Guayaquil, Ecuador',
      date: '2025-10-21',
      status: 'shipped',
      total: 125.99,
      items: 1,
      paymentMethod: 'Transferencia Bancaria',
      trackingNumber: 'TRK-2025-002',
      products: [
        {
          id: 4,
          name: 'Chaqueta Premium',
          price: 125.99,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'
        }
      ]
    },
    {
      id: 'RC-12345676',
      customerName: 'Ana Rodríguez',
      email: 'ana@ejemplo.com',
      phone: '+593 99 888 7777',
      address: 'Av. 3 de Noviembre 567, Cuenca, Ecuador',
      date: '2025-10-22',
      status: 'processing',
      total: 456.45,
      items: 5,
      paymentMethod: 'Tarjeta de Débito',
      products: [
        {
          id: 5,
          name: 'Camisa Casual',
          price: 59.99,
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400'
        },
        {
          id: 6,
          name: 'Jeans Slim Fit',
          price: 89.99,
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'
        },
        {
          id: 7,
          name: 'Zapatos Formales',
          price: 156.49,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400'
        }
      ]
    },
    {
      id: 'RC-12345675',
      customerName: 'Juan Martínez',
      email: 'juan@ejemplo.com',
      phone: '+593 97 555 6666',
      address: 'Av. Cevallos 234, Ambato, Ecuador',
      date: '2025-10-23',
      status: 'pending',
      total: 89.99,
      items: 2,
      paymentMethod: 'Efectivo contra entrega',
      products: [
        {
          id: 8,
          name: 'Polo Deportivo',
          price: 44.99,
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400'
        }
      ]
    },
    {
      id: 'RC-12345674',
      customerName: 'Laura Sánchez',
      email: 'laura@ejemplo.com',
      phone: '+593 96 444 3333',
      address: 'Calle Bolívar 123, Loja, Ecuador',
      date: '2025-10-23',
      status: 'processing',
      total: 178.50,
      items: 3,
      paymentMethod: 'PayPal',
      products: [
        {
          id: 9,
          name: 'Vestido Elegante',
          price: 119.99,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'
        },
        {
          id: 10,
          name: 'Bolso de Mano',
          price: 58.51,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400'
        }
      ]
    }
  ]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'shipped':
        return 'bg-purple-100 text-purple-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'processing':
        return 'Procesando';
      case 'shipped':
        return 'Enviado';
      case 'delivered':
        return 'Entregado';
      default:
        return status;
    }
  };

  const handleExportAllOrders = () => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(20);
    doc.setTextColor(184, 134, 11);
    doc.text('Rondal Clothes', 105, 15, { align: 'center' });

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Reporte de Órdenes', 105, 25, { align: 'center' });

    // Información de fecha y estadísticas
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const fecha = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(`Generado: ${fecha}`, 14, 35);
    doc.text(`Total de órdenes: ${orders.length}`, 14, 40);
    doc.text(`Ingresos totales: $${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}`, 14, 45);

    // Tabla de órdenes
    const tableData = orders.map(order => [
      order.id,
      order.customerName,
      order.email,
      new Date(order.date).toLocaleDateString('es-ES'),
      order.items.toString(),
      `$${order.total.toFixed(2)}`,
      getStatusText(order.status),
      order.paymentMethod || 'N/A'
    ]);

    autoTable(doc, {
      startY: 50,
      head: [['N° Orden', 'Cliente', 'Email', 'Fecha', 'Items', 'Total', 'Estado', 'Pago']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [184, 134, 11],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 8
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 28 },
        2: { cellWidth: 35 },
        3: { cellWidth: 22 },
        4: { cellWidth: 12, halign: 'center' },
        5: { cellWidth: 20, halign: 'right' },
        6: { cellWidth: 20 },
        7: { cellWidth: 28 }
      },
      margin: { left: 14, right: 14 }
    });

    doc.save(`ordenes_rondal_clothes_${new Date().getTime()}.pdf`);

    // Mostrar alerta de éxito
    alert('✅ Reporte de órdenes exportado correctamente');
  };

  const handleExportOrderDetail = (order: Order) => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(20);
    doc.setTextColor(184, 134, 11);
    doc.text('Rondal Clothes', 105, 15, { align: 'center' });

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Detalle de Orden', 105, 25, { align: 'center' });

    // Número de orden
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Orden: ${order.id}`, 105, 35, { align: 'center' });

    // Información del cliente
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Información del Cliente', 14, 45);

    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text(`Nombre: ${order.customerName}`, 14, 52);
    doc.text(`Email: ${order.email}`, 14, 58);
    if (order.phone) doc.text(`Teléfono: ${order.phone}`, 14, 64);
    if (order.address) {
      doc.text('Dirección:', 14, 70);
      const addressLines = doc.splitTextToSize(order.address, 180);
      doc.text(addressLines, 14, 76);
    }

    // Información de la orden
    const infoY = order.address ? 85 : 73;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Información de la Orden', 14, infoY);

    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text(`Fecha: ${new Date(order.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}`, 14, infoY + 7);
    doc.text(`Estado: ${getStatusText(order.status)}`, 14, infoY + 13);
    doc.text(`Método de Pago: ${order.paymentMethod || 'No especificado'}`, 14, infoY + 19);
    if (order.trackingNumber) doc.text(`Seguimiento: ${order.trackingNumber}`, 14, infoY + 25);

    // Tabla de productos
    const productsY = order.trackingNumber ? infoY + 32 : infoY + 26;
    const productData = order.products?.map(product => [
      product.name,
      product.quantity.toString(),
      `$${product.price.toFixed(2)}`,
      `$${(product.price * product.quantity).toFixed(2)}`
    ]) || [];

    autoTable(doc, {
      startY: productsY,
      head: [['Producto', 'Cantidad', 'Precio Unit.', 'Subtotal']],
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
        0: { cellWidth: 90 },
        1: { cellWidth: 30, halign: 'center' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right' }
      },
      margin: { left: 14, right: 14 }
    });

    // Total
    const finalY = (doc as any).lastAutoTable.finalY || productsY + 50;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('TOTAL:', 140, finalY + 10);
    doc.setFontSize(14);
    doc.setTextColor(184, 134, 11);
    doc.text(`$${order.total.toFixed(2)}`, 175, finalY + 10);

    // Pie de página
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Gracias por su compra - Rondal Clothes', 105, 280, { align: 'center' });

    doc.save(`orden_${order.id}_${new Date().getTime()}.pdf`);

    // Mostrar alerta de éxito
    alert('✅ Detalle de orden exportado correctamente');
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-3xl bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
            Gestión de Órdenes
          </h2>
          <p className="text-gray-600">Administra y rastrea todas las órdenes</p>
        </div>
        <button
          onClick={handleExportAllOrders}
          className="flex items-center gap-2 px-4 py-2 border border-[#daa520] text-[#daa520] rounded-lg hover:bg-[#daa520] hover:text-white transition-colors"
        >
          <FileText size={18} />
          Exportar PDF
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600 mb-1">Pendientes</p>
          <p className="text-2xl text-gray-900">
            {orders.filter(o => o.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
          <p className="text-sm text-gray-600 mb-1">Procesando</p>
          <p className="text-2xl text-gray-900">
            {orders.filter(o => o.status === 'processing').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
          <p className="text-sm text-gray-600 mb-1">Enviadas</p>
          <p className="text-2xl text-gray-900">
            {orders.filter(o => o.status === 'shipped').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
          <p className="text-sm text-gray-600 mb-1">Entregadas</p>
          <p className="text-2xl text-gray-900">
            {orders.filter(o => o.status === 'delivered').length}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600">
                  N° Orden
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Package size={16} className="text-gray-400" />
                      <span className="text-gray-900">{order.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-gray-900">{order.customerName}</p>
                      <p className="text-sm text-gray-500">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(order.date).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {order.items} {order.items === 1 ? 'producto' : 'productos'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                      ${order.total.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Ver detalles"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 text-xl">No hay órdenes registradas</p>
        </div>
      )}

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-2xl bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                  Detalles de la Orden
                </h3>
                <p className="text-gray-600 text-sm mt-1">{selectedOrder.id}</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span className={`px-4 py-2 rounded-full text-sm ${getStatusColor(selectedOrder.status)}`}>
                  {getStatusText(selectedOrder.status)}
                </span>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Fecha de Orden</p>
                  <p className="flex items-center gap-2 text-gray-900">
                    <Calendar size={16} />
                    {new Date(selectedOrder.date).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg mb-3">Información del Cliente</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nombre</p>
                    <p className="text-gray-900">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      <p className="text-gray-900">{selectedOrder.email}</p>
                    </div>
                  </div>
                  {selectedOrder.phone && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Teléfono</p>
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-gray-400" />
                        <p className="text-gray-900">{selectedOrder.phone}</p>
                      </div>
                    </div>
                  )}
                  {selectedOrder.address && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Dirección de Entrega</p>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        <p className="text-gray-900 text-sm">{selectedOrder.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment & Tracking */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard size={20} className="text-blue-600" />
                    <h4 className="text-sm text-gray-600">Método de Pago</h4>
                  </div>
                  <p className="text-gray-900">{selectedOrder.paymentMethod || 'No especificado'}</p>
                </div>
                {selectedOrder.trackingNumber && (
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck size={20} className="text-purple-600" />
                      <h4 className="text-sm text-gray-600">Número de Seguimiento</h4>
                    </div>
                    <p className="text-gray-900 font-mono">{selectedOrder.trackingNumber}</p>
                  </div>
                )}
              </div>

              {/* Products */}
              <div>
                <h4 className="text-lg mb-3">Productos ({selectedOrder.items})</h4>
                <div className="space-y-3">
                  {selectedOrder.products?.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">
                          Cantidad: {product.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Precio unitario</p>
                        <p className="text-gray-900">${product.price.toFixed(2)}</p>
                        <p className="text-sm bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                          Subtotal: ${(product.price * product.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">Total de productos:</p>
                    <p className="text-sm text-gray-500">
                      {selectedOrder.items} {selectedOrder.items === 1 ? 'producto' : 'productos'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 mb-1">Total a Pagar</p>
                    <p className="text-3xl bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                      ${selectedOrder.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 border-t pt-4">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => handleExportOrderDetail(selectedOrder)}
                  className="flex-1 bg-gradient-to-r from-[#b8860b] to-[#daa520] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Download size={18} />
                  Exportar PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}