import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'
import { CartItem, Address, Order } from '@/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      try {
        const data = await db.read()
        const orders = data.orders || []
        // Sort orders by most recent
        orders.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        return res.status(200).json(orders)
      } catch (error) {
        console.error('Failed to retrieve orders:', error)
        return res.status(500).json({ message: 'Internal Server Error' })
      }

    case 'POST':
      try {
        const { items, total, shippingAddress, paymentMethod } = req.body as {
          items: CartItem[]
          total: number
          shippingAddress: Address
          paymentMethod: 'Credit Card' | 'Cash on Delivery'
        }

        // Basic validation
        if (
          !items ||
          items.length === 0 ||
          !total ||
          !shippingAddress ||
          !paymentMethod
        ) {
          return res
            .status(400)
            .json({ message: 'Missing required order information.' })
        }

        const newOrder: Order = {
          id: `order_${new Date().getTime()}`,
          items,
          total,
          shippingAddress,
          paymentMethod,
          status: 'Pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        const data = await db.read()
        if (!data.orders) {
          data.orders = []
        }
        data.orders.push(newOrder)
        await db.write(data)

        res
          .status(201)
          .json({ message: 'Order created successfully!', order: newOrder })
      } catch (error) {
        console.error('Order creation failed:', error)
        res.status(500).json({ message: 'Internal Server Error' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
