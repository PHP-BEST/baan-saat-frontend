import { getDetailedAppliesByProviderId } from '@/api/apply';
import Loading from '@/components/our-components/loading';
import { useUser } from '@/context/UserContext';
import type { ApplyDetail } from '@/interfaces/Apply';
import { formatDateToDisplay } from '@/utils/function';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MyApplyPage() {
  const { user } = useUser();
  const navigate = useNavigate();

  if (!user) return;

  const [appliesDetail, setAppliesDetail] = useState<ApplyDetail[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getApplies = async () => {
      setLoading(true);
      const currentApplies = await getDetailedAppliesByProviderId(user._id);
      setAppliesDetail(currentApplies);
      setLoading(false);
    };
    getApplies();
  }, []);

  if (loading) {
    return (
      <>
        <h1 className="text-2xl font-bold mb-2">My Applies</h1>
        <div className="w-full h-full flex flex-col items-center bg-white border border-border-sidebar rounded-2xl px-8 pb-4 pt-8 shadow-sm m-0">
          <Loading />
        </div>
      </>
    );
  }

  if (appliesDetail.length === 0) {
    return (
      <>
        <h1 className="text-2xl font-bold mb-2">My Applies</h1>
        <div className="w-full h-full flex flex-col items-center bg-white border border-border-sidebar rounded-2xl px-8 pb-4 pt-8 shadow-sm m-0">
          <p className="text-xl text-center font-semibold">
            You haven&apos;t created any applies yet...
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-2">My Applies</h1>
      <div className="w-full h-full flex flex-col items-center bg-white border border-border-sidebar rounded-2xl px-8 pb-4 pt-8 shadow-sm m-0">
        {/* Table */}
        <div className="w-full max-h-[100vh] overflow-auto">
          <table className="table-fixed w-full border-collapse border border-gray-200">
            <thead className="sticky top-0 bg-table-row-header">
              <tr>
                <th className="border border-gray-200 p-2 w-2/5">Post Title</th>
                <th className="border border-gray-200 p-2 w-1/5">Customer</th>
                <th className="border border-gray-200 p-2 w-1/5">
                  Applied Date
                </th>
                <th className="border border-gray-200 p-2 w-1/5">
                  Applied Price
                </th>
                <th className="border border-gray-200 p-2 w-1/5">Status</th>
              </tr>
            </thead>
            <tbody>
              {appliesDetail.map((apply, idx) => (
                <tr
                  key={`customer-request-${idx}`}
                  className="bg-table-row-content text-center cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    navigate(`/apply/${apply._id}`);
                  }}
                >
                  <td className="border border-gray-200 p-2 text-ellipsis overflow-hidden whitespace-nowrap">
                    {apply.post.title}
                  </td>
                  <td className="border border-gray-200 p-2 text-ellipsis overflow-hidden whitespace-nowrap">
                    {apply.customer.name}
                  </td>
                  <td className="border border-gray-200 p-2 text-ellipsis overflow-hidden whitespace-nowrap">
                    {formatDateToDisplay(apply.date)}
                  </td>
                  <td className="border border-gray-200 p-2 text-ellipsis overflow-hidden whitespace-nowrap">
                    {apply.appliedPrice} THB
                  </td>
                  <td
                    className={`border border-gray-200 p-2 text-ellipsis overflow-hidden whitespace-nowrap font-bold ${apply.status == 'Accepted' ? 'text-accept' : apply.status == 'Rejected' ? 'text-reject' : ''}`}
                  >
                    {apply.status}
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
