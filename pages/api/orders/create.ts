import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'
import { Order } from '@/types'
import { v4 as uuidv4 } from 'uuid'

interface OrderRequest extends NextApiRequest {
  body: {
    items: Array<{
      productId: string
      quantity: number
      price: number
    }>
    shippingAddress: {
      fullName: string
      addressLine1: string
      city: string
      postalCode: string
      country: string
    }
    total: number
  }
}

export default async function handler(req: OrderRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { items: requestItems, shippingAddress, total } = req.body

    // Basic validation
    if (!requestItems || requestItems.length === 0) {
      return res.status(400).json({ error: 'No items in order' })
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.addressLine1
    ) {
      return res.status(400).json({ error: 'Invalid shipping address' })
    }

    // Generate order ID
    const orderId = uuidv4()

    // Create order
    // Fetch all products to enrich the order items
    const { products } = await db.read()
    const productsMap = new Map(products.map(p => [p.id, p]))

    const items: Order['items'] = requestItems.map(item => {
      const product = productsMap.get(item.productId)
      if (!product) {
        throw new Error(`Product with id ${item.productId} not found`)
      }
      return {
        ...product,
        quantity: item.quantity,
      }
    })

    // Create order
    const order: Order = {
      id: orderId,
      items,
      shippingAddress,
      total,
      status: 'Processing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paymentMethod: 'Cash on Delivery',
    }

    // Save order to database and update stock
    const data = await db.read()

    // Add the new order
    data.orders.push(order)

    // Update product stock
    for (const item of items) {
      const product = data.products.find(p => p.id === item.id)
      if (product) {
        product.stock -= item.quantity
      }
    }

    await db.write(data)

    res.status(201).json({ order })
  } catch (error) {
    console.error('Order creation error:', error)
    res.status(500).json({ error: 'Failed to create order' })
  }
}
