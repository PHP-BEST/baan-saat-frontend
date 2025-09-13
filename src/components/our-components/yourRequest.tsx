interface RequestListProps {
  serviceName: string;
  serviceProvider: string;
  date: string;
  budget: number;
  location: string;
  status: string;
  backgroundColor?: string;
}
export default function RequestList({
  serviceName,
  serviceProvider,
  date,
  budget,
  location,
  status,
  backgroundColor,
}: RequestListProps) {
  return (
    <div
      className={`grid grid-cols-[2fr_1fr_1.2fr_0.7fr_1.5fr_1fr] px-3 py-2 my-0 rounded-lg ${backgroundColor}`}
    >
      <span className="text-gray-600 text-center">{serviceName}</span>
      <span className="text-gray-600 text-center">{serviceProvider}</span>
      <span className="text-gray-600 text-center">{date}</span>
      <span className="text-gray-600 text-center">{budget}</span>
      <span className="text-gray-600 text-center">{location}</span>
      <span className="text-gray-600 text-center">{status}</span>
    </div>
  );
}
