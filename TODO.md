# Backend Setup and Testing TODO

## Database Setup
- [x] Execute db-setup.sql to create 'dkarito' database and tables
- [x] Confirm tables (users, products, inventory, orders, order_items, payments) and sample data created without errors

## Service Connections
- [x] Verify each microservice connects to PostgreSQL using application.yml credentials (localhost:5432/dkarito, postgres/postgres)

## Service Startup
- [x] Execute start-services.bat to build and start 6 microservices (auth:8081, product:8082, inventory:8083, order:8084, payment:8085) and API Gateway (8080)
- [x] Confirm all services start without failures

## API Testing and Fixes
- [ ] Fix auth login: Update DB password to valid BCrypt hash
- [ ] Add GET /api/inventory endpoint to inventory-service
- [ ] Add GET /api/payments endpoint to payment-service
- [ ] Test all APIs: auth, product, order, inventory, payment, gateway
- [ ] Verify gateway routes to services correctly

## Final Confirmation
- [ ] Confirm backend fully functional
- [ ] Report PgAdmin access: localhost:5432, database 'dkarito', user 'postgres'
