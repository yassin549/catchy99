import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { ThemeToggle } from '@/components'
import { Menu, X, ShoppingCart } from 'lucide-react'

const Navbar = () => {
  const { toggleCart, cartCount } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]
  return (
    <nav className='fixed top-0 left-0 right-0 z-40 bg-glass-light backdrop-blur-md border-b border-white/10 shadow-lg'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex-shrink-0'>
            <Link href='/' className='text-2xl font-bold text-white'>
              catchy
            </Link>
          </div>
          <div className='hidden md:flex items-center space-x-4'>
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className='text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-300'
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className='flex items-center space-x-2'>
            <ThemeToggle />
            <button onClick={toggleCart} className='relative p-2 text-gray-300 hover:text-white'>
              <ShoppingCart className='h-6 w-6' />
              {cartCount > 0 && (
                <span className='absolute top-0 right-0 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse'>
                  {cartCount}
                </span>
              )}
            </button>
            <div className='flex md:hidden'>
              <button
                onClick={() => setIsOpen(!isOpen)}
                type='button'
                className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50 focus:outline-none'
                aria-controls='mobile-menu'
                aria-expanded={isOpen}
              >
                <span className='sr-only'>Open main menu</span>
                {isOpen ? (
                  <X className='block h-6 w-6' aria-hidden='true' />
                ) : (
                  <Menu className='block h-6 w-6' aria-hidden='true' />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className='md:hidden' id='mobile-menu'>
          <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-glass-dark'>
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className='text-gray-300 hover:bg-gray-700/50 hover:text-white block px-3 py-2 rounded-md text-base font-medium'
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
