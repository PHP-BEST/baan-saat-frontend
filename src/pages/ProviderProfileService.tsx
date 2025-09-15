import ServiceCard from '@/components/our-components/serviceCard';
import Header from '@/components/our-components/header';
import Footer from '@/components/our-components/footer';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ChevronLeft, Filter } from 'lucide-react';
import type { User } from '@/interfaces/User';
import {
  TAG_OPTIONS,
  type Service,
  type TagsOption,
} from '@/interfaces/Service';
import Loading from '@/components/our-components/loading';
import { getUserById } from '@/api/user';
import {
  filterServices,
  getServicesByUserId,
  type FilterServiceParams,
} from '@/api/service';
import { filterValidator } from '@/utils/filterValidator';
import ActionButton from '@/components/our-components/actionButton';

export default function ProviderProfileServicePage() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [providerUser, setProviderUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  // Filter states
  const [serviceTitle, setServiceTitle] = useState<string | undefined>();
  const [tags, setTags] = useState<TagsOption[]>([]);
  const [minBudget, setMinBudget] = useState<number | undefined>();
  const [maxBudget, setMaxBudget] = useState<number | undefined>();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterError, setFilterError] = useState<string | undefined>();

  useEffect(() => {
    const getProviderUser = async () => {
      setLoading(true);
      if (!userId) return;
      const user = await getUserById(userId);
      setProviderUser(user);
      if (user) {
        const services = await getServicesByUserId(userId);
        setFilteredServices(services);
      }
      setLoading(false);
    };
    getProviderUser();
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

  if (!providerUser) {
    return (
      <div>
        <Header />
        <div className="px-16 py-10 w-full min-h-screen flex flex-col gap-10 bg-white">
          <div className="max-w-6xl mx-auto flex flex-col gap-6 items-center">
            <p className="text-center text-2xl font-semibold">
              We couldn&apos;t find the user you were looking for...
            </p>
            <ActionButton
              onClick={() => navigate(-1)}
              buttonType="outline"
              className="cursor-pointer"
            >
              Back
            </ActionButton>
          </div>
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

    const params: FilterServiceParams = {
      userId: userId,
      title: serviceTitle || undefined,
      tags: tags.length ? tags : undefined,
      minBudget,
      maxBudget,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };

    let services = await filterServices(params);
    services = services.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

    setFilteredServices(services);
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
        <p className="text-3xl font-bold">Services by {providerUser.name}</p>

        {/* Result Counter */}
        <div className="flex justify-between items-center w-full">
          <p className="text-lg font-medium">
            Services Found: {filteredServices.length}
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
            <h3 className="text-lg font-semibold mb-2">Filter Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-medium text-black block mb-1">
                  Service Title
                </label>
                <input
                  type="text"
                  value={serviceTitle ?? ''}
                  onChange={(e) => setServiceTitle(e.target.value)}
                  className={`w-full border rounded-md p-2 mb-2 ${
                    filterError && filterError.toLowerCase().includes('title')
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="Service Title"
                />
                <label className="font-medium text-black block mb-1">
                  Tags
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {TAG_OPTIONS.map((tag: TagsOption) => (
                    <label key={tag.value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={tags.includes(tag)}
                        onChange={() => handleTagChange(tag)}
                      />
                      <span>{tag.label}</span>
                    </label>
                  ))}
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
                        if (/^\d*$/.test(e.target.value)) {
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
                        if (/^\d*$/.test(e.target.value)) {
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

        {/* Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-4 md:px-0">
          {filteredServices.length > 0 ? (
            filteredServices.map((service: Service) => (
              <ServiceCard key={service._id} service={service} size="L" />
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
