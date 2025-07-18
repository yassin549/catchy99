import { GetServerSidePropsContext } from 'next'
import { createMocks } from 'node-mocks-http'
import { withAdminAuth } from '@/lib/withAdminAuth'
import jwt from 'jsonwebtoken'

// A mock GetServerSideProps function to pass to the HOF
const mockGssp = jest.fn(async () => {
  return { props: { originalProp: 'hello' } }
})

describe('withAdminAuth High-Order Function', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV, JWT_SECRET: 'test-secret-for-auth' }
    mockGssp.mockClear()
  })

  afterAll(() => {
    process.env = OLD_ENV // Restore old environment
  })

  it('should redirect to /login if no auth token is provided', async () => {
    const { req, res } = createMocks({ method: 'GET' })
    const context = { req, res } as GetServerSidePropsContext

    const result = await withAdminAuth(mockGssp)(context)

    expect(result).toEqual({
      redirect: {
        destination: '/login',
        permanent: false,
      },
    })
  })

  it('should redirect to /login if the token is invalid or expired', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      cookies: {
        auth_token: 'invalid-token',
      },
    })
    const context = { req, res } as GetServerSidePropsContext

    const result = await withAdminAuth(mockGssp)(context)

    expect(result).toEqual({
      redirect: {
        destination: '/login',
        permanent: false,
      },
    })
  })

  it('should redirect to /login if user does not have admin role', async () => {
    const token = jwt.sign(
      { userId: 'user-2', roles: ['user'] },
      process.env.JWT_SECRET!
    )
    const { req, res } = createMocks({
      method: 'GET',
      cookies: { auth_token: token },
    })
    const context = { req, res } as GetServerSidePropsContext

    const result = await withAdminAuth(mockGssp)(context)

    expect(result).toEqual({
      redirect: {
        destination: '/login',
        permanent: false,
      },
    })
  })

  it('should run GSSP and pass user props for an authenticated admin', async () => {
    const adminPayload = { userId: 'user-1', roles: ['admin', 'user'] }
    const token = jwt.sign(adminPayload, process.env.JWT_SECRET!)
    const { req, res } = createMocks({
      method: 'GET',
      cookies: { auth_token: token },
    })
    const context = { req, res } as GetServerSidePropsContext

    const result = await withAdminAuth(mockGssp)(context)

    // Check that the original GSSP was called
    expect(mockGssp).toHaveBeenCalledTimes(1)

    // Check that the final result contains the original props and the injected user prop
    expect(result).toEqual({
      props: {
        originalProp: 'hello',
        user: expect.objectContaining(adminPayload),
      },
    })
  })
})
