import { getUserPosts } from '@/api/post';
import ActionButton from '@/components/our-components/actionButton';
import Loading from '@/components/our-components/loading';
import PostCard from '@/components/our-components/postCard';
import { useUser } from '@/context/UserContext';
import type { Post } from '@/interfaces/Post';
import { useEffect, useState } from 'react';

export default function MyPostPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  const { user } = useUser();
  if (!user) return;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserPosts = async () => {
      setLoading(true);
      const userPosts = await getUserPosts(user._id);
      setPosts(userPosts);
      setLoading(false);
    };

    fetchUserPosts();
  }, []);

  if (loading) {
    return (
      <>
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-2">My Posts</h1>
          <ActionButton
            className="cursor-pointer -translate-y-2"
            onClick={() => {
              window.location.href = '/post/create';
            }}
          >
            Create
          </ActionButton>
        </div>

        {/* Loading Text */}
        <div className="w-full h-full flex flex-col items-center bg-white border border-border-sidebar rounded-2xl px-8 pb-4 pt-8 shadow-sm m-0">
          <Loading />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-2">My Posts</h1>
        <ActionButton
          className="cursor-pointer -translate-y-2"
          onClick={() => {
            window.location.href = '/post/create';
          }}
        >
          Create
        </ActionButton>
      </div>

      {/* Content */}
      <div className="w-full h-full flex flex-col items-center bg-white border border-border-sidebar rounded-2xl px-8 pb-4 pt-8 shadow-sm m-0">
        {posts.length > 0 ? (
          <div className="w-full h-full max-h-screen overflow-auto grid grid-cols-3 gap-4">
            {posts.map((post: Post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="w-full h-full max-h-screen">
            <p className="text-xl text-center font-semibold">
              You haven&apos;t created any posts yet...
            </p>
          </div>
        )}
      </div>
    </>
  );
}
