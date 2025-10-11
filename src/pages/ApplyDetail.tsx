import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/our-components/header';
import Footer from '@/components/our-components/footer';
import type { Post } from '@/interfaces/Post';
import type { User } from '@/interfaces/User';
import type { Apply } from '@/interfaces/Apply';
import ActionButton from '@/components/our-components/actionButton';
import Loading from '@/components/our-components/loading';
import { convertTagsToLabels, formatDateToDisplay } from '@/utils/function';
import { Calendar, Phone } from 'lucide-react';
import { getApplyById } from '@/api/apply';
import { getPostById } from '@/api/post';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplyDetails = async () => {
      if (!applyId || !user) return;

      try {
        setLoading(true);

        // Fetch apply data
        const applyData = await getApplyById(applyId);
        if (!applyData) {
          return;
        }
        setApply(applyData);

        const postData = await getPostById(applyData.postId);
        if (!postData) {
          return;
        }
        setPost(postData);

        const customer = await getUserById(applyData.customerId);
        setCustomerUser(customer);
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

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
    };

    const statusLabels = {
      pending: 'Pending',
      accepted: 'Accepted',
      rejected: 'Rejected',
      completed: 'Completed',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${
          statusStyles[status as keyof typeof statusStyles] ||
          'bg-gray-100 text-gray-800'
        }`}
      >
        {statusLabels[status as keyof typeof statusLabels] || status}
      </span>
    );
  };

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

            {/* Post Provider Name */}
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
              <h1 className="text-3xl font-bold text-gray-900">Your Apply</h1>
              {getStatusBadge(apply.status)}
            </div>

            {/* Apply Date */}
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-lg font-medium text-gray-700">
                Date to Perform
              </h2>
              <div className="flex gap-2 items-center">
                <Calendar width={16} />
                <p className="text-lg text-gray-900">
                  {formatDateToDisplay(apply.date)}
                </p>
              </div>
            </div>

            {/* Apply Applied Price */}
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-lg font-medium text-gray-700">
                Applied Price
              </h2>
              <p className="text-lg text-gray-900">
                ฿ {apply.appliedPrice.toLocaleString()}
              </p>
            </div>

            {/* Apply Description */}
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-lg font-medium text-gray-700">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {apply.description || 'No description provided.'}
              </p>
            </div>

            {/* Submitted Date */}
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-lg font-medium text-gray-700">
                Submitted On
              </h2>
              <p className="text-lg text-gray-900">
                {formatDateToDisplay(apply.createdAt)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center mt-6 gap-4">
              <ActionButton
                buttonColor="blue"
                onClick={() => navigate(`/post/${post._id}`)}
                className="cursor-pointer"
              >
                View Post
              </ActionButton>
              <ActionButton
                onClick={() => navigate(-1)}
                className="cursor-pointer"
              >
                Back
              </ActionButton>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
