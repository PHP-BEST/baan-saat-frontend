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
  type Post,
  type PostTag,
  type TagsOption,
} from '@/interfaces/Post';
import { postValidator } from '@/utils/postValidator';
import { Loader, AlertCircle } from 'lucide-react';
import { formatDateToDisplay, isInvalidPostForm } from '@/utils/function';
import Loading from '@/components/our-components/loading';
import { getPostById, updatePost, type PostFormInterface } from '@/api/post';
import MyDatePicker from '@/components/ui/calendar';
import PostNotFound from '@/error/PostNotFound';
import { uploadImages } from '@/api/upload';

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

function isFormDataSameAsOldPost(
  formData: PostFormInterface,
  post: Post | null,
) {
  if (!post) return false;

  const formDateStr = formData.date
    ? new Date(formData.date).toISOString().split('T')[0]
    : null;
  const postDateStr = post.date
    ? new Date(post.date).toISOString().split('T')[0]
    : null;

  type ImageFields = {
    coverPhotoUrl?: string | null;
    coverPhotoUrls?: string[] | null;
    image1?: string | null;
    image2?: string | null;
    image3?: string | null;
  };

  const normCover = (x: ImageFields): string => {
    if (x.coverPhotoUrl && x.coverPhotoUrl.length > 0) return x.coverPhotoUrl;
    if (Array.isArray(x.coverPhotoUrls) && x.coverPhotoUrls.length > 0) {
      return x.coverPhotoUrls[0] ?? '';
    }
    return '';
  };

  const normSupport = (x: ImageFields): string[] => {
    const fromNew = [x.image1, x.image2, x.image3].filter(
      (v): v is string => typeof v === 'string' && v.length > 0,
    );
    if (fromNew.length > 0) return fromNew.slice(0, 3);

    if (Array.isArray(x.coverPhotoUrls)) {
      return x.coverPhotoUrls
        .slice(1, 4)
        .filter((v): v is string => typeof v === 'string' && v.length > 0);
    }
    return [];
  };

  const formCover = normCover(formData);
  const postCover = normCover(post);

  const formSupport = normSupport(formData);
  const postSupport = normSupport(post);

  const supportsEqual =
    formSupport.length === postSupport.length &&
    formSupport.every((u, i) => u === postSupport[i]);

  return (
    formData.title === post.title &&
    formData.description === post.description &&
    formData.tag === post.tag &&
    formData.budget === post.budget &&
    formData.location === post.location &&
    formData.telNumber === post.telNumber &&
    formCover === postCover &&
    supportsEqual &&
    formDateStr === postDateStr
  );
}

