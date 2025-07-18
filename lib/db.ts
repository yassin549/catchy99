import fs from 'fs/promises'
import path from 'path'
import { Product, User, Order } from '@/types'

// Define the structure of our database
export interface DbData {
  products: Product[]
  users: User[]
  orders: Order[]
}

const dbPath = path.join(process.cwd(), 'db.json')

/**
 * A simple, robust database helper that uses native Node.js fs/promises
 * to read from and write to a JSON file, avoiding ESM/CJS module conflicts.
 */
export const db = {
  async read(): Promise<DbData> {
    try {
      const fileContent = await fs.readFile(dbPath, 'utf-8')
      return JSON.parse(fileContent)
    } catch (error: unknown) {
      // Type guard to check if error is an object with a 'code' property
      const isFsError = (err: unknown): err is { code: string } => {
        return typeof err === 'object' && err !== null && 'code' in err
      }

      if (isFsError(error)) {
        // If the file doesn't exist, return default structure
        if (error.code === 'ENOENT') {
          return { products: [], users: [], orders: [] }
        }
        // For other file system errors, rethrow them
        throw error
      }
      // If the error is not a file system error, rethrow it
      throw error
    }
  },

  async write(data: DbData): Promise<void> {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8')
  },
}
