import MainLayout from './layouts/MainLayout';
import AccountPage from './pages/AccountPage';
import { ErrorPage } from './pages/ErrorPage';
import { LandingPage } from './pages/LandingPage';
import ProfileCreationPage from './pages/ProfileCreationPage';
import ServiceCreationPage from './pages/ServiceCreationPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <LandingPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/register',
      element: <ProfileCreationPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/account',
      element: <AccountPage />,
      errorElement: <AccountPage />,
    },
      {
      path: '/CreateService',
      element: <ServiceCreationPage />,
      errorElement: <ErrorPage />,
    },
  ]);

  return (
    <MainLayout>
      <RouterProvider router={router} />
    </MainLayout>
  );
}

export default App;
