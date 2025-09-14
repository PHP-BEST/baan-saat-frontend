import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import Header from '@/components/our-components/header';
import Footer from '@/components/our-components/footer';
import { useEffect } from 'react';
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
import type { User } from '@/interfaces/User';
import { getUserById } from '@/api/user';
import Loading from '@/components/our-components/loading';
import type { Service } from '@/interfaces/Service';
import { getServicesByUserId } from '@/api/service';
import ServiceCard from '@/components/our-components/serviceCard';
import ActionButton from '@/components/our-components/actionButton';
import { useUser } from '@/context/UserContext';
import { ChevronRight } from 'lucide-react';

export default function ProviderProfilePage() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { user } = useUser();
  const [providerUser, setProviderUser] = useState<User | null>(null);
  const [providerServices, setProviderServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getProviderUser = async () => {
      setLoading(true);
      if (!userId) return;
      const user = await getUserById(userId);
      setProviderUser(user);
      if (user) {
        const services = await getServicesByUserId(userId);
        setProviderServices(services);
      }
      setLoading(false);
    };
    getProviderUser();
  }, [userId]);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="px-16 py-10 w-full min-h-screen flex flex-col gap-10 bg-white">
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
          <p className="text-center text-2xl font-semibold">User not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="px-16 py-10 w-full min-h-screen flex flex-col gap-10 bg-white">
        {/* Header */}
        <div className="flex gap-6 items-center">
          {providerUser && (
            <>
              <div
                className={`bg-background-profile rounded-full flex items-center justify-center overflow-hidden`}
                style={{ width: 52, height: 52 }}
              >
                {providerUser.avatarUrl ? (
                  <img
                    src={providerUser.avatarUrl}
                    alt="Avatar Image"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>
              <h1 className="text-4xl font-bold">
                {providerUser.name}’s Profile
              </h1>
            </>
          )}
        </div>

        {/* Content */}
        <div className="w-full h-fit border border-gray-400 rounded-3xl p-8">
          {providerUser ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <p className="font-bold text-xl">Name</p>
                <p className="text-lg">
                  {providerUser.name ? providerUser.name : 'Unknown'}
                </p>
              </div>
              <div className="flex flex-col text-lg gap-1">
                <p className="font-bold text-xl">Telephone</p>
                <p className="text-lg">
                  {providerUser.telNumber ? providerUser.telNumber : '-'}
                </p>
              </div>
              <div className="flex flex-col text-lg gap-1">
                <p className="font-bold text-xl">Email</p>
                <p className="text-lg">
                  {providerUser.email ? providerUser.email : '-'}
                </p>
              </div>
              <div className="flex flex-col text-lg gap-1">
                <p className="font-bold text-xl">Description</p>
                <p className="text-lg">
                  {providerUser.providerProfile?.description
                    ? providerUser.providerProfile.description
                    : '-'}
                </p>
              </div>
              <div className="flex flex-col text-lg gap-1">
                <p className="font-bold">Skills & Experiences</p>
                {providerUser.providerProfile?.skills &&
                providerUser.providerProfile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {providerUser.providerProfile.skills.map(
                      (skill: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-background border border-gray-300 rounded-full text-lg text-black"
                        >
                          {skill}
                        </span>
                      ),
                    )}
                  </div>
                ) : (
                  <p>No skills found</p>
                )}
              </div>
              {user?._id !== providerUser._id && (
                <div className="flex justify-end">
                  <Dialog>
                    <DialogTrigger asChild>
                      <ActionButton
                        buttonType="filled"
                        buttonColor="blue"
                        className="cursor-pointer"
                      >
                        Select For Your Request
                      </ActionButton>
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
                          {/* <div className="min-h-[40vh]">
                          {providerServices.length > 0 ? (
                            providerServices.map((providerService: Service) => {
                              return (
                                <p>Hello</p>
                                // <RequestList
                                //   key={providerService._id}
                                //   service={providerService}
                                // />
                              );
                            })
                          ) : (
                            <div className="flex justify-center items-center h-full">
                              <p className="text-gray-500 text-sm">
                                {"Sorry, we couldn't find the request"}
                              </p>
                            </div>
                          )}
                        </div> */}
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
              )}
            </div>
          ) : (
            <p>Profile not found</p>
          )}
        </div>

        {/* Services */}
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex justify-between">
            <h2 className="font-bold text-2xl">
              Services by {providerUser.name}
            </h2>
            <button
              className="font-bold text-lg cursor-pointer text-button-action flex gap-1 items-center"
              onClick={() => navigate(`/user/${providerUser._id}/service`)}
            >
              <p className="hover:underline">View All</p>
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Some Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providerServices.length > 0 ? (
              providerServices
                .slice(0, 6)
                .map((service) => (
                  <ServiceCard key={service._id} service={service} size="L" />
                ))
            ) : (
              <p className="text-gray-500 text-xl font-medium">
                This provider has no services listed.
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
