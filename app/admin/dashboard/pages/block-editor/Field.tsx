"use client";

import { useState, ReactNode, useEffect, useRef, useCallback } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

// Debounced color input to prevent infinite update loops
export function DebouncedColorInput({
  value,
  onChange,
  className = "",
  debounceMs = 100,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  debounceMs?: number;
}) {
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  // Sync external value when not typing
  useEffect(() => {
    if (!isTypingRef.current) {
      setLocalValue(value);
    }
  }, [value]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    isTypingRef.current = true;

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce the onChange call
    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
      isTypingRef.current = false;
    }, debounceMs);
  }, [onChange, debounceMs]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <input
      type="color"
      value={localValue}
      onChange={handleChange}
      className={`w-10 h-10 rounded border cursor-pointer ${className}`}
    />
  );
}

// Debounced range input to prevent infinite update loops
export function DebouncedRangeInput({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className = "",
  debounceMs = 50,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  debounceMs?: number;
}) {
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isDraggingRef = useRef(false);

  // Sync external value when not dragging
  useEffect(() => {
    if (!isDraggingRef.current) {
      setLocalValue(value);
    }
  }, [value]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setLocalValue(newValue);
    isDraggingRef.current = true;

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce the onChange call
    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
      isDraggingRef.current = false;
    }, debounceMs);
  }, [onChange, debounceMs]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={localValue}
      onChange={handleChange}
      className={`flex-1 ${className}`}
    />
  );
}

// Debounced text input to prevent infinite update loops
export function DebouncedTextInput({
  value,
  onChange,
  className = "",
  placeholder = "",
  debounceMs = 150,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  debounceMs?: number;
}) {
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  // Sync external value when not typing
  useEffect(() => {
    if (!isTypingRef.current) {
      setLocalValue(value);
    }
  }, [value]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    isTypingRef.current = true;

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce the onChange call
    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
      isTypingRef.current = false;
    }, debounceMs);
  }, [onChange, debounceMs]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <input
      type="text"
      value={localValue}
      onChange={handleChange}
      className={className}
      placeholder={placeholder}
    />
  );
}

