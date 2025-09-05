import MainLayout from './layouts/MainLayout';
import AccountPage from './pages/AccountPage';
import { ErrorPage } from './pages/ErrorPage';
import { LandingPage } from './pages/LandingPage';
import { RegisterPage } from './pages/RegisterPage';
import { ServiceListAllPage } from './pages/ServiceListAllPage';
import { ServiceListProfilePage } from './pages/ServiceListProfilePage';
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
      element: <RegisterPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/account',
      element: <AccountPage />,
      errorElement: <AccountPage />,
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
  ]);

  return (
    <MainLayout>
      <RouterProvider router={router} />
    </MainLayout>
  );
}

export default App;
