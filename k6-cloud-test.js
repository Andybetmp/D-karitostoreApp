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
    // Optimizado para K6 Cloud Free Tier (máx 50 VUs)
    stages: [
        { duration: '1m', target: 10 },    // Rampa inicial
        { duration: '2m', target: 25 },    // Incremento
        { duration: '3m', target: 50 },    // Carga máxima
        { duration: '2m', target: 30 },    // Reducción
        { duration: '1m', target: 0 },     // Finalización
    ],

    thresholds: {
        http_req_failed: ['rate<0.05'],
        http_req_duration: ['p(95)<2000'],
        http_req_duration: ['p(99)<3000'],
        login_success_rate: ['rate>0.95'],
        register_success_rate: ['rate>0.90'],
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
    return `k6test_${vuId}_${timestamp}_${random}@test.com`;
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
        'Login: Status 200': (r) => r.status === 200,
        'Login: Has Token': (r) => {
            try {
                return JSON.parse(r.body).accessToken !== undefined;
            } catch (e) {
                return false;
            }
        },
        'Login: Fast Response': (r) => r.timings.duration < 2000,
    });

    loginSuccessRate.add(success);
    if (!success) loginErrors.add(1);
}

function testRegister() {
    const payload = JSON.stringify({
        name: generateRandomName(),
        email: generateUniqueEmail(),
        password: 'K6Test123!',
    });

    const startTime = Date.now();
    const res = http.post(REGISTER_ENDPOINT, payload, {
        headers,
        tags: { name: 'Register' }
    });
    const duration = Date.now() - startTime;

    registerDuration.add(duration);

    const success = check(res, {
        'Register: Status 200/201': (r) => r.status === 200 || r.status === 201,
        'Register: Has Token': (r) => {
            try {
                return JSON.parse(r.body).accessToken !== undefined;
            } catch (e) {
                return false;
            }
        },
        'Register: Fast Response': (r) => r.timings.duration < 3000,
    });

    registerSuccessRate.add(success);
    if (!success) registerErrors.add(1);
}

export default function () {
    // 80% login, 20% registro
    if (Math.random() < 0.8) {
        testLogin();
    } else {
        testRegister();
    }

    sleep(Math.random() * 1.5 + 0.5);
}

export function setup() {
    console.log('🚀 D\'Karito Store - Load Test en K6 Cloud');
    console.log('📊 Máximo: 50 VUs concurrentes');
    console.log('⏱️  Duración: 9 minutos');
    console.log('🌐 Dashboard: https://app.k6.io/');
}

export function teardown() {
    console.log('✅ Test completado - Ve a https://app.k6.io/ para ver resultados');
}
