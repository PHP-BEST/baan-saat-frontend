import React, {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/our-components/header';
import Footer from '@/components/our-components/footer';
import type { Service } from '@/interfaces/Service';
import type { User } from '@/interfaces/User';
import ActionButton from '@/components/our-components/actionButton';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  getOfferById,
  updateOffer,
  type OfferFormInterface,
} from '@/api/offer';
import { getServiceById } from '@/api/service';
import Loading from '@/components/our-components/loading';
import ServiceNotFound from '@/error/ServiceNotFound';
import {
  convertTagsToLabels,
  formatDateToDisplay,
  isInvalidOfferForm,
} from '@/utils/function';
import { AlertCircle, Calendar, Phone } from 'lucide-react';
import { getUserById } from '@/api/user';
import MyDatePicker from '@/components/ui/calendar';
import { useUser } from '@/context/UserContext';
import { Input } from '@/components/ui/input';
import { offerValidator } from '@/utils/offerValidator';
import type { Offer } from '@/interfaces/Offer';
import OfferNotFound from '@/error/OfferNotFound';

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      className={cn(
        'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex min-h-[80px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

function isFormDataSameAsOldOffer(
  formData: OfferFormInterface,
  oldFormData: OfferFormInterface,
): boolean {
  return (
    formData.date?.toISOString() === oldFormData.date?.toISOString() &&
    formData.offeredPrice === oldFormData.offeredPrice &&
    formData.description === oldFormData.description
  );
}

export default function OfferEditPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  if (!user) return;

  const { offerId } = useParams();
  const [offer, setOffer] = useState<Offer | null>(null);

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);
  const [customerUser, setCustomerUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<OfferFormInterface>({
    date: null,
    offeredPrice: 0,
    description: '',
  });
  const [oldFormData, setOldFormData] = useState<OfferFormInterface>({
    date: null,
    offeredPrice: 0,
    description: '',
  });
  const [showConfirm, setShowConfirm] = useState<'submit' | 'cancel' | null>(
    null,
  );

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const [updating, setUpdating] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    if (
      Object.keys(validationErrors).length === 0 &&
      !updating &&
      !isInvalidOfferForm(formData, service?.budget) &&
      !isFormDataSameAsOldOffer(formData, oldFormData)
    ) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [formData, validationErrors, updating]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === 'offeredPrice') {
      if (Number(value) >= 0) {
        setFormData((prev) => ({
          ...prev,
          [name]: Number(value),
        }));
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Real-time validation
    const validation = offerValidator(
      name,
      name === 'offeredPrice' ? Number(value) : value,
    );
    if (!validation.isValid) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: validation.error || '',
      }));
    }
  };

  useEffect(() => {
    const getCurrentOffer = async () => {
      setLoading(true);
      if (!offerId) return;
      const offer = await getOfferById(offerId);
      setOffer(offer);

      console.log(offer);

      if (offer) {
        const currentCustomer = await getUserById(offer.customerId);
        setCustomerUser(currentCustomer);
        const currentService = await getServiceById(offer.serviceId);
        setService(currentService);
        setFormData({
          date: new Date(offer.date),
          offeredPrice: offer.offeredPrice,
          description: offer.description || '',
        });
        setOldFormData({
          date: new Date(offer.date),
          offeredPrice: offer.offeredPrice,
          description: offer.description || '',
        });
      }

      setLoading(false);
    };
    getCurrentOffer();
  }, [offerId]);

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

  if (!offer) {
    return (
      <div>
        <Header />
        <div className="w-full min-h-screen h-fit px-12 py-8 bg-gray-50">
          <OfferNotFound />
        </div>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div>
        <Header />
        <div className="w-full min-h-screen h-fit px-12 py-8 bg-gray-50">
          <ServiceNotFound />
        </div>
        <Footer />
      </div>
    );
  }

  const handleDatePicking = (date: Date | undefined) => {
    if (date) {
      const dateStr = date ? date.toLocaleDateString() : '';
      setFormData((prev) => ({
        ...prev,
        date: date,
      }));

      // Validate date
      const validation = offerValidator('date', dateStr);
      if (!validation.isValid) {
        setValidationErrors((prev) => ({
          ...prev,
          date: validation.error || '',
        }));
      } else {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.date;
          return newErrors;
        });
      }
    }
  };

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();

    if (canSubmit) {
      setUpdating(true);
      const success = await updateOffer(offer._id, formData);
      if (success) {
        setFormData({
          date: null,
          offeredPrice: 0,
          description: '',
        });
        window.location.href = `/account/offer`;
      } else {
        alert('Failed to create service. Please try again.');
      }
      setUpdating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow flex justify-center py-12 px-4">
        <div className="w-[65%] min-h-full bg-gray-100 rounded-2xl border border-gray-300 p-6 shadow-sm">
          {/* Service Information */}
          <div className="flex flex-col gap-4">
            {/* Service Title */}
            <h1
              title={service.title}
              className="text-3xl font-bold text-gray-900"
            >
              {service.title}
            </h1>

            {/* Service Cover Image */}
            {service.coverPhotoUrl ? (
              <img
                src={service.coverPhotoUrl}
                alt={service.title}
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center"></div>
            )}

            {/* Service Description */}
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">Description</h2>
              <p className="text-lg text-gray-700">
                {service.description || 'No description provided.'}
              </p>
            </div>

            {/* Service Provider Name */}
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">Posted By</h2>
              <p className="text-lg text-gray-700">
                {customerUser ? customerUser.name : 'Unknown'}
              </p>
            </div>

            {/* Service Location */}
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">Location</h2>
              <p className="text-lg text-gray-700">
                {service.location ? service.location : 'Unknown'}
              </p>
            </div>

            {/* Service Budget */}
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">Budget</h2>
              <p className="text-lg text-gray-700">฿ {service.budget}</p>
            </div>

            {/* Service Contact */}
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">Contact</h2>
              <div className="flex gap-2 items-center">
                <Phone width={16} />
                <p className="text-lg text-gray-700">{service.telNumber}</p>
              </div>
            </div>

            {/* Service Tags */}
            {service.tags && service.tags.length > 0 && (
              <div className="w-full flex flex-col gap-2">
                <h2 className="text-2xl font-semibold">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {convertTagsToLabels(service.tags).map((tag) => (
                    <span
                      key={tag}
                      className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Service Date */}
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">Date to Perform</h2>
              <div className="flex gap-2 items-center">
                <Calendar width={16} />
                <p className="text-lg text-gray-700">
                  {formatDateToDisplay(service.date)}
                </p>
              </div>
            </div>
          </div>

          <hr className="my-6" />

          {/* Offer Section */}
          <div className="flex flex-col gap-4">
            {/* Offer Title */}
            <h1 className="text-3xl font-bold text-gray-900">Your Offer</h1>

            {/* Offer Date */}
            <div>
              <label
                htmlFor="date"
                className="block text-lg font-medium text-gray-700 mb-1"
              >
                Date to Perform
              </label>
              <MyDatePicker
                onSendData={handleDatePicking}
                disabled={updating}
              />
              {formData.date && (
                <div className="text-sm text-gray-600 mt-2">
                  Selected Date: {formatDateToDisplay(formData.date)}
                </div>
              )}
            </div>

            {/* Offer Offered Price */}
            <div>
              <label
                htmlFor="offeredPrice"
                className="block text-lg font-medium text-gray-700 mb-1"
              >
                Offered Price
              </label>
              <Input
                id="offeredPrice"
                name="offeredPrice"
                type="text"
                placeholder="Offered Price"
                value={formData.offeredPrice}
                onChange={handleInputChange}
                disabled={updating}
                className={`border-gray-300 ${
                  validationErrors.offeredPrice
                    ? 'border-red-500 focus:ring-red-200'
                    : 'focus:ring-blue-200'
                }`}
                min={0}
                max={service.budget}
              />
              {validationErrors.offeredPrice && (
                <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{validationErrors.offeredPrice}</span>
                </div>
              )}
            </div>

            {/* Offer Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-lg font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={updating}
                className={`${
                  validationErrors.description
                    ? 'border-red-500 focus:ring-red-200'
                    : 'focus:ring-blue-200'
                }`}
              />
              {validationErrors.description && (
                <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{validationErrors.description}</span>
                </div>
              )}
            </div>

            {/* Confirmation Button Section */}
            <div className="flex justify-center mt-6 gap-4">
              <ActionButton
                buttonColor="green"
                buttonType="outline"
                onClick={() => setShowConfirm('submit')}
                className="cursor-pointer"
                disabled={!canSubmit || updating}
              >
                Submit
              </ActionButton>
              <ActionButton
                buttonColor="red"
                buttonType="outline"
                onClick={() => setShowConfirm('cancel')}
                fontSize={16}
                disabled={updating}
                className="cursor-pointer"
              >
                Cancel
              </ActionButton>
            </div>
          </div>
        </div>
      </main>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg min-w-[300px] text-center">
            <p className="mb-4 text-lg font-semibold">
              {showConfirm === 'submit'
                ? 'ต้องการแก้ไขคำขอหรือไม่?'
                : 'ต้องการยกเลิกการแก้ไขคำขอหรือไม่? ข้อมูลการกรอกจะไม่ถูกบันทึก'}
            </p>
            <div className="flex justify-center gap-4">
              <ActionButton
                type={`${showConfirm === 'submit' ? 'submit' : 'button'}`}
                buttonColor={`${showConfirm === 'submit' ? 'green' : 'red'}`}
                onClick={() => {
                  setShowConfirm(null);
                  if (showConfirm === 'submit') {
                    handleSubmit();
                  } else {
                    navigate(-1);
                  }
                }}
                className="cursor-pointer"
              >
                Yes
              </ActionButton>
              <ActionButton
                className="cursor-pointer bg-gray-200 text-black border-gray-200"
                onClick={() => setShowConfirm(null)}
              >
                No
              </ActionButton>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