export default function PostEditPage() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [formData, setFormData] = useState<PostFormInterface>({
    title: '',
    description: '',
    tag: null,
    other: '',
    budget: 0,
    location: '',
    coverPhotoUrl: '',
    image1: '',
    image2: '',
    image3: '',
    telNumber: '',
    date: undefined,
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const fetchService = async () => {
      if (!postId) return;

      setLoading(true);
      const currentPost = await getPostById(postId);
      setPost(currentPost);

      type ImageFields = {
        coverPhotoUrl?: unknown;
        coverPhotoUrls?: unknown;
        image1?: unknown;
        image2?: unknown;
        image3?: unknown;
      };
      const img = (currentPost ?? {}) as ImageFields;

      const coverFromNew =
        typeof img.coverPhotoUrl === 'string' ? img.coverPhotoUrl : '';
      const supportFromNew = [img.image1, img.image2, img.image3].filter(
        (v): v is string => typeof v === 'string' && v.length > 0,
      );

      const cover = coverFromNew || '';
      const seen = new Set<string>();
      const support = supportFromNew
        .filter((u) => !!u && u !== cover)
        .filter((u) => (seen.has(u) ? false : (seen.add(u), true)))
        .slice(0, 3);

      const rawDate = currentPost?.date;
      let parsedDate: Date | undefined;
      if (rawDate instanceof Date) {
        parsedDate = rawDate;
      } else if (typeof rawDate === 'string' || typeof rawDate === 'number') {
        const d = new Date(rawDate);
        parsedDate = Number.isNaN(d.getTime()) ? undefined : d;
      } else {
        parsedDate = undefined;
      }
      setFormData({
        title: currentPost?.title || '',
        description: currentPost?.description || '',
        tag: currentPost?.tag || null,
        other: currentPost?.other || '',
        budget: currentPost?.budget || 0,
        location: currentPost?.location || '',
        telNumber: currentPost?.telNumber || '',
        date: parsedDate,
        coverPhotoUrl: cover,
        image1: support[0] ?? '',
        image2: support[1] ?? '',
        image3: support[2] ?? '',
      });
      setLoading(false);
    };
    fetchService();
  }, [postId]);

  useEffect(() => {
    if (
      Object.keys(validationErrors).length === 0 &&
      !updating &&
      !isInvalidPostForm(formData) &&
      !isFormDataSameAsOldPost(formData, post)
    ) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [formData, validationErrors, updating, post]);

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

  if (!post) {
    return (
      <div>
        <Header />
        <div className="w-full min-h-screen h-fit px-12 py-8 bg-gray-50">
          <PostNotFound />
        </div>
        <Footer />
      </div>
    );
  }

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

  type UploadMode = 'cover' | 'support';

  const handleImagesUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    mode: UploadMode,
  ) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    try {
      // const urls = await Promise.all(
      //   files.map((f) => getCompressedImageUrl(f, 600, 0.6)),
      // );
      const urls = await uploadImages(files);

      setFormData((prev) => {
        if (mode === 'cover') {
          return {
            ...prev,
            coverPhotoUrl: urls[0] ?? '',
          };
        }

        const slots = [prev.image1 || '', prev.image2 || '', prev.image3 || ''];
        const seen = new Set<string>(
          [prev.coverPhotoUrl, ...slots].filter(Boolean) as string[],
        );

        for (const u of urls) {
          if (!u || seen.has(u)) continue;
          const emptyIdx = slots.findIndex((s) => !s);
          if (emptyIdx === -1) break;
          slots[emptyIdx] = u;
          seen.add(u);
        }

        return {
          ...prev,
          image1: slots[0] || '',
          image2: slots[1] || '',
          image3: slots[2] || '',
        };
      });

      e.target.value = '';
    } catch (err) {
      console.error('Error processing images:', err);
    }
  };

  const handleImagesRemove = (idx: 1 | 2 | 3) =>
    setFormData((prev) => {
      const slots = [prev.image1 || '', prev.image2 || '', prev.image3 || ''];
      slots[idx - 1] = '';
      const compact = slots.filter(Boolean);
      return {
        ...prev,
        image1: compact[0] ?? '',
        image2: compact[1] ?? '',
        image3: compact[2] ?? '',
      };
    });

  const handleDatePicking = (date: Date | undefined) => {
    if (date) {
      // Validate date
      formData.date = date;
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

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    if (!postId) return;
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
        const validation = postValidator(formData, field);
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
      const success = await updatePost(postId, formData);
      if (success) {
        window.location.href = `/account/post`;
      } else {
        alert('Failed to update post. Please try again.');
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
          <h1 className="text-3xl font-bold text-gray-900">Update a Post</h1>
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
                      disabled={updating}
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
                      disabled={updating}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Others</span>
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
                        disabled={updating}
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
                Cover Photo (up to 1)
              </label>

              <div className="mt-1 flex flex-col items-start gap-4">
                {/* Cover Photo */}
                <div className="mt-1">
                  <div className="grid grid-cols-3 gap-3">
                    {formData.coverPhotoUrl ? (
                      <div className="relative w-48 h-32 rounded-md overflow-hidden">
                        <img
                          src={formData.coverPhotoUrl}
                          alt="Cover"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-white/90 rounded w-6 h-6 px-1 text-m shadow"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              coverPhotoUrl: '',
                            }))
                          }
                          disabled={updating}
                          aria-label="Remove cover image"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="col-span-3 w-48 h-32 rounded-md bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                        <span className="text-xs text-gray-500">
                          Cover Photo Preview
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <ActionButton
                  type="button"
                  onClick={() => {
                    if (!updating)
                      document.getElementById('cover-photo-upload')?.click();
                  }}
                  buttonColor="green"
                  disabled={updating || !!formData.coverPhotoUrl}
                  className={`${updating || !!formData.coverPhotoUrl ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                >
                  Upload
                </ActionButton>
                <input
                  id="cover-photo-upload"
                  name="cover-photo-upload"
                  type="file"
                  className="sr-only"
                  onChange={(e) => handleImagesUpload(e, 'cover')}
                  accept="image/*"
                  disabled={updating || !!formData.coverPhotoUrl}
                />
              </div>
            </div>

            {/* Supporting Photos */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supporting Photos (up to 3)
              </label>

              <div className="mt-1 flex flex-col items-start gap-4">
                <div className="mt-1">
                  <div className="grid grid-cols-3 gap-3">
                    {[formData.image1, formData.image2, formData.image3].filter(
                      Boolean,
                    ).length > 0 ? (
                      <>
                        {[
                          formData.image1,
                          formData.image2,
                          formData.image3,
                        ].map((url, i) =>
                          url ? (
                            <div
                              key={i}
                              className="relative w-48 h-32 rounded-md overflow-hidden"
                            >
                              <img
                                src={url}
                                alt={`Supporting ${i + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                className="absolute top-2 right-2 bg-white/90 rounded w-6 h-6 px-1 text-m shadow"
                                onClick={() =>
                                  handleImagesRemove((i + 1) as 1 | 2 | 3)
                                }
                                disabled={updating}
                                aria-label={`Remove supporting image ${i + 1}`}
                              >
                                ×
                              </button>
                            </div>
                          ) : null,
                        )}
                      </>
                    ) : (
                      <div className="col-span-3 w-48 h-32 rounded-md bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                        <span className="text-xs text-gray-500">
                          Supporting Photo Preview
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <ActionButton
                  type="button"
                  onClick={() => {
                    if (!updating)
                      document
                        .getElementById('supporting-photos-upload')
                        ?.click();
                  }}
                  buttonColor="green"
                  disabled={
                    updating ||
                    [formData.image1, formData.image2, formData.image3].filter(
                      Boolean,
                    ).length >= 3
                  }
                  className={`${
                    updating ||
                    [formData.image1, formData.image2, formData.image3].filter(
                      Boolean,
                    ).length >= 3
                      ? 'cursor-not-allowed opacity-50'
                      : 'cursor-pointer'
                  }`}
                >
                  Upload
                </ActionButton>
                <input
                  id="supporting-photos-upload"
                  name="supporting-photos-upload"
                  type="file"
                  className="sr-only"
                  onChange={(e) => handleImagesUpload(e, 'support')}
                  accept="image/*"
                  multiple
                  disabled={
                    updating ||
                    [formData.image1, formData.image2, formData.image3].filter(
                      Boolean,
                    ).length >= 3
                  }
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
                disabled={updating}
                className={`${!updating ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                onClick={() => {
                  if (!updating) {
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
}
