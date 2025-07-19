import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { ThemeToggle } from '@/components'

const Navbar = () => {
  const { toggleCart, cartCount } = useCart()
  return (
    <nav className='fixed top-0 left-0 right-0 z-40 bg-glass-light backdrop-blur-md border-b border-white/10 shadow-lg'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex-shrink-0'>
            <Link
              legacyBehavior
              href='/'
              className='text-2xl font-bold text-white'
            >
              catchy
            </Link>
          </div>
          <div className='hidden md:block'>
            <div className='flex items-center space-x-4'>
              <button onClick={toggleCart} className='relative p-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                  />
                </svg>
                {cartCount > 0 && (
                  <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                    {cartCount}
                  </span>
                )}
              </button>
              <Link
                legacyBehavior
                href='/'
                className='text-gray-300 hover:text-white hover:text-shadow-neon-blue px-3 py-2 rounded-md text-sm font-medium transition-all duration-300'
              >
                Home
              </Link>
              <Link
                legacyBehavior
                href='/products'
                className='text-gray-300 hover:text-white hover:text-shadow-neon-blue px-3 py-2 rounded-md text-sm font-medium transition-all duration-300'
              >
                Products
              </Link>
              <Link
                legacyBehavior
                href='/about'
                className='text-gray-300 hover:text-white hover:text-shadow-neon-blue px-3 py-2 rounded-md text-sm font-medium transition-all duration-300'
              >
                About
              </Link>
              <Link
                legacyBehavior
                href='/contact'
                className='text-gray-300 hover:text-white hover:text-shadow-neon-blue px-3 py-2 rounded-md text-sm font-medium transition-all duration-300'
              >
                Contact
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
