import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import Header from '@/components/our-components/header';
import Footer from '@/components/our-components/footer';
import ActionButton from '@/components/our-components/actionButton';

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'>
>(function Textarea({ className, ...props }, ref) {
  // Added function name here
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

// --- The Main Service Creation Page Component ---
export const ServiceCreationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    serviceTitle: '',
    description: '',
    tags: '',
    pricing: '',
    location: '',
  });
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      coverPhoto: coverPhoto ? 'Image Uploaded' : 'No Image',
    };
    alert(`Form Submitted:\n${JSON.stringify(dataToSend, null, 2)}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl space-y-8">
          <h1 className="text-3xl font-bold text-gray-900">Create a Service</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Title */}
            <div>
              <label
                htmlFor="serviceTitle"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Service Title
              </label>
              <Input
                id="serviceTitle"
                name="serviceTitle"
                type="text"
                placeholder="Service Title"
                value={formData.serviceTitle}
                onChange={handleInputChange}
                className="border-gray-300"
              />
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
              />
            </div>

            {/* Tags */}
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tags
              </label>
              <Input
                id="tags"
                name="tags"
                type="text"
                placeholder="Add tags (e.g., cleaning, plumbing, design)"
                value={formData.tags}
                onChange={handleInputChange}
                className="border-gray-300"
              />
            </div>

            {/* Pricing and Location */}
            <div className="flex gap-6">
              <div className="flex-1">
                <label
                  htmlFor="pricing"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Pricing
                </label>
                <Input
                  id="pricing"
                  name="pricing"
                  type="text"
                  placeholder="Pricing"
                  value={formData.pricing}
                  onChange={handleInputChange}
                  className="border-gray-300"
                />
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
                  className="border-gray-300"
                />
              </div>
            </div>

            {/* Cover Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Photo
              </label>
              <div className="mt-1 flex items-center gap-4">
                <div className="w-48 h-32 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                  {coverPhoto ? (
                    <img
                      src={coverPhoto}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-500">Preview</span>
                  )}
                </div>
                <label
                  htmlFor="cover-photo-upload"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'default' }),
                    'cursor-pointer text-green-500 bg-white border-green-500 hover:bg-green-50 hover:text-green-800',
                  )}
                >
                  Upload
                </label>
                <input
                  id="cover-photo-upload"
                  name="cover-photo-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleImageUpload}
                  accept="image/*"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-4">
              <ActionButton
                type="submit"
                buttonColor="blue"
                buttonType="filled"
              >
                Submit
              </ActionButton>
              <ActionButton buttonColor="red" buttonType="outline">
                <Link to="/">Cancel</Link>
              </ActionButton>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceCreationPage;
