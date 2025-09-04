// layouts/AccountLayout.jsx
import { NavLink, Outlet } from 'react-router-dom';
import Footer from '@/components/our-components/footer';
import Header from '@/components/our-components/header';

export default function AccountLayout() {
  return (
    <div>
      <Header />

      <div className="w-full min-h-screen bg-gray-50 flex flex-col ">
        <div className="w-full max-w-6xl mx-auto p-6  items-center ">
          {/* Title above the box */}
          <h1 className="text-2xl font-bold mb-4">Your Account</h1>
          {/* Main container with sidebar + content */}
          <div className="flex gap-6">
            {/* Sidebar */}
            <div className="w-1/4 bg-white border rounded-2xl p-4 flex flex-col gap-4 shadow-sm">
              <NavLink
                to="profile"
                className="font-medium hover:text-blue-600 "
              >
                Profile
              </NavLink>
              <NavLink
                to="account-setting"
                className="font-medium hover:text-blue-600"
              >
                Account Setting
              </NavLink>
              <NavLink to="privacy" className="font-medium hover:text-blue-600">
                Privacy
              </NavLink>
              <hr />
              <NavLink to="request" className="font-medium hover:text-blue-600">
                Your Reqquest
              </NavLink>
              <NavLink to="service" className="font-medium hover:text-blue-600">
                Your Service
              </NavLink>
              <hr />

              <div className="mt-auto">
                <button className="bg-white px-4 py-2 border border-red-400 text-red-500 rounded-full hover:bg-red-50">
                  Sign Out
                </button>
              </div>
            </div>

            {/* Right content */}
            <div className="flex-1 bg-white border rounded-2xl p-2 shadow-sm m-0">
              <div className="">
                <Outlet />
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
