import ServiceCard from '@/components/our-components/serviceCard';
import Header from '@/components/our-components/header';
import Footer from '@/components/our-components/footer';
import { Link } from 'react-router-dom';
// type Service = { รอ endpoint from backend

// };
export default function ServiceListAllPage() {
  return (
    <>
      <Header />
      <div className="px-16 pt-10 pb-18 bg-white">
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
          <Link className="font-bold underline" to="#">
            Filter(0 applied)
          </Link>
        </div>

        <div className="mt-4 ps-12 grid grid-cols-3 gap-[4%]">
          <ServiceCard
            title="Job title"
            img="https://f.ptcdn.info/507/064/000/pt5twn97vd8F72T5PEY-o.png"
            priceRating="5"
            rating="5"
          ></ServiceCard>
          <ServiceCard
            title="Job title"
            img="https://f.ptcdn.info/507/064/000/pt5twn97vd8F72T5PEY-o.png"
            priceRating="5"
            rating="5"
          ></ServiceCard>
          <ServiceCard
            title="Job title"
            img="https://f.ptcdn.info/507/064/000/pt5twn97vd8F72T5PEY-o.png"
            priceRating="5"
            rating="5"
          ></ServiceCard>
          <ServiceCard
            title="Job title"
            img="https://f.ptcdn.info/507/064/000/pt5twn97vd8F72T5PEY-o.png"
            priceRating="5"
            rating="5"
          ></ServiceCard>
          <ServiceCard
            title="Job title"
            img="https://f.ptcdn.info/507/064/000/pt5twn97vd8F72T5PEY-o.png"
            priceRating="5"
            rating="5"
          ></ServiceCard>
          <ServiceCard
            title="Job title"
            img="https://f.ptcdn.info/507/064/000/pt5twn97vd8F72T5PEY-o.png"
            priceRating="5"
            rating="5"
          ></ServiceCard>
          <ServiceCard
            title="Job title"
            img="https://f.ptcdn.info/507/064/000/pt5twn97vd8F72T5PEY-o.png"
            priceRating="5"
            rating="5"
          ></ServiceCard>
          {/* {services.map((service) => (
            <ServiceCard
              title="Job title"
              img="https://f.ptcdn.info/507/064/000/pt5twn97vd8F72T5PEY-o.png"
              priceRating="5"
              rating="5"
            ></ServiceCard>
          ))} */}
        </div>
      </div>
      <Footer />
    </>
  );
}
