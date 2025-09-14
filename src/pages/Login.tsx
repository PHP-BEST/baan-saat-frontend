import ActionButton from '@/components/our-components/actionButton';
import { API_ROOT } from '@/config/api';
import { useState } from 'react';

interface TermsModalProps {
  title: string;
  lastUpdated: string;
  onClose: () => void;
  children: React.ReactNode;
}

const TermsModal = ({
  title,
  lastUpdated,
  onClose,
  children,
}: TermsModalProps) => {
  return (
    <div className="fixed inset-0 bg-background bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>

        <h3 className="text-sm text-gray-500 mb-4">
          Last updated: {lastUpdated}
        </h3>

        {/* Content */}
        <div className="text-md text-black max-h-[60vh] overflow-y-auto pr-2 space-y-4 text-left">
          {children}
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <ActionButton
            onClick={onClose}
            buttonColor="blue"
            buttonType="filled"
          >
            Close
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default function LoginPage() {
  const [isAgree, setAgree] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const handleGoogleSignIn = () => {
    window.location.href = `${API_ROOT}/auth/google`;
  };

  const handleFacebookSignIn = () => {
    window.location.href = `${API_ROOT}/auth/facebook`;
  };

  const handleLineSignIn = () => {
    window.location.href = `${API_ROOT}/auth/line`;
  };

  const handleCloseTermsModal = () => {
    setIsTermsModalOpen(false);
  };

  return (
    <main className="flex justify-center items-center h-screen bg-background px-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-lg text-center flex flex-col gap-6">
        <h1 className="text-xl font-semibold">เข้าสู่ระบบ / สร้างบัญชี</h1>

        {/* Social Login Buttons */}
        <div className="flex flex-col gap-4">
          <button
            onClick={handleGoogleSignIn}
            className={`${isAgree ? 'bg-button-action text-white cursor-pointer hover:bg-background hover:text-button-action transition-colors' : 'bg-gray-200 text-gray-500'} py-3 rounded-lg text-base font-medium`}
            disabled={!isAgree}
          >
            Google
          </button>
          <button
            onClick={handleFacebookSignIn}
            className={`${isAgree ? 'bg-button-action text-white cursor-pointer hover:bg-background hover:text-button-action transition-colors' : 'bg-gray-200 text-gray-500'} py-3 rounded-lg text-base font-medium`}
            disabled={!isAgree}
          >
            Facebook
          </button>
          <button
            onClick={handleLineSignIn}
            className={`${isAgree ? 'bg-button-action text-white cursor-pointer hover:bg-background hover:text-button-action transition-colors' : 'bg-gray-200 text-gray-500'} py-3 rounded-lg text-base font-medium`}
            disabled={!isAgree}
          >
            Line
          </button>
        </div>

        {/* Agreement */}
        <div className="flex items-center">
          <input
            id="agreedToTerms"
            name="agreedToTerms"
            type="checkbox"
            checked={isAgree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <label
            htmlFor="agreedToTerms"
            className="ml-2 block text-sm text-gray-900"
          >
            I accept{' '}
            <span
              className="text-blue-600 hover:underline cursor-pointer font-medium"
              onClick={(e) => {
                e.preventDefault();
                setIsTermsModalOpen(true);
              }}
            >
              Term Of Service
            </span>
          </label>
        </div>

        {/* Terms Modal */}
        {isTermsModalOpen && (
          <TermsModal
            title="Terms of Service"
            lastUpdated="September 5, 2025"
            onClose={handleCloseTermsModal}
          >
            <p>
              Please read these terms and conditions carefully before using Our
              Service.
            </p>
            <h3 className="font-bold mt-2">1. Acknowledgment</h3>
            <p>
              These are the Terms and Conditions governing the use of this
              Service and the agreement that operates between You and the
              Company. These Terms and Conditions set out the rights and
              obligations of all users regarding the use of the Service.
            </p>
            <h3 className="font-bold mt-2">2. User Accounts</h3>
            <p>
              When You create an account with Us, You must provide Us
              information that is accurate, complete, and current at all times.
              Failure to do so constitutes a breach of the Terms, which may
              result in immediate termination of Your account on Our Service.
            </p>
            <h3 className="font-bold mt-2">3. Termination</h3>
            <p>
              We may terminate or suspend Your access immediately, without prior
              notice or liability, for any reason whatsoever, including without
              limitation if You breach these Terms and Conditions. Upon
              termination, Your right to use the Service will cease immediately.
            </p>
          </TermsModal>
        )}
      </div>
    </main>
  );
}
