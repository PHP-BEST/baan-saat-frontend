import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import Header from '@/components/our-components/header';
import Footer from '@/components/our-components/footer';
import { useEffect } from 'react';
import type { User } from '@/interfaces/User';
import { getUserById } from '@/api/user';
import Loading from '@/components/our-components/loading';
import type { Service } from '@/interfaces/Service';
import { getServicesByUserId } from '@/api/service';
import ServiceCard from '@/components/our-components/serviceCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import UserNotFound from '@/error/UserNotFound';

export default function ProviderProfilePage() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
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
          <UserNotFound />
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
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                {providerUser.name}’s Profile
              </h1>
            </>
          )}
          <button
            className="flex gap-2 items-center text-button-action font-bold text-lg cursor-pointer ml-auto"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={32} />
            <p className="hover:underline">Back</p>
          </button>
        </div>

        {/* Content */}
        <div className="w-full h-fit border border-gray-400 rounded-3xl p-8">
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
                <p>This user has no skills listed</p>
              )}
            </div>
          </div>
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
