# D'Karito Store Backend

Backend completo para la aplicación D'Karito Store, implementado con arquitectura de microservicios usando Spring Boot 3.x y Java 17.

## Arquitectura

El backend está compuesto por 6 microservicios independientes:

- **auth-service**: Gestión de autenticación y autorización con JWT
- **product-service**: CRUD de productos y categorías
- **inventory-service**: Control de inventario y stock
- **order-service**: Gestión de pedidos y órdenes
- **payment-service**: Procesamiento de pagos simulados
- **api-gateway**: Gateway de API con enrutamiento y CORS

## Requisitos Previos

- Java 17 o superior
- Maven 3.6+
- PostgreSQL 12+ corriendo localmente
- Base de datos: `dkarito` con usuario `postgres` y contraseña `postgres`

## Configuración de Base de Datos

Crear la base de datos PostgreSQL:

```sql
CREATE DATABASE dkarito;
-- Usuario: postgres, Contraseña: postgres
```

Cada microservicio creará automáticamente sus tablas con `ddl-auto: update`.

## Ejecución de Microservicios

Cada microservicio se ejecuta independientemente. El orden recomendado es:

1. **auth-service** (puerto 8081)
2. **product-service** (puerto 8082)
3. **inventory-service** (puerto 8083)
4. **order-service** (puerto 8084)
5. **payment-service** (puerto 8085)
6. **api-gateway** (puerto 8080)

### Comandos para ejecutar cada servicio:

```bash
# Navegar al directorio del servicio
cd BackEnd/[service-name]

# Ejecutar con Maven
mvn spring-boot:run
```

### URLs de los servicios:

- **API Gateway**: http://localhost:8080
- **Auth Service**: http://localhost:8081 (directo) / http://localhost:8080/api/auth/** (via gateway)
- **Product Service**: http://localhost:8082 (directo) / http://localhost:8080/api/products/** (via gateway)
- **Inventory Service**: http://localhost:8083 (directo)
- **Order Service**: http://localhost:8084 (directo) / http://localhost:8080/api/orders/** (via gateway)
- **Payment Service**: http://localhost:8085 (directo) / http://localhost:8080/api/payments/** (via gateway)

## Documentación API

Cada microservicio incluye documentación Swagger/OpenAPI:

- Auth Service: http://localhost:8081/swagger-ui.html
- Product Service: http://localhost:8082/swagger-ui.html
- Order Service: http://localhost:8084/swagger-ui.html
- Payment Service: http://localhost:8085/swagger-ui.html
- API Gateway: http://localhost:8080/swagger-ui.html

## Endpoints Principales

### Auth Service
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login de usuario
- `GET /api/auth/me` - Perfil del usuario autenticado
- `POST /api/auth/refresh` - Refresh token

### Product Service
- `GET /api/products` - Lista de productos (con paginación y filtros)
- `GET /api/products/{id}` - Detalle de producto
- `POST /api/products` - Crear producto (ADMIN)
- `PUT /api/products/{id}` - Actualizar producto (ADMIN)
- `DELETE /api/products/{id}` - Eliminar producto (ADMIN)

### Order Service
- `GET /api/orders/user/{userId}` - Órdenes del usuario
- `POST /api/orders` - Crear nueva orden
- `GET /api/orders/{id}` - Detalle de orden
- `PUT /api/orders/{id}/status` - Actualizar estado de orden (ADMIN/RECEPTIONIST)

### Payment Service
- `POST /api/payments/charge` - Procesar pago
- `GET /api/payments/status/{orderId}` - Estado del pago

### Inventory Service
- `GET /api/inventory/{productId}` - Stock de producto
- `PUT /api/inventory/{productId}` - Actualizar stock (ADMIN)

## Seguridad

- **JWT Tokens**: Access token (15 min) y Refresh token (7 días)
- **Roles**: ADMIN, USER, RECEPTIONIST
- **Endpoints protegidos**: Solo auth-service tiene seguridad integrada
- **CORS**: Configurado para permitir `http://localhost:3000`

## Desarrollo

Para desarrollo local, ejecutar los servicios en el orden mencionado. El frontend React se conectará al API Gateway en `http://localhost:8080`.

## Notas Importantes

- Los servicios se comunican entre sí vía HTTP (sin Eureka/Service Discovery por simplicidad)
- El inventory-service se actualiza automáticamente cuando se crea una orden
- Los pagos son simulados (no integran pasarelas reales)
- Todas las tablas se crean automáticamente con JPA
