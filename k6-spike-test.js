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
    // SPIKE TEST - Optimizado para K6 Cloud (50 VUs max)
    stages: [
        { duration: '30s', target: 5 },     // Carga normal
        { duration: '30s', target: 50 },    // SPIKE REPENTINO
        { duration: '2m', target: 50 },     // Mantener spike
        { duration: '30s', target: 5 },     // Caída repentina
        { duration: '1m', target: 5 },      // Recuperación
        { duration: '30s', target: 50 },    // SEGUNDO SPIKE
        { duration: '1m', target: 50 },     // Mantener
        { duration: '30s', target: 0 },     // Finalización
    ],

    thresholds: {
        http_req_failed: ['rate<0.15'],        // Tolerar 15% errores en spikes
        http_req_duration: ['p(95)<4000'],     // 95% bajo 4s
        http_req_duration: ['p(99)<6000'],     // 99% bajo 6s
        login_success_rate: ['rate>0.80'],     // 80% éxito
        register_success_rate: ['rate>0.75'],  // 75% éxito
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
    return `spike_${vuId}_${timestamp}_${random}@test.com`;
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
        password: 'SpikeTest123!',
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
    // 75% login, 25% registro
    if (Math.random() < 0.75) {
        testLogin();
    } else {
        testRegister();
    }

    // Menos sleep para simular tráfico más intenso
    sleep(Math.random() * 1.0 + 0.3);
}

export function setup() {
    console.log('⚡ D\'Karito Store - SPIKE TEST');
    console.log('📊 Spikes: 5 → 50 VUs (repentinos)');
    console.log('⏱️  Duración: 7 minutos');
    console.log('🌐 Dashboard: https://app.k6.io/');
}

export function teardown() {
    console.log('✅ Spike test completado');
}
