import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const isVercel = process.env.VERCEL === '1';
const uploadDir = isVercel ? path.join('/tmp', 'uploads') : path.join(process.cwd(), 'public', 'uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    filename: (name, ext, part) => {
      const sanitizedFilename = part.originalFilename?.replace(/[^a-zA-Z0-9._-]/g, '') || 'file';
      return `${Date.now()}-${sanitizedFilename}`;
    },
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size exceeds the 10MB limit.' });
      }
      return res.status(500).json({ error: 'Error uploading file.' });
    }

    const file: File | undefined = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    if (isVercel) {
      // On Vercel, read the file and return as Base64
      const fileContent = fs.readFileSync(file.filepath);
      const base64 = `data:${file.mimetype};base64,${fileContent.toString('base64')}`;
      fs.unlinkSync(file.filepath); // Clean up temp file
      return res.status(200).json({ filePath: base64 });
    } else {
      // On local, return the file path
      const filePath = `/uploads/${file.newFilename}`;
      return res.status(200).json({ filePath });
    }
  });
};

export default handler;
