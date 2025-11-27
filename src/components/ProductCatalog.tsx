import { useState, useEffect } from 'react';
import { Search, Filter, X, Heart, Eye } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useProducts, Product } from '../contexts/ProductContext';

export default function ProductCatalog() {
  const { products } = useProducts();
  const { cart, addToCart } = useCart();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  const [addedToCart, setAddedToCart] = useState<number | null>(null);

  const categories = ['Todas', ...Array.from(new Set(products.map((p) => p.category)))];

  useEffect(() => {
    let result = [...products];

    // Búsqueda por nombre
    if (searchTerm) {
      result = result.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Filtro por categoría
    if (selectedCategory !== 'Todas') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Ordenamiento - usar el precio FINAL con descuento aplicado
    switch (sortBy) {
      case 'price-asc':
        result = result.sort((a, b) => {
          const priceA = Number(a.price) * (1 - a.discount / 100);
          const priceB = Number(b.price) * (1 - b.discount / 100);
          return priceA - priceB;
        });
        break;
      case 'price-desc':
        result = result.sort((a, b) => {
          const priceA = Number(a.price) * (1 - a.discount / 100);
          const priceB = Number(b.price) * (1 - b.discount / 100);
          return priceB - priceA;
        });
        break;
      case 'name':
        result = result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Sin ordenamiento, mantener orden original
        break;
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, sortBy, products]);

  const getInCartQuantity = (productId: number) =>
    cart.find((item) => item.id === productId)?.quantity ?? 0;

  const handleAddToCart = (product: Product) => {
    const currentQty = getInCartQuantity(product.id);
    if (currentQty >= product.stock) {
      setAddedToCart(product.id);
      setTimeout(() => setAddedToCart(null), 1600);
      return;
    }
    addToCart(product);
    setAddedToCart(product.id);
    setTimeout(() => setAddedToCart(null), 1600);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Todas');
    setSortBy('default');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl mb-2 bg-gradient-to-r from-[#b8860b] via-[#c9a227] to-[#daa520] bg-clip-text text-transparent">
            Catálogo de Productos
          </h1>
          <p className="text-gray-600">Descubre nuestra colección completa</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#daa520]"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#daa520]"
            >
              <option value="default">Ordenar por</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="name">Nombre (A-Z)</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#b8860b] to-[#daa520] text-white rounded-lg hover:shadow-lg transition-all"
            >
              <Filter size={20} />
              Filtros
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-gray-600">Categorías:</span>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-1 rounded-full text-sm transition-all ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-[#b8860b] to-[#daa520] text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              {(searchTerm || selectedCategory !== 'Todas' || sortBy !== 'default') && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#daa520] transition-colors"
                >
                  <X size={16} />
                  Limpiar filtros
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mb-6 text-gray-600">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const hasDiscount = product.discount > 0;
              const discountedPrice = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;
              const displayPrice = Math.max(0, discountedPrice);
              const originalPrice = hasDiscount ? product.oldPrice ?? product.price : product.oldPrice;
              const itemsInCart = getInCartQuantity(product.id);
              const available = Math.max(0, product.stock - itemsInCart);
              const outOfStock = product.stock <= 0;
              const atLimit = available === 0;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.src =
                          'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500';
                      }}
                    />
                    {product.discount > 0 && (
                      <span className="absolute top-2 right-2 bg-gradient-to-r from-[#b8860b] to-[#daa520] text-white px-3 py-1 rounded-full text-sm">
                        -{product.discount}%
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button className="bg-white p-3 rounded-full hover:bg-[#daa520] hover:text-white transition-colors">
                        <Eye size={20} />
                      </button>
                      <button className="bg-white p-3 rounded-full hover:bg-[#daa520] hover:text-white transition-colors">
                        <Heart size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <span className="text-sm text-[#daa520]">{product.category}</span>
                    <h3 className="text-lg mt-1 mb-2 line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                        ${displayPrice.toFixed(2)}
                      </span>
                      {originalPrice && (
                        <span className="text-sm text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <p className={`text-xs mb-3 ${available === 0 ? 'text-red-600' : 'text-gray-600'}`}>
                      Stock disponible: {available} {available === 1 ? 'unidad' : 'unidades'}
                    </p>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={outOfStock || atLimit}
                      className={`w-full px-4 py-2 rounded-lg transition-all ${
                        outOfStock || atLimit
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : addedToCart === product.id
                            ? 'bg-green-500 text-white'
                            : 'bg-gradient-to-r from-[#b8860b] to-[#daa520] text-white hover:shadow-lg'
                      }`}
                    >
                      {outOfStock
                        ? 'Sin stock'
                        : atLimit
                          ? 'Stock máximo en carrito'
                          : addedToCart === product.id
                            ? '✓ Agregado'
                            : 'Agregar al Carrito'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 text-xl mb-4">No se encontraron productos</p>
            <button
              onClick={clearFilters}
              className="bg-gradient-to-r from-[#b8860b] to-[#daa520] text-white px-6 py-2 rounded-full hover:shadow-lg transition-all"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
