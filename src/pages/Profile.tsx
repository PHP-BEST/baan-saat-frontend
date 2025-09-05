import { useState, useRef, useEffect } from 'react';
import { Pencil, Save, X } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import ActionButton from '@/components/our-components/actionButton';
import ProfileField from '@/components/our-components/profileField';
import { profileValidator } from '@/utils/profileValidator';

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

  useEffect(() => {
    const hasUnsavedChanges =
      Object.keys(tempValues).length > 0 ||
      skillsChanged ||
      tempAvatarUrl !== '';
    setHasChanges(hasUnsavedChanges);
  }, [tempValues, skillsChanged, tempAvatarUrl]);

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
    // If already editing another field, validate current field first
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

      // Save current field if valid
      saveEditing(editingField);
    }

    setEditingField(field);
    setTempValues((prev) => ({ ...prev, [field]: getDisplayValue(field) }));
  };

  const saveEditing = (field: string) => {
    if (editingField === field) {
      const currentValue = tempValues[field] || '';
      const originalValue = getFieldValue(field);

      // If value is same as original, remove from temp values
      if (currentValue === originalValue) {
        setTempValues((prev) => {
          const newValues = { ...prev };
          delete newValues[field];
          return newValues;
        });
        setEditingField(null);

        if (field === 'skills') {
          setSkillsChanged(false);
        }

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

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
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

    // Apply avatar change if exists
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
            skills: skillsArray,
          },
        };
      } else {
        updatedUser = { ...updatedUser, [field]: value };
      }
    });

    updateUser(updatedUser);

    setEditingField(null);
    setTempValues({});
    setHasChanges(false);
    setSkillsChanged(false);
    setTempAvatarUrl('');
    setValidationErrors({});

    alert('Profile updated successfully!');

    console.log('User Data: ', updatedUser);
  };

  const canSave = hasChanges && editingField === null;

  return (
    <>
      {/* Header */}
      <h1 className="text-2xl font-bold mb-2">Profile</h1>

      {/* Content */}
      <div className="w-full h-full flex flex-col items-center bg-white border rounded-2xl p-8 shadow-sm m-0">
        {/* Avatar */}
        <div
          onClick={handleAvatarClick}
          className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6 cursor-pointer hover:bg-gray-200 transition-colors overflow-hidden relative group"
        >
          {tempAvatarUrl || user.avatarUrl ? (
            <>
              <img
                src={tempAvatarUrl || user.avatarUrl}
                alt="Profile Avatar"
                className="w-full h-full object-cover rounded-full"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Pencil className="w-6 h-6 text-white" />
              </div>
              {/* Change indicator */}
              {tempAvatarUrl && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-button-upload rounded-full border-2 border-white"></div>
              )}
            </>
          ) : (
            <Pencil className="w-6 h-6 text-gray-500" />
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Editable Fields */}
        <div className="space-y-4 w-full">
          <ProfileField
            label="Name"
            field="name"
            editingField={editingField}
            tempValues={tempValues}
            validationErrors={validationErrors}
            cursorPositions={cursorPositions}
            getDisplayValue={getDisplayValue}
            getFieldValue={getFieldValue}
            getPlaceholderText={getPlaceholderText}
            startEditing={startEditing}
            saveEditing={saveEditing}
            setTempValues={setTempValues}
            setCursorPositions={setCursorPositions}
            setValidationErrors={setValidationErrors}
            setSkillsChanged={setSkillsChanged}
          />
          <ProfileField
            label="Telephone"
            field="telNumber"
            editingField={editingField}
            tempValues={tempValues}
            validationErrors={validationErrors}
            cursorPositions={cursorPositions}
            getDisplayValue={getDisplayValue}
            getFieldValue={getFieldValue}
            getPlaceholderText={getPlaceholderText}
            startEditing={startEditing}
            saveEditing={saveEditing}
            setTempValues={setTempValues}
            setCursorPositions={setCursorPositions}
            setValidationErrors={setValidationErrors}
            setSkillsChanged={setSkillsChanged}
          />
          <ProfileField
            label="Email"
            field="email"
            editingField={editingField}
            tempValues={tempValues}
            validationErrors={validationErrors}
            cursorPositions={cursorPositions}
            getDisplayValue={getDisplayValue}
            getFieldValue={getFieldValue}
            getPlaceholderText={getPlaceholderText}
            startEditing={startEditing}
            saveEditing={saveEditing}
            setTempValues={setTempValues}
            setCursorPositions={setCursorPositions}
            setValidationErrors={setValidationErrors}
            setSkillsChanged={setSkillsChanged}
          />
          <ProfileField
            label="Description"
            field="description"
            editingField={editingField}
            tempValues={tempValues}
            validationErrors={validationErrors}
            cursorPositions={cursorPositions}
            getDisplayValue={getDisplayValue}
            getFieldValue={getFieldValue}
            getPlaceholderText={getPlaceholderText}
            startEditing={startEditing}
            saveEditing={saveEditing}
            setTempValues={setTempValues}
            setCursorPositions={setCursorPositions}
            setValidationErrors={setValidationErrors}
            setSkillsChanged={setSkillsChanged}
          />
          <ProfileField
            label="Skill & Experience"
            field="skills"
            skillOptions={skillOptions}
            editingField={editingField}
            tempValues={tempValues}
            validationErrors={validationErrors}
            cursorPositions={cursorPositions}
            getDisplayValue={getDisplayValue}
            getFieldValue={getFieldValue}
            getPlaceholderText={getPlaceholderText}
            startEditing={startEditing}
            saveEditing={saveEditing}
            setTempValues={setTempValues}
            setCursorPositions={setCursorPositions}
            setValidationErrors={setValidationErrors}
            setSkillsChanged={setSkillsChanged}
            userSkills={user.providerProfile?.skills}
          />
        </div>

        {/* Submit Button */}
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
