import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { CartItem } from '@/types'
import { useRouter } from 'next/router'
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react'

const FREE_SHIPPING_THRESHOLD = 50

const Cart = () => {
  const {
    isCartOpen,
    toggleCart,
    cartItems,
    cartTotal,
    removeFromCart,
    updateQuantity,
  } = useCart()
  const router = useRouter()

  const handleCheckout = () => {
    toggleCart()
    router.push('/checkout')
  }

  const shippingProgress = Math.min(
    (cartTotal / FREE_SHIPPING_THRESHOLD) * 100,
    100
  )
  const isFreeShipping = cartTotal >= FREE_SHIPPING_THRESHOLD

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleCart}
        aria-hidden='true'
      ></div>

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-full max-w-md bg-gray-50 dark:bg-gray-900 shadow-2xl transform transition-transform duration-500 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ zIndex: 1000 }}
      >
        <div className='flex flex-col h-full text-gray-800 dark:text-gray-100'>
          <header className='flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800'>
            <h2 className='text-xl font-semibold tracking-tight'>
              Shopping Cart
            </h2>
            <button
              onClick={toggleCart}
              className='p-2 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
            >
              <X size={22} />
            </button>
          </header>

          <div className='flex-grow p-5 overflow-y-auto'>
            {cartItems.length === 0 ? (
              <div className='flex flex-col items-center justify-center h-full text-center'>
                <ShoppingBag
                  size={56}
                  className='text-gray-300 dark:text-gray-600 mb-4'
                />
                <h3 className='text-xl font-semibold text-gray-700 dark:text-gray-300'>
                  Your cart is empty
                </h3>
                <p className='text-gray-500 dark:text-gray-400 mt-2 mb-6'>
                  Add items to see them here.
                </p>
                <button
                  onClick={toggleCart}
                  className='px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors'
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <ul className='space-y-4'>
                {cartItems.map((item: CartItem) => (
                  <li
                    key={item.id}
                    className='flex items-center gap-4 p-3 rounded-lg bg-white dark:bg-gray-800/70 shadow-sm'
                  >
                    <div className='relative w-20 h-20 rounded-md overflow-hidden'>
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        layout='fill'
                        objectFit='cover'
                      />
                    </div>
                    <div className='flex-grow'>
                      <h3 className='font-semibold text-base leading-tight'>
                        {item.name}
                      </h3>
                      <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                        ${item.price.toFixed(2)}
                      </p>
                      <div className='flex items-center mt-3'>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className='p-1.5 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50'
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className='px-4 text-base font-medium tabular-nums'>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className='p-1.5 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700'
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className='p-2 text-gray-400 hover:text-red-500 rounded-full'
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {cartItems.length > 0 && (
            <footer className='p-5 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50'>
              <div className='mb-4'>
                <div className='flex justify-between text-sm mb-1'>
                  <p>
                    {isFreeShipping
                      ? "You've got free shipping!"
                      : `Add $${(FREE_SHIPPING_THRESHOLD - cartTotal).toFixed(2)} more for free shipping`}
                  </p>
                </div>
                <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5'>
                  <div
                    className='bg-indigo-500 h-2.5 rounded-full transition-all duration-500'
                    style={{ width: `${shippingProgress}%` }}
                  ></div>
                </div>
              </div>
              <div className='flex justify-between items-center font-semibold text-lg mb-4'>
                <span>Subtotal:</span>
                <span className='transition-colors duration-300'>
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className='group w-full bg-indigo-600 text-white py-3.5 rounded-lg text-base font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed'
                disabled={cartItems.length === 0}
              >
                <span className='flex items-center justify-center'>
                  Proceed to Checkout{' '}
                  <ArrowRight className='ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1' />
                </span>
              </button>
            </footer>
          )}
        </div>
      </div>
    </>
  )
}

export default Cart
