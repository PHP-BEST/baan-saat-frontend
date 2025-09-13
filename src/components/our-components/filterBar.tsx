import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
interface JobsProp {
  title: string;
  img: string;
  priceRating: string;
  rating: number;
  providerName: string;
}
type FilterProps = {
  showFilter: boolean;
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
  allJobs: JobsProp[];
  searchInput?: string;
  setFilteredJobs: React.Dispatch<React.SetStateAction<JobsProp[]>>;
  searchName?: boolean;
};
export default function FilterBar({
  showFilter,
  setShowFilter,
  allJobs,
  searchInput,
  setFilteredJobs,
  searchName = true,
}: FilterProps) {
  const [activeFilters, setActiveFilters] = useState({
    price: 'all',
    rating: 'all',
    providerName: '',
  });

  const handleFilterChange = (e: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = e.target;
    setActiveFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };
  const filterJobs = () => {
    return allJobs.filter((job) => {
      // Search bar filter
      const matchesSearch =
        !searchInput ||
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
  useEffect(() => {
    setFilteredJobs(filterJobs());
  }, [activeFilters, searchInput]);
  return (
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
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> */}
        <div className="flex justify-evenly gap-2">
          <div className="w-1/3">
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
          <div className="w-1/3">
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
          {searchName && (
            <div className="w-1/3">
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
          )}
        </div>
      </div>
    </div>
  );
}
