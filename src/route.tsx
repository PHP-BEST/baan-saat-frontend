import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from './pages/Error';
import AccountLayout from './layouts/AccountLayout';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/Landing';
import MyServicePage from './pages/MyService';
import LoginPage from './pages/Login';
import ProfilePage from './pages/Profile';
import ProtectedRoute from './middleware/protectedRoute';

import OfferCreatePage from './pages/OfferCreate';
import ServiceDetailPage from './pages/ServiceDetail';
import ServiceEditPage from './pages/ServiceEdit';
import ServiceCreatePage from './pages/ServiceCreate';
import ProviderProfilePage from './pages/ProviderProfile';
import ProviderProfileServicePage from './pages/ProviderProfileService';
import SearchPage from './pages/Search';
import MyOfferPage from './pages/MyOffer';
import OfferEditPage from './pages/OfferEdit';

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
          { path: 'offer', element: <MyOfferPage /> },
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
        path: 'offer/:serviceId/create',
        element: (
          <ProtectedRoute>
            <OfferCreatePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'offer/:offerId/edit',
        element: (
          <ProtectedRoute>
            <OfferEditPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
