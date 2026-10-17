import apiClient from './api';

export type PaymentStatusType = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type PaymentStatus = PaymentStatusType;

export type PaymentMethodType = 'CREDIT_CARD' | 'DEBIT_CARD' | 'PAYPAL' | 'WALLET';
export type PaymentMethod = PaymentMethodType;

export interface PaymentRecord {
    id: number;
    orderId: number;
    userId?: number;
    amount: number;
    status: PaymentStatusType;
    paymentMethod: PaymentMethodType;
    transactionId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export type PaymentDto = PaymentRecord;

export interface CreatePaymentRequest {
    orderId: number;
    userId?: number;
    amount: number;
    paymentMethod: PaymentMethodType;
}

export const paymentService = {
    getPaymentByOrder: async (orderId: number) => {
        return apiClient.get<PaymentRecord>(`/payments/order/${orderId}`);
    },

    getPaymentByOrderId: async (orderId: number) => {
        return apiClient.get<PaymentRecord>(`/payments/order/${orderId}`);
    },

    createPayment: async (data: CreatePaymentRequest) => {
        const payload = {
            ...data,
            userId: data.userId || 1,
        };
        return apiClient.post<PaymentRecord>('/payments', payload);
    },

    processPayment: async (orderId: number) => {
        return apiClient.post<PaymentRecord>(`/payments/order/${orderId}/process`);
    },

    refundPayment: async (orderId: number) => {
        return apiClient.post<PaymentRecord>(`/payments/order/${orderId}/refund`);
    },

    getPaymentCountByStatus: async (status: PaymentStatusType) => {
        return apiClient.get<number>(`/payments/count/${status}`);
    },
};
