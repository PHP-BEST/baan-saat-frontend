import { useRef, useEffect } from 'react';
import { Pencil, Check, AlertCircle } from 'lucide-react';
import { profileValidator } from '@/utils/profileValidator';

interface ProfileFieldProps {
  label: string;
  field: string;
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
}

export default function ProfileField({
  label,
  field,
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
}: ProfileFieldProps) {
  const inputRefs = useRef<
    Record<string, HTMLInputElement | HTMLTextAreaElement | null>
  >({});

  useEffect(() => {
    if (
      field !== 'skills' &&
      editingField === field &&
      inputRefs.current[field] &&
      cursorPositions[field] !== undefined
    ) {
      const input = inputRefs.current[field];
      const cursorStart = input?.selectionStart ?? 0;
      const cursorEnd = input?.selectionEnd ?? 0;
      if (cursorStart !== cursorEnd) {
        return;
      }

      const cursorPos = cursorPositions[field];
      input?.focus();
      input?.setSelectionRange(cursorPos, cursorPos);
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
          {field === 'description' ? (
            <>
              <textarea
                ref={(el) => {
                  inputRefs.current[field] = el;
                }}
                value={tempValues[field] || ''}
                onChange={(e) => {
                  const newValue = (e.target as HTMLTextAreaElement).value;
                  const cursorPos =
                    (e.target as HTMLTextAreaElement).selectionStart ?? 0;
                  setTempValues((prev) => ({ ...prev, [field]: newValue }));
                  setCursorPositions((prev) => ({
                    ...prev,
                    [field]: cursorPos,
                  }));

                  const validation = profileValidator('description', newValue);
                  if (!validation.isValid) {
                    setValidationErrors((prev) => ({
                      ...prev,
                      [field]: validation.error || '',
                    }));
                  } else {
                    setValidationErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors[field];
                      return newErrors;
                    });
                  }
                }}
                onKeyUp={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  setCursorPositions((prev) => ({
                    ...prev,
                    [field]: target.selectionStart || 0,
                  }));
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault();
                    saveEditing('description');
                  }
                }}
                onClick={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  setCursorPositions((prev) => ({
                    ...prev,
                    [field]: target.selectionStart || 0,
                  }));
                }}
                rows={4}
                className={`
                  border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 ${
                    validationErrors[field]
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-blue-200'
                  }`}
              />
              {validationErrors[field] && (
                <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                  <AlertCircle className="w-4 h-4" />
                  <span className="whitespace-pre-wrap">
                    {validationErrors[field]}
                  </span>
                </div>
              )}
            </>
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    saveEditing(field);
                  }
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
          {getDisplayValue(field) ? (
            field === 'description' ? (
              <div
                className={`whitespace-pre-wrap break-words ${
                  tempValues[field] !== undefined &&
                  tempValues[field] !== getFieldValue(field)
                    ? 'text-button-upload font-medium'
                    : ''
                }`}
              >
                {getDisplayValue(field)}
              </div>
            ) : (
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
            )
          ) : (
            <p className="text-gray-500">{getPlaceholderText(field)}</p>
          )}
        </>
      )}
    </div>
  );
}
