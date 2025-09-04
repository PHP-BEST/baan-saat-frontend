import ServiceCard from '@/components/our-components/serviceCard';
// type Service = { รอ endpoint from backend

// };
export const ServiceListAllPage = () => {
  // const [services, setServices] = useState<Service[]>([]);
  // useEffect(() => {
  //   fetch("#")
  //   .then((res) => res.json())
  //   .then((data: Service[]) => setServices(data));
  // })
  return (
    <div>
      <div className="p-18">
        <div className="flex justify-between">
          <h2 className="font-bold text-xl">Service by John Doe</h2>
          {/* <Link className="font-bold" to="/register/servicelistall">
              View All →
            </Link> */}
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
    </div>
  );
};
