import { getUserServices } from '@/api/service';
import ActionButton from '@/components/our-components/actionButton';
import ServiceCard from '@/components/our-components/serviceCard';
import { useUser } from '@/context/UserContext';
import type { Service } from '@/interfaces/Service';
import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function YourServicePage() {
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
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">Your Service</h1>
          <ActionButton
            className="cursor-pointer"
            onClick={() => {
              window.location.href = '/service/create';
            }}
          >
            Create
          </ActionButton>
        </div>

        {/* Loading Text */}
        <div className="flex justify-center gap-2 items-center">
          <p className="text-xl font-semibold">Loading</p>
          <Loader className="animate-spin" size={24} />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">Your Service</h1>
        <ActionButton
          className="cursor-pointer"
          onClick={() => {
            window.location.href = '/service/create';
          }}
        >
          Create
        </ActionButton>
      </div>

      {/* Content */}
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
    </>
  );
}
