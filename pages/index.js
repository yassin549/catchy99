import { NextSeo } from 'next-seo'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ShoppingCart, Zap, ShieldCheck, Mail } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { getProducts, getCategories } from '@/lib/data'

const Home = ({ products, categories }) => {
  const features = [
    {
      icon: <ShoppingCart size={28} />,
      title: 'Curated Collection',
      description: 'Handpicked styles for the modern trendsetter.',
    },
    {
      icon: <Zap size={28} />,
      title: 'Fast Shipping',
      description: 'Get your new look delivered to your door in no time.',
    },
    {
      icon: <ShieldCheck size={28} />,
      title: 'Secure Checkout',
      description: 'Shop with confidence using our secure payment gateway.',
    },
  ]

  return (
    <>
      <NextSeo
        title='Catchy - Style That Defines You'
        description='Discover our collection of authentic and curated fashion items.'
      />

      <div className='bg-white dark:bg-gray-900 text-gray-800 dark:text-white'>
        {/* Hero Section */}
        <section className='relative h-screen min-h-[700px] flex items-center'>
          <div className='absolute inset-0 z-0'>
            <Image
              src='/images/brand/3.jpg'
              alt='A stylish person in a vibrant city setting'
              fill
              sizes='100vw'
              style={{ objectFit: 'cover' }}
              className='opacity-80'
              priority
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent'></div>
          </div>
          <div className='relative z-10 container mx-auto px-4 text-center text-white'>
            <h1 className='text-5xl md:text-7xl font-extrabold tracking-tight mb-4 animate-fade-in-down'>
              Style That Defines You
            </h1>
            <p className='max-w-2xl mx-auto text-lg md:text-xl mb-8 font-light animate-fade-in-up'>
              Discover our collection of authentic and curated fashion items
              that speak to your unique personality.
            </p>
            <Link href='/products' legacyBehavior>
              <a className='inline-flex items-center justify-center px-8 py-4 bg-indigo-600 border border-transparent rounded-lg font-semibold text-white hover:bg-indigo-700 transition-transform transform hover:scale-105 shadow-lg hover:shadow-xl animate-fade-in-up animation-delay-300'>
                Explore Collection <ArrowRight className='ml-2 h-5 w-5' />
              </a>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className='py-20 bg-gray-50 dark:bg-gray-800'>
          <div className='container mx-auto px-4'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-12 text-center'>
              {features.map(feature => (
                <div key={feature.title} className='flex flex-col items-center'>
                  <div className='flex items-center justify-center h-16 w-16 mb-5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 rounded-full'>
                    {feature.icon}
                  </div>
                  <h3 className='text-xl font-bold mb-2'>{feature.title}</h3>
                  <p className='text-gray-600 dark:text-gray-400 max-w-xs'>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className='py-24'>
          <div className='container mx-auto px-4'>
            <h2 className='text-4xl font-bold text-center mb-4'>
              Trending Now
            </h2>
            <p className='text-center text-gray-600 dark:text-gray-400 mb-12'>
              Check out our most popular products.
            </p>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
              {products.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className='py-24 bg-gray-50 dark:bg-gray-800'>
          <div className='container mx-auto px-4'>
            <h2 className='text-4xl font-bold text-center mb-12'>
              Shop by Category
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
              {categories.map(category => (
                <Link
                  href={`/products?category=${category.name.toLowerCase()}`}
                  key={category.id}
                  legacyBehavior
                >
                  <a className='group relative block h-80 rounded-2xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:-translate-y-2'>
                    <Image
                      src={`/images/categories/${category.name.toLowerCase()}.jpg`}
                      alt={category.name}
                      fill
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      style={{
                        objectFit: 'cover',
                        transition: 'transform 0.5s',
                      }}
                      className='group-hover:scale-110'
                    />
                    <div className='absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4'>
                      <h3 className='text-3xl font-bold text-white text-center'>
                        {category.name}
                      </h3>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className='py-24 bg-indigo-700 text-white'>
          <div className='container mx-auto px-4 text-center'>
            <h2 className='text-4xl font-bold mb-4'>Stay in the Loop</h2>
            <p className='max-w-2xl mx-auto mb-8'>
              Subscribe to our newsletter for the latest styles, new arrivals,
              and exclusive offers.
            </p>
            <form className='max-w-lg mx-auto'>
              <div className='flex items-center bg-white/20 rounded-lg p-2'>
                <Mail className='h-6 w-6 mx-3 text-white/70' />
                <input
                  type='email'
                  placeholder='Enter your email'
                  className='w-full bg-transparent text-white placeholder-white/70 focus:outline-none py-2'
                />
                <button
                  type='submit'
                  className='px-6 py-2.5 bg-white text-indigo-700 font-semibold rounded-md hover:bg-gray-200 transition-colors'
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </>
  )
}

export async function getStaticProps() {
  try {
    const [products, categories] = await Promise.all([
      getProducts(),
      getCategories(),
    ])
    return {
      props: {
        products: products.slice(0, 8),
        categories: categories.slice(0, 3),
      },
      revalidate: 60, // Re-generate the page every 60 seconds
    }
  } catch (error) {
    console.error('Failed to fetch data for homepage:', error)
    return {
      props: { products: [], categories: [] },
    }
  }
}

export default Home
