import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    filename: (name, ext, part, form) => {
      return `${Date.now()}-${part.originalFilename}`;
    }
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).json({ error: 'Error uploading file.' });
    }

    const fileArray = files.file as formidable.File[];
    if (!fileArray || fileArray.length === 0) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    const file = fileArray[0];

    const filePath = `/uploads/${path.basename(file.filepath)}`;
    res.status(200).json({ filePath });
  });
};

export default handler;
