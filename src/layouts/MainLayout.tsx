import { type ReactNode } from 'react';

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen w-full bg-background font-serif">
      {/* Add Other Layout Here */}
      {children}
    </div>
  );
};

export default MainLayout;
