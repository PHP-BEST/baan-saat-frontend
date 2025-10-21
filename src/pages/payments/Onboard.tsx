import Footer from '@/components/our-components/footer';
import Header from '@/components/our-components/header';
import { Link } from 'react-router-dom';
import { AccountOnboarding } from '@/components/payments/paymentComponents';

export default function Onboard() {
  return (
    <>
      <Header />
      <div className="min-h-screen w-full bg-gray-50 px-50 py-15 ">
        <div className="inline-block mb-2 px-2 py-1 rounded-xl bg-gray-100 hover:bg-gray-300 active:bg-gray-400">
          <Link to="/account/become-provider">&larr; ย้อนกลับ</Link>
        </div>
        <div className=" px-12 py-8 bg-gray-100 min-h-[60vh] rounded-2xl shadow-lg">
          <div>
            <AccountOnboarding />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
