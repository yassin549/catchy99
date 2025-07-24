import dotenv from 'dotenv';
import path from 'path';

// Explicitly load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { put } from '@vercel/blob';
import { kv } from '@vercel/kv';
import { createProduct, createCategory, findCategoryByName } from '../lib/data';
import { Product, Category } from '../types';
import fs from 'fs/promises';

const sampleProducts: (Omit<Product, 'id' | 'category'> & { imageFileName: string, categoryName: string })[] = [
  {
    name: 'Classic Leather Jacket',
    description: 'A timeless leather jacket for all seasons.',
    price: 199.99,
    images: [],
    size: 'L',
    stock: 15,
    imageFileName: 'jacket.jpg',
    categoryName: 'Jackets',
  },
  {
    name: 'Modern Running Shoes',
    description: 'Lightweight and comfortable running shoes.',
    price: 129.99,
    images: [],
    size: '10',
    stock: 30,
    imageFileName: 'shoes.jpg',
    categoryName: 'Shoes',
  },
  {
    name: 'Silk Scarf',
    description: 'A beautiful silk scarf with a unique pattern.',
    price: 49.99,
    images: [],
    size: 'One Size',
    stock: 50,
    imageFileName: 'scarf.jpg',
    categoryName: 'Accessories',
  },
];

const sampleCategories = [
  { name: 'Jackets' },
  { name: 'Shoes' },
  { name: 'Accessories' },
];

async function uploadSampleImage(imagePath: string, productName: string): Promise<string> {
  try {
    const fileBuffer = await fs.readFile(imagePath);
    const blob = await put(`${productName.replace(/\s+/g, '-')}-sample.jpg`, fileBuffer, {
      access: 'public',
      addRandomSuffix: true,
    });
    return blob.url;
  } catch (error) {
    console.error(`Failed to upload image ${imagePath}:`, error);
    throw error;
  }
}

async function resetDb() {
  console.log('Resetting and seeding database...');
  try {
    // Clear all existing keys
    // Be very careful with this in production!
    // This is a simplified example; a real app might need a more robust way to flush keys.
    const keys = [];
    for await (const key of kv.scanIterator()) {
      keys.push(key);
    }
    if (keys.length > 0) {
      await kv.del(...keys);
    }
    console.log('Cleared all keys from KV store.');

    // Seed categories
    for (const cat of sampleCategories) {
      await createCategory(cat);
    }
    console.log('Seeded categories.');

    // Create a directory for sample images if it doesn't exist
    const imageDir = path.join(process.cwd(), 'public', 'samples');
    await fs.mkdir(imageDir, { recursive: true });

    // Seed products
    for (const sample of sampleProducts) {
      const { categoryName, imageFileName, ...productData } = sample;
      const productToCreate: Omit<Product, 'id'> = { ...productData, images: [], category: categoryName };

      try {
        const imagePath = path.join(imageDir, imageFileName);
        const imageUrl = await uploadSampleImage(imagePath, productData.name);
        productToCreate.images = [imageUrl];
        console.log(`Uploaded sample image for ${productData.name}.`);
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          console.warn(`Could not find sample image ${imageFileName}. Seeding product without it.`);
        } else {
          // For other errors, we should still fail fast
          throw error;
        }
      }

      await createProduct(productToCreate);
    }

    console.log('Seeded products.');

    console.log('Database has been successfully reset and seeded.');
  } catch (error) {
    console.error('Failed to reset and seed the database:', error);
    process.exit(1);
  }
}

resetDb();
