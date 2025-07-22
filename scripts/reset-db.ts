import dotenv from 'dotenv';
import path from 'path';

// Explicitly load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { put } from '@vercel/blob';
import { db, DbData } from '../lib/db';

const initialDb: DbData = {
  products: [],
  users: [],
  orders: [],
  categories: [],
};

async function resetDb() {
  console.log('Resetting database...');
  try {
    await db.write(initialDb);
    console.log('Database has been successfully reset to its initial state.');
  } catch (error) {
    console.error('Failed to reset the database:', error);
    process.exit(1);
  }
}

resetDb();
