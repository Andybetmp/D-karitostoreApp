import apiClient from './api';

export interface OrderItemRequest {
    productId: number;
    productTitle: string;
    price: number;
    quantity: number;
}

export interface CreateOrderRequest {
    userId: number;
    shippingAddress: string;
    items: OrderItemRequest[];
    totalAmount: number;
}

export interface OrderItemResponse {
    id: number;
    productId?: number;
    productTitle: string;
    price: number;
    quantity: number;
}

export interface OrderResponse {
    id: number;
    userId?: number;
    status: string;
    totalAmount: number;
    shippingAddress?: string;
    createdAt?: string;
    orderItems?: OrderItemResponse[];
    items?: OrderItemResponse[];
}

export const orderService = {
    createOrder: (orderData: CreateOrderRequest) =>
        apiClient.post<OrderResponse>('/orders', orderData),

    getOrdersByUser: (userId: number) =>
        apiClient.get<OrderResponse[]>(`/orders/user/${userId}`),

    getAllOrders: () =>
        apiClient.get<OrderResponse[]>('/orders'),

    updateOrderStatus: (orderId: number, status: string) =>
        apiClient.put<OrderResponse>(`/orders/${orderId}/status?status=${status}`),
};
