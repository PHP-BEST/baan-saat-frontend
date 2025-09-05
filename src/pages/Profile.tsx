import { useState, useRef, useEffect } from 'react';
import { Pencil, Check, Save, X, AlertCircle } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import ActionButton from '@/components/our-components/actionButton';
import { validateField } from '@/utils/formValidator';

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
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

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
      const validation = validateField(editingField, currentValue);

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

      const validation = validateField(field, currentValue);

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

  // Props type for the inner component
  interface EditableFieldProps {
    label: string;
    field: string;
  }

  const EditableField = ({ label, field }: EditableFieldProps) => {
    useEffect(() => {
      if (
        field !== 'skills' &&
        editingField === field &&
        inputRefs.current[field] &&
        cursorPositions[field] !== undefined
      ) {
        const input = inputRefs.current[field];
        input?.focus();
        input?.setSelectionRange(
          cursorPositions[field],
          cursorPositions[field],
        );
      }
    }, [field, editingField, cursorPositions]);

    return (
      <div>
        <span className="font-semibold flex items-center">
          {label}
          {editingField === field ? (
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

        {editingField === field ? (
          <div className="flex flex-col gap-2 mt-1">
            {field === 'skills' ? (
              <div className="grid grid-cols-2 gap-2">
                {skillOptions.map((skillOption) => {
                  const currentSkills = tempValues['skills']
                    ? tempValues['skills']
                        .split(', ')
                        .filter((s) => s.trim() !== '')
                    : user.providerProfile?.skills || [];

                  const isChecked = currentSkills.includes(skillOption.value);

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

                          setTempValues((prev) => ({
                            ...prev,
                            skills: sortedSkills.join(', '),
                          }));
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{skillOption.label}</span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <>
                <input
                  ref={(el) => {
                    inputRefs.current[field] = el;
                  }}
                  type="text"
                  value={tempValues[field] || ''}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    const cursorPos = e.target.selectionStart || 0;
                    setTempValues((prev) => ({ ...prev, [field]: newValue }));
                    setCursorPositions((prev) => ({
                      ...prev,
                      [field]: cursorPos,
                    }));

                    if (validationErrors[field]) {
                      setValidationErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors[field];
                        return newErrors;
                      });
                    }
                  }}
                  onKeyUp={(e) => {
                    const target = e.target as HTMLInputElement;
                    setCursorPositions((prev) => ({
                      ...prev,
                      [field]: target.selectionStart || 0,
                    }));
                  }}
                  onClick={(e) => {
                    const target = e.target as HTMLInputElement;
                    setCursorPositions((prev) => ({
                      ...prev,
                      [field]: target.selectionStart || 0,
                    }));
                  }}
                  className={`border rounded px-2 py-1 flex-1 focus:outline-none focus:ring-2 ${
                    validationErrors[field]
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-blue-200'
                  }`}
                />
                {validationErrors[field] && (
                  <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{validationErrors[field]}</span>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <>
            {field === 'skills' ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {(() => {
                  const currentSkills = tempValues['skills']
                    ? tempValues['skills']
                        .split(', ')
                        .filter((s) => s.trim() !== '')
                    : user.providerProfile?.skills || [];

                  return currentSkills.length ? (
                    currentSkills.map((skillValue, index) => {
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
                  );
                })()}
              </div>
            ) : (
              <>
                {getDisplayValue(field) ? (
                  <p
                    className={
                      tempValues[field] !== undefined &&
                      tempValues[field] !== getFieldValue(field)
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
  };

  const submitAllChanges = () => {
    let hasErrors = false;
    const newValidationErrors: Record<string, string> = {};

    Object.entries(tempValues).forEach(([field, value]) => {
      const validation = validateField(field, value);
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

    // console.log('User Data: ', updatedUser);
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
