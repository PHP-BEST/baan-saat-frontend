interface ServiceCardLandingProps {
  title: string;
  img: string;
  provider: string;
  priceRating: string;
  rating: number;
}

export default function ServiceCardLanding({
  title,
  provider,
  img,
  priceRating,
  rating,
}: ServiceCardLandingProps) {
  return (
    <div className="w-full rounded-xl bg-white shadow-md p-3 flex flex-col overflow-hidden cursor-pointer">
      {/* Image wrapper with 16:9 aspect ratio */}
      <div className="w-full aspect-[16/9] mb-3 overflow-hidden rounded-md">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:opacity-90"
        />
      </div>

      {/* Text Content */}
      <div className="flex flex-col flex-1 justify-between">
        <p className="text-base font-semibold">{title}</p>
        <p className="text-sm text-gray-500">By: {provider}</p>
        <p className="text-sm text-gray-500">Price: {priceRating}</p>
        <p className="text-sm text-yellow-600">Rating: {rating}</p>
      </div>
    </div>
  );
}
