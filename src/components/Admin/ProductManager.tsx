import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, AlertTriangle } from 'lucide-react';
import { useProducts, Product } from '../../contexts/ProductContext';
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

interface FormState {
  name: string;
  price: string;
  oldPrice: string;
  discount: string;
  category: string;
  image: string;
  description: string;
  stock: string;
}

const emptyForm: FormState = {
  name: '',
  price: '',
  oldPrice: '',
  discount: '',
  category: '',
  image: '',
  description: '',
  stock: '',
};

export default function ProductManager() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [successMessage, setSuccessMessage] = useState('');
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(''), 2500);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingProduct(null);
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        oldPrice: product.oldPrice?.toString() ?? '',
        discount: product.discount.toString(),
        category: product.category,
        image: product.image,
        description: product.description,
        stock: product.stock.toString(),
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = parseFloat(formData.price);
    const parsedOldPrice = formData.oldPrice ? parseFloat(formData.oldPrice) : null;
    let parsedDiscount = parseFloat(formData.discount || '0') || 0;
    parsedDiscount = Math.min(100, Math.max(0, parsedDiscount));

    // El precio base para calcular el descuento: si hay oldPrice lo usamos, si no usamos el precio ingresado
    const baseForDiscount = parsedOldPrice ?? parsedPrice;
    const finalPrice =
      parsedDiscount > 0
        ? parseFloat((baseForDiscount * (1 - parsedDiscount / 100)).toFixed(2))
        : parsedPrice;
    const finalOldPrice =
      parsedOldPrice ?? (parsedDiscount > 0 ? parsedPrice : null);

    const productData = {
      name: formData.name,
      price: finalPrice,
      oldPrice: finalOldPrice,
      discount: parsedDiscount,
      category: formData.category,
      image: formData.image,
      description: formData.description,
      stock: Math.max(0, parseInt(formData.stock, 10) || 0),
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      setSuccessMessage('Producto actualizado correctamente');
      setSuccessDialogOpen(true);
    } else {
      addProduct(productData);
      setSuccessMessage('Producto creado correctamente');
      setSuccessDialogOpen(true);
    }

    handleCloseModal();
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
            Gestión de Productos
          </h2>
          <p className="text-gray-600">Administra el catálogo de productos</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-[#b8860b] to-[#daa520] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
        >
          <Plus size={20} />
          Nuevo Producto
        </button>
      </div>

      {successMessage && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 shadow">
          {successMessage}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600">Imagen</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600">Nombre</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600">Categoría</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600">Precio</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600">Descuento</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600">Stock</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500';
                      }}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-gray-900">${product.price.toFixed(2)}</p>
                      {product.oldPrice && (
                        <p className="text-sm text-gray-400 line-through">${product.oldPrice.toFixed(2)}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {product.discount > 0 ? (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">-{product.discount}%</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-gray-100 text-gray-800 text-sm">{product.stock}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-2xl bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm mb-2 text-gray-700">Nombre del Producto *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#daa520]"
                    placeholder="Ej: Camisa Formal Ejecutiva"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">Precio *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#daa520]"
                    placeholder="45.99"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">Precio Anterior</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.oldPrice}
                    onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#daa520]"
                    placeholder="65.99"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">Descuento (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#daa520]"
                    placeholder="30"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">Stock disponible *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#daa520]"
                    placeholder="10"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">Categoría *</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#daa520]"
                    placeholder="Ej: Camisas"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm mb-2 text-gray-700">URL de Imagen *</label>
                  <input
                    type="url"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#daa520]"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm mb-2 text-gray-700">Descripción *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#daa520]"
                    placeholder="Descripción detallada del producto..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#b8860b] to-[#daa520] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
                >
                  {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <AlertDialogTitle className="text-xl">¿Eliminar Producto?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base">
              {productToDelete && (
                <div className="space-y-3">
                  <p>Estás a punto de eliminar el producto:</p>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <img src={productToDelete.image} alt={productToDelete.name} className="w-16 h-16 object-cover rounded" />
                      <div>
                        <p className="text-gray-900">{productToDelete.name}</p>
                        <p className="text-sm text-gray-600">{productToDelete.category}</p>
                        <p className="bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                          ${productToDelete.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-red-600">
                    Esta acción no se puede deshacer. El producto será eliminado permanentemente del catálogo.
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Sí, Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¡Listo!</AlertDialogTitle>
            <AlertDialogDescription>
              {successMessage || 'El producto se guardó correctamente.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setSuccessDialogOpen(false)}>Cerrar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
