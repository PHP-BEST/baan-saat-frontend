import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from './pages/Error';
import AccountLayout from './layouts/AccountLayout';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/Landing';
import YourServicePage from './pages/YourService';
import LoginPage from './pages/Login';
import ProfilePage from './pages/Profile';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <LandingPage />,
      },
      {
        path: 'account',
        element: <AccountLayout />,
        children: [
          { path: '', element: <ProfilePage /> },
          { path: 'service', element: <YourServicePage /> },
        ],
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
    ],
  },
]);