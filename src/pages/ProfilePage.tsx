import { useState } from 'react';
import { Pencil, Check } from 'lucide-react';
import type { User } from '@/interfaces/User';

const skillOptions = [
  'houseCleaning',
  'houseRepair',
  'plumbing',
  'electrical',
  'hvac',
  'painting',
  'landscaping',
  'others',
];

export default function ProfilePage() {
  const [user, setUser] = useState<User>({
    userId: '',
    name: '<Your Name>',
    role: 'customer',
    telNumber: '<Your Phone Number>',
    avatarUrl: '',
    email: '<Your Email>',
    address: '<Your Address>',
    providerProfile: {
      title: '<Your Title>',
      description: '<Your Description>',
      skills: [''],
    },
    lastLoginAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');

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
        setUser({
          ...user,
          providerProfile: {
            title: user.providerProfile?.title || '',
            description: tempValue,
            skills: user.providerProfile?.skills || [],
          },
        });
      } else if (editingField === 'skills') {
        // Validate skills against skillOptions
        const validSkills = tempValue
          .split(',')
          .map((skill) => skill.trim())
          .filter((skill) => skill && skillOptions.includes(skill));

        setUser({
          ...user,
          providerProfile: {
            title: user.providerProfile?.title || '',
            description: user.providerProfile?.description || '',
            skills: validSkills,
          },
        });
      } else {
        setUser({ ...user, [editingField]: tempValue });
      }
      setEditingField(null);
    }
  };

  const cancelEditing = () => {
    setEditingField(null);
    setTempValue('');
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
        {editingField !== field && (
          <Pencil
            onClick={() => startEditing(field)}
            className="w-4 h-4 ml-2 text-gray-500 cursor-pointer hover:text-gray-700"
          />
        )}
      </span>

      {editingField === field ? (
        <div className="flex flex-col gap-2 mt-1">
          {field === 'skills' ? (
            <>
              <div className="grid grid-cols-2 gap-2">
                {skillOptions.map((skill) => {
                  const isChecked =
                    user.providerProfile?.skills.includes(skill) || false;
                  return (
                    <label key={skill} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const currentSkills =
                            user.providerProfile?.skills || [];
                          let newSkills;
                          if (e.target.checked) {
                            newSkills = [...currentSkills, skill];
                          } else {
                            newSkills = currentSkills.filter(
                              (s) => s !== skill,
                            );
                          }
                          setUser({
                            ...user,
                            providerProfile: {
                              title: user.providerProfile?.title || '',
                              description:
                                user.providerProfile?.description || '',
                              skills: newSkills,
                            },
                          });
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{skill}</span>
                    </label>
                  );
                })}
              </div>
              <div className="flex justify-end">
                <Check
                  onClick={() => setEditingField(null)}
                  className="w-4 h-4 text-green-600 cursor-pointer"
                />
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
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
              <Check
                onClick={saveEditing}
                className="w-4 h-4 text-green-600 cursor-pointer"
              />
            </div>
          )}
        </div>
      ) : (
        <p>{getFieldValue(field)}</p>
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
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <Pencil className="w-6 h-6 text-gray-500" />
        </div>

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
