import { Product, Category } from '@/types';

const API_BASE_URL = ''

async function fetcher<T>(url: string, tags: string[] = []): Promise<T> {
    try {
        const res = await fetch(`${API_BASE_URL}${url}`, {
            next: { tags },
        });

        if (!res.ok) {
            const errorBody = await res.json();
            throw new Error(errorBody.message || 'Failed to fetch data');
        }
        return res.json();
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error(`Error fetching ${url}:`, error);
        throw new Error(`A network error occurred: ${message}`);
    }
}

export const fetchProducts = (url: string = '/api/products'): Promise<Product[]> => fetcher<Product[]>(url, ['products']);

export const fetchProductById = (id: string): Promise<Product> => fetcher<Product>(`/api/products/${id}`, [`products:${id}`]);

export const fetchCategories = (url: string = '/api/categories'): Promise<Category[]> => fetcher<Category[]>(url, ['categories']);
