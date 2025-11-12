import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import Loading from '@/components/our-components/loading';
import { getDetailedOffersByProviderId } from '@/api/offer';
import type { OfferDetail } from '@/interfaces/Offer';
import { formatDateToDisplay } from '@/utils/function';

export default function MyOfferPage() {
  const [offersDetail, setOffersDetail] = useState<OfferDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  if (!user) return;

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      const userOffers = await getDetailedOffersByProviderId(user._id);
      setOffersDetail(userOffers);
      setLoading(false);
    };
    fetchOffers();
  }, []);
  if (loading) {
    return (
      <>
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-2">My Offers</h1>
        </div>

        {/* Loading Text */}
        <div className="w-full h-full flex flex-col items-center bg-white border border-border-sidebar rounded-2xl px-8 pb-4 pt-8 shadow-sm m-0">
          <Loading />
        </div>
      </>
    );
  }
  return (
    <>
      <h1 className="text-2xl font-bold mb-2">My Offers</h1>
      <div className="w-full h-full flex flex-col items-center bg-white border border-border-sidebar rounded-2xl px-8 pb-4 pt-8 shadow-sm m-0">
        {/* Table */}
        <div className="w-full max-h-[100vh] overflow-auto">
          <table className="table-fixed w-full border-collapse border border-gray-200">
            <thead className="sticky top-0 bg-table-row-header">
              <tr>
                <th className="border border-gray-200 p-2 w-2/5">Post Title</th>
                <th className="border border-gray-200 p-2 w-1/5">Customer</th>
                <th className="border border-gray-200 p-2 w-1/5">
                  Offered Date
                </th>
                <th className="border border-gray-200 p-2 w-1/5">
                  Offered Price
                </th>
                <th className="border border-gray-200 p-2 w-1/5">Status</th>
              </tr>
            </thead>
            <tbody>
              {offersDetail.map((offer, idx) => (
                <tr
                  key={idx}
                  className="bg-table-row-content text-center cursor-pointer hover:bg-gray-100"
                  //   onClick={() => {
                  //     navigate(`/apply/${apply._id}`);
                  //   }}
                >
                  <td className="border border-gray-200 p-2 text-ellipsis overflow-hidden whitespace-nowrap">
                    {offer.post.title}
                  </td>
                  <td className="border border-gray-200 p-2 text-ellipsis overflow-hidden whitespace-nowrap">
                    {offer.customer.name}
                  </td>
                  <td className="border border-gray-200 p-2 text-ellipsis overflow-hidden whitespace-nowrap">
                    {formatDateToDisplay(offer.date)}
                  </td>
                  <td className="border border-gray-200 p-2 text-ellipsis overflow-hidden whitespace-nowrap">
                    {offer.offeredPrice} THB
                  </td>
                  <td
                    className={`border border-gray-200 p-2 text-ellipsis overflow-hidden whitespace-nowrap font-bold ${offer.status == 'Accepted' ? 'text-accept' : offer.status == 'Rejected' ? 'text-reject' : ''}`}
                  >
                    {offer.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
