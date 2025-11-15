import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from './error/Error';
import AccountLayout from './layouts/AccountLayout';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/Landing';
import MyPostPage from './pages/MyPost';
import MyOfferPage from './pages/MyOffer';
import LoginPage from './pages/Login';
import ProfilePage from './pages/Profile';
import ProtectedRoute from './middleware/protectedRoute';

import ApplyCreatePage from './pages/ApplyCreate';
import PostDetailPage from './pages/PostDetail';
import PostEditPage from './pages/PostEdit';
import PostCreatePage from './pages/PostCreate';
import CustomerProfilePage from './pages/CustomerProfile';
import SearchPage from './pages/Search';
import MyApplyPage from './pages/MyApply';
import CustomerProfilePostPage from './pages/CustomerProfilePost';
import ApplyEditPage from './pages/ApplyEdit';
import BecomeProvider from './pages/BecomeProvider';
import ProviderAccountLayout from './layouts/ProviderAccountLayout';
import Notification from './pages/payments/Notification';
import Management from './pages/payments/Management';
import Payments from './pages/payments/Payments';
import Payouts from './pages/payments/Payouts';
import Balances from './pages/payments/Balances';
import OnboardPage from './pages/payments/Onboard';
import ApplyDetailPage from './pages/ApplyDetail';
import ChatPage from './pages/Chat';
import ProviderProfilePage from './pages/ProviderProfilePage';
import MyWorkPage from './pages/MyWork';
import OfferDetailPage from './pages/offerDetail';

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
          { path: 'become-provider', element: <BecomeProvider /> },
          { path: 'post', element: <MyPostPage /> },
          { path: 'apply', element: <MyApplyPage /> },
          { path: 'offer', element: <MyOfferPage /> },
          { path: 'work', element: <MyWorkPage /> },
        ],
      },
      {
        path: 'account/provider-account',
        element: (
          <ProtectedRoute>
            <ProviderAccountLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: 'notify', element: <Notification /> },
          { path: '', element: <Management /> },
          { path: 'payments', element: <Payments /> },
          { path: 'payouts', element: <Payouts /> },
          { path: 'balances', element: <Balances /> },
        ],
      },
      {
        path: 'onboard',
        element: <OnboardPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'post/:postId',
        element: <PostDetailPage />,
      },
      {
        path: 'post/:postId/edit',
        element: (
          <ProtectedRoute>
            <PostEditPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'post/create',
        element: (
          <ProtectedRoute>
            <PostCreatePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'user/:userId',
        element: <CustomerProfilePage />,
      },
      {
        path: 'user/:userId/provider',
        element: <ProviderProfilePage />,
      },
      {
        path: 'user/:userId/post',
        element: <CustomerProfilePostPage />,
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
      {
        path: 'apply/:postId/create',
        element: (
          <ProtectedRoute>
            <ApplyCreatePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'apply/:applyId/edit',
        element: (
          <ProtectedRoute>
            <ApplyEditPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'apply/:applyId',
        element: (
          <ProtectedRoute>
            <ApplyDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'offer/:offerId',
        element: (
          <ProtectedRoute>
            <OfferDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'chat/:applyId',
        element: (
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
