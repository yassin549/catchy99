import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react'
import { useRouter } from 'next/router'
import { DecodedToken } from '@/types'

interface AuthContextType {
  user: DecodedToken | null
  loading: boolean
  initialized: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<DecodedToken | null>(null)
  const [loading, setLoading] = useState(false) // For login/logout actions
  const [initialized, setInitialized] = useState(false) // For initial session check
  const router = useRouter()

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const { user: fetchedUser } = await response.json()
          setUser(fetchedUser)
        }
      } catch (error) {
        console.log('No active user session.')
      } finally {
        setInitialized(true)
      }
    }
    checkUserSession()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Login failed')
      }

      const meResponse = await fetch('/api/auth/me')
      const { user: loggedInUser } = await meResponse.json()
      setUser(loggedInUser)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, initialized, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
