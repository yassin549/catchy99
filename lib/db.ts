import { put, get } from '@vercel/blob';
import { Product, User, Order, Category } from '@/types';

// Define the structure of our database
export interface DbData {
  categories: Category[];
  products: Product[];
  users: User[];
  orders: Order[];
}

const DB_BLOB_NAME = 'db.json';

/**
 * A database helper that uses Vercel Blob storage to read from and write to a JSON file.
 */
export const db = {
  async read(): Promise<DbData> {
    try {
      const blob = await get(DB_BLOB_NAME);
      if (!blob) {
        // If the blob doesn't exist, return a default structure
        return { products: [], users: [], orders: [], categories: [] };
      }
      const fileContent = await blob.text();
      return JSON.parse(fileContent);
    } catch (error) {
      console.error('Failed to read from Vercel Blob:', error);
      // In case of error (e.g., network issue), return a safe default
      return { products: [], users: [], orders: [], categories: [] };
    }
  },

  async write(data: DbData): Promise<void> {
    try {
      await put(DB_BLOB_NAME, JSON.stringify(data, null, 2), {
        access: 'public',
        contentType: 'application/json',
      });
    } catch (error) {
      console.error('Failed to write to Vercel Blob:', error);
      throw new Error('Could not write to database.');
    }
  },
};
