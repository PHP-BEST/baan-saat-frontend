import { useParams } from 'react-router-dom';
import Header from '@/components/our-components/header';
import Footer from '@/components/our-components/footer';

export default function OfferEditPage() {
  const { offerId } = useParams();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow min-h-full p-4 bg-white flex justify-center ">
        <div className="w-[65%] min-h-full ">
          <div className="w-full min-h-full bg-gray-100 rounded-2xl border border-gray-300 p-6 shadow-sm">
            <h1 className="text-2xl font-bold mb-2 text-center">Editing</h1>
            {/* Offer Edit Form Section */}
            <p className="text-center text-lg text-gray-600">
              Offer edit for {offerId} functionality coming soon!
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
