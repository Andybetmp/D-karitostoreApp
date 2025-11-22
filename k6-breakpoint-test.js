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
    // TEST DE ESTRÉS - 100 VUs (Punto de Quiebre)
    stages: [
        { duration: '1m', target: 50 },    // Rampa rápida
        { duration: '2m', target: 100 },   // Alcanzar punto de quiebre
        { duration: '2m', target: 100 },   // Mantener estrés
        { duration: '1m', target: 0 },     // Finalización
    ],

    thresholds: {
        http_req_failed: ['rate<0.20'],        // Tolerar 20% errores
        http_req_duration: ['p(95)<5000'],     // 95% bajo 5s (relajado)
        http_req_duration: ['p(99)<10000'],    // 99% bajo 10s
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
    return `stress_${__VU}_${Date.now()}_${Math.floor(Math.random() * 10000)}@test.com`;
}

function generateRandomName() {
    const names = ['Carlos', 'María', 'Juan', 'Ana'];
    const lastNames = ['García', 'López', 'Martínez', 'Rodríguez'];
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
        password: 'Stress123!',
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
    if (Math.random() < 0.8) {
        testLogin();
    } else {
        testRegister();
    }

    sleep(Math.random() * 1.5 + 0.5);
}

export function setup() {
    console.log('🔥 Test de Estrés - 100 VUs');
    console.log('⏱️  Duración: 6 minutos');
    console.log('🎯 Objetivo: Demostrar punto de quiebre del sistema');
}

export function teardown() {
    console.log('✅ Test de estrés completado');
}
