import {
  getProducts,
  createProduct,
  findCategoryByName,
  createCategory,
} from '@/lib/data';
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


// Main handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const form = formidable({});
      const [fields, files] = await form.parse(req);

      const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
      const categoryName = Array.isArray(fields.category) ? fields.category[0] : fields.category;
      const size = Array.isArray(fields.size) ? fields.size[0] : fields.size;
      const priceStr = Array.isArray(fields.price) ? fields.price[0] : fields.price;
      const stockStr = Array.isArray(fields.stock) ? fields.stock[0] : fields.stock;

      const imageFile = (Array.isArray(files.image) ? files.image[0] : files.image) as File | undefined;

      if (!name || !priceStr || !categoryName || !stockStr || !imageFile) {
        return res.status(400).json({ message: 'Missing required product fields.' });
      }

      const price = parseFloat(priceStr);
      const stock = parseInt(stockStr, 10);

      if (isNaN(price) || isNaN(stock)) {
        return res.status(400).json({ message: 'Invalid price or stock format.' });
      }

      const fileContents = await fs.readFile(imageFile.filepath);
      const blob = await put(imageFile.originalFilename as string, fileContents, {
        access: 'public',
        addRandomSuffix: true,
      });

      let category = await findCategoryByName(categoryName);
      if (!category) {
        category = await createCategory({ name: categoryName });
      }

      const newProductData: Omit<Product, 'id'> = {
        name,
        description: description || '',
        price,
        images: [blob.url],
        category: category.name,
        size: size || 'One Size',
        stock,
      };

      const newProduct = await createProduct(newProductData);

      return res.status(201).json(newProduct);

    } catch (error) {
      console.error('Failed to create product:', error);
      return res.status(500).json({ message: 'Failed to create product' });
    }
  } else if (req.method === 'GET') {
    try {
      // --- Query Parameters --- 
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 12;
      const searchQuery = ((req.query.search as string) || '').toLowerCase();
      const category = req.query.category as string;
      const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;
      const sortBy = req.query.sortBy as string;

      // --- Fetching and Filtering --- 
      let allProducts = await getProducts();

      if (searchQuery) {
        allProducts = allProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery) ||
            (p.description && p.description.toLowerCase().includes(searchQuery)) ||
            (p.category && p.category.toLowerCase().includes(searchQuery))
        );
      }

      if (category && category !== 'All') {
        allProducts = allProducts.filter(p => p.category === category);
      }

      if (maxPrice !== undefined) {
        allProducts = allProducts.filter(p => p.price <= maxPrice);
      }

      // --- Sorting ---
      allProducts.sort((a, b) => {
        switch (sortBy) {
          case 'priceLowToHigh':
            return a.price - b.price;
          case 'priceHighToLow':
            return b.price - a.price;
          case 'nameZtoA':
            return b.name.localeCompare(a.name);
          case 'nameAtoZ':
          default:
            return a.name.localeCompare(b.name);
        }
      });

      // --- Pagination ---
      const totalProducts = allProducts.length;
      const totalPages = Math.ceil(totalProducts / limit);
      const startIndex = (page - 1) * limit;
      const products = allProducts.slice(startIndex, startIndex + limit);

      return res.status(200).json({
        products,
        totalProducts,
        totalPages,
        currentPage: page,
      });

    } catch (error) {
      return res.status(500).json({ message: 'Failed to retrieve products' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
