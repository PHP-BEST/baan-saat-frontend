import ServiceCard from '@/components/our-components/serviceCard';
import Header from '@/components/our-components/header';
import Footer from '@/components/our-components/footer';
import { Link } from 'react-router-dom';
// type Service = { รอ endpoint from backend

// };
export const ServiceListAllPage = () => {
  return (
    <>
      <Header />
      <div className="px-16 pt-10 pb-18 bg-white">
        <div className="flex justify-between">
          <h2 className="font-bold text-xl">Service by John Doe</h2>
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
};
