import type { Post } from '@/interfaces/Post';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/our-components/header';
import Footer from '@/components/our-components/footer';
import ActionButton from '@/components/our-components/actionButton';
import {
  convertTagsToLabels,
  deleteApply,
  formatDateToDisplay,
} from '@/utils/function';
import { Calendar, Loader, Phone } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import Loading from '@/components/our-components/loading';
import { getPostById, updatePostMatched, updatePostStatus } from '@/api/post';
import type { User } from '@/interfaces/User';
import { getUserById } from '@/api/user';
import PostNotFound from '@/error/PostNotFound';
import {
  checkMyApply,
  getAppliesByPostId,
  getDetailedAppliesByPostId,
} from '@/api/apply';
import type { Apply, ApplyDetail } from '@/interfaces/Apply';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function PostDetailPage() {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const { user } = useUser();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [customerUser, setCustomerUser] = useState<User | null>(null);
  const [myApply, setMyApply] = useState<Apply | null>(null);
  const [providerApplies, setProviderApplies] = useState<ApplyDetail[]>([]);
  const [acceptedApply, setAcceptedApply] = useState<ApplyDetail | null>();
  const [hasAcceptedApply, setHasAcceptedApply] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const [isStatusPostLoading, setStatusPostLoading] = useState(false);
  const [openDeletePostModal, setOpenDeletePostModal] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      if (!postId) return;
      const post = await getPostById(postId);
      setPost(post);
      if (post) {
        const currentCustomerUser = await getUserById(post.customerId);
        setCustomerUser(currentCustomerUser);
        if (!user) {
          setMyApply(null);
        } else {
          const currentMyApply = await checkMyApply(post._id, user._id);
          setMyApply(currentMyApply);
        }
        const currentApplies = await getDetailedAppliesByPostId(post._id);
        setProviderApplies(currentApplies);
        const acceptedApplies = currentApplies.filter(
          (apply: ApplyDetail) => apply.status == 'Accepted',
        );
        setHasAcceptedApply(acceptedApplies.length != 0);
        if (acceptedApplies.length != 0) {
          setAcceptedApply(acceptedApplies[0]);
        } else {
          setAcceptedApply(null);
        }
      }
      setLoading(false);
    };

    fetchPost();
  }, [postId]);

  useEffect(() => {
    if (openIdx !== null) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [openIdx]);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="w-full min-h-screen h-fit px-12 py-8 bg-gray-50">
          <Loading />
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

  const supportingImages = [
    post.image1Url,
    post.image2Url,
    post.image3Url,
  ].filter(
    (u): u is string => !!u && u.trim() !== '' && u !== post.coverPhotoUrl,
  );

  const hasCover =
    typeof post.coverPhotoUrl === 'string' && post.coverPhotoUrl.trim() !== '';

  const galleryImages = (
    hasCover
      ? [post.coverPhotoUrl!, ...supportingImages]
      : [...supportingImages]
  )
    .filter((u): u is string => !!u && u.trim() !== '')
    .filter((u, i, arr) => arr.indexOf(u) === i);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow flex justify-center py-12 px-4">
        <div className="w-full max-w-2xl space-y-6">
          {/* Post Name */}
          <h1 title={post.title} className="text-3xl font-bold text-gray-900">
            {post.title}
            {post.status == 'Deleted' && (
              <span className="ml-4 px-3 py-1 rounded-full bg-red-500 text-xl text-white">
                Deleted
              </span>
            )}
          </h1>

          {/* Cover Photo */}
          <div className="relative">
            {post.coverPhotoUrl ? (
              <button
                type="button"
                onClick={() => setOpenIdx(0)}
                className="block w-full rounded-2xl overflow-hidden focus:outline-none hover:opacity-85"
                aria-label="View Cover Photo"
                title="View Cover Photo"
              >
                <img
                  src={post.coverPhotoUrl}
                  alt={post.title}
                  className="w-full h-64 object-cover cursor-pointer"
                />
              </button>
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-2xl" />
            )}
          </div>

          {/* Supporting Photos */}
          {supportingImages.length > 0 && (
            <section className="mt-3" id="supporting-photos">
              <ul className="flex flex-wrap gap-2 md:gap-3">
                {supportingImages.map((src, i) => (
                  <li key={src}>
                    <button
                      type="button"
                      className="block overflow-hidden rounded-lg border border-gray-200 hover:opacity-85"
                      onClick={() => setOpenIdx(hasCover ? i + 1 : i)}
                      title="View photo"
                    >
                      <div className="w-28 h-20 md:w-36 md:h-28 bg-gray-100 cursor-pointer">
                        <img
                          src={src}
                          alt={`${post.title} — supporting photo`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (
                              e.currentTarget as HTMLImageElement
                            ).style.visibility = 'hidden';
                          }}
                        />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
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
            <p className="text-lg text-gray-700">฿ {post.budget}</p>
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

          {/* Application from Providers */}
          {user?._id === post.customerId ? (
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">Applies</h2>
              {providerApplies && providerApplies.length > 0 ? (
                <table className="table-fixed w-full border-collapse border border-gray-200 max-h-[20vh] overflow-auto">
                  <thead className="sticky top-0 bg-table-row-header">
                    <tr>
                      <th className="border border-gray-200 p-2 w-1/5">Name</th>
                      <th className="border border-gray-200 p-2 w-1/5">
                        Price (THB)
                      </th>
                      <th className="border border-gray-200 p-2 w-1/5">Date</th>
                      <th className="border border-gray-200 p-2 w-2/5">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {providerApplies.map((apply: ApplyDetail, idx) => {
                      return (
                        <tr
                          key={`provider-apply-${idx}`}
                          className={`bg-table-row-content cursor-pointer hover:bg-gray-100 text-center`}
                          onClick={() => {
                            navigate(`/apply/${apply._id}`);
                          }}
                        >
                          <td className="border border-gray-200 p-2 text-center text-ellipsis overflow-hidden whitespace-nowrap">
                            {apply.provider.name}
                          </td>
                          <td className="border border-gray-200 p-2 text-center text-ellipsis overflow-hidden whitespace-nowrap">
                            {apply.appliedPrice}
                          </td>
                          <td className="border border-gray-200 p-2 text-center text-ellipsis overflow-hidden whitespace-nowrap">
                            {formatDateToDisplay(apply.date)}
                          </td>
                          <td
                            className={`border border-gray-200 p-2 text-center text-ellipsis overflow-hidden whitespace-nowrap 
                              ${
                                apply.status == 'Accepted'
                                  ? 'text-accept'
                                  : apply.status == 'Rejected' ||
                                      apply.status == 'Deleted'
                                    ? 'text-reject'
                                    : 'text-black'
                              }`}
                          >
                            {apply.status}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p className="text-lg text-gray-700">
                  No providers apply this post...
                </p>
              )}
            </div>
          ) : (
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">Provider</h2>
              {hasAcceptedApply ? (
                <p
                  className="text-lg font-semibold text-button-action hover:underline cursor-pointer"
                  onClick={() => {
                    navigate(`/user/${acceptedApply?.providerId}/provider`);
                  }}
                >
                  {acceptedApply ? acceptedApply.provider.name : 'Unknown'}
                </p>
              ) : (
                <p className="text-lg text-gray-700">
                  No providers match this post...
                </p>
              )}
            </div>
          )}

          {/* Buttons */}
          {openIdx !== null &&
            createPortal(
              <div
                role="dialog"
                aria-modal="true"
                className="fixed inset-0 z-[1000] bg-black/80 flex items-center justify-center"
                onClick={() => setOpenIdx(null)}
              >
                <div
                  className="relative max-h-[65vh] max-w-[65vw]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={galleryImages[openIdx]}
                    alt={`${post.title} — supporting photo`}
                    className="block max-w-[65vw] max-h-[65vh] rounded-lg shadow-xl"
                  />
                  <button
                    aria-label="Close"
                    className="absolute -top-3 -right-3 grid place-items-center w-9 h-9 rounded-full bg-white text-black shadow-lg"
                    onClick={() => setOpenIdx(null)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>,
              document.body,
            )}

          <div className="flex justify-end gap-4 my-8">
            {post.status !== 'Deleted' &&
              (user && user._id === post.customerId ? (
                <>
                  {/* Customer View */}
                  {!hasAcceptedApply ? (
                    <ActionButton
                      className="cursor-pointer"
                      onClick={() => navigate(`/post/${post._id}/edit`)}
                    >
                      Edit
                    </ActionButton>
                  ) : (
                    <ActionButton
                      className="cursor-pointer"
                      onClick={() => navigate(`/chat/${acceptedApply?._id}`)}
                    >
                      Chat
                    </ActionButton>
                  )}

                  {post.status == 'Not working' && (
                    <ActionButton
                      className="cursor-pointer"
                      onClick={() => setOpenDeletePostModal(true)}
                    >
                      Delete
                    </ActionButton>
                  )}
                </>
              ) : (
                user && (
                  <>
                    {/* Provider View */}
                    {!myApply ? (
                      !hasAcceptedApply && (
                        <ActionButton
                          className="cursor-pointer"
                          onClick={() => navigate(`/apply/${post._id}/create`)}
                        >
                          Create Apply
                        </ActionButton>
                      )
                    ) : !hasAcceptedApply ? (
                      <ActionButton
                        className="cursor-pointer"
                        onClick={() => navigate(`/apply/${myApply._id}`)}
                      >
                        View Apply
                      </ActionButton>
                    ) : (
                      myApply._id === acceptedApply?._id && (
                        <ActionButton
                          className="cursor-pointer"
                          onClick={() =>
                            navigate(`/chat/${acceptedApply?._id}`)
                          }
                        >
                          Chat
                        </ActionButton>
                      )
                    )}
                  </>
                )
              ))}

            <ActionButton
              buttonColor="red"
              className="cursor-pointer"
              onClick={() => {
                navigate(-1);
              }}
            >
              Back
            </ActionButton>
          </div>
        </div>
      </main>
      <Footer />

      {openDeletePostModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg min-w-[300px] text-center">
            <p className="mb-2 text-lg font-semibold">
              ต้องการลบโพสต์นี้ใช่หรือไม่?
            </p>
            <p className="text-sm text-red-500 mb-4">
              การลบโพสต์นี้จะเป็นการยกเลิกการสมัครของผู้ให้บริการทั้งหมด
              และไม่สามารถกู้คืนได้
            </p>
            <div className="flex justify-center gap-4">
              <ActionButton
                onClick={async () => {
                  setStatusPostLoading(true);
                  await updatePostStatus(post._id, 'Deleted');
                  await updatePostMatched(post._id, false);
                  const allApplies = await getAppliesByPostId(post._id);
                  const rejectPromises = allApplies.map((a) =>
                    deleteApply(a._id),
                  );
                  await Promise.all(rejectPromises);
                  setStatusPostLoading(false);
                  setOpenDeletePostModal(false);
                  window.location.href = `/post/${post._id}`;
                }}
                className={`${isStatusPostLoading ? '' : 'cursor-pointer'}`}
                disabled={isStatusPostLoading}
              >
                {isStatusPostLoading && (
                  <Loader className="animate-spin" size={24} />
                )}
                Yes
              </ActionButton>
              <ActionButton
                className={`cursor-pointer bg-gray-200 text-black border-gray-200 
            ${isStatusPostLoading ? '' : 'cursor-pointer'}`}
                disabled={isStatusPostLoading}
                onClick={() => setOpenDeletePostModal(false)}
              >
                {isStatusPostLoading && (
                  <Loader className="animate-spin" size={24} />
                )}
                No
              </ActionButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
