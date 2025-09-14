import { useEffect, useState, type FormEvent } from 'react';
import Footer from '@/components/our-components/footer';
import { Search } from 'lucide-react';
import type { Service } from '@/interfaces/Service';
import { getAllServices } from '@/api/service';
import Header from '@/components/our-components/header';
import ServiceCard from '@/components/our-components/serviceCard';
import { useNavigate } from 'react-router-dom';
import Loading from '@/components/our-components/loading';

export default function LandingPage() {
  const [query, setQuery] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const allServices = await getAllServices();
      const sortedServices = allServices
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        .slice(0, 10);
      setServices(sortedServices);
      setServices(allServices);
      setLoading(false);
    };

    fetchServices();
  }, []);

  const handleSearch = (e: FormEvent) => {
    if (query.trim() !== '') {
      e.preventDefault();
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header isHideSearchBar={true} />

      {/* Blue Area */}
      <div className="bg-background min-h-[50vh] w-full px-10 py-10 flex flex-col justify-center items-center">
        {/* Text */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-4 md:items-center md:justify-center">
          <h1 className="font-bold text-start text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
            บ้านสะอาด...
          </h1>
          <h1 className="font-bold text-end text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
            วันนี้
          </h1>
        </div>
        <p className="mt-4 text-center text-base sm:text-lg md:text-xl text-gray-600">
          ค้นหาผู้ให้บริการทำความสะอาดบ้าน ซักรีด ซ่อมแซม และอื่นๆ อีกมากมาย
        </p>

        {/* Search Box */}
        <div className="flex justify-center mt-4 w-full">
          <div className="bg-white min-w-[100px] w-full max-w-[600px] h-[50px] flex gap-1 items-center mx-auto">
            <Search
              width={28}
              height={28}
              className={`${query ? 'cursor-pointer' : ''}`}
              onClick={handleSearch}
            />
            <input
              type="text"
              className="w-full focus:outline-none focus:border-none"
              onChange={(e) => {
                e.preventDefault();
                setQuery(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(e);
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* White Area */}
      <div className="bg-white min-h-[50vh] w-full flex flex-col px-10 py-10 gap-10">
        <h2 className="text-2xl font-bold">กระทู้คำขอล่าสุด</h2>
        {loading ? (
          <Loading />
        ) : services.length === 0 ? (
          <div>No services found</div>
        ) : (
          <div className="w-full max-w-screen-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center items-center mx-auto">
            {services.map((service) => (
              <ServiceCard service={service} size="L" key={service._id} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
