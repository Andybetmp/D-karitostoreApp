# 📊 Opciones de Dashboard para K6 Load Testing

## ⚠️ Situación Actual

- ✅ K6 instalado y funcionando
- ✅ Prueba local exitosa (1219 iteraciones, 50 VUs)
- ❌ K6 Cloud tiene límites de VUs en cuenta gratuita
- ❌ Docker no está instalado (necesario para Grafana local)

---

## 🎯 Opciones Disponibles

### Opción 1: Instalar Docker Desktop (Recomendado) ⭐

**Ventajas:**
- Dashboard profesional en tiempo real
- Sin límites de VUs
- Visualización completa de métricas
- Gráficas interactivas

**Pasos:**

1. **Descargar Docker Desktop**
   - Ve a: https://www.docker.com/products/docker-desktop/
   - Descarga la versión para Windows
   - Instala y reinicia tu PC

2. **Iniciar Grafana + InfluxDB**
   ```powershell
   docker-compose -f docker-compose-k6-dashboard.yml up -d
   ```

3. **Configurar Dashboard**
   - Abre http://localhost:3000
   - Login: admin / admin123
   - Importa dashboard ID: 2587

4. **Ejecutar prueba con dashboard**
   ```powershell
   & "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" run `
     --out influxdb=http://localhost:8086/k6 `
     k6-heavy-load-test.js
   ```

**Tiempo estimado**: 15-20 minutos

---

### Opción 2: Salida JSON + Análisis Manual (Sin instalaciones)

**Ventajas:**
- No requiere instalaciones adicionales
- Datos completos para análisis
- Puedes generar gráficas en Excel/Python

**Pasos:**

```powershell
# Ejecutar con salida JSON
& "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" run `
  --out json=results.json `
  k6-heavy-load-test.js

# Ver resumen en consola
& "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" run k6-heavy-load-test.js
```

El archivo `results.json` contendrá todas las métricas para análisis posterior.

---

### Opción 3: K6 Cloud con VUs Reducidos

**Ventajas:**
- Dashboard automático en la nube
- No requiere instalaciones
- Fácil de compartir resultados

**Limitación:**
- Máximo ~50 VUs en cuenta gratuita

**Pasos:**

```powershell
# Configurar token
$env:K6_CLOUD_TOKEN="3745ae7d4bec32e8ce9a6894689b6fd89a2dd34dfec26d4b9627e300fd529e9c"

# Ejecutar en la nube con VUs reducidos
& "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" cloud k6-load-test.js
```

Luego ve a https://app.k6.io/ para ver el dashboard.

---

### Opción 4: Ejecutar Localmente y Ver Métricas en Consola (Más Rápido)

**Ventajas:**
- Inmediato, sin configuración
- Métricas en tiempo real en consola
- Sin límites de VUs

**Limitación:**
- No hay gráficas visuales

**Pasos:**

```powershell
# Prueba rápida (1 min, 50 VUs)
& "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" run --duration 1m --vus 50 k6-heavy-load-test.js

# Prueba completa (11 min, 400 VUs)
& "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" run k6-heavy-load-test.js

# Prueba extrema (500 VUs)
& "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" run --vus 500 --duration 5m k6-heavy-load-test.js
```

**Métricas que verás:**
```
✓ Login OK
✓ Has Token
✓ Register OK

checks.........................: 95.00% ✓ 2850  ✗ 150
http_req_duration..............: avg=125ms  p(95)=250ms  p(99)=500ms
http_reqs......................: 3000   50/s
login_success_rate.............: 96.00% ✓ 2400  ✗ 100
register_success_rate..........: 92.00% ✓ 460   ✗ 40
vus............................: 50     min=0   max=400
```

---

## 🎯 Mi Recomendación

**Para empezar AHORA (sin instalar nada):**
```powershell
& "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" run --vus 300 --duration 5m k6-heavy-load-test.js
```

**Para dashboard profesional (mejor experiencia):**
1. Instala Docker Desktop
2. Sigue los pasos de la Opción 1
3. Tendrás dashboard en tiempo real sin límites

---

## 📈 Comparación de Opciones

| Opción | Dashboard Visual | Tiempo Real | VUs Ilimitados | Instalación |
|--------|-----------------|-------------|----------------|-------------|
| **Docker + Grafana** | ✅ Profesional | ✅ Sí | ✅ Sí | Docker Desktop |
| **JSON + Análisis** | ❌ Manual | ❌ No | ✅ Sí | Ninguna |
| **K6 Cloud** | ✅ Profesional | ✅ Sí | ❌ ~50 VUs | Ninguna |
| **Consola** | ❌ Texto | ✅ Sí | ✅ Sí | Ninguna |

---

## 🚀 Ejecutar Ahora (Sin Dashboard)

Si quieres ejecutar la prueba de carga pesada AHORA mismo sin dashboard visual:

```powershell
# Prueba de 5 minutos con 300 VUs (carga pesada)
& "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" run `
  --vus 300 `
  --duration 5m `
  --summary-export=summary.json `
  k6-heavy-load-test.js
```

Esto te dará:
- Métricas en tiempo real en consola
- Resumen completo al final
- Archivo `summary.json` con todos los datos

---

**¿Qué prefieres hacer?**

1. Instalar Docker Desktop para dashboard completo (15-20 min)
2. Ejecutar prueba ahora sin dashboard visual (inmediato)
3. Usar K6 Cloud con VUs limitados (inmediato)

**Última actualización**: 2025-11-21
