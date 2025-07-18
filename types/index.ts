export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category?: string
  size?: string
  stock: number
}

export interface CartItem extends Product {
  quantity: number
}

export interface Address {
  fullName: string
  addressLine1: string
  city: string
  postalCode: string
  country: string
}

export type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'

export interface Order {
  id: string
  items: CartItem[]
  total: number
  shippingAddress: Address
  paymentMethod: 'Credit Card' | 'Cash on Delivery'
  status: OrderStatus
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  passwordHash: string
  roles: ('user' | 'admin')[]
}

export interface DecodedToken {
  userId: string
  roles: ('user' | 'admin')[]
  iat: number
  exp: number
}
