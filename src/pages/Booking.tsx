import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/our-components/header';
import Footer from '@/components/our-components/footer';
import type { Service } from '@/interfaces/Service';
import ActionButton from '@/components/our-components/actionButton';

export default function BookingPage() {
  const { serviceId } = useParams();
  const [service, setService] = useState<Service | null>(null);

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

            <div className="flex justify-center mt-6">
              <ActionButton
                buttonColor="green"
                buttonType="outline"
                onClick={() => {
                  alert('Booking Request Sent Successfully');
                }}
                fontSize={16}
              >
                Submit
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
