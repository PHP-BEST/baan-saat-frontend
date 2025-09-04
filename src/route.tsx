import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import AccountLayout from './layouts/AccountLayout';
import LandingPage from './pages/LandingPage';
import ProfilePage from './pages/ProfilePage';
import YourServicePage from './pages/YourServicePage';
import AccountStaticPage from './pages/AccountStaticPage';
import LoginPage from './pages/LoginPage';

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
      { path: '', element: <AccountStaticPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'service', element: <YourServicePage /> },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
]);
