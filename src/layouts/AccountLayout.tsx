import { NavLink, Outlet } from 'react-router-dom';
import Footer from '@/components/our-components/footer';
import Header from '@/components/our-components/header';
import ActionButton from '@/components/our-components/actionButton';

interface SidebarItem {
  name: string;
  path: string;
}

const SidebarMenu: SidebarItem[] = [
  { name: 'Profile', path: '/profile' },
  { name: 'Account Setting', path: '/setting' },
  { name: 'Privacy', path: '/privacy' },
  { name: 'Your Request', path: '/request' },
  { name: 'Your Service', path: '/service' },
];

export default function AccountLayout() {
  return (
    <>
      <Header />
      <div className="w-full min-h-screen h-fit px-12 py-8 flex gap-6 bg-gray-50 justify-center">
        {/* Sidebar */}
        <div className="flex flex-col w-1/4 min-w-[160px] max-w-[240px]">
          <h1 className="text-2xl font-bold mb-2">Your Account</h1>
          <div className="w-full h-full bg-white border rounded-2xl px-4 pb-4 pt-8 flex flex-col gap-4 shadow-sm text-center">
            {SidebarMenu.map((item: SidebarItem) => (
              <>
                <NavLink
                  key={item.path}
                  to={'/account' + item.path}
                  className="font-medium hover:text-button-action"
                >
                  {item.name}
                </NavLink>
                {(item.name === 'Privacy' || item.name === 'Your Service') && (
                  <hr className="my-2" />
                )}
              </>
            ))}
            <div className="mt-auto">
              <ActionButton
                buttonColor="red"
                buttonType="outline"
                onClick={() => alert('Logging out...')}
              >
                Log out
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
