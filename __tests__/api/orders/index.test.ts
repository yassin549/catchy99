import { createMocks } from 'node-mocks-http'
import handler from '@/pages/api/orders'
import { getDb } from '@/lib/db'

// Mock the getDb function specifically
jest.mock('@/lib/db', () => ({
  getDb: jest.fn(),
}))

describe('/api/orders', () => {
  // Create mock db object for testing
  const mockDb = {
    data: {
      orders: [],
      products: [],
      users: [],
    },
    write: jest.fn(),
  }

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()
    // Setup the mock implementation for getDb
    ;(getDb as jest.Mock).mockResolvedValue(mockDb)
  })

  it('should create an order successfully with valid data', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        items: [
          {
            id: 'prod_1',
            name: 'Test Product',
            price: 100,
            quantity: 1,
            images: ['/test.jpg'],
          },
        ],
        total: 100,
        shippingAddress: {
          fullName: 'Test User',
          address: '123 Test St',
          city: 'Testville',
          postalCode: '12345',
          country: 'Testland',
        },
        paymentMethod: 'Credit Card',
      },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(201)
    const responseData = res._getJSONData()
    expect(responseData.message).toBe('Order created successfully!')
    expect(responseData.order.total).toBe(100)
    expect(mockDb.data.orders.length).toBe(1)
    expect(mockDb.write).toHaveBeenCalledTimes(1)
  })

  it('should return 400 if required fields are missing', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        // Missing 'total' and other fields
        items: [
          {
            id: 'prod_1',
            name: 'Test Product',
            price: 100,
            quantity: 1,
            images: ['/test.jpg'],
          },
        ],
      },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(400)
    expect(res._getJSONData()).toEqual({
      message: 'Missing required order information.',
    })
    expect(mockDb.write).not.toHaveBeenCalled()
  })

  it('should return 405 for non-POST requests', async () => {
    const { req, res } = createMocks({ method: 'GET' })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(405)
  })
})
