import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/our-components/header';
import Footer from '@/components/our-components/footer';
import type { Post } from '@/interfaces/Post';
import type { User } from '@/interfaces/User';
import type { Apply, ApplyStatus } from '@/interfaces/Apply';
import ActionButton from '@/components/our-components/actionButton';
import Loading from '@/components/our-components/loading';
import {
  acceptApply,
  convertTagsToLabels,
  formatDateToDisplay,
  rejectApply,
} from '@/utils/function';
import { Calendar, Loader, Phone } from 'lucide-react';
import { getApplyById, getDetailedAppliesByPostId } from '@/api/apply';
import { deletePost, getPostById } from '@/api/post';
import { getUserById } from '@/api/user';
import { useUser } from '@/context/UserContext';
import PostNotFound from '@/error/PostNotFound';
import ApplyNotFound from '@/error/ApplyNotFound';

export default function ApplyDetailPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { applyId } = useParams();

  const [apply, setApply] = useState<Apply | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [customerUser, setCustomerUser] = useState<User | null>(null);
  const [providerUser, setProviderUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isStatusApplyLoading, setStatusApplyLoading] = useState(false);
  const [applyAction, setApplyAction] = useState<ApplyStatus>('Pending');
  const [openCancelApplyModal, setOpenCancelApplyModal] = useState(false);
  const [openAcceptApplyModal, setOpenAcceptApplyModal] = useState(false);
  const [openRejectApplyModal, setOpenRejectApplyModal] = useState(false);

  useEffect(() => {
    const fetchApplyDetails = async () => {
      if (!applyId || !user) return;

      try {
        setLoading(true);
        const applyData = await getApplyById(applyId);
        if (!applyData) {
          return;
        }
        setApply(applyData);
        setApplyAction(applyData.status);

        const postData = await getPostById(applyData.postId);
        if (!postData) {
          return;
        }
        setPost(postData);

        const customer = await getUserById(applyData.customerId);
        setCustomerUser(customer);
        const provider = await getUserById(applyData.providerId);
        setProviderUser(provider);
      } catch (err) {
        console.error('Error fetching apply details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplyDetails();
  }, [applyId, user]);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div>
        <Header />
        <div className="px-16 py-10 w-full min-h-screen flex flex-col gap-10 bg-white">
          <Loading />
        </div>
        <Footer />
      </div>
    );
  }

  if (!apply) {
    return (
      <div>
        <Header />
        <div className="w-full min-h-screen h-fit px-12 py-8 bg-gray-50">
          <ApplyNotFound />
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div>
        <Header />
        <div className="w-full min-h-screen h-fit px-12 py-8 bg-gray-50">
          <PostNotFound />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow flex justify-center py-12 px-4">
        <div className="w-[65%] min-h-full bg-gray-100 rounded-2xl border border-gray-300 p-6 shadow-sm">
          {/* Post Information */}
          <div className="flex flex-col gap-4">
            {/* Post Title */}
            <h1 title={post.title} className="text-3xl font-bold text-gray-900">
              {post.title}
            </h1>

            {/* Post Cover Image */}
            {post.coverPhotoUrl ? (
              <img
                src={post.coverPhotoUrl}
                alt={post.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
                <span className="text-gray-400">No image available</span>
              </div>
            )}

            {/* Post Description */}
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">Description</h2>
              <p className="text-lg text-gray-700">
                {post.description || 'No description provided.'}
              </p>
            </div>

            {/* Post Customer Name */}
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">Posted By</h2>
              <p className="text-lg text-gray-700">
                {customerUser ? customerUser.name : 'Unknown'}
              </p>
            </div>

            {/* Post Location */}
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">Location</h2>
              <p className="text-lg text-gray-700">
                {post.location ? post.location : 'Unknown'}
              </p>
            </div>

            {/* Post Budget */}
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">Budget</h2>
              <p className="text-lg text-gray-700">
                ฿ {post.budget.toLocaleString()}
              </p>
            </div>

            {/* Post Contact */}
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">Contact</h2>
              <div className="flex gap-2 items-center">
                <Phone width={16} />
                <p className="text-lg text-gray-700">{post.telNumber}</p>
              </div>
            </div>

            {/* Post Tag */}
            {post.tag && (
              <div className="w-full flex flex-col gap-2">
                <h2 className="text-2xl font-semibold">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {convertTagsToLabels([post.tag]).map((tag) => (
                    <span
                      key={tag}
                      className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Post Date */}
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">Date to Perform</h2>
              <div className="flex gap-2 items-center">
                <Calendar width={16} />
                <p className="text-lg text-gray-700">
                  {formatDateToDisplay(post.date)}
                </p>
              </div>
            </div>
          </div>

          <hr className="my-6" />

          {/* Apply Section */}
          <div className="flex flex-col gap-4">
            {/* Apply Title with Status */}
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                {user._id == apply.customerId ? `Provider Apply` : 'My Apply'}
              </h1>
              <p
                className={`${
                  applyAction == 'Accepted'
                    ? 'border rounded-full border-accept bg-accept'
                    : applyAction == 'Rejected'
                      ? 'border-reject bg-reject'
                      : 'border-black bg-black'
                } border rounded-full text-xl font-semibold text-white px-3 py-1`}
              >
                {applyAction}
              </p>
            </div>

            {/* Apply Provider Name */}
            {user._id != providerUser?._id && (
              <div className="w-full flex flex-col gap-2">
                <h2 className="text-2xl font-semibold">Name</h2>
                <p
                  className="text-lg font-semibold text-button-action hover:underline cursor-pointer"
                  onClick={() => {
                    navigate(`/user/${providerUser?._id}`);
                  }}
                >
                  {providerUser ? providerUser.name : 'Unknown'}
                </p>
              </div>
            )}

            {/* Apply Date */}
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">Date to Perform</h2>
              <div className="flex gap-2 items-center">
                <Calendar width={16} />
                <p className="text-lg text-gray-900">
                  {formatDateToDisplay(apply.date)}
                </p>
              </div>
            </div>

            {/* Apply Applied Price */}
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">Applied Price</h2>
              <p className="text-lg text-gray-900">
                ฿ {apply.appliedPrice.toLocaleString()}
              </p>
            </div>

            {/* Apply Description */}
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">Description</h2>
              <p className="text-lg text-gray-900 whitespace-pre-wrap">
                {apply.description || 'No description provided.'}
              </p>
            </div>

            {/* Submitted Date */}
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">Submitted On</h2>
              <p className="text-lg text-gray-900">
                {formatDateToDisplay(apply.createdAt)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center mt-6 gap-4">
              {user._id !== apply.customerId ? (
                <>
                  <ActionButton
                    buttonColor="blue"
                    onClick={() => navigate(`/apply/${applyId}/edit`)}
                    className="cursor-pointer"
                  >
                    Edit
                  </ActionButton>
                </>
              ) : applyAction === 'Pending' ? (
                <>
                  <ActionButton
                    buttonColor="green"
                    onClick={() => {
                      setOpenAcceptApplyModal(true);
                    }}
                    className="cursor-pointer"
                  >
                    Accept
                  </ActionButton>

                  <ActionButton
                    buttonColor="red"
                    onClick={() => {
                      setOpenRejectApplyModal(true);
                    }}
                    className={`${isStatusApplyLoading ? '' : 'cursor-pointer'}`}
                    disabled={isStatusApplyLoading}
                  >
                    {isStatusApplyLoading && (
                      <Loader className="animate-spin" size={24} />
                    )}
                    Reject
                  </ActionButton>
                </>
              ) : applyAction === 'Accepted' ? (
                <ActionButton
                  buttonColor="red"
                  onClick={() => {
                    setOpenCancelApplyModal(true);
                  }}
                  disabled={isStatusApplyLoading}
                >
                  {isStatusApplyLoading && (
                    <Loader className="animate-spin" size={24} />
                  )}
                  Cancel
                </ActionButton>
              ) : null}

              <ActionButton
                onClick={() => {
                  navigate(-1);
                }}
                className={`${isStatusApplyLoading ? '' : 'cursor-pointer'}`}
                disabled={isStatusApplyLoading}
              >
                {isStatusApplyLoading && (
                  <Loader className="animate-spin" size={24} />
                )}
                Back
              </ActionButton>
            </div>
          </div>
        </div>

        {openAcceptApplyModal && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-lg min-w-[300px] text-center">
              <p className="mb-2 text-lg font-semibold">
                ต้องการ Accept Apply ใช่หรือไม่?
              </p>
              <p className="text-sm text-red-500 mb-4">
                เมื่อกดยืนยัน ระบบจะทำการอนุมัติผู้สมัครนี้
                และปฏิเสธผู้สมัครคนอื่นโดยอัตโนมัติ ไม่สามารถย้อนกลับได้
              </p>
              <div className="flex justify-center gap-4">
                <ActionButton
                  onClick={async () => {
                    setStatusApplyLoading(true);
                    setApplyAction('Accepted');
                    await acceptApply(apply._id);
                    const otherApplies = await getDetailedAppliesByPostId(
                      apply.postId,
                    );
                    const rejectPromises = otherApplies
                      .filter(
                        (a) => a._id !== apply._id && a.status !== 'Rejected',
                      )
                      .map((a) => rejectApply(a._id));
                    await Promise.all(rejectPromises);
                    setStatusApplyLoading(false);
                    setOpenAcceptApplyModal(false);
                    window.location.reload();
                  }}
                  className={`${isStatusApplyLoading ? '' : 'cursor-pointer'}`}
                  disabled={isStatusApplyLoading}
                >
                  {isStatusApplyLoading && (
                    <Loader className="animate-spin" size={24} />
                  )}
                  Yes
                </ActionButton>
                <ActionButton
                  onClick={() => setOpenAcceptApplyModal(false)}
                  className={`cursor-pointer bg-gray-200 text-black border-gray-200 
            ${isStatusApplyLoading ? '' : 'cursor-pointer'}`}
                  disabled={isStatusApplyLoading}
                >
                  {isStatusApplyLoading && (
                    <Loader className="animate-spin" size={24} />
                  )}
                  No
                </ActionButton>
              </div>
            </div>
          </div>
        )}

        {openRejectApplyModal && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-lg min-w-[300px] text-center">
              <p className="mb-2 text-lg font-semibold">
                ต้องการ Reject Apply ใช่หรือไม่?
              </p>
              <p className="text-sm text-red-500 mb-4">
                เมื่อกดยืนยัน ผู้สมัครนี้จะถูกปฏิเสธ และไม่สามารถกู้คืนได้
              </p>
              <div className="flex justify-center gap-4">
                <ActionButton
                  onClick={async () => {
                    setStatusApplyLoading(true);
                    setApplyAction('Rejected');
                    await rejectApply(apply._id);
                    setStatusApplyLoading(false);
                    setOpenRejectApplyModal(false);
                    window.location.reload();
                  }}
                  className={`${isStatusApplyLoading ? '' : 'cursor-pointer'}`}
                  disabled={isStatusApplyLoading}
                >
                  {isStatusApplyLoading && (
                    <Loader className="animate-spin" size={24} />
                  )}
                  Yes
                </ActionButton>
                <ActionButton
                  className={`cursor-pointer bg-gray-200 text-black border-gray-200 
            ${isStatusApplyLoading ? '' : 'cursor-pointer'}`}
                  disabled={isStatusApplyLoading}
                  onClick={() => setOpenRejectApplyModal(false)}
                >
                  {isStatusApplyLoading && (
                    <Loader className="animate-spin" size={24} />
                  )}
                  No
                </ActionButton>
              </div>
            </div>
          </div>
        )}

        {openCancelApplyModal && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-lg min-w-[300px] text-center">
              <p className="mb-2 text-lg font-semibold">
                ต้องการ Cancel Provider ใช่หรือไม่?
              </p>
              <p className="text-sm text-red-500 mb-4">
                การยกเลิกจะลบโพสต์นี้อย่างถาวร รวมถึงข้อมูลการสมัครทั้งหมด
                และไม่สามารถกู้คืนได้
              </p>
              <div className="flex justify-center gap-4">
                <ActionButton
                  onClick={async () => {
                    setStatusApplyLoading(true);
                    await deletePost(apply.postId);
                    setStatusApplyLoading(false);
                    setOpenCancelApplyModal(false);
                    window.location.href = '/account/post';
                  }}
                  className={`${isStatusApplyLoading ? '' : 'cursor-pointer'}`}
                  disabled={isStatusApplyLoading}
                >
                  {isStatusApplyLoading && (
                    <Loader className="animate-spin" size={24} />
                  )}
                  Yes
                </ActionButton>
                <ActionButton
                  className={`cursor-pointer bg-gray-200 text-black border-gray-200 
            ${isStatusApplyLoading ? '' : 'cursor-pointer'}`}
                  disabled={isStatusApplyLoading}
                  onClick={() => setOpenCancelApplyModal(false)}
                >
                  {isStatusApplyLoading && (
                    <Loader className="animate-spin" size={24} />
                  )}
                  No
                </ActionButton>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
