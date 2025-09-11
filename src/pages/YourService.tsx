import ActionButton from '@/components/our-components/actionButton';
import ServiceCard from '@/components/our-components/serviceCard';
import type { Service } from '@/interfaces/Service';
import { mockServices } from '@/mock/services';

export default function YourServicePage() {
  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">Your Service</h1>
        <ActionButton
          className="cursor-pointer"
          onClick={() => {
            window.location.href = '/create-service';
          }}
        >
          Create
        </ActionButton>
      </div>

      {/* Content */}
      {mockServices.length > 0 ? (
        <div className="w-full h-full max-h-screen overflow-auto grid grid-cols-3 gap-4">
          {mockServices.map((service: Service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      ) : (
        <div className="w-full h-full max-h-screen">
          <p className="text-xl font-semibold">
            You haven&apos;t created any services yet...
          </p>
        </div>
      )}
    </>
  );
}
