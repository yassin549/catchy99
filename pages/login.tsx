import { useState, useEffect, FormEvent } from 'react'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useAuth } from '@/context/AuthContext'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Lock, LogIn, Loader2, AlertCircle } from 'lucide-react'

const LoginPage = () => {
  const { t } = useTranslation(['login', 'common'])
  const router = useRouter()
  const { login, user } = useAuth()
  const [email, setEmail] = useState('admin@tunisstore.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      router.push('/admin')
    }
  }, [user, router])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await login(email, password)
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Login failed. Please check your credentials.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <NextSeo title={t('seo.title')} />
      <div className='min-h-screen w-full lg:grid lg:grid-cols-2'>
        <div className='flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
          <div className='w-full max-w-md space-y-8'>
            <div>
              <Link href='/' legacyBehavior>
                <a className='flex justify-center'>
                  <Image
                    src='/images/brand/logo.jpg'
                    alt='Tunis Store Logo'
                    width={80}
                    height={80}
                  />
                </a>
              </Link>
              <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white'>
                {t('title')}
              </h2>
              <p className='mt-2 text-center text-sm text-gray-600 dark:text-gray-400'>
                {t('or')}{' '}
                <Link href='/products' legacyBehavior>
                  <a className='font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300'>
                    {t('startShopping')}
                  </a>
                </Link>
              </p>
            </div>

            <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
              <div className='rounded-md shadow-sm -space-y-px'>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                  <input
                    id='email'
                    type='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className='w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white'
                    placeholder={t('emailPlaceholder')}
                  />
                </div>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                  <input
                    id='password'
                    type='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className='w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white'
                    placeholder={t('passwordPlaceholder')}
                  />
                </div>
              </div>

              {error && (
                <div className='flex items-center text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-md'>
                  <AlertCircle className='w-5 h-5 mr-2' />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <button
                  type='submit'
                  disabled={isLoading}
                  className='group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 dark:focus:ring-offset-gray-800'
                >
                  {isLoading ? (
                    <Loader2 className='w-5 h-5 animate-spin' />
                  ) : (
                    <>
                      <span className='absolute left-0 inset-y-0 flex items-center pl-3'>
                        <LogIn
                          className='h-5 w-5 text-indigo-500 group-hover:text-indigo-400'
                          aria-hidden='true'
                        />
                      </span>
                      {t('signInButton')}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className='hidden lg:block relative'>
          <Image
            src='/images/brand/1.jpg'
            alt='Stylish fashion model'
            fill
            style={{ objectFit: 'cover' }}
            className='z-0'
          />
          <div className='absolute inset-0 bg-black/30 z-10'></div>
        </div>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'en', ['common', 'login'])),
  },
});

export default LoginPage
