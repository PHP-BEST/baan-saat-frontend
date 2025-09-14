import type { Service } from '@/interfaces/Service';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/our-components/header';
import Footer from '@/components/our-components/footer';
import { API_ROOT, type ResponseInterface } from '@/config/api';
import ActionButton from '@/components/our-components/actionButton';
import { convertTagsToLabels } from '@/utils/function';
import { Loader, Phone } from 'lucide-react';
import { serviceCache } from '@/utils/cache';
import { useUser } from '@/context/UserContext';

export default function ServiceDetailPage() {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();
  const { user } = useUser();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId) return;

      const cacheKey = `service-${serviceId}`;

      if (serviceCache.has(cacheKey)) {
        setService(serviceCache.get(cacheKey)!);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get<ResponseInterface<Service>>(
          `${API_ROOT}/services/${serviceId}`,
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );

        if (response.data.success) {
          const currentService = response.data.data;
          serviceCache.set(cacheKey, currentService);
          setService(currentService);
        } else {
          throw new Error('Service not found');
        }
      } catch (err) {
        console.error('Error fetching service data:', err);
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="w-full min-h-screen h-fit px-12 py-8 bg-gray-50">
          {/* Loading Text */}
          <div className="flex justify-center gap-2 items-center">
            <p className="text-2xl font-semibold">Loading</p>
            <Loader className="animate-spin" size={24} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div>
        <Header />
        <div className="w-full min-h-screen h-fit px-12 py-8 bg-gray-50">
          <div className="flex flex-col gap-4 justify-center items-center">
            <p className="text-2xl font-semibold">
              Sorry, We couldn&apos;t find the service you&apos;re looking
              for...
            </p>
            <ActionButton
              onClick={() => {
                window.history.back();
              }}
              buttonType="outline"
            >
              Back
            </ActionButton>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow flex justify-center py-12 px-4">
        <div className="w-full max-w-2xl space-y-4">
          {/* Service Name */}
          <h1
            title={service.title}
            className="text-3xl font-bold text-gray-900"
          >
            {service.title}
          </h1>

          {/* Service Cover Image */}
          {service.coverPhotoUrl ? (
            <img
              src={service.coverPhotoUrl}
              alt={service.title}
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center"></div>
          )}

          {/* Service Description */}
          <div className="w-full">
            <h2 className="text-2xl font-semibold mb-2">Description</h2>
            <p className="text-lg text-gray-700">
              {service.description || 'No description provided.'}
            </p>
          </div>

          {/* Service Location */}
          <div className="w-full">
            <h2 className="text-2xl font-semibold mb-2">Location</h2>
            <p className="text-lg text-gray-700">{service.location}</p>
          </div>

          {/* Service Budget */}
          <div className="w-full">
            <h2 className="text-2xl font-semibold mb-2">Budget</h2>
            <p className="text-lg text-gray-700">฿ {service.budget}</p>
          </div>

          {/* Service Contact */}
          <div className="w-full">
            <h2 className="text-2xl font-semibold mb-2">Contact</h2>
            <div className="flex gap-2">
              <Phone width={16} />
              <p className="text-lg text-gray-700">{service.telNumber}</p>
            </div>
          </div>

          {/* Service Tags */}
          {service.tags && service.tags.length > 0 && (
            <div className="w-full">
              <h2 className="text-2xl font-semibold mb-2">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {convertTagsToLabels(service.tags).map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 my-8">
            {/* Edit Button */}
            {user?._id === service.customerId && (
              <ActionButton
                buttonType="outline"
                className="cursor-pointer"
                onClick={() => {
                  navigate(`/service/${service._id}/edit`);
                }}
              >
                Edit
              </ActionButton>
            )}
            {/* Back Button */}
            <ActionButton
              buttonType="outline"
              buttonColor="red"
              className="cursor-pointer"
              onClick={() => {
                navigate('/');
              }}
            >
              Back to Home
            </ActionButton>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
