import { createMocks } from 'node-mocks-http'
import handler from '@/pages/api/auth/login'
import bcrypt from 'bcryptjs'

// Mock the bcryptjs library
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}))

// Mock the cookie library
jest.mock('cookie', () => ({
  serialize: jest.fn(() => 'auth_token=mock_token; HttpOnly; SameSite=Strict'),
}))

interface MockDb {
  data: {
    users: {
      id: string
      email: string
      passwordHash: string
      roles: string[]
    }[]
    products: unknown[]
    orders: unknown[]
  }
  write: jest.Mock
}

describe('/api/auth/login', () => {
  let mockDb: MockDb

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret'
  })

  beforeEach(() => {
    jest.clearAllMocks()

    // Define a fresh mockDb for each test to ensure isolation
    mockDb = {
      data: {
        users: [
          {
            id: 'user-1',
            email: 'admin@liquid-glass.com',
            passwordHash:
              '$2a$10$eACCc55nCenx2AxVP2g29uJc2x1tJgFbU3wzau7u2S.I4A7a4Ua6.', // Hash for 'adminpassword'
            roles: ['admin', 'user'],
          },
        ],
        products: [],
        orders: [],
      },
      write: jest.fn(),
    }
  })

  it('should log in a valid admin user and set a cookie', async () => {
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        email: 'admin@liquid-glass.com',
        password: 'adminpassword',
      },
    })

    await handler(req, res, mockDb)

    expect(res._getStatusCode()).toBe(200)
    expect(res._getJSONData()).toEqual({ message: 'Login successful!' })

    const cookie = res._getHeaders()['set-cookie']
    expect(cookie).toBeDefined()
    expect(cookie).toContain('auth_token=')
    expect(cookie).toContain('HttpOnly')
    expect(cookie).toContain('SameSite=Strict')
  })

  it('should fail with an incorrect password', async () => {
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        email: 'admin@liquid-glass.com',
        password: 'wrongpassword',
      },
    })

    await handler(req, res, mockDb)

    expect(res._getStatusCode()).toBe(401)
    expect(res._getJSONData()).toEqual({ message: 'Invalid credentials.' })
  })

  it('should fail with a non-existent user', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        email: 'nouser@example.com',
        password: 'anypassword',
      },
    })

    await handler(req, res, mockDb)

    expect(res._getStatusCode()).toBe(401)
    expect(res._getJSONData()).toEqual({ message: 'Invalid credentials.' })
  })

  it('should fail if method is not POST', async () => {
    const { req, res } = createMocks({ method: 'GET' })
    await handler(req, res, mockDb)
    expect(res._getStatusCode()).toBe(405)
  })
})
