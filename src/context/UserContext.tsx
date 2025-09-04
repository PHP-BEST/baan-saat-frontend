import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '@/interfaces/User';

interface UserContextType {
  user: User;
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

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User>({
    userId: '',
    name: '<Your Name>',
    role: 'customer',
    telNumber: '<Your Phone Number>',
    avatarUrl: '',
    email: '<Your Email>',
    address: '<Your Address>',
    providerProfile: {
      title: '<Your Title>',
      description: '<Your Description>',
      skills: [],
    },
    lastLoginAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const updateUser = (newUser: User) => {
    setUser(newUser);
  };

  const updateAvatarUrl = (avatarUrl: string) => {
    setUser((prev) => ({ ...prev, avatarUrl }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser, updateAvatarUrl }}>
      {children}
    </UserContext.Provider>
  );
};
