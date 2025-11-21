import apiClient from './api';

export interface Product {
    id?: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category?: string;
    stock?: number;
}

export const productService = {
    getAllProducts: () => apiClient.get<Product[]>('/products'),

    getProductById: (id: string) => apiClient.get<Product>(`/products/${id}`),

    createProduct: (product: Omit<Product, 'id'>) =>
        apiClient.post<Product>('/products', product),

    updateProduct: (id: string, product: Partial<Product>) =>
        apiClient.put<Product>(`/products/${id}`, product),

    deleteProduct: (id: string) =>
        apiClient.delete(`/products/${id}`),
};
