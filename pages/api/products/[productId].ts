import { getProductById, updateProduct, deleteProduct } from '@/lib/data';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { productId } = req.query;

  if (typeof productId !== 'string') {
    return res.status(400).json({ message: 'Invalid product ID.' });
  }

  if (req.method === 'GET') {
    try {
      const product = await getProductById(productId);
      if (product) {
        return res.status(200).json(product);
      } else {
        return res.status(404).json({ message: 'Product not found.' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Failed to retrieve product.' });
    }
  } else if (req.method === 'PUT') {
    try {
      const updatedProduct = await updateProduct(productId, req.body);
      if (updatedProduct) {
        return res.status(200).json(updatedProduct);
      } else {
        return res.status(404).json({ message: 'Product not found.' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Failed to update product.' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await deleteProduct(productId);
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ message: 'Failed to delete product.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
