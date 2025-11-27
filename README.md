# 🛍️ Rondal Clothes - E-commerce Platform

![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?logo=vite)

## 📋 Índice

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Características Principales](#-características-principales)
- [Arquitectura](#-arquitectura)
- [Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [Instalación y Ejecución](#-instalación-y-ejecución)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Documentación Técnica](#-documentación-técnica)
- [Equipo de Desarrollo](#-equipo-de-desarrollo)

---

## 📖 Descripción del Proyecto

**Rondal Clothes** es una plataforma de e-commerce completa desarrollada como proyecto final para el **Instituto Yavirac**. El sistema permite a los usuarios explorar productos, gestionar su carrito de compras y realizar pedidos, mientras que los administradores pueden gestionar productos, órdenes, clientes y acceder a reportes detallados de ventas.

### 🎯 Objetivos del Proyecto

- Desarrollar una solución de e-commerce completa y funcional
- Implementar una arquitectura escalable y mantenible
- Aplicar buenas prácticas de desarrollo frontend
- Diseñar una interfaz de usuario moderna y responsive
- Establecer bases para futura integración con backend

---

## ✨ Características Principales

### Para Clientes
- 🏠 **Landing Page Atractiva**: Página de inicio con productos destacados
- 🛒 **Catálogo de Productos**: Navegación y búsqueda de productos por categorías
- 🛍️ **Carrito de Compras**: Gestión completa del carrito con persistencia
- 💳 **Proceso de Checkout**: Flujo de compra completo con validación
- 📦 **Confirmación de Órdenes**: Página de confirmación con detalles del pedido
- 👤 **Gestión de Cuenta**: Registro, login y seguimiento de órdenes

### Para Administradores
- 🔐 **Sistema de Autenticación Seguro**:
  - Login con validación de credenciales
  - Gestión de sesiones (1 hora de duración)
  - Límite de intentos de login (5 intentos)
  - Advertencias de expiración de sesión

- 📊 **Dashboard Administrativo Completo**:
  - **Overview**: Métricas clave y resumen de operaciones
  - **Productos**: CRUD completo de productos
  - **Órdenes**: Gestión y seguimiento de pedidos
  - **Clientes**: Base de datos de clientes con historial
  - **Reportes**: Análisis de ventas con gráficos interactivos

- 📈 **Sistema de Reportes Avanzado**:
  - Análisis de ventas por período
  - Top productos más vendidos
  - Distribución por categorías
  - Tendencias y proyecciones
  - Exportación a CSV

---

## 🏗️ Arquitectura

### Patrón Arquitectónico
El proyecto sigue una **arquitectura de componentes en capas** con **separación de responsabilidades**:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Components: UI, Pages, Layouts)       │
├─────────────────────────────────────────┤
│         Business Logic Layer            │
│  (Contexts: Auth, Cart, Products)       │
├─────────────────────────────────────────┤
│         Data Layer                      │
│  (Local Storage, Mock Data)             │
└─────────────────────────────────────────┘
```

### Decisiones Arquitectónicas Clave
- **Gestión de Estado**: Context API para estado global
- **Routing**: React Router DOM v6 con rutas protegidas
- **Persistencia**: localStorage para datos del cliente
- **Componentes UI**: shadcn/ui con Radix UI primitives
- **Estilos**: Tailwind CSS con diseño responsive-first

Para más detalles, consultar:
- [Documento de Diseño de Arquitectura (DDA)](./docs/DDA.md)
- [Diagramas C4](./docs/diagrams/)
- [ADRs (Architecture Decision Records)](./docs/ADRs/)

---

## 🛠️ Tecnologías Utilizadas

### Core Technologies
- **React 18.3.1**: Librería UI con hooks y Context API
- **TypeScript 5.x**: Tipado estático para mayor robustez
- **Vite 6.3.5**: Build tool rápido y moderno
- **React Router DOM**: Routing del lado del cliente

### UI & Styling
- **Tailwind CSS 4.0**: Framework CSS utility-first
- **shadcn/ui**: Componentes UI reutilizables y accesibles
- **Radix UI**: Primitives para componentes accesibles
- **Lucide React**: Librería de iconos

### Data Visualization
- **Recharts 2.15**: Gráficos y charts interactivos

### Development Tools
- **Vite Plugin React SWC**: Compilación rápida de React
- **ESLint**: Linting de código
- **PostCSS**: Procesamiento de CSS

---

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js >= 18.0.0
- npm >= 9.0.0

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/Padme2003/rondal-clothes.git
cd rondal-clothes
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

El servidor se iniciará en `http://localhost:5173`

4. **Compilar para producción**
```bash
npm run build
```

Los archivos compilados estarán en la carpeta `build/`

### Credenciales de Acceso

#### Panel de Administración
- **URL**: `/admin/login`
- **Usuario**: `admin`
- **Contraseña**: `RondalClothes2024!`

Para más información sobre seguridad, ver [ADMIN_CREDENTIALS.md](./src/ADMIN_CREDENTIALS.md)

---

## 📁 Estructura del Proyecto

```
rondal-clothes/
├── docs/                           # 📚 Documentación del proyecto
│   ├── DDA.md                     # Documento de Diseño de Arquitectura
│   ├── PRESENTACION.md            # Presentación de defensa
│   ├── ADRs/                      # Architecture Decision Records
│   │   ├── ADR-001-frontend-framework.md
│   │   ├── ADR-002-state-management.md
│   │   ├── ADR-003-ui-components.md
│   │   ├── ADR-004-routing.md
│   │   └── ADR-005-data-persistence.md
│   └── diagrams/                  # Diagramas C4 y arquitectura
│       ├── C1-context-diagram.md
│       ├── C2-container-diagram.md
│       └── C3-component-diagram.md
│
├── src/                           # 💻 Código fuente
│   ├── components/                # Componentes React
│   │   ├── Admin/                # Módulo administrativo
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── ProductManager.tsx
│   │   │   ├── OrdersView.tsx
│   │   │   ├── ClientsManager.tsx
│   │   │   ├── ReportsView.tsx
│   │   │   ├── SessionWarning.tsx
│   │   │   └── SecurityInfo.tsx
│   │   ├── Account/              # Módulo de cuenta de cliente
│   │   │   ├── CustomerLogin.tsx
│   │   │   ├── CustomerRegister.tsx
│   │   │   └── CustomerOrders.tsx
│   │   ├── ui/                   # Componentes UI reutilizables
│   │   ├── Home.tsx              # Página de inicio
│   │   ├── ProductCatalog.tsx    # Catálogo de productos
│   │   ├── Cart.tsx              # Carrito de compras
│   │   ├── Checkout.tsx          # Proceso de checkout
│   │   ├── OrderConfirmation.tsx # Confirmación de orden
│   │   ├── Navigation.tsx        # Barra de navegación
│   │   ├── Footer.tsx            # Pie de página
│   │   └── ErrorBoundary.tsx     # Manejo de errores
│   │
│   ├── contexts/                 # Context API para estado global
│   │   ├── AuthContext.tsx       # Autenticación y sesiones
│   │   ├── CartContext.tsx       # Carrito de compras
│   │   └── ProductContext.tsx    # Gestión de productos
│   │
│   ├── styles/                   # Estilos globales
│   │   └── globals.css
│   │
│   ├── App.tsx                   # Componente principal
│   ├── main.tsx                  # Punto de entrada
│   ├── index.css                 # Estilos base
│   ├── mockProducts.json         # Datos mock de productos
│   │
│   └── *.md                      # Documentación específica
│       ├── ADMIN_CREDENTIALS.md
│       ├── README_ADMIN.md
│       ├── FUNCIONALIDADES_ADMIN.md
│       └── SEGURIDAD_ADMIN.md
│
├── build/                        # 📦 Build de producción
├── node_modules/                 # 📚 Dependencias
├── index.html                    # HTML principal
├── package.json                  # Configuración del proyecto
├── package-lock.json             # Lock de dependencias
├── vite.config.ts               # Configuración de Vite
└── README.md                    # Este archivo
```

---

## 📚 Documentación Técnica

### Documentación Principal
- **[DDA - Documento de Diseño de Arquitectura](./docs/DDA.md)**: Documentación completa de la arquitectura del sistema
- **[Presentación de Defensa](./docs/PRESENTACION.md)**: Diapositivas para la presentación final

### Diagramas
- **[Diagrama de Contexto (C1)](./docs/diagrams/C1-context-diagram.md)**: Vista de alto nivel del sistema
- **[Diagrama de Contenedores (C2)](./docs/diagrams/C2-container-diagram.md)**: Componentes de alto nivel
- **[Diagrama de Componentes (C3)](./docs/diagrams/C3-component-diagram.md)**: Arquitectura interna de componentes

### Architecture Decision Records (ADRs)
- **[ADR-001](./docs/ADRs/ADR-001-frontend-framework.md)**: Selección de React como framework
- **[ADR-002](./docs/ADRs/ADR-002-state-management.md)**: Uso de Context API para gestión de estado
- **[ADR-003](./docs/ADRs/ADR-003-ui-components.md)**: Adopción de shadcn/ui
- **[ADR-004](./docs/ADRs/ADR-004-routing.md)**: Implementación de React Router
- **[ADR-005](./docs/ADRs/ADR-005-data-persistence.md)**: Persistencia con localStorage

### Documentación del Panel Admin
- **[Credenciales de Admin](./src/ADMIN_CREDENTIALS.md)**: Información de acceso y seguridad
- **[README Admin](./src/README_ADMIN.md)**: Guía completa del panel administrativo
- **[Funcionalidades Admin](./src/FUNCIONALIDADES_ADMIN.md)**: Descripción detallada de funcionalidades
- **[Seguridad Admin](./src/SEGURIDAD_ADMIN.md)**: Implementación de seguridad

---

## 🎨 Paleta de Colores Corporativa

```css
/* Colores Principales */
--color-negro:  #1a1a1a   /* Fondos principales */
--color-plomo:  #2d2d2d   /* Fondos secundarios */
--color-blanco: #ffffff   /* Texto y fondos claros */

/* Gradiente Dorado (Marca Rondal Clothes) */
--color-dorado-1: #b8860b
--color-dorado-2: #c9a227
--color-dorado-3: #daa520
```

---

## 👥 Equipo de Desarrollo

### Integrantes
- 👨‍💻 **Javier Villarroel**
- 👩‍💻 **Pamela Moposita**
- 👨‍💻 **David Villagómez**

### Institución
**Instituto Superior Tecnológico Yavirac**
- Carrera: Desarrollo de Software
- Proyecto: E-commerce Rondal Clothes
- Período: 2024

---

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos para el Instituto Yavirac.

© 2024 - Rondal Clothes - Todos los derechos reservados

---

## 🚀 Roadmap Futuro

### Fase 2 - Backend Integration (Próximo Semestre)
- [ ] API RESTful con Node.js/Express
- [ ] Base de datos PostgreSQL/MongoDB
- [ ] Autenticación JWT
- [ ] Sistema de pagos (Stripe/PayPal)
- [ ] Upload de imágenes a cloud (AWS S3/Cloudinary)
- [ ] Email notifications

### Fase 3 - Funcionalidades Avanzadas
- [ ] Sistema de reseñas y ratings
- [ ] Wishlist de productos
- [ ] Sistema de cupones y descuentos
- [ ] Chat en vivo con soporte
- [ ] Notificaciones push
- [ ] Analytics avanzado

---

## 🐛 Solución de Problemas

### Problemas Comunes

**Error al instalar dependencias**
```bash
# Limpiar caché de npm
npm cache clean --force
# Reinstalar
rm -rf node_modules package-lock.json
npm install
```

**Puerto 5173 ocupado**
```bash
# Cambiar puerto en vite.config.ts
server: { port: 3000 }
```

**Sesión de admin expira muy rápido**
- La sesión tiene duración de 1 hora por seguridad
- Puedes ajustar `SESSION_TIMEOUT` en `AuthContext.tsx` si es necesario

---

## 📞 Contacto y Soporte

Para consultas sobre el proyecto:
- Revisar la documentación en la carpeta `docs/`
- Consultar los archivos README específicos en `src/`
- Contactar al equipo de desarrollo

---

## ⭐ Agradecimientos

- **Instituto Yavirac** - Por la formación y apoyo académico
- **Comunidad React** - Por las herramientas open source
- **shadcn/ui** - Por los componentes UI de alta calidad
- **Recharts** - Por la librería de gráficos

---

<div align="center">

**🛍️ Rondal Clothes - E-commerce Platform**

Desarrollado con ❤️ por estudiantes del Instituto Yavirac

![Version](https://img.shields.io/badge/version-1.0.0-green)
![Status](https://img.shields.io/badge/status-active-success)

</div>
