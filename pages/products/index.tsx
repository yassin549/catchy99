import { useState, useMemo, useEffect } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import Image from 'next/image'
import {
  FiSearch,
  FiRefreshCw,
  FiArrowLeft,
  FiArrowRight,
} from 'react-icons/fi'
import { Product } from '@/types'
import MainLayout from '../../components/layout/MainLayout'

const fetcher = (url: string) => fetch(url).then(res => res.json())
const ITEMS_PER_PAGE = 12

const ProductsPage = () => {
  const { data: products, error } = useSWR<Product[]>('/api/products', fetcher)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: 'All',
    size: 'All',
    maxPrice: 1000,
    sortBy: 'nameAtoZ',
  })

  useEffect(() => {
    if (products || error) {
      setLoading(false)
    }
  }, [products, error])

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: name === 'maxPrice' ? parseInt(value, 10) : value,
    }))
    setCurrentPage(1)
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, sortBy: e.target.value }))
  }

  const filteredAndPaginatedProducts = useMemo(() => {
    if (!products) return { paginated: [], totalPages: 0, totalResults: 0 }

    const filtered = products.filter(p => {
      return (
        (filters.category === 'All' || p.category === filters.category) &&
        (filters.size === 'All' || (p.size && p.size === filters.size)) &&
        p.price <= filters.maxPrice &&
        p.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      )
    })

    const sorted = [...filtered].sort((a, b) => {
      switch (filters.sortBy) {
        case 'priceLowToHigh':
          return a.price - b.price
        case 'priceHighToLow':
          return b.price - a.price
        case 'nameAtoZ':
          return a.name.localeCompare(b.name)
        case 'nameZtoA':
          return b.name.localeCompare(a.name)
        default:
          return 0
      }
    })

    const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE)
    const paginated = sorted.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    )

    return { paginated, totalPages, totalResults: filtered.length }
  }, [products, filters, currentPage])

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[60vh]'>
        <FiRefreshCw className='w-12 h-12 text-blue-400 animate-spin' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='text-center py-16'>
        <p className='text-red-400'>Failed to load products.</p>
      </div>
    )
  }

  const { paginated, totalPages, totalResults } = filteredAndPaginatedProducts
  const categories = [
    'All',
    ...Array.from(new Set(products?.map(p => p.category))),
  ]
  const sizes = [
    'All',
    ...Array.from(new Set(products?.map(p => p.size).filter(Boolean))),
  ]

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
        <div className='md:col-span-1 bg-white/5 dark:bg-gray-800/50 p-6 rounded-xl border border-white/10 backdrop-blur-sm'>
          <h2 className='text-2xl font-bold text-white mb-6'>Filters</h2>
          <div className='relative mb-4'>
            <input
              type='text'
              name='searchTerm'
              placeholder='Search products...'
              value={filters.searchTerm}
              onChange={handleFilterChange}
              className='w-full bg-gray-700/50 text-white placeholder-gray-400 border border-white/10 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-300 mb-2'>
              Category
            </label>
            <select
              name='category'
              value={filters.category}
              onChange={handleFilterChange}
              className='w-full bg-gray-700/50 text-white border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              {categories.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-300 mb-2'>
              Size
            </label>
            <select
              name='size'
              value={filters.size}
              onChange={handleFilterChange}
              className='w-full bg-gray-700/50 text-white border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              {sizes.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-300 mb-2'>
              Max Price: ${filters.maxPrice}
            </label>
            <input
              type='range'
              name='maxPrice'
              min='0'
              max='1000'
              step='10'
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className='w-full'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-300 mb-2'>
              Sort By
            </label>
            <select
              name='sortBy'
              value={filters.sortBy}
              onChange={handleSortChange}
              className='w-full bg-gray-700/50 text-white border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='nameAtoZ'>Name: A-Z</option>
              <option value='nameZtoA'>Name: Z-A</option>
              <option value='priceLowToHigh'>Price: Low to High</option>
              <option value='priceHighToLow'>Price: High to Low</option>
            </select>
          </div>
        </div>
        <div className='md:col-span-3'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {paginated.length > 0 ? (
              paginated.map(product => (
                <Link
                  href={`/products/${product.id}`}
                  key={product.id}
                  className='block'
                >
                  <div className='group relative overflow-hidden rounded-xl bg-white/5 dark:bg-gray-800/50 border border-white/10 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50'>
                    <div className='aspect-w-1 aspect-h-1'>
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={400}
                        height={400}
                        className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300'
                      />
                    </div>
                    <div className='p-4'>
                      <h2 className='text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors'>
                        {product.name}
                      </h2>
                      <p className='text-sm text-gray-400 line-clamp-2 mb-2'>
                        {product.description}
                      </p>
                      <p className='text-xl font-bold text-white'>
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className='col-span-full text-center py-12'>
                <p className='text-gray-400'>
                  No products match your criteria.
                </p>
              </div>
            )}
          </div>
          {totalPages > 1 && (
            <div className='flex justify-center items-center mt-8'>
              <div className='flex flex-col items-center space-y-2'>
                <div className='flex items-center space-x-2'>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className='flex items-center justify-center w-10 h-10 rounded-full bg-white/5 dark:bg-gray-800/50 border border-white/10 backdrop-blur-sm hover:bg-blue-500/50 hover:text-white disabled:opacity-50 transition-all'
                  >
                    <FiArrowLeft className='w-5 h-5' />
                  </button>
                  <span className='px-4 py-2 bg-white/5 dark:bg-gray-800/50 rounded-full text-white'>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage(p => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className='flex items-center justify-center w-10 h-10 rounded-full bg-white/5 dark:bg-gray-800/50 border border-white/10 backdrop-blur-sm hover:bg-blue-500/50 hover:text-white disabled:opacity-50 transition-all'
                  >
                    <FiArrowRight className='w-5 h-5' />
                  </button>
                </div>
                <p className='text-sm text-gray-400'>
                  Showing {paginated.length} of {totalResults} products
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

ProductsPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>
}

export default ProductsPage
