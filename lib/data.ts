import { db } from '@/lib/db';
import { Product, Category } from '@/types';

export const getProducts = async (): Promise<Product[]> => {
  try {
    const data = await db.read();
    return data.products || [];
  } catch (error) {
    console.error('Error reading products from database:', error);
    throw new Error('Failed to fetch products.');
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const data = await db.read();
    return data.categories || [];
  } catch (error) {
    console.error('Error reading categories from database:', error);
    throw new Error('Failed to fetch categories.');
  }
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  try {
    const data = await db.read();
    return data.products.find(p => p.id === id);
  } catch (error) {
    console.error(`Error reading product ${id} from database:`, error);
    throw new Error(`Failed to fetch product ${id}.`);
  }
};
