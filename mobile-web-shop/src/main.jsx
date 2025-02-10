import { StrictMode } from 'react';
import './index.css';
import ReactDOMClient from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Import Pages
import HomePage from './pages/home/HomePage';
import CartPage from './pages/cart/CartPage';
import OrderPage from './pages/order/OrderPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/login/LoginPage';
import SignUpPage from './pages/sign-up/SignUpPage';
import PaymentSuccessPage from './pages/payment/PaymentSuccessPage';
import PaymentCancelledPage from './pages/payment/PaymentCancelledPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/cart',
    element: <CartPage />
  },
  {
    path: '/orders',
    element: <OrderPage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/signup',
    element: <SignUpPage />
  },
  {
    path: '/payment/success',
    element: <PaymentSuccessPage />
  },
  {
    path: '/payment/cancelled',
    element: <PaymentCancelledPage />
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
])

const root = ReactDOMClient.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
