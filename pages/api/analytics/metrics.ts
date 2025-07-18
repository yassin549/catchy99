import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'
import { withAdminAuthApi } from '@/lib/withAdminAuthApi'
import { Product } from '@/types'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    const database = await db.read()
    const products: Product[] = database.products

    // Aggregate the data for visualization
    const totalProducts = products.length
    const totalInventory = products.reduce((sum, p) => sum + p.stock, 0)
    const averagePrice =
      totalProducts > 0
        ? products.reduce((sum, p) => sum + p.price, 0) / totalProducts
        : 0

    const stockData = products.map((p: Product) => ({
      id: p.id,
      name: p.name,
      stock: p.stock,
    }))

    const lowStockThreshold = 10
    const lowStockProducts = products
      .filter(p => p.stock < lowStockThreshold && p.stock > 0)
      .sort((a, b) => a.stock - b.stock)

    const metrics = {
      kpis: {
        totalProducts,
        totalInventory,
        averagePrice,
      },
      stockData,
    }

    return res.status(200).json({
      kpis: metrics.kpis,
      stockData: metrics.stockData,
      lowStockProducts,
    })
  } catch (error) {
    console.error('Error fetching analytics metrics:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

// Protect the endpoint with admin authentication
export default withAdminAuthApi(handler)
