import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from './pages/Error';
import AccountLayout from './layouts/AccountLayout';
import LandingPage from './pages/Landing';
import YourServicePage from './pages/YourService';
import LoginPage from './pages/Login';
import ProfilePage from './pages/Profile';
import ProfileCreationPage from './pages/ProfileCreationPage';
import ServiceCreationPage from './pages/ServiceCreationPage';
import CustomerRequestPage from './pages/CustomerRequest';
import ServiceListProfilePage from './pages/ServiceListProfilePage';
import ServiceListAllPage from './pages/ServiceListAllPage';
import SearchPage from './pages/SearchPage';
import ServiceRequestPage from './pages/ServiceRequest';
import ServiceRequestEditPage from './pages/ServiceRequestEdit';
import YourRequestPage from './pages/YourRequest';

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
      { path: 'request', element: <YourRequestPage /> },
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
  {
    path: 'ServiceRequest',
    element: <ServiceRequestPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'ServiceRequestEdit',
    element: <ServiceRequestEditPage />,
    errorElement: <ErrorPage />,
  },
]);
