import React from 'react'
import Link from 'next/link'
import { Toaster } from 'react-hot-toast'

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className='min-h-screen bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-gray-200 bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-black'>
      <Toaster
        position='top-right'
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(255, 255, 255, 0.8)',
            color: '#333',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          },
          error: {
            style: {
              background: 'rgba(255, 50, 50, 0.8)',
              color: '#fff',
            },
          },
        }}
      />
      <div className='flex'>
        <aside className='w-64 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg p-6 shadow-lg border-r border-white/20'>
          <div className='mb-10'>
            <Link
              href='/admin'
              className='text-2xl font-bold text-gray-800 dark:text-white'
            >
              LiquidGlass
            </Link>
          </div>
          <nav>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/admin/products'
                  className='block py-2.5 px-4 rounded-lg transition duration-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href='/admin/orders'
                  className='block py-2.5 px-4 rounded-lg transition duration-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
                >
                  Orders
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        <main className='flex-1 p-8'>{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout
