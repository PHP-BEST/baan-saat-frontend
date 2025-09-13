import { useState, useRef, useEffect } from 'react';
import { Pencil, Save, X } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import ActionButton from '@/components/our-components/actionButton';
import ProfileField from '@/components/our-components/profileField';
import { useQuery, useMutation } from '@tanstack/react-query';
import { profileValidator } from '@/utils/profileValidator';
import type { SkillsType } from '@/interfaces/User';
import { fetchData, updateData } from '@/config/api';

const DEFAULT_SKILLS: SkillsType[] = [];

interface SkillOption {
  label: string;
  value: string;
  order: number;
}

const skillOptions: SkillOption[] = [
  { label: 'การทำความสะอาด', value: 'houseCleaning', order: 1 },
  { label: 'การซ่อมแซม', value: 'houseRepair', order: 2 },
  { label: 'ประปา', value: 'plumbing', order: 3 },
  { label: 'ไฟฟ้า', value: 'electrical', order: 4 },
  { label: 'เครื่องปรับอากาศ', value: 'hvac', order: 5 },
  { label: 'การทาสี', value: 'painting', order: 6 },
  { label: 'การจัดสวน', value: 'landscaping', order: 7 },
  { label: 'อื่นๆ', value: 'others', order: 8 },
];

export default function ProfilePage() {
  const { user, updateUser } = useUser();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [skillsChanged, setSkillsChanged] = useState(false);
  const [tempAvatarUrl, setTempAvatarUrl] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [cursorPositions, setCursorPositions] = useState<
    Record<string, number>
  >({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emailFieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Find the pencil button inside the email field and hide it
    if (emailFieldRef.current) {
      const pencilButton = emailFieldRef.current.querySelector('button');
      if (pencilButton) {
        pencilButton.style.display = 'none';
      }
    }
  }, []);

  useEffect(() => {
    const hasUnsavedChanges =
      Object.keys(tempValues).length > 0 ||
      skillsChanged ||
      tempAvatarUrl !== '';
    setHasChanges(hasUnsavedChanges);
  }, [tempValues, skillsChanged, tempAvatarUrl]);

  const {
    isLoading,
    error: fetchError,
    data,
  } = useQuery({
    queryKey: ['profile', user._id],
    queryFn: () => fetchData(user._id),
  });
  const { mutate } = useMutation({
    mutationFn: () =>
      updateData(user._id, {
        ...user,
        lastLoginAt: user.lastLoginAt.toISOString(), // Convert Date to string
        createdAt: user.createdAt.toISOString(), // Convert Date to string
        updatedAt: user.updatedAt.toISOString(), // Convert Date to string
      }),
  });

  useEffect(() => {
    if (!data) return;
    const skillsArray: string[] = Array.isArray(data.providerProfile?.skills)
      ? data.providerProfile.skills
      : [];
    updateUser({
      ...user, // Preserve existing user data
      name: data.name ?? '',
      telNumber: data.telNumber ?? '',
      email: data.email ?? '', // Fetch and update email
      avatarUrl: data.avatarUrl ?? '',
      providerProfile: {
        title: data.providerProfile?.title ?? '',
        description: data.providerProfile?.description ?? '',
        skills: skillsArray.length > 0 ? skillsArray : DEFAULT_SKILLS,
      },
    });
  }, [data]);

  const getFieldValue = (field: string): string => {
    switch (field) {
      case 'name':
        return user.name;
      case 'telNumber':
        return user.telNumber;
      case 'email':
        return user.email;
      case 'description':
        return user.providerProfile?.description || '';
      case 'skills':
        return user.providerProfile?.skills.join(', ') || '';
      default:
        return '';
    }
  };

  const getDisplayValue = (field: string): string => {
    if (tempValues[field] !== undefined) {
      return tempValues[field];
    }
    return getFieldValue(field);
  };

  const getPlaceholderText = (field: string): string => {
    switch (field) {
      case 'name':
        return 'No name provided';
      case 'telNumber':
        return 'No phone number provided';
      case 'email':
        return 'No email provided';
      case 'description':
        return 'No description provided';
      default:
        return 'No information provided';
    }
  };

  const startEditing = (field: string) => {
    if (editingField && editingField !== field) {
      const currentValue = tempValues[editingField] || '';
      const validation = profileValidator(editingField, currentValue);
      if (!validation.isValid) {
        setValidationErrors((prev) => ({
          ...prev,
          [editingField]: validation.error || '',
        }));
        return;
      }
      saveEditing(editingField);
    }
    setEditingField(field);
    setTempValues((prev) => ({ ...prev, [field]: getDisplayValue(field) }));
  };

  const saveEditing = (field: string) => {
    if (editingField === field) {
      const currentValue = tempValues[field] || '';
      const originalValue = getFieldValue(field);
      if (currentValue === originalValue) {
        setTempValues((prev) => {
          const newValues = { ...prev };
          delete newValues[field];
          return newValues;
        });
        setEditingField(null);
        if (field === 'skills') setSkillsChanged(false);
        return;
      }
      const validation = profileValidator(field, currentValue);
      if (!validation.isValid) {
        setValidationErrors((prev) => ({
          ...prev,
          [field]: validation.error || '',
        }));
        return;
      }
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      setEditingField(null);
    }
  };

  const cancelAllChanges = () => {
    setEditingField(null);
    setTempValues({});
    setHasChanges(false);
    setSkillsChanged(false);
    setTempAvatarUrl('');
    setValidationErrors({});
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTempAvatarUrl(imageUrl);
    }
  };

  const submitAllChanges = () => {
    let hasErrors = false;
    const newValidationErrors: Record<string, string> = {};
    Object.entries(tempValues).forEach(([field, value]) => {
      const validation = profileValidator(field, value);
      if (!validation.isValid) {
        newValidationErrors[field] = validation.error || '';
        hasErrors = true;
      }
    });
    if (hasErrors) {
      setValidationErrors(newValidationErrors);
      alert('Please fix validation errors before saving.');
      return;
    }
    let updatedUser = { ...user };
    if (tempAvatarUrl) {
      updatedUser = { ...updatedUser, avatarUrl: tempAvatarUrl };
    }
    Object.entries(tempValues).forEach(([field, value]) => {
      if (field === 'description') {
        updatedUser = {
          ...updatedUser,
          providerProfile: {
            title: updatedUser.providerProfile?.title || '',
            description: value,
            skills: updatedUser.providerProfile?.skills || [],
          },
        };
      } else if (field === 'skills') {
        const skillsArray = value
          ? value.split(', ').filter((s) => s.trim() !== '')
          : [];
        updatedUser = {
          ...updatedUser,
          providerProfile: {
            title: updatedUser.providerProfile?.title || '',
            description: updatedUser.providerProfile?.description || '',
            skills: skillsArray as SkillsType[],
          },
        };
      } else {
        updatedUser = { ...updatedUser, [field]: value };
      }
      mutate(user as unknown as void); // Adjust the type casting as necessary
    });
    updateUser(updatedUser);
    setEditingField(null);
    setTempValues({});
    setHasChanges(false);
    setSkillsChanged(false);
    setTempAvatarUrl('');
    setValidationErrors({});
    alert('Profile updated successfully!');
  };

  // FIXED HERE: remove "editingField === null" condition
  const canSave = hasChanges;

  const commonFieldProperties = {
    editingField,
    tempValues,
    validationErrors,
    getDisplayValue,
    getFieldValue,
    getPlaceholderText,
    startEditing,
    saveEditing,
    setTempValues,
    setValidationErrors,
  };

  if (isLoading) return <p>Loading...</p>;
  if (fetchError) return <p>Error loading profile</p>;

  return (
    <>
      <h1 className="text-2xl font-bold mb-2">Profile</h1>
      <div className="w-full h-full flex flex-col items-center bg-white border border-border-sidebar rounded-2xl px-8 pb-4 pt-8 shadow-sm m-0">
        {/* Avatar Section */}
        <div className="relative flex flex-col items-center mb-6">
          <div className="relative w-28 h-28 rounded-full bg-background-sidebar flex items-center justify-center overflow-hidden">
            {tempAvatarUrl || user.avatarUrl ? (
              <img
                src={tempAvatarUrl || user.avatarUrl}
                alt="Profile Avatar"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <Pencil
                className="w-8 h-8 text-gray-400 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              />
            )}

            {(tempAvatarUrl || user.avatarUrl) && (
              <button
                onClick={() =>
                  setEditingField(editingField === 'avatar' ? null : 'avatar')
                }
                className="absolute bottom-1 right-1 p-2 rounded-full bg-white shadow hover:bg-gray-100"
              >
                <Pencil className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>

          {editingField === 'avatar' && (
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              >
                Upload
              </button>
              {(tempAvatarUrl || user.avatarUrl) && (
                <button
                  onClick={() => {
                    // setTempAvatarUrl('');
                    // setEditingField(null);
                    // setHasChanges(true); // ✅ Reset unsaved changes
                    // setTempValues({});
                    // setSkillsChanged(false);
                    // setValidationErrors({});
                    updateUser({ ...user, avatarUrl: '' });

                    setTempAvatarUrl('');
                    setHasChanges(true);
                    setEditingField(null);
                  }}
                  className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Editable Fields */}
        <div className="space-y-4 w-full">
          <ProfileField
            cancelEditing={function (): void {
              throw new Error('Function not implemented.');
            }}
            label="Name"
            field="name"
            cursorPositions={cursorPositions}
            setCursorPositions={setCursorPositions}
            {...commonFieldProperties}
            setSkillsChanged={setSkillsChanged}
          />
          <ProfileField
            cancelEditing={function (): void {
              throw new Error('Function not implemented.');
            }}
            label="Telephone"
            field="telNumber"
            {...commonFieldProperties}
            cursorPositions={cursorPositions}
            setCursorPositions={setCursorPositions}
            setSkillsChanged={setSkillsChanged}
          />
          <ProfileField
            cancelEditing={function (): void {
              throw new Error('Function not implemented.');
            }}
            label="Email"
            field="email"
            {...commonFieldProperties}
            cursorPositions={cursorPositions}
            setCursorPositions={setCursorPositions}
            setSkillsChanged={setSkillsChanged}
          />
          <ProfileField
            cancelEditing={function (): void {
              throw new Error('Function not implemented.');
            }}
            label="Description"
            field="description"
            {...commonFieldProperties}
            cursorPositions={cursorPositions}
            setCursorPositions={setCursorPositions}
            setSkillsChanged={setSkillsChanged}
          />
          <ProfileField
            cancelEditing={function (): void {
              throw new Error('Function not implemented.');
            }}
            label="Skill & Experience"
            field="skills"
            skillOptions={skillOptions}
            {...commonFieldProperties}
            cursorPositions={cursorPositions}
            setCursorPositions={setCursorPositions}
            setSkillsChanged={setSkillsChanged}
            userSkills={user.providerProfile?.skills}
          />
        </div>

        {/* Save/Cancel */}
        {canSave && (
          <div className="mt-auto flex gap-3">
            <ActionButton
              buttonColor="red"
              buttonType="outline"
              onClick={cancelAllChanges}
            >
              <X className="w-4 h-4" />
              Cancel
            </ActionButton>
            <ActionButton
              buttonColor="blue"
              buttonType="filled"
              onClick={submitAllChanges}
            >
              <Save className="w-4 h-4" />
              Save Changes
            </ActionButton>
          </div>
        )}
      </div>
    </>
  );
}
