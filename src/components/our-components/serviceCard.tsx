interface ServiceCardProps {
  title: string;
  img: string;
  priceRating: string;
  rating: number;
}

export default function ServiceCard({
  title,
  img,
  priceRating,
  rating,
}: ServiceCardProps) {
  return (
    <div className="rounded-lg p-2">
      <img
        src={img}
        width="100%"
        className="rounded-xl transition-transform duration-300 hover:scale-105 cursor-pointer"
        alt={title}
      />
      <div>
        <p className="text-xl">
          <strong>{title}</strong>
        </p>
        <p className="text-xs">price: {priceRating}</p>
        <p className="text-xs">rating: {rating}</p>
      </div>
    </div>
  );
}
