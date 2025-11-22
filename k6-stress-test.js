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
    // STRESS TEST - Optimizado para K6 Cloud (50 VUs max)
    stages: [
        { duration: '2m', target: 20 },    // Rampa inicial
        { duration: '3m', target: 40 },    // Incremento
        { duration: '5m', target: 50 },    // Carga sostenida al máximo
        { duration: '3m', target: 50 },    // Mantener carga máxima
        { duration: '2m', target: 30 },    // Reducción gradual
        { duration: '2m', target: 10 },    // Enfriamiento
        { duration: '1m', target: 0 },     // Finalización
    ],

    thresholds: {
        http_req_failed: ['rate<0.10'],        // Tolerar 10% errores en stress
        http_req_duration: ['p(95)<3000'],     // 95% bajo 3s
        http_req_duration: ['p(99)<5000'],     // 99% bajo 5s
        login_success_rate: ['rate>0.85'],     // 85% éxito
        register_success_rate: ['rate>0.80'],  // 80% éxito
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
    return `stress_${vuId}_${timestamp}_${random}@test.com`;
}

function generateRandomName() {
    const names = ['Carlos', 'María', 'Juan', 'Ana', 'Pedro', 'Laura'];
    const lastNames = ['García', 'Rodríguez', 'Martínez', 'López'];
    return `${names[Math.floor(Math.random() * names.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

function testLogin() {
    const user = testUsers[Math.floor(Math.random() * testUsers.length)];
    const res = http.post(LOGIN_ENDPOINT, JSON.stringify({
        email: user.email,
        password: user.password,
    }), { headers, tags: { name: 'Login' } });

    const success = check(res, {
        'Login OK': (r) => r.status === 200,
        'Has Token': (r) => {
            try { return JSON.parse(r.body).accessToken !== undefined; }
            catch (e) { return false; }
        },
    });

    loginSuccessRate.add(success);
    if (!success) loginErrors.add(1);
    loginDuration.add(res.timings.duration);
}

function testRegister() {
    const res = http.post(REGISTER_ENDPOINT, JSON.stringify({
        name: generateRandomName(),
        email: generateUniqueEmail(),
        password: 'StressTest123!',
    }), { headers, tags: { name: 'Register' } });

    const success = check(res, {
        'Register OK': (r) => r.status === 200 || r.status === 201,
        'Has Token': (r) => {
            try { return JSON.parse(r.body).accessToken !== undefined; }
            catch (e) { return false; }
        },
    });

    registerSuccessRate.add(success);
    if (!success) registerErrors.add(1);
    registerDuration.add(res.timings.duration);
}

export default function () {
    // 70% login, 30% registro (más realista para stress)
    if (Math.random() < 0.7) {
        testLogin();
    } else {
        testRegister();
    }

    sleep(Math.random() * 1.5 + 0.5);
}

export function setup() {
    console.log('🔥 D\'Karito Store - STRESS TEST');
    console.log('📊 Máximo: 50 VUs sostenidos');
    console.log('⏱️  Duración: 18 minutos');
    console.log('🌐 Dashboard: https://app.k6.io/');
}

export function teardown() {
    console.log('✅ Stress test completado');
}
