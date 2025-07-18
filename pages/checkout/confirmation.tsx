import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { FiCheckCircle, FiTruck, FiClock, FiMapPin } from 'react-icons/fi'
import CircleLoader from '@/components/CircleLoader'

interface OrderConfirmationProps {
  orderId: string
  orderTotal: number
  shippingAddress: {
    fullName: string
    addressLine1: string
    city: string
    postalCode: string
    country: string
  }
}

const OrderConfirmationDisplay: React.FC<OrderConfirmationProps> = ({
  orderId,
  orderTotal,
  shippingAddress,
}) => {
  return (
    <div className='container mx-auto px-4 py-16'>
      <div className='max-w-4xl mx-auto'>
        <div className='text-center mb-12'>
          <FiCheckCircle className='w-24 h-24 mx-auto text-green-400 mb-4' />
          <h1 className='text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4'>
            Thank You for Your Order!
          </h1>
          <p className='text-gray-400'>
            Your order has been successfully placed and is being processed.
          </p>
        </div>

        <div className='bg-white/5 dark:bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8'>
          <div className='space-y-8'>
            <div className='space-y-4'>
              <h2 className='text-xl font-bold text-white'>Order Summary</h2>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-gray-400'>Order Number</p>
                  <p className='font-medium text-white'>#{orderId}</p>
                </div>
                <div>
                  <p className='text-gray-400'>Order Date</p>
                  <p className='font-medium text-white'>
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <h2 className='text-xl font-bold text-white'>
                Shipping Information
              </h2>
              <div className='flex items-center space-x-2'>
                <FiMapPin className='w-5 h-5 text-blue-400' />
                <div>
                  <p className='font-medium text-white'>
                    {shippingAddress.fullName}
                  </p>
                  <p className='text-gray-400'>
                    {shippingAddress.addressLine1}
                  </p>
                  <p className='text-gray-400'>
                    {shippingAddress.city}, {shippingAddress.postalCode}
                  </p>
                  <p className='text-gray-400'>{shippingAddress.country}</p>
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <h2 className='text-xl font-bold text-white'>Order Status</h2>
              <div className='bg-white/5 dark:bg-gray-800/50 p-4 rounded-lg border border-white/10'>
                <div className='flex items-center space-x-4'>
                  <FiTruck className='w-6 h-6 text-yellow-400' />
                  <div>
                    <p className='text-sm font-medium text-white'>Processing</p>
                    <p className='text-sm text-gray-400'>
                      Your order is being prepared
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <h2 className='text-xl font-bold text-white'>
                Estimated Delivery
              </h2>
              <div className='flex items-center space-x-2'>
                <FiClock className='w-5 h-5 text-blue-400' />
                <div>
                  <p className='font-medium text-white'>3-5 business days</p>
                  <p className='text-sm text-gray-400'>Free shipping</p>
                </div>
              </div>
            </div>

            <div className='border-t border-white/10 pt-4 text-right'>
              <p className='text-xl font-bold text-white'>
                Total: ${orderTotal.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className='text-center mt-12'>
          <Link href='/products'>
            <button className='bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-lg hover:opacity-90 transition-all'>
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

const ConfirmationPage = () => {
  const router = useRouter()
  const [orderData, setOrderData] = useState<OrderConfirmationProps | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (router.isReady) {
      const {
        orderId,
        total,
        fullName,
        addressLine1,
        city,
        postalCode,
        country,
      } = router.query

      if (orderId && total && fullName && addressLine1) {
        setOrderData({
          orderId: orderId as string,
          orderTotal: parseFloat(total as string),
          shippingAddress: {
            fullName: fullName as string,
            addressLine1: addressLine1 as string,
            city: city as string,
            postalCode: postalCode as string,
            country: country as string,
          },
        })
      } else {
        setError('Order details are missing. Please contact support.')
      }
      setIsLoading(false)
    }
  }, [router.isReady, router.query])

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <CircleLoader visible={true} />
      </div>
    )
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-16 text-center'>
        <h1 className='text-2xl text-red-500'>{error}</h1>
        <Link href='/'>
          <button className='mt-4 text-blue-400 hover:underline'>
            Go to Homepage
          </button>
        </Link>
      </div>
    )
  }

  if (!orderData) {
    return null // Or a fallback UI
  }

  return <OrderConfirmationDisplay {...orderData} />
}

export default ConfirmationPage
