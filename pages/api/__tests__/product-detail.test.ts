import { createMocks } from 'node-mocks-http'
import handler from '../products/[productId]'
import { db } from '../../../lib/db'

// Mock the db object
jest.mock('../../../lib/db', () => ({
  db: {
    read: jest.fn(),
    write: jest.fn(),
  },
}))

describe('/api/products/[productId]', () => {
  let mockDbData

  beforeEach(() => {
    jest.clearAllMocks()
    mockDbData = {
      products: [
        { id: '1', name: 'Aura Sphere' },
        { id: '2', name: 'Chrono-Shard' },
      ],
      users: [],
      orders: [],
    }
    ;(db.read as jest.Mock).mockResolvedValue(mockDbData)
  })

  it('GET should return a single product for a valid ID', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { productId: '1' },
    })
    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    const responseData = res._getJSONData()
    expect(responseData.id).toBe('1')
    expect(responseData.name).toBe('Aura Sphere')
  })

  it('GET should return 404 for a non-existent product ID', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { productId: '999' },
    })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(404)
  })

  it('PUT should update an existing product', async () => {
    const updatedData = { name: 'Updated Chrono-Shard', price: 899.99 }
    const { req, res } = createMocks({
      method: 'PUT',
      query: { productId: '2' },
      body: updatedData,
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    const responseData = res._getJSONData()
    expect(responseData.name).toBe(updatedData.name)
    expect(mockDb.data.products[1].name).toBe(updatedData.name)
    expect(mockDb.write).toHaveBeenCalledTimes(1)
  })

  it('DELETE should remove a product', async () => {
    const { req, res } = createMocks({
      method: 'DELETE',
      query: { productId: '1' },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(204)
    expect(mockDb.data.products.length).toBe(1)
    expect(mockDb.data.products[0].id).toBe('2')
    expect(mockDb.write).toHaveBeenCalledTimes(1)
  })

  it('should return 405 for an unsupported method', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      query: { productId: '1' },
    })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(405)
  })
})
