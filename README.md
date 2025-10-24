# D-karitoStore - Aplicación de E-commerce Electrónico

Una moderna aplicación de comercio electrónico desarrollada con React y Vite, diseñada para la venta de productos electrónicos.

## 🚀 Características

- **Catálogo de Productos**: Navegación por categorías de productos electrónicos
- **Búsqueda y Filtrado**: Sistema de búsqueda en tiempo real y filtros por categoría
- **Carrito de Compras**: Gestión completa del carrito con persistencia en localStorage
- **Detalles de Producto**: Vista detallada con información completa de cada producto
- **Sistema de Checkout**: Proceso de compra completo con formulario de datos
- **Diseño Responsive**: Optimizado para dispositivos móviles, tablets y escritorio
- **Interfaz Moderna**: UI atractiva con gradientes y animaciones

## 📦 Productos Disponibles

La tienda incluye productos en las siguientes categorías:
- Laptops
- Smartphones
- Tablets
- Audio
- TVs
- Accesorios
- Gaming
- Cámaras
- Impresoras
- E-readers

## 🛠️ Tecnologías Utilizadas

- **React 19** - Framework de interfaz de usuario
- **Vite** - Herramienta de construcción y desarrollo
- **Context API** - Gestión de estado global
- **LocalStorage** - Persistencia de datos del carrito
- **CSS3** - Estilos y animaciones
- **ESLint** - Linting de código

## 🏃‍♂️ Inicio Rápido

### Prerrequisitos

- Node.js (versión 20 o superior)
- npm (versión 10 o superior)

### Instalación

1. Clonar el repositorio
```bash
git clone https://github.com/Andybetmp/D-karitostoreApp.git
cd D-karitostoreApp
```

2. Instalar dependencias
```bash
cd frontend
npm install
```

3. Iniciar el servidor de desarrollo
```bash
npm run dev
```

4. Abrir el navegador en `http://localhost:5173`

## 📜 Scripts Disponibles

En el directorio `frontend`, puedes ejecutar:

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la construcción de producción
- `npm run lint` - Ejecuta el linter para verificar el código

## 🏗️ Estructura del Proyecto

```
D-karitostoreApp/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/        # Componentes de React
│   │   │   ├── Header.jsx
│   │   │   ├── ProductList.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   └── OrderConfirmation.jsx
│   │   ├── context/           # Context API
│   │   │   └── CartContext.jsx
│   │   ├── data/              # Datos estáticos
│   │   │   └── products.js
│   │   ├── App.jsx            # Componente principal
│   │   ├── main.jsx           # Punto de entrada
│   │   └── index.css          # Estilos globales
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🎨 Características de la UI

- **Gradientes Modernos**: Uso de gradientes lineales para un diseño atractivo
- **Animaciones Suaves**: Transiciones y animaciones CSS para mejor UX
- **Tarjetas de Producto**: Diseño de tarjetas con efecto hover
- **Modal de Detalles**: Vista de detalles en modal responsive
- **Carrito Lateral**: Panel deslizante para el carrito de compras
- **Indicadores Visuales**: Badges de stock, calificaciones con estrellas

## 💡 Funcionalidades Principales

### Gestión del Carrito
- Agregar productos al carrito
- Actualizar cantidades
- Eliminar productos
- Vaciar carrito completo
- Persistencia de datos en localStorage

### Sistema de Checkout
- Formulario de información de contacto
- Formulario de dirección de envío
- Formulario de información de pago
- Confirmación de pedido con número único

### Filtrado y Búsqueda
- Filtrar por categoría
- Búsqueda en tiempo real
- Ordenar por nombre, precio o calificación

## 📱 Responsive Design

La aplicación está completamente optimizada para:
- Dispositivos móviles (320px+)
- Tablets (768px+)
- Escritorio (1024px+)

## 🔐 Seguridad

- Validación de formularios
- Protección de datos sensibles (simulación de checkout)
- Prácticas de seguridad en el manejo de estado

## 🚀 Próximas Mejoras

- Integración con backend real
- Sistema de autenticación de usuarios
- Procesamiento de pagos real
- Historial de pedidos
- Sistema de reseñas y calificaciones
- Integración con pasarela de pago

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👤 Autor

Andy - [@Andybetmp](https://github.com/Andybetmp)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerencias y mejoras.

---

Desarrollado con ❤️ usando React y Vite
