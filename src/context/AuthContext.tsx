import React, { createContext, useContext, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import Axios from '@/auth/interceptor';

interface SessionType {
  name?: string,
  role?: string,
  avatarUrl?: string
}

interface SessionContextType {
  session?: SessionType | null;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Query function for fetching session
const fetchSession = async (): Promise<SessionType | null> => {
  try {
    const response = await Axios.get<SessionType>('http://localhost:5000/api/user/session');
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within an SessionProvider');
  }
  return context;
};

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const SessionProvider: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();

  // React Query hook for session management
  const {
    data: session,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    enabled: true,
    retry: 1,
    staleTime: 0, // Always stale - refetch every time
    gcTime: 0, // No caching - always fetch fresh data
  });

  const getSession = async (): Promise<SessionType | undefined> => {
    const result = await refetch();
    return result.data || undefined;
  };

  useEffect(() => {
    console.log('SessionProvider useEffect runs');
    getSession();
  }, [location.pathname]);

  return (
    <SessionContext.Provider value={{session, isLoading}}>
      {children}
    </SessionContext.Provider>
  );
};