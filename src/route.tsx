import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from './error/Error';
import AccountLayout from './layouts/AccountLayout';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/Landing';
import MyPostPage from './pages/MyPost';
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
import ApplyDetailPage from './pages/ApplyDetail';
import ChatPage from './pages/Chat';

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
          { path: 'post', element: <MyPostPage /> },
          { path: 'apply', element: <MyApplyPage /> },
        ],
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
