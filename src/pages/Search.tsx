import { Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import Header from '@/components/our-components/header';
import Footer from '@/components/our-components/footer';
import { TAG_OPTIONS, type Post, type TagsOption } from '@/interfaces/Post';
import { useSearchParams } from 'react-router-dom';
import {
  filterPosts,
  getAllPosts,
  searchPosts,
  type FilterPostParams,
} from '@/api/post';
import PostCard from '@/components/our-components/postCard';
import Loading from '@/components/our-components/loading';
import ActionButton from '@/components/our-components/actionButton';
import { filterValidator } from '@/utils/filterValidator';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(false);
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
    const fetchInitialPosts = async () => {
      setLoading(true);
      const query = searchParams.get('query') || '';
      let posts = await searchPosts(query);
      if (posts.length === 0) {
        posts = await getAllPosts();
        posts = posts
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          )
          .slice(0, 10);
      } else {
        posts = posts.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );
      }
      setFilteredPosts(posts);
      setLoading(false);
    };

    fetchInitialPosts();
  }, [searchParams]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex flex-col items-center min-h-screen px-12 py-8 gap-6 bg-gray-50 ">
          <Loading />
        </main>
        <Footer />
      </>
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

    const params: FilterPostParams = {
      title: postTitle || undefined,
      tags: tags,
      other: other,
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
      <main className="flex flex-col items-center min-h-screen px-12 py-8 gap-6 bg-gray-50">
        {/* Title */}
        <div className="w-full max-w-6xl text-left mb-2">
          <h1 className="text-4xl text-black font-bold">
            Here&apos;s what we found...
          </h1>
        </div>

        {/* Result Counter */}
        <div className="flex justify-between items-center w-full max-w-6xl">
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
          <div className="w-full max-w-6xl bg-white p-4 rounded-md shadow-md">
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
                  {TAG_OPTIONS.map((tag) => (
                    <label key={tag.value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={tags.includes(tag)}
                        onChange={() => handleTagChange(tag)}
                      />
                      <span>{tag.label}</span>
                    </label>
                  ))}

                  {/* Others Option */}
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
                    value={minBudget}
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
                    value={maxBudget}
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

        {/* Filtered Post cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4 md:px-0">
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
      </main>
      <Footer />
    </>
  );
}
