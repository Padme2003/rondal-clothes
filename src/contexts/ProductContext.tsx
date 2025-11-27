import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice: number | null;
  discount: number;
  category: string;
  image: string;
  description: string;
  stock: number;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: number) => void;
  adjustStock: (items: { id: number; quantity: number }[]) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Camisa Formal Ejecutiva",
    price: 45.99,
    oldPrice: 65.99,
    discount: 30,
    category: "Camisas",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500",
    description: "Camisa formal de alta calidad, perfecta para eventos ejecutivos. Tela premium con acabados impecables.",
    stock: 18,
  },
  {
    id: 2,
    name: "Pantalón de Vestir Clásico",
    price: 55.99,
    oldPrice: null,
    discount: 0,
    category: "Pantalones",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500",
    description: "Pantalón de vestir con corte clásico. Ideal para combinar con cualquier camisa formal.",
    stock: 22,
  },
  {
    id: 3,
    name: "Vestido Casual Elegante",
    price: 68.99,
    oldPrice: 89.99,
    discount: 23,
    category: "Vestidos",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
    description: "Vestido versátil que combina elegancia y comodidad para cualquier ocasión.",
    stock: 12,
  },
  {
    id: 4,
    name: "Chaqueta de Cuero Premium",
    price: 125.99,
    oldPrice: 179.99,
    discount: 30,
    category: "Chaquetas",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
    description: "Chaqueta de cuero genuino con diseño moderno y duradero. Una inversión en estilo.",
    stock: 9,
  },
  {
    id: 5,
    name: "Blusa Casual Femenina",
    price: 35.99,
    oldPrice: null,
    discount: 0,
    category: "Blusas",
    image: "https://images.unsplash.com/photo-1564257577100-9fd6fd2f8a69?w=500",
    description: "Blusa ligera y cómoda, perfecta para el día a día con estilo.",
    stock: 25,
  },
  {
    id: 6,
    name: "Jeans Modernos Slim Fit",
    price: 48.99,
    oldPrice: null,
    discount: 0,
    category: "Pantalones",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
    description: "Jeans de corte moderno con ajuste perfecto. Comodidad y estilo en una sola prenda.",
    stock: 30,
  },
  {
    id: 7,
    name: "Camisa Casual a Cuadros",
    price: 38.99,
    oldPrice: 52.99,
    discount: 26,
    category: "Camisas",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500",
    description: "Camisa casual con patrón de cuadros clásico. Perfecta para looks informales.",
    stock: 15,
  },
  {
    id: 8,
    name: "Falda Plisada Elegante",
    price: 42.99,
    oldPrice: null,
    discount: 0,
    category: "Faldas",
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500",
    description: "Falda plisada que aporta movimiento y elegancia a tu outfit.",
    stock: 14,
  },
  {
    id: 9,
    name: "Suéter de Punto Premium",
    price: 58.99,
    oldPrice: 75.99,
    discount: 22,
    category: "Suéteres",
    image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500",
    description: "Suéter de punto fino, suave al tacto y perfecto para climas frescos.",
    stock: 16,
  },
  {
    id: 10,
    name: "Blazer Ejecutivo Negro",
    price: 95.99,
    oldPrice: 135.99,
    discount: 29,
    category: "Chaquetas",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500",
    description: "Blazer negro versátil que nunca pasa de moda. Esencial en todo guardarropa.",
    stock: 11,
  },
  {
    id: 11,
    name: "Polo Deportivo Premium",
    price: 32.99,
    oldPrice: null,
    discount: 0,
    category: "Camisas",
    image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500",
    description: "Polo deportivo de tela transpirable. Comodidad para todo el día.",
    stock: 20,
  },
  {
    id: 12,
    name: "Vestido de Noche Sofisticado",
    price: 115.99,
    oldPrice: 159.99,
    discount: 28,
    category: "Vestidos",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500",
    description: "Vestido de noche elegante y sofisticado para eventos especiales.",
    stock: 8,
  },
];

const normalizeProducts = (list: Product[]): Product[] =>
  list.map((product) => ({
    ...product,
    stock: typeof (product as Product).stock === 'number' ? (product as Product).stock : 10,
  }));

const fallbackImages: Record<string, string> = {
  Camisas: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500',
  Pantalones: 'https://images.unsplash.com/photo-1542293787938-4d273c2f1ac2?w=500',
  Vestidos: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500',
  Chaquetas: 'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=500',
  Blusas: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
};

const ensureImage = (image: string, category: string) =>
  image?.trim() || fallbackImages[category] || 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500';

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const savedProducts = localStorage.getItem('rondalClothesProducts');
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts) as Product[];
        setProducts(normalizeProducts(parsed));
        return;
      } catch (error) {
        console.error('Error al cargar productos guardados', error);
        localStorage.removeItem('rondalClothesProducts');
      }
    }
    setProducts(initialProducts);
  }, []);

  useEffect(() => {
    localStorage.setItem('rondalClothesProducts', JSON.stringify(products));
  }, [products]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newId = Math.max(...products.map((p) => p.id), 0) + 1;
    setProducts([
      ...products,
      { ...product, id: newId, image: ensureImage(product.image, product.category) },
    ]);
  };

  const updateProduct = (id: number, updatedProduct: Omit<Product, 'id'>) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...updatedProduct, id, image: ensureImage(updatedProduct.image, updatedProduct.category) } : p
      )
    );
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const adjustStock = (items: { id: number; quantity: number }[]) => {
    if (items.length === 0) return;
    setProducts((prev) =>
      prev.map((product) => {
        const item = items.find((line) => line.id === product.id);
        if (!item) return product;
        const remaining = Math.max(0, product.stock - item.quantity);
        return { ...product, stock: remaining };
      })
    );
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, adjustStock }}>
      {children}
    </ProductContext.Provider>
  );
};
