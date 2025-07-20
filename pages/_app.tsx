import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { useRouter } from 'next/router'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '../context/ThemeContext'
import { CartProvider } from '../context/CartContext'
import { AuthProvider } from '../context/AuthContext'
import { ParallaxProvider } from 'react-scroll-parallax'
import { MainLayout } from '../layouts'
import { CircleLoader } from '../components'
import '../styles/globals.css'
import { appWithTranslation } from 'next-i18next'

function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      import('@axe-core/react').then(axe => {
        axe.default(React, ReactDOM, 1000)
      })
    }
  }, [])

  useEffect(() => {
    const handleStart = (url: string) =>
      url !== router.asPath && setLoading(true)
    const handleComplete = () => setLoading(false)

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router.asPath, router.events])

  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <ParallaxProvider>
            {loading && <CircleLoader visible={loading} />}
            <MainLayout>
              <Component {...pageProps} />
            </MainLayout>
          </ParallaxProvider>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default appWithTranslation(App)
