# 🔐 Sistema de Seguridad - Panel de Administración

## 📋 Índice
- [Descripción General](#descripción-general)
- [Características de Seguridad](#características-de-seguridad)
- [Guía de Uso](#guía-de-uso)
- [Arquitectura Técnica](#arquitectura-técnica)
- [Testing y Validación](#testing-y-validación)
- [Mejoras Futuras](#mejoras-futuras)

---

## 📖 Descripción General

Sistema de autenticación y autorización implementado para proteger el panel de administración de Rondal Clothes. Desarrollado como parte del proyecto académico del Instituto Yavirac usando React.js y Context API.

### Objetivo
Proporcionar un acceso seguro y controlado al panel administrativo, protegiendo las funcionalidades de gestión de productos y órdenes.

---

## 🛡️ Características de Seguridad

### 1. Autenticación Robusta
✅ **Sistema de Login Seguro**
- Formulario de autenticación con validación en tiempo real
- Sanitización de entradas para prevenir inyección de código
- Feedback visual inmediato de errores

✅ **Credenciales Protegidas**
- Usuario: `admin`
- Contraseña: `RondalClothes2024!`
- Validación de longitud mínima (usuario: 3 chars, contraseña: 6 chars)

### 2. Protección contra Ataques
✅ **Límite de Intentos de Login**
- Máximo 5 intentos fallidos permitidos
- Bloqueo temporal de 1 minuto después de 5 intentos
- Contador visible de intentos restantes

✅ **Prevención de Fuerza Bruta**
- Delay simulado en cada intento de login (500ms)
- Bloqueo progresivo de cuenta
- Mensajes de error genéricos para evitar información sensible

✅ **Validación de Entrada**
- Sanitización de espacios en blanco
- Límite máximo de caracteres
- Prevención de campos vacíos
- Escape de caracteres especiales

### 3. Gestión de Sesiones
✅ **Sesiones Seguras**
- Duración de sesión: 1 hora de inactividad
- Almacenamiento seguro en localStorage con timestamp
- Verificación automática cada minuto
- Expiración automática de sesiones

✅ **Advertencias de Sesión**
- Notificación 5 minutos antes de expirar
- Contador en tiempo real del tiempo restante
- Opción de cerrar sesión manual

✅ **Persistencia de Sesión**
- Recuperación de sesión al recargar página
- Validación de timestamp de sesión
- Limpieza automática de sesiones expiradas

### 4. Protección de Rutas
✅ **ProtectedRoute Component**
- Verificación de autenticación antes de renderizar
- Redirección automática a login si no está autenticado
- Validación de sesión activa
- Manejo de estado de carga

✅ **Rutas Administrativas Protegidas**
- `/admin` - Panel principal (requiere autenticación)
- `/admin/login` - Página de login (pública)
- Redirección automática si ya está autenticado

### 5. UI/UX de Seguridad
✅ **Experiencia de Usuario**
- Toggle para mostrar/ocultar contraseña
- Indicadores de estado de carga
- Mensajes de error claros y específicos
- Diseño responsive para todos los dispositivos

✅ **Feedback Visual**
- Estados de botones (normal, loading, disabled)
- Alertas coloridas según tipo de mensaje
- Animaciones de carga
- Badges de estado

---

## 🚀 Guía de Uso

### Para Administradores

#### 1. Acceder al Panel
```
1. Navega a: https://tu-dominio.com/admin
2. Serás redirigido a /admin/login
3. Ingresa las credenciales:
   - Usuario: admin
   - Contraseña: RondalClothes2024!
4. Haz clic en "Iniciar Sesión"
```

#### 2. Durante la Sesión
- Tu sesión durará **1 hora** desde el último acceso
- Recibirás una **advertencia 5 minutos** antes de que expire
- El tiempo restante se muestra en la esquina inferior derecha
- Puedes cerrar sesión manualmente en cualquier momento

#### 3. Cerrar Sesión
```
1. Haz clic en el botón "Cerrar Sesión" en la esquina superior derecha
2. Serás redirigido automáticamente a /admin/login
3. Tu sesión será eliminada completamente
```

#### 4. Sesión Expirada
```
Si tu sesión expira:
1. Serás redirigido automáticamente a /admin/login
2. Verás un mensaje indicando que la sesión expiró
3. Simplemente inicia sesión nuevamente
```

### Para Desarrolladores

#### 1. Estructura de Archivos
```
/contexts/
  └── AuthContext.tsx          # Gestión de estado de autenticación

/components/Admin/
  ├── AdminLogin.tsx           # Página de login
  ├── AdminDashboard.tsx       # Panel principal (protegido)
  ├── ProtectedRoute.tsx       # Componente de protección de rutas
  ├── SessionWarning.tsx       # Advertencia de expiración
  └── SecurityInfo.tsx         # Información de seguridad
```

#### 2. Usar el Contexto de Autenticación
```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // Verificar autenticación
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }
  
  // Usar información del usuario
  return <div>Bienvenido, {user?.username}</div>;
}
```

#### 3. Proteger Nuevas Rutas
```tsx
import ProtectedRoute from './components/Admin/ProtectedRoute';

<Route 
  path="/admin/nueva-ruta" 
  element={
    <ProtectedRoute>
      <NuevoComponente />
    </ProtectedRoute>
  } 
/>
```

---

## 🏗️ Arquitectura Técnica

### Context API (AuthContext)
```typescript
interface User {
  id: string;
  username: string;
  role: 'admin';
  lastLogin: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<Result>;
  logout: () => void;
  checkSession: () => boolean;
}
```

### Flujo de Autenticación
```
Usuario intenta acceder a /admin
    ↓
ProtectedRoute verifica autenticación
    ↓
    ├─ NO autenticado → Redirect a /admin/login
    ↓
    └─ SÍ autenticado → Verifica sesión válida
        ↓
        ├─ Sesión expirada → Redirect a /admin/login
        └─ Sesión válida → Renderiza AdminDashboard
```

### localStorage Keys
```javascript
'rondal_admin_session'           // Datos del usuario
'rondal_admin_session_timestamp' // Timestamp de inicio de sesión
```

### Configuración de Sesión
```javascript
SESSION_TIMEOUT = 60 * 60 * 1000;        // 1 hora
SESSION_WARNING_TIME = 5 * 60 * 1000;   // 5 minutos
MAX_LOGIN_ATTEMPTS = 5;                  // Intentos máximos
LOCKOUT_TIME = 60 * 1000;               // 1 minuto de bloqueo
```

---

## ✅ Testing y Validación

### Casos de Prueba

#### Test 1: Login Exitoso
```
✓ Ingresar credenciales correctas
✓ Redirección a /admin
✓ Sesión creada en localStorage
✓ Usuario visible en dashboard
```

#### Test 2: Login Fallido
```
✓ Ingresar credenciales incorrectas
✓ Mensaje de error mostrado
✓ Contador de intentos incrementado
✓ No se crea sesión
```

#### Test 3: Bloqueo por Intentos
```
✓ Intentar login 5 veces con credenciales incorrectas
✓ Cuenta bloqueada por 1 minuto
✓ Mensaje de bloqueo mostrado
✓ Botón de login deshabilitado
✓ Desbloqueo automático después de 1 minuto
```

#### Test 4: Expiración de Sesión
```
✓ Iniciar sesión
✓ Esperar 55 minutos
✓ Verificar advertencia de expiración
✓ Esperar 5 minutos más
✓ Redirección automática a login
```

#### Test 5: Protección de Rutas
```
✓ Intentar acceder a /admin sin autenticación
✓ Redirección a /admin/login
✓ Iniciar sesión
✓ Acceso permitido a /admin
```

#### Test 6: Cerrar Sesión
```
✓ Iniciar sesión
✓ Hacer clic en "Cerrar Sesión"
✓ localStorage limpiado
✓ Redirección a /admin/login
✓ No se puede acceder a /admin sin re-autenticar
```

### Validaciones de Seguridad
- ✅ Sanitización de entradas
- ✅ Validación de longitud mínima
- ✅ Prevención de campos vacíos
- ✅ Límite de caracteres máximos
- ✅ Prevención de inyección SQL (N/A - frontend only)
- ✅ Prevención de XSS
- ✅ Gestión segura de errores

---

## 🔮 Mejoras Futuras (Backend Integration)

### Para el Próximo Semestre

#### 1. Autenticación JWT
```javascript
// Backend
POST /api/auth/login
Response: { token: 'jwt_token', refreshToken: 'refresh_token' }

// Frontend
Authorization: Bearer jwt_token
```

#### 2. Hashing de Contraseñas
```javascript
// Backend (Node.js/Express)
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);
```

#### 3. Autenticación de Dos Factores (2FA)
```
1. Login con usuario/contraseña
2. Envío de código OTP por email/SMS
3. Validación de código OTP
4. Generación de token JWT
```

#### 4. Roles y Permisos
```typescript
interface User {
  id: string;
  username: string;
  role: 'admin' | 'moderator' | 'viewer';
  permissions: Permission[];
}
```

#### 5. Logs de Auditoría
```javascript
// Registrar todas las acciones administrativas
{
  userId: 'admin-001',
  action: 'CREATE_PRODUCT',
  timestamp: '2024-11-13T10:30:00Z',
  ip: '192.168.1.1',
  details: { productId: 'prod-123' }
}
```

#### 6. Rate Limiting (Backend)
```javascript
// Express middleware
const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5 // 5 intentos por IP
});
```

#### 7. HTTPS y Certificados SSL
```
- Implementar certificados SSL/TLS
- Forzar HTTPS en todas las rutas
- Configurar HSTS headers
```

#### 8. Tokens de Refresh
```javascript
// Renovar token JWT sin re-login
POST /api/auth/refresh
Body: { refreshToken: 'refresh_token' }
Response: { token: 'new_jwt_token' }
```

---

## 📚 Referencias y Recursos

### Documentación
- [React Context API](https://react.dev/reference/react/useContext)
- [React Router - Protected Routes](https://reactrouter.com/en/main)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT.io](https://jwt.io/)

### Librerías Sugeridas para Backend
- `bcrypt` - Hashing de contraseñas
- `jsonwebtoken` - Generación de JWT
- `express-rate-limit` - Rate limiting
- `helmet` - Security headers
- `express-validator` - Validación de inputs

---

## 👨‍💻 Equipo de Desarrollo

**Proyecto**: Rondal Clothes E-Commerce
**Institución**: Instituto Yavirac
**Desarrolladores**: 
- Javier Villarroel
- Pamela Moposita
- David Villagómez

**Fecha**: Noviembre 2024
**Versión**: 1.0.0
**Curso**: Desarrollo Web Frontend

---

## 📞 Soporte

Para preguntas o problemas relacionados con el sistema de seguridad:

1. **Revisar este documento** primero
2. **Consultar el archivo** `ADMIN_CREDENTIALS.md`
3. **Verificar los logs** en la consola del navegador
4. **Contactar al equipo** de desarrollo

---

## ⚠️ Notas Importantes

> **ADVERTENCIA**: Este sistema está diseñado para un proyecto académico. En producción:
> - NO almacenar credenciales en el código
> - NO usar localStorage para tokens sensibles
> - IMPLEMENTAR autenticación del lado del servidor
> - USAR HTTPS en todas las comunicaciones
> - IMPLEMENTAR rate limiting del lado del servidor
> - REALIZAR auditorías de seguridad regulares

---

**© 2024 Rondal Clothes - Instituto Yavirac**
