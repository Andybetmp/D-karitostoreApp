# 🚀 Guía Rápida: Dashboard de K6 con Grafana

## ✅ Solución Recomendada: Grafana + InfluxDB (Dashboard Local)

Tu cuenta de K6 Cloud tiene límites de VUs. La mejor solución es usar Grafana + InfluxDB localmente para tener un dashboard profesional sin límites.

---

## 📋 Paso 1: Iniciar Grafana e InfluxDB

```powershell
# Iniciar servicios con Docker
docker-compose -f docker-compose-k6-dashboard.yml up -d

# Verificar que están corriendo
docker ps
```

Deberías ver dos contenedores:
- `k6-influxdb` en puerto 8086
- `k6-grafana` en puerto 3000

---

## 📊 Paso 2: Acceder a Grafana

1. Abre tu navegador en: **http://localhost:3000**
2. Login:
   - Usuario: `admin`
   - Contraseña: `admin123`

---

## 🎯 Paso 3: Importar Dashboard de K6

1. En Grafana, click en **"+"** → **"Import"**
2. Ingresa el ID del dashboard: **`2587`**
3. Click **"Load"**
4. Selecciona el datasource: **"InfluxDB-K6"**
5. Click **"Import"**

¡Listo! Ya tienes el dashboard configurado.

---

## 🚀 Paso 4: Ejecutar Prueba de Carga con Dashboard

```powershell
# Ejecutar k6 enviando métricas a InfluxDB
& "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" run `
  --out influxdb=http://localhost:8086/k6 `
  k6-heavy-load-test.js
```

**Mientras la prueba corre:**
- Ve a http://localhost:3000
- Abre el dashboard "k6 Load Testing Results"
- Verás las métricas en tiempo real 📈

---

## 📈 Qué Verás en el Dashboard

- **Virtual Users**: Gráfica de usuarios activos
- **Request Rate**: Requests por segundo
- **Response Time**: p95, p99, promedio
- **Error Rate**: Porcentaje de errores
- **Checks**: Tasa de éxito de validaciones
- **HTTP Duration**: Tiempos de respuesta por endpoint
- **Custom Metrics**: login_success_rate, register_success_rate, etc.

---

## ⚡ Comandos Rápidos

### Prueba Rápida (1 min, 50 VUs)
```powershell
& "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" run `
  --out influxdb=http://localhost:8086/k6 `
  --duration 1m --vus 50 `
  k6-heavy-load-test.js
```

### Prueba Completa (11 min, 400 VUs)
```powershell
& "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" run `
  --out influxdb=http://localhost:8086/k6 `
  k6-heavy-load-test.js
```

### Prueba Extrema (500 VUs)
```powershell
& "$env:TEMP\k6\k6-v0.48.0-windows-amd64\k6.exe" run `
  --out influxdb=http://localhost:8086/k6 `
  --vus 500 --duration 5m `
  k6-heavy-load-test.js
```

---

## 🛑 Detener Servicios

Cuando termines:

```powershell
docker-compose -f docker-compose-k6-dashboard.yml down
```

Para eliminar también los datos:

```powershell
docker-compose -f docker-compose-k6-dashboard.yml down -v
```

---

## 🔧 Troubleshooting

### Docker no está instalado
Descarga Docker Desktop: https://www.docker.com/products/docker-desktop/

### Puerto 3000 ya está en uso
```powershell
# Cambiar puerto de Grafana en docker-compose-k6-dashboard.yml
# Línea 23: "3001:3000" en lugar de "3000:3000"
```

### No se ven métricas en Grafana
1. Verifica que InfluxDB esté corriendo: `docker ps`
2. Verifica la conexión: http://localhost:8086/ping
3. Asegúrate de usar `--out influxdb=http://localhost:8086/k6` en k6

---

## 📸 Ejemplo de Dashboard

El dashboard mostrará:

```
┌─────────────────────────────────────────────────┐
│ Virtual Users                                   │
│ 400 ┤                    ╭─╮                    │
│     │                  ╭─╯ ╰─╮                  │
│ 200 ┤              ╭───╯     ╰───╮              │
│     │          ╭───╯               ╰───╮        │
│   0 ┴──────────╯                       ╰────────│
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ HTTP Request Duration (p95)                     │
│ 3s  ┤                                           │
│ 2s  ┤  ─────────────────────────────────────    │
│ 1s  ┤                                           │
│ 0s  ┴───────────────────────────────────────────│
└─────────────────────────────────────────────────┘
```

---

**¡Listo!** Ahora tienes un dashboard profesional para visualizar tus pruebas de carga sin límites de VUs.

**Última actualización**: 2025-11-21
