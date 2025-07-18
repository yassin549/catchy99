import { createMocks } from 'node-mocks-http'
import handler from '@/pages/api/auth/logout'

jest.mock('cookie', () => ({
  serialize: jest.fn(
    () => 'auth_token=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
  ),
}))

describe('/api/auth/logout', () => {
  it('should clear the auth_token cookie', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      cookies: {
        auth_token: 'some-valid-token',
      },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    const cookie = res._getHeaders()['set-cookie']
    expect(cookie).toBeDefined()
    // Check that the cookie is being cleared by setting its expiry to a past date
    expect(cookie).toContain('auth_token=;')
    expect(cookie).toContain('Expires=Thu, 01 Jan 1970 00:00:00 GMT')
  })

  it('should fail if method is not POST', async () => {
    const { req, res } = createMocks({ method: 'GET' })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(405)
  })
})
