import apiClient from './api';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken?: string;
    tokenType?: string;
    id: number;
    email: string;
    name: string;
    picture?: string | null;
    provider?: string;
    roles: string[]; // Array of roles: ['ADMIN', 'USER', etc.]
}

export const authService = {
    login: (credentials: LoginRequest) =>
        apiClient.post<AuthResponse>('/auth/login', credentials),

    register: (userData: RegisterRequest) =>
        apiClient.post<AuthResponse>('/auth/register', userData),

    logout: () =>
        apiClient.post('/auth/logout'),

    refreshToken: (refreshToken: string) =>
        apiClient.post<AuthResponse>('/auth/refresh', { refreshToken }),
};
