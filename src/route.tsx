import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from './pages/Error';
import AccountLayout from './layouts/AccountLayout';
import LandingPage from './pages/Landing';
import YourServicePage from './pages/YourService';
import LoginPage from './pages/Login';
import ProfilePage from './pages/Profile';
import ServiceListProfilePage from './pages/ServiceListProfilePage';
import ServiceListAllPage from './pages/ServiceListAllPage';
import SearchPage from './pages/SearchPage';
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
    path: 'servicelist',
    element: <ServiceListProfilePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'servicelistall',
    element: <ServiceListAllPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'search',
    element: <SearchPage />,
    errorElement: <ErrorPage />,
  },
]);
