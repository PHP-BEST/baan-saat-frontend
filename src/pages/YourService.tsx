import ServiceCard from '@/components/our-components/serviceCard';
import type { Service } from '@/interfaces/Service';
import { mockServices } from '@/mock/services';

export default function YourServicePage() {
  return (
    <>
      {/* Header */}
      <h1 className="text-2xl font-bold mb-2">Your Service</h1>

      {/* Content */}
      <div className="w-full h-full max-h-screen overflow-auto grid grid-cols-3 gap-4 bg-white border rounded-2xl p-8 shadow-sm m-0">
        {mockServices.map((service: Service) => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>
    </>
  );
}
