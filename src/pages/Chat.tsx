import { getDetailedApplyById } from '@/api/apply';
import { deletePost, updatePostStatus } from '@/api/post';
import ActionButton from '@/components/our-components/actionButton';
import Footer from '@/components/our-components/footer';
import Header from '@/components/our-components/header';
import Loading from '@/components/our-components/loading';
import { useUser } from '@/context/UserContext';
import ApplyNotFound from '@/error/ApplyNotFound';
import type { ApplyDetail } from '@/interfaces/Apply';
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
export default function ChatPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { applyId } = useParams();

  const [apply, setApply] = useState<ApplyDetail | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [customer, setCustomer] = useState<User | null>(null);
  const [provider, setProvider] = useState<User | null>(null);

  const [openUpdatePostStatusModal, setOpenUpdatePostStatusModal] =
    useState(false);
  const [openCancelApplyModal, setOpenCancelApplyModal] = useState(false);
  const [openPayModal, setOpenPayModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUpdateStatusLoading, setUpdateStatusLoading] = useState(false);

  useEffect(() => {
    const fetchApply = async () => {
      if (!applyId || !user) return;
      try {
        setLoading(true);
        const applyData = await getDetailedApplyById(applyId);
        if (!applyData) {
          return;
        }
        setApply(applyData);
        setPost(applyData.post);
        setCustomer(applyData.customer);
        setProvider(applyData.provider);
      } catch (err) {
        console.error('Error fetching apply:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApply();
  }, [applyId, user]);

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

  const getNextStatus = () => {
    if (post.status == 'Not working') {
      return 'In progress';
    } else if (post.status == 'In progress') {
      return 'Completed';
    } else {
      return 'null';
    }
  };
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
                    navigate(`/user/${provider?._id}`);
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
                    onClick={() => setOpenCancelApplyModal(true)}
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

              {user._id === apply.providerId && post.status != 'Completed' && (
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
          <div className="w-full lg:w-[60%] flex flex-col justify-between">
            <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">
                Chat Room: Mock Version
              </h3>
            </div>

            <div className="flex-grow overflow-y-auto px-6 py-4 bg-gray-50">
              <div className="flex flex-col gap-4">
                <div className="self-start bg-gray-200 text-gray-800 px-4 py-2 rounded-2xl max-w-sm">
                  Hi! I’ll arrive at 2 PM for the cleaning.
                </div>
                <div className="self-end bg-green-600 text-white px-4 py-2 rounded-2xl max-w-sm">
                  Sure! I’ll be home by then.
                </div>
                <div className="self-start bg-gray-200 text-gray-800 px-4 py-2 rounded-2xl max-w-sm">
                  Perfect, see you soon!
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-4 bg-white flex gap-3 items-center">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-grow px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-button-action"
              />
              <ActionButton buttonColor="green" onClick={() => {}}>
                Send
              </ActionButton>
            </div>
          </div>
        </div>

        {openUpdatePostStatusModal && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-lg min-w-[300px] text-center">
              <p className="mb-2 text-lg font-semibold">
                ต้องการ Update Status เป็น {getNextStatus()} ใช่หรือไม่?
              </p>
              <p className="text-sm text-red-500 mb-4">
                การอัปเดตสถานะจะเปลี่ยนสถานะของโพสต์นี้และไม่สามารถแก้ไขได้
              </p>
              <div className="flex justify-center gap-4">
                <ActionButton
                  onClick={async () => {
                    setUpdateStatusLoading(true);
                    await updatePostStatus(post._id);
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
                    setUpdateStatusLoading(true);
                    await deletePost(apply.postId);
                    setUpdateStatusLoading(false);
                    setOpenCancelApplyModal(false);
                    window.location.href = '/account/post';
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
                  onClick={() => setOpenCancelApplyModal(false)}
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
