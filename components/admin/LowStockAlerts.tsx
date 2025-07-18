import React from 'react'
import Link from 'next/link'
import { Product } from '@/types'
import { FiAlertTriangle } from 'react-icons/fi'

interface LowStockAlertsProps {
  products: Product[]
}

const LowStockAlerts: React.FC<LowStockAlertsProps> = ({ products }) => {
  if (products.length === 0) {
    return null // Don't render anything if there are no alerts
  }

  return (
    <div className='bg-yellow-400/10 dark:bg-yellow-800/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-yellow-500/50 text-yellow-800 dark:text-yellow-200'>
      <div className='flex items-center'>
        <FiAlertTriangle className='h-6 w-6 mr-3' />
        <h2 className='text-xl font-bold'>Low Stock Alerts</h2>
      </div>
      <ul className='mt-4 space-y-2'>
        {products.map(product => (
          <li
            key={product.id}
            className='flex justify-between items-center bg-yellow-500/10 p-3 rounded-lg'
          >
            <div>
              <span className='font-semibold'>{product.name}</span>
              <span className='text-sm ml-2 opacity-80'>
                ({product.stock} left)
              </span>
            </div>
            <Link
              href={`/admin/products/edit/${product.id}`}
              className='text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 transition-colors'
            >
              Restock
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LowStockAlerts
