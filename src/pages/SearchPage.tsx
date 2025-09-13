import { Search, Filter } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Header from '@/components/our-components/header';
import Footer from '@/components/our-components/footer';
import ServiceCard from '@/components/our-components/serviceCard';
import FilterBar from '@/components/our-components/filterBar';
import { useQuery } from '@tanstack/react-query';
import { fetchJobs } from '@/config/api';
export interface ExtendedServiceCardProps {
  title: string;
  img: string;
  priceRating: string;
  rating: number;
  providerName: string;
}
interface JobsProp {
  title: string;
  img: string;
  priceRating: string;
  rating: number;
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
  const [filteredJobs, setFilteredJobs] = useState<JobsProp[]>([]);
  const inputRef = useRef(null);

  const { data: jobsData } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => fetchJobs(),
  });

  const allJobs: ExtendedServiceCardProps[] = Array.isArray(jobsData)
    ? jobsData
    : []; // Ensure allJobs is always an array
  const handleSearch = () => {
    // Simply force a re-render (already happens with searchInput state)
    setSearchInput((prev) => prev.trim());

    // Optionally blur the input after searching
    if (inputRef.current) {
      (inputRef.current as HTMLInputElement).blur();
    }
  };
  useEffect(() => {
    // display none on search header
    const Search_header = document.getElementById('Searchbar-header');
    if (Search_header) {
      Search_header.style.display = 'none';
    }
  }, []);

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
              className="flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors duration-200 font-medium cursor-pointer"
              onClick={() => setShowFilter(!showFilter)}
            >
              <Filter size={18} /> Filter
            </button>
          </div>
        </div>

        {/* Filter panel */}
        <FilterBar
          showFilter={showFilter}
          setShowFilter={setShowFilter}
          allJobs={allJobs}
          searchInput={searchInput}
          setFilteredJobs={setFilteredJobs}
        />
        {/* Job cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mt-8 mb-12 px-4 md:px-0">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <ExtendedServiceCard
                key={index}
                title={job.title}
                img={job.img}
                priceRating={job.priceRating}
                rating={job.rating}
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
