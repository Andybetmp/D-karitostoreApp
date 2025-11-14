# D'Karito Store Backend

A microservices-based e-commerce backend built with Spring Boot, featuring authentication, product management, inventory, orders, payments, and API gateway.

## Architecture

The backend consists of 6 microservices:

- **Auth Service** (Port 8081): User authentication and authorization with JWT
- **Product Service** (Port 8082): Product catalog management
- **Inventory Service** (Port 8083): Stock and inventory management
- **Order Service** (Port 8084): Order processing and management
- **Payment Service** (Port 8085): Payment processing
- **API Gateway** (Port 8080): Centralized API routing and load balancing

## Prerequisites

- **Java 17+**: Required for all Spring Boot services
- **Maven 3.6+**: For building the services
- **PostgreSQL**: Database for all services
- **Windows/Linux/Mac**: Operating system

## Database Setup

1. Install PostgreSQL and create a database named `dkarito`
2. Run the database setup script:
   ```sql
   psql -U postgres -d dkarito -f scripts/db-setup.sql
   ```

## Quick Start

### Option 1: Automated Setup (Windows)

1. Ensure Java and Maven are installed
2. Run the startup script:
   ```batch
   scripts\start-services.bat
   ```

### Option 2: Manual Setup

1. **Install Dependencies**:
   - Download and install Java 17+ from [Adoptium](https://adoptium.net/)
   - Download and install Maven from [maven.apache.org](https://maven.apache.org/download.cgi)

2. **Database Setup**:
   - Install PostgreSQL
   - Create database: `dkarito`
   - Run `scripts/db-setup.sql`

3. **Start Services**:
   ```bash
   # Build all services
   cd auth-service && mvn clean compile
   cd ../product-service && mvn clean compile
   cd ../inventory-service && mvn clean compile
   cd ../order-service && mvn clean compile
   cd ../payment-service && mvn clean compile
   cd ../api-gateway && mvn clean compile

   # Start services in separate terminals
   cd auth-service && mvn spring-boot:run
   cd product-service && mvn spring-boot:run
   cd inventory-service && mvn spring-boot:run
   cd order-service && mvn spring-boot:run
   cd payment-service && mvn spring-boot:run
   cd api-gateway && mvn spring-boot:run
   ```

## API Endpoints

Once all services are running, access:

- **API Gateway**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token

### Product Endpoints
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/{id}` - Update product (Admin)
- `DELETE /api/products/{id}` - Delete product (Admin)

### Order Endpoints
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/{id}` - Get order details

## Configuration

Each service has its own `application.yml` with database and service configurations. Key settings:

- **Database**: PostgreSQL connection details
- **JWT**: Secret key and expiration times
- **Service Discovery**: Eureka client configuration
- **API Gateway**: Routing rules

## Development

### Adding New Features

1. Choose the appropriate microservice
2. Add entities, DTOs, repositories, services, and controllers
3. Update API Gateway routes if needed
4. Test the service independently
5. Update database schema if required

### Testing

Each service includes unit and integration tests. Run tests with:
```bash
mvn test
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure no other applications use ports 8080-8085
2. **Database Connection**: Verify PostgreSQL is running and credentials are correct
3. **Maven Build Failures**: Clear Maven cache with `mvn clean`
4. **Service Discovery**: Check Eureka dashboard at http://localhost:8761

### Logs

Check service logs in the terminal where each service is running. Logs include:
- Startup information
- Database connections
- API requests/responses
- Error details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and add tests
4. Submit a pull request

## License

This project is licensed under the MIT License.
