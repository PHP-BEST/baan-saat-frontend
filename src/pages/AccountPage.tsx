import { useState } from 'react';
import { Pencil, Check } from 'lucide-react';

interface User {
  name: string;
  phone: string;
  email: string;
  description: string;
  skills: string;
}

export default function Profile() {
  const [user, setUser] = useState<User>({
    name: 'John Doe',
    phone: '+00 000 000 000',
    email: 'john@doe.com',
    description: 'I do some cleaning',
    skills: 'I did some cleaning',
  });

  const [editingField, setEditingField] = useState<keyof User | null>(null);
  const [tempValue, setTempValue] = useState<string>('');

  const startEditing = (field: keyof User, value: string) => {
    setEditingField(field);
    setTempValue(value);
  };

  const saveEditing = () => {
    if (editingField) {
      setUser({ ...user, [editingField]: tempValue });
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
    field: keyof User;
  }

  const EditableField = ({ label, field }: EditableFieldProps) => (
    <div>
      <span className="font-semibold flex items-center">
        {label}
        {editingField !== field && (
          <Pencil
            onClick={() => startEditing(field, user[field])}
            className="w-4 h-4 ml-2 text-gray-500 cursor-pointer hover:text-gray-700"
          />
        )}
      </span>

      {editingField === field ? (
        <div className="flex items-center gap-2 mt-1">
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="border rounded px-2 py-1 flex-1"
            autoFocus
            onBlur={cancelEditing}
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
      ) : (
        <p>{user[field]}</p>
      )}
    </div>
  );

  return (
    <div>
      <div className="bg-white rounded-2xl p-6 flex flex-col items-center">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <Pencil className="w-6 h-6 text-gray-500" />
        </div>

        {/* Editable Fields */}
        <div className="space-y-4 w-full ml-10">
          <EditableField label="Name" field="name" />
          <EditableField label="Telephone" field="phone" />
          <EditableField label="Email" field="email" />
          <EditableField label="Description" field="description" />
          <EditableField label="Skill & Experience" field="skills" />
        </div>
      </div>
    </div>
  );
}
