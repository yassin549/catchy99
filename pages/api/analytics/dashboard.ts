import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'
import { Order, Product } from '@/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    const dbData = await db.read()
    const orders = dbData.orders.filter((o: Order) => o.status === 'Delivered')
    const products = dbData.products

    // 1. Sales Over Time (Last 30 days)
    const salesOverTime: { date: string; total: number }[] = []
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const dailySales: { [key: string]: number } = {}

    for (let i = 0; i < 30; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split('T')[0]
      dailySales[dateString] = 0
    }

    orders.forEach((order: Order) => {
      const orderDate = new Date(order.createdAt)
      if (orderDate >= thirtyDaysAgo) {
        const dateString = orderDate.toISOString().split('T')[0]
        if (dailySales[dateString] !== undefined) {
          dailySales[dateString] += order.total
        }
      }
    })

    Object.keys(dailySales)
      .sort()
      .forEach(date => {
        salesOverTime.push({ date, total: dailySales[date] })
      })

    // 2. Top Selling Products
    const productSales: { [key: string]: { name: string; quantity: number } } =
      {}

    orders.forEach((order: Order) => {
      order.items.forEach((item: { id: string; quantity: number }) => {
        if (!productSales[item.id]) {
          const product = products.find((p: Product) => p.id === item.id)
          productSales[item.id] = {
            name: product?.name || 'Unknown Product',
            quantity: 0,
          }
        }
        productSales[item.id].quantity += item.quantity
      })
    })

    const topSellingProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)

    res.status(200).json({ salesOverTime, topSellingProducts })
  } catch (error) {
    console.error('Dashboard API Error:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
