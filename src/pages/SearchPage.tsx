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
    <div>
      <p className="text-xl p-2">By {providerName}</p>
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const headerSearchBar = document.querySelector(
      '#Searchbar-header',
    ) as HTMLElement;
    if (headerSearchBar) {
      headerSearchBar.style.display = 'none';
    }
  }, []);

  const handleSearch = () => {
    if (searchInput) {
      alert(`You're searching this: ${searchInput}`);
    } else {
      alert("There's nothing...");
    }
    inputRef.current?.blur();
  };

  const jobs = Array(8).fill({
    title: 'Job title',
    img: 'https://picsum.photos/300/150',
    priceRating: 'price rating',
    rating: 'rating',
    providerName: 'Provider Name',
  });

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-1 flex flex-col">
        {/* Search bar */}
        <div className="flex justify-center items-center mt-6">
          <div className="flex items-center gap-2 border-2 border-blue-400 rounded-md px-3 w-[40%] h-[50px]">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full focus:outline-none"
            />
            <Search
              className={`cursor-pointer ${searchInput ? 'text-blue-500' : 'text-gray-400'}`}
              onClick={handleSearch}
            />
          </div>
        </div>

        {/* Results header */}
        <div className="flex justify-between items-center w-[80%] mx-auto mt-6">
          <p className="text-lg font-medium">Showing {jobs.length} results</p>
          <button
            className="flex items-center gap-1 text-blue-500 hover:underline"
            onClick={() => setShowFilter(!showFilter)}
          >
            <Filter size={18} /> Filter
          </button>
        </div>

        {/* Filter panel */}
        {showFilter && (
          <div className="bg-gray-100 p-4 w-[80%] mx-auto mt-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Filters</h2>
              <X
                className="cursor-pointer text-gray-500"
                onClick={() => setShowFilter(false)}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Example filter sections */}
              <div>
                <p className="font-medium mb-1">Price Range</p>
                <select className="w-full border rounded p-1">
                  <option>All</option>
                  <option>Cheap</option>
                  <option>Moderate</option>
                  <option>Expensive</option>
                </select>
              </div>

              <div>
                <p className="font-medium mb-1">Rating</p>
                <select className="w-full border rounded p-1">
                  <option>All</option>
                  <option>4+ Stars</option>
                  <option>3+ Stars</option>
                </select>
              </div>

              <div>
                <p className="font-medium mb-1">Provider</p>
                <input
                  type="text"
                  placeholder="Provider name..."
                  className="w-full border rounded p-1"
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowFilter(false)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Job cards */}
        <div className="grid grid-cols-3 gap-6 w-[80%] mx-auto mt-6 mb-12">
          {jobs.map((job, index) => (
            <ExtendedServiceCard
              key={index}
              title={job.title}
              img={job.img}
              priceRating={job.priceRating}
              rating={job.rating}
              providerName={job.providerName}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
