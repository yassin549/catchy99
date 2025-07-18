import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { promises as fs } from 'fs'
import path from 'path'
import { User } from '@/types'

const dbPath = path.join(process.cwd(), 'db.json')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { auth_token } = req.cookies

  if (!auth_token) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  try {
    const decoded = jwt.verify(
      auth_token,
      process.env.JWT_SECRET as string
    ) as { userId: string }

    const fileData = await fs.readFile(dbPath, 'utf-8')
    const db = JSON.parse(fileData)
    const user = db.users.find((u: User) => u.id === decoded.userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = user

    res.status(200).json({ user: userWithoutPassword })
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}
