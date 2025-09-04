interface ServiceCardProps {
  title: string;
  img: string;
  priceRating: string;
  rating: string;
}

export default function ServiceCard({
  title,
  img,
  priceRating,
  rating,
}: ServiceCardProps) {
  return (
    <div className="rounded-lg p-2">
      <img src={img} width="100%" className="rounded-xl" />
      <div>
        <p className="text-xl">
          <strong>{title}</strong>
        </p>
        <p className="text-xs">price rating: {priceRating}</p>
        <p className="text-xs">rating: {rating}</p>
      </div>
    </div>
  );
}
