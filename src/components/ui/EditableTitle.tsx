"use client";

import type React from "react";
import { useState } from "react";

interface EditableTitleProps {
  initialValue: string;
  onSave: (value: string) => void;
  className?: string;
}

export function EditableTitle({
  initialValue,
  onSave,
  className = "",
}: EditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (value.trim() !== initialValue) {
      onSave(value.trim() || "Untitled");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleBlur();
    } else if (event.key === "Escape") {
      setValue(initialValue);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        className={`border border-[#8B6D5C]/20 px-3 py-1.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4A90E2] focus:border-transparent transition-all duration-300 ease-in-out w-full ${className}`}
      />
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      className={`${className} cursor-pointer`}
    >
      {initialValue}
    </span>
  );
}
