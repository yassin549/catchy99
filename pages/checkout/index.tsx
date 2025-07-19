import React, { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { Product } from '@/types'
import {
  CreditCard,
  Lock,
  Loader2,
  ShoppingCart,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'

const CheckoutPage = () => {
  const router = useRouter()
  const { cartItems, cartTotal, clearCart } = useCart()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    city: '',
    postalCode: '',
    country: 'United States',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    const errors: { [key: string]: string } = {}
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required'
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    if (!formData.phone.trim()) errors.phone = 'Phone number is required'
    if (!formData.addressLine1.trim())
      errors.addressLine1 = 'Address is required'
    if (!formData.city.trim()) errors.city = 'City is required'
    if (!formData.postalCode.trim())
      errors.postalCode = 'Postal code is required'
    return errors
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault()
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors)
      toast.error('Please correct the errors before submitting.')
      return
    }

    setIsLoading(true)
    setFormErrors({})

    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress: formData,
          total: cartTotal,
        }),
      })

      if (!response.ok) throw new Error('Failed to place order')

      const data = await response.json()
      clearCart()

      router.push({
        pathname: '/checkout/confirmation',
        query: {
          orderId: data.order.id,
          total: cartTotal,
          ...formData,
        },
      })
    } catch (error) {
      toast.error('Failed to place order. Please try again.')
      console.error('Order submission error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (cartItems.length === 0 && !isLoading) {
    return (
      <div className='container mx-auto px-4 py-16 text-center flex flex-col items-center justify-center min-h-[60vh]'>
        <ShoppingCart
          size={64}
          className='text-gray-400 dark:text-gray-500 mb-4'
        />
        <h1 className='text-3xl font-bold mb-4'>Your Cart is Empty</h1>
        <p className='text-gray-500 dark:text-gray-400 mb-8'>
          Add some items to your cart to proceed to checkout.
        </p>
        <Link href='/products' legacyBehavior>
          <a className='inline-block bg-indigo-600 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors'>
            Continue Shopping
          </a>
        </Link>
      </div>
    )
  }

  const InputField = ({
    name,
    label,
    type = 'text',
    required = true,
    error,
    ...props
  }: any) => (
    <div>
      <label
        htmlFor={name}
        className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={formData[name as keyof typeof formData]}
        onChange={handleChange}
        className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'}`}
        required={required}
        {...props}
      />
      {error && (
        <p className='text-sm text-red-500 mt-1 flex items-center'>
          <AlertCircle size={14} className='mr-1' />
          {error}
        </p>
      )}
    </div>
  )

  return (
    <>
      <Head>
        <title>Checkout | Catchy</title>
      </Head>
      <div className='bg-gray-50 dark:bg-gray-900 min-h-screen'>
        <div className='container mx-auto px-4 py-12 md:py-24'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16'>
            <div className='lg:col-span-7'>
              <div className='bg-white dark:bg-gray-800/50 rounded-2xl p-6 md:p-8 shadow-lg'>
                <h2 className='text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100'>
                  Shipping Information
                </h2>
                <form onSubmit={handleSubmit} className='space-y-6'>
                  <InputField
                    name='fullName'
                    label='Full Name'
                    error={formErrors.fullName}
                  />
                  <div className='grid md:grid-cols-2 gap-6'>
                    <InputField
                      name='email'
                      label='Email Address'
                      type='email'
                      error={formErrors.email}
                    />
                    <InputField
                      name='phone'
                      label='Phone Number'
                      type='tel'
                      error={formErrors.phone}
                    />
                  </div>
                  <hr className='dark:border-gray-700' />
                  <InputField
                    name='addressLine1'
                    label='Address'
                    error={formErrors.addressLine1}
                  />
                  <div className='grid md:grid-cols-3 gap-6'>
                    <InputField
                      name='city'
                      label='City'
                      error={formErrors.city}
                    />
                    <InputField
                      name='postalCode'
                      label='Postal Code'
                      error={formErrors.postalCode}
                    />
                    <div>
                      <label
                        htmlFor='country'
                        className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                      >
                        Country
                      </label>
                      <select
                        id='country'
                        name='country'
                        value={formData.country}
                        onChange={handleChange}
                        className='w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors'
                      >
                        <option>United States</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                        <option>Australia</option>
                      </select>
                    </div>
                  </div>
                  <hr className='dark:border-gray-700' />
                  <div>
                    <h3 className='text-lg font-medium text-gray-800 dark:text-gray-200 mb-2'>
                      Payment Method
                    </h3>
                    <div className='bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700'>
                      <div className='flex items-center space-x-3'>
                        <CreditCard className='w-6 h-6 text-indigo-500' />
                        <span className='font-semibold text-gray-700 dark:text-gray-300'>
                          Cash on Delivery
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type='submit'
                    disabled={isLoading}
                    className='w-full flex items-center justify-center bg-indigo-600 text-white font-semibold py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed'
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className='w-6 h-6 animate-spin mr-3' />
                        Processing...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                </form>
              </div>
            </div>

            <div className='lg:col-span-5'>
              <div className='bg-white dark:bg-gray-800/50 rounded-2xl p-6 md:p-8 shadow-lg sticky top-24'>
                <h2 className='text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100'>
                  Order Summary
                </h2>
                <div className='space-y-4 mb-6'>
                  {cartItems.map((item: Product & { quantity: number }) => (
                    <div key={item.id} className='flex items-center gap-4'>
                      <div className='relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700'>
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          layout='fill'
                          objectFit='cover'
                        />
                      </div>
                      <div className='flex-grow'>
                        <h3 className='font-semibold text-gray-800 dark:text-gray-200'>
                          {item.name}
                        </h3>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className='font-semibold text-gray-800 dark:text-gray-200'>
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className='border-t border-gray-200 dark:border-gray-700 pt-6 space-y-3'>
                  <div className='flex justify-between text-gray-600 dark:text-gray-400'>
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between text-gray-600 dark:text-gray-400'>
                    <span>Shipping</span>
                    <span className='font-semibold text-green-600 dark:text-green-400'>
                      Free
                    </span>
                  </div>
                  <div className='border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between text-xl font-bold text-gray-900 dark:text-white'>
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                <div className='mt-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700'>
                  <div className='flex items-center space-x-3'>
                    <Lock className='w-5 h-5 text-gray-500' />
                    <span className='text-sm text-gray-600 dark:text-gray-400'>
                      Your personal information is secure.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CheckoutPage
