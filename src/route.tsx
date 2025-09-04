import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import LoginPage from './pages/LoginPage';
import AccountLayout from './layouts/AccountLayout';
import LandingPage from './pages/LandingPage';
import AccountPage from './pages/AccountPage';
import YourServicePage from './pages/YourServicePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/account',
    element: <AccountLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: 'profile', element: <AccountPage /> },
      { path: 'service', element: <YourServicePage /> },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
]);
