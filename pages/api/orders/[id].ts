import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'
import { Order, OrderStatus } from '@/types'

const validStatuses: OrderStatus[] = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid order ID.' })
  }

  if (req.method === 'PUT') {
    try {
      const { status } = req.body as { status: OrderStatus }

      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided.' })
      }

      const data = await db.read()
      const orderIndex = data.orders.findIndex(
        (order: Order) => order.id === id
      )

      if (orderIndex === -1) {
        return res.status(404).json({ message: 'Order not found.' })
      }

      data.orders[orderIndex].status = status
      await db.write(data)

      return res.status(200).json(data.orders[orderIndex])
    } catch (error) {
      console.error(`Failed to update order ${id}:`, error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  } else {
    res.setHeader('Allow', ['PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
