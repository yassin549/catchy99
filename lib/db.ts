import { kv } from '@vercel/kv';
import { Product, User, Order, Category } from '@/types';

// Define the structure of our database
export interface DbData {
  categories: Category[];
  products: Product[];
  users: User[];
  orders: Order[];
}

// Define keys for our KV store
const DB_KEYS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  USERS: 'users',
  ORDERS: 'orders',
};

/**
 * A database helper that uses Vercel KV storage.
 */
export const db = {
  async read(): Promise<DbData> {
    try {
      const products = await kv.get<Product[]>(DB_KEYS.PRODUCTS) || [];
      const categories = await kv.get<Category[]>(DB_KEYS.CATEGORIES) || [];
      const users = await kv.get<User[]>(DB_KEYS.USERS) || [];
      const orders = await kv.get<Order[]>(DB_KEYS.ORDERS) || [];

      return { products, categories, users, orders };
    } catch (error) {
      console.error('Failed to read from Vercel KV:', error);
      return { products: [], users: [], orders: [], categories: [] };
    }
  },

  async write(data: DbData): Promise<void> {
    try {
      await kv.set(DB_KEYS.PRODUCTS, data.products);
      await kv.set(DB_KEYS.CATEGORIES, data.categories);
      await kv.set(DB_KEYS.USERS, data.users);
      await kv.set(DB_KEYS.ORDERS, data.orders);
    } catch (error) {
      console.error('Failed to write to Vercel KV:', error);
      throw new Error('Could not write to database.');
    }
  },
};
