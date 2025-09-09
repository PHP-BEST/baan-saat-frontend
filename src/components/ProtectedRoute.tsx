import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log(session)

  if (!session || !session.name) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;