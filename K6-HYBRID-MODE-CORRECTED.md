# ✅ Solución Correcta: K6 Modo Híbrido

## ❌ El Problema que Tuvimos

Cuando usamos `k6 cloud script.js`, el test se ejecuta en **servidores de K6 Cloud en Columbus, Ohio** 🇺🇸.

Esos servidores intentan conectarse a `localhost:8080`, pero `localhost` para ellos es **su propio servidor**, no tu computadora.

**Resultado**: 29.2K HTTP failures (100% de errores) porque nunca llegaron a tu backend.

---

## ✅ La Solución: Modo Híbrido

Ejecutar el test **localmente en tu PC** pero enviar las métricas **al dashboard de K6 Cloud**.

### Comando Correcto

```powershell
# Configurar token
$env:K6_CLOUD_TOKEN="3745ae7d4bec32e8ce9a6894689b6fd89a2dd34dfec26d4b9627e300fd529e9c"

# Ejecutar en modo híbrido
& "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" run --out cloud k6-cloud-test.js
```

**Diferencia clave**:
- ❌ `k6 cloud` = Ejecuta en la nube (no puede ver tu localhost)
- ✅ `k6 run --out cloud` = Ejecuta local, métricas a la nube

---

## 🚀 Ejecutar Todos los Tests Correctamente

### 1. Load Test (9 minutos)

```powershell
$env:K6_CLOUD_TOKEN="3745ae7d4bec32e8ce9a6894689b6fd89a2dd34dfec26d4b9627e300fd529e9c"
& "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" run --out cloud k6-cloud-test.js
```

### 2. Stress Test (18 minutos)

```powershell
$env:K6_CLOUD_TOKEN="3745ae7d4bec32e8ce9a6894689b6fd89a2dd34dfec26d4b9627e300fd529e9c"
& "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" run --out cloud k6-stress-test.js
```

### 3. Spike Test (7 minutos)

```powershell
$env:K6_CLOUD_TOKEN="3745ae7d4bec32e8ce9a6894689b6fd89a2dd34dfec26d4b9627e300fd529e9c"
& "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" run --out cloud k6-spike-test.js
```

---

## 📊 Qué Verás Ahora (Correcto)

### Antes (Incorrecto) ❌
```
Load zones: 🇺🇸 Columbus
HTTP Failures: 29.2K (100%)
P95 Response Time: 0 ms
```

### Ahora (Correcto) ✅
```
Load zones: Local
HTTP Failures: < 5%
P95 Response Time: 100-500 ms (tiempos reales)
```

---

## ⚠️ Límite de Concurrencia

La cuenta gratuita de K6 Cloud solo permite **1 test a la vez**.

Si intentas ejecutar otro test mientras uno está corriendo, verás:

```
Max concurrency of 1 reached
```

**Solución**: Espera a que termine el test actual antes de ejecutar el siguiente.

---

## 🎯 Orden Recomendado de Ejecución

1. **Load Test** (9 min) - Primero para ver rendimiento normal
2. **Stress Test** (18 min) - Luego para ver límites
3. **Spike Test** (7 min) - Finalmente para ver recuperación

**Tiempo total**: ~34 minutos (ejecutados secuencialmente)

---

## 📈 Ventajas del Modo Híbrido

✅ **Ejecuta localmente**: Puede acceder a `localhost:8080`
✅ **Dashboard en la nube**: Gráficas profesionales en https://app.k6.io/
✅ **Sin límites de VUs**: Puedes usar 300-500 VUs si quieres
✅ **Datos reales**: Tiempos de respuesta y errores reales

---

## 🚀 Ejecutar con Más Carga (Sin Límites)

Si quieres probar con más VUs (ya que ejecutas local):

```powershell
# 300 VUs durante 5 minutos
$env:K6_CLOUD_TOKEN="3745ae7d4bec32e8ce9a6894689b6fd89a2dd34dfec26d4b9627e300fd529e9c"
& "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" run --out cloud --vus 300 --duration 5m k6-heavy-load-test.js
```

---

## 📊 Ver Resultados

Después de ejecutar cada test:

1. Ve a https://app.k6.io/
2. Verás el test listado con métricas reales
3. Dashboard mostrará:
   - VUs activos
   - Response times reales (no 0ms)
   - HTTP failures < 10%
   - Checks pasando

---

**Última actualización**: 2025-11-21 13:49
**Modo**: Híbrido (Local execution + Cloud metrics)
