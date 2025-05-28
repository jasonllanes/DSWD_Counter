import React, { useState, useRef, useEffect, useCallback } from 'react';

interface EditableCellProps {
  value: number;
  isEditable: boolean;
  onSave: (newValue: number) => void;
  className?: string;
  showSaveIndicator?: boolean;
}

const EditableCell: React.FC<EditableCellProps> = ({ 
  value, 
  isEditable, 
  onSave,
  className = '',
  showSaveIndicator = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  // Update input value when prop value changes
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  // Auto-focus and select input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = useCallback(() => {
    const newValue = parseInt(inputValue, 10);
    if (!isNaN(newValue) && newValue >= 0) {
      onSave(newValue);
    }
    setIsEditing(false);
  }, [inputValue, onSave]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setInputValue(value.toString());
    }
  }, [handleSave, value]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === '' || (/^\d+$/.test(newValue) && parseInt(newValue, 10) >= 0)) {
      setInputValue(newValue);
    }
  }, []);

  if (isEditing) {
    return (
      <div className="relative w-full h-full flex items-center justify-center p-1">
        <input
          ref={inputRef}
          type="number"
          min="0"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-full max-w-[100px] text-center py-2 px-3 border-2 border-blue-500 
                   rounded focus:outline-none focus:ring-2 focus:ring-blue-500 
                   bg-white text-blue-900 font-medium transition-all"
          aria-label="Edit value"
        />
      </div>
    );
  }

  return (
    <button 
      type="button"
      onClick={() => isEditable && setIsEditing(true)}
      className={`
        w-full h-full flex items-center justify-center group 
        ${isEditable ? 'cursor-pointer hover:bg-blue-50' : ''}
      `}
      disabled={!isEditable}
      title={isEditable ? "Click to edit" : undefined}
    >
      <div className="flex items-center justify-center gap-2 px-3 py-2">
        <span className={`font-medium ${className || 'text-blue-800'}`}>
          {value.toLocaleString()}
        </span>
        {isEditable && (
          <span className="text-blue-400 opacity-60 group-hover:opacity-100 transition-opacity">
            ✎
          </span>
        )}
      </div>
    </button>
  );
};

export default React.memo(EditableCell); 