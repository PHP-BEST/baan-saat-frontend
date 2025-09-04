import { useState, useRef } from 'react';
import { Pencil, Check } from 'lucide-react';
import { useUser } from '@/context/UserContext';

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
  const [tempValue, setTempValue] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const startEditing = (field: string) => {
    setEditingField(field);
    setTempValue(getFieldValue(field));
  };

  const saveEditing = () => {
    if (editingField) {
      if (editingField === 'description') {
        updateUser({
          ...user,
          providerProfile: {
            title: user.providerProfile?.title || '',
            description: tempValue,
            skills: user.providerProfile?.skills || [],
          },
        });
      } else if (editingField === 'skills') {
        const validSkillValues = skillOptions.map((skill) => skill.value);
        const validSkills = tempValue
          .split(',')
          .map((skill) => skill.trim())
          .filter((skill) => skill && validSkillValues.includes(skill));

        updateUser({
          ...user,
          providerProfile: {
            title: user.providerProfile?.title || '',
            description: user.providerProfile?.description || '',
            skills: validSkills,
          },
        });
      } else {
        updateUser({ ...user, [editingField]: tempValue });
      }
      setEditingField(null);
    }
  };

  const cancelEditing = () => {
    setEditingField(null);
    setTempValue('');
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      updateUser({ ...user, avatarUrl: imageUrl });
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
        {editingField === field ? (
          <Check
            onClick={() => setEditingField(null)}
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
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="border rounded px-2 py-1 flex-1"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEditing();
                if (e.key === 'Escape') cancelEditing();
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
            <p>{getFieldValue(field)}</p>
          )}
        </>
      )}
    </div>
  );

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
          {user.avatarUrl ? (
            <>
              <img
                src={user.avatarUrl}
                alt="Profile Avatar"
                className="w-full h-full object-cover rounded-full"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Pencil className="w-6 h-6 text-white" />
              </div>
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
      </div>
    </>
  );
}
