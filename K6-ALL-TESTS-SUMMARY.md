# 🚀 Resumen de Pruebas de Carga K6 Cloud

## ✅ Tests Ejecutándose

### 1. Load Test (Completado)
- **Test Run ID**: 6131506
- **Estado**: ✅ Completado (con algunos fallos en thresholds)
- **Dashboard**: https://app.k6.io/runs/6131506
- **Duración**: 9 minutos
- **VUs Máximos**: 50
- **Perfil**: Rampa gradual 10 → 25 → 50 → 30 → 0

### 2. Stress Test (En Ejecución) 🔥
- **Test Run ID**: 6131572
- **Estado**: 🔄 Ejecutándose
- **Dashboard**: https://app.k6.io/runs/6131572
- **Duración**: 18 minutos
- **VUs Máximos**: 50 sostenidos
- **Perfil**: Carga sostenida al máximo
  - 0-2 min: Rampa a 20 VUs
  - 2-5 min: Incremento a 40 VUs
  - 5-13 min: Carga máxima 50 VUs (8 minutos sostenidos)
  - 13-18 min: Reducción gradual

### 3. Spike Test (Iniciando) ⚡
- **Test Run ID**: Pendiente
- **Estado**: 🔄 Iniciando
- **Dashboard**: https://app.k6.io/ (busca "SPIKE TEST")
- **Duración**: 7 minutos
- **VUs Máximos**: 50 (en spikes repentinos)
- **Perfil**: Tráfico con picos repentinos
  - 0-0.5 min: Carga normal (5 VUs)
  - 0.5-3 min: SPIKE a 50 VUs
  - 3-4.5 min: Caída a 5 VUs
  - 4.5-6 min: SEGUNDO SPIKE a 50 VUs
  - 6-7 min: Finalización

---

## 📊 Comparación de Tests

| Test | Objetivo | Duración | VUs Max | Patrón |
|------|----------|----------|---------|--------|
| **Load** | Rendimiento normal | 9 min | 50 | Rampa gradual |
| **Stress** | Límites del sistema | 18 min | 50 | Carga sostenida |
| **Spike** | Picos repentinos | 7 min | 50 | Spikes abruptos |

---

## 🎯 Qué Buscar en Cada Test

### Load Test
- ✅ Response time estable
- ✅ Error rate < 5%
- ✅ Login success > 95%
- ✅ Sistema maneja carga gradual

### Stress Test
- ✅ Sistema aguanta carga sostenida
- ✅ No hay degradación progresiva
- ✅ Memoria/CPU estables
- ⚠️ Puede haber más errores (threshold 10%)

### Spike Test
- ✅ Sistema se recupera de spikes
- ✅ No hay crashes
- ✅ Tiempos de respuesta se normalizan
- ⚠️ Errores temporales aceptables (threshold 15%)

---

## 📈 Métricas Clave a Monitorear

### En K6 Cloud Dashboard

1. **Virtual Users**
   - Load: Rampa suave
   - Stress: Meseta alta
   - Spike: Picos abruptos

2. **HTTP Request Duration**
   - p95 < 2-4 segundos
   - p99 < 3-6 segundos
   - Busca degradación en stress test

3. **Error Rate**
   - Load: < 5%
   - Stress: < 10%
   - Spike: < 15%

4. **Custom Metrics**
   - `login_success_rate`
   - `register_success_rate`
   - `login_duration`
   - `register_duration`

### En el Backend

Monitorea mientras corren los tests:

```powershell
# Ver conexiones a PostgreSQL
# (en pgAdmin o psql)
SELECT count(*) FROM pg_stat_activity;

# Ver procesos Java
Get-Process java | Select-Object CPU, WorkingSet, Id, ProcessName
```

---

## 🔗 Dashboards

### Acceso Rápido

- **Portal K6 Cloud**: https://app.k6.io/
- **Load Test**: https://app.k6.io/runs/6131506
- **Stress Test**: https://app.k6.io/runs/6131572
- **Spike Test**: https://app.k6.io/ (busca el test más reciente)

### Navegación

1. Ve a https://app.k6.io/
2. Inicia sesión
3. Verás los 3 tests listados
4. Click en cualquiera para ver dashboard detallado

---

## ⏱️ Timeline de Ejecución

```
Tiempo  | Load Test | Stress Test | Spike Test |
--------|-----------|-------------|------------|
13:09   | ████████  |             |            | Load iniciado
13:18   | ✅        |             |            | Load completado
13:23   |           | ████████    |            | Stress iniciado
13:23   |           | ████████    | ████       | Spike iniciado
13:30   |           | ████████    | ✅         | Spike completado
13:41   |           | ✅          |            | Stress completado
```

**Tiempo total estimado**: ~32 minutos para todos los tests

---

## 📊 Resultados Esperados

### Load Test ✅
- Total requests: ~2000-3000
- Success rate: 95-98%
- Avg response time: 100-500ms

### Stress Test 🔥
- Total requests: ~5000-7000
- Success rate: 85-95%
- Avg response time: 200-800ms
- Algunos errores esperados bajo carga sostenida

### Spike Test ⚡
- Total requests: ~2000-3000
- Success rate: 80-90%
- Avg response time: Variable (picos altos durante spikes)
- Errores temporales durante spikes son normales

---

## 🎯 Próximos Pasos

1. **Monitorea los dashboards** en tiempo real
2. **Revisa los resultados** cuando terminen
3. **Identifica bottlenecks**:
   - ¿Qué endpoint es más lento?
   - ¿Cuándo empiezan los errores?
   - ¿Se recupera el sistema?
4. **Optimiza el backend** según hallazgos
5. **Re-ejecuta tests** después de optimizaciones

---

## 🔍 Análisis Post-Test

Cuando todos terminen, compara:

- **Throughput**: Requests/segundo en cada test
- **Latency**: p95 y p99 en cada escenario
- **Errors**: Cuándo y por qué fallan
- **Recovery**: Qué tan rápido se recupera el sistema

---

**Última actualización**: 2025-11-21 13:23
**Estado**: 2 tests ejecutándose, 1 completado
