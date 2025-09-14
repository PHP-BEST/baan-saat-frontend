import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from './pages/Error';
import AccountLayout from './layouts/AccountLayout';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/Landing';
import YourServicePage from './pages/YourService';
import LoginPage from './pages/Login';
import ProfilePage from './pages/Profile';
import ProtectedRoute from './middleware/protectedRoute';

import BookingPage from './pages/Booking';
import CustomerRequestPage from './pages/CustomerRequest';
import ServiceDetailPage from './pages/ServiceDetail';
import ServiceEditPage from './pages/ServiceEdit';
import ServiceCreatePage from './pages/ServiceCreate';
import ServiceListProfilePage from './pages/ServiceListProfile';
import ServiceListAllPage from './pages/ServiceListAll';
import SearchPage from './pages/Search';
import ServiceRequestPage from './pages/ServiceRequest';
import ServiceRequestEditPage from './pages/ServiceRequestEdit';
import YourRequestPage from './pages/YourRequest';

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
        element: <BookingPage />,
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
        path: 'servicelist',
        element: <ServiceListProfilePage />,
      },
      {
        path: 'servicelistall',
        element: <ServiceListAllPage />,
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
      {
        path: 'ServiceRequest',
        element: <ServiceRequestPage />,
      },
      {
        path: 'ServiceRequestEdit',
        element: <ServiceRequestEditPage />,
      },
    ],
  },
]);
