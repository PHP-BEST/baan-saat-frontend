import { NavLink, Outlet } from 'react-router-dom';
import Footer from '@/components/our-components/footer';
import Header from '@/components/our-components/header';
import ActionButton from '@/components/our-components/actionButton';
import axios from 'axios';

interface SidebarItem {
  name: string;
  path: string;
  isDisabled?: boolean;
}

const SidebarMenu: SidebarItem[] = [
  { name: 'Profile', path: '/', isDisabled: false },
  { name: 'Account Setting', path: '/setting', isDisabled: true },
  { name: 'Privacy', path: '/privacy', isDisabled: true },
  { name: 'My Offers', path: '/offer', isDisabled: false },
  { name: 'My Services', path: '/service', isDisabled: false },
];

const logout = async () => {
  try {
    await axios.delete('/logout');
    window.location.href = '/';
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

export default function AccountLayout() {
  return (
    <>
      <Header />
      <div className="w-full min-h-screen px-12 py-8 flex gap-6 bg-gray-50 justify-center">
        {/* Sidebar */}
        <div className="flex flex-col w-1/4 min-w-[160px] max-w-[240px]">
          <h1 className="text-2xl font-bold mb-2">Your Account</h1>
          <div className="w-full h-full bg-background-sidebar border border-border-sidebar rounded-2xl px-4 pb-4 pt-8 flex flex-col gap-4 shadow-sm text-center ">
            {SidebarMenu.map((item: SidebarItem) => (
              <div key={item.name}>
                <NavLink
                  key={item.path}
                  to={'/account' + item.path}
                  className={`font-medium ${item.isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-button-action'}`}
                  onClick={
                    item.isDisabled ? (e) => e.preventDefault() : undefined
                  }
                >
                  {item.name}
                </NavLink>
                {item.name === 'Privacy' && <hr className="my-2" />}
              </div>
            ))}
            <div className="mt-auto">
              <ActionButton
                buttonColor="red"
                buttonType="outline"
                onClick={logout}
              >
                Sign out
              </ActionButton>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full flex flex-col flex-1 max-w-[900px]">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
}
