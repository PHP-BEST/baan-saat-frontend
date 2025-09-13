import type { Service } from '@/interfaces/Service';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link to={`/service/${service._id}`}>
      <div className="w-full max-w-[300px] h-[250px] flex flex-col items-center bg-white border rounded-2xl shadow-sm m-0">
        {service.coverPhotoUrl ? (
          <img
            src={service.coverPhotoUrl}
            alt="Service Cover Image"
            className="w-full h-2/3 object-cover rounded-t-2xl"
          />
        ) : (
          <div className="w-full h-2/3 bg-service-blank-cover rounded-t-2xl" />
        )}
        <div className="w-full h-1/3 flex flex-col justify-start px-4 py-2">
          <h2 className="text-lg font-bold text-ellipsis overflow-hidden whitespace-nowrap mb-1">
            {service.title}
          </h2>
          <p className="text-sm text-gray-600 text-ellipsis overflow-hidden line-clamp-2">
            {service.description || 'No description provided.'}
          </p>
        </div>
      </div>
    </Link>
  );
}
