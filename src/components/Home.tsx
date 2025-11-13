import { Link } from 'react-router-dom';
import { Truck, Shield, RefreshCw, CreditCard, Star, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [currentBanner, setCurrentBanner] = useState(0);

  const banners = [
    {
      title: "Nueva Colección Otoño 2025",
      subtitle: "Descubre las últimas tendencias en moda",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200",
      cta: "Ver Colección"
    },
    {
      title: "Hasta 30% de Descuento",
      subtitle: "En prendas seleccionadas",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
      cta: "Comprar Ahora"
    },
    {
      title: "Envío Gratis",
      subtitle: "En compras superiores a $50",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200",
      cta: "Explorar"
    }
  ];

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const categories = [
    { name: "Camisas", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400", count: "12+ productos" },
    { name: "Pantalones", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400", count: "8+ productos" },
    { name: "Vestidos", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", count: "10+ productos" },
    { name: "Chaquetas", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400", count: "6+ productos" }
  ];

  const testimonials = [
    {
      name: "María González",
      comment: "Excelente calidad y servicio. Las prendas superaron mis expectativas.",
      rating: 5
    },
    {
      name: "Carlos Pérez",
      comment: "Muy satisfecho con mi compra. La entrega fue rápida y el producto perfecto.",
      rating: 5
    },
    {
      name: "Ana Rodríguez",
      comment: "Me encanta la variedad de productos y los precios son muy competitivos.",
      rating: 4
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <div className="relative h-[500px] overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentBanner ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${banner.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white px-4">
                <h1 className="text-5xl md:text-6xl mb-4 bg-gradient-to-r from-[#b8860b] via-[#c9a227] to-[#daa520] bg-clip-text text-transparent">
                  {banner.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-white">
                  {banner.subtitle}
                </p>
                <Link
                  to="/catalog"
                  className="inline-block bg-gradient-to-r from-[#b8860b] to-[#daa520] text-white px-8 py-3 rounded-full hover:shadow-lg hover:shadow-[#b8860b]/50 transition-all"
                >
                  {banner.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {/* Carousel Controls */}
        <button
          onClick={prevBanner}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-[#daa520] transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextBanner}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-[#daa520] transition-colors"
        >
          <ChevronRight size={24} />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentBanner ? 'bg-[#daa520]' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-gradient-to-b from-white to-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-[#b8860b] to-[#daa520] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck size={32} className="text-white" />
              </div>
              <h3 className="mb-2">Envío Gratis</h3>
              <p className="text-sm text-gray-600">En compras superiores a $50</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-[#b8860b] to-[#daa520] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={32} className="text-white" />
              </div>
              <h3 className="mb-2">Compra Segura</h3>
              <p className="text-sm text-gray-600">Protección en cada transacción</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-[#b8860b] to-[#daa520] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw size={32} className="text-white" />
              </div>
              <h3 className="mb-2">Devoluciones</h3>
              <p className="text-sm text-gray-600">30 días para devoluciones</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-[#b8860b] to-[#daa520] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard size={32} className="text-white" />
              </div>
              <h3 className="mb-2">Métodos de Pago</h3>
              <p className="text-sm text-gray-600">Múltiples opciones disponibles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4 bg-gradient-to-r from-[#b8860b] via-[#c9a227] to-[#daa520] bg-clip-text text-transparent">
              Explora Nuestras Categorías
            </h2>
            <p className="text-gray-600">Encuentra el estilo perfecto para ti</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to="/catalog"
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="aspect-square">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-4 text-white w-full">
                    <h3 className="text-xl mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-300">{category.count}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl mb-6 bg-gradient-to-r from-[#b8860b] via-[#c9a227] to-[#daa520] bg-clip-text text-transparent">
                Sobre Rondal Clothes
              </h2>
              <p className="text-gray-600 mb-4">
                Somos una tienda de moda ecuatoriana comprometida con ofrecer prendas de alta calidad 
                que combinan estilo, elegancia y comodidad.
              </p>
              <p className="text-gray-600 mb-6">
                Nuestra misión es hacer que la moda sea accesible para todos, ofreciendo una experiencia 
                de compra en línea excepcional con productos cuidadosamente seleccionados.
              </p>
              <Link
                to="/catalog"
                className="inline-flex items-center bg-gradient-to-r from-[#b8860b] to-[#daa520] text-white px-6 py-3 rounded-full hover:shadow-lg hover:shadow-[#b8860b]/50 transition-all"
              >
                Ver Catálogo <ArrowRight size={20} className="ml-2" />
              </Link>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600"
                alt="Tienda"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4 bg-gradient-to-r from-[#b8860b] via-[#c9a227] to-[#daa520] bg-clip-text text-transparent">
              Lo Que Dicen Nuestros Clientes
            </h2>
            <p className="text-gray-600">Testimonios reales de clientes satisfechos</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < testimonial.rating ? 'text-[#daa520] fill-[#daa520]' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                <p className="text-[#1a1a1a]">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl mb-4 bg-gradient-to-r from-[#b8860b] via-[#c9a227] to-[#daa520] bg-clip-text text-transparent">
            ¿Listo para Renovar tu Guardarropa?
          </h2>
          <p className="text-white mb-8 text-xl">
            Explora nuestra colección y encuentra tu estilo perfecto
          </p>
          <Link
            to="/catalog"
            className="inline-block bg-gradient-to-r from-[#b8860b] to-[#daa520] text-white px-10 py-4 rounded-full hover:shadow-lg hover:shadow-[#b8860b]/50 transition-all text-lg"
          >
            Comenzar a Comprar
          </Link>
        </div>
      </div>
    </div>
  );
}
