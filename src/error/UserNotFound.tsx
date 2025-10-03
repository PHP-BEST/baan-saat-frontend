import ActionButton from '@/components/our-components/actionButton';
import { useNavigate } from 'react-router-dom';

export default function UserNotFound() {
  const navigate = useNavigate();
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 items-center justify-center">
      <p className="text-center text-2xl font-semibold">
        We couldn&apos;t find the user you were looking for...
      </p>
      <ActionButton onClick={() => navigate(-1)} className="cursor-pointer">
        Back
      </ActionButton>
    </div>
  );
}
