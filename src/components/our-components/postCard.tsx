import type { Post } from '@/interfaces/Post';
import { Link } from 'react-router-dom';

interface PostCardProps {
  post: Post;
  size?: 'S' | 'M' | 'L';
}

const sizeMap = {
  S: { width: 200, height: 160, title: 'text-base', desc: 'text-xs' },
  M: { width: 300, height: 250, title: 'text-lg', desc: 'text-sm' },
  L: { width: 400, height: 340, title: 'text-xl', desc: 'text-base' },
};

export default function PostCard({ post, size = 'M' }: PostCardProps) {
  const cardWidth = sizeMap[size].width;
  const cardHeight = sizeMap[size].height;
  const titleClass = sizeMap[size].title;
  const descClass = sizeMap[size].desc;

  return (
    <Link to={`/post/${post._id}`}>
      <div
        className="w-full flex flex-col items-center bg-white border rounded-2xl shadow-sm m-0"
        style={{ maxWidth: `${cardWidth}px`, height: `${cardHeight}px` }}
      >
        {post.coverPhotoUrl ? (
          <img
            src={post.coverPhotoUrl}
            alt="Post Cover Image"
            className="w-full h-2/3 object-cover rounded-t-2xl"
          />
        ) : (
          <div className="w-full h-2/3 bg-post-blank-cover rounded-t-2xl" />
        )}
        <div className="w-full h-1/3 flex flex-col justify-start px-4 py-2">
          <h2
            className={`${titleClass} font-bold text-ellipsis overflow-hidden whitespace-nowrap mb-1`}
          >
            {post.title}
          </h2>
          <p
            className={`${descClass} text-gray-600 text-ellipsis overflow-hidden line-clamp-2`}
          >
            {post.description || 'No description provided.'}
          </p>
        </div>
      </div>
    </Link>
  );
}
