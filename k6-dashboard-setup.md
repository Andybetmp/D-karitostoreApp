# 📊 K6 Dashboard - Guía de Configuración

## Opción 1: HTML Report (Más Rápido) ✅

### Ventajas
- ✅ No requiere instalación adicional
- ✅ Genera reporte visual automáticamente
- ✅ Funciona offline
- ✅ Fácil de compartir

### Cómo Usar

```powershell
# Ejecutar prueba de carga pesada (genera reporte automáticamente)
& "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" run k6-heavy-load-test.js
```

El reporte se generará automáticamente como `k6-report.html` al finalizar la prueba.

**Abrir el reporte:**
```powershell
Start-Process k6-report.html
```

---

## Opción 2: Grafana + InfluxDB (Dashboard en Tiempo Real) 🔥

### Ventajas
- ✅ Visualización en tiempo real
- ✅ Dashboards profesionales
- ✅ Histórico de pruebas
- ✅ Alertas configurables

### Instalación con Docker

#### 1. Crear docker-compose.yml

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

#### 2. Iniciar servicios

```powershell
docker-compose up -d
```

#### 3. Ejecutar k6 con salida a InfluxDB

```powershell
& "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" run `
  --out influxdb=http://localhost:8086/k6 `
  k6-heavy-load-test.js
```

#### 4. Configurar Grafana

1. Abrir http://localhost:3000
2. Login: `admin` / `admin123`
3. Agregar Data Source:
   - Type: InfluxDB
   - URL: http://influxdb:8086
   - Database: k6
4. Importar dashboard de k6:
   - Dashboard ID: `2587` (k6 Load Testing Results)

---

## Opción 3: K6 Cloud (Más Completo)

### Ventajas
- ✅ Dashboard profesional en la nube
- ✅ Comparación de pruebas
- ✅ Análisis avanzado
- ✅ Compartir resultados fácilmente

### Cómo Usar

1. Crear cuenta en https://app.k6.io/
2. Obtener token de API
3. Ejecutar:

```powershell
$env:K6_CLOUD_TOKEN="tu-token-aqui"
& "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" cloud k6-heavy-load-test.js
```

---

## 🎯 Prueba de Carga Pesada Configurada

### Perfil de Carga

```
Usuarios Virtuales (VUs)
800 |                    ╱╲
    |                   ╱  ╲
500 |              ╱───╯    ╲
    |             ╱           ╲
300 |        ╱───╯             ╲
    |       ╱                   ╲
100 |  ╱───╯                     ╲___
    | ╱                               ╲
  0 |_________________________________╲
    0  2  4  6  8 10 12 14 16 18 min
```

### Fases de la Prueba

| Fase | Duración | VUs | Objetivo |
|------|----------|-----|----------|
| 1 | 2 min | 100 | Calentamiento |
| 2 | 3 min | 300 | Carga media |
| 3 | 5 min | 500 | Carga alta |
| 4 | 3 min | 800 | **PICO MÁXIMO** |
| 5 | 2 min | 500 | Reducción |
| 6 | 2 min | 200 | Enfriamiento |
| 7 | 1 min | 0 | Finalización |

**Duración total**: ~18 minutos

### Métricas Monitoreadas

- ✅ Tasa de éxito de login (>85%)
- ✅ Tasa de éxito de registro (>80%)
- ✅ Tiempo de respuesta p95 (<3s)
- ✅ Tiempo de respuesta p99 (<5s)
- ✅ Tasa de errores HTTP (<10%)
- ✅ Duración de login (<2.5s)
- ✅ Duración de registro (<3s)

---

## 🚀 Comandos Rápidos

### Ejecutar con reporte HTML (Recomendado para empezar)
```powershell
& "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" run k6-heavy-load-test.js
```

### Ejecutar con menos carga (prueba rápida)
```powershell
& "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" run --duration 5m --vus 200 k6-heavy-load-test.js
```

### Ejecutar con más carga (extremo)
```powershell
& "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" run --vus 1000 --duration 10m k6-heavy-load-test.js
```

---

## 📈 Qué Monitorear Durante la Prueba

### En el Sistema
- CPU del servidor
- Memoria RAM
- Conexiones de base de datos
- Disco I/O

### En PostgreSQL
```sql
-- Ver conexiones activas
SELECT count(*) FROM pg_stat_activity;

-- Ver queries lentas
SELECT pid, now() - query_start as duration, query 
FROM pg_stat_activity 
WHERE state = 'active' 
ORDER BY duration DESC;
```

### En los Logs del Backend
- Errores de conexión a BD
- Timeouts
- Excepciones no manejadas

---

## ⚠️ Recomendaciones

1. **Primera vez**: Usa el reporte HTML (más simple)
2. **Producción**: Usa Grafana + InfluxDB (tiempo real)
3. **Compartir resultados**: Usa K6 Cloud
4. **Monitorea**: CPU, memoria y base de datos durante la prueba
5. **Incrementa gradualmente**: No empieces con 800 VUs, prueba primero con 100-200

---

**Última actualización**: 2025-11-21
