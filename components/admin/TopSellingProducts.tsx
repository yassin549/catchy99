import React from 'react'
import { FiLoader, FiAlertCircle, FiAward } from 'react-icons/fi'

interface ProductData {
  name: string
  quantity: number
}

interface TopSellingProductsProps {
  data: ProductData[] | undefined
  isLoading: boolean
  error: Error | null
}

const TopSellingProducts: React.FC<TopSellingProductsProps> = ({
  data,
  isLoading,
  error,
}) => {
  if (isLoading)
    return (
      <div className='flex items-center justify-center h-full'>
        <FiLoader className='animate-spin text-2xl' />
      </div>
    )
  if (error)
    return (
      <div className='flex items-center justify-center h-full text-red-500'>
        <FiAlertCircle className='mr-2' /> Failed to load products.
      </div>
    )
  if (!data || data.length === 0)
    return (
      <div className='flex items-center justify-center h-full text-gray-500'>
        No sales data available.
      </div>
    )

  return (
    <div className='h-full flex flex-col'>
      <h3 className='text-lg font-semibold text-white mb-4'>
        Top Selling Products
      </h3>
      <ul className='space-y-3 flex-grow'>
        {data.map((product, index) => (
          <li
            key={product.name}
            className='flex items-center justify-between p-3 rounded-lg bg-white/10'
          >
            <div className='flex items-center'>
              <FiAward
                className={`mr-3 ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-yellow-600' : 'text-gray-500'}`}
              />
              <span className='font-medium text-gray-200'>{product.name}</span>
            </div>
            <span className='font-semibold text-white'>
              {product.quantity}{' '}
              <span className='text-xs text-gray-400'>sold</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TopSellingProducts
