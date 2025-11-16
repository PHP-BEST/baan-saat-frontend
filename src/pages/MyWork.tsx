import { getDetailedAppliesByProviderId } from '@/api/apply';
import { getDetailedOffersByProviderId } from '@/api/offer';
import Loading from '@/components/our-components/loading';
import { useUser } from '@/context/UserContext';
import type { ApplyDetail } from '@/interfaces/Apply';
import type { OfferDetail } from '@/interfaces/Offer';
import { formatDateToDisplay } from '@/utils/function';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MyWorkPage() {
  const { user } = useUser();
  const navigate = useNavigate();

  if (!user) return;

  const [worksDetail, setWorksDetail] = useState<(ApplyDetail | OfferDetail)[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getApplies = async () => {
      setLoading(true);
      const currentApplies = await getDetailedAppliesByProviderId(user._id);
      const currentOffers = await getDetailedOffersByProviderId(user._id);
      const workStatusesToShow = ['Not working', 'In progress', 'Completed'];

      const filteredWork = currentApplies.filter(
        (apply) =>
          apply.status === 'Accepted' &&
          workStatusesToShow.includes(apply.post.status),
      );
      const filteredWork2 = currentOffers.filter(
        (offer) =>
          offer.status === 'Accepted' &&
          workStatusesToShow.includes(offer.post.status),
      );
      const sortedWork = [...filteredWork, ...filteredWork2].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
      setWorksDetail(sortedWork);
      setLoading(false);
    };
    getApplies();
  }, []);

  const isApplyType = (
    item: ApplyDetail | OfferDetail,
  ): item is ApplyDetail => {
    return (item as ApplyDetail).appliedPrice !== undefined;
  };

  if (loading) {
    return (
      <>
        <h1 className="text-2xl font-bold mb-2">My Work</h1>
        <div className="w-full h-full flex flex-col items-center bg-white border border-border-sidebar rounded-2xl px-8 pb-4 pt-8 shadow-sm m-0">
          <Loading />
        </div>
      </>
    );
  }

  if (worksDetail.length === 0) {
    return (
      <>
        <h1 className="text-2xl font-bold mb-2">My Work</h1>
        <div className="w-full h-full flex flex-col items-center bg-white border border-border-sidebar rounded-2xl px-8 pb-4 pt-8 shadow-sm m-0">
          <p className="text-xl text-center font-semibold">
            You don&apos;t have any active or completed work yet...
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-2">My Work</h1>
      <div className="w-full h-full flex flex-col items-center bg-white border border-border-sidebar rounded-2xl px-8 pb-4 pt-8 shadow-sm m-0">
        {/* Table */}
        <div className="w-full max-h-[100vh] overflow-auto">
          <table className="table-fixed w-full border-collapse border border-gray-200">
            <thead className="sticky top-0 bg-table-row-header">
              <tr>
                <th className="border border-gray-200 p-2 w-2/5">Post Title</th>
                <th className="border border-gray-200 p-2 w-1/5">Customer</th>
                <th className="border border-gray-200 p-2 w-1/5">
                  Comfirm Date
                </th>
                <th className="border border-gray-200 p-2 w-1/5">
                  Comfirm Price
                </th>
                <th className="border border-gray-200 p-2 w-1/5">Status</th>
              </tr>
            </thead>
            <tbody>
              {worksDetail.map((work, idx) => (
                <tr
                  key={`customer-request-${idx}`}
                  className="bg-table-row-content text-center cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    navigate(
                      isApplyType(work)
                        ? `/apply/${work._id}`
                        : `/offer/${work._id}`,
                    );
                  }}
                >
                  <td className="border border-gray-200 p-2 text-ellipsis overflow-hidden whitespace-nowrap">
                    {work.post.title}
                  </td>
                  <td className="border border-gray-200 p-2 text-ellipsis overflow-hidden whitespace-nowrap">
                    {work.customer.name}
                  </td>
                  <td className="border border-gray-200 p-2 text-ellipsis overflow-hidden whitespace-nowrap">
                    {formatDateToDisplay(work.date)}
                  </td>
                  <td className="border border-gray-200 p-2 text-ellipsis overflow-hidden whitespace-nowrap">
                    {isApplyType(work) ? work.appliedPrice : work.price} THB
                  </td>
                  <td
                    className={`border border-gray-200 p-2 text-ellipsis overflow-hidden whitespace-nowrap font-bold 
                      ${
                        work.post.status === 'Completed'
                          ? 'text-accept'
                          : work.post.status === 'In progress'
                            ? 'text-blue-500'
                            : work.post.status === 'Not working'
                              ? 'text-gray-500'
                              : ''
                      }`}
                  >
                    {work.post.status}
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
