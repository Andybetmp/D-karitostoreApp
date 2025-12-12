import apiClient from './api';
import { CartItem } from '../types';

export interface OrderItemRequest {
    productId: number;
    productTitle: string;
    price: number;
    quantity: number;
}

export interface CreateOrderRequest {
    userId: number; // In a real app this comes from token, but backend might expect it
    shippingAddress: string;
    items: OrderItemRequest[];
    totalAmount: number;
}

export interface OrderResponse {
    id: number;
    status: string;
    totalAmount: number;
    items: {
        id: number;
        productTitle: string;
        price: number;
        quantity: number;
    }[];
}

export const orderService = {
    createOrder: (orderData: CreateOrderRequest) =>
        apiClient.post<OrderResponse>('/orders', orderData),

    getOrdersByUser: (userId: number) =>
        apiClient.get<OrderResponse[]>(`/orders/user/${userId}`),
};
