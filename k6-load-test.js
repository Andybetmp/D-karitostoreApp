import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// Métricas personalizadas
const loginErrors = new Counter('login_errors');
const loginSuccessRate = new Rate('login_success_rate');
const loginDuration = new Trend('login_duration');

export const options = {
    // ESCENARIO DE CARGA: "Load Testing"
    // Objetivo: Probar el rendimiento bajo condiciones normales de uso
    stages: [
        { duration: '30s', target: 10 },   // Rampa inicial
        { duration: '2m', target: 50 },    // Carga normal
        { duration: '1m', target: 100 },   // Pico de carga
        { duration: '2m', target: 50 },    // Vuelta a carga normal
        { duration: '30s', target: 0 },    // Rampa de bajada
    ],
    thresholds: {
        http_req_failed: ['rate<0.01'],      // Menos del 1% de errores
        http_req_duration: ['p(95)<1000'],   // 95% bajo 1 segundo
        http_req_duration: ['p(99)<1500'],   // 99% bajo 1.5 segundos
        login_success_rate: ['rate>0.99'],   // 99% de logins exitosos
        login_duration: ['p(95)<800'],       // Login bajo 800ms
    },
};

// Configuración de la API
const API_BASE_URL = 'http://localhost:8080/api';
const LOGIN_ENDPOINT = `${API_BASE_URL}/auth/login`;

// Headers comunes
const headers = {
    'Content-Type': 'application/json',
};

// Usuarios de prueba (asegúrate de que existan en tu base de datos)
const testUsers = [
    { email: 'test@example.com', password: 'password123' },
    { email: 'user1@test.com', password: 'password123' },
    { email: 'user2@test.com', password: 'password123' },
];

// Función principal del test
export default function () {
    // Seleccionar un usuario aleatorio
    const user = testUsers[Math.floor(Math.random() * testUsers.length)];

    const payload = JSON.stringify({
        email: user.email,
        password: user.password,
    });

    const startTime = Date.now();
    const res = http.post(LOGIN_ENDPOINT, payload, { headers });
    const duration = Date.now() - startTime;

    loginDuration.add(duration);

    const success = check(res, {
        'Status is 200': (r) => r.status === 200,
        'Response time < 1000ms': (r) => r.timings.duration < 1000,
        'Has accessToken': (r) => {
            try {
                const body = JSON.parse(r.body);
                return body.accessToken !== undefined;
            } catch (e) {
                return false;
            }
        },
        'Has user email': (r) => {
            try {
                const body = JSON.parse(r.body);
                return body.email === user.email;
            } catch (e) {
                return false;
            }
        },
        'Has user roles': (r) => {
            try {
                const body = JSON.parse(r.body);
                return Array.isArray(body.roles);
            } catch (e) {
                return false;
            }
        },
    });

    loginSuccessRate.add(success);

    if (!success) {
        loginErrors.add(1);
        console.error(`Login failed for ${user.email}: ${res.status} - ${res.body}`);
    }

    // Simular tiempo de "pensamiento" del usuario
    sleep(1);
}

export function setup() {
    console.log('🚀 Iniciando pruebas de carga...');
    console.log(`📍 API Base URL: ${API_BASE_URL}`);
    console.log('👥 Usuarios de prueba:', testUsers.length);
    console.log('');
}

export function teardown(data) {
    console.log('');
    console.log('✅ Pruebas de carga completadas');
}
