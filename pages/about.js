import { NextSeo } from 'next-seo';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { Award, Clock, DollarSign, HeartHandshake, Sparkles, MapPin, Phone, Instagram, Film } from 'lucide-react';

const iconMap = {
  quality: Award,
  support: Clock,
  price: DollarSign,
  service: HeartHandshake,
  selection: Sparkles,
};

const AboutPage = () => {
  const { t } = useTranslation('about');

  return (
    <>
      <NextSeo
        title={t('seo.title')}
        description={t('seo.description')}
      />
      <div className='bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200'>
        <div className='container mx-auto px-4 py-16 md:py-24'>
          {/* Main Title and Subtitle */}
          <div className='text-center mb-16'>
            <h1 className='text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight'>
              {t('title')}
            </h1>
            <p className='mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto'>
              {t('subtitle')}
            </p>
          </div>

          {/* Mission Section */}
          <div className='max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12 mb-16'>
            <h2 className='text-3xl font-bold text-center mb-6 text-indigo-600 dark:text-indigo-400'>
              {t('mission.title')}
            </h2>
            <p className='text-center text-lg text-gray-700 dark:text-gray-300'>
              {t('mission.text')}
            </p>
          </div>

          {/* Why Choose Us Section */}
          <div className='max-w-5xl mx-auto mb-16'>
            <h2 className='text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white'>
              {t('whyChooseUs.title')}
            </h2>
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {t('whyChooseUs.points', { returnObjects: true }).map((point, index) => {
                const Icon = iconMap[point.icon];
                return (
                  <div key={index} className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex items-start space-x-4'>
                    {Icon && <Icon className='w-8 h-8 text-indigo-500 dark:text-indigo-400 mt-1 flex-shrink-0' />}
                    <p className='text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200'>
                      {point.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Section */}
          <div className='max-w-4xl mx-auto bg-gray-100 dark:bg-gray-800/50 rounded-2xl shadow-lg p-8 md:p-12'>
            <h2 className='text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white'>
              {t('contact.title')}
            </h2>
            <div className='space-y-6 text-lg'>
              <div className='flex items-center'>
                <MapPin className='w-6 h-6 mr-4 text-indigo-500' />
                <span>{t('contact.address')}</span>
              </div>
              <div className='flex items-center'>
                <Phone className='w-6 h-6 mr-4 text-indigo-500' />
                <span>{t('contact.phone')}</span>
              </div>
              <div className='flex items-center'>
                <Instagram className='w-6 h-6 mr-4 text-indigo-500' />
                <span>{t('contact.instagram')}</span>
              </div>
              <div className='flex items-center'>
                <Film className='w-6 h-6 mr-4 text-indigo-500' />
                <span>{t('contact.tiktok')}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'about', 'footer'])),
  },
});

export default AboutPage;
