import { useState, useRef, useEffect } from 'react';
import { Pencil, Check, Save, X } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import ActionButton from '@/components/our-components/actionButton';

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
  const [editingFields, setEditingFields] = useState<Set<string>>(new Set());
  const [tempValues, setTempValues] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [skillsChanged, setSkillsChanged] = useState(false);
  const [tempAvatarUrl, setTempAvatarUrl] = useState<string>('');
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
    setEditingFields((prev) => new Set([...prev, field]));
    setTempValues((prev) => ({ ...prev, [field]: getFieldValue(field) }));
  };

  const saveEditing = (field: string) => {
    if (editingFields.has(field)) {
      setEditingFields((prev) => {
        const newSet = new Set(prev);
        newSet.delete(field);
        return newSet;
      });
    }
  };

  const cancelEditing = (field: string) => {
    setEditingFields((prev) => {
      const newSet = new Set(prev);
      newSet.delete(field);
      return newSet;
    });
    setTempValues((prev) => {
      const newValues = { ...prev };
      delete newValues[field];
      return newValues;
    });
  };

  const cancelAllChanges = () => {
    setEditingFields(new Set());
    setTempValues({});
    setHasChanges(false);
    setSkillsChanged(false);
    setTempAvatarUrl('');
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

  // Props type for the inner component
  interface EditableFieldProps {
    label: string;
    field: string;
  }

  const EditableField = ({ label, field }: EditableFieldProps) => (
    <div>
      <span className="font-semibold flex items-center">
        {label}
        {editingFields.has(field) ? (
          <Check
            onClick={() => saveEditing(field)}
            className="w-4 h-4 ml-2 text-green-600 cursor-pointer hover:text-green-700"
          />
        ) : (
          <Pencil
            onClick={() => startEditing(field)}
            className="w-4 h-4 ml-2 text-gray-500 cursor-pointer hover:text-gray-700"
          />
        )}
      </span>

      {editingFields.has(field) ? (
        <div className="flex flex-col gap-2 mt-1">
          {field === 'skills' ? (
            <div className="grid grid-cols-2 gap-2">
              {skillOptions.map((skillOption) => {
                const isChecked =
                  user.providerProfile?.skills.includes(skillOption.value) ||
                  false;
                return (
                  <label
                    key={skillOption.value}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        setSkillsChanged(true);
                        const currentSkills =
                          user.providerProfile?.skills || [];
                        let newSkills;
                        if (e.target.checked) {
                          newSkills = [...currentSkills, skillOption.value];
                        } else {
                          newSkills = currentSkills.filter(
                            (s) => s !== skillOption.value,
                          );
                        }

                        // Sort skills according to the order defined in skillOptions
                        const sortedSkills = skillOptions
                          .filter((skill) => newSkills.includes(skill.value))
                          .sort((a, b) => a.order - b.order)
                          .map((skill) => skill.value);

                        updateUser({
                          ...user,
                          providerProfile: {
                            title: user.providerProfile?.title || '',
                            description:
                              user.providerProfile?.description || '',
                            skills: sortedSkills,
                          },
                        });
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{skillOption.label}</span>
                  </label>
                );
              })}
            </div>
          ) : (
            <input
              type="text"
              value={tempValues[field] || ''}
              onChange={(e) =>
                setTempValues((prev) => ({ ...prev, [field]: e.target.value }))
              }
              className="border rounded px-2 py-1 flex-1"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEditing(field);
                if (e.key === 'Escape') cancelEditing(field);
              }}
            />
          )}
        </div>
      ) : (
        <>
          {field === 'skills' ? (
            <div className="flex flex-wrap gap-2 mt-1">
              {user.providerProfile?.skills.length ? (
                user.providerProfile.skills.map((skillValue, index) => {
                  const skillOption = skillOptions.find(
                    (s) => s.value === skillValue,
                  );
                  return (
                    <span
                      key={index}
                      className="px-3 py-1 bg-background border border-gray-300 rounded-full text-sm text-black"
                    >
                      {skillOption?.label || skillValue}
                    </span>
                  );
                })
              ) : (
                <p className="text-gray-500">No skills selected</p>
              )}
            </div>
          ) : (
            <>
              {getDisplayValue(field) ? (
                <p
                  className={
                    tempValues[field] !== undefined
                      ? 'text-button-upload font-medium'
                      : ''
                  }
                >
                  {getDisplayValue(field)}
                </p>
              ) : (
                <p className="text-gray-500">{getPlaceholderText(field)}</p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );

  const submitAllChanges = () => {
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
      } else if (field !== 'skills') {
        updatedUser = { ...updatedUser, [field]: value };
      }
    });

    updateUser(updatedUser);

    setEditingFields(new Set());
    setTempValues({});
    setHasChanges(false);
    setSkillsChanged(false);
    setTempAvatarUrl('');

    alert('Profile updated successfully!');
  };

  const canSave = hasChanges && editingFields.size === 0;

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
          <EditableField label="Name" field="name" />
          <EditableField label="Telephone" field="telNumber" />
          <EditableField label="Email" field="email" />
          <EditableField label="Description" field="description" />
          <EditableField label="Skill & Experience" field="skills" />
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
