import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextSeo } from 'next-seo'
import Image from 'next/image';
import { useRef } from 'react';
import Link from 'next/link'
import { ArrowRight, Award, Clock, DollarSign, HeartHandshake, Mail } from 'lucide-react'
import ProductCard from '@/components/ProductCard';
import ScrollAnimator from '@/components/ScrollAnimator';
import { getProducts, getCategories } from '@/lib/data';
import { useScrollEffect } from '@/hooks/useScrollEffect';

const Home = ({ featuredProducts, categoriesWithProducts }) => {
  const { t } = useTranslation('home');
  const heroImageRef = useRef(null);
  const features = [
    {
      icon: <Award size={28} />,
      title: t('features.quality.title'),
      description: t('features.quality.description'),
    },
    {
      icon: <Clock size={28} />,
      title: t('features.support.title'),
      description: t('features.support.description'),
    },
    {
      icon: <DollarSign size={28} />,
      title: t('features.pricing.title'),
      description: t('features.pricing.description'),
    },
    {
      icon: <HeartHandshake size={28} />,
      title: t('features.service.title'),
      description: t('features.service.description'),
    },
  ]

  // Apply scroll-based zoom effect to the hero image.
  useScrollEffect(heroImageRef, 500, 1.1, 1);

  return (
    <>
      <NextSeo
        title={t('seo.title')}
        description={t('seo.description')}
      />

      <div className='bg-white dark:bg-gray-900 text-gray-800 dark:text-white'>
        {/* Hero Section */}
        <section data-section className='relative h-[80vh] md:h-screen min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden'>
          <div ref={heroImageRef} className='absolute inset-0 z-0'>
            <Image
              src='/images/brand/3.jpg'
              alt='A stylish person in a vibrant city setting'
              fill
              sizes='100vw'
              style={{ objectFit: 'cover' }}
              priority

            />
            <div className='absolute inset-0 dark:bg-gradient-to-t dark:from-black/70 dark:via-black/30 dark:to-transparent'></div>
          </div>
          <div className='relative z-10 container mx-auto px-4 flex justify-center items-center'>
            <div className='bg-black/10 backdrop-blur-lg p-8 md:p-12 text-center text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)] mask-fade-edges'>
              <ScrollAnimator animation='fade-in-up'>
                <h1 className='text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-4'>
                  {t('hero.title')}
                </h1>
              </ScrollAnimator>
              <ScrollAnimator animation='fade-in-up' className='transition-delay-200'>
                <p className='max-w-2xl mx-auto text-base sm:text-lg md:text-xl mb-8 font-light'>
                  {t('hero.subtitle')}
                </p>
              </ScrollAnimator>
              <ScrollAnimator animation='fade-in-up' className='transition-delay-400'>
                <Link href='/products' legacyBehavior>
                  <a className='inline-flex items-center justify-center px-8 py-4 bg-indigo-600 border border-transparent rounded-lg font-semibold text-white hover:bg-indigo-700 transition-transform transform hover:scale-105 shadow-lg hover:shadow-xl'>
                    {t('hero.button')} <ArrowRight className='ml-2 h-5 w-5' />
                  </a>
                </Link>
              </ScrollAnimator>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section data-section className='py-16 md:py-20 bg-gray-50 dark:bg-gray-800'>
          <div className='container mx-auto px-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 text-center'>
              {features.map((feature, index) => (
                <ScrollAnimator key={feature.title} animation='zoom-in' className={`transition-delay-${index * 100}`}>
                  <div className='flex flex-col items-center'>
                    <div className='flex items-center justify-center h-16 w-16 mb-5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 rounded-full'>
                      {feature.icon}
                    </div>
                    <h3 className='text-xl font-bold mb-2'>{feature.title}</h3>
                    <p className='text-gray-600 dark:text-gray-400 max-w-xs'>
                      {feature.description}
                    </p>
                  </div>
                </ScrollAnimator>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section data-section className='py-16 md:py-24'>
          <div className='container mx-auto px-4'>
            <ScrollAnimator animation='fade-in-up'>
              <h2 className='text-3xl md:text-4xl font-bold text-center mb-4'>
                {t('trending.title')}
              </h2>
              <p className='text-center text-gray-600 dark:text-gray-400 mb-8 md:mb-12'>
                {t('trending.subtitle')}
              </p>
            </ScrollAnimator>
            <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8'>
              {featuredProducts.map((product, index) => (
                <ScrollAnimator key={product.id} animation='zoom-in' className={`transition-delay-${index * 100}`}>
                  <ProductCard product={product} />
                </ScrollAnimator>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section data-section className='py-24 bg-gray-50 dark:bg-gray-800'>
          <div className='container mx-auto px-4'>
            <h2 className='text-4xl font-bold text-center mb-12'>
              {t('categories.title')}
            </h2>
            <div className='space-y-16'>
              {categoriesWithProducts.map(category => (
                <div key={category.id}>
                  <div className='flex justify-between items-center mb-6'>
                    <h3 className='text-3xl font-bold'>{category.name}</h3>
                    <Link href={`/products?category=${category.name.toLowerCase()}`} legacyBehavior>
                      <a className='text-indigo-600 dark:text-indigo-400 hover:underline'>
                        {t('categories.viewAll')}
                      </a>
                    </Link>
                  </div>
                  <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8'>
                    {category.products.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section data-section className='py-24 bg-indigo-700 text-white'>
          <div className='container mx-auto px-4 text-center'>
            <h2 className='text-4xl font-bold mb-4'>{t('newsletter.title')}</h2>
            <p className='max-w-2xl mx-auto mb-8'>
              {t('newsletter.subtitle')}
            </p>
            <form className='max-w-lg mx-auto'>
              <div className='flex flex-col sm:flex-row items-center bg-white/20 rounded-lg p-2 gap-2'>
                <Mail className='h-6 w-6 mx-3 text-white/70' />
                <input
                  type='email'
                  placeholder={t('newsletter.placeholder')}
                  className='w-full bg-transparent text-white placeholder-white/70 focus:outline-none py-2'
                />
                <button
                  type='submit'
                  className='w-full sm:w-auto px-6 py-2.5 bg-white text-indigo-700 font-semibold rounded-md hover:bg-gray-200 transition-colors'
                >
                  {t('newsletter.button')}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </>
  )
}

export const getServerSideProps = async ({ locale }) => {
  try {
    const allProducts = await getProducts();
    const allCategories = await getCategories();

    const categoriesWithProducts = allCategories
      .map(category => ({
        ...category,
        products: allProducts
          .filter(p => p.category === category.name)
          .slice(0, 4),
      }))
      .filter(category => category.products.length > 0);

    return {
      props: {
        ...(await serverSideTranslations(locale, ['common', 'home', 'footer'])),
        featuredProducts: allProducts.slice(0, 4),
        categoriesWithProducts: categoriesWithProducts.slice(0, 3),
      },
      
    };
  } catch (error) {
    console.error('Failed to fetch data for homepage:', error);
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common', 'home', 'footer'])),
        featuredProducts: [],
        categoriesWithProducts: [],
      },
    };
  }
};

export default Home
