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
    console.log(`[${new Date().toISOString()}] Received a ${req.method} request. Responding with 405.`);
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  console.log(`[${new Date().toISOString()}] Received POST request.`);
  const { email, password } = req.body;
  console.log(`[${new Date().toISOString()}] Request body:`, { email, password: password ? '********' : undefined });

  if (!email || !password) {
    console.log(`[${new Date().toISOString()}] Missing email or password. Responding with 400.`);
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    console.log(`[${new Date().toISOString()}] Attempting to read database...`);
    const data = await db.read();
    const users = data.users || [];
    console.log(`[${new Date().toISOString()}] Database read successfully. Found ${users.length} user(s).`);

    const user = users.find((u: User) => u.email === email);

    if (!user) {
      console.log(`[${new Date().toISOString()}] User with email '${email}' NOT FOUND. Responding with 401.`);
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    console.log(`[${new Date().toISOString()}] User found:`, { id: user.id, email: user.email });
    console.log(`[${new Date().toISOString()}] Stored password hash: ${user.passwordHash}`);
    console.log(`[${new Date().toISOString()}] Comparing provided password with stored hash...`);

    const passwordIsValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordIsValid) {
      console.log(`[${new Date().toISOString()}] Password comparison FAILED. Responding with 401.`);
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    console.log(`[${new Date().toISOString()}] Password comparison SUCCEEDED.`);
    const token = jwt.sign(
      { userId: user.id, roles: user.roles },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );
    console.log(`[${new Date().toISOString()}] JWT created successfully.`);

    res.setHeader(
      'Set-Cookie',
      cookie.serialize('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 3600,
        path: '/',
        sameSite: 'strict',
      })
    );
    console.log(`[${new Date().toISOString()}] Cookie set. Responding with 200.`);

    return res.status(200).json({ message: 'Login successful!' });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] --- FATAL ERROR ---`);
    console.error('Login API error:', error);
    return res.status(500).json({ message: 'An internal server error occurred.' });
  }
}
