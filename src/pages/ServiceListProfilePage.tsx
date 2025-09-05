import { Link } from 'react-router-dom';
import { useState } from 'react';
import Header from '@/components/our-components/header';
import Footer from '@/components/our-components/footer';
import { useEffect } from 'react';
import ServiceCard from '@/components/our-components/serviceCard';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import AvatarImage from '@/components/our-components/accountImage';
// type Service = { รอ endpoint from backend

// }
export const ServiceListProfilePage = () => {
  // const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const requestServiceWindow = () => {
    setIsModalOpen(true);
  };
  useEffect(() => {
    const html = document.documentElement;
    const observer = new MutationObserver(() => {
      html.style.paddingRight = '';
    });

    observer.observe(html, {
      attributes: true,
      attributeFilter: ['class', 'style'],
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
              <button
                className="bg-[#777BB3] text-white text-xs px-4 py-1 rounded-3xl hover:bg-[#464a85] active:bg-[#191b40]"
                onClick={requestServiceWindow}
              >
                Select For Your Request
              </button>
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
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed inset-0 z-10 bg-black/50"
      >
        <div className="flex items-center justify-center min-h-screen">
          <DialogPanel className="bg-white rounded-md w-[40%]">
            <DialogTitle className="text-gray-600 flex justify-between items-center h-10">
              <div className="px-3 py-1">Select For Your Request</div>
              <div
                role="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-tr-md h-full px-3 items-center hover:bg-red-600 active:bg-red-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  className="w-4 h-6 flex h-full"
                >
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                </svg>
              </div>
            </DialogTitle>
            <hr className="border-t border-gray-400 mb-2" />
            <div className="min-h-[40vh]">
              <div className="grid grid-cols-[2fr_1fr_2fr_0.5fr] px-3">
                <span className="text-gray-600">ล้างจาน</span>
                <span className="text-gray-600">300$</span>
                <span className="text-gray-600">23/8/2025</span>
                <div className="flex items-center">
                  <input className="w-4 h-4 bg-gray-400" type="checkbox" />
                </div>
              </div>
            </div>
            <hr className="border-t border-gray-400 mt-2" />
            <div className="flex justify-end">
              <button
                className="me-1 my-1 bg-[#777BB3] text-sm text-white px-4 py-1 rounded-3xl  hover:bg-[#464a85] active:bg-[#191b40]"
                onClick={() => setIsModalOpen(false)}
              >
                Submit
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};
