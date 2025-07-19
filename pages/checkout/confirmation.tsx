import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { CheckCircle, Truck, Clock, MapPin, Loader2, AlertTriangle } from 'lucide-react';

interface OrderConfirmationProps {
  orderId: string;
  orderTotal: number;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

const OrderConfirmationDisplay: React.FC<OrderConfirmationProps> = ({ orderId, orderTotal, shippingAddress }) => {
  return (
    <>
      <Head>
        <title>Order Confirmation | Catchy</title>
      </Head>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="text-center mb-10">
            <CheckCircle className="w-20 h-20 mx-auto text-green-500 mb-5" />
            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white tracking-tight">
              Thank You!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
              Your order has been placed successfully.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-100 dark:bg-gray-700/50 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Order Summary</h2>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-400">Order Number:</span>
                <span className="font-bold text-gray-800 dark:text-white">#{orderId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Order Total:</span>
                <span className="font-bold text-xl text-indigo-600 dark:text-indigo-400">${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-indigo-500" /> Shipping Address
              </h3>
              <div className="text-gray-600 dark:text-gray-400 pl-8">
                <p className="font-medium text-gray-700 dark:text-gray-300">{shippingAddress.fullName}</p>
                <p>{shippingAddress.addressLine1}</p>
                <p>{shippingAddress.city}, {shippingAddress.postalCode}</p>
                <p>{shippingAddress.country}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <div className="flex items-center bg-blue-100 dark:bg-blue-900/50 p-4 rounded-lg">
                    <Truck className="w-6 h-6 text-blue-500 mr-4" />
                    <div>
                        <p className="font-semibold text-blue-800 dark:text-blue-200">Estimated Delivery</p>
                        <p className="text-blue-700 dark:text-blue-300">3-5 business days</p>
                    </div>
                </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/products" legacyBehavior>
              <a className="inline-block bg-indigo-600 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 transition-all duration-300">
                Continue Shopping
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

const ConfirmationPage = () => {
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderConfirmationProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (router.isReady) {
      const { orderId, total, fullName, addressLine1, city, postalCode, country } = router.query;

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
        });
      } else {
        setError('Order details are missing. Please contact support if this issue persists.');
      }
      setIsLoading(false);
    }
  }, [router.isReady, router.query]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading your confirmation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">An Error Occurred</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-md">{error}</p>
        <Link href="/" legacyBehavior>
          <a className="mt-6 bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors">
            Go to Homepage
          </a>
        </Link>
      </div>
    );
  }

  if (!orderData) {
    return null; // Should be handled by loading/error states
  }

  return <OrderConfirmationDisplay {...orderData} />;
};

export default ConfirmationPage;
