# 🏗️ Arquitectura del Backend - D'Karito Store

Este documento detalla la estructura, funcionamiento e interacción de los microservicios del backend.

## 1. Visión General

El backend está construido utilizando una arquitectura de **Microservicios con Spring Boot**, orquestados por un **API Gateway**.

- **Tecnología Principal**: Java 17, Spring Boot 3.
- **Base de Datos**: PostgreSQL (Compartida - `dkarito`).
- **Seguridad**: JWT (JSON Web Tokens).
- **Enrutamiento**: Spring Cloud Gateway.

---

## 2. Mapa de Servicios

| Servicio | Puerto | Responsabilidad | Base de Datos |
|----------|--------|-----------------|---------------|
| **API Gateway** | `8080` | Punto de entrada único, enrutamiento a microservicios. | N/A |
| **Auth Service** | `8081` | Registro, Login, Generación de JWT, Gestión de Usuarios. | `dkarito` (users) |
| **Product Service** | `8082` | Catálogo de productos, categorías, precios. | `dkarito` (products) |
| **Inventory Service** | `8083` | Control de stock y disponibilidad. | `dkarito` (inventory) |
| **Order Service** | `8084` | Creación y gestión de órdenes de compra. | `dkarito` (orders) |
| **Payment Service** | `8085` | Procesamiento de pagos (Simulado). | `dkarito` (payments) |

---

## 3. Flujo de Interacción

A diferencia de arquitecturas complejas con comunicación entre servicios (Feign/Kafka), este sistema utiliza un patrón de **Servicios Independientes** donde la orquestación recae principalmente en el **Frontend** y la base de datos compartida.

### 🔄 Flujo de Compra Típico

1.  **Autenticación**
    -   Frontend → **Gateway (8080)** → `/api/auth/login` → **Auth Service (8081)**
    -   Respuesta: Token JWT.

2.  **Navegación**
    -   Frontend → **Gateway** → `/api/products` → **Product Service (8082)**
    -   Frontend obtiene detalles del producto (ID, Precio, Nombre).

3.  **Verificación de Stock** (Orquestado por Frontend)
    -   Frontend → **Gateway** → `/api/inventory/{id}` → **Inventory Service (8083)**
    -   Valida si hay cantidad suficiente.

4.  **Creación de Orden**
    -   Frontend envía payload con items y usuario.
    -   Frontend → **Gateway** → `/api/orders` → **Order Service (8084)**
    -   *Nota*: El Order Service guarda la orden directamente. No valida stock internamente (confía en la validación previa o constraints).

---

## 4. Estructura de Datos (Base de Datos Compartida)

Todos los servicios se conectan a la misma base de datos física (`dkarito`), lo que simplifica la infraestructura pero acopla los servicios a nivel de datos.

-   **Auth Service**: Tabla `users`, `roles`.
-   **Product Service**: Tabla `products`, `categories`.
-   **Order Service**: Tablas `orders`, `order_items`.
-   **Inventory Service**: Tabla `inventory`.

---

## 5. Configuración Clave

### API Gateway (`application.yml`)
Define las rutas que exponen los microservicios al mundo exterior:

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: auth-service
          uri: http://localhost:8081
          predicates: - Path=/api/auth/**
        - id: product-service
          uri: http://localhost:8082
          predicates: - Path=/api/products/**
        # ... otros servicios
```

### Seguridad (Auth Service)
-   Utiliza `Spring Security` y `JJWT`.
-   Endpoints protegidos requieren header `Authorization: Bearer <token>`.
-   Actualmente configurado con `spring.security.enabled: false` (temporalmente para pruebas) o validación estándar.

---

## 6. Cómo Trabajar con el Backend

1.  **Levantar Servicios**:
    -   Se deben iniciar los 6 servicios (Gateway + 5 Microservicios).
    -   Orden recomendado: Config Server (si existe) -> Discovery (si existe) -> Microservicios -> Gateway.
    -   En este caso (sin Eureka/Config): Iniciar en cualquier orden, pero Gateway al final para asegurar rutas.

2.  **Pruebas**:
    -   Usar Postman o k6 contra el puerto `8080` (Gateway).
    -   No atacar puertos directos (8081, etc.) a menos que sea para depuración específica.

3.  **Logs**:
    -   Cada servicio tiene su propia consola/log.
    -   Para rastrear un error, verificar primero el log del Gateway y luego el del servicio específico.
