import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { Button, buttonVariants } from '@/components/ui/button'; // Assuming path
import { Input } from '@/components/ui/input'; // Assuming path
import { cn } from '@/lib/utils'; // Assuming path

// --- Modal Component for Terms of Service ---
interface ModalProps {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}

const TermsModal: React.FC<ModalProps> = ({ title, onClose, children }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg animate-fade-in-up">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </Button>
                </div>
                <div className="text-sm text-gray-600 max-h-[60vh] overflow-y-auto pr-2 space-y-4">
                    {children}
                </div>
                <div className="mt-6 flex justify-end">
                    <Button onClick={onClose} className="bg-purple-500 hover:bg-purple-600 text-white">
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};


// --- The Main Profile Creation Page Component ---
export const ProfileCreationPage: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        telephone: '',
        email: '',
        agreedToTerms: false,
    });
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false); // State for the modal

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
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
            alert("Please agree to the Terms of Service before submitting.");
            return;
        }

        const dataToSend = {
            ...formData,
            profileImage: profileImage ? 'Image Uploaded' : 'No Image',
        };

        alert(`Form Submitted:\n${JSON.stringify(dataToSend, null, 2)}`);
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
                    <div className="flex justify-center">
                        {/* Use a direct path from the public folder */}
                        <img src="/logo.png" alt="Company Logo" className="h-12" />
                    </div>

                    <h1 className="text-center text-2xl font-bold text-gray-800">
                        สร้างบัญชี
                    </h1>

                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300">
                        {profileImage ? (
                            <img src={profileImage} alt="Profile Preview" className="w-full h-full object-cover" />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        )}
                        </div>
                        <label 
                          htmlFor="file-upload" 
                          className={cn(
                            buttonVariants({ variant: 'default', size: 'default' }),
                            'cursor-pointer bg-purple-400 hover:bg-purple-500 text-white'
                          )}
                        >
                            Upload
                        </label>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*"/>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                            <Input id="firstName" name="firstName" type="text" placeholder="First name" value={formData.firstName} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                            <Input id="lastName" name="lastName" type="text" placeholder="Last name" value={formData.lastName} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">Telephone number</label>
                            <Input id="telephone" name="telephone" type="tel" placeholder="Tel." value={formData.telephone} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <Input id="email" name="email" type="email" placeholder="Username/Email" value={formData.email} onChange={handleInputChange} />
                        </div>
                        
                        <div className="flex items-center">
                            <input id="agreedToTerms" name="agreedToTerms" type="checkbox" checked={formData.agreedToTerms} onChange={handleInputChange} className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"/>
                            <label htmlFor="agreedToTerms" className="ml-2 block text-sm text-gray-900">
                                ฉันยอมรับ{' '}
                                <span
                                    className="text-purple-600 hover:underline cursor-pointer font-medium"
                                    onClick={(e) => {
                                        e.preventDefault(); // Prevents checkbox from toggling
                                        setIsTermsModalOpen(true);
                                    }}
                                >
                                    Term Of Service
                                </span>
                            </label>
                        </div>

                        <Button type="submit" variant="secondary" className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold" disabled={!formData.agreedToTerms}>
                            Submit
                        </Button>
                    </form>
                </div>
            </div>

            {/* Render the modal conditionally based on state */}
            {isTermsModalOpen && (
                <TermsModal title="Terms of Service" onClose={() => setIsTermsModalOpen(false)}>
                    <p><strong>Last updated: September 5, 2025</strong></p>
                    <p>
                        Please read these terms and conditions carefully before using Our Service.
                    </p>
                    <h3 className="font-bold mt-2">1. Acknowledgment</h3>
                    <p>
                        These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.
                    </p>
                    <h3 className="font-bold mt-2">2. User Accounts</h3>
                    <p>
                        When You create an account with Us, You must provide Us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of Your account on Our Service.
                    </p>
                    <h3 className="font-bold mt-2">3. Termination</h3>
                    <p>
                        We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions.
                        Upon termination, Your right to use the Service will cease immediately.
                    </p>
                     <p>
                        (This is placeholder text. You should replace this with your actual terms of service.)
                    </p>
                </TermsModal>
            )}
        </>
    );
};

export default ProfileCreationPage;