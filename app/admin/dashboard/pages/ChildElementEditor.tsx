"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, GripVertical } from "lucide-react";
import { STYLE_PRESETS, getChildElementName, ARRAY_EDITABLE_FIELDS } from "./inline-editing-config";

// ============================================================================
// TYPES
// ============================================================================
export interface ChildElementStyles {
  width?: string;
  height?: string;
  padding?: string;
  margin?: string;
  backgroundColor?: string;
  borderRadius?: string;
  borderColor?: string;
  borderWidth?: string;
  fontSize?: string;
  fontWeight?: string;
  textColor?: string;
  gap?: string;
  aspectRatio?: string;
  opacity?: string;
  shadow?: string;
}

interface ChildElementEditorProps {
  isOpen: boolean;
  onClose: () => void;
  elementType: string;
  elementIndex: number;
  currentStyles: ChildElementStyles;
  onUpdateStyles: (styles: ChildElementStyles) => void;
  position: { x: number; y: number };
  targetElement: HTMLElement | null;
}

// ============================================================================
// STYLE OPTION BUTTON - Minimal black/white style
// ============================================================================
function StyleOption({ 
  label, 
  selected, 
  onClick,
}: { 
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-2 py-1.5 text-[11px] font-medium rounded border transition-all
        ${selected 
          ? "bg-black text-white border-black" 
          : "bg-white text-gray-700 border-gray-200 hover:border-black"
        }
      `}
    >
      {label}
    </button>
  );
}

// ============================================================================
// COLOR INPUT - Minimal style with debouncing for smooth dragging
// ============================================================================
function ColorInput({ 
  label, 
  value, 
  onChange 
}: { 
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [localValue, setLocalValue] = useState(value);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local value when external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced color change handler for color picker
  const handleColorChange = useCallback((newValue: string) => {
    setLocalValue(newValue);
    
    // Debounce the upstream update to prevent UI lag during fast dragging
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      onChange(newValue);
    }, 50); // 50ms debounce for smooth dragging
  }, [onChange]);

  // Immediate update for text input (on blur or enter)
  const handleTextChange = useCallback((newValue: string) => {
    setLocalValue(newValue);
  }, []);

  const handleTextBlur = useCallback(() => {
    onChange(localValue);
  }, [localValue, onChange]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div>
      <label className="block text-[11px] font-medium text-gray-600 mb-1.5">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={localValue || "#ffffff"}
          onChange={(e) => handleColorChange(e.target.value)}
          className="w-8 h-8 rounded border border-gray-200 cursor-pointer"
        />
        <input
          type="text"
          value={localValue || ""}
          onChange={(e) => handleTextChange(e.target.value)}
          onBlur={handleTextBlur}
          onKeyDown={(e) => e.key === "Enter" && handleTextBlur()}
          className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded focus:border-black focus:outline-none"
          placeholder="transparent"
        />
        {localValue && (
          <button onClick={() => { setLocalValue(""); onChange(""); }} className="p-1 text-gray-400 hover:text-black">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT - Draggable Modal with Black/White Theme
// ============================================================================
export default function ChildElementEditor({
  isOpen,
  onClose,
  elementType,
  elementIndex,
  currentStyles,
  onUpdateStyles,
  position,
}: ChildElementEditorProps) {
  const [localStyles, setLocalStyles] = useState<ChildElementStyles>(currentStyles);
  const [isDragging, setIsDragging] = useState(false);
  const [modalPosition, setModalPosition] = useState(position);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0, modalX: 0, modalY: 0 });

  // Sync local styles
  useEffect(() => {
    setLocalStyles(currentStyles);
  }, [currentStyles]);

  // Update modal position when opening
  useEffect(() => {
    if (isOpen) {
      const padding = 16;
      const panelWidth = 280;
      const panelHeight = 400;
      
      let x = position.x + 10;
      let y = position.y + 10;
      
      if (x + panelWidth > window.innerWidth - padding) x = position.x - panelWidth - 10;
      if (y + panelHeight > window.innerHeight - padding) y = window.innerHeight - panelHeight - padding;
      x = Math.max(padding, x);
      y = Math.max(padding, y);
      
      setModalPosition({ x, y });
    }
  }, [isOpen, position]);

  // Selection outline on target element (blue for UX consistency)
  useEffect(() => {
    if (!isOpen) return;
    
    const el = document.querySelector(`[data-item-index="${elementIndex}"][data-child-type="${elementType}"]`) as HTMLElement;
    if (el) {
      el.style.outline = "2px solid rgb(59, 130, 246)";
      el.style.outlineOffset = "2px";
      el.style.boxShadow = "0 0 0 4px rgba(59, 130, 246, 0.15)";
    }

    return () => {
      if (el) {
        el.style.outline = "";
        el.style.outlineOffset = "";
        el.style.boxShadow = "";
      }
    };
  }, [isOpen, elementIndex, elementType]);

  // Drag handlers
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      modalX: modalPosition.x,
      modalY: modalPosition.y,
    };
  }, [modalPosition]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setModalPosition({
        x: dragStartRef.current.modalX + dx,
        y: dragStartRef.current.modalY + dy,
      });
    };

    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Debounce timer for color updates
  const colorDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update style
  const updateStyle = useCallback((key: keyof ChildElementStyles, value: string) => {
    const newStyles = { ...localStyles, [key]: value || undefined };
    Object.keys(newStyles).forEach(k => {
      if (newStyles[k as keyof ChildElementStyles] === undefined) {
        delete newStyles[k as keyof ChildElementStyles];
      }
    });
    setLocalStyles(newStyles);
    onUpdateStyles(newStyles);
  }, [localStyles, onUpdateStyles]);

  // Debounced color update for smooth drag experience
  const updateColorDebounced = useCallback((key: keyof ChildElementStyles, value: string) => {
    // Update local state immediately for visual feedback
    setLocalStyles(prev => ({ ...prev, [key]: value || undefined }));
    
    // Debounce the upstream update
    if (colorDebounceRef.current) {
      clearTimeout(colorDebounceRef.current);
    }
    colorDebounceRef.current = setTimeout(() => {
      const newStyles = { ...localStyles, [key]: value || undefined };
      Object.keys(newStyles).forEach(k => {
        if (newStyles[k as keyof ChildElementStyles] === undefined) {
          delete newStyles[k as keyof ChildElementStyles];
        }
      });
      onUpdateStyles(newStyles);
    }, 50);
  }, [localStyles, onUpdateStyles]);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (colorDebounceRef.current) {
        clearTimeout(colorDebounceRef.current);
      }
    };
  }, []);

  // Reset styles
  const resetStyles = useCallback(() => {
    setLocalStyles({});
    onUpdateStyles({});
  }, [onUpdateStyles]);

  // Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const hasStyles = Object.keys(localStyles).length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.1 }}
          className="fixed z-[100] bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
          style={{
            left: modalPosition.x,
            top: modalPosition.y,
            width: "280px",
            cursor: isDragging ? "grabbing" : "default",
          }}
        >
          {/* Drag Handle Header */}
          <div
            onMouseDown={handleDragStart}
            className="flex items-center justify-between px-3 py-2 bg-black text-white cursor-grab active:cursor-grabbing select-none"
          >
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 opacity-50" />
              <span className="text-xs font-medium">
                {getChildElementName(elementType)} #{elementIndex + 1}
              </span>
              {hasStyles && (
                <span className="px-1.5 py-0.5 bg-white/20 rounded text-[10px]">
                  {Object.keys(localStyles).length}
                </span>
              )}
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Content - Simplified Single View */}
          <div className="p-3 max-h-[450px] overflow-y-auto space-y-4">
            {/* Background Color */}
            <ColorInput
              label="Fond"
              value={localStyles.backgroundColor || ""}
              onChange={(v) => updateStyle("backgroundColor", v)}
            />

            {/* Border Radius */}
            <div>
              <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Arrondi</label>
              <div className="grid grid-cols-6 gap-1">
                {[
                  { value: "0", label: "0" },
                  { value: "0.25rem", label: "XS" },
                  { value: "0.5rem", label: "S" },
                  { value: "1rem", label: "M" },
                  { value: "1.5rem", label: "L" },
                  { value: "9999px", label: "●" },
                ].map((opt) => (
                  <StyleOption
                    key={opt.value}
                    label={opt.label}
                    selected={localStyles.borderRadius === opt.value}
                    onClick={() => updateStyle("borderRadius", localStyles.borderRadius === opt.value ? "" : opt.value)}
                  />
                ))}
              </div>
            </div>

            {/* Shadow */}
            <div>
              <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Ombre</label>
              <div className="grid grid-cols-5 gap-1">
                {["none", "sm", "md", "lg", "xl"].map((val) => (
                  <StyleOption
                    key={val}
                    label={val === "none" ? "0" : val.toUpperCase()}
                    selected={localStyles.shadow === val}
                    onClick={() => updateStyle("shadow", localStyles.shadow === val ? "" : val)}
                  />
                ))}
              </div>
            </div>

            {/* Padding */}
            <div>
              <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Padding</label>
              <div className="grid grid-cols-5 gap-1">
                {[
                  { value: "0", label: "0" },
                  { value: "0.5rem", label: "S" },
                  { value: "1rem", label: "M" },
                  { value: "1.5rem", label: "L" },
                  { value: "2rem", label: "XL" },
                ].map((opt) => (
                  <StyleOption
                    key={opt.value}
                    label={opt.label}
                    selected={localStyles.padding === opt.value}
                    onClick={() => updateStyle("padding", localStyles.padding === opt.value ? "" : opt.value)}
                  />
                ))}
              </div>
            </div>

            {/* Text Color */}
            <ColorInput
              label="Texte"
              value={localStyles.textColor || ""}
              onChange={(v) => updateStyle("textColor", v)}
            />

            {/* Font Size */}
            <div>
              <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Taille texte</label>
              <div className="grid grid-cols-5 gap-1">
                {[
                  { value: "0.75rem", label: "XS" },
                  { value: "0.875rem", label: "S" },
                  { value: "1rem", label: "M" },
                  { value: "1.25rem", label: "L" },
                  { value: "1.5rem", label: "XL" },
                ].map((opt) => (
                  <StyleOption
                    key={opt.value}
                    label={opt.label}
                    selected={localStyles.fontSize === opt.value}
                    onClick={() => updateStyle("fontSize", localStyles.fontSize === opt.value ? "" : opt.value)}
                  />
                ))}
              </div>
            </div>

            {/* Font Weight */}
            <div>
              <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Épaisseur</label>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { value: "400", label: "Normal" },
                  { value: "500", label: "Medium" },
                  { value: "600", label: "Semi" },
                  { value: "700", label: "Bold" },
                ].map((opt) => (
                  <StyleOption
                    key={opt.value}
                    label={opt.label}
                    selected={localStyles.fontWeight === opt.value}
                    onClick={() => updateStyle("fontWeight", localStyles.fontWeight === opt.value ? "" : opt.value)}
                  />
                ))}
              </div>
            </div>

            {/* Opacity */}
            <div>
              <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Opacité</label>
              <div className="grid grid-cols-5 gap-1">
                {[
                  { value: "0.25", label: "25%" },
                  { value: "0.5", label: "50%" },
                  { value: "0.75", label: "75%" },
                  { value: "0.9", label: "90%" },
                  { value: "1", label: "100%" },
                ].map((opt) => (
                  <StyleOption
                    key={opt.value}
                    label={opt.label}
                    selected={localStyles.opacity === opt.value}
                    onClick={() => updateStyle("opacity", localStyles.opacity === opt.value ? "" : opt.value)}
                  />
                ))}
              </div>
            </div>

            {/* Border */}
            <div>
              <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Bordure</label>
              <div className="flex gap-2">
                <div className="flex-1 grid grid-cols-4 gap-1">
                  {[
                    { value: "0", label: "0" },
                    { value: "1px", label: "1" },
                    { value: "2px", label: "2" },
                    { value: "4px", label: "4" },
                  ].map((opt) => (
                    <StyleOption
                      key={opt.value}
                      label={opt.label}
                      selected={localStyles.borderWidth === opt.value}
                      onClick={() => updateStyle("borderWidth", localStyles.borderWidth === opt.value ? "" : opt.value)}
                    />
                  ))}
                </div>
                {localStyles.borderWidth && (
                  <input
                    type="color"
                    value={localStyles.borderColor || "#000000"}
                    onChange={(e) => updateColorDebounced("borderColor", e.target.value)}
                    className="w-8 h-8 rounded border border-gray-200 cursor-pointer shrink-0"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 flex justify-between">
            <button
              onClick={resetStyles}
              disabled={!hasStyles}
              className={`flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                hasStyles ? "text-gray-600 hover:text-black hover:bg-gray-100" : "text-gray-300"
              }`}
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1 text-[11px] font-medium bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
              OK
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// HOOK - Manage child element selection and editing
// ============================================================================
export interface SelectedChild {
  element: HTMLElement;
  type: string;
  index: number;
  blockId: string;
  arrayField: string;
}

export function useChildElementEditor() {
  const [selectedChild, setSelectedChild] = useState<SelectedChild | null>(null);
  const [editorPosition, setEditorPosition] = useState({ x: 0, y: 0 });

  const handleChildClick = useCallback((
    e: React.MouseEvent | MouseEvent,
    element: HTMLElement,
    type: string,
    index: number,
    blockId: string,
    arrayField: string
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedChild({ element, type, index, blockId, arrayField });
    
    const rect = element.getBoundingClientRect();
    setEditorPosition({ x: rect.right + 10, y: rect.top });
  }, []);

  const closeEditor = useCallback(() => {
    setSelectedChild(null);
  }, []);

  const getArrayFieldForChildType = useCallback((blockType: string, childType: string): string => {
    const configs = ARRAY_EDITABLE_FIELDS[blockType] || [];
    for (const config of configs) {
      if (config.childType === childType) {
        return config.arrayField;
      }
    }
    const fallbacks: Record<string, string> = {
      card: "cards", stat: "stats", feature: "features", button: "buttons",
      testimonial: "testimonials", member: "members", plan: "plans",
      "timeline-item": "items", "accordion-item": "items", "list-item": "items",
      tab: "tabs", faq: "questions", service: "services", review: "reviews",
    };
    return fallbacks[childType] || "items";
  }, []);

  return {
    selectedChild,
    editorPosition,
    handleChildClick,
    closeEditor,
    getArrayFieldForChildType,
    isEditorOpen: selectedChild !== null,
  };
}
