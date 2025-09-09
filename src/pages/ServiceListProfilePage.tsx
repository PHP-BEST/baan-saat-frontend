import { Link } from 'react-router-dom';
import { useState } from 'react';
import Header from '@/components/our-components/header';
import Footer from '@/components/our-components/footer';
import { useEffect } from 'react';
import ServiceCard from '@/components/our-components/serviceCard';
import RequestList from '@/components/our-components/requestList';
import AvatarImage from '@/components/our-components/accountImage';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
// type Service = { รอ endpoint from backend

// }
type RequestProps = {
  serviceName: string;
  price: string;
  date: string;
};
export default function ServiceListProfilePage() {
  // const [services, setServices] = useState<Service[]>([]);
  const [requests, setRequests] = useState<RequestProps[]>([
    { serviceName: 'House cleaning', price: '500 THB', date: '20/06/2024' },
    { serviceName: 'House cleaning', price: '500 THB', date: '20/06/2024' },
    { serviceName: 'House cleaning', price: '500 THB', date: '20/06/2024' },
    { serviceName: 'House cleaning', price: '500 THB', date: '20/06/2024' },
    { serviceName: 'House cleaning', price: '500 THB', date: '20/06/2024' },
    { serviceName: 'House cleaning', price: '500 THB', date: '20/06/2024' },
    { serviceName: 'House cleaning', price: '500 THB', date: '20/06/2024' },
    { serviceName: 'House cleaning', price: '500 THB', date: '20/06/2024' },
    { serviceName: 'House cleaning', price: '500 THB', date: '20/06/2024' },
    { serviceName: 'House cleaning', price: '500 THB', date: '20/06/2024' },
    { serviceName: 'House cleaning', price: '500 THB', date: '20/06/2024' },
    { serviceName: 'House cleaning', price: '500 THB', date: '20/06/2024' },
    { serviceName: 'House cleaning', price: '500 THB', date: '20/06/2024' },
    { serviceName: 'House cleaning', price: '500 THB', date: '20/06/2024' },
    { serviceName: 'House cleaning', price: '500 THB', date: '20/06/2024' },
    { serviceName: 'House cleaning', price: '500 THB', date: '20/06/2024' },
    { serviceName: 'House cleaning', price: '500 THB', date: '20/06/2024' },
    { serviceName: 'House cleaning', price: '500 THB', date: '20/06/2024' },
    { serviceName: 'House cleaning', price: '500 THB', date: '20/06/2024' },
    { serviceName: 'House cleaning', price: '500 THB', date: '20/06/2024' },
    { serviceName: 'House cleaning', price: '500 THB', date: '20/06/2024' },
    { serviceName: 'House cleaning', price: '500 THB', date: '20/06/2024' },
    { serviceName: 'House cleaning', price: '500 THB', date: '20/06/2024' },
    { serviceName: 'House cleaning', price: '500 THB', date: '20/06/2024' },
    { serviceName: 'House cleaning', price: '500 THB', date: '20/06/2024' },
    { serviceName: 'House cleaning', price: '500 THB', date: '20/06/2024' },
    { serviceName: 'House cleaning', price: '500 THB', date: '20/06/2024' },
  ]);
  useEffect(() => {
    setRequests(requests);
    const body = document.body;
    const observer = new MutationObserver(() => {
      if (body.hasAttribute('data-scroll-locked')) {
        body.style.setProperty('margin-right', '0px', 'important');
      }
    });

    observer.observe(body, {
      attributes: true,
      attributeFilter: ['data-scroll-locked'],
    });

    return () => observer.disconnect();
  }, []);
  return (
    <>
      <Header />
      <div className="px-16 pt-6 pb-18 bg-white">
        <div className="my-10 flex gap-6 items-center">
          <AvatarImage />
          <h1 className="text-4xl font-bold">John Doe’s Profile</h1>
        </div>
        <div className="border border-gray-400 rounded-3xl p-8">
          <div>
            <p className="mb-2 text-sm">
              <strong>Name</strong>
              <br />
              John Doe
            </p>
            <p className="my-2 text-sm">
              <strong>Telephone</strong>
              <br />
              +00 000 000 000
            </p>
            <p className="my-2 text-sm">
              <strong>Email</strong>
              <br />
              john@doe.com
            </p>
            <p className="my-2 text-sm">
              <strong>Description</strong>
              <br />I do some cleaning
            </p>
            <p className="my-2 text-sm">
              <strong>Skill & Experience</strong>
              <br />I did some cleaning
            </p>
            <div className="flex justify-end">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="bg-[#777BB3] text-white text-xs px-4 py-1 rounded-3xl hover:bg-[#464a85] active:bg-[#191b40]">
                    Select For Your Request
                  </button>
                </DialogTrigger>
                <DialogContent
                  className="bg-white rounded-md w-[40%] p-0"
                  showCloseButton={false}
                >
                  <DialogHeader>
                    <DialogTitle className="border-b border-gray-400 mt-0">
                      <div className="text-gray-600 flex justify-between items-center h-10">
                        <div className="px-3 py-1 text-sm">
                          Select For Your Request
                        </div>
                        <DialogClose asChild>
                          <div
                            role="button"
                            className="rounded-tr-md h-full px-3 items-center hover:bg-red-600 active:bg-red-800"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                              className="w-4 flex h-full"
                            >
                              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                            </svg>
                          </div>
                        </DialogClose>
                      </div>
                    </DialogTitle>
                    <DialogDescription
                      className="mb-0 max-h-[60vh] overflow-y-auto"
                      asChild
                    >
                      <div className="min-h-[40vh]">
                        {requests.length > 0 ? (
                          requests.map((request: RequestProps, index) => {
                            return (
                              <RequestList
                                key={index}
                                serviceName={request.serviceName}
                                price={request.price}
                                date={request.date}
                              />
                            );
                          })
                        ) : (
                          <div className="flex justify-center items-center h-full">
                            <p className="text-gray-500 text-sm">
                              {"Sorry, we couldn't find the request"}
                            </p>
                          </div>
                        )}
                      </div>
                    </DialogDescription>
                    <DialogFooter className="border-t border-gray-400">
                      <div className="flex justify-end">
                        <button className="me-1 my-1 bg-[#777BB3] text-sm text-white px-4 py-1 rounded-3xl  hover:bg-[#464a85] active:bg-[#191b40]">
                          Submit
                        </button>
                      </div>
                    </DialogFooter>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        {/* Services Section */}
        <div className="mt-8 pe-14">
          <div className="flex justify-between">
            <h2 className="font-bold text-xl">Service by John Doe</h2>
            <Link className="font-bold pe-2" to="/servicelistall">
              View All →
            </Link>
          </div>
          <div className="mt-4 ps-12 grid grid-cols-3 gap-[4%] ">
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
      <Footer />
    </>
  );
}
