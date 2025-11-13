import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  
  // Ocultar footer en páginas de admin
  const isAdminPage = location.pathname.startsWith('/admin');
  if (isAdminPage) return null;

  return (
    <footer className="bg-gradient-to-b from-[#1a1a1a] to-[#2d2d2d] text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="bg-gradient-to-r from-[#b8860b] via-[#c9a227] to-[#daa520] bg-clip-text text-transparent text-2xl mb-4">
              RONDAL CLOTHES
            </div>
            <p className="text-gray-400 text-sm">
              Tu tienda de moda en línea. Estilo, calidad y elegancia en cada prenda.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#daa520] mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-[#daa520] transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-gray-400 hover:text-[#daa520] transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-[#daa520] transition-colors">
                  Carrito
                </Link>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-[#daa520] transition-colors">
                  Sobre Nosotros
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[#daa520] mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2 text-gray-400">
                <MapPin size={16} className="text-[#daa520]" />
                <span>Quito, Ecuador</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <Phone size={16} className="text-[#daa520]" />
                <span>+593 99 999 9999</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <Mail size={16} className="text-[#daa520]" />
                <span>info@rondalclothes.com</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-[#daa520] mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-[#2d2d2d] p-3 rounded-full hover:bg-gradient-to-r hover:from-[#b8860b] hover:to-[#daa520] transition-all"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="bg-[#2d2d2d] p-3 rounded-full hover:bg-gradient-to-r hover:from-[#b8860b] hover:to-[#daa520] transition-all"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="bg-[#2d2d2d] p-3 rounded-full hover:bg-gradient-to-r hover:from-[#b8860b] hover:to-[#daa520] transition-all"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 Rondal Clothes. Todos los derechos reservados.</p>
          <p className="mt-2">Desarrollado por: Javier Villarroel, Pamela Moposita, David Villagómez - Instituto Yavirac</p>
        </div>
      </div>
    </footer>
  );
}