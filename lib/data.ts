import { db } from '@/lib/db'

export const getProducts = async () => {
  const data = await db.read()
  return data.products
}

export const getCategories = async () => {
  const data = await db.read()
  return data.categories
}

export const getProductById = async (id: string) => {
  const data = await db.read()
  return data.products.find(p => p.id === id)
}
