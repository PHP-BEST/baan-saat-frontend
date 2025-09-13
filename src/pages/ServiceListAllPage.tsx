import ServiceCard from '@/components/our-components/serviceCard';
import Header from '@/components/our-components/header';
import Footer from '@/components/our-components/footer';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Filter } from 'lucide-react';
import FilterBar from '@/components/our-components/filterBar';
// type Service = {
//   id: string;
//   title: string;
//   description: string;
//   budget: number;
//   coverPhoto: string;
//   telNumber: string;
//   location: string;
//   tags: string[];
//   date: Date;
// };
interface JobsProp {
  title: string;
  img: string;
  priceRating: string;
  rating: number;
  providerName: string;
}
export default function ServiceListAllPage() {
    const [showFilter, setShowFilter ] = useState(false);
    const [ filteredServices, setFilteredServices ] = useState<JobsProp[]>([]);
    // const {
    //   data: services,
    //   isLoading,
    //   error,
    // } = useQuery<Service[]>({
    //   queryKey: ['services', user._id],
    //   queryFn: () => getServices(user._id),
    // });
    // if (isLoading) return <div>Loading...</div>;
    // if (error) return <div>Error loading services</div>; 
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
  return (
    <>
      <Header />
      <div className="px-16 pt-10 pb-18 bg-white min-h-screen">
        <div className="flex justify-between">
          <div className="flex justify-start items-center">
            <Link
              to="/servicelist"
              className="hover:bg-gray-200 active:bg-gray-500 px-3 py-1 rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
              </svg>
            </Link>
            <h2 className="font-bold text-xl ms-2">Service by John Doe</h2>
          </div>
          <button
            className="font-bold underline cursor-pointer"
            onClick={() => setShowFilter(!showFilter)}
          >
            <Filter size={18} /> Filter({filteredServices.length} applied)
          </button>
        </div>
        <div className="flex justify-center">
          <FilterBar
            showFilter={showFilter}
            setShowFilter={setShowFilter}
            allJobs={allJobs}
            setFilteredJobs={setFilteredServices}
            searchName={false}
          />
        </div>
        <div className="mt-4 ps-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices &&
            filteredServices.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                img={service.img}
                priceRating={service.priceRating}
                rating={service.rating}
                
              ></ServiceCard>
            ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
