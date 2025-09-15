import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from './pages/Error';
import AccountLayout from './layouts/AccountLayout';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/Landing';
import YourServicePage from './pages/YourService';
import LoginPage from './pages/Login';
import ProfilePage from './pages/Profile';
import ProtectedRoute from './middleware/protectedRoute';

import BookingCreatePage from './pages/BookingCreate';
import CustomerRequestPage from './pages/CustomerRequest';
import ServiceDetailPage from './pages/ServiceDetail';
import ServiceEditPage from './pages/ServiceEdit';
import ServiceCreatePage from './pages/ServiceCreate';
import ProviderProfilePage from './pages/ProviderProfile';
import ProviderProfileServicePage from './pages/ProviderProfileService';
import SearchPage from './pages/Search';
import YourRequestPage from './pages/YourRequest';
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
          { path: 'requests', element: <CustomerRequestPage /> },
          { path: 'service', element: <YourServicePage /> },
          { path: 'request', element: <YourRequestPage /> },
        ],
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'booking/:serviceId',
        element: <BookingCreatePage />,
      },
      {
        path: 'service/:serviceId',
        element: <ServiceDetailPage />,
      },
      {
        path: 'service/:serviceId/edit',
        element: <ServiceEditPage />,
      },
      {
        path: 'service/create',
        element: <ServiceCreatePage />,
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
        path: 'request/:serviceId/create',
        element: <BookingCreatePage />,
      },
      {
        path: 'request/:requestId/edit',
        element: <BookingEditPage />,
      },
    ],
  },
]);
