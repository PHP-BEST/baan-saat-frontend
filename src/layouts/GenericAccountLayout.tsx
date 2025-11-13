import { NavLink, Outlet, Link } from 'react-router-dom';
import Footer from '@/components/our-components/footer';
import Header from '@/components/our-components/header';
import ActionButton from '@/components/our-components/actionButton';
import axios from 'axios';
import { useUser } from '@/context/UserContext';
import type { SidebarMenu } from './AccountLayout';

interface SecondaryAction {
  text: string;
  path: string;
}

interface GenericAccountLayoutProps {
  title: string;
  basePath: string;
  menuItems: SidebarMenu[];
  secondaryAction?: SecondaryAction;
}

const logout = async () => {
  try {
    await axios.delete('/logout');
    window.location.href = '/';
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

export default function GenericAccountLayout({
  title,
  basePath,
  menuItems,
  secondaryAction,
}: GenericAccountLayoutProps) {
  const { user } = useUser();

  return (
    <>
      <Header />
      <div className="w-full min-h-screen px-12 py-8 flex gap-6 bg-gray-50 justify-center">
        {/* Sidebar */}
        <div className="flex flex-col w-1/4 min-w-[160px] max-w-[240px]">
          <h1 className="text-2xl font-bold mb-2">{title}</h1>

          <div className="w-full h-full bg-background-sidebar border border-border-sidebar rounded-2xl px-4 pb-4 pt-8 flex flex-col gap-4 shadow-sm text-center">
            {menuItems.map((item: SidebarMenu) => {
              if (
                item.roleToDisplay !== 'both' &&
                item.roleToDisplay !== user?.role
              ) {
                return null;
              }

              return (
                <div key={item.name}>
                  <NavLink
                    to={basePath + item.path}
                    className={`font-medium ${
                      item.isDisabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:text-button-action'
                    }`}
                    onClick={
                      item.isDisabled ? (e) => e.preventDefault() : undefined
                    }
                  >
                    {item.name}
                  </NavLink>

                  {item.name === 'Privacy' && <hr className="my-2" />}
                </div>
              );
            })}

            <div className="mt-auto pt-4">
              {secondaryAction && (
                <div className="mb-4">
                  <Link
                    to={secondaryAction.path}
                    className="font-semibold text-sm text-gray-700 hover:text-black transition-colors"
                  >
                    &larr; {secondaryAction.text}
                  </Link>
                </div>
              )}

              <ActionButton buttonColor="red" onClick={logout}>
                Sign out
              </ActionButton>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col flex-1 max-w-[900px]">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
}
