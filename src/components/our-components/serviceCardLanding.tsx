import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Service } from '@/interfaces/Service';

export interface ServiceCardLandingProps {
  serviceId: string;
}

export default function ServiceCardLanding({
  serviceId,
}: ServiceCardLandingProps) {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [customerName, setCustomerName] = useState<string>('');

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get<Service>(`/api/services/${serviceId}`);
        setService(res.data);
      } catch (error) {
        console.error('Failed to fetch service:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  useEffect(() => {
    const fetchCustomerName = async (customerId: string) => {
      try {
        const res = await axios.get<{ name: string }>(
          `/api/users/${customerId}`,
        );
        setCustomerName(res.data.name);
      } catch (error) {
        console.error('Failed to fetch Customer name:', error);
      }
    };

    fetchCustomerName(service?.customerId || '');
  }, [service?.customerId]);

  if (loading) {
    return (
      <div className="w-full rounded-xl bg-white shadow-md p-3 flex flex-col animate-pulse">
        <div className="w-full aspect-[16/9] mb-3 bg-gray-200 rounded-md"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="w-full rounded-xl bg-white shadow-md p-3 flex flex-col">
        <p className="text-red-500">Service not found</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl bg-white shadow-md p-3 flex flex-col overflow-hidden cursor-pointer">
      {/* Image */}
      <div className="w-full aspect-[16/9] mb-3 overflow-hidden rounded-md">
        <img
          src={service.coverPhotoUrl}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:opacity-90"
        />
      </div>

      {/* Text Content */}
      <div className="flex flex-col flex-1 justify-between">
        <p className="text-base font-semibold">{service.title}</p>
        <p className="text-sm text-gray-500">By: {customerName}</p>
        <p className="text-sm text-gray-500">Price: {service.budget}฿</p>
        {/* For now, just static rating or calculate from reviews later */}
      </div>
    </div>
  );
}
