import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/context/AuthContext'

const LoginPage = () => {
  const router = useRouter()
  const { login, user } = useAuth()
  const [email, setEmail] = useState('admin@liquid-glass.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Redirect if user is already logged in
    if (user) {
      router.push('/admin')
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await login(email, password)
      // The useEffect above will handle the redirect
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='container mx-auto flex items-center justify-center min-h-screen'>
      <div className='w-full max-w-md p-8 space-y-6 bg-glass-light rounded-lg shadow-xl'>
        <h1 className='text-2xl font-bold text-center text-white'>
          Admin Login
        </h1>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-300'
            >
              Email
            </label>
            <input
              id='email'
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className='w-full px-3 py-2 mt-1 text-white bg-white/20 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400'
            />
          </div>
          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-300'
            >
              Password
            </label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className='w-full px-3 py-2 mt-1 text-white bg-white/20 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400'
            />
          </div>
          {error && <p className='text-sm text-center text-red-400'>{error}</p>}
          <button
            type='submit'
            disabled={isLoading}
            className='w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-500 transition-colors'
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
