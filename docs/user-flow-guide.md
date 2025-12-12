# Guía de Flujo de Usuario - D'KaritoStore

Esta guía proporciona instrucciones paso a paso para verificar los flujos funcionales de la aplicación, incluyendo el Tablero de Gestión (Dashboard), Registro de Productos y Flujo de Compra del Cliente.

## Prerrequisitos

1.  **Base de Datos**: Asegúrate de que PostgreSQL esté en ejecución y exista la base de datos `dkarito`.
2.  **Backend**: Todos los microservicios deben estar corriendo (Auth, Product, Inventory, Order, Payment, Gateway).
    *   URL del Gateway: `http://localhost:8080`
3.  **Frontend**: La aplicación React debe estar en ejecución.
    *   URL: `http://localhost:3000` (o `3001` si el puerto 3000 está ocupado)

## 1. Registro e Inicio de Sesión de Usuario

### Registrar un Nuevo Usuario
1.  Abre la aplicación en tu navegador.
2.  Haz clic en el icono de **Perfil/Login** en el encabezado.
3.  Haz clic en **"¿No tienes cuenta? Regístrate"** (o enlace similar).
4.  Completa el formulario de registro:
    *   **Nombre**: `Usuario Prueba`
    *   **Email**: `test@example.com`
    *   **Contraseña**: `password123`
5.  Envía el formulario. Deberías ser redirigido o iniciar sesión automáticamente.

### Iniciar Sesión (si no se inició automáticamente)
1.  Ve a la página de Login.
2.  Ingresa `test@example.com` y `password123`.
3.  Haz clic en **Login**.
4.  Verifica que tu nombre aparezca en el encabezado o menú de perfil.

## 2. Registro de Producto (Admin)

*> Nota: Asegúrate de que tu usuario tenga el rol `ADMIN`. Si no, es posible que debas actualizar manualmente el rol del usuario en la base de datos para este paso: `UPDATE users SET roles = ARRAY['ADMIN'] WHERE email = 'test@example.com';` (ajusta según la estructura real de la tabla).*

1.  Navega al **Dashboard** (usualmente vía `/dashboard` o un ítem de menú visible para admins).
2.  Ve a la sección **Productos** (`/dashboard/products`).
3.  Haz clic en **"Agregar Nuevo Producto"**.
4.  Completa los detalles del producto:
    *   **Título**: `Producto Verificado Increíble`
    *   **Descripción**: `Este es un producto de prueba.`
    *   **Precio**: `99.99`
    *   **URL de Imagen**: `https://images.unsplash.com/photo-1523275335684-37898b6baf30` (o cualquier URL válida)
    *   **Stock**: `100`
5.  Haz clic en **Guardar/Crear**.
6.  Verifica que el nuevo producto aparezca en la lista.

## 3. Flujo de Compra del Cliente

1.  Ve a la página de **Tienda** (`/shop`).
2.  Busca el `Producto Verificado Increíble` que acabas de crear.
3.  Haz clic en **"Agregar al Carrito"**.
4.  Abre el **Carrito** (haz clic en el icono flotante o en el encabezado).
5.  Haz clic en **"Proceder al Pago"**.
6.  **Formulario de Checkout**:
    *   Completa los detalles de envío (Nombre, Dirección, Teléfono).
    *   Selecciona Método de Pago (Tarjeta).
    *   Ingresa detalles de tarjeta ficticios (ej. `1234 5678 9012 3456`, `12/25`, `123`).
7.  Haz clic en **"Confirmar Compra"**.
8.  Deberías ver un **Mensaje de Éxito**.

## 4. Verificar Estadísticas del Dashboard

1.  Navega de nuevo al **Dashboard** (`/dashboard`).
2.  Revisa la tarjeta **"Today's Sales"** (Ventas de Hoy).
    *   Debería reflejar el monto de la compra reciente (ej. `$99.99`).
    *   El conteo de **"Total Orders"** debería haber incrementado.
3.  Revisa la sección **"Top Products"**.
    *   `Producto Verificado Increíble` debería aparecer en la lista con `Ventas: 1` (o la cantidad comprada).

## Resumen de Cambios

- **Backend**:
    - Se agregó `DashboardController` y `TopProductDto` al `order-service` para servir estadísticas de ventas.
    - Se actualizó `OrderRepository` con consultas de agregación.
- **Frontend**:
    - Se crearon `dashboardService.ts` y `orderService.ts`.
    - Se actualizaron los componentes `TodaysSales` y `TopProducts` para obtener datos reales.
    - Se actualizó `CheckoutForm` para enviar pedidos reales al backend.

## Limitaciones Conocidas

- **Seguridad**: Los microservicios del backend (excepto Gateway/Auth) pueden necesitar filtros de validación JWT más estrictos bloqueados por defecto, aunque el código confía en el Gateway.
- **Manejo de Errores**: Los errores de red se registran en la consola; las alertas/toasts amigables para el usuario podrían mejorarse.
- **Roles**: La asignación del rol de administrador actualmente requiere acceso a base de datos o pre-semilla.
