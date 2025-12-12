import apiClient from './api';

export interface Inventory {
    id?: number;
    productId: number;
    stock: number;
    reservedStock: number;
}

export const inventoryService = {
    getInventory: (productId: number) => apiClient.get<Inventory>(`/inventory/${productId}`),

    createInventory: (inventory: Inventory) => apiClient.post<Inventory>('/inventory', inventory),

    updateInventory: (productId: number, inventory: Inventory) => apiClient.put<Inventory>(`/inventory/${productId}`, inventory),

    addStock: (productId: number, quantity: number) => apiClient.post(`/inventory/${productId}/add`, null, { params: { quantity } }),

    deductStock: (productId: number, quantity: number) => apiClient.post(`/inventory/${productId}/deduct`, null, { params: { quantity } }),
};
