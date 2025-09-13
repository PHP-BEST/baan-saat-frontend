import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/our-components/header';
import Footer from '@/components/our-components/footer';
import type { Service } from '@/interfaces/Service';
import ActionButton from '@/components/our-components/actionButton';
import { useNavigate } from 'react-router-dom';

export default function BookingPage() {
  const { serviceId } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState<'submit' | 'cancel' | null>(
    null,
  );

  useEffect(() => {
    async function fetchService() {
      const response = await fetch(`/api/services/${serviceId}`);
      const data = await response.json();
      setService(data);
    }
    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow min-h-full p-4 bg-white flex justify-center ">
        <div className="w-[65%] min-h-full ">
          <div className="w-full min-h-full bg-gray-100 rounded-2xl border border-gray-300 p-6 shadow-sm">
            <h1 className="text-2xl font-bold mb-2 text-center">
              Booking Service:
            </h1>
            {service ? (
              <>
                <img
                  src={service.coverPhotoUrl}
                  alt={service.title}
                  className="mb-4 mx-auto rounded-lg"
                />
                <h2 className="text-xl font-semibold text-center">
                  Service Name: {service.title}
                </h2>
                <p className="">Description: {service.description}</p>
                <p className="font-bold ">Service Fee: {service.budget} THB</p>
                <p className="">Location of service</p>
                <input
                  type="text"
                  className="min-w-[100px] w-[50%] mt-1 p-2 border rounded-lg"
                  placeholder="Address of location that you want the service to be done"
                />
                <p className="">Date of service</p>
                <input
                  type="date"
                  className="w-[50%] mt-1 p-2 border rounded-lg"
                  placeholder="Select service date"
                />
              </>
            ) : (
              <>
                <img
                  src="/default-cover.jpg"
                  alt="Default Service Picture Place Holder"
                  className="mb-4 mx-auto rounded-lg"
                />
                <h2 className="text-xl font-semibold ">Service Name</h2>
                <p className="">Service description will appear here.</p>
                <p className="font-bold ">Service Fee: 0 THB</p>
                <p className="">Location of service</p>
                <input
                  type="text"
                  className="min-w-[100px]  w-[50%]  mt-1 p-2 border rounded-lg"
                  placeholder="Address of location that you want the service to be done"
                />
                <p className="">Date of service</p>
                <input
                  type="date"
                  className="w-[50%] mt-1 p-2 border rounded-lg"
                  placeholder="Select service date"
                />
              </>
            )}

            <div className="flex justify-center mt-6 gap-4">
              <ActionButton
                buttonColor="green"
                buttonType="outline"
                onClick={() => setShowConfirm('submit')}
                fontSize={16}
              >
                Submit
              </ActionButton>
              <ActionButton
                buttonColor="red"
                buttonType="outline"
                onClick={() => setShowConfirm('cancel')}
                fontSize={16}
              >
                Cancel
              </ActionButton>
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg min-w-[300px] text-center">
            <p className="mb-4 text-lg font-semibold">
              {showConfirm === 'submit'
                ? 'Are you sure you want to submit your booking?'
                : 'Are you sure you want to cancel and go back?'}
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-200 cursor-pointer"
                onClick={() => setShowConfirm(null)}
              >
                No
              </button>
              <button
                className={`px-4 py-2 rounded ${showConfirm === 'submit' ? 'bg-green-500 text-white cursor-pointer' : 'bg-red-500 text-white cursor-pointer'}`}
                onClick={() => {
                  setShowConfirm(null);
                  if (showConfirm === 'submit') {
                    alert('Booking Request Sent Successfully');
                  } else {
                    navigate(-1);
                  }
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
