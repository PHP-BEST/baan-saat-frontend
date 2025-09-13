interface RequestListProps {
  serviceName: string;
  price: string;
  date: string;
}
export default function RequestList({
  serviceName,
  price,
  date,
}: RequestListProps) {
  return (
    <div className="grid grid-cols-[3fr_1fr_1.5fr_0.5fr] px-3 my-1">
      <span className="text-gray-600">{serviceName}</span>
      <span className="text-gray-600">{price}</span>
      <span className="text-gray-600">{date}</span>
      <div className="flex items-end">
        <input className="w-4 h-4 bg-gray-400 mb-0.5" type="checkbox" />
      </div>
    </div>
  );
}
