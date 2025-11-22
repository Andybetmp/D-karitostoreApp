# 📊 Guía de Pruebas de Carga con k6

Esta carpeta contiene scripts de pruebas de rendimiento para la aplicación D-karitostore usando k6.

## 📋 Requisitos Previos

1. **Instalar k6**:
   ```bash
   # Windows (usando Chocolatey)
   choco install k6

   # O descargar desde: https://k6.io/docs/getting-started/installation/
   ```

2. **Backend en ejecución**:
   - Asegúrate de que tu backend esté corriendo en `http://localhost:8080`
   - Verifica que el servicio de autenticación esté activo

3. **Datos de prueba**:
   - Crea usuarios de prueba en tu base de datos
   - Usuario por defecto: `test@example.com` / `password123`

## 🧪 Scripts Disponibles

### 1. **k6-load-test.js** - Prueba de Carga Normal
Simula condiciones normales de uso con carga gradual.

```bash
k6 run k6-load-test.js
```

**Características**:
- ✅ Rampa gradual de 10 → 50 → 100 usuarios
- ✅ Duración: ~6 minutos
- ✅ Thresholds estrictos (99% éxito, <1s respuesta)
- ✅ Usa múltiples usuarios de prueba

**Cuándo usar**: Para validar el rendimiento bajo condiciones normales de operación.

---

### 2. **k6-stress-test.js** - Prueba de Estrés
Lleva el sistema más allá de su capacidad normal hasta encontrar el punto de quiebre.

```bash
k6 run k6-stress-test.js
```

**Características**:
- 🔥 Escala hasta 500 usuarios virtuales
- 🔥 Duración: ~6 minutos
- 🔥 Simula 70% logins / 30% registros
- 🔥 Métricas personalizadas detalladas
- 🔥 Genera emails únicos para registros

**Cuándo usar**: Para encontrar los límites del sistema y planificar escalabilidad.

---

### 3. **k6-spike-test.js** - Prueba de Picos
Simula picos repentinos de tráfico (ej: Black Friday, lanzamientos).

```bash
k6 run k6-spike-test.js
```

**Características**:
- ⚡ Pico súbito de 10 → 1000 usuarios en 20 segundos
- ⚡ Duración: ~50 segundos
- ⚡ Thresholds más tolerantes (85% éxito)

**Cuándo usar**: Para validar la resiliencia ante tráfico inesperado.

---

## 📊 Interpretando Resultados

### Métricas Clave

```
✓ http_req_duration..............: avg=245ms  p(95)=450ms  p(99)=800ms
✓ http_req_failed................: 0.12%
✓ login_success_rate.............: 99.88%
✓ iterations.....................: 15420
```

**Qué significan**:
- `http_req_duration`: Tiempo de respuesta (menor es mejor)
- `p(95)`: 95% de requests completaron en este tiempo o menos
- `http_req_failed`: Porcentaje de requests fallidos
- `login_success_rate`: Tasa de éxito de logins

### Estados de Thresholds

- ✅ **Verde (✓)**: Threshold cumplido - ¡Excelente!
- ❌ **Rojo (✗)**: Threshold fallido - Requiere atención

---

## 🎯 Configuración Personalizada

### Cambiar URL del Backend

Edita la constante en cualquier script:

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
// Cambiar a:
const API_BASE_URL = 'https://tu-servidor.com/api';
```

### Ajustar Usuarios de Prueba

En `k6-load-test.js`, modifica el array:

```javascript
const testUsers = [
  { email: 'test@example.com', password: 'password123' },
  { email: 'user1@test.com', password: 'password123' },
  // Agregar más usuarios...
];
```

### Modificar Escenarios de Carga

Ajusta las `stages` en cada script:

```javascript
stages: [
  { duration: '1m', target: 50 },   // 1 minuto hasta 50 usuarios
  { duration: '3m', target: 200 },  // 3 minutos hasta 200 usuarios
  // ...
],
```

### Cambiar Thresholds

```javascript
thresholds: {
  http_req_failed: ['rate<0.05'],      // Máximo 5% de errores
  http_req_duration: ['p(95)<2000'],   // 95% bajo 2 segundos
  login_success_rate: ['rate>0.95'],   // Mínimo 95% de éxito
},
```

---

## 🔍 Opciones Avanzadas

### Generar Reporte HTML

```bash
k6 run --out json=results.json k6-stress-test.js
```

Luego usa herramientas como [k6-reporter](https://github.com/benc-uk/k6-reporter) para visualizar.

### Ejecutar con más VUs (Virtual Users)

```bash
k6 run --vus 100 --duration 30s k6-load-test.js
```

### Modo Debug

```bash
k6 run --http-debug k6-stress-test.js
```

### Ejecutar en Cloud (k6 Cloud)

```bash
k6 cloud k6-stress-test.js
```

---

## 🛠️ Troubleshooting

### Error: "Connection refused"
- ✅ Verifica que el backend esté corriendo
- ✅ Confirma el puerto correcto (8080)
- ✅ Revisa firewalls/antivirus

### Error: "401 Unauthorized"
- ✅ Verifica que los usuarios existan en la BD
- ✅ Confirma las credenciales en el script
- ✅ Revisa la configuración JWT del backend

### Muchos errores 500
- ✅ Revisa los logs del backend
- ✅ Verifica la conexión a la base de datos
- ✅ Reduce la carga (menos VUs) para aislar el problema

### Thresholds fallando
- ✅ Normal en pruebas de estrés - indica límites del sistema
- ✅ Considera optimizar el backend o escalar recursos
- ✅ Ajusta thresholds si son muy estrictos para tu caso de uso

---

## 📈 Mejores Prácticas

1. **Empezar pequeño**: Comienza con `k6-load-test.js` antes de stress testing
2. **Datos realistas**: Usa datos de producción anonimizados si es posible
3. **Monitoreo**: Observa CPU, memoria y BD durante las pruebas
4. **Iteración**: Ejecuta múltiples veces para obtener resultados consistentes
5. **Baseline**: Establece una línea base antes de cambios importantes

---

## 📚 Recursos Adicionales

- [Documentación oficial de k6](https://k6.io/docs/)
- [Ejemplos de k6](https://k6.io/docs/examples/)
- [Métricas de k6](https://k6.io/docs/using-k6/metrics/)
- [Thresholds en k6](https://k6.io/docs/using-k6/thresholds/)

---

## 🤝 Contribuir

Si encuentras mejoras o bugs en los scripts, por favor:
1. Documenta el issue
2. Propón una solución
3. Actualiza este README si es necesario

---

**Última actualización**: 2025-11-21
**Versión**: 1.0.0
