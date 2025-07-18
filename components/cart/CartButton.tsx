import React from 'react'
import { useCart } from '@/context/CartContext'
import { FiShoppingCart } from 'react-icons/fi'

const CartButton: React.FC = () => {
  const { cartCount, toggleCart } = useCart()

  return (
    <button
      onClick={toggleCart}
      className='relative p-2 hover:bg-white/5 dark:hover:bg-gray-800/50 rounded-lg transition-colors'
    >
      <FiShoppingCart className='w-6 h-6 text-white' />
      {cartCount > 0 && (
        <span className='absolute -top-1 -right-1 bg-red-500/50 text-red-400 text-xs rounded-full w-5 h-5 flex items-center justify-center'>
          {cartCount}
        </span>
      )}
    </button>
  )
}

export default CartButton
