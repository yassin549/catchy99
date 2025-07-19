import { db } from '@/lib/db'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const data = await db.read()
      // Assuming 'categories' is a top-level array in your db.json
      const categories = data.categories || []
      res.status(200).json(categories)
    } catch (error) {
      console.error('Error reading from database:', error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
