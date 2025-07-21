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
  console.log('\n--- [API] /api/auth/login ---');
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const data = await db.read();
    const users = data.users || [];

    const user = users.find((u: User) => u.email === email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const passwordIsValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { userId: user.id, roles: user.roles },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );
    res.setHeader('Set-Cookie', cookie.serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60, // 1 hour
      sameSite: 'lax',
      path: '/',

    }));

    return res.status(200).json({ message: 'Login successful!' });
  } catch (error) {
    console.error('Login API error:', error);
    return res.status(500).json({ message: 'An internal server error occurred.' });
  }
}
