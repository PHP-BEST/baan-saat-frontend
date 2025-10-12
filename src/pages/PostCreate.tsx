import React, {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import Header from '@/components/our-components/header';
import Footer from '@/components/our-components/footer';
import ActionButton from '@/components/our-components/actionButton';
import { TAG_OPTIONS, type PostTag, type TagsOption } from '@/interfaces/Post';
import {
  formatDateToDisplay,
  getCompressedImageUrl,
  isInvalidPostForm,
} from '@/utils/function';
import { postValidator } from '@/utils/postValidator';
import { createPost, type PostFormInterface } from '@/api/post';
import { AlertCircle, Loader } from 'lucide-react';
import MyDatePicker from '@/components/ui/calendar';
import { useUser } from '@/context/UserContext';

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

export const PostCreatePage: React.FC = () => {
  const { user } = useUser();
  if (!user) return;

  const [formData, setFormData] = useState<PostFormInterface>({
    title: '',
    description: '',
    tag: null,
    other: '',
    budget: 0,
    telNumber: user?.telNumber || '',
    location: '',
    coverPhotoUrl: '',
    date: undefined,
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const [adding, setAdding] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === 'budget') {
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
    const validation = postValidator(formData, name);
    if (!validation.isValid) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: validation.error || '',
      }));
    }
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
    setFormData((prev) => ({ ...prev, date }));
    if (date) {
      // Validate date
      const validation = postValidator(formData, 'date');
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

  useEffect(() => {
    const hasNoErrors = Object.keys(validationErrors).length === 0;
    const isFormValid = !adding && hasNoErrors && !isInvalidPostForm(formData);
    setCanSubmit(isFormValid);
  }, [formData, validationErrors, adding]);

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();

    if (canSubmit) {
      setAdding(true);
      const success = await createPost(user._id, formData);
      if (success) {
        setFormData({
          title: '',
          description: '',
          tag: null,
          other: '',
          budget: 0,
          telNumber: user.telNumber || '',
          location: '',
          coverPhotoUrl: '',
          date: undefined,
        });
        window.location.href = `/account/post`;
      } else {
        alert('Failed to create post. Please try again.');
      }
      setAdding(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl space-y-8">
          <h1 className="text-3xl font-bold text-gray-900">Create a Post</h1>
          <form onSubmit={handleSubmit} className="w-full space-y-6">
            {/* Post Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Post Title
              </label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Post Title"
                value={formData.title}
                onChange={handleInputChange}
                disabled={adding}
                className={`border-gray-300 ${
                  validationErrors.title
                    ? 'border-red-500 focus:ring-red-200'
                    : 'focus:ring-blue-200'
                }`}
              />
              {validationErrors.title && (
                <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{validationErrors.title}</span>
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
                disabled={adding}
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

            {/* Tag */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tag
              </label>

              <div className="space-y-2">
                {TAG_OPTIONS.map((tagOption: TagsOption) => (
                  <label
                    key={tagOption.value}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="radio"
                      name="tag"
                      value={tagOption.value}
                      checked={formData.tag === tagOption.value}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          tag: tagOption.value as PostTag,
                          other: '',
                        }))
                      }
                      disabled={adding}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {tagOption.label}
                    </span>
                  </label>
                ))}

                {/* Others */}
                <div>
                  <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="radio"
                      name="tag"
                      value="others"
                      checked={formData.tag === 'others'}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          tag: 'others' as PostTag,
                        }))
                      }
                      disabled={adding}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">อื่นๆ</span>
                  </label>

                  {formData.tag === 'others' && (
                    <div className="mt-2 ml-6">
                      <input
                        id="other"
                        name="other"
                        type="text"
                        placeholder="Please specify..."
                        value={formData.other}
                        onChange={handleInputChange}
                        disabled={adding}
                        className={`w-full border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 transition ${
                          validationErrors.other
                            ? 'border-red-500 focus:border-red-500'
                            : ''
                        }`}
                      />
                      {validationErrors.other && (
                        <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{validationErrors.other}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {validationErrors.tag && (
                <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{validationErrors.tag}</span>
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
                  type="number"
                  placeholder="Budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  disabled={adding}
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
                  disabled={adding}
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

            {/* Contact */}
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
                disabled={adding}
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
                    if (!adding) {
                      document.getElementById('cover-photo-upload')?.click();
                    }
                  }}
                  buttonColor="green"
                  disabled={adding}
                  className={`${adding ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
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
                  disabled={adding}
                />
              </div>
            </div>

            {/* Post Date */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date to Perform
              </label>
              <MyDatePicker onSendData={handleDatePicking} disabled={adding} />
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
                disabled={!canSubmit || adding}
                className={`${canSubmit && !adding ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
              >
                {adding ? (
                  <div className="flex justify-center items-center gap-2">
                    <Loader className="animate-spin" size={16} />
                    <span>Creating...</span>
                  </div>
                ) : (
                  'Submit'
                )}
              </ActionButton>
              <ActionButton
                type="button"
                buttonColor="red"
                disabled={adding}
                className={`${!adding ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                onClick={() => {
                  if (!adding) {
                    window.location.href = `/account/post`;
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
};

export default PostCreatePage;
