import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// Métricas personalizadas
const loginErrors = new Counter('login_errors');
const registerErrors = new Counter('register_errors');
const loginSuccessRate = new Rate('login_success_rate');
const registerSuccessRate = new Rate('register_success_rate');
const loginDuration = new Trend('login_duration');
const registerDuration = new Trend('register_duration');

export const options = {
    // PRUEBA DE CARGA PESADA - 11 minutos total
    stages: [
        { duration: '1m', target: 50 },    // Rampa inicial
        { duration: '2m', target: 150 },   // Incremento medio
        { duration: '3m', target: 300 },   // Carga alta
        { duration: '2m', target: 400 },   // PICO MÁXIMO
        { duration: '2m', target: 200 },   // Reducción
        { duration: '1m', target: 0 },     // Finalización
    ],

    thresholds: {
        http_req_failed: ['rate<0.10'],
        http_req_duration: ['p(95)<3000'],
        http_req_duration: ['p(99)<5000'],
        login_success_rate: ['rate>0.85'],
        register_success_rate: ['rate>0.80'],
        login_duration: ['p(95)<2500'],
        register_duration: ['p(95)<3000'],
    },
};

const API_BASE_URL = 'http://localhost:8080/api';
const LOGIN_ENDPOINT = `${API_BASE_URL}/auth/login`;
const REGISTER_ENDPOINT = `${API_BASE_URL}/auth/register`;

const headers = {
    'Content-Type': 'application/json',
};

const testUsers = [
    { email: 'test@example.com', password: 'password123' },
    { email: 'user1@test.com', password: 'password123' },
    { email: 'user2@test.com', password: 'password123' },
];

function generateUniqueEmail() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 100000);
    const vuId = __VU;
    return `loadtest_${vuId}_${timestamp}_${random}@test.com`;
}

function generateRandomName() {
    const names = ['Carlos', 'María', 'Juan', 'Ana', 'Pedro', 'Laura'];
    const lastNames = ['García', 'Rodríguez', 'Martínez', 'López'];
    const firstName = names[Math.floor(Math.random() * names.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName} ${lastName}`;
}

function testLogin() {
    const user = testUsers[Math.floor(Math.random() * testUsers.length)];

    const payload = JSON.stringify({
        email: user.email,
        password: user.password,
    });

    const startTime = Date.now();
    const res = http.post(LOGIN_ENDPOINT, payload, {
        headers,
        tags: { name: 'Login' }
    });
    const duration = Date.now() - startTime;

    loginDuration.add(duration);

    const success = check(res, {
        'Login OK': (r) => r.status === 200,
        'Has Token': (r) => {
            try {
                return JSON.parse(r.body).accessToken !== undefined;
            } catch (e) {
                return false;
            }
        },
    });

    loginSuccessRate.add(success);
    if (!success) loginErrors.add(1);
}

function testRegister() {
    const payload = JSON.stringify({
        name: generateRandomName(),
        email: generateUniqueEmail(),
        password: 'LoadTest123!',
    });

    const startTime = Date.now();
    const res = http.post(REGISTER_ENDPOINT, payload, {
        headers,
        tags: { name: 'Register' }
    });
    const duration = Date.now() - startTime;

    registerDuration.add(duration);

    const success = check(res, {
        'Register OK': (r) => r.status === 200 || r.status === 201,
        'Has Token': (r) => {
            try {
                return JSON.parse(r.body).accessToken !== undefined;
            } catch (e) {
                return false;
            }
        },
    });

    registerSuccessRate.add(success);
    if (!success) registerErrors.add(1);
}

export default function () {
    if (Math.random() < 0.8) {
        testLogin();
    } else {
        testRegister();
    }

    sleep(Math.random() * 1.5 + 0.5);
}

export function setup() {
    console.log('🚀 Prueba de CARGA PESADA - 400 VUs máximo');
    console.log('📊 Duración total: ~11 minutos');
    console.log('📈 Métricas en tiempo real en consola');
}

export function teardown() {
    console.log('✅ Prueba completada');
}
