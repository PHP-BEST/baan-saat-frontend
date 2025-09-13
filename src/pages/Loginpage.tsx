import { BACKEND_URL } from '@/config/env';
export default function Loginpage() {
  const backendUrl = `http://localhost:${BACKEND_URL}`; // change to your backend domain in production

  const handleGoogleSignIn = () => {
    window.location.href = `${backendUrl}/auth/google`;
  };

  const handleFacebookSignIn = () => {
    window.location.href = `${backendUrl}/auth/facebook`;
  };

  const handleLineSignIn = () => {
    window.location.href = `${backendUrl}/auth/line`;
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#9ba7c8] px-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-lg text-center">
        <h1 className="text-xl font-semibold mb-6">เข้าสู่ระบบ / สร้างบัญชี</h1>

        <div className="flex flex-col gap-4">
          <button
            onClick={handleGoogleSignIn}
            className="bg-gray-200 py-3 rounded-lg text-base font-medium hover:bg-gray-300 transition-colors"
          >
            Google
          </button>
          <button
            onClick={handleFacebookSignIn}
            className="bg-gray-200 py-3 rounded-lg text-base font-medium hover:bg-gray-300 transition-colors"
          >
            Facebook
          </button>
          <button
            onClick={handleLineSignIn}
            className="bg-gray-200 py-3 rounded-lg text-base font-medium hover:bg-gray-300 transition-colors"
          >
            Line
          </button>
        </div>
      </div>
    </div>
  );
}
