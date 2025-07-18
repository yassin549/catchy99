import { User } from '@/types'

// NOTE: In a real application, this data would come from a database.
// The password hash is for the password "adminpassword"
export const users: User[] = [
  {
    id: 'user-1',
    email: 'admin@liquid-glass.com',
    // bcrypt hash for "adminpassword"
    passwordHash:
      '$2a$10$eACCc55nCenx2AxVP2g29uJc2x1tJgFbU3wzau7u2S.I4A7a4Ua6.', // hash for "adminpassword"
    roles: ['admin', 'user'],
  },
]
