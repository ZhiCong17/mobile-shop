import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, Outlet, RouterProvider, useLocation } from 'react-router-dom';

// Import Pages
import HomePage from './pages/home/HomePage';
import CartPage from './pages/cart/CartPage';
import OrderPage from './pages/order/OrderPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/login/LoginPage';

// Import Components
import NavBar from './components/NavBar';

const router = createBrowserRouter([
  {
    path: '/',
    element: <NavBarWrapper />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '/',
        element: <HomePage />
      },
      {
        path: '/cart',
        element: <CartPage />
      },
      {
        path: '/order',
        element: <OrderPage />
      },
      {
        path: '/login',
        element: <LoginPage />
      }
    ]
  },

])

function NavBarWrapper() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div>
      {!isLoginPage && <NavBar />}
      <Outlet />
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
