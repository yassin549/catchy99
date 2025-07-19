import React, { useEffect, useState, useCallback } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import Link from 'next/link'
import AdminLayout from '@/layouts/AdminLayout'
import { Product } from '@/types'
import toast from 'react-hot-toast'

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const fetchProducts = useCallback(async (page = 1, search = '') => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/products?page=${page}&limit=10&search=${search}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      setProducts(data.products)
      setTotalPages(data.totalPages)
      setCurrentPage(data.currentPage)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not load products.'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debouncedSearchTerm) {
      setCurrentPage(1)
      fetchProducts(1, debouncedSearchTerm)
    } else {
      fetchProducts(currentPage)
    }
  }, [currentPage, debouncedSearchTerm, fetchProducts])

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Failed to delete product')
        }

        toast.success('Product deleted successfully!')
        fetchProducts(currentPage, debouncedSearchTerm) // Refresh the list
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Could not delete product.'
        toast.error(message)
      }
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div>Loading products...</div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div>Error: {error}</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-4xl font-bold text-gray-800 dark:text-white'>
          Manage Products
        </h1>
        <Link
          legacyBehavior
          href='/admin/products/new'
          className='bg-blue-500/80 text-white px-5 py-2.5 rounded-lg shadow-lg hover:bg-blue-600/90 backdrop-blur-md border border-white/20 transition-all duration-300'
        >
          + Add New Product
        </Link>
      </div>

      <div className='mb-6'>
        <input
          type='text'
          placeholder='Search by name or category...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className='w-full px-4 py-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-lg shadow-md border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300'
        />
      </div>

      <div className='bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg shadow-xl rounded-xl border border-white/30 overflow-hidden'>
        <table className='min-w-full'>
          <thead className='bg-white/10 dark:bg-gray-900/10'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider'>
                Name
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider'>
                Category
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider'>
                Price
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider'>
                Stock
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-white/20 dark:divide-gray-700/50'>
            {products.map(product => (
              <tr
                key={product.id}
                className='hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors duration-200'
              >
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white'>
                  {product.name}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300'>
                  {product.category}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300'>
                  ${product.price.toFixed(2)}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300'>
                  {product.stock}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                  <Link
                    legacyBehavior
                    href={`/admin/products/edit/${product.id}`}
                    className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4 transition-colors'
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className='text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className='flex justify-between items-center mt-6'>
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className='px-4 py-2 bg-white/30 dark:bg-gray-700/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-md border border-white/20 hover:bg-white/50 transition-all duration-200'
        >
          Previous
        </button>
        <span className='text-sm text-gray-700 dark:text-gray-300'>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className='px-4 py-2 bg-white/30 dark:bg-gray-700/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-md border border-white/20 hover:bg-white/50 transition-all duration-200'
        >
          Next
        </button>
      </div>
    </AdminLayout>
  )
}

export default AdminProductsPage
