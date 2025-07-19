import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { toast } from 'react-hot-toast'

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart(product, 1)
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <Link href={`/products/${product.id}`} legacyBehavior>
      <a className='group block bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl'>
        <div className='relative h-56 sm:h-64 w-full overflow-hidden'>
          <Image
            src={product.images[0]}
            alt={product.name}
            layout='fill'
            objectFit='cover'
            className='transition-transform duration-500 group-hover:scale-110'
          />
          <div className='absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300'></div>
          <button
            onClick={handleAddToCart}
            className='absolute top-4 right-4 bg-indigo-600 text-white p-2 sm:p-3 rounded-full transition-all duration-300 hover:bg-indigo-700 hover:scale-110'
          >
            <ShoppingCart size={20} />
          </button>
        </div>
        <div className='p-4 sm:p-5'>
          <h3 className='text-base sm:text-lg font-bold text-gray-800 dark:text-white truncate'>
            {product.name}
          </h3>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            {product.category}
          </p>
          <p className='text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white mt-2'>
            ${product.price.toFixed(2)}
          </p>
        </div>
      </a>
    </Link>
  )
}

export default ProductCard
