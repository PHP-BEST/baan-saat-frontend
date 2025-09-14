import { useState } from 'react';
import YourRequest from '@/components/our-components/yourRequest';
interface RequestProps {
  serviceName: string;
  serviceProvider: string;
  date: string;
  budget: number;
  location: string;
  status: string;
}
export default function YourRequestPage() {
  const [requests] = useState<RequestProps[]>([
    {
      serviceName: 'ล้างจาน',
      serviceProvider: 'friend',
      date: '22/8/2025',
      budget: 300,
      location: 'หอพัก',
      status: 'รอดำเนินการ',
    },
    {
      serviceName: 'ล้างจาน',
      serviceProvider: 'friend',
      date: '22/8/2025',
      budget: 300,
      location: 'หอพัก',
      status: 'รอดำเนินการ',
    },
    {
      serviceName: 'ล้างจาน',
      serviceProvider: 'friend',
      date: '22/8/2025',
      budget: 300,
      location: 'หอพัก',
      status: 'รอดำเนินการ',
    },
  ]);
  return (
    <>
      <h1 className="text-2xl font-bold mb-2">Your Request</h1>
      <div className="w-full h-full bg-white border border-border-sidebar p-8 rounded-2xl shadow-sm m-0">
        <div className="grid grid-cols-[2fr_1.5fr_1.2fr_0.7fr_1.5fr_1fr] px-3 my-1">
          <span className="font-bold text-center">Service Name</span>
          <span className="font-bold text-center text-">Service Provider</span>
          <span className="font-bold text-center">Date</span>
          <span className="font-bold text-center">Budget</span>
          <span className="font-bold text-center">Location</span>
          <span className="font-bold text-center">Status</span>
        </div>
        <hr className="border-border-sidebar my-4" />
        <div className="h-full">
          {requests.length > 0 ? (
            requests.map((request: RequestProps, index) => {
              return (
                <YourRequest
                  key={index}
                  serviceName={request.serviceName}
                  serviceProvider={request.serviceProvider}
                  date={request.date}
                  budget={request.budget}
                  location={request.location}
                  status={request.status}
                  backgroundColor={index % 2 === 0 ? 'bg-gray-200' : ''}
                />
              );
            })
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500 text-lg -translate-y-8">
                No requests found.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
