import React, {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Header from '@/components/our-components/header';
import Footer from '@/components/our-components/footer';
import ActionButton from '@/components/our-components/actionButton';
import {
  TAG_OPTIONS,
  type Service,
  type ServiceTag,
  type TagsOption,
} from '@/interfaces/Service';
import { serviceValidator } from '@/utils/serviceValidator';
import { Loader, AlertCircle } from 'lucide-react';
import {
  formatDateToDisplay,
  getCompressedImageUrl,
  isInvalidServiceForm,
} from '@/utils/function';
import Loading from '@/components/our-components/loading';
import {
  getServiceById,
  updateService,
  type ServiceFormInterface,
} from '@/api/service';
import MyDatePicker from '@/components/ui/calendar';

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

function isFormDataSameAsOldService(
  formData: ServiceFormInterface,
  service: Service | null,
) {
  if (!service) return false;

  // Handle date comparison separately
  const formDateStr = formData.date
    ? new Date(formData.date).toISOString().split('T')[0]
    : null;
  const serviceDateStr = service.date
    ? new Date(service.date).toISOString().split('T')[0]
    : null;

  return (
    formData.title === service.title &&
    formData.description === service.description &&
    JSON.stringify(formData.tags.sort()) ===
      JSON.stringify((service.tags || []).sort()) &&
    formData.budget === service.budget &&
    formData.location === service.location &&
    formData.coverPhotoUrl === service.coverPhotoUrl &&
    formDateStr === serviceDateStr &&
    formData.telNumber === service.telNumber
  );
}

export default function ServiceEditPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [formData, setFormData] = useState<ServiceFormInterface>({
    title: '',
    description: '',
    tags: [],
    budget: 0,
    location: '',
    coverPhotoUrl: '',
    telNumber: '',
    date: null,
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId) return;

      setLoading(true);
      const currentService = await getServiceById(serviceId);
      setService(currentService);
      setFormData({
        title: currentService?.title || '',
        description: currentService?.description || '',
        tags: Array.isArray(currentService?.tags) ? currentService.tags : [],
        budget: currentService?.budget || 0,
        location: currentService?.location || '',
        coverPhotoUrl: currentService?.coverPhotoUrl || '',
        telNumber: currentService?.telNumber || '',
        date: currentService?.date || null,
      });

      setLoading(false);
    };

    fetchService();
  }, [serviceId]);

  useEffect(() => {
    if (
      Object.keys(validationErrors).length === 0 &&
      !updating &&
      !isInvalidServiceForm(formData) &&
      !isFormDataSameAsOldService(formData, service)
    ) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [formData, validationErrors]);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="w-full min-h-screen h-fit px-12 py-8 bg-gray-50">
          <Loading />
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
          <div className="flex flex-col gap-4 justify-center items-center">
            <p className="text-2xl font-semibold">
              Sorry, We couldn&apos;t find the service you&apos;re looking
              for...
            </p>
            <ActionButton
              onClick={() => {
                window.history.back();
              }}
              buttonType="outline"
            >
              Back
            </ActionButton>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'budget' ? Number(value) : value,
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
    const validation = serviceValidator(
      name,
      name === 'budget' ? Number(value) : value,
    );
    if (!validation.isValid) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: validation.error || '',
      }));
    }
  };

  const handleTagChange = (tagValue: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      tags: checked
        ? [...prev.tags, tagValue as ServiceTag]
        : prev.tags.filter((t) => t !== tagValue),
    }));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const compressedCoverPhotoUrl = await getCompressedImageUrl(
          file,
          600,
          0.6,
        );

        setFormData((prev) => ({
          ...prev,
          coverPhotoUrl: compressedCoverPhotoUrl,
        }));
      } catch (err) {
        console.error('Error processing image:', err);
      }
    }
  };

  const handleDatePicking = (date: Date | undefined) => {
    if (date) {
      const dateStr = date ? date.toLocaleDateString() : '';
      setFormData((prev) => ({
        ...prev,
        date: date,
      }));

      // Validate date
      const validation = serviceValidator('date', dateStr);
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
    if (!serviceId) return;
    if (e) e.preventDefault();

    // Validate all fields before submission
    const fieldsToValidate = {
      title: formData.title,
      description: formData.description,
      budget: formData.budget,
      location: formData.location,
      telNumber: formData.telNumber,
      date: formData.date,
    };

    const newErrors: Record<string, string> = {};

    // Validate each field
    Object.entries(fieldsToValidate).forEach(([field, value]) => {
      if (value === null) {
        newErrors[field] = `${field} is required`;
      } else {
        const validation = serviceValidator(field, value);
        if (!validation.isValid) {
          newErrors[field] = validation.error || '';
        }
      }
    });

    // Update validation errors state
    setValidationErrors(newErrors);

    // Only proceed if there are no validation errors
    if (Object.keys(newErrors).length === 0 && canSubmit) {
      setUpdating(true);
      const success = await updateService(serviceId, formData);
      if (success) {
        window.location.href = `/account/service`;
      } else {
        alert('Failed to update service. Please try again.');
      }
      setUpdating(false);
    } else {
      const firstErrorField = document.querySelector('.text-red-500');
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl space-y-8">
          <h1 className="text-3xl font-bold text-gray-900">Update a Service</h1>
          <form onSubmit={handleSubmit} className="w-full space-y-6">
            {/* Service Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Service Title
              </label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Service Title"
                value={formData.title}
                onChange={handleInputChange}
                disabled={updating}
                className={`border-gray-300 ${
                  validationErrors.serviceTitle
                    ? 'border-red-500 focus:ring-red-200'
                    : 'focus:ring-blue-200'
                }`}
              />
              {validationErrors.serviceTitle && (
                <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{validationErrors.serviceTitle}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
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

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tags
              </label>
              <div className="grid grid-cols-2 gap-3">
                {TAG_OPTIONS.map((tagOption: TagsOption) => (
                  <label
                    key={tagOption.value}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={formData.tags.includes(
                        tagOption.value as ServiceTag,
                      )}
                      onChange={(e) =>
                        handleTagChange(tagOption.value, e.target.checked)
                      }
                      disabled={updating}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {tagOption.label}
                    </span>
                  </label>
                ))}
              </div>
              {validationErrors.tags && (
                <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{validationErrors.tags}</span>
                </div>
              )}
            </div>

            {/* Budget and Location */}
            <div className="flex gap-6">
              <div className="flex-1">
                <label
                  htmlFor="budget"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Budget
                </label>
                <Input
                  id="budget"
                  name="budget"
                  type="text"
                  placeholder="Budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  disabled={updating}
                  className={`border-gray-300 ${
                    validationErrors.budget
                      ? 'border-red-500 focus:ring-red-200'
                      : 'focus:ring-blue-200'
                  }`}
                  min={0}
                />
                {validationErrors.budget && (
                  <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{validationErrors.budget}</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Location
                </label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleInputChange}
                  disabled={updating}
                  className={`border-gray-300 ${
                    validationErrors.location
                      ? 'border-red-500 focus:ring-red-200'
                      : 'focus:ring-blue-200'
                  }`}
                />
                {validationErrors.location && (
                  <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{validationErrors.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Number */}
            <div>
              <label
                htmlFor="contact"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contact Number
              </label>
              <Input
                id="telNumber"
                name="telNumber"
                type="text"
                placeholder="Contact Number"
                value={formData.telNumber}
                onChange={handleInputChange}
                disabled={updating}
                className={`border-gray-300 ${
                  validationErrors.telNumber
                    ? 'border-red-500 focus:ring-red-200'
                    : 'focus:ring-blue-200'
                }`}
              />
              {validationErrors.telNumber && (
                <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{validationErrors.telNumber}</span>
                </div>
              )}
            </div>

            {/* Cover Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Photo
              </label>

              <div className="mt-1 flex flex-col items-start gap-4">
                <div className="w-48 h-32 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                  {formData.coverPhotoUrl ? (
                    <img
                      src={formData.coverPhotoUrl}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-500">Preview</span>
                  )}
                </div>
                <ActionButton
                  type="button"
                  onClick={() => {
                    if (!updating) {
                      document.getElementById('cover-photo-upload')?.click();
                    }
                  }}
                  buttonType="outline"
                  buttonColor="green"
                  disabled={updating}
                  className={`${updating ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                >
                  Upload
                </ActionButton>
                <input
                  id="cover-photo-upload"
                  name="cover-photo-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleImageUpload}
                  accept="image/*"
                  disabled={updating}
                />
              </div>
            </div>

            {/* Service Date */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-1"
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

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-4">
              <ActionButton
                type="submit"
                buttonColor="blue"
                buttonType="filled"
                disabled={!canSubmit || updating}
                className={`${canSubmit && !updating ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
              >
                {updating ? (
                  <div className="flex justify-center items-center gap-2">
                    <Loader className="animate-spin" size={16} />
                    <span>Updating...</span>
                  </div>
                ) : (
                  'Submit'
                )}
              </ActionButton>
              <ActionButton
                type="button"
                buttonColor="red"
                buttonType="outline"
                disabled={updating}
                className={`${!updating ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                onClick={() => {
                  if (!updating) {
                    window.location.href = `/account/service`;
                  }
                }}
              >
                Cancel
              </ActionButton>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
