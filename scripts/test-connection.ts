import { list } from '@vercel/blob';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testConnection() {
  console.log('--- Starting Vercel Blob Connection Test ---');
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    console.error('FATAL: BLOB_READ_WRITE_TOKEN is not defined. Check your .env.local file.');
    return;
  }

  console.log('Token loaded. Attempting to list blobs...');

  try {
    const { blobs } = await list({ token });
    console.log('--- SUCCESS ---');
    console.log('Successfully connected to Vercel Blob Storage.');
    if (blobs.length === 0) {
      console.log('The Blob store is currently empty.');
    } else {
      console.log(`Found ${blobs.length} file(s):`);
      blobs.forEach(blob => console.log(`- ${blob.pathname} (Size: ${blob.size} bytes)`));
    }
  } catch (error) {
    console.error('--- CONNECTION FAILED ---');
    console.error('An error occurred while trying to connect:');
    console.error(error);
  }
}

testConnection();
