import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { type User } from '@/interfaces/User';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { getUserSession } from '@/api/user';

import Loading from '@/components/our-components/loading';

interface UserContextType {
  user: User | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);

  const { isLoading, refetch } = useQuery({
    queryKey: ['session'],
    queryFn: getUserSession,
    enabled: true,
    retry: 1,
    staleTime: 0, // Always stale - refetch every time
    gcTime: 0, // No caching - always fetch fresh data
  });

  useEffect(() => {
    async function handleSession() {
      try {
        const result = await refetch();
        if (result.data) {
          setUser(result.data);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    }
    handleSession();
  }, [location.pathname, user]);

  if (isLoading) {
    return <Loading />
  }

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};
