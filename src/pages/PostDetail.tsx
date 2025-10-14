import type { Post } from '@/interfaces/Post';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/our-components/header';
import Footer from '@/components/our-components/footer';
import ActionButton from '@/components/our-components/actionButton';
import { convertTagsToLabels, formatDateToDisplay } from '@/utils/function';
import { Calendar, Phone } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import Loading from '@/components/our-components/loading';
import { getPostById } from '@/api/post';
import type { User } from '@/interfaces/User';
import { getUserById } from '@/api/user';
import PostNotFound from '@/error/PostNotFound';
import { checkMyApply, getDetailedAppliesByPostId } from '@/api/apply';
import type { Apply, ApplyDetail } from '@/interfaces/Apply';

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

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow flex justify-center py-12 px-4">
        <div className="w-full max-w-2xl space-y-6">
          {/* Post Name */}
          <h1 title={post.title} className="text-3xl font-bold text-gray-900">
            {post.title}
          </h1>

          {/* Post Cover Image */}
          {post.coverPhotoUrl ? (
            <img
              src={post.coverPhotoUrl}
              alt={post.title}
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center"></div>
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
                                  : apply.status == 'Rejected'
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
                    navigate(`/user/${acceptedApply?.providerId}`);
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
          <div className="flex justify-end gap-4 my-8">
            {user && user?._id === post.customerId ? (
              <>
                {/* Customer View */}
                {!hasAcceptedApply ? (
                  <ActionButton
                    className="cursor-pointer"
                    onClick={() => {
                      navigate(`/post/${post._id}/edit`);
                    }}
                  >
                    Edit
                  </ActionButton>
                ) : (
                  <ActionButton
                    className="cursor-pointer"
                    onClick={() => {
                      navigate(`/chat/${acceptedApply?._id}`);
                    }}
                  >
                    Chat
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
                        onClick={() => {
                          navigate(`/apply/${post._id}/create`);
                        }}
                      >
                        Create Apply
                      </ActionButton>
                    )
                  ) : !hasAcceptedApply ? (
                    <ActionButton
                      className="cursor-pointer"
                      onClick={() => {
                        navigate(`/apply/${myApply._id}`);
                      }}
                    >
                      View Apply
                    </ActionButton>
                  ) : (
                    myApply._id == acceptedApply?._id && (
                      <ActionButton
                        className="cursor-pointer"
                        onClick={() => {
                          navigate(`/chat/${acceptedApply?._id}`);
                        }}
                      >
                        Chat
                      </ActionButton>
                    )
                  )}
                </>
              )
            )}
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
    </div>
  );
}
