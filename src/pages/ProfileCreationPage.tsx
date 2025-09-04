import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { Button, buttonVariants } from '@/components/ui/button'; // Assuming path
import { Input } from '@/components/ui/input'; // Assuming path
import { cn } from '@/lib/utils'; // Assuming path

// The Profile Creation Page Component - simplified to match your project structure
export const ProfileCreationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    telephone: '',
    email: '',
    agreedToTerms: false,
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.agreedToTerms) {
      alert('Please agree to the Terms of Service before submitting.');
      return;
    }

    const dataToSend = {
      ...formData,
      profileImage: profileImage ? 'Image Uploaded' : 'No Image',
    };

    // In a real app, you would send this to your backend.
    // For now, we'll just show it in an alert.
    alert(`Form Submitted:\n${JSON.stringify(dataToSend, null, 2)}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-8 bg-purple-300 rounded-full flex items-center justify-center text-white font-bold italic text-lg">
            qdq
          </div>
        </div>

        <h1 className="text-center text-2xl font-bold text-gray-800">
          สร้างบัญชี
        </h1>

        <div className="flex flex-col items-center space-y-3">
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <label
            htmlFor="file-upload"
            className={cn(
              buttonVariants({ variant: 'default', size: 'default' }),
              'cursor-pointer bg-purple-400 hover:bg-purple-500 text-white', // Custom styles
            )}
          >
            Upload
          </label>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            onChange={handleImageUpload}
            accept="image/*"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First name
            </label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last name
            </label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label
              htmlFor="telephone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Telephone number
            </label>
            <Input
              id="telephone"
              name="telephone"
              type="tel"
              placeholder="Tel."
              value={formData.telephone}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Username/Email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex items-center">
            <input
              id="agreedToTerms"
              name="agreedToTerms"
              type="checkbox"
              checked={formData.agreedToTerms}
              onChange={handleInputChange}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label
              htmlFor="agreedToTerms"
              className="ml-2 block text-sm text-gray-900"
            >
              ฉันยอมรับ Term Of Service
            </label>
          </div>

          <Button
            type="submit"
            variant="secondary"
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold"
            disabled={!formData.agreedToTerms}
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfileCreationPage;
