import ActionButton from '@/components/our-components/actionButton';
import ServiceCard from '@/components/our-components/serviceCard';
import { API_ROOT, type ResponseInterface } from '@/config/api';
import { useUser } from '@/context/UserContext';
import type { Service } from '@/interfaces/Service';
import { servicesCache } from '@/utils/cache';
import axios from 'axios';
import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function YourServicePage() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      const cacheKey = `user-${user?._id}-services`;
      if (servicesCache.has(cacheKey)) {
        setServices(servicesCache.get(cacheKey)!);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get<ResponseInterface<Service[]>>(
          `${API_ROOT}/api/services`,
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );

        if (response.data.success) {
          const currentServices: Service[] = response.data.data;
          const filteredServices = currentServices.filter(
            (svc: Service) => svc.customerId === user._id,
          );
          servicesCache.set(cacheKey, filteredServices);
          setServices(filteredServices);
        } else {
          throw new Error('Service not found');
        }
      } catch (err) {
        console.error('Error fetching service data:', err);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
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
              navigate('/create-service');
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
            navigate('/create-service');
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
