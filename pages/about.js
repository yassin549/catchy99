import { Zap, PaintBucket, Users } from 'lucide-react';
import Head from 'next/head';
import Link from 'next/link';

const AboutPage = () => {
  return (
    <>
      <Head>
        <title>About Us | Catchy</title>
        <meta name="description" content="Pioneers in the liquid-glass industry, blending art and technology to create stunning, unique products." />
      </Head>
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-center">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="relative container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
              Fusing Artistry with Innovation
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto">
              We are pioneers in the liquid-glass industry, transforming a unique medium into breathtaking works of art through cutting-edge technology.
            </p>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">Our Mission</h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-400">
              To push the boundaries of what's possible with liquid-glass, creating beautiful, durable, and one-of-a-kind pieces that inspire awe and bring a touch of magic into everyday life.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white dark:bg-gray-800 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-12 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-indigo-100 dark:bg-indigo-900/50 p-4 rounded-full mb-4">
                  <PaintBucket size={32} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Artistic Vision</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Every piece is a testament to our commitment to creativity and aesthetic excellence, designed by artists who are masters of their craft.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-purple-100 dark:bg-purple-900/50 p-4 rounded-full mb-4">
                  <Zap size={32} className="text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Technological Precision</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We leverage state-of-the-art technology to ensure unparalleled quality, durability, and a flawless finish in every creation.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-pink-100 dark:bg-pink-900/50 p-4 rounded-full mb-4">
                  <Users size={32} className="text-pink-600 dark:text-pink-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Our Team</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  A passionate group of designers, engineers, and artisans dedicated to bringing our shared vision of liquid-glass art to life.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to be amazed?</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400 mb-8">
              Explore our collection of unique liquid-glass creations and find the perfect piece to elevate your space.
            </p>
            <Link href="/products" legacyBehavior>
              <a className="inline-block bg-indigo-600 text-white py-4 px-8 rounded-lg text-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 transition-all duration-300 transform hover:scale-105">
                Browse Products
              </a>
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}

export default AboutPage;
