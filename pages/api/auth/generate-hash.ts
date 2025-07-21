import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';

export default async function generateHash(req: NextApiRequest, res: NextApiResponse) {
  // WARNING: This is an insecure, temporary endpoint for debugging only.
  // It should be deleted immediately after use.
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const { password } = req.query;

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ message: 'Please provide a password in the query string. e.g., /api/auth/generate-hash?password=yourpassword' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Log the hash to the Vercel console for easy copying.
    console.log(`--- GENERATED HASH FOR '${password}' ---`);
    console.log(passwordHash);
    console.log('------------------------------------');

    res.status(200).json({ password, passwordHash });
  } catch (error) {
    console.error('Error generating hash:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
