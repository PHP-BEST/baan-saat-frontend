import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from './pages/Error';
import AccountLayout from './layouts/AccountLayout';
import LandingPage from './pages/Landing';
import YourServicePage from './pages/YourService';
import LoginPage from './pages/Login';
import ProfilePage from './pages/Profile';
import CustomerRequestPage from './pages/CustomerRequest';

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
      { path: 'requests', element: <CustomerRequestPage /> },
      { path: 'service', element: <YourServicePage /> },
    ],
  },
  {
    path: 'login',
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
]);
