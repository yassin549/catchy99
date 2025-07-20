import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import { useEffect } from 'react'
import { useCart } from '@/context/CartContext'

const OrderConfirmationPage = () => {
  const { t } = useTranslation('order-confirmation')
  const router = useRouter()
  const { orderId } = router.query
  const { clearCart } = useCart()

  // This is a mock fetcher. In a real app, you'd fetch the specific order.
  // Since our POST endpoint doesn't let us retrieve a single order by ID,
  // we'll just simulate fetching it for display purposes.
  // A robust implementation would have a GET /api/orders/[id] endpoint.

  useEffect(() => {
    // Clear the cart only when the confirmation page for a specific order is loaded
    if (orderId) {
      clearCart()
    }
  }, [orderId, clearCart])

  if (!orderId) {
    return (
      <div className='container mx-auto text-center py-20'>
        {t('loading')}
      </div>
    )
  }

  return (
    <div className='container mx-auto p-8 bg-glass-light backdrop-blur-lg rounded-lg shadow-xl text-center'>
      <h1 className='text-3xl font-bold mb-4 text-green-400 text-shadow-neon-green'>
        {t('title')}
      </h1>
      <p className='text-lg mb-8'>{t('subtitle')}</p>
      <p className='mb-4'>
        {t('orderIdLabel')}{' '}
        <span className='font-mono bg-white/20 p-1 rounded'>{orderId}</span>
      </p>
      <p className='mb-8'>{t('emailConfirmation')}</p>
      <button
        onClick={() => router.push('/products')}
        className='bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors'
      >
        {t('continueShopping')}
      </button>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'en', ['common', 'order-confirmation'])),
  },
});

export default OrderConfirmationPage