// Field component - simple form field wrapper with improved styling
export function Field({
  label,
  children,
  hint,
  disabled = false,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  disabled?: boolean;
}) {
  return (
    <div className={disabled ? "opacity-50 pointer-events-none" : ""}>
      <label className="block text-sm font-medium text-gray-800 mb-2">
        {label}
        {hint && (
          <span className="font-normal text-xs text-gray-500 ml-2">
            {hint}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

// Collapsible section component with improved styling
export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  badge,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  badge?: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-gray-900">{title}</span>
          {badge && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              {badge}
            </span>
          )}
        </div>
        <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`}>
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 pt-0 border-t border-gray-100 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}

// Toggle button group for selection with deselection support
export function ToggleButtonGroup<T extends string>({
  options,
  value,
  onChange,
  allowDeselect = false,
  columns = 3,
  size = "md",
  wrap = false,
}: {
  options: { value: T; label: string; description?: string; icon?: React.ReactNode; disabled?: boolean }[];
  value: T | undefined;
  onChange: (value: T | undefined) => void;
  allowDeselect?: boolean;
  columns?: 2 | 3 | 4 | 5 | 6;
  size?: "sm" | "md" | "lg";
  wrap?: boolean;
}) {
  // Calculate effective columns - limit based on number of options and space
  // For narrow sidebar (320px), we need smaller buttons
  const effectiveColumns = Math.min(columns, options.length);
  
  const getGridClass = () => {
    if (wrap) {
      return "flex flex-wrap gap-1.5";
    }
    // Use auto-fit for better responsiveness in narrow containers
    const colMap: Record<number, string> = {
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
    };
    return `grid ${colMap[effectiveColumns] || "grid-cols-2"} gap-1.5`;
  };
  
  // Smaller sizes to fit in narrow sidebar
  const sizeStyles = {
    sm: "px-1.5 py-1 text-[10px]",
    md: "px-2 py-1.5 text-[11px]",
    lg: "px-2.5 py-2 text-xs",
  };

  return (
    <div className={getGridClass()}>
      {options.map((opt) => {
        const isSelected = value === opt.value;
        const isDisabled = opt.disabled;
        
        return (
          <button
            key={opt.value}
            onClick={() => {
              if (isDisabled) return;
              if (isSelected && allowDeselect) {
                onChange(undefined);
              } else {
                onChange(opt.value);
              }
            }}
            disabled={isDisabled}
            title={opt.description ? `${opt.label} - ${opt.description}` : opt.label}
            className={`
              ${sizeStyles[size]} rounded-md border transition-all duration-150 text-center
              ${wrap ? "shrink-0" : ""}
              ${isDisabled 
                ? "opacity-40 cursor-not-allowed bg-gray-100 border-gray-200 text-gray-400" 
                : isSelected
                  ? "bg-black text-white border-black shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50 active:scale-95"
              }
            `}
          >
            <div className="flex items-center justify-center gap-1">
              {opt.icon && <span className="shrink-0">{opt.icon}</span>}
              <div className="min-w-0">
                <span className="block font-medium leading-tight whitespace-nowrap">{opt.label}</span>
                {opt.description && (
                  <span className={`text-[9px] block leading-tight whitespace-nowrap ${isSelected ? 'opacity-70' : 'text-gray-500'}`}>
                    {opt.description}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// Range slider with live value display and improved styling
export function RangeSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  onDragStart,
  onDragEnd,
  unit = "",
  presets,
  showValue = true,
  disabled = false,
}: {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  onDragStart?: () => void;
  onDragEnd?: (value: number) => void;
  unit?: string;
  presets?: number[];
  showValue?: boolean;
  disabled?: boolean;
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`space-y-3 ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      {presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {presets.map((preset) => (
            <button
              key={preset}
              onClick={() => {
                if (onDragEnd) {
                  onDragEnd(preset);
                } else {
                  onChange(preset);
                }
              }}
              className={`
                px-3 py-1.5 text-xs font-medium rounded-lg border-2 transition-all duration-150
                ${value === preset
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                }
              `}
            >
              {preset}{unit}
            </button>
          ))}
        </div>
      )}
      
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onMouseDown={onDragStart}
            onTouchStart={onDragStart}
            onChange={(e) => onChange(parseInt(e.target.value))}
            onMouseUp={(e) => onDragEnd?.(parseInt((e.target as HTMLInputElement).value))}
            onTouchEnd={(e) => onDragEnd?.(parseInt((e.target as HTMLInputElement).value))}
            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-5
              [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:bg-black
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:cursor-grab
              [&::-webkit-slider-thumb]:active:cursor-grabbing
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:border-2
              [&::-webkit-slider-thumb]:border-white
              [&::-webkit-slider-thumb]:transition-transform
              [&::-webkit-slider-thumb]:hover:scale-110
              [&::-moz-range-thumb]:w-5
              [&::-moz-range-thumb]:h-5
              [&::-moz-range-thumb]:bg-black
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:border-2
              [&::-moz-range-thumb]:border-white
              [&::-moz-range-thumb]:cursor-grab
              [&::-moz-range-thumb]:active:cursor-grabbing"
            style={{
              background: `linear-gradient(to right, #000 0%, #000 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
            }}
          />
        </div>
        {showValue && (
          <div className="flex items-center shrink-0">
            <input
              type="number"
              min={min}
              max={max}
              value={value}
              onChange={(e) => {
                const val = parseInt(e.target.value) || min;
                onChange(Math.min(max, Math.max(min, val)));
                onDragEnd?.(val);
              }}
              className="w-16 px-2 py-1.5 text-sm text-right border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
            />
            {unit && <span className="ml-1.5 text-sm text-gray-500 font-medium">{unit}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
