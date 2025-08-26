import MainLayout from './layouts/MainLayout';
import { ErrorPage } from './pages/ErrorPage';
import { LandingPage } from './pages/LandingPage';
import { RegisterPage } from './pages/RegisterPage';
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
  ]);

  return (
    <MainLayout>
      <RouterProvider router={router} />
    </MainLayout>
  );
}

export default App;
