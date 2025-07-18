import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

// Extend NextApiRequest to include the user property
interface NextApiRequestWithUser extends NextApiRequest {
  user: DecodedToken
}
import jwt from 'jsonwebtoken'
import { DecodedToken } from '@/types'

export const withAdminAuthApi = (handler: NextApiHandler) => {
  return async (req: NextApiRequestWithUser, res: NextApiResponse) => {
    const token = req.cookies.auth_token

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken
      if (!decoded.roles || !decoded.roles.includes('admin')) {
        return res
          .status(403)
          .json({ message: 'Forbidden: Admin access required' })
      }

      // Attach user to the request object for use in the handler
      req.user = decoded

      return handler(req, res)
    } catch (error) {
      console.error('API Auth Error:', error)
      return res.status(401).json({ message: 'Invalid or expired token' })
    }
  }
}
