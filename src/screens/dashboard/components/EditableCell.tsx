import React, { useState, useRef, useEffect } from 'react';

interface EditableCellProps {
  value: number;
  isEditable: boolean;
  onSave: (newValue: number) => void;
  className?: string;
}

const EditableCell: React.FC<EditableCellProps> = ({ 
  value, 
  isEditable, 
  onSave,
  className = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  // Update input value when the prop value changes
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const startEditing = () => {
    if (isEditable && !isEditing) {
      console.log("🎯 Starting edit mode for value:", value);
      setIsEditing(true);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("🖱️ Cell clicked!", { isEditable, isEditing });
    startEditing();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setInputValue(value.toString());
    }
  };

  const handleSave = () => {
    const newValue = parseInt(inputValue, 10);
    if (!isNaN(newValue) && newValue >= 0) {
      console.log("✅ Saving value:", newValue);
      onSave(newValue);
    } else {
      console.log("❌ Invalid value, resetting to:", value);
      setInputValue(value.toString());
    }
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    console.log("📤 Input blur, saving...");
    handleSave();
  };

  // If we're in editing mode, show the input
  if (isEditing) {
    return (
      <div className="w-full h-full flex items-center justify-center p-1">
        <input
          ref={inputRef}
          type="number"
          min="0"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full max-w-[100px] text-center py-2 px-3 border-2 border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-blue-900 font-medium"
        />
      </div>
    );
  }

  // If editable, show interactive version
  if (isEditable) {
    return (
      <div 
        className="w-full h-full flex items-center justify-center cursor-pointer group relative"
        onClick={handleClick}
        title="Click to edit this value"
      >
        {/* Main content */}
        <div className="flex items-center justify-center gap-2 px-3 py-2 rounded transition-all duration-200 group-hover:bg-blue-100 group-hover:shadow-sm border-2 border-transparent group-hover:border-blue-300">
          <span className={`font-medium ${className.includes('text-') ? '' : 'text-blue-800'}`}>
            {value.toLocaleString()}
          </span>
          <span className="text-blue-500 opacity-70 group-hover:opacity-100 transition-opacity">
            ✏️
          </span>
        </div>
        
        {/* Hover hint */}
        <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[10px] text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-2 py-1 rounded shadow-sm border whitespace-nowrap">
          Click to edit
        </div>
      </div>
    );
  }

  // Non-editable version
  return (
    <div className="w-full h-full flex items-center justify-center">
      <span className={`font-medium ${className}`}>{value.toLocaleString()}</span>
    </div>
  );
};

export default EditableCell; 