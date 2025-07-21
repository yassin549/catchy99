import { getProducts } from '@/lib/data';
import { db } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { Product } from '@/types';
import formidable from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      try {
        const page = req.query.page
          ? parseInt(req.query.page as string, 10)
          : undefined;
        const limit = req.query.limit
          ? parseInt(req.query.limit as string, 10)
          : undefined;
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

        res.status(200).json(allProducts);
      } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve products' });
      }
      break;

    case 'POST':
      try {
        const form = formidable({});
        const [fields, files] = await form.parse(req);

        const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
        const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
        const price = Array.isArray(fields.price) ? parseFloat(fields.price[0]) : parseFloat(fields.price as string);
        const category = Array.isArray(fields.category) ? fields.category[0] : fields.category;
        const size = Array.isArray(fields.size) ? fields.size[0] : fields.size;
        const stock = Array.isArray(fields.stock) ? parseInt(fields.stock[0], 10) : parseInt(fields.stock as string, 10);

        const imageFile = files.image?.[0];

        if (!name || !price || !category || stock === undefined || !imageFile) {
          return res
            .status(400)
            .json({ message: 'Missing required product fields.' });
        }

        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        await fs.mkdir(uploadsDir, { recursive: true });

        const imagePath = imageFile.filepath;
        const newFileName = `${Date.now()}_${imageFile.originalFilename}`;
        const newPath = path.join(uploadsDir, newFileName);
        await fs.rename(imagePath, newPath);
        const productImage = `/uploads/${newFileName}`;

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

        const categoryExists = data.categories.some(
          (c) => c.name.toLowerCase() === category.toLowerCase()
        );
        if (!categoryExists) {
          const newCategory = {
            id: `cat_${new Date().getTime()}`,
            name: category,
          };
          data.categories.push(newCategory);
        }

        data.products.push(newProduct);
        await db.write(data);
        res.status(201).json(newProduct);
      } catch (error) {
        console.error('Failed to create product:', error);
        res.status(500).json({ message: 'Failed to create product' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
