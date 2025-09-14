import { useState } from 'react';

import Footer from '@/components/our-components/footer';
import HeaderLanding from '@/components/our-components/headerLanding';

import { Search } from 'lucide-react';
import ServiceCardLanding from '@/components/our-components/serviceCardLanding';

export default function LandingPage() {
  const [searchInput, setSearchInput] = useState<string>('');

  const handleSearch = () => {
    if (searchInput) {
      alert(`You're searching this: ${searchInput}`);
    } else {
      alert("There's nothing...");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <HeaderLanding />

      {/* Buttons */}
      <div className=" h-[200px] flex gap-4"></div>

      <div className="flex flex-col gap-10">
        <div className="items-center justify-center flex flex-col md:flex-row gap-4">
          <h1 className="text-9xl font-bold">บ้านสะอาด... วันนี้</h1>
        </div>
        <div className="items-center justify-center flex">
          <p className="text-lg text-gray-600 mt-2">
            ค้นหาผู้ให้บริการทำความสะอาดบ้าน ซักรีด ซ่อมแซม และอื่นๆ อีกมากมาย
          </p>
        </div>
      </div>

      {/* Search Box */}
      <div className="flex justify-center mt-4">
        <div className="bg-white min-w-[75px] w-[50%] h-[50px] flex gap-1 items-center pl-1 pr-3">
          <Search
            width={28}
            height={28}
            className={`${searchInput ? 'cursor-pointer' : ''}`}
            onClick={handleSearch}
          />
          <input
            type="text"
            className="w-full focus:outline-none focus:border-none"
            onChange={(e) => {
              e.preventDefault();
              setSearchInput(e.target.value);
            }}
          />
        </div>
      </div>
      <div>
        {/* Service Display  */}
        <div className="bg-white w-full  px-10 py-10">
          {/* Title */}
          <h2 className="text-2xl font-bold mb-6 ml-100">กระทู้คำขอล่าสุด</h2>

          {/* Service Grid */}
          <div className="flex justify-center mb-6">
            <div className=" w-[65%] grid grid-cols-2 md:grid-cols-3 gap-6">
              <ServiceCardLanding serviceId={'64a7f3f4e4b0c9b1f4d6c8a1'} />
              <ServiceCardLanding serviceId={'64a7f3f4e4b0c9b1f4d6c8a1'} />
              <ServiceCardLanding serviceId={'64a7f3f4e4b0c9b1f4d6c8a1'} />
              <ServiceCardLanding serviceId={'64a7f3f4e4b0c9b1f4d6c8a1'} />
              <ServiceCardLanding serviceId={'64a7f3f4e4b0c9b1f4d6c8a1'} />
              <ServiceCardLanding serviceId={'64a7f3f4e4b0c9b1f4d6c8a1'} />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
