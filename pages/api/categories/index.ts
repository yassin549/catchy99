import { getCategories } from '@/lib/data';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const categories = await getCategories();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve categories' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
