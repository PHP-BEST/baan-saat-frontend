import { Filter, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import Header from '@/components/our-components/header';
import Footer from '@/components/our-components/footer';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { searchProviders } from '@/api/user';
import type { User } from '@/interfaces/User';
import {
  TAG_OPTIONS,
  type Post,
  type PostTag,
  type TagsOption,
} from '@/interfaces/Post';
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
  const [filteredProviders, setFilteredProviders] = useState<User[]>([]);

  // Tabs
  const [activeTab, setActiveTab] = useState<'Provider' | 'Post'>('Post');

  // Filter states
  const [postTitle, setPostTitle] = useState('');
  const [tags, setTags] = useState<TagsOption[]>([]);
  const [other, setOther] = useState('');
  const [otherSelected, setOtherSelected] = useState(false);
  const [minBudget, setMinBudget] = useState(''); // now string
  const [maxBudget, setMaxBudget] = useState(''); // now string
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterError, setFilterError] = useState<string | undefined>();

  // Search box
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get('query') || '');

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  useEffect(() => {
    setQuery(searchParams.get('query') || '');
  }, [searchParams]);

  // Reset filters when switching away from Post tab
  useEffect(() => {
    if (activeTab !== 'Post') {
      // clear post-related states
      setShowFilter(false);
      setPostTitle('');
      setTags([]);
      setOther('');
      setOtherSelected(false);
      setMinBudget('');
      setMaxBudget('');
      setStartDate('');
      setEndDate('');
      setFilterError(undefined);
      setFilteredPosts([]);
    }
  }, [activeTab]);

  // Fetch initial data when tab or query changes
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      const query = searchParams.get('query') || '';

      if (activeTab === 'Post') {
        let posts = await searchPosts(query);
        if (posts.length === 0) {
          posts = await getAllPosts();
          posts = posts
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime(),
            )
            .slice(0, 10);
        } else {
          posts = posts.sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          );
        }
        setFilteredPosts(posts);
      }

      if (activeTab === 'Provider') {
        let providers = await searchProviders(query);
        if (providers.length === 0) {
          providers = await searchProviders('');
        }
        setFilteredProviders(providers.slice(0, 10));
      }

      setLoading(false);
    };

    fetchInitialData();
  }, [searchParams, activeTab]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex flex-col items-center min-h-screen px-12 py-8 gap-6 bg-gray-50">
          <Loading />
        </main>
        <Footer />
      </>
    );
  }

  // Handle filter logic for posts
  const handleFilterSearch = async () => {
    const minBudgetNum = minBudget ? Number(minBudget) : undefined;
    const maxBudgetNum = maxBudget ? Number(maxBudget) : undefined;

    const validation = filterValidator(
      minBudgetNum,
      maxBudgetNum,
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
      title: postTitle || undefined,
      tags:
        otherSelected && other.trim() !== ''
          ? [...postTags, 'others' as PostTag]
          : postTags,
      other: otherSelected ? other : '',
      minBudget: minBudgetNum,
      maxBudget: maxBudgetNum,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };

    console.log('Filter params:', params);

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
      <Header isHideSearchBar={true} />
      <main className="flex flex-col items-center min-h-screen px-6 py-8 gap-6 bg-gray-50">
        {/* Title */}
        <div className="w-full max-w-6xl text-center mb-4">
          <h1 className="text-3xl text-black font-bold">{activeTab} Board</h1>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-6">
          <button
            onClick={() => setActiveTab('Provider')}
            className={`text-lg font-semibold pb-1 border-b-4 ${
              activeTab === 'Provider'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500'
            }`}
          >
            Providers
          </button>
          <button
            onClick={() => setActiveTab('Post')}
            className={`text-lg font-semibold pb-1 border-b-4 ${
              activeTab === 'Post'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500'
            }`}
          >
            Posts
          </button>
        </div>

        {/* Search Box */}
        <div className="flex justify-center items-center w-full">
          <div
            className="bg-white w-full max-w-[400px] h-[40px] flex items-center gap-2 shadow-sm px-3 rounded-md"
            id="Searchbar-header"
          >
            <Search
              width={22}
              height={22}
              className="cursor-pointer text-gray-600"
              onClick={handleSearch}
            />
            <input
              type="text"
              placeholder="Search..."
              value={query}
              className="w-full text-sm text-gray-800 focus:outline-none"
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </div>

        {/* POSTS TAB */}
        {activeTab === 'Post' && (
          <>
            <div className="flex justify-between items-center w-full max-w-6xl mt-4">
              <p className="text-lg font-medium">
                Posts Found: {filteredPosts.length}
              </p>
              <button
                className="flex items-center gap-1 text-button-action cursor-pointer"
                onClick={() => setShowFilter(!showFilter)}
              >
                <Filter size={18} />
                <p className="text-lg font-semibold hover:underline">Filter</p>
              </button>
            </div>

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
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      className="w-full border rounded-md p-2 mb-2 border-gray-300"
                      placeholder="Post Title"
                    />
                    <label className="font-medium text-black block mb-1">
                      Tags
                    </label>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {TAG_OPTIONS.map((tag) => (
                        <label
                          key={tag.value}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            checked={tags.includes(tag)}
                            onChange={() => handleTagChange(tag)}
                          />
                          <span>{tag.label}</span>
                        </label>
                      ))}

                      <div className="col-span-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={otherSelected}
                            onChange={() => {
                              setOtherSelected((prev) => !prev);
                              if (otherSelected) setOther('');
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
                            className="w-full mt-1 border-b border-gray-300 focus:outline-none focus:border-blue-500"
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
                        onChange={(e) => setMinBudget(e.target.value)}
                        className="w-1/2 border rounded-md p-2 border-gray-300"
                        placeholder="Min"
                        min={0}
                      />
                      <input
                        type="number"
                        value={maxBudget}
                        onChange={(e) => setMaxBudget(e.target.value)}
                        className="w-1/2 border rounded-md p-2 border-gray-300"
                        placeholder="Max"
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
                        className="w-1/2 border rounded-md p-2 border-gray-300"
                      />
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-1/2 border rounded-md p-2 border-gray-300"
                      />
                    </div>
                    {filterError && (
                      <div className="text-red-500 text-sm mt-2">
                        {filterError}
                      </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4 md:px-0">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <PostCard key={post._id} post={post} size="L" />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500 text-lg">
                  No results match your search and filter criteria.
                </p>
              )}
            </div>
          </>
        )}

        {/* PROVIDERS */}
        {activeTab === 'Provider' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4 md:px-0 mt-4">
            {filteredProviders.length > 0 ? (
              filteredProviders.map((provider) => (
                <div
                  key={provider._id}
                  onClick={() => navigate(`/user/${provider._id}`)}
                  className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center text-center hover:shadow-lg transition"
                >
                  <img
                    src={provider.avatarUrl || '/default-avatar.png'}
                    alt={provider.name}
                    className="w-20 h-20 rounded-full mb-3 object-cover"
                  />
                  <h3 className="font-semibold text-lg text-gray-800">
                    {provider.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    📞 {provider.telNumber || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    📍 {provider.address || 'Address not provided'}
                  </p>
                  {provider.providerProfile?.description && (
                    <p className="text-sm text-gray-500 mt-2 italic">
                      “{provider.providerProfile.description}”
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Joined {new Date(provider.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 text-lg">
                No providers found.
              </p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
