import { useState, useMemo, useEffect } from 'react'

import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { Product, Category } from '@/types'
import ProductCard from '@/components/ProductCard'
import { getProducts, getCategories } from '@/lib/data';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  Loader2,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Frown,
} from 'lucide-react'

const ITEMS_PER_PAGE = 12

const ProductsPage = ({
  initialProducts,
  initialCategories,
}: {
  initialProducts: Product[]
  initialCategories: Category[]
}) => {
  const router = useRouter()
  const [products] = useState(initialProducts)
  const [categories] = useState(initialCategories || []);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: 'All',
    maxPrice: 1000,
    sortBy: 'nameAtoZ',
  })

  useEffect(() => {
    if (router.query.category) {
      setFilters(prev => ({
        ...prev,
        category: router.query.category as string,
      }))
    }
  }, [router.query.category])

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

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      category: 'All',
      maxPrice: 1000,
      sortBy: 'nameAtoZ',
    })
    setCurrentPage(1)
  }

  const filteredAndPaginatedProducts = useMemo(() => {
    if (!products) return { paginated: [], totalPages: 0, totalResults: 0 }

        const filtered = products.filter(p => {
      // Assuming p.category is the category name (string)
      return (
        (filters.category === 'All' || p.category === filters.category) &&
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

  const { paginated, totalPages, totalResults } = filteredAndPaginatedProducts

  const FilterSidebar = () => (
    <aside
      className={`${isFiltersOpen ? 'block' : 'hidden'} lg:block lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg`}
    >
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Filters
        </h2>
        <button
          onClick={() => setIsFiltersOpen(false)}
          className='lg:hidden text-gray-500 dark:text-gray-400'
        >
          <X size={24} />
        </button>
      </div>

      <div className='space-y-6'>
        <div className='relative'>
          <Search
            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
            size={20}
          />
          <input
            type='text'
            name='searchTerm'
            placeholder='Search...'
            value={filters.searchTerm}
            onChange={handleFilterChange}
            className='w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Category
          </label>
          <select
            name='category'
            value={filters.category}
            onChange={handleFilterChange}
            className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700'
          >
            <option value='All'>All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Max Price:{' '}
            <span className='font-bold text-indigo-600 dark:text-indigo-400'>
              ${filters.maxPrice}
            </span>
          </label>
          <input
            type='range'
            name='maxPrice'
            min='0'
            max='1000'
            step='10'
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-indigo-600'
          />
        </div>
        <div>
          <button
            onClick={resetFilters}
            className='w-full text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300'
          >
            Reset Filters
          </button>
        </div>
      </div>
    </aside>
  )

  return (
    <>
      <NextSeo
        title='Products - Catchy'
        description='Explore our collection of curated fashion items.'
      />
      <div className='bg-gray-50 dark:bg-gray-900 min-h-screen'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='text-center mb-12'>
            <h1 className='text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl'>
              Our Collection
            </h1>
            <p className='mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400'>
              Find your next favorite piece from our curated selection.
            </p>
          </div>

          <div className='lg:grid lg:grid-cols-4 lg:gap-8'>
            <FilterSidebar />

            <main className='lg:col-span-3'>
              <div className='flex justify-between items-center mb-6'>
                <button
                  onClick={() => setIsFiltersOpen(true)}
                  className='lg:hidden flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm'
                >
                  <SlidersHorizontal size={20} className='mr-2' /> Filters
                </button>
                <div className='flex items-center space-x-4'>
                  <span className='text-sm text-gray-500 dark:text-gray-400'>
                    Showing {paginated.length} of {totalResults} products
                  </span>
                  <select
                    name='sortBy'
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                    className='p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700'
                  >
                    <option value='nameAtoZ'>Sort: Name A-Z</option>
                    <option value='nameZtoA'>Sort: Name Z-A</option>
                    <option value='priceLowToHigh'>Sort: Price Low-High</option>
                    <option value='priceHighToLow'>Sort: Price High-Low</option>
                  </select>
                </div>
              </div>

              {!products ? (
                <div className='flex justify-center items-center h-96'>
                  <Loader2 className='w-12 h-12 animate-spin text-indigo-500' />
                </div>
              ) : paginated.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8'>
                  {paginated.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className='text-center py-16 col-span-full'>
                  <Frown size={64} className='mx-auto text-gray-400' />
                  <h3 className='mt-4 text-2xl font-semibold text-gray-900 dark:text-white'>
                    No Products Found
                  </h3>
                  <p className='mt-2 text-gray-500 dark:text-gray-400'>
                    Try adjusting your filters or check back later!
                  </p>
                </div>
              )}

              {totalPages > 1 && (
                <div className='flex justify-center items-center mt-12'>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    <ChevronLeft className='w-6 h-6' />
                  </button>
                  <span className='px-4 py-2 text-lg font-medium'>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage(p => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    <ChevronRight className='w-6 h-6' />
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  )
}

export const getStaticProps = async ({ locale }: { locale: string }) => {
  try {
    const [products, categories] = await Promise.all([
      getProducts(),
      getCategories(),
    ]);

    return {
      props: {
        ...(await serverSideTranslations(locale, ['common', 'products'])),
        initialProducts: products || [],
        initialCategories: categories || [],
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Failed to fetch products/categories:', error);
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common', 'products'])),
        initialProducts: [],
        initialCategories: [],
        error: 'Failed to load products. Please try again later.',
      },
    };
  }
};

export default ProductsPage
