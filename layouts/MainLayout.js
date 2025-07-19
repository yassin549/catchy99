import { Navbar, Cart } from '@/components';
import Footer from '@/components/Footer';
import { useRouter } from 'next/router';

const MainLayout = ({ children }) => {
  const router = useRouter();
  const isAdminPage = router.pathname.startsWith('/admin');
  const isHomePage = router.pathname === '/';

  // Define background classes based on the page
  const backgroundClasses = isHomePage
    ? 'bg-white dark:bg-black'
    : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black';

  return (
    <div className={`min-h-screen flex flex-col ${backgroundClasses}`}>
      <Navbar />
      <main className={`flex-grow ${!isHomePage ? 'pt-20' : ''}`}>{children}</main>
      <Cart />
      {!isAdminPage && <Footer />}
    </div>
  );
};

export default MainLayout;
