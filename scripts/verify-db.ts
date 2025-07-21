import { list } from '@vercel/blob';
import path from 'path';

// Manually load environment variables
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function verifyDB() {
  console.log('--- Database Verification Script Started ---');

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.error('ERROR: BLOB_READ_WRITE_TOKEN is not defined in your .env.local file.');
    console.log('--- Script Finished ---');
    process.exit(1);
  }
  console.log('Successfully loaded BLOB_READ_WRITE_TOKEN.');

  try {
    console.log('Attempting to connect to Vercel Blob Storage...');
    const { blobs } = await list({ prefix: 'db.json', limit: 1, token });
    console.log('Connection successful. Checking for db.json...');

    if (blobs.length === 0) {
      console.error('ERROR: The database file (db.json) does not exist in your Vercel Blob store.');
      console.log('Please run `npm run db:init` to create it.');
      console.log('--- Script Finished ---');
      return;
    }

    const dbBlob = blobs[0];
    console.log(`Found database file: ${dbBlob.pathname}, Size: ${dbBlob.size} bytes.`);
    console.log('Fetching file content...');

    const response = await fetch(dbBlob.url);
    if (!response.ok) {
        throw new Error(`Failed to fetch db.json: ${response.statusText}`);
    }
    const data = await response.json();

    console.log('--- DATABASE CONTENT ---');
    console.log(JSON.stringify(data, null, 2));
    console.log('------------------------');

    if (data.users && data.users.length > 0) {
      console.log(`Found ${data.users.length} user(s).`);
      const admin = data.users.find((u: any) => u.email === 'admin@catchy.com');
      if (admin) {
        console.log('SUCCESS: Admin user (admin@catchy.com) was found.');
      } else {
        console.error('ERROR: Admin user (admin@catchy.com) was NOT found in the database!');
      }
    } else {
      console.error('ERROR: The users array in your database is empty or missing!');
    }

  } catch (error) {
    console.error('\n--- VERIFICATION FAILED ---');
    console.error('An unexpected error occurred:');
    console.error(error);
  }
  console.log('--- Script Finished ---');
}

verifyDB();
