import { Search, Filter, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Header from '@/components/our-components/header';
import Footer from '@/components/our-components/footer';
import ServiceCard from '@/components/our-components/serviceCard';

interface ExtendedServiceCardProps {
  title: string;
  img: string;
  priceRating: string;
  rating: string;
  providerName: string;
}

function ExtendedServiceCard({
  title,
  img,
  priceRating,
  rating,
  providerName,
}: ExtendedServiceCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <p className="text-sm text-gray-500 mb-2">By {providerName}</p>
      <ServiceCard
        title={title}
        img={img}
        priceRating={priceRating}
        rating={rating}
      />
    </div>
  );
}

export default function SearchPage() {
  const [searchInput, setSearchInput] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    price: 'all',
    rating: 'all',
    providerName: '',
  });
  const inputRef = useRef(null);

  const allJobs = [
    {
      title: 'Software Engineer',
      img: 'https://picsum.photos/300/150?random=1',
      priceRating: '100$',
      rating: 4.5,
      providerName: 'Tech Corp',
    },
    {
      title: 'Data Scientist',
      img: 'https://picsum.photos/300/150?random=2',
      priceRating: '200$$',
      rating: 4.8,
      providerName: 'Data Inc.',
    },
    {
      title: 'Product Manager',
      img: 'https://picsum.photos/300/150?random=3',
      priceRating: '140$',
      rating: 4.2,
      providerName: 'Innovate Ltd.',
    },
    {
      title: 'UI/UX Designer',
      img: 'https://picsum.photos/300/150?random=4',
      priceRating: '90$',
      rating: 4.7,
      providerName: 'Creative Studio',
    },
    {
      title: 'DevOps Engineer',
      img: 'https://picsum.photos/300/150?random=5',
      priceRating: '700$$',
      rating: 4.6,
      providerName: 'CloudOps Co.',
    },
    {
      title: 'Mobile App Developer',
      img: 'https://picsum.photos/300/150?random=6',
      priceRating: '300$',
      rating: 4.4,
      providerName: 'Appify',
    },
    {
      title: 'Cybersecurity Analyst',
      img: 'https://picsum.photos/300/150?random=7',
      priceRating: '$450$',
      rating: 4.9,
      providerName: 'SecureTech',
    },
    {
      title: 'Cloud Solutions Architect',
      img: 'https://picsum.photos/300/150?random=8',
      priceRating: '890$',
      rating: 4.8,
      providerName: 'Cloudify',
    },
  ];

  const handleSearch = () => {
    // This function will now simply trigger a re-render by updating the state,
    // which the filteredJobs array will react to.
    // const inputRef = useRef<HTMLInputElement>(null);
  };

  const handleFilterChange = (e: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = e.target;
    setActiveFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  useEffect(() => {
    const Search_header = document.getElementById('Searchbar-header');
    if (Search_header) {
      Search_header.style.display = 'none';
    }
  }, []);

  const filterJobs = () => {
    return allJobs.filter((job) => {
      // Search bar filter
      const matchesSearch =
        job.title.toLowerCase().includes(searchInput.toLowerCase()) ||
        job.providerName.toLowerCase().includes(searchInput.toLowerCase());

      // Price filter
      const priceValue = parseInt(job.priceRating.replace(/[^0-9]/g, ''), 10);
      const matchesPrice =
        activeFilters.price === 'all' ||
        (activeFilters.price === 'cheap' && priceValue < 150) ||
        (activeFilters.price === 'moderate' &&
          priceValue >= 150 &&
          priceValue < 400) ||
        (activeFilters.price === 'expensive' && priceValue >= 400);

      // Rating filter
      const matchesRating =
        activeFilters.rating === 'all' ||
        (activeFilters.rating === '4+' && job.rating >= 4) ||
        (activeFilters.rating === '3+' && job.rating >= 3);

      // Provider name filter (case-insensitive)
      const matchesProvider =
        activeFilters.providerName === '' ||
        job.providerName
          .toLowerCase()
          .includes(activeFilters.providerName.toLowerCase());

      return matchesSearch && matchesPrice && matchesRating && matchesProvider;
    });
  };

  const filteredJobs = filterJobs();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header />

      <main className="flex-1 flex flex-col items-center">
        {/* Search and Filter Section */}
        <div className="w-full flex flex-col items-center px-4 md:px-0">
          <div className="flex items-center gap-2 border-2 border-blue-400 rounded-full px-4 py-2 w-full max-w-2xl mt-8 shadow-sm transition-all duration-300 focus-within:border-blue-600">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for jobs or providers..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 text-base"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Search
              className={`cursor-pointer w-5 h-5 transition-colors duration-200 ${searchInput ? 'text-blue-500 hover:text-blue-600' : 'text-gray-400'}`}
              onClick={handleSearch}
            />
          </div>

          <div className="flex justify-between items-center w-full max-w-2xl mt-6 px-2">
            <p className="text-lg font-medium text-gray-700">
              Showing {filteredJobs.length} results
            </p>
            <button
              className="flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors duration-200 font-medium"
              onClick={() => setShowFilter(!showFilter)}
            >
              <Filter size={18} /> Filter
            </button>
          </div>
        </div>

        {/* Filter panel */}
        <div
          className={`w-full max-w-2xl mt-4 px-4 overflow-hidden transition-all duration-500 ease-in-out ${showFilter ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-xl text-gray-800">Filters</h2>
              <X
                className="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors duration-200"
                onClick={() => setShowFilter(false)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="price-filter"
                  className="font-medium text-gray-700 block mb-1"
                >
                  Price Range
                </label>
                <select
                  id="price-filter"
                  name="price"
                  value={activeFilters.price}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="all">All</option>
                  <option value="cheap">Cheap ($)</option>
                  <option value="moderate">Moderate ($$)</option>
                  <option value="expensive">Expensive ($$$)</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="rating-filter"
                  className="font-medium text-gray-700 block mb-1"
                >
                  Rating
                </label>
                <select
                  id="rating-filter"
                  name="rating"
                  value={activeFilters.rating}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="all">All</option>
                  <option value="4+">4+ Stars</option>
                  <option value="3+">3+ Stars</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="provider-filter"
                  className="font-medium text-gray-700 block mb-1"
                >
                  Provider
                </label>
                <input
                  type="text"
                  id="provider-filter"
                  name="providerName"
                  placeholder="Provider name..."
                  value={activeFilters.providerName}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Job cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mt-8 mb-12 px-4 md:px-0">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <ExtendedServiceCard
                key={index}
                title={job.title}
                img={job.img}
                priceRating={job.priceRating}
                rating={job.rating.toString()}
                providerName={job.providerName}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 text-lg">
              No results match your search and filter criteria.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
