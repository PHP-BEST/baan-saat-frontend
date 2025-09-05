import { useRef, useEffect } from 'react';
import { Pencil, Check, AlertCircle } from 'lucide-react';

interface SkillOption {
  label: string;
  value: string;
  order: number;
}

interface ProfileFieldProps {
  label: string;
  field: string;
  skillOptions?: SkillOption[];
  editingField: string | null;
  tempValues: Record<string, string>;
  validationErrors: Record<string, string>;
  cursorPositions: Record<string, number>;
  getDisplayValue: (field: string) => string;
  getFieldValue: (field: string) => string;
  getPlaceholderText: (field: string) => string;
  startEditing: (field: string) => void;
  saveEditing: (field: string) => void;
  setTempValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setCursorPositions: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
  setValidationErrors: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  setSkillsChanged: React.Dispatch<React.SetStateAction<boolean>>;
  userSkills?: string[];
}

export default function ProfileField({
  label,
  field,
  skillOptions = [],
  editingField,
  tempValues,
  validationErrors,
  cursorPositions,
  getDisplayValue,
  getFieldValue,
  getPlaceholderText,
  startEditing,
  saveEditing,
  setTempValues,
  setCursorPositions,
  setValidationErrors,
  setSkillsChanged,
  userSkills = [],
}: ProfileFieldProps) {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (
      field !== 'skills' &&
      editingField === field &&
      inputRefs.current[field] &&
      cursorPositions[field] !== undefined
    ) {
      const input = inputRefs.current[field];
      input?.focus();
      input?.setSelectionRange(cursorPositions[field], cursorPositions[field]);
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
                  : userSkills || [];

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
                  : userSkills || [];

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
}
