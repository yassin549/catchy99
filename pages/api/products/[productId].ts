import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { productId } = req.query

  if (typeof productId !== 'string') {
    return res.status(400).json({ message: 'Invalid product ID' })
  }

  const data = await db.read()
  const productIndex = data.products.findIndex(p => p.id === productId)

  switch (req.method) {
    case 'GET':
      if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' })
      }
      res.status(200).json(data.products[productIndex])
      break

    case 'PUT':
      if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' })
      }
      const updatedProduct = {
        ...data.products[productIndex],
        ...req.body,
      }
      data.products[productIndex] = updatedProduct
      await db.write(data)
      res.status(200).json(updatedProduct)
      break

    case 'DELETE':
      if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' })
      }
      const [deletedProduct] = data.products.splice(productIndex, 1)
      await db.write(data)
      res.status(200).json(deletedProduct)
      break

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
