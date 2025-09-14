import { Loader } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex justify-center gap-2 items-center">
      <p className="text-2xl font-semibold">Loading</p>
      <Loader className="animate-spin" size={24} />
    </div>
  );
}
