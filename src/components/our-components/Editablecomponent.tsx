//This page is specifically for editable field component in profile page
import { useRef, useLayoutEffect } from 'react';
import { Pencil, Check } from 'lucide-react';

const skillOptions = [
  { label: 'การทำความสะอาด', value: 'houseCleaning' },
  { label: 'การซ่อมแซม', value: 'houseRepair' },
  { label: 'ประปา', value: 'plumbing' },
  { label: 'ไฟฟ้า', value: 'electrical' },
  { label: 'เครื่องปรับอากาศ', value: 'hvac' },
  { label: 'การทาสี', value: 'painting' },
  { label: 'การจัดสวน', value: 'landscaping' },
  { label: 'อื่นๆ', value: 'others' },
];

interface User {
  name: string;
  phone: string;
  email: string;
  description: string;
  skills: string[];
  profilePicture: string;
}
interface EditableFieldProps {
  label: string;
  field: keyof User;
  user: User;
  editingField: keyof User | null;
  tempValue: string;
  error: string | null;
  // Functions from parent
  startEditing: (field: keyof User, value?: string) => void;
  saveEditing: () => void;
  cancelEditing: () => void;
  setTempValue: (value: string) => void;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  mutate: (updatedUser: User) => void;
  // Config
  usedtype?: string;
  editable?: boolean;
}

export const EditableField = ({
  label,
  field,
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
  usedtype = 'text',
  editable = true,
}: EditableFieldProps) => {
  // Refs to manage caret restoration
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const desiredCaretPos = useRef<number | null>(null);

  // Extend the Document type so TS knows about these non-standard methods
  interface DocumentWithCaret extends Document {
    caretPositionFromPoint?(
      x: number,
      y: number,
    ): { offset: number; offsetNode: Node } | null;
    caretRangeFromPoint?(x: number, y: number): Range | null;
  }

  const handleDisplayMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    const clientX = e.clientX;
    const clientY = e.clientY;
    const doc = document as DocumentWithCaret;

    let offset: number | null = null;

    try {
      if (doc.caretPositionFromPoint) {
        const pos = doc.caretPositionFromPoint(clientX, clientY);
        if (pos) offset = pos.offset;
      } else if (doc.caretRangeFromPoint) {
        const range = doc.caretRangeFromPoint(clientX, clientY);
        if (range) offset = range.startOffset;
      }
    } catch {
      offset = null;
    }

    desiredCaretPos.current = typeof offset === 'number' ? offset : null;
    startEditing(field, String(user[field] ?? ''));
    e.preventDefault();
  };

  useLayoutEffect(() => {
    if (editingField === field && inputRef.current) {
      const el = inputRef.current;
      el.focus();
      const pos = desiredCaretPos.current;
      const length = el.value.length;
      const posToUse = typeof pos === 'number' ? Math.min(pos, length) : length;
      try {
        el.setSelectionRange(posToUse, posToUse);
      } catch {
        /* ignore */
      }
    }
    if (editingField !== field) {
      desiredCaretPos.current = null;
    }
  }, [editingField, field]);

  // --- JSX for different field types (The logic inside is the same) ---
  if (field === 'skills') {
    return (
      <div>
        <span className="font-semibold flex items-center">
          {label}
          {editingField !== field && editable && (
            <Pencil
              onClick={() => startEditing('skills')}
              className="w-4 h-4 ml-2 text-gray-500 cursor-pointer hover:text-gray-700"
            />
          )}
        </span>
        {editingField === 'skills' ? (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {skillOptions.map((skill) => (
              <label key={skill.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={user.skills.includes(skill.value)}
                  onChange={(e) => {
                    const newSkills = e.target.checked
                      ? [...user.skills, skill.value]
                      : user.skills.filter((s) => s !== skill.value);
                    const ordered = skillOptions
                      .filter((opt) => newSkills.includes(opt.value))
                      .map((opt) => opt.value);
                    const updatedUser = { ...user, skills: ordered };
                    setUser(updatedUser);
                    mutate(updatedUser);
                  }}
                  className="rounded"
                />
                <span className="text-sm">{skill.label}</span>
              </label>
            ))}
            <div className="col-span-2 mt-2">
              <button
                onClick={() => saveEditing()} // Note: saveEditing now just closes the editor
                className="text-sm text-green-600 hover:underline"
              >
                <Check className="inline w-4 h-4 mr-1" />
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 mt-1">
            {user.skills?.length ? (
              user.skills.map((skillVal, idx) => {
                const opt = skillOptions.find((s) => s.value === skillVal);
                return (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-200 rounded-full text-sm"
                  >
                    {opt?.label ?? skillVal}
                  </span>
                );
              })
            ) : (
              <p className="text-gray-500">Please select at least one skill</p>
            )}
          </div>
        )}
      </div>
    );
  }

  if (field === 'phone') {
    return (
      <div>
        <span className="font-semibold flex items-center">
          {label}
          {editingField !== 'phone' && editable && (
            <Pencil
              onClick={() => startEditing('phone')}
              className="w-4 h-4 ml-2 text-gray-500 cursor-pointer hover:text-gray-700"
            />
          )}
        </span>
        {editingField === 'phone' ? (
          <div className="flex items-center gap-2 mt-1 w-[50%]">
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={tempValue}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                setTempValue(digits);
              }}
              className={`border rounded px-2 py-1 flex-1 ${error ? 'border-red-500' : ''}`}
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
        ) : user.phone?.length ? (
          <p
            onMouseDown={handleDisplayMouseDown}
            className="whitespace-pre-wrap break-words cursor-text"
          >
            {user.phone}
          </p>
        ) : (
          <p className="text-gray-500">Please fill the phone number</p>
        )}
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <span className="font-semibold flex items-center">
        {label}
        {editingField !== field && editable && (
          <Pencil
            onClick={() => startEditing(field, String(user[field] ?? ''))}
            className="w-4 h-4 ml-2 text-gray-500 cursor-pointer hover:text-gray-700"
          />
        )}
      </span>
      {editingField === field && editable ? (
        <div className="flex flex-col gap-1 mt-1 w-[50%]">
          <div className="flex items-center gap-2 w-full">
            {field === 'description' ? (
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={tempValue}
                onChange={(e) => {
                  if (e.target.value.length > 100) return;
                  setTempValue(e.target.value.slice(0, 100));
                }}
                className={`border rounded px-2 py-1 flex-1 ${error ? 'border-red-500' : ''}`}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Escape') cancelEditing();
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey))
                    saveEditing();
                }}
              />
            ) : (
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type={usedtype}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className={`border rounded px-2 py-1 flex-1 ${error ? 'border-red-500' : ''}`}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEditing();
                  if (e.key === 'Escape') cancelEditing();
                }}
              />
            )}
            <Check
              onClick={saveEditing}
              className="w-4 h-4 text-green-600 cursor-pointer shrink-0"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 mt-1 w-full">
          {user[field] && String(user[field]).length ? (
            <p
              onMouseDown={handleDisplayMouseDown}
              className="whitespace-pre-wrap break-words break-all cursor-text w-full"
            >
              {user[field] as string}
            </p>
          ) : (
            <p className="text-gray-500">Please fill the {field}</p>
          )}
        </div>
      )}
    </div>
  );
};
