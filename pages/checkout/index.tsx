import React, { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { FiCreditCard, FiLock, FiLoader } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/router'
import Link from 'next/link'

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

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required'
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required'
    }

    if (!formData.addressLine1.trim()) {
      errors.addressLine1 = 'Address is required'
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required'
    }

    if (!formData.postalCode.trim()) {
      errors.postalCode = 'Postal code is required'
    }

    return errors
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setFormErrors(prev => ({ ...prev, [name]: '' })) // Clear error when field is modified
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors)
      return
    }

    setIsLoading(true)
    setFormErrors({})

    try {
      // Submit order to API
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            addressLine1: formData.addressLine1,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
          },
          total: cartTotal,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to place order')
      }

      const data = await response.json()
      clearCart()

      // Redirect to confirmation page
      router.push({
        pathname: '/checkout/confirmation',
        query: {
          orderId: data.order.id,
          total: cartTotal,
          fullName: formData.fullName,
          addressLine1: formData.addressLine1,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
      })
    } catch (error) {
      toast.error('Failed to place order. Please try again.')
      console.error('Order submission error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className='container mx-auto px-4 py-16'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold mb-4'>Your cart is empty</h1>
          <p className='text-gray-400'>
            Please add some items to your cart before proceeding to checkout.
          </p>
          <Link href='/products' className='inline-block'>
            <button className='mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all'>
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-16'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Checkout Form */}
        <div className='bg-white/5 dark:bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8'>
          <h2 className='text-2xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400'>
            Shipping Information
          </h2>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Personal Info */}
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-1'>
                  Full Name
                </label>
                <input
                  type='text'
                  name='fullName'
                  value={formData.fullName}
                  onChange={handleChange}
                  className='w-full px-4 py-3 bg-white/5 dark:bg-gray-800/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50'
                  required
                />
                {formErrors.fullName && (
                  <p className='text-sm text-red-400 mt-1'>
                    {formErrors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-300 mb-1'>
                  Email
                </label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  className='w-full px-4 py-3 bg-white/5 dark:bg-gray-800/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50'
                  required
                />
                {formErrors.email && (
                  <p className='text-sm text-red-400 mt-1'>
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-300 mb-1'>
                  Phone
                </label>
                <input
                  type='tel'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  className='w-full px-4 py-3 bg-white/5 dark:bg-gray-800/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50'
                  required
                />
                {formErrors.phone && (
                  <p className='text-sm text-red-400 mt-1'>
                    {formErrors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-300'>
                Shipping Address
              </h3>
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-1'>
                  Address
                </label>
                <input
                  type='text'
                  name='addressLine1'
                  value={formData.addressLine1}
                  onChange={handleChange}
                  className='w-full px-4 py-3 bg-white/5 dark:bg-gray-800/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50'
                  required
                />
                {formErrors.addressLine1 && (
                  <p className='text-sm text-red-400 mt-1'>
                    {formErrors.addressLine1}
                  </p>
                )}
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-1'>
                    City
                  </label>
                  <input
                    type='text'
                    name='city'
                    value={formData.city}
                    onChange={handleChange}
                    className='w-full px-4 py-3 bg-white/5 dark:bg-gray-800/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50'
                  />
                  {formErrors.city && (
                    <p className='text-sm text-red-400 mt-1'>
                      {formErrors.city}
                    </p>
                  )}
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-1'>
                    Postal Code
                  </label>
                  <input
                    type='text'
                    name='postalCode'
                    value={formData.postalCode}
                    onChange={handleChange}
                    className='w-full px-4 py-3 bg-white/5 dark:bg-gray-800/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50'
                  />
                  {formErrors.postalCode && (
                    <p className='text-sm text-red-400 mt-1'>
                      {formErrors.postalCode}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-300 mb-1'>
                  Country
                </label>
                <select
                  name='country'
                  value={formData.country}
                  onChange={handleChange}
                  className='w-full px-4 py-3 bg-white/5 dark:bg-gray-800/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50'
                >
                  <option value='United States'>United States</option>
                  <option value='Canada'>Canada</option>
                  <option value='United Kingdom'>United Kingdom</option>
                  <option value='Australia'>Australia</option>
                </select>
              </div>
            </div>

            {/* Payment Method */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-300'>
                Payment Method
              </h3>
              <div className='bg-white/5 dark:bg-gray-800/50 p-4 rounded-lg border border-white/10'>
                <div className='flex items-center space-x-4'>
                  <FiCreditCard className='w-6 h-6 text-blue-400' />
                  <span className='text-gray-400'>Cash on Delivery</span>
                </div>
              </div>
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-4 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? (
                <>
                  <FiLoader className='w-5 h-5 animate-spin mr-2' />
                  Processing...
                </>
              ) : (
                'Place Order'
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className='bg-white/5 dark:bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8'>
          <h2 className='text-2xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400'>
            Order Summary
          </h2>

          <div className='space-y-6'>
            {/* Cart Items */}
            <div className='space-y-4'>
              {cartItems.map(item => (
                <div
                  key={item.id}
                  className='flex justify-between items-center p-4 bg-white/5 dark:bg-gray-800/50 rounded-lg border border-white/10'
                >
                  <div>
                    <h3 className='text-sm font-medium text-white'>
                      {item.name}
                    </h3>
                    <p className='text-sm text-gray-400'>
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className='text-sm font-medium text-white'>
                    ${item.price * item.quantity}.00
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className='space-y-4'>
              <div className='flex justify-between text-gray-400'>
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className='flex justify-between text-gray-400'>
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className='border-t border-white/10 pt-4 flex justify-between'>
                <span className='text-lg font-medium text-white'>Total</span>
                <span className='text-lg font-medium text-white'>
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Security Info */}
            <div className='bg-white/5 dark:bg-gray-800/50 p-4 rounded-lg border border-white/10'>
              <div className='flex items-center space-x-2'>
                <FiLock className='w-5 h-5 text-blue-400' />
                <span className='text-sm text-gray-400'>
                  Your payment and personal information is secure
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
