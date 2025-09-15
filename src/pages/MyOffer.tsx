export default function MyOfferPage() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-2">My Offers</h1>
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
        <div className="h-full">This is My Offer Page</div>
      </div>
    </>
  );
}
