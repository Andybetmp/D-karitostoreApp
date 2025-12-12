import apiClient from './api';

export interface Product {
    id?: number;
    title: string;
    description: string;
    price: number;
    img: string;
    category?: string;
    stock?: number;
}

export const productService = {
    getAllProducts: () => apiClient.get<Product[]>('/products?page=0&size=2147483647'),

    getProductById: (id: number) => apiClient.get<Product>(`/products/${id}`),

    createProduct: (product: Omit<Product, 'id'>) =>
        apiClient.post<Product>('/products', product),

    updateProduct: (id: number, product: Partial<Product>) =>
        apiClient.put<Product>(`/products/${id}`, product),

    deleteProduct: (id: number) =>
        apiClient.delete(`/products/${id}`),
};
