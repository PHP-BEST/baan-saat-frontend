import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@/interfaces/User';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import Axios from '@/api/Axios';

interface UserContextType {
  user: User;
  isLoading: boolean;
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

  const [user, setUser] = useState<User>({
    _id: '',
    name: '',
    role: 'customer',
    telNumber: '',
    avatarUrl: '',
    email: '',
    address: '',
    providerProfile: {
      title: '',
      description: '',
      skills: [],
    },
    lastLoginAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const {
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
  
  const getSession = async (): Promise<User | undefined> => {
    const result = await refetch();
    if (result.data) {
      setUser(result.data);
      return result.data;
    }
    return undefined;
  };
  
  useEffect(() => {
    console.log('UserProvider useEffect runs');
    getSession();
  }, [location.pathname]);

  const updateUser = (newUser: User) => {
    setUser(newUser);
  };

  const updateAvatarUrl = (avatarUrl: string) => {
    setUser((prev) => ({ ...prev, avatarUrl }));
  };

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  return (
    <UserContext.Provider value={{ user, isLoading, updateUser, updateAvatarUrl }}>
      {children}
    </UserContext.Provider>
  );
};
