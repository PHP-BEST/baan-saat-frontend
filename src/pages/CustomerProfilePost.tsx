import PostCard from '@/components/our-components/postCard';
import Header from '@/components/our-components/header';
import Footer from '@/components/our-components/footer';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ChevronLeft, Filter } from 'lucide-react';
import type { User } from '@/interfaces/User';
import {
  TAG_OPTIONS,
  type Post,
  type PostTag,
  type TagsOption,
} from '@/interfaces/Post';
import Loading from '@/components/our-components/loading';
import { getUserById } from '@/api/user';
import {
  filterPosts,
  getPostsByUserId,
  type FilterPostParams,
} from '@/api/post';
import { filterValidator } from '@/utils/filterValidator';
import ActionButton from '@/components/our-components/actionButton';
import UserNotFound from '@/error/UserNotFound';

export default function CustomerProfilePostPage() {
  const { userId } = useParams<{ userId: string }>();
  const [customerUser, setCustomerUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  // Filter states
  const [postTitle, setPostTitle] = useState<string | undefined>();
  const [tags, setTags] = useState<TagsOption[]>([]);
  const [other, setOther] = useState<string>('');
  const [otherSelected, setOtherSelected] = useState(false);
  const [minBudget, setMinBudget] = useState<number | undefined>();
  const [maxBudget, setMaxBudget] = useState<number | undefined>();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterError, setFilterError] = useState<string | undefined>();

  useEffect(() => {
    const getCustomerUser = async () => {
      setLoading(true);
      if (!userId) return;
      const user = await getUserById(userId);
      setCustomerUser(user);
      if (user) {
        const posts = await getPostsByUserId(userId);
        setFilteredPosts(posts);
      }
      setLoading(false);
    };
    getCustomerUser();
  }, [userId]);

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

  const handleFilterSearch = async () => {
    const validation = filterValidator(
      minBudget,
      maxBudget,
      startDate,
      endDate,
    );
    if (!validation.isValid) {
      setFilterError(validation.error);
      return;
    }
    setFilterError(undefined);
    setLoading(true);

    const postTags = tags.map((tag) => tag.value as PostTag);

    const params: FilterPostParams = {
      userId: userId,
      title: postTitle || undefined,
      tags:
        otherSelected && other.trim() !== ''
          ? [...postTags, 'others' as PostTag]
          : postTags,
      other: otherSelected ? other : '',
      minBudget,
      maxBudget,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };

    let posts = await filterPosts(params);
    posts = posts.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

    setFilteredPosts(posts);
    setShowFilter(false);
    setLoading(false);
  };

  const handleTagChange = (tag: TagsOption) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <>
      <Header />
      <div className="px-16 py-10 w-full min-h-screen flex flex-col gap-8 bg-white">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-button-action cursor-pointer font-bold text-lg"
        >
          <ChevronLeft size={24} />
          <p className="hover:underline">Back</p>
        </button>

        {/* Header */}
        <p className="text-3xl font-bold">Posts by {customerUser.name}</p>

        {/* Result Counter */}
        <div className="flex justify-between items-center w-full">
          <p className="text-lg font-medium">
            Posts Found: {filteredPosts.length}
          </p>
          <button
            className="flex items-center gap-1 text-button-action cursor-pointer"
            onClick={() => setShowFilter(!showFilter)}
          >
            <Filter size={18} />{' '}
            <p className="text-lg font-semibold hover:underline">Filter</p>
          </button>
        </div>

        {/* Filter Panel */}
        {showFilter && (
          <div className="w-full bg-white p-4 rounded-md shadow-md">
            <h3 className="text-lg font-semibold mb-2">Filter Posts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-medium text-black block mb-1">
                  Post Title
                </label>
                <input
                  type="text"
                  value={postTitle ?? ''}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className={`w-full border rounded-md p-2 mb-2 ${
                    filterError && filterError.toLowerCase().includes('title')
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="Post Title"
                />
                <label className="font-medium text-black block mb-1">
                  Tags
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {TAG_OPTIONS.filter((t) => t.value !== 'others').map(
                    (t: TagsOption) => (
                      <label key={t.value} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={tags.includes(t)}
                          onChange={() => handleTagChange(t)}
                        />
                        <span>{t.label}</span>
                      </label>
                    ),
                  )}

                  {/* Others option */}
                  <div className="col-span-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={otherSelected}
                        onChange={() => {
                          setOtherSelected((prev) => !prev);
                          if (otherSelected) {
                            setOther('');
                          }
                        }}
                      />
                      <span>อื่นๆ</span>
                    </label>

                    {otherSelected && (
                      <input
                        type="text"
                        value={other}
                        onChange={(e) => setOther(e.target.value)}
                        placeholder="Please specify..."
                        className="w-full mt-1 border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 transition"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="font-medium text-black block mb-1">
                  Price Range
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="number"
                    value={minBudget ?? ''}
                    onChange={(e) => {
                      e.preventDefault();
                      if (e.target.value) {
                        if (Number(e.target.value) >= 0) {
                          setMinBudget(Number(e.target.value));
                        }
                      }
                    }}
                    className={`w-1/2 border rounded-md p-2 ${
                      filterError &&
                      filterError.toLowerCase().includes('budget')
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder="Min Budget"
                    min={0}
                  />
                  <input
                    type="number"
                    value={maxBudget ?? ''}
                    onChange={(e) => {
                      e.preventDefault();
                      if (e.target.value) {
                        if (Number(e.target.value) >= 0) {
                          setMaxBudget(Number(e.target.value));
                        }
                      }
                    }}
                    className={`w-1/2 border rounded-md p-2 ${
                      filterError &&
                      filterError.toLowerCase().includes('budget')
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder="Max Budget"
                    min={0}
                  />
                </div>
                <label className="font-medium text-black block mb-1">
                  Date Range
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`w-1/2 border rounded-md p-2 ${
                      filterError && filterError.toLowerCase().includes('date')
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`w-1/2 border rounded-md p-2 ${
                      filterError && filterError.toLowerCase().includes('date')
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                </div>

                {filterError && (
                  <div className="text-red-500 text-sm mt-2">{filterError}</div>
                )}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <ActionButton
                buttonType="filled"
                className="cursor-pointer"
                onClick={handleFilterSearch}
              >
                Search
              </ActionButton>
            </div>
          </div>
        )}

        {/* Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-4 md:px-0">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post: Post) => (
              <PostCard key={post._id} post={post} size="L" />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 text-lg">
              No results match your search and filter criteria.
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
