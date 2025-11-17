import { getDetailedApplyById, updateApplyStatus } from '@/api/apply';
import { updatePostMatched, updatePostStatus } from '@/api/post';
import { getDetailedOfferedById, updateOfferStatus } from '@/api/offer';
import ActionButton from '@/components/our-components/actionButton';
import Footer from '@/components/our-components/footer';
import Header from '@/components/our-components/header';
import Loading from '@/components/our-components/loading';
import { useUser } from '@/context/UserContext';
import WorkNotFound from '@/error/workNotFound';
import type { ApplyDetail } from '@/interfaces/Apply';
import type { OfferDetail } from '@/interfaces/Offer';
import type { Post } from '@/interfaces/Post';
import type { User } from '@/interfaces/User';
import { formatDateToDisplay } from '@/utils/function';
import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DialogDescription } from '@radix-ui/react-dialog';
import PaymentIntent from '@/components/payments/PaymentIntent';
import PaymentButton from '@/components/payments/PaymentButton';
import { Chatbox } from './Chatbox';
export default function ChatPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { applyId, offerId } = useParams();
  const workId = applyId ?? offerId;

  const [apply, setApply] = useState<ApplyDetail | null>(null);
  const [offer, setOffer] = useState<OfferDetail | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [customer, setCustomer] = useState<User | null>(null);
  const [provider, setProvider] = useState<User | null>(null);

  const [openUpdatePostStatusModal, setOpenUpdatePostStatusModal] =
    useState(false);
  const [openCancelWorkModal, setOpenCancelWorkModal] = useState(false);
  const [openPayModal, setOpenPayModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUpdateStatusLoading, setUpdateStatusLoading] = useState(false);

  const receiverid =
    customer?._id === user?._id ? provider?._id : customer?._id;

  useEffect(() => {
    const fetchWork = async () => {
      if (!workId || !user) return;
      try {
        setLoading(true);
        const applyData = await getDetailedApplyById(workId);
        if (!applyData) {
          const offerData = await getDetailedOfferedById(workId);
          if (!offerData) {
            return;
          } else {
            setOffer(offerData);
            setPost(offerData.post);
          }
        } else {
          setApply(applyData);
          setPost(applyData.post);
        }
        setCustomer(applyData.customer);
        setProvider(applyData.provider);
      } catch (err) {
        console.error('Error fetching work:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWork();
  }, [workId, user]);

  if (!user) {
    return null;
  }

  if (!post) {
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

  if (!apply && !offer) {
    return (
      <div>
        <Header />
        <div className="w-full min-h-screen h-fit px-12 py-8 bg-gray-50">
          <WorkNotFound />
        </div>
        <Footer />
      </div>
    );
  }
  if (apply) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="flex-grow flex justify-center py-12 px-4">
          <div className="w-full max-w-6xl bg-white rounded-2xl shadow-md border border-gray-200 flex flex-col lg:flex-row overflow-hidden">
            {/* Apply Info */}
            <div className="w-full lg:w-[40%] border-r border-gray-200 bg-gray-50 p-6 flex flex-col gap-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Post Detail
              </h2>

              <div className="flex flex-col gap-4 text-gray-700">
                <div className="font-medium text-lg">
                  <span>Post:</span>{' '}
                  <span
                    className="text-button-action hover:underline cursor-pointer"
                    onClick={() => {
                      navigate(`/post/${post._id}`);
                    }}
                  >
                    {post.title}
                  </span>
                </div>
                <div className="font-medium text-lg">
                  <span>Customer:</span>{' '}
                  <span
                    className="text-button-action hover:underline cursor-pointer"
                    onClick={() => {
                      navigate(`/user/${customer?._id}`);
                    }}
                  >
                    {customer?.name}
                  </span>
                </div>
                <div className="font-medium text-lg">
                  <span>Provider:</span>{' '}
                  <span
                    className="text-button-action hover:underline cursor-pointer"
                    onClick={() => {
                      navigate(`/user/${provider?._id}/provider`);
                    }}
                  >
                    {provider?.name}
                  </span>
                </div>
                <div className="font-medium text-lg">
                  <span>Date:</span> {formatDateToDisplay(apply.date)}
                </div>
                <div className="font-medium text-lg">
                  <span>Applied Price:</span> ฿{apply.appliedPrice}
                </div>
                <div>
                  <span className="font-medium text-lg">Status:</span>{' '}
                  <span className="px-3 py-1 bg-button-action text-white rounded-full text-sm font-medium">
                    {post.status}
                  </span>
                </div>
              </div>

              <Dialog open={openPayModal} onOpenChange={setOpenPayModal}>
                <DialogContent className="h-[85vh] bg-white">
                  <DialogDescription>
                    <PaymentIntent
                      postId={apply.postId}
                      providerConnectId={provider?.connectId || ''}
                    />
                  </DialogDescription>
                </DialogContent>
              </Dialog>

              <div className="flex gap-4 mt-6 items-center">
                {user._id === apply.customerId &&
                  (post.status === 'Not working' ? (
                    <ActionButton
                      buttonColor="red"
                      onClick={() => setOpenCancelWorkModal(true)}
                    >
                      Cancel Apply
                    </ActionButton>
                  ) : post.status == 'Completed' ? (
                    // <ActionButton onClick={() => setOpenPayModal(true)}>Pay</ActionButton>
                    <PaymentButton
                      postId={apply.postId}
                      openModal={setOpenPayModal}
                    />
                  ) : (
                    <></>
                  ))}

                {user._id === apply.providerId &&
                  post.status != 'Completed' && (
                    <ActionButton
                      buttonColor="green"
                      onClick={() => setOpenUpdatePostStatusModal(true)}
                    >
                      Update Status
                    </ActionButton>
                  )}
                <ActionButton
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  Back
                </ActionButton>
              </div>
            </div>

            {/* Chat Section: Just the mock page */}
            {/* Chat Section */}
            <div className="w-full lg:w-[60%] flex flex-col h-full max-h-[80vh] bg-white rounded-tr-2xl overflow-hidden border-l border-gray-200">
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between ">
                <h3 className="text-xl font-semibold text-gray-800">
                  Chat Room
                </h3>
              </div>

              {/* Chat Content */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <Chatbox id={[receiverid || '', post._id]} />
              </div>
            </div>
          </div>

          {openUpdatePostStatusModal && (
            <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 shadow-lg min-w-[300px] text-center">
                <p className="mb-2 text-lg font-semibold">
                  ต้องการ Update Status เป็น{' '}
                  {post.status == 'Not working'
                    ? 'In progress'
                    : post.status == 'In progress'
                      ? 'Completed'
                      : undefined}{' '}
                  ใช่หรือไม่?
                </p>
                <p className="text-sm text-red-500 mb-4">
                  การอัปเดตสถานะจะเปลี่ยนสถานะของโพสต์นี้และไม่สามารถแก้ไขได้
                </p>
                <div className="flex justify-center gap-4">
                  <ActionButton
                    onClick={async () => {
                      setUpdateStatusLoading(true);
                      if (post.status == 'Not working') {
                        await updatePostStatus(post._id, 'In progress');
                      } else if (post.status == 'In progress') {
                        await updatePostStatus(post._id, 'Completed');
                      }
                      setUpdateStatusLoading(false);
                      setOpenUpdatePostStatusModal(false);
                      window.location.reload();
                    }}
                    className={`${isUpdateStatusLoading ? '' : 'cursor-pointer'}`}
                    disabled={isUpdateStatusLoading}
                  >
                    {isUpdateStatusLoading && (
                      <Loader className="animate-spin" size={24} />
                    )}
                    Yes
                  </ActionButton>
                  <ActionButton
                    className={`cursor-pointer bg-gray-200 text-black border-gray-200 
            ${isUpdateStatusLoading ? '' : 'cursor-pointer'}`}
                    disabled={isUpdateStatusLoading}
                    onClick={() => setOpenUpdatePostStatusModal(false)}
                  >
                    {isUpdateStatusLoading && (
                      <Loader className="animate-spin" size={24} />
                    )}
                    No
                  </ActionButton>
                </div>
              </div>
            </div>
          )}

          {openCancelWorkModal && (
            <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 shadow-lg min-w-[300px] text-center">
                <p className="mb-2 text-lg font-semibold">
                  ต้องการยกเลิกการให้บริการของผู้ให้บริการคนนี้ใช่หรือไม่?
                </p>
                <p className="mb-4 text-sm text-red-500">
                  การยกเลิกการให้บริการจะทำให้ผู้บริการไม่สามารถสมัครให้บริการนี้ได้อีก
                </p>
                <div className="flex justify-center gap-4">
                  <ActionButton
                    onClick={async () => {
                      setUpdateStatusLoading(true);
                      await updateApplyStatus(apply._id, 'Rejected');
                      await updatePostMatched(post._id, false);
                      setUpdateStatusLoading(false);
                      setOpenCancelWorkModal(false);
                      window.location.href = `/post/${post._id}`;
                    }}
                    className={`${isUpdateStatusLoading ? '' : 'cursor-pointer'}`}
                    disabled={isUpdateStatusLoading}
                  >
                    {isUpdateStatusLoading && (
                      <Loader className="animate-spin" size={24} />
                    )}
                    Yes
                  </ActionButton>
                  <ActionButton
                    className={`cursor-pointer bg-gray-200 text-black border-gray-200 
            ${isUpdateStatusLoading ? '' : 'cursor-pointer'}`}
                    disabled={isUpdateStatusLoading}
                    onClick={() => setOpenCancelWorkModal(false)}
                  >
                    {isUpdateStatusLoading && (
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
  if (offer) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="flex-grow flex justify-center py-12 px-4">
          <div className="w-full max-w-6xl bg-white rounded-2xl shadow-md border border-gray-200 flex flex-col lg:flex-row overflow-hidden">
            {/* offer Info */}
            <div className="w-full lg:w-[40%] border-r border-gray-200 bg-gray-50 p-6 flex flex-col gap-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Post Detail
              </h2>

              <div className="flex flex-col gap-4 text-gray-700">
                <div className="font-medium text-lg">
                  <span>Post:</span>{' '}
                  <span
                    className="text-button-action hover:underline cursor-pointer"
                    onClick={() => {
                      navigate(`/post/${post._id}`);
                    }}
                  >
                    {post.title}
                  </span>
                </div>
                <div className="font-medium text-lg">
                  <span>Customer:</span>{' '}
                  <span
                    className="text-button-action hover:underline cursor-pointer"
                    onClick={() => {
                      navigate(`/user/${customer?._id}`);
                    }}
                  >
                    {customer?.name}
                  </span>
                </div>
                <div className="font-medium text-lg">
                  <span>Provider:</span>{' '}
                  <span
                    className="text-button-action hover:underline cursor-pointer"
                    onClick={() => {
                      navigate(`/user/${provider?._id}/provider`);
                    }}
                  >
                    {provider?.name}
                  </span>
                </div>
                <div className="font-medium text-lg">
                  <span>Date:</span> {formatDateToDisplay(offer.date)}
                </div>
                <div className="font-medium text-lg">
                  <span>Price:</span> ฿{offer.price}
                </div>
                <div>
                  <span className="font-medium text-lg">Status:</span>{' '}
                  <span className="px-3 py-1 bg-button-action text-white rounded-full text-sm font-medium">
                    {post.status}
                  </span>
                </div>
              </div>

              <Dialog open={openPayModal} onOpenChange={setOpenPayModal}>
                <DialogContent className="h-[85vh] bg-white">
                  <DialogDescription>
                    <PaymentIntent
                      postId={offer.postId}
                      providerConnectId={provider?.connectId || ''}
                    />
                  </DialogDescription>
                </DialogContent>
              </Dialog>

              <div className="flex gap-4 mt-6 items-center">
                {user._id === offer.customerId &&
                  (post.status === 'Not working' ? (
                    <ActionButton
                      buttonColor="red"
                      onClick={() => setOpenCancelWorkModal(true)}
                    >
                      Cancel
                    </ActionButton>
                  ) : post.status == 'Completed' ? (
                    // <ActionButton onClick={() => setOpenPayModal(true)}>Pay</ActionButton>
                    <PaymentButton
                      postId={offer.postId}
                      openModal={setOpenPayModal}
                    />
                  ) : (
                    <></>
                  ))}

                {user._id === offer.providerId &&
                  post.status != 'Completed' && (
                    <ActionButton
                      buttonColor="green"
                      onClick={() => setOpenUpdatePostStatusModal(true)}
                    >
                      Update Status
                    </ActionButton>
                  )}
                <ActionButton
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  Back
                </ActionButton>
              </div>
            </div>

            {/* Chat Section: Just the mock page */}
            {/* Chat Section */}
            <div className="w-full lg:w-[60%] flex flex-col h-full max-h-[80vh] bg-white rounded-tr-2xl overflow-hidden border-l border-gray-200">
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between ">
                <h3 className="text-xl font-semibold text-gray-800">
                  Chat Room
                </h3>
              </div>

              {/* Chat Content */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <Chatbox id={[receiverid || '', post._id]} />
              </div>
            </div>
          </div>

          {openUpdatePostStatusModal && (
            <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 shadow-lg min-w-[300px] text-center">
                <p className="mb-2 text-lg font-semibold">
                  ต้องการ Update Status เป็น{' '}
                  {post.status == 'Not working'
                    ? 'In progress'
                    : post.status == 'In progress'
                      ? 'Completed'
                      : undefined}{' '}
                  ใช่หรือไม่?
                </p>
                <p className="text-sm text-red-500 mb-4">
                  การอัปเดตสถานะจะเปลี่ยนสถานะของโพสต์นี้และไม่สามารถแก้ไขได้
                </p>
                <div className="flex justify-center gap-4">
                  <ActionButton
                    onClick={async () => {
                      setUpdateStatusLoading(true);
                      if (post.status == 'Not working') {
                        await updatePostStatus(post._id, 'In progress');
                      } else if (post.status == 'In progress') {
                        await updatePostStatus(post._id, 'Completed');
                      }
                      setUpdateStatusLoading(false);
                      setOpenUpdatePostStatusModal(false);
                      window.location.reload();
                    }}
                    className={`${isUpdateStatusLoading ? '' : 'cursor-pointer'}`}
                    disabled={isUpdateStatusLoading}
                  >
                    {isUpdateStatusLoading && (
                      <Loader className="animate-spin" size={24} />
                    )}
                    Yes
                  </ActionButton>
                  <ActionButton
                    className={`cursor-pointer bg-gray-200 text-black border-gray-200 
            ${isUpdateStatusLoading ? '' : 'cursor-pointer'}`}
                    disabled={isUpdateStatusLoading}
                    onClick={() => setOpenUpdatePostStatusModal(false)}
                  >
                    {isUpdateStatusLoading && (
                      <Loader className="animate-spin" size={24} />
                    )}
                    No
                  </ActionButton>
                </div>
              </div>
            </div>
          )}

          {openCancelWorkModal && (
            <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 shadow-lg min-w-[300px] text-center">
                <p className="mb-2 text-lg font-semibold">
                  ต้องการยกเลิกการให้บริการของผู้ให้บริการคนนี้ใช่หรือไม่?
                </p>
                <p className="mb-4 text-sm text-red-500">
                  การยกเลิกการให้บริการจะทำให้ผู้บริการไม่สามารถสมัครให้บริการนี้ได้อีก
                </p>
                <div className="flex justify-center gap-4">
                  <ActionButton
                    onClick={async () => {
                      setUpdateStatusLoading(true);
                      await updateOfferStatus(offer._id, 'Cancel');
                      await updatePostMatched(post._id, false);
                      setUpdateStatusLoading(false);
                      setOpenCancelWorkModal(false);
                      window.location.href = `/post/${post._id}`;
                    }}
                    className={`${isUpdateStatusLoading ? '' : 'cursor-pointer'}`}
                    disabled={isUpdateStatusLoading}
                  >
                    {isUpdateStatusLoading && (
                      <Loader className="animate-spin" size={24} />
                    )}
                    Yes
                  </ActionButton>
                  <ActionButton
                    className={`cursor-pointer bg-gray-200 text-black border-gray-200 
            ${isUpdateStatusLoading ? '' : 'cursor-pointer'}`}
                    disabled={isUpdateStatusLoading}
                    onClick={() => setOpenCancelWorkModal(false)}
                  >
                    {isUpdateStatusLoading && (
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
}
