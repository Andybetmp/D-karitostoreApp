import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // Configuración suave para depurar: 1 usuario por 10 segundos
  vus: 1,
  duration: '10s', 
};

export default function () {
  // 1. URL DEL BACKEND
  // Si esto falla, prueba cambiar 'localhost' por '127.0.0.1'
  const url = 'http://localhost:3000/api/auth/login'; 
  
  // 2. DATOS (Asegúrate que este usuario exista en tu DB)
  const payload = JSON.stringify({
    email: 'test@example.com', 
    password: 'password123',
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post(url, payload, params);

  // 3. DIAGNÓSTICO DE ERRORES (Esto es lo nuevo)
  if (res.status !== 200) {
    console.log('❌ ERROR: Status ' + res.status);
    console.log('   Respuesta del servidor: ' + res.body);
  } else {
    console.log('✅ ÉXITO: Login correcto');
  }

  check(res, {
    'status es 200': (r) => r.status === 200,
  });

  sleep(1);
}
