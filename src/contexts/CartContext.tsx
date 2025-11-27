import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

interface Product {
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

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  getCartTotals: () => CartTotals;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  taxableBase: number;
  tax: number;
  total: number;
  ivaRate: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const IVA_RATE = 0.12;

type CartAction =
  | { type: 'ADD'; product: Product }
  | { type: 'REMOVE'; productId: number }
  | { type: 'UPDATE'; productId: number; quantity: number }
  | { type: 'CLEAR' };

const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
  switch (action.type) {
    case 'ADD': {
      const existingItem = state.find((item) => item.id === action.product.id);
      const availableStock = action.product.stock ?? 0;
      if (availableStock <= 0) {
        return state;
      }

      if (existingItem) {
        const nextQuantity = Math.min(existingItem.quantity + 1, availableStock);
        return state.map((item) =>
          item.id === action.product.id ? { ...item, quantity: nextQuantity } : item
        );
      }
      return [...state, { ...action.product, quantity: 1 }];
    }
    case 'REMOVE': {
      return state.filter((item) => item.id !== action.productId);
    }
    case 'UPDATE': {
      const normalized = Math.max(
        1,
        Math.min(action.quantity, state.find((item) => item.id === action.productId)?.stock ?? action.quantity)
      );
      return state.map((item) =>
        item.id === action.productId ? { ...item, quantity: normalized } : item
      );
    }
    case 'CLEAR':
      return [];
    default:
      return state;
  }
};

const initializer = (): CartItem[] => {
  try {
    if (typeof window === 'undefined') {
      return [];
    }
    const savedCart = localStorage.getItem('rondalClothesCart');
    if (savedCart) {
      const parsed: CartItem[] = JSON.parse(savedCart);
      return parsed.map((item) => ({
        ...item,
        stock: typeof item.stock === 'number' ? item.stock : 0,
        quantity: item.quantity ?? 1,
      }));
    }
  } catch (error) {
    console.error('Error al cargar el carrito:', error);
    localStorage.removeItem('rondalClothesCart');
  }
  return [];
};

const calculateTotals = (items: CartItem[]): CartTotals => {
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const discount = items.reduce(
    (total, item) => total + item.price * (item.discount / 100) * item.quantity,
    0
  );
  const taxableBase = Math.max(0, subtotal - discount);
  const tax = taxableBase * IVA_RATE;
  const total = taxableBase + tax;

  return {
    subtotal,
    discount,
    taxableBase,
    tax,
    total,
    ivaRate: IVA_RATE,
  };
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, [], initializer);

  useEffect(() => {
    localStorage.setItem('rondalClothesCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => dispatch({ type: 'ADD', product });

  const removeFromCart = (productId: number) => dispatch({ type: 'REMOVE', productId });

  const updateQuantity = (productId: number, quantity: number) =>
    dispatch({ type: 'UPDATE', productId, quantity });

  const clearCart = () => dispatch({ type: 'CLEAR' });

  const getCartTotals = () => calculateTotals(cart);

  const getCartTotal = () => getCartTotals().total;

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        getCartTotals,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
