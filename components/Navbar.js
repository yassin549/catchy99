import { useState, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ThemeToggle } from '@/components';
import { useTranslation } from 'next-i18next';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import { Menu, X, ShoppingCart } from 'lucide-react';

const Navbar = () => {
  const { t } = useTranslation('common');
  const { theme } = useTheme();
  const router = useRouter();
  const { toggleCart, cartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('navbar.home') },
    { href: '/products', label: t('navbar.products') },
    { href: '/about', label: t('navbar.about') },
    { href: '/contact', label: t('navbar.contact') },
  ];

  return (
    <nav className='fixed top-0 left-0 right-0 z-40 pt-4 text-white'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='relative bg-black/30 backdrop-blur-xl border border-white/20 shadow-lg rounded-full'>
          <div className='flex items-center justify-between h-16 px-6'>
            <div className='flex-shrink-0'>
              <Link href='/' className='text-2xl font-bold' style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                Tunis Store
              </Link>
            </div>
            <div className='hidden md:flex items-center space-x-8'>
              {navLinks.map(link => {
                const isActive = router.pathname === link.href;
                return (
                  <Link key={link.label} href={link.href} legacyBehavior>
                    <a className={`relative text-lg font-medium transition-colors hover:text-white/80 ${isActive ? 'text-white' : ''}`} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                      {link.label}
                      {isActive && (
                        <span className='absolute -bottom-2 left-1/2 -translate-x-1/2 w-4/5 h-1 bg-indigo-500 rounded-full' />
                      )}
                    </a>
                  </Link>
                )
              })}
            </div>
            <div className='flex items-center space-x-2'>
              <div className='hidden md:block'>
                <ThemeToggle />
              </div>
              <button onClick={toggleCart} className='relative p-2'>
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
      </div>

      {isOpen && (
        <div className='md:hidden' id='mobile-menu'>
          <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/80 backdrop-blur-lg rounded-b-2xl border-t border-white/10'>
            {navLinks.map(link => {
              const isActive = router.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-gray-300 hover:bg-gray-700/50 hover:text-white block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-gray-700/50 text-white' : ''}`}
                >
                  {link.label}
                </Link>
              )
            })}
            <div className='border-t border-gray-700 my-2'></div>
            <div className='px-3 py-2'>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
