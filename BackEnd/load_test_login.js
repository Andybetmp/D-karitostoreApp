import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 }, // Sube a 10 usuarios
    { duration: '1m', target: 10 },  // Mantiene 10 usuarios
    { duration: '10s', target: 0 },  // Baja a 0
  ],
};

export default function () {
  // OJO: Cambia el puerto si tu backend no corre en el 3000
  const url = 'http://localhost:3000/api/auth/login'; 
  
  const payload = JSON.stringify({
    email: 'test@example.com', // Asegurate que este usuario exista o la API responda
    password: 'password123',
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status es 200': (r) => r.status === 200,
  });

  sleep(1);
}
