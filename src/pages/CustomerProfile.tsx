import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import Header from '@/components/our-components/header';
import Footer from '@/components/our-components/footer';
import { useEffect } from 'react';
import type { User } from '@/interfaces/User';
import { getUserById } from '@/api/user';
import Loading from '@/components/our-components/loading';
import type { Post } from '@/interfaces/Post';
import { getPostsByUserId } from '@/api/post';
import PostCard from '@/components/our-components/postCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import UserNotFound from '@/error/UserNotFound';
import { useUser } from '@/context/UserContext';

export default function CustomerProfilePage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { userId } = useParams<{ userId: string }>();
  const [customerUser, setCustomerUser] = useState<User | null>(null);
  const [customerPosts, setCustomerPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCustomerUser = async () => {
      setLoading(true);
      if (!userId) return;
      const customerUser = await getUserById(userId);
      setCustomerUser(customerUser);
      if (customerUser) {
        const posts = (await getPostsByUserId(userId)).sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );
        setCustomerPosts(posts);
      }
      setLoading(false);
    };
    getCustomerUser();
  }, [userId]);

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

  if (!customerUser) {
    return (
      <div>
        <Header />
        <div className="px-16 py-10 w-full min-h-screen flex flex-col gap-10 bg-white">
          <UserNotFound />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="px-16 py-10 w-full min-h-screen flex flex-col gap-10 bg-white">
        {/* Header */}
        <div className="flex gap-6 items-center">
          {customerUser && (
            <>
              <div
                className={`bg-background-profile rounded-full flex items-center justify-center overflow-hidden`}
                style={{ width: 52, height: 52 }}
              >
                {customerUser.avatarUrl ? (
                  <img
                    src={customerUser.avatarUrl}
                    alt="Avatar Image"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                {customerUser.name}’s Customer Profile
              </h1>
            </>
          )}
          <button
            className="flex gap-2 items-center text-button-action font-bold text-lg cursor-pointer ml-auto"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={32} />
            <p className="hover:underline">Back</p>
          </button>
        </div>

        {/* Content */}
        <div className="w-full h-fit border border-gray-400 rounded-3xl p-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-bold text-xl">Name</p>
              <p className="text-lg">
                {customerUser.name ? customerUser.name : 'Unknown'}
              </p>
            </div>
            <div className="flex flex-col text-lg gap-1">
              <p className="font-bold text-xl">Telephone</p>
              <p className="text-lg">
                {customerUser.telNumber ? customerUser.telNumber : '-'}
              </p>
            </div>
            <div className="flex flex-col text-lg gap-1">
              <p className="font-bold text-xl">Email</p>
              <p className="text-lg">
                {customerUser.email ? customerUser.email : '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex justify-between">
            <h2 className="font-bold text-2xl">
              {userId != user?._id && 'Available'} Posts by {customerUser.name}
            </h2>
            <button
              className="font-bold text-lg cursor-pointer text-button-action flex gap-1 items-center"
              onClick={() => navigate(`/user/${customerUser._id}/post`)}
            >
              <p className="hover:underline">View All</p>
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Some Posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userId == user?._id ? (
              customerPosts.length > 0 ? (
                customerPosts
                  .slice(0, 6)
                  .map((post) => (
                    <PostCard key={post._id} post={post} size="L" />
                  ))
              ) : (
                <p className="text-gray-500 text-xl font-medium">
                  You have no posts listed.
                </p>
              )
            ) : customerPosts.filter(
                (p) => p.isMatched == false && p.status != 'Deleted',
              ).length > 0 ? (
              customerPosts
                .filter((p) => p.isMatched == false && p.status != 'Deleted')
                .slice(0, 6)
                .map((post) => <PostCard key={post._id} post={post} size="L" />)
            ) : (
              <p className="text-gray-500 text-xl font-medium">
                This customer has no available posts listed.
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
