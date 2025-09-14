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
import Axios from '@/config/Axios';

interface UserContextType {
  user: User | null;
  updateUser: (user: User) => void;
  updateAvatarUrl: (avatarUrl: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

const fetchSession = async (): Promise<User | null> => {
  try {
    const response = await Axios.get<User>('/api/users/session');
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);

  const { isLoading, refetch } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
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
  }, [location.pathname]);

  const updateUser = (newUser: User) => {
    setUser(newUser);
  };

  const updateAvatarUrl = (avatarUrl: string) => {
    if (user) {
      const updatedUser = { ...user, avatarUrl };
      setUser(updatedUser);
    }
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <UserContext.Provider value={{ user, updateUser, updateAvatarUrl }}>
      {children}
    </UserContext.Provider>
  );
};
