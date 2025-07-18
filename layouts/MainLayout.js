import { Navbar, Cart } from '@/components'

const MainLayout = ({ children }) => {
  return (
    <div className='min-h-screen'>
      <Navbar />
      <main style={{ paddingTop: '80px' }}>{children}</main>
      <Cart />
    </div>
  )
}

export default MainLayout
