import { db } from '@/lib/db'
import { NextApiRequest, NextApiResponse } from 'next'
import { Product } from '@/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      try {
        const page = req.query.page
          ? parseInt(req.query.page as string, 10)
          : undefined
        const limit = req.query.limit
          ? parseInt(req.query.limit as string, 10)
          : undefined
        const searchQuery = ((req.query.search as string) || '').toLowerCase()

        const data = await db.read()
        let allProducts = data.products.sort((a, b) =>
          a.name.localeCompare(b.name)
        ) // Sort for consistent ordering

        if (searchQuery) {
          allProducts = allProducts.filter(
            p =>
              p.name.toLowerCase().includes(searchQuery) ||
              (p.category && p.category.toLowerCase().includes(searchQuery))
          )
        }

        // If pagination params are provided, send paginated response
        if (page && limit) {
          const totalProducts = allProducts.length
          const totalPages = Math.ceil(totalProducts / limit)
          const startIndex = (page - 1) * limit
          const endIndex = page * limit
          const products = allProducts.slice(startIndex, endIndex)

          return res.status(200).json({
            products,
            totalProducts,
            totalPages,
            currentPage: page,
          })
        }

        // Otherwise, return all products (for the public products page)
        res.status(200).json(allProducts)
      } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve products' })
      }
      break

    case 'POST':
      try {
        const { name, description, price, images, category, size, stock } =
          req.body

        if (
          !name ||
          !price ||
          !images ||
          !category ||
          !size ||
          stock === undefined
        ) {
          return res
            .status(400)
            .json({ message: 'Missing required product fields.' })
        }

        const newProduct: Product = {
          id: `prod_${new Date().getTime()}`,
          name,
          description,
          price,
          images,
          category,
          size,
          stock,
        }

        const data = await db.read()
        data.products.push(newProduct)
        await db.write(data)
        res.status(201).json(newProduct)
      } catch (error) {
        res.status(500).json({ message: 'Failed to create product' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
      break
  }
}
