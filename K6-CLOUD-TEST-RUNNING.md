# ✅ Prueba de Carga en K6 Cloud - En Ejecución

## 🎯 Estado Actual

**✅ Test ejecutándose en K6 Cloud**

- **Test Run ID**: 6131506
- **Duración**: 9 minutos
- **VUs Máximos**: 50 usuarios concurrentes
- **Perfil de Carga**:
  - 0-1 min: Rampa a 10 VUs
  - 1-3 min: Incremento a 25 VUs
  - 3-6 min: Carga máxima 50 VUs
  - 6-8 min: Reducción a 30 VUs
  - 8-9 min: Finalización

---

## 📊 Acceder al Dashboard

### Opción 1: URL Directa (Recomendado)

Abre tu navegador en:

```
https://app.k6.io/runs/6131506
```

### Opción 2: Portal de K6 Cloud

1. Ve a: **https://app.k6.io/**
2. Inicia sesión con tu cuenta
3. Verás el test "D'Karito Store - Load Test en K6 Cloud" ejecutándose

---

## 📈 Qué Verás en el Dashboard

### Métricas en Tiempo Real

- **Virtual Users**: Gráfica de usuarios activos (0-50)
- **Request Rate**: Requests por segundo
- **Response Time**: 
  - Promedio
  - p95 (95% bajo este valor)
  - p99 (99% bajo este valor)
- **Error Rate**: Porcentaje de errores HTTP
- **Checks**: Validaciones que pasan/fallan
  - Login: Status 200
  - Login: Has Token
  - Login: Fast Response
  - Register: Status 200/201
  - Register: Has Token
  - Register: Fast Response

### Métricas Personalizadas

- `login_success_rate`: Tasa de éxito de logins (objetivo >95%)
- `register_success_rate`: Tasa de éxito de registros (objetivo >90%)
- `login_duration`: Tiempo de login
- `register_duration`: Tiempo de registro
- `login_errors`: Contador de errores de login
- `register_errors`: Contador de errores de registro

### Thresholds (Umbrales)

El test pasará si cumple:
- ✅ Errores HTTP < 5%
- ✅ Response time p95 < 2 segundos
- ✅ Response time p99 < 3 segundos
- ✅ Login success rate > 95%
- ✅ Register success rate > 90%

---

## 🔍 Análisis del Dashboard

### Gráficas Principales

1. **VUs (Virtual Users)**
   - Muestra cuántos usuarios virtuales están activos
   - Verás la rampa de 10 → 25 → 50 → 30 → 0

2. **HTTP Request Duration**
   - Tiempo de respuesta de las peticiones
   - Busca que p95 se mantenga bajo 2s

3. **HTTP Requests**
   - Total de requests ejecutados
   - Requests por segundo (RPS)

4. **Checks**
   - Porcentaje de validaciones exitosas
   - Debe estar cerca del 100%

5. **HTTP Failures**
   - Errores HTTP (400, 500, etc.)
   - Debe ser cercano a 0%

---

## 📱 Endpoints Testeados

### Login (80% del tráfico)
```
POST /api/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}
```

### Register (20% del tráfico)
```
POST /api/auth/register
{
  "name": "Usuario Aleatorio",
  "email": "k6test_[unique]@test.com",
  "password": "K6Test123!"
}
```

---

## ⏱️ Timeline del Test

```
VUs
50  |              ╱────────╮
    |             ╱          ╲
25  |        ╱───╯            ╲___
    |       ╱                     ╲
10  |  ╱───╯                       ╲
    | ╱                             ╲
 0  |╯                               ╲
    0  1  2  3  4  5  6  7  8  9 min
```

---

## 🎯 Resultados Esperados

Si todo funciona correctamente, deberías ver:

- ✅ **Login Success Rate**: ~98-100%
- ✅ **Register Success Rate**: ~95-98%
- ✅ **Response Time p95**: 100-500ms
- ✅ **Response Time p99**: 200-800ms
- ✅ **HTTP Errors**: 0-2%
- ✅ **Total Requests**: ~2000-3000

---

## 📊 Después del Test

Cuando el test termine (9 minutos), el dashboard mostrará:

1. **Summary**: Resumen completo de métricas
2. **Performance Insights**: Análisis automático
3. **Thresholds**: Si pasaron o fallaron
4. **Checks**: Detalle de validaciones
5. **HTTP Metrics**: Estadísticas completas

Puedes:
- Descargar el reporte en PDF
- Compartir el link del test
- Comparar con tests anteriores
- Exportar datos en JSON/CSV

---

## 🔗 Links Útiles

- **Dashboard del Test**: https://app.k6.io/runs/6131506
- **Portal K6 Cloud**: https://app.k6.io/
- **Documentación K6**: https://k6.io/docs/

---

## 🚀 Próximos Pasos

1. **Monitorea el dashboard** mientras el test corre
2. **Revisa los resultados** cuando termine
3. **Analiza los bottlenecks** si hay problemas
4. **Ajusta el backend** según los resultados

Si quieres más carga después, puedes:
- Instalar Docker para dashboard local sin límites
- Ejecutar localmente con 300-500 VUs
- Actualizar tu plan de K6 Cloud

---

**Test iniciado**: 2025-11-21 13:09
**Duración estimada**: 9 minutos
**Finalización aproximada**: 13:18

🌐 **Abre el dashboard ahora**: https://app.k6.io/runs/6131506
