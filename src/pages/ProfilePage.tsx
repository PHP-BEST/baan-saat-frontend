import { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchData, updateData } from '@/config/api';
import { EditableField } from '@/components/our-components/Editablecomponent';
//Wait for backend to provide user ID
const USER_ID = 1; // Replace with actual user ID from auth context or similar
// --- Interfaces and Constants (No Change) ---
interface User {
  name: string;
  phone: string;
  email: string;
  description: string;
  skills: string[];
  profilePicture: string;
}

const DEFAULT_SKILLS: string[] = [];

export default function ProfilePage() {
  const [user, setUser] = useState<User>({
    name: '',
    phone: '',
    email: '',
    description: '',
    skills: [],
    profilePicture: '',
  });

  const [editingField, setEditingField] = useState<keyof User | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const {
    isLoading,
    error: fetchError,
    data,
  } = useQuery({
    queryKey: ['profile', USER_ID],
    queryFn: () => fetchData(USER_ID),
  });

  useEffect(() => {
    if (!data) return;
    const skillsArray: string[] = Array.isArray(data.skills) ? data.skills : [];
    setUser({
      name: data.name ?? '',
      phone: data.phone ?? '',
      email: data.email ?? '',
      description: data.description ?? '',
      skills: skillsArray.length > 0 ? skillsArray : DEFAULT_SKILLS,
      profilePicture: data.profilePicture ?? '',
    });
  }, [data]);

  const { mutate } = useMutation<User, unknown, User>({
    mutationFn: (updatedUser: User) => updateData(USER_ID, updatedUser),
  });

  const startEditing = (field: keyof User, value?: string) => {
    setEditingField(field);
    setTempValue(value ?? (user[field] as string) ?? '');
    setError(null);
  };

  const saveEditing = () => {
    if (!editingField) return;

    // For skills, the state is already updated, so just exit edit mode.
    if (editingField === 'skills') {
      setEditingField(null);
      return;
    }

    if (editingField === 'phone') {
      const digitsOnly = tempValue.replace(/\D/g, '');
      if (digitsOnly.length !== 10 || !digitsOnly.startsWith('0')) {
        setError('Phone number must start with 0 and be exactly 10 digits.');
        return;
      }
      const updatedUser = { ...user, phone: digitsOnly };
      setUser(updatedUser);
      setEditingField(null);
      mutate(updatedUser);
      return;
    }

    const updatedUser = { ...user, [editingField]: tempValue } as User;
    setUser(updatedUser);
    setEditingField(null);
    mutate(updatedUser);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setTempValue('');
    setError(null);
  };

  if (isLoading) return <p>Loading profile...</p>;
  if (fetchError) return <p className="text-red-500">Failed to load profile</p>;

  // Create a props object to pass to every EditableField to keep the JSX clean
  const editableFieldProps = {
    user,
    editingField,
    tempValue,
    error,
    startEditing,
    saveEditing,
    cancelEditing,
    setTempValue,
    setUser,
    mutate,
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-2">Profile</h1>
      <div className="w-full h-full flex flex-col items-center bg-white border rounded-2xl p-8 shadow-sm">
        {/* Profile Picture and Delete Button (No Change) */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 mb-6">
          <div
            className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80"
            onClick={() => {
              if (user.profilePicture) return;
              document.getElementById('fileInput')?.click();
            }}
          >
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <Pencil className="w-6 sm:w-8 h-6 sm:h-8 text-gray-500" />
            )}
          </div>

          {user.profilePicture && (
            <div
              onClick={() => document.getElementById('fileInput')?.click()}
              className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-md cursor-pointer hover:bg-gray-100"
            >
              <Pencil className="w-4 h-4 text-gray-600" />
            </div>
          )}

          <input
            id="fileInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  const base64String = reader.result as string;
                  const updatedUser = { ...user, profilePicture: base64String };
                  setUser(updatedUser);
                  mutate(updatedUser);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>
        {user.profilePicture && (
          <button
            onClick={() => {
              const updatedUser = { ...user, profilePicture: '' };
              setUser(updatedUser);
              mutate(updatedUser);
            }}
            className="text-sm text-red-500 hover:underline mb-6"
          >
            Delete photo
          </button>
        )}

        <div className="space-y-8 w-full px-2 sm:px-6">
          <EditableField
            label="Name"
            field="name"
            usedtype="text"
            {...editableFieldProps}
          />
          <EditableField
            label="Telephone"
            field="phone"
            usedtype="tel"
            {...editableFieldProps}
          />
          <EditableField
            label="Email"
            field="email"
            usedtype="email"
            editable={false}
            {...editableFieldProps}
          />
          <EditableField
            label="Description"
            field="description"
            usedtype="text"
            {...editableFieldProps}
          />
          <EditableField
            label="Skill & Experience"
            field="skills"
            usedtype="text"
            {...editableFieldProps}
          />
        </div>
      </div>
    </>
  );
}
