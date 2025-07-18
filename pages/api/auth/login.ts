import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import * as cookie from 'cookie'
import { db, DbData } from '@/lib/db'
import { User } from '@/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  dbOverride?: DbData
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' })
  }

  // Use the override if provided (for testing), otherwise fetch the db instance
  let user: User | undefined

  if (dbOverride) {
    // For testing: use the in-memory db override
    user = dbOverride.users.find((u: User) => u.email === email)
  } else {
    // For production: read from the JSON file
    const data = await db.read()
    user = data.users.find((u: User) => u.email === email)
  }

  if (!user) {
    // Use a generic message to prevent leaking information about existing users
    return res.status(401).json({ message: 'Invalid credentials.' })
  }

  const passwordIsValid = await bcrypt.compare(password, user.passwordHash)

  if (!passwordIsValid) {
    return res.status(401).json({ message: 'Invalid credentials.' })
  }

  const token = jwt.sign(
    { userId: user.id, roles: user.roles },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  )

  res.setHeader(
    'Set-Cookie',
    cookie.serialize('auth_token', token, {
      httpOnly: true, // Prevents client-side JS from accessing the cookie
      secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
      maxAge: 3600, // 1 hour
      path: '/',
      sameSite: 'strict', // Helps mitigate CSRF attacks
    })
  )

  res.status(200).json({ message: 'Login successful!' })
}
