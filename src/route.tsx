import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from './pages/Error';
import AccountLayout from './layouts/AccountLayout';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/Landing';
import MyServicePage from './pages/MyService';
import LoginPage from './pages/Login';
import ProfilePage from './pages/Profile';
import ProtectedRoute from './middleware/protectedRoute';

import BookingCreatePage from './pages/BookingCreate';
import ServiceDetailPage from './pages/ServiceDetail';
import ServiceEditPage from './pages/ServiceEdit';
import ServiceCreatePage from './pages/ServiceCreate';
import ProviderProfilePage from './pages/ProviderProfile';
import ProviderProfileServicePage from './pages/ProviderProfileService';
import SearchPage from './pages/Search';
import MyRequestPage from './pages/MyRequest';
import BookingEditPage from './pages/BookingEdit';

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
        element: (
          <ProtectedRoute>
            <AccountLayout />,
          </ProtectedRoute>
        ),
        children: [
          { path: '', element: <ProfilePage /> },
          { path: 'service', element: <MyServicePage /> },
          { path: 'request', element: <MyRequestPage /> },
        ],
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'service/:serviceId',
        element: <ServiceDetailPage />,
      },
      {
        path: 'service/:serviceId/edit',
        element: (
          <ProtectedRoute>
            <ServiceEditPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'service/create',
        element: (
          <ProtectedRoute>
            <ServiceCreatePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'user/:userId',
        element: <ProviderProfilePage />,
      },
      {
        path: 'user/:userId/service',
        element: <ProviderProfileServicePage />,
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
      {
        path: 'booking/:serviceId/create',
        element: (
          <ProtectedRoute>
            <BookingCreatePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'booking/:requestId/edit',
        element: (
          <ProtectedRoute>
            <BookingEditPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
