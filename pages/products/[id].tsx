import { useState } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { NextSeo } from 'next-seo'
import { Product } from '@/types'
import { useCart } from '@/context/CartContext'
import { getProducts, getProductById } from '@/lib/data'
import ProductCard from '@/components/ProductCard'
import { toast } from 'react-hot-toast'
import {
  ShoppingCart,
  Plus,
  Minus,
  Tag,
  Layers,
  CheckCircle,
  ShieldCheck,
  Truck,
} from 'lucide-react'

interface ProductDetailPageProps {
  product: Product
  relatedProducts: Product[]
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  relatedProducts,
}) => {
  const router = useRouter()
  const { addToCart } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
    toast.success(`${quantity} x ${product.name} added to cart!`, {
      icon: <CheckCircle className='text-green-500' />,
    })
  }

  return (
    <>
      <NextSeo
        title={`${product.name} - Catchy`}
        description={product.description}
        openGraph={{
          title: product.name,
          description: product.description,
          images: [{ url: product.images[0], alt: product.name }],
        }}
      />
      <div className='bg-white dark:bg-gray-900'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-16'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-start'>
            {/* Image Gallery */}
            <div className='space-y-4'>
              <div className='bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg'>
                <Image
                  src={product.images[selectedImage]}
                  alt={`${product.name} - view ${selectedImage + 1}`}
                  width={800}
                  height={800}
                  className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'
                />
              </div>
              <div className='grid grid-cols-5 gap-2'>
                {product.images.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-indigo-500' : 'border-transparent'}`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      width={150}
                      height={150}
                      className='object-cover'
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className='space-y-6'>
              <h1 className='text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white'>
                {product.name}
              </h1>
              <p className='text-3xl text-gray-900 dark:text-white'>
                ${product.price.toFixed(2)}
              </p>

              <div className='space-y-2'>
                <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-200'>
                  Description
                </h2>
                <p className='text-gray-600 dark:text-gray-400 text-base leading-relaxed'>
                  {product.description}
                </p>
              </div>

              <div className='flex items-center space-x-6'>
                <div className='flex items-center'>
                  <Layers className='w-5 h-5 mr-2 text-indigo-500' />
                  <span className='text-gray-700 dark:text-gray-300'>
                    Category:{' '}
                    <span className='font-medium text-gray-900 dark:text-white'>
                      {product.category}
                    </span>
                  </span>
                </div>
                {product.size && (
                  <div className='flex items-center'>
                    <Tag className='w-5 h-5 mr-2 text-indigo-500' />
                    <span className='text-gray-700 dark:text-gray-300'>
                      Size:{' '}
                      <span className='font-medium text-gray-900 dark:text-white'>
                        {product.size}
                      </span>
                    </span>
                  </div>
                )}
              </div>

              {/* Add to Cart */}
              <div className='flex items-center space-x-4 pt-4'>
                <div className='flex items-center border border-gray-300 dark:border-gray-600 rounded-lg'>
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className='p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg'
                  >
                    <Minus size={16} />
                  </button>
                  <span className='px-4 py-2 font-semibold text-lg'>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className='p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg'
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className='flex-1 flex items-center justify-center px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg'
                >
                  <ShoppingCart className='w-5 h-5 mr-2' />
                  Add to Cart
                </button>
              </div>

              <div className='space-y-4 pt-6 text-sm text-gray-600 dark:text-gray-400'>
                <div className='flex items-center'>
                  <ShieldCheck size={20} className='mr-3 text-green-500' />
                  <span>Secure Checkout & 30-Day Returns</span>
                </div>
                <div className='flex items-center'>
                  <Truck size={20} className='mr-3 text-blue-500' />
                  <span>Free Shipping on Orders Over $50</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className='mt-24'>
              <h2 className='text-3xl font-bold text-center mb-12'>
                You Might Also Like
              </h2>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
                {relatedProducts.map((p: Product) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const id = params?.id as string;
    if (!id) {
      return { notFound: true };
    }
    const product = await getProductById(id);

    if (!product) {
      return { notFound: true };
    }

    const allProducts = await getProducts();
    const relatedProducts = allProducts
      .filter(
        (p: Product) => p.category === product.category && p.id !== product.id
      )
      .slice(0, 4);

    return {
      props: { product, relatedProducts },
    };
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return { notFound: true };
  }
};

export default ProductDetailPage
