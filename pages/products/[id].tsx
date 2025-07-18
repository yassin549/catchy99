import { useState } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { Product } from '@/types'
import { useCart } from '@/context/CartContext'
import { FiShoppingCart, FiPlus, FiMinus } from 'react-icons/fi'
import Image from 'next/image'

class FetchError extends Error {
  info: unknown
  status: number

  constructor(message: string, status: number, info: unknown) {
    super(message)
    this.info = info
    this.status = status
  }
}

const fetcher = async (url: string) => {
  const res = await fetch(url)

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    let errorInfo: unknown
    try {
      errorInfo = await res.json()
    } catch (e) {
      errorInfo = { message: 'Failed to parse error response.' }
    }
    throw new FetchError(
      'An error occurred while fetching the data.',
      res.status,
      errorInfo
    )
  }

  return res.json()
}

const ProductDetailPage = () => {
  const router = useRouter()
  const { id } = router.query

  const { data: product, error } = useSWR<Product>(
    id ? `/api/products/${id}` : null,
    fetcher
  )
  const { addToCart } = useCart()

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  if (error)
    return (
      <div className='text-center text-red-500'>Failed to load product.</div>
    )
  if (!product) return <div className='text-center'>Loading...</div>

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount))
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity)
    }
  }

  return (
    <div className='container mx-auto px-4 py-16 bg-gradient-to-b from-gray-900 to-black min-h-screen'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Glass Product Container */}
        <div className='bg-white/5 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8'>
          {/* Image Carousel */}
          <div className='relative mb-8'>
            <div className='aspect-w-16 aspect-h-9'>
              <Image
                src={product.images[selectedImage]}
                alt={`${product.name} - view ${selectedImage + 1}`}
                layout='fill'
                className='object-cover rounded-xl'
              />
            </div>
            <div className='flex justify-center space-x-2 mt-4'>
              {product.images.map((img, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer ${
                    selectedImage === index
                      ? 'ring-2 ring-blue-500'
                      : 'ring-1 ring-white/20'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    width={96}
                    height={96}
                    className='object-cover rounded-lg'
                  />
                  {selectedImage === index && (
                    <div className='absolute inset-0 bg-blue-500/20 rounded-lg' />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className='space-y-6'>
            <div className='space-y-2'>
              <h2 className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400'>
                {product.name}
              </h2>
              <p className='text-2xl font-semibold text-white'>
                ${product.price.toFixed(2)}
              </p>
              <p className='text-gray-400 line-clamp-4'>
                {product.description}
              </p>

              <div className='space-y-2'>
                <div className='flex items-center gap-4'>
                  <div className='flex-1'>
                    <h3 className='text-sm font-medium text-gray-300'>
                      Category
                    </h3>
                    <p className='text-white'>{product.category}</p>
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-sm font-medium text-gray-300'>Size</h3>
                    <p className='text-white'>{product.size}</p>
                  </div>
                </div>

                {/* Add to Cart */}
                <div className='flex items-center gap-4'>
                  <div className='flex items-center space-x-2'>
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity === 1}
                      className='w-10 h-10 rounded-full bg-white/5 dark:bg-gray-800/50 border border-white/10 flex items-center justify-center hover:bg-blue-500/50 transition-all disabled:opacity-50'
                    >
                      <FiMinus className='w-5 h-5 text-gray-300' />
                    </button>
                    <span className='w-16 h-10 flex items-center justify-center border border-white/10 bg-white/5 dark:bg-gray-800/50 rounded-full text-white'>
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className='w-10 h-10 rounded-full bg-white/5 dark:bg-gray-800/50 border border-white/10 flex items-center justify-center hover:bg-blue-500/50 transition-all'
                    >
                      <FiPlus className='w-5 h-5 text-gray-300' />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className='flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:opacity-90 transition-all'
                  >
                    <FiShoppingCart className='w-5 h-5 mr-2' />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
