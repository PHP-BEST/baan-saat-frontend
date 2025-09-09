import React, { createContext, useContext, useState } from 'react';
import axios from "axios";

axios.defaults.withCredentials = true;

interface SessionType {
  name?: string,
  role?: string,
  avatarUrl?: string
}

interface SessionContextType {
  session: SessionType | null;
  setSession: React.Dispatch<React.SetStateAction<SessionType | null>>;
  getSession: () => Promise<SessionType | undefined>;
  clearSession: () => void;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

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
  const [session, setSession] = useState<SessionType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getSession = async (): Promise<SessionType | undefined> => {
    setIsLoading(true);
    try {
      const response = await axios.get<SessionType>('http://localhost:5000/api/user/session');
      if (response.status === 200) {
        setSession(response.data);
        setIsLoading(false);
        return response.data;
      }
      setSession(null);
      setIsLoading(false);
      return undefined;
    } catch (error) {
      console.error(error);
      setSession(null);
      setIsLoading(false);
      return undefined;
    }
  };

  const clearSession = () => {
    setSession(null);
  };

  const value = {
    session,
    setSession,
    getSession,
    clearSession,
    isLoading
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};