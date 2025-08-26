import type React from 'react';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full bg-background font-serif">
      {/* Add Other Layout Here */}
      {children}
    </div>
  );
};

export default MainLayout;
