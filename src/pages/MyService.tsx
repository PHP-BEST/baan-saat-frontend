import { getUserServices } from '@/api/service';
import ActionButton from '@/components/our-components/actionButton';
import Loading from '@/components/our-components/loading';
import ServiceCard from '@/components/our-components/serviceCard';
import { useUser } from '@/context/UserContext';
import type { Service } from '@/interfaces/Service';
import { useEffect, useState } from 'react';

export default function MyServicePage() {
  const [services, setServices] = useState<Service[]>([]);

  const { user } = useUser();
  if (!user) return;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserServices = async () => {
      setLoading(true);
      const userServices = await getUserServices(user._id);
      setServices(userServices);
      setLoading(false);
    };

    fetchUserServices();
  }, []);

  if (loading) {
    return (
      <>
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-2">My Services</h1>
          <ActionButton
            className="cursor-pointer -translate-y-2"
            onClick={() => {
              window.location.href = '/service/create';
            }}
          >
            Create
          </ActionButton>
        </div>

        {/* Loading Text */}
        <div className="w-full h-full flex flex-col items-center bg-white border border-border-sidebar rounded-2xl px-8 pb-4 pt-8 shadow-sm m-0">
          <Loading />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-2">My Services</h1>
        <ActionButton
          className="cursor-pointer -translate-y-2"
          onClick={() => {
            window.location.href = '/service/create';
          }}
        >
          Create
        </ActionButton>
      </div>

      {/* Content */}
      <div className="w-full h-full flex flex-col items-center bg-white border border-border-sidebar rounded-2xl px-8 pb-4 pt-8 shadow-sm m-0">
        {services.length > 0 ? (
          <div className="w-full h-full max-h-screen overflow-auto grid grid-cols-3 gap-4">
            {services.map((service: Service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        ) : (
          <div className="w-full h-full max-h-screen">
            <p className="text-xl text-center font-semibold">
              You haven&apos;t created any services yet...
            </p>
          </div>
        )}
      </div>
    </>
  );
}
