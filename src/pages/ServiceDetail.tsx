import type { Service } from '@/interfaces/Service';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { mockServices } from '@/mock/services';
import Header from '@/components/our-components/header';
import Footer from '@/components/our-components/footer';
import { API_ROOT } from '@/config/api';
import ActionButton from '@/components/our-components/actionButton';
import { convertTagsToLabels } from '@/utils/function';

export default function ServiceDetailPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        // == Waiting for API endpoint to be ready ==
        const response = await axios.get(`${API_ROOT}/services/${serviceId}`, {
          headers: { 'Content-Type': 'application/json' },
        });
        // ==========================================

        if (response.status === 200 && response.data) {
          console.log('Fetched service data:', response.data);
          setService(response.data);
        } else {
          throw new Error('Service not found');
        }
        // ==========================================
      } catch (err) {
        console.error('Error fetching service data:', err);
        const foundService = mockServices.find((s) => s._id === serviceId);
        setService(foundService || null);
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="w-full min-h-screen h-fit px-12 py-8 bg-gray-50">
          {loading && (
            <div className="flex justify-center items-center h-64">
              <p>Loading service details...</p>
            </div>
          )}
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
          <p>Service not found</p>
          <ActionButton
            onClick={() => {
              window.location.href = '/account/service';
            }}
            buttonType="filled"
          >
            Go Back
          </ActionButton>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="w-full min-h-screen h-fit px-12 py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto bg-white border rounded-2xl p-8 shadow-sm">
          <h1 className="text-3xl font-bold mb-6">{service.title}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {service.description || 'No description provided'}
              </p>

              <h2 className="text-xl font-semibold mb-3">Service Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Budget:</span>
                  <span className="text-gray-800">
                    {service.budget
                      ? `฿${service.budget.toLocaleString()}`
                      : 'Not specified'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Location:</span>
                  <span className="text-gray-800">
                    {service.location || 'Not specified'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Contact:</span>
                  <span className="text-gray-800">
                    {service.telNumber || 'Not provided'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Service Date:
                  </span>
                  <span className="text-gray-800">
                    {service.date
                      ? new Date(service.date).toLocaleDateString()
                      : 'Not specified'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Service Tags</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {service.tags && service.tags.length > 0 ? (
                  convertTagsToLabels(service.tags).map((label, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {label}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No tags available</p>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2 text-gray-700">
                  Service Information
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">Service ID:</span> {serviceId}
                  </p>
                  <p>
                    <span className="font-medium">Customer ID:</span>{' '}
                    {service.customerId}
                  </p>
                  <p>
                    <span className="font-medium">Created:</span>{' '}
                    {service.createdAt
                      ? new Date(service.createdAt).toLocaleDateString()
                      : 'Unknown'}
                  </p>
                  <p>
                    <span className="font-medium">Last Updated:</span>{' '}
                    {service.updatedAt
                      ? new Date(service.updatedAt).toLocaleDateString()
                      : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
