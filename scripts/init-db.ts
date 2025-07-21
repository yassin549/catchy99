import bcrypt from 'bcryptjs';
import { db } from '../lib/db';
import { User } from '../types';

async function initializeDB() {
  console.log('Initializing database...');

  try {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      throw new Error('ADMIN_PASSWORD environment variable is not set.');
    }

    const passwordHash = await bcrypt.hash(adminPassword, 10);

    const adminUser: User = {
      id: '1',
      email: 'admin@catchy.com',
      passwordHash,
      roles: ['admin'],
    };

    await db.write({ 
      users: [adminUser], 
      products: [], 
      orders: [], 
      categories: [] 
    });

    console.log('Database initialized with admin user.');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

initializeDB();
