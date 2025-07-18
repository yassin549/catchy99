import { NextApiRequest, NextApiResponse } from 'next'
import cookie from 'cookie'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  // Clear the authentication cookie by setting its expiration date to the past
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      expires: new Date(0),
      path: '/',
      sameSite: 'strict',
    })
  )

  res.status(200).json({ message: 'Logout successful' })
}
