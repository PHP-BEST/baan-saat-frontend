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
import { checkApply } from '@/api/apply';
import type { Apply } from '@/interfaces/Apply';

export default function PostDetailPage() {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const { user } = useUser();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [customerUser, setCustomerUser] = useState<User | null>(null);
  const [offer, setApply] = useState<Apply | null>(null);
  const [isPayPop, setIsPayPop] = useState(false);

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
          setApply(null);
        } else {
          const offer = await checkApply(post._id, user._id);
          setApply(offer);
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

          {/* Post Provider Name */}
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

          <div className="flex justify-end gap-4 my-8">
            {/* Edit Button */}
            {user?._id === post.customerId ? (
              <>
                <ActionButton
                  className="cursor-pointer"
                  onClick={() => {
                    navigate(`/post/${post._id}/edit`);
                  }}
                >
                  Edit
                </ActionButton>

                <ActionButton
                  className="cursor-pointer"
                  onClick={() => {
                    setIsPayPop(true);
                  }}
                >
                  Payments
                </ActionButton>

                {isPayPop && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                      <h2 className="text-2xl font-bold mb-4">Payments</h2>
                      <ActionButton onClick={() => setIsPayPop(false)}>
                        Close
                      </ActionButton>
                    </div>
                  </div>
                )}
              </>
            ) : (
              user &&
              (!offer ? (
                <ActionButton
                  className="cursor-pointer"
                  onClick={() => {
                    navigate(`/offer/${post._id}/create`);
                  }}
                >
                  Create
                </ActionButton>
              ) : (
                <ActionButton
                  className="cursor-pointer"
                  onClick={() => {
                    navigate(`/offer/${offer._id}/edit`);
                  }}
                >
                  Edit Apply
                </ActionButton>
              ))
            )}
            {/* Back Button */}
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
