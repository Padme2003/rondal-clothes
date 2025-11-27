import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface OrderLine {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  lineTotal: number;
}

interface OrderTotals {
  subtotal: number;
  discount: number;
  taxableBase: number;
  tax: number;
  total: number;
  ivaRate: number;
}

interface CustomerOrder {
  orderNumber: string;
  items: number;
  total: number;
  email: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  createdAt: string;
  paymentMethod?: 'card' | 'cash' | 'transfer';
  lines?: OrderLine[];
  totals?: OrderTotals;
}

interface CustomerOrderPayload extends Omit<CustomerOrder, 'createdAt'> {
  createdAt?: string;
}

interface User {
  id: string;
  username: string;
  email?: string;
  fullName?: string;
  role: 'admin' | 'customer';
  lastLogin: Date;
  orders?: CustomerOrder[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginCustomer: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerCustomer: (payload: CustomerRegistrationPayload) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkSession: () => boolean;
  recordOrder: (order: CustomerOrderPayload) => void;
}

interface RegisteredCustomer {
  id: string;
  username: string;
  email: string;
  fullName: string;
  password: string;
  createdAt: number;
  orders: CustomerOrder[];
}

interface CustomerRegistrationPayload {
  username: string;
  email: string;
  fullName: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'RondalClothes2024!',
};

const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hora
const SESSION_KEY = 'rondal_user_session';
const SESSION_TIMESTAMP_KEY = 'rondal_user_session_timestamp';
const LEGACY_SESSION_KEY = 'rondal_admin_session';
const LEGACY_SESSION_TIMESTAMP_KEY = 'rondal_admin_session_timestamp';
const CUSTOMER_STORAGE_KEY = 'rondal_customers';

const generateId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `usr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
};

const getStoredCustomers = (): RegisteredCustomer[] => {
  try {
    const stored = localStorage.getItem(CUSTOMER_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as RegisteredCustomer[];
    return parsed.map((customer) => ({
      ...customer,
      orders: normalizeOrdersArray(customer.orders),
    }));
  } catch (error) {
    console.error('Error al leer clientes almacenados', error);
    localStorage.removeItem(CUSTOMER_STORAGE_KEY);
    return [];
  }
};

const persistCustomers = (customers: RegisteredCustomer[]) => {
  localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customers));
};

const normalizeOrder = (order: CustomerOrder): CustomerOrder => ({
  ...order,
  lines: Array.isArray(order.lines) ? order.lines : [],
  totals: order.totals ?? undefined,
});

const normalizeOrdersArray = (orders?: CustomerOrder[]) =>
  Array.isArray(orders) ? orders.map(normalizeOrder) : [];

const appendOrderToCustomer = (customerId: string, order: CustomerOrder) => {
  const customers = getStoredCustomers();
  const updated = customers.map((customer) =>
    customer.id === customerId
      ? {
          ...customer,
          orders: [...customer.orders, normalizeOrder(order)],
        }
      : customer
  );
  persistCustomers(updated);
};

const createSession = (newUser: User) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
  localStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
  localStorage.removeItem(LEGACY_SESSION_KEY);
  localStorage.removeItem(LEGACY_SESSION_TIMESTAMP_KEY);
};

const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_TIMESTAMP_KEY);
  localStorage.removeItem(LEGACY_SESSION_KEY);
  localStorage.removeItem(LEGACY_SESSION_TIMESTAMP_KEY);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkStoredSession();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (user && !checkSession()) {
        logout();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [user]);

  const checkStoredSession = () => {
    try {
      const storedUser = localStorage.getItem(SESSION_KEY) ?? localStorage.getItem(LEGACY_SESSION_KEY);
      const timestamp =
        localStorage.getItem(SESSION_TIMESTAMP_KEY) ?? localStorage.getItem(LEGACY_SESSION_TIMESTAMP_KEY);

      if (!storedUser || !timestamp) {
        return;
      }

      const sessionAge = Date.now() - parseInt(timestamp, 10);
      if (sessionAge >= SESSION_TIMEOUT) {
        clearSession();
        return;
      }

      const parsedRaw = JSON.parse(storedUser) as User;
      const parsedUser: User = {
        ...parsedRaw,
        orders: normalizeOrdersArray(parsedRaw.orders),
      };
      setUser(parsedUser);

      if (!localStorage.getItem(SESSION_KEY)) {
        localStorage.setItem(SESSION_KEY, storedUser);
        localStorage.setItem(SESSION_TIMESTAMP_KEY, timestamp);
      }
    } catch (error) {
      console.error('Error al verificar sesión:', error);
      clearSession();
    } finally {
      setIsLoading(false);
    }
  };

  const checkSession = (): boolean => {
    const timestamp =
      localStorage.getItem(SESSION_TIMESTAMP_KEY) ?? localStorage.getItem(LEGACY_SESSION_TIMESTAMP_KEY);
    if (!timestamp) return false;

    const sessionAge = Date.now() - parseInt(timestamp, 10);
    return sessionAge < SESSION_TIMEOUT;
  };

  const login = async (
    username: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!username.trim() || !password.trim()) {
        return { success: false, error: 'Usuario y contraseña son requeridos' };
      }

      const sanitizedUsername = username.trim();
      const sanitizedPassword = password.trim();

      if (sanitizedUsername.length < 3) {
        return { success: false, error: 'Usuario inválido' };
      }

      if (sanitizedPassword.length < 6) {
        return { success: false, error: 'Contraseña inválida' };
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      if (
        sanitizedUsername === ADMIN_CREDENTIALS.username &&
        sanitizedPassword === ADMIN_CREDENTIALS.password
      ) {
        const newUser: User = {
          id: 'admin-001',
          username: sanitizedUsername,
          role: 'admin',
          lastLogin: new Date(),
        };

        createSession(newUser);
        setUser(newUser);
        return { success: true };
      }

      return { success: false, error: 'Usuario o contraseña incorrectos' };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: 'Error al procesar la solicitud' };
    }
  };

  const loginCustomer = async (
    identifier: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!identifier.trim() || !password.trim()) {
        return { success: false, error: 'Correo/usuario y contraseña son obligatorios' };
      }

      const sanitizedIdentifier = identifier.trim().toLowerCase();
      const sanitizedPassword = password.trim();

      await new Promise((resolve) => setTimeout(resolve, 500));

      const customers = getStoredCustomers();
      const matched = customers.find(
        (customer) =>
          customer.username.toLowerCase() === sanitizedIdentifier ||
          customer.email.toLowerCase() === sanitizedIdentifier
      );

      if (!matched) {
        return { success: false, error: 'Usuario o correo no registrado' };
      }

      if (matched.password !== sanitizedPassword) {
        return { success: false, error: 'Contraseña incorrecta' };
      }

      const newUser: User = {
        id: matched.id,
        username: matched.username,
        email: matched.email,
        fullName: matched.fullName,
        role: 'customer',
        lastLogin: new Date(),
        orders: normalizeOrdersArray(matched.orders),
      };

      createSession(newUser);
      setUser(newUser);
      return { success: true };
    } catch (error) {
      console.error('Error en login de cliente:', error);
      return { success: false, error: 'Error al procesar la solicitud' };
    }
  };

  const registerCustomer = async (
    payload: CustomerRegistrationPayload
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const customers = getStoredCustomers();
      const sanitizedUsername = payload.username.trim();
      const sanitizedEmail = payload.email.trim().toLowerCase();
      const sanitizedPassword = payload.password.trim();
      const sanitizedFullName = payload.fullName.trim();

      if (!sanitizedFullName) {
        return { success: false, error: 'El nombre completo es obligatorio' };
      }

      if (sanitizedUsername.length < 3) {
        return { success: false, error: 'El nombre de usuario debe tener al menos 3 caracteres' };
      }

      if (!/^\S+@\S+\.\S+$/.test(payload.email.trim())) {
        return { success: false, error: 'El correo no es válido' };
      }

      if (sanitizedPassword.length < 6) {
        return { success: false, error: 'La contraseña debe tener al menos 6 caracteres' };
      }

      if (customers.some((customer) => customer.username.toLowerCase() === sanitizedUsername.toLowerCase())) {
        return { success: false, error: 'El nombre de usuario ya está en uso' };
      }

      if (customers.some((customer) => customer.email === sanitizedEmail)) {
        return { success: false, error: 'El correo ya está registrado' };
      }

      const newCustomer: RegisteredCustomer = {
        id: generateId(),
        username: sanitizedUsername,
        email: sanitizedEmail,
        fullName: sanitizedFullName,
        password: sanitizedPassword,
        createdAt: Date.now(),
        orders: [],
      };

      const updatedCustomers = [...customers, newCustomer];
      persistCustomers(updatedCustomers);

      return { success: true };
    } catch (error) {
      console.error('Error al registrar cliente:', error);
      return { success: false, error: 'No se pudo crear la cuenta' };
    }
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  const recordOrder = (payload: CustomerOrderPayload) => {
    if (!user) return;

    const orderRecord: CustomerOrder = {
      orderNumber: payload.orderNumber,
      items: payload.items,
      total: payload.total,
      email: payload.email,
      shippingAddress: payload.shippingAddress,
      city: payload.city,
      postalCode: payload.postalCode,
      createdAt: payload.createdAt ?? new Date().toISOString(),
      paymentMethod: payload.paymentMethod ?? 'card',
      lines: payload.lines ?? [],
      totals:
        payload.totals ??
        {
          subtotal: payload.total,
          discount: 0,
          taxableBase: payload.total,
          tax: 0,
          total: payload.total,
          ivaRate: 0,
        },
    };

    appendOrderToCustomer(user.id, orderRecord);

    const updatedUser: User = {
      ...user,
      orders: [...(user.orders ?? []), normalizeOrder(orderRecord)],
    };

    setUser(updatedUser);
    createSession(updatedUser);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginCustomer,
    registerCustomer,
    logout,
    checkSession,
    recordOrder,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
