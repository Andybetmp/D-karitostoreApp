hby# D-karitostoreApp

A full-stack e-commerce application built with modern technologies, featuring a microservices backend architecture and a responsive React frontend.

## 🏗️ Architecture Overview

This project implements a complete e-commerce platform with:

- **Frontend**: React 17 with TypeScript, Material-UI, and smooth animations
- **Backend**: 5 independent microservices built with Spring Boot 3.x
- **Database**: PostgreSQL with JPA/Hibernate
- **Authentication**: JWT-based with role-based access control
- **API Documentation**: Swagger/OpenAPI for all services

## 📁 Project Structure

```
D-karitostoreApp/
├── FrontEnd/app/          # React TypeScript application
├── BackEnd/               # Microservices backend
│   ├── auth-service/      # Authentication & authorization
│   ├── product-service/   # Product catalog management
│   ├── inventory-service/ # Stock and inventory control
│   ├── order-service/     # Order processing and management
│   ├── payment-service/   # Payment processing (simulated)
│   └── api-gateway/       # API gateway (planned)
└── README.md
```

## 🚀 Features

### Frontend Features
- **Responsive Design**: Mobile-first approach with Material-UI
- **Smooth Animations**: Powered by Framer Motion and Locomotive Scroll
- **Authentication**: Login/Signup with Google OAuth integration
- **Shopping Cart**: Persistent cart with floating button access
- **Product Browsing**: Paginated product listings with search and filters
- **Checkout Process**: Complete order flow with payment simulation
- **Admin Panel**: Placeholder for administrative functions

### Backend Features
- **Microservices Architecture**: Independent, scalable services
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: ADMIN, USER, and RECEPTIONIST roles
- **RESTful APIs**: Well-documented endpoints with Swagger
- **Database Integration**: PostgreSQL with automatic schema management
- **Service Communication**: HTTP-based inter-service communication
- **Health Monitoring**: Spring Boot Actuator endpoints

## 🛠️ Technology Stack

### Frontend
- **React 17** - UI framework
- **TypeScript** - Type safety
- **Material-UI** - Component library
- **Framer Motion** - Animations
- **React Router** - Client-side routing
- **Styled Components** - CSS-in-JS
- **Locomotive Scroll** - Smooth scrolling
- **React OAuth Google** - Google authentication

### Backend
- **Java 17** - Programming language
- **Spring Boot 3.x** - Framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Data persistence
- **PostgreSQL** - Database
- **Swagger/OpenAPI** - API documentation
- **Maven** - Build tool

## 📋 Prerequisites

- **Java 17** or higher
- **Node.js 16+** and npm
- **PostgreSQL 12+** running locally
- **Maven 3.6+**

### Database Setup

Create the PostgreSQL database:

```sql
CREATE DATABASE dkarito;
-- Default credentials: username: postgres, password: postgres
```

## 🔧 Installation & Setup

### Backend Setup

1. **Navigate to Backend directory:**
   ```bash
   cd BackEnd
   ```

2. **Start each microservice in separate terminals:**

   ```bash
   # Auth Service (Port 8081)
   cd auth-service && mvn spring-boot:run

   # Product Service (Port 8082)
   cd product-service && mvn spring-boot:run

   # Inventory Service (Port 8083)
   cd inventory-service && mvn spring-boot:run

   # Order Service (Port 8084)
   cd order-service && mvn spring-boot:run

   # Payment Service (Port 8085)
   cd payment-service && mvn spring-boot:run
   ```

### Frontend Setup

1. **Navigate to Frontend directory:**
   ```bash
   cd FrontEnd/app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## 🌐 Service Endpoints

### Authentication Service (Port 8081)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user profile

### Product Service (Port 8082)
- `GET /api/products` - List products (paginated)
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product (ADMIN)
- `PUT /api/products/{id}` - Update product (ADMIN)
- `DELETE /api/products/{id}` - Delete product (ADMIN)
- `GET /api/products/search?keyword={term}` - Search products

### Order Service (Port 8084)
- `GET /api/orders/user/{userId}` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/{id}` - Get order details
- `PUT /api/orders/{id}/status` - Update order status (ADMIN/RECEPTIONIST)

### Payment Service (Port 8085)
- `POST /api/payments` - Create payment
- `GET /api/payments/order/{orderId}` - Get payment by order
- `POST /api/payments/order/{orderId}/process` - Process payment

### Inventory Service (Port 8083)
- `GET /api/inventory/{productId}` - Get product stock
- `PUT /api/inventory/{productId}` - Update stock (ADMIN)

## 📚 API Documentation

Each microservice provides Swagger documentation:

- **Auth Service**: http://localhost:8081/swagger-ui.html
- **Product Service**: http://localhost:8082/swagger-ui.html
- **Order Service**: http://localhost:8084/swagger-ui.html
- **Payment Service**: http://localhost:8085/swagger-ui.html

## 🔐 Authentication & Authorization

The application uses JWT tokens with the following roles:

- **USER**: Regular customers
- **ADMIN**: Full system access
- **RECEPTIONIST**: Order management access

### JWT Configuration
- **Access Token**: 15 minutes expiration
- **Refresh Token**: 7 days expiration
- **Secret Key**: Configurable in `application.yml`

## 🗄️ Database Schema

The application uses 5 main entities:

- **Users**: Authentication and profile data
- **Products**: Catalog items with pricing and descriptions
- **Inventory**: Stock levels for products
- **Orders**: Customer orders with items
- **Payments**: Payment records for orders

All tables are created automatically using JPA with `ddl-auto: update`.

## 🚀 Deployment

### Development
- Frontend: `npm start` (hot reload enabled)
- Backend: `mvn spring-boot:run` for each service

### Production
- Frontend: `npm run build` then serve static files
- Backend: Package as JAR with `mvn clean package`

## 🧪 Testing

### Backend Testing
```bash
# Run tests for a specific service
cd BackEnd/{service-name}
mvn test
```

### Frontend Testing
```bash
cd FrontEnd/app
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions or issues, please create an issue in the repository or contact the development team.

---

**Note**: This is a development/demo application. For production use, additional security measures, monitoring, and scalability considerations should be implemented.
