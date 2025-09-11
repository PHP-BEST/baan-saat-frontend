import { UserProvider } from '@/context/UserContext';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <UserProvider>
      <div className="min-h-screen w-full bg-background font-serif">
        {/* Add any common layout elements like header, navigation, etc. */}
        <Outlet />
      </div>
    </UserProvider>
  );
};

export default MainLayout;
