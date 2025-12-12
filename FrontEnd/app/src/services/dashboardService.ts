import apiClient from './api';
import { Product } from './productService';

export interface TodayStats {
    totalSales: number;
    orderCount: number;
}

export interface SummaryStats {
    totalOrders: number;
    pendingOrders: number;
    deliveredOrders: number;
}

export interface TopProductStat {
    productId: number;
    totalSold: number;
}

export interface TopProductWithDetails extends TopProductStat {
    product?: Product;
}

export const dashboardService = {
    getTodayStats: () => apiClient.get<TodayStats>('/orders/stats/today'),

    getSummaryStats: () => apiClient.get<SummaryStats>('/orders/stats/summary'),

    getTopProducts: () => apiClient.get<TopProductStat[]>('/orders/stats/top-products'),
};
