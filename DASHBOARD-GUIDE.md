# 🚀 Ejecutar Prueba de Carga Pesada con Dashboard

## Opción 1: K6 Cloud (Recomendado para tu caso) ✅

Ya tienes cuenta de K6 Cloud. Para ejecutar la prueba en la nube con dashboard en tiempo real:

### Paso 1: Ejecutar en K6 Cloud

```powershell
# Configurar token
$env:K6_CLOUD_TOKEN="3745ae7d4bec32e8ce9a6894689b6fd89a2dd34dfec26d4b9627e300fd529e9c"

# Ejecutar en la nube (dashboard automático)
& "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" cloud k6-heavy-load-test.js
```

**NOTA**: La cuenta gratuita de K6 Cloud tiene límites de VUs. Si recibes error E2004, reduce los VUs en el script o actualiza tu plan.

### Paso 2: Ver Dashboard

1. Abre https://app.k6.io/
2. Verás la prueba ejecutándose en tiempo real
3. Dashboard incluye:
   - Gráficas de VUs activos
   - Tiempos de respuesta (p95, p99)
   - Tasa de errores
   - Métricas personalizadas

---

## Opción 2: Ejecutar Localmente (Sin Dashboard Visual)

Si prefieres ejecutar localmente y ver métricas en consola:

```powershell
# Ejecutar localmente
& "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" run k6-heavy-load-test.js

# Con salida JSON para análisis posterior
& "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" run --out json=results.json k6-heavy-load-test.js
```

---

## Opción 3: Grafana + InfluxDB (Dashboard Local en Tiempo Real)

### Requisitos
- Docker Desktop instalado

### Paso 1: Crear docker-compose.yml

```yaml
version: '3.8'

services:
  influxdb:
    image: influxdb:1.8
    ports:
      - "8086:8086"
    environment:
      - INFLUXDB_DB=k6
      - INFLUXDB_ADMIN_USER=admin
      - INFLUXDB_ADMIN_PASSWORD=admin123
    volumes:
      - influxdb-data:/var/lib/influxdb

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin123
    volumes:
      - grafana-data:/var/lib/grafana
    depends_on:
      - influxdb

volumes:
  influxdb-data:
  grafana-data:
```

### Paso 2: Iniciar Servicios

```powershell
# En el directorio donde guardaste docker-compose.yml
docker-compose up -d
```

### Paso 3: Ejecutar k6 con InfluxDB

```powershell
& "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" run `
  --out influxdb=http://localhost:8086/k6 `
  k6-heavy-load-test.js
```

### Paso 4: Configurar Grafana

1. Abre http://localhost:3000
2. Login: `admin` / `admin123`
3. Agregar Data Source:
   - Type: InfluxDB
   - URL: http://influxdb:8086
   - Database: k6
   - Click "Save & Test"
4. Importar Dashboard:
   - Click "+" → "Import"
   - Dashboard ID: `2587`
   - Selecciona tu data source InfluxDB
   - Click "Import"

---

## 📊 Configuración de la Prueba

### Perfil de Carga (400 VUs máximo)

```
VUs
400 |              ╱╲
    |             ╱  ╲
300 |        ╱───╯    ╲
    |       ╱           ╲
150 |   ╱──╯             ╲
    |  ╱                  ╲___
 50 | ╱                       ╲
    |╱                         ╲
  0 |___________________________╲
    0  1  3  5  8 10 11 min
```

### Métricas Monitoreadas

- **Login Success Rate**: >85%
- **Register Success Rate**: >80%
- **HTTP Errors**: <10%
- **Response Time p95**: <3s
- **Response Time p99**: <5s
- **Login Duration p95**: <2.5s
- **Register Duration p95**: <3s

---

## ⚡ Comandos Rápidos

### Prueba Rápida (2 minutos, 100 VUs)
```powershell
& "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" run --duration 2m --vus 100 k6-heavy-load-test.js
```

### Prueba Completa (11 minutos, 400 VUs)
```powershell
& "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" run k6-heavy-load-test.js
```

### Prueba Extrema (500 VUs)
```powershell
& "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" run --vus 500 --duration 5m k6-heavy-load-test.js
```

---

## 🎯 Recomendación

**Para tu caso, te recomiendo:**

1. **Primero**: Ejecuta localmente con pocos VUs para verificar que todo funciona
   ```powershell
   & "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" run --duration 1m --vus 50 k6-heavy-load-test.js
   ```

2. **Luego**: Intenta ejecutar en K6 Cloud para ver el dashboard visual
   ```powershell
   $env:K6_CLOUD_TOKEN="3745ae7d4bec32e8ce9a6894689b6fd89a2dd34dfec26d4b9627e300fd529e9c"
   & "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" cloud k6-heavy-load-test.js
   ```

3. **Si K6 Cloud tiene límites**: Configura Grafana + InfluxDB para dashboard local

---

**Última actualización**: 2025-11-21
