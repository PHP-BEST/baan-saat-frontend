import { useParams } from 'react-router-dom';

export default function ServiceEditPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  return <div>Edit Service {serviceId}</div>;
}
