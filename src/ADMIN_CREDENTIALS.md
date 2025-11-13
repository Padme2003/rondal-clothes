# 🔐 Credenciales de Administrador - Rondal Clothes

## Credenciales de Acceso

Para acceder al panel de administración, utiliza las siguientes credenciales:

- **URL de Login**: `/admin/login`
- **Usuario**: `admin`
- **Contraseña**: `RondalClothes2024!`

> ⚠️ **Nota**: Estas son credenciales de desarrollo para el proyecto académico del Instituto Yavirac. En un entorno de producción, las credenciales se manejarían de forma segura en el backend.

---

## 🛡️ Características de Seguridad Implementadas

### 1. Sistema de Autenticación
- **AuthContext**: Gestión centralizada del estado de autenticación
- **Persistencia de sesión**: Usando localStorage con tokens de tiempo
- **Validación de credenciales**: Con sanitización de entradas
- **Protección contra inyección**: Validación y limpieza de datos de entrada

### 2. Gestión de Sesiones
- **Duración de sesión**: 1 hora de inactividad
- **Verificación automática**: Cada minuto se verifica la validez de la sesión
- **Expiración automática**: La sesión se cierra automáticamente después de 1 hora
- **Advertencia de expiración**: Notificación 5 minutos antes de que expire la sesión
- **Persistencia segura**: Timestamp de sesión almacenado en localStorage

### 3. Protección de Rutas
- **ProtectedRoute Component**: Wrapper que protege rutas administrativas
- **Redirección automática**: Usuarios no autenticados son redirigidos a login
- **Verificación de sesión activa**: Comprueba que la sesión no haya expirado
- **Estado de carga**: Muestra indicador mientras se verifica la autenticación

### 4. Seguridad en Login
- **Límite de intentos**: Máximo 5 intentos de login fallidos
- **Bloqueo temporal**: Cuenta bloqueada por 1 minuto después de 5 intentos
- **Contador de intentos**: Muestra intentos restantes al usuario
- **Validación de entrada**:
  - Usuario mínimo 3 caracteres
  - Contraseña mínimo 6 caracteres
  - Sanitización de espacios en blanco
  - Validación de campos vacíos

### 5. UI/UX de Seguridad
- **Visibilidad de contraseña**: Toggle para mostrar/ocultar contraseña
- **Mensajes de error claros**: Feedback específico para cada error
- **Indicadores visuales**: Estados de carga y bloqueo
- **Notificaciones de sesión**: Alertas de tiempo restante
- **Botón de cerrar sesión**: Visible en todo momento en el dashboard

### 6. Validaciones del Formulario
- **Validación en tiempo real**: Errores se limpian al escribir
- **Prevención de envíos múltiples**: Botón deshabilitado durante procesamiento
- **Límite de caracteres**: maxLength en campos de entrada
- **Autocompletado seguro**: Atributos autocomplete apropiados
- **Prevención de XSS**: Sanitización de entradas

### 7. Monitoreo y Auditoría
- **Registro de última sesión**: Fecha y hora del último login
- **Información de usuario**: Nombre de usuario visible en dashboard
- **Logs en consola**: Errores registrados para debugging (solo en desarrollo)
- **Avisos de seguridad**: Mensajes sobre zona restringida

---

## 📋 Flujo de Autenticación

```
1. Usuario accede a /admin
   ↓
2. ProtectedRoute verifica autenticación
   ↓
   ├─ No autenticado → Redirige a /admin/login
   └─ Autenticado → Verifica sesión válida
      ↓
      ├─ Sesión expirada → Redirige a /admin/login con mensaje
      └─ Sesión válida → Muestra AdminDashboard
```

## 🔒 Mejoras para Producción

Cuando se implemente el backend en el próximo semestre, considera:

1. **Autenticación JWT**: Implementar tokens JWT en lugar de localStorage
2. **HTTPS**: Usar conexión segura para todas las comunicaciones
3. **Hashing de contraseñas**: Usar bcrypt o argon2 en el backend
4. **2FA**: Autenticación de dos factores para mayor seguridad
5. **Rate limiting**: Limitar peticiones desde el backend
6. **Logs de auditoría**: Registrar todas las acciones administrativas
7. **Permisos granulares**: Sistema de roles y permisos
8. **Sesiones del servidor**: Gestión de sesiones desde el backend
9. **Refresh tokens**: Para renovar sesiones sin re-login
10. **Variables de entorno**: Mover credenciales a .env

---

## 🎓 Proyecto Académico

Este sistema de autenticación fue desarrollado como parte del proyecto académico de e-commerce "Rondal Clothes" para el Instituto Yavirac.

**Características del Proyecto:**
- Frontend completo en React.js
- Gestión de estado con Context API
- Persistencia con localStorage
- Diseño responsive
- Paleta corporativa (Negro, Plomo, Blanco, Dorado)
- Preparado para integración con backend

**Objetivos de Seguridad Cumplidos:**
✅ Autenticación de administrador
✅ Protección de rutas administrativas
✅ Gestión de sesiones
✅ Validaciones de seguridad
✅ Experiencia de usuario segura
✅ Prevención de accesos no autorizados

---

## 📞 Soporte

Para cualquier duda sobre el sistema de autenticación o credenciales, contacta al equipo de desarrollo del proyecto.

**Fecha de creación**: Noviembre 2024
**Versión**: 1.0.0
**Estado**: Desarrollo Académico
