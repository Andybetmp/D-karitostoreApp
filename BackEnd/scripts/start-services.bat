@echo off
echo Starting D'Karito Store Backend Services...

REM Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed. Please install Java 17 or higher.
    pause
    exit /b 1
)

REM Check if Maven is installed
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Maven is not installed. Please install Maven 3.6+.
    echo You can download it from: https://maven.apache.org/download.cgi
    pause
    exit /b 1
)

REM Check if PostgreSQL is running (basic check)
netstat -an | find "5432" >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: PostgreSQL may not be running on port 5432.
    echo Please ensure PostgreSQL is running and the 'dkarito' database exists.
    echo.
)

echo Building and starting services in order...

REM Build all services
echo Building auth-service...
cd auth-service
call mvn clean package -DskipTests -q
if %errorlevel% neq 0 (
    echo ERROR: Failed to build auth-service
    cd ..
    pause
    exit /b 1
)
cd ..

echo Building product-service...
cd product-service
call mvn clean compile -q
if %errorlevel% neq 0 (
    echo ERROR: Failed to build product-service
    cd ..
    pause
    exit /b 1
)
cd ..

echo Building inventory-service...
cd inventory-service
call mvn clean compile -q
if %errorlevel% neq 0 (
    echo ERROR: Failed to build inventory-service
    cd ..
    pause
    exit /b 1
)
cd ..

echo Building order-service...
cd order-service
call mvn clean compile -q
if %errorlevel% neq 0 (
    echo ERROR: Failed to build order-service
    cd ..
    pause
    exit /b 1
)
cd ..

echo Building payment-service...
cd payment-service
call mvn clean compile -q
if %errorlevel% neq 0 (
    echo ERROR: Failed to build payment-service
    cd ..
    pause
    exit /b 1
)
cd ..

echo Building api-gateway...
cd api-gateway
call mvn clean compile -q
if %errorlevel% neq 0 (
    echo ERROR: Failed to build api-gateway
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo All services built successfully!
echo.
echo Starting services in new command windows...
echo Close the windows to stop the services.
echo.

REM Start services in separate windows
start "Auth Service (Port 8081)" cmd /k "cd auth-service && java -jar target/auth-service-0.0.1-SNAPSHOT.jar"
timeout /t 5 /nobreak >nul

start "Product Service (Port 8082)" cmd /k "cd product-service && call mvn spring-boot:run"
timeout /t 3 /nobreak >nul

start "Inventory Service (Port 8083)" cmd /k "cd inventory-service && call mvn spring-boot:run"
timeout /t 3 /nobreak >nul

start "Order Service (Port 8084)" cmd /k "cd order-service && call mvn spring-boot:run"
timeout /t 3 /nobreak >nul

start "Payment Service (Port 8085)" cmd /k "cd payment-service && call mvn spring-boot:run"
timeout /t 3 /nobreak >nul

start "API Gateway (Port 8080)" cmd /k "cd api-gateway && call mvn spring-boot:run"

echo.
echo Services starting up...
echo API Gateway will be available at: http://localhost:8080
echo Swagger UI: http://localhost:8080/swagger-ui.html
echo.
echo Press any key to exit this window (services will continue running)
pause >nul
