import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/our-components/header';
import Footer from '@/components/our-components/footer';
import type { Post } from '@/interfaces/Post';
import type { User } from '@/interfaces/User';
import type { Offer, OfferedStatus } from '@/interfaces/Offer';
import ActionButton from '@/components/our-components/actionButton';
import Loading from '@/components/our-components/loading';
import {
  acceptOffer,
  convertTagsToLabels,
  formatDateToDisplay,
  rejectOffer,
  rejectApply,
  takenOffer,
} from '@/utils/function';
import { Calendar, Loader, Phone } from 'lucide-react';
import { getPostById, updatePostMatched } from '@/api/post';
import { getUserById } from '@/api/user';
import { useUser } from '@/context/UserContext';
import PostNotFound from '@/error/PostNotFound';
import OfferNotFound from '@/error/OfferNotFound';
import { createIntentClientSecret } from '@/api/payment';
import { getDetailedAppliesByPostId } from '@/api/apply';
import {
  getOfferById,
  getDetailedOfferedByPostId,
  updateOfferStatus,
} from '@/api/offer';

export default function OfferDetailPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { offerId } = useParams();

  const [offer, setOffer] = useState<Offer | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [customerUser, setCustomerUser] = useState<User | null>(null);
  const [providerUser, setProviderUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isStatusOfferLoading, setStatusOfferLoading] = useState(false);
  const [offerAction, setOfferAction] = useState<OfferedStatus>('Pending');
  const [openCancelOfferModal, setOpenCancelOfferModal] = useState(false);
  const [openAcceptOfferModal, setOpenAcceptOfferModal] = useState(false);
  const [openRejectOfferModal, setOpenRejectOfferModal] = useState(false);

  useEffect(() => {
    const fetchOffer = async () => {
      if (!offerId || !user) return;

      try {
        setLoading(true);
        const offerData = await getOfferById(offerId);
        if (!offerData) {
          return;
        }
        setOffer(offerData);
        setOfferAction(offerData.status);
        const postData = await getPostById(offerData.postId);
        if (!postData) {
          return;
        }
        setPost(postData);

        const customer = await getUserById(offerData.customerId);
        setCustomerUser(customer);
        const provider = await getUserById(offerData.providerId);
        setProviderUser(provider);
      } catch (err) {
        console.error('Error fetching offer details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffer();
  }, [offerId, user]);
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

  if (!offer) {
    return (
      <div>
        <Header />
        <div className="w-full min-h-screen h-fit px-12 py-8 bg-gray-50">
          <OfferNotFound />
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
            <h1
              title={post.title}
              className="text-3xl font-bold text-gray-900 cursor-pointer hover:text-gray-500 active:text-gray-300"
              onClick={() => navigate(`/post/${post._id}`)}
            >
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
              <p
                className="text-lg font-semibold text-button-action hover:underline cursor-pointer"
                onClick={() => {
                  navigate(`/user/${customerUser?._id}`);
                }}
              >
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

          {/* Offer Section */}
          <div className="flex flex-col gap-4">
            {/* Offer Title with Status */}
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                {user._id == offer.customerId ? `Offered To` : 'My Offer'}
              </h1>
              <p
                className={`${
                  offerAction == 'Accepted'
                    ? 'border rounded-full border-accept bg-accept'
                    : offerAction == 'Rejected' || offerAction == 'Deleted'
                      ? 'border-reject bg-reject'
                      : 'border-black bg-black'
                } border rounded-full text-xl font-semibold text-white px-3 py-1`}
              >
                {offerAction}
              </p>
            </div>

            {/* Offer Provider Name */}
            {user._id != providerUser?._id && (
              <div className="w-full flex flex-col gap-2">
                <h2 className="text-2xl font-semibold">Name</h2>
                <p
                  className="text-lg font-semibold text-button-action hover:underline cursor-pointer"
                  onClick={() => {
                    navigate(`/user/${providerUser?._id}/provider`);
                  }}
                >
                  {providerUser ? providerUser.name : 'Unknown'}
                </p>
              </div>
            )}

            {/* Offer Date */}
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">Date to Perform</h2>
              <div className="flex gap-2 items-center">
                <Calendar width={16} />
                <p className="text-lg text-gray-900">
                  {formatDateToDisplay(post.date)}
                </p>
              </div>
            </div>

            {/* Offer Price */}
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">Price</h2>
              <p className="text-lg text-gray-900">
                ฿ {offer.price.toLocaleString()}
              </p>
            </div>

            {/* Submitted Date */}
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">Submitted On</h2>
              <p className="text-lg text-gray-900">
                {formatDateToDisplay(offer.createdAt)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center mt-6 gap-4">
              {user._id !== offer.customerId ? (
                offer.status == 'Pending' ? (
                  <>
                    <ActionButton
                      buttonColor="green"
                      onClick={() => {
                        setOpenAcceptOfferModal(true);
                      }}
                      className="cursor-pointer"
                    >
                      Accept
                    </ActionButton>
                    <ActionButton
                      buttonColor="red"
                      onClick={() => {
                        setOpenRejectOfferModal(true);
                      }}
                      className={`${isStatusOfferLoading ? '' : 'cursor-pointer'}`}
                      disabled={isStatusOfferLoading}
                    >
                      {isStatusOfferLoading && (
                        <Loader className="animate-spin" size={24} />
                      )}
                      Reject
                    </ActionButton>
                  </>
                ) : offer.status == 'Accepted' ? (
                  <ActionButton
                    buttonColor="blue"
                    onClick={() => navigate(`/chat/${offerId}/`)}
                    className="cursor-pointer"
                  >
                    Chat
                  </ActionButton>
                ) : (
                  <></>
                )
              ) : offer.status == 'Pending' || offer.status == 'Accepted' ? (
                <ActionButton
                  buttonColor="red"
                  onClick={() => {
                    setOpenCancelOfferModal(true);
                  }}
                  disabled={isStatusOfferLoading}
                >
                  {isStatusOfferLoading && (
                    <Loader className="animate-spin" size={24} />
                  )}
                  Cancel
                </ActionButton>
              ) : (
                <></>
              )}

              <ActionButton
                onClick={() => {
                  navigate(-1);
                }}
                className={`${isStatusOfferLoading ? '' : 'cursor-pointer'}`}
                disabled={isStatusOfferLoading}
              >
                {isStatusOfferLoading && (
                  <Loader className="animate-spin" size={24} />
                )}
                Back
              </ActionButton>
            </div>
          </div>
        </div>

        {openAcceptOfferModal && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-lg min-w-[300px] text-center">
              <p className="mb-2 text-lg font-semibold">
                ต้องการ Accept Offer ใช่หรือไม่?
              </p>
              <p className="text-sm text-red-500 mb-4">
                เมื่อกดยืนยัน ระบบจะทำการอนุมัติข้อเสนอนี้ ไม่สามารถย้อนกลับได้
              </p>
              <div className="flex justify-center gap-4">
                <ActionButton
                  onClick={async () => {
                    setStatusOfferLoading(true);
                    setOfferAction('Accepted');
                    await acceptOffer(offer._id);
                    await updatePostMatched(post._id, true);
                    const otherApplies = await getDetailedAppliesByPostId(
                      offer.postId,
                    );
                    const rejectAppliesPromises = otherApplies
                      .filter((a) => a.status !== 'Rejected')
                      .map((a) => rejectApply(a._id));
                    const otherOffers = await getDetailedOfferedByPostId(
                      offer.postId,
                    );
                    const takenOfferPromises = otherOffers
                      .filter(
                        (o) =>
                          o._id !== offer._id &&
                          o.status !== 'Cancel' &&
                          o.status !== 'Taken' &&
                          o.status != 'Rejected',
                      )
                      .map((o) => takenOffer(o._id));
                    await Promise.all([
                      ...rejectAppliesPromises,
                      ...takenOfferPromises,
                    ]);
                    setStatusOfferLoading(false);
                    setOpenAcceptOfferModal(false);
                    try {
                      const clientSecret = await createIntentClientSecret(
                        offer.postId,
                        offer.providerId,
                        offer.price * 100,
                      );

                      if (!clientSecret) {
                        console.error('Failed to create payment intent');
                        // Optionally show an error message to user
                      } else {
                        console.log(
                          'Payment intent created successfully:',
                          clientSecret,
                        );
                      }
                    } catch (error) {
                      console.error('Error in accept offer process:', error);
                    }
                    window.location.reload();
                  }}
                  className={`${isStatusOfferLoading ? '' : 'cursor-pointer'}`}
                  disabled={isStatusOfferLoading}
                >
                  {isStatusOfferLoading && (
                    <Loader className="animate-spin" size={24} />
                  )}
                  Yes
                </ActionButton>
                <ActionButton
                  onClick={() => setOpenAcceptOfferModal(false)}
                  className={`cursor-pointer bg-gray-200 text-black border-gray-200 
            ${isStatusOfferLoading ? '' : 'cursor-pointer'}`}
                  disabled={isStatusOfferLoading}
                >
                  {isStatusOfferLoading && (
                    <Loader className="animate-spin" size={24} />
                  )}
                  No
                </ActionButton>
              </div>
            </div>
          </div>
        )}

        {openRejectOfferModal && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-lg min-w-[300px] text-center">
              <p className="mb-2 text-lg font-semibold">
                ต้องการ Reject Offer ใช่หรือไม่?
              </p>
              <p className="text-sm text-red-500 mb-4">
                เมื่อกดยืนยัน ข้อเสนอนี้จะถูกปฏิเสธ และไม่สามารถกู้คืนได้
              </p>
              <div className="flex justify-center gap-4">
                <ActionButton
                  onClick={async () => {
                    setStatusOfferLoading(true);
                    setOfferAction('Rejected');
                    await rejectOffer(offer._id);
                    setStatusOfferLoading(false);
                    setOpenRejectOfferModal(false);
                    window.location.reload();
                  }}
                  className={`${isStatusOfferLoading ? '' : 'cursor-pointer'}`}
                  disabled={isStatusOfferLoading}
                >
                  {isStatusOfferLoading && (
                    <Loader className="animate-spin" size={24} />
                  )}
                  Yes
                </ActionButton>
                <ActionButton
                  className={`cursor-pointer bg-gray-200 text-black border-gray-200 
            ${isStatusOfferLoading ? '' : 'cursor-pointer'}`}
                  disabled={isStatusOfferLoading}
                  onClick={() => setOpenRejectOfferModal(false)}
                >
                  {isStatusOfferLoading && (
                    <Loader className="animate-spin" size={24} />
                  )}
                  No
                </ActionButton>
              </div>
            </div>
          </div>
        )}

        {openCancelOfferModal && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-lg min-w-[300px] text-center">
              <p className="mb-2 text-lg font-semibold">
                ต้องการ Cancel การเสนอให้ผู้ให้บริการคนนี้ใช่หรือไม่?
              </p>
              <p className="mb-4 text-sm text-red-500">
                การ Cancel จะทำให้ไม่สามารถเสนองาน post นี้ให้ผู้ให้บริการได้อีก
              </p>
              <div className="flex justify-center gap-4">
                <ActionButton
                  onClick={async () => {
                    setStatusOfferLoading(true);
                    await updateOfferStatus(offer._id, 'Cancel');
                    setStatusOfferLoading(false);
                    setOpenCancelOfferModal(false);
                    window.location.href = `/post/${post._id}`;
                  }}
                  className={`${isStatusOfferLoading ? '' : 'cursor-pointer'}`}
                  disabled={isStatusOfferLoading}
                >
                  {isStatusOfferLoading && (
                    <Loader className="animate-spin" size={24} />
                  )}
                  Yes
                </ActionButton>
                <ActionButton
                  className={`cursor-pointer bg-gray-200 text-black border-gray-200 
            ${isStatusOfferLoading ? '' : 'cursor-pointer'}`}
                  disabled={isStatusOfferLoading}
                  onClick={() => setOpenCancelOfferModal(false)}
                >
                  {isStatusOfferLoading && (
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
