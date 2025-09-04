import { RegisterPage } from './pages/RegisterPage';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import Loginpage from './pages/Loginpage';
import AccountPage from './pages/AccountPage';
import { ErrorPage } from './pages/ErrorPage';
import { LandingPage } from './pages/LandingPage';
import MainLayout from './layouts/MainLayout';
import AccountLayout from './pages/Layout';
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
      element: <AccountLayout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <Navigate to="profile" /> },
        { path: 'profile', element: <AccountPage /> },
      ],
    },
    {
      path: '/login',
      element: <Loginpage />,
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
