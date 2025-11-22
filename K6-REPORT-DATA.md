# 📊 Datos para el Informe de Pruebas de Carga

Este documento recopila los resultados de las pruebas ejecutadas para tu informe final.

## 1. Prueba de Estabilidad (30 VUs)
**Objetivo:** Demostrar que el sistema es estable bajo una carga moderada.
**Estado:** ✅ Completado
**Resultados:**
- **VUs:** 30
- **Duración:** 7 min
- **Iteraciones:** 5,060 completadas
- **Observaciones:** Se cruzaron umbrales de tiempo de respuesta y tasa de error. El sistema soporta 30 VUs pero con cierta degradación.

## 2. Prueba de Capacidad (50 VUs)
**Objetivo:** Encontrar la carga máxima aceptable antes de degradación significativa.
**Estado:** ✅ Completado
**Resultados:**
- **VUs:** 50
- **Duración:** 7 min
- **Iteraciones:** 7,469 completadas
- **Observaciones:** Se cruzaron umbrales. El sistema maneja 50 VUs pero está en el límite de su capacidad operativa aceptable.

## 3. Prueba de Punto de Quiebre (100 VUs)
**Objetivo:** Demostrar el fallo del sistema bajo estrés extremo (para contraste).
**Estado:** ✅ Completado
**Resultados:**
- **VUs:** 100
- **Duración:** 6 min
- **Iteraciones:** 5,684 completadas
- **Observaciones:** Se cruzaron umbrales críticos. Alta tasa de fallos en registro y tiempos de respuesta elevados, confirmando el punto de quiebre.
