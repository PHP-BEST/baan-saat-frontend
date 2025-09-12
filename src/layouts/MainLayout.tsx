import { UserProvider } from '@/context/UserContext';
import { type ReactNode } from 'react';

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen w-full bg-background font-serif">
      {/* Add Other Layout Here */}
      <UserProvider>{children}</UserProvider>
    </div>
  );
};

export default MainLayout;
