import { kv } from './kv';
import { Product, Category } from '@/types';

// --- Product Functions ---

const getProductKey = (id: string) => `product:${id}`;
const ALL_PRODUCTS_KEY = 'products:all';

export async function getProductById(id: string): Promise<Product | null> {
  return kv.get(getProductKey(id));
}

export async function getProducts(): Promise<Product[]> {
  const productIds = await kv.zrange(ALL_PRODUCTS_KEY, 0, -1, { rev: true });
  if (productIds.length === 0) return [];

  const pipeline = kv.pipeline();
  productIds.forEach(id => pipeline.get(getProductKey(id as string)));
  const products = (await pipeline.exec()) as Product[];

  // Filter out any null products that might have been deleted but still in the set
  return products.filter(p => p !== null);
}

export async function createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
  const id = `prod_${new Date().getTime()}`;
  const newProduct: Product = { ...productData, id };

  const productKey = getProductKey(id);

  await kv.set(productKey, newProduct);
  await kv.zadd(ALL_PRODUCTS_KEY, { score: Date.now(), member: id });

  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const product = await getProductById(id);
  if (!product) return null;

  const updatedProduct = { ...product, ...updates };
  await kv.set(getProductKey(id), updatedProduct);

  return updatedProduct;
}

export async function deleteProduct(id: string): Promise<void> {
  // First, get the product to find out its category
  const product = await getProductById(id);
  if (product && product.category) {
    // Remove the product from its category set
    await kv.srem(`category:${product.category}:products`, id);
  }

  // Delete the main product hash
  await kv.del(`product:${id}`);
  
  // Remove the product ID from the global set of all products
  await kv.srem('products', id);

  // Remove the product ID from the sorted set used for ordering
  await kv.zrem('products_by_creation_date', id);
}

// --- Category Functions ---

const getCategoryKey = (id: string) => `category:${id}`;
const ALL_CATEGORIES_KEY = 'categories:all';

export async function getCategoryById(id: string): Promise<Category | null> {
  return kv.get(getCategoryKey(id));
}

export async function getCategories(): Promise<Category[]> {
  const categoryIds = await kv.smembers(ALL_CATEGORIES_KEY);
  if (categoryIds.length === 0) return [];

  const pipeline = kv.pipeline();
  categoryIds.forEach(id => pipeline.get(getCategoryKey(id)));
  const categories = (await pipeline.exec()) as Category[];

  return categories.filter(c => c !== null).sort((a, b) => a.name.localeCompare(b.name));
}

export async function createCategory(categoryData: Omit<Category, 'id'>): Promise<Category> {
  const id = `cat_${new Date().getTime()}`;
  const newCategory: Category = { ...categoryData, id };

  await kv.set(getCategoryKey(id), newCategory);
  await kv.sadd(ALL_CATEGORIES_KEY, id);

  return newCategory;
}

export async function findCategoryByName(name: string): Promise<Category | null> {
    const allCategories = await getCategories();
    return allCategories.find(c => c.name.toLowerCase() === name.toLowerCase()) || null;
}

