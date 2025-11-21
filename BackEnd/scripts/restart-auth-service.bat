@echo off
echo ========================================
echo Reiniciando Auth Service (Puerto 8081)
echo ========================================
echo.
echo IMPORTANTE: Cierra la ventana del auth-service actual primero
echo Presiona cualquier tecla cuando hayas cerrado la ventana...
pause

cd c:\Users\andyj\Documents\git1\D-karitostoreApp\BackEnd

echo.
echo Iniciando auth-service con JWT deshabilitado...
echo.

Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd auth-service; mvn spring-boot:run' -WindowStyle Normal

echo.
echo ✅ Auth service reiniciado en nueva ventana
echo.
echo Ahora puedes probar en Postman:
echo   POST http://localhost:8081/auth/login
echo   POST http://localhost:8081/auth/register
echo.
echo Sin necesidad de JWT token!
echo.
pause
