import React from 'react'
import { useCart } from '@/context/CartContext'
import { FiShoppingCart, FiX, FiPlus, FiMinus } from 'react-icons/fi'
import Link from 'next/link'

interface CartPanelProps {
  isOpen: boolean
  onClose: () => void
}

const CartPanel: React.FC<CartPanelProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } =
    useCart()

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black/50 z-50 flex items-start'>
      {/* Cart Panel */}
      <div className='w-full max-w-md bg-white/5 dark:bg-gray-800/50 backdrop-blur-sm border-l border-white/10 h-full overflow-y-auto'>
        {/* Header */}
        <div className='p-4 border-b border-white/10'>
          <div className='flex justify-between items-center'>
            <h2 className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400'>
              Shopping Cart
            </h2>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-white'
            >
              <FiX className='w-6 h-6' />
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className='p-4'>
          {cartItems.length === 0 ? (
            <div className='text-center py-12'>
              <FiShoppingCart className='w-12 h-12 mx-auto mb-4 text-gray-400' />
              <p className='text-gray-400'>Your cart is empty</p>
            </div>
          ) : (
            <div className='space-y-4'>
              {cartItems.map(item => (
                <div
                  key={item.id}
                  className='flex items-center justify-between p-4 bg-white/5 dark:bg-gray-800/50 rounded-lg border border-white/10'
                >
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-white truncate'>
                      {item.name}
                    </p>
                    <p className='text-sm text-gray-400'>
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                  <div className='flex items-center space-x-4'>
                    {/* Quantity Controls */}
                    <div className='flex items-center space-x-2'>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className='w-8 h-8 rounded-full bg-white/5 dark:bg-gray-800/50 border border-white/10 flex items-center justify-center hover:bg-blue-500/50 transition-all'
                      >
                        <FiMinus className='w-4 h-4 text-gray-400' />
                      </button>
                      <span className='w-12 h-8 flex items-center justify-center bg-white/5 dark:bg-gray-800/50 border border-white/10 rounded-full text-white'>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className='w-8 h-8 rounded-full bg-white/5 dark:bg-gray-800/50 border border-white/10 flex items-center justify-center hover:bg-blue-500/50 transition-all'
                      >
                        <FiPlus className='w-4 h-4 text-gray-400' />
                      </button>
                    </div>
                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className='text-red-400 hover:text-red-300'
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary */}
        <div className='p-4 border-t border-white/10'>
          <div className='flex justify-between items-center mb-4'>
            <p className='text-sm text-gray-400'>Subtotal</p>
            <p className='text-lg font-semibold text-white'>
              ${cartTotal.toFixed(2)}
            </p>
          </div>
          <div className='flex justify-between items-center'>
            <p className='text-sm text-gray-400'>Shipping</p>
            <p className='text-white'>Free</p>
          </div>
          <div className='mt-4'>
            <button
              onClick={clearCart}
              className='w-full bg-red-500/50 text-red-400 hover:bg-red-500/30 transition-all py-2 px-4 rounded-lg'
            >
              Clear Cart
            </button>
            <Link href='/checkout' className='w-full mt-4' legacyBehavior>
              <button className='w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-all'>
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPanel
