import { getProducts } from '@/lib/data';
import { db } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { Product } from '@/types';
import formidable, { File } from 'formidable';
import { put } from '@vercel/blob';
import { promises as fs } from 'fs';

// Disable Next.js body parser for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to get a single value from formidable fields
const getFieldValue = (field: string | string[] | undefined): string | undefined => {
  return Array.isArray(field) ? field[0] : field;
};

// Main handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const form = formidable({});
      const [fields, files] = await form.parse(req);

      const name = getFieldValue(fields.name);
      const description = getFieldValue(fields.description);
      const category = getFieldValue(fields.category);
      const size = getFieldValue(fields.size);
      const priceStr = getFieldValue(fields.price);
      const stockStr = getFieldValue(fields.stock);

      const imageFile = (Array.isArray(files.image) ? files.image[0] : files.image) as File | undefined;

      if (!name || !priceStr || !category || !stockStr || !imageFile) {
        return res.status(400).json({ message: 'Missing required product fields.' });
      }

      const price = parseFloat(priceStr);
      const stock = parseInt(stockStr, 10);

      if (isNaN(price) || isNaN(stock)) {
        return res.status(400).json({ message: 'Invalid price or stock format.' });
      }

      // Create uploads directory if it doesn't exist
      const fileContents = await fs.readFile(imageFile.filepath);
      const blob = await put(imageFile.originalFilename as string, fileContents, {
        access: 'public',
      });
      const productImage = blob.url;

      // Create new product object
      const newProduct: Product = {
        id: `prod_${new Date().getTime()}`,
        name,
        description: description || '',
        price,
        images: [productImage],
        category,
        size: size || 'One Size',
        stock,
      };

      const data = await db.read();

      // Add category if it's new
      const categoryExists = data.categories.some((c) => c.name.toLowerCase() === category.toLowerCase());
      if (!categoryExists) {
        data.categories.push({ id: `cat_${new Date().getTime()}`, name: category });
      }

      data.products.push(newProduct);
      await db.write(data);

      return res.status(201).json(newProduct);

    } catch (error) {
      console.error('Failed to create product:', error);
      return res.status(500).json({ message: 'Failed to create product' });
    }
  } else if (req.method === 'GET') {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const searchQuery = ((req.query.search as string) || '').toLowerCase();

      let allProducts = await getProducts();
      allProducts.sort((a, b) => a.name.localeCompare(b.name));

      if (searchQuery) {
        allProducts = allProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery) ||
            (p.category && p.category.toLowerCase().includes(searchQuery))
        );
      }

      if (page && limit) {
        const totalProducts = allProducts.length;
        const totalPages = Math.ceil(totalProducts / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const products = allProducts.slice(startIndex, endIndex);

        return res.status(200).json({
          products,
          totalProducts,
          totalPages,
          currentPage: page,
        });
      }

      return res.status(200).json(allProducts);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to retrieve products' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
