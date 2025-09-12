import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from './pages/Error';
import AccountLayout from './layouts/AccountLayout';
import LandingPage from './pages/Landing';
import YourServicePage from './pages/YourService';
import LoginPage from './pages/Login';
import ProfilePage from './pages/Profile';
import ProfileCreationPage from './pages/ProfileCreationPage';
import ServiceCreationPage from './pages/ServiceCreationPage';

export const router = createBrowserRouter([
  {
    path: '',
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'account',
    element: <AccountLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: '', element: <ProfilePage /> },
      { path: 'service', element: <YourServicePage /> },
    ],
  },
  {
    path: 'login',
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/register',
    element: <ProfileCreationPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/CreateService',
    element: <ServiceCreationPage />,
    errorElement: <ErrorPage />,
  },
]);
