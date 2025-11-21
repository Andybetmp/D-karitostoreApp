@echo off
echo Cargando datos de prueba en la base de datos...
echo.

REM Cambiar a la carpeta de PostgreSQL
cd "C:\Program Files\PostgreSQL\18\bin"

REM Ejecutar el script SQL
echo Ejecutando test-data.sql...
psql -U postgres -d dkarito -f "C:\Users\andyj\Documents\git1\D-karitostoreApp\BackEnd\scripts\test-data.sql"

if %errorlevel% equ 0 (
    echo.
    echo ✅ Datos cargados exitosamente!
    echo.
    echo Ahora puedes usar estos usuarios en Postman:
    echo - admin@dkarito.com (password: password123)
    echo - john.doe@example.com (password: password123)
    echo - jane.smith@example.com (password: password123)
) else (
    echo.
    echo ❌ Error al cargar los datos
    echo Verifica que PostgreSQL esté corriendo y la contraseña sea correcta
)

echo.
pause
