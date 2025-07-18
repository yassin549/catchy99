import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { CartItem } from '@/types'
import { useRouter } from 'next/router'

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
    toggleCart() // Close the cart panel
    router.push('/checkout')
  }

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full max-w-md bg-white/70 backdrop-blur-lg shadow-2xl transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className='flex flex-col h-full'>
        <div className='flex justify-between items-center p-4 border-b border-gray-300'>
          <h2 className='text-2xl font-semibold'>Your Cart</h2>
          <button onClick={toggleCart} className='text-2xl'>
            &times;
          </button>
        </div>

        <div className='flex-grow p-4 overflow-y-auto'>
          {cartItems.length === 0 ? (
            <p className='text-center text-gray-500'>Your cart is empty.</p>
          ) : (
            cartItems.map((item: CartItem) => (
              <div
                key={item.id}
                className='flex items-center mb-4 border-b pb-4'
              >
                <Image
                  src={item.images[0]}
                  alt={item.name}
                  width={80}
                  height={80}
                  className='object-cover rounded-md mr-4'
                />
                <div className='flex-grow'>
                  <h3 className='font-semibold'>{item.name}</h3>
                  <p className='text-sm text-gray-600'>
                    ${item.price.toFixed(2)}
                  </p>
                  <div className='flex items-center mt-2'>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className='px-2 border rounded-l'
                    >
                      -
                    </button>
                    <span className='px-4 border-t border-b'>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className='px-2 border rounded-r'
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className='text-red-500 hover:text-red-700 ml-4'
                >
                  &times;
                </button>
              </div>
            ))
          )}
        </div>

        <div className='p-4 border-t border-gray-300'>
          <div className='flex justify-between items-center font-bold text-xl mb-4'>
            <span>Subtotal:</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            className='w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors'
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart
