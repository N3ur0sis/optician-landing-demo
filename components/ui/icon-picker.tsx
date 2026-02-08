"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import * as LucideIcons from "lucide-react";
import { Search, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Type for Lucide icon components
type LucideIconComponent = React.ComponentType<{ className?: string; style?: React.CSSProperties }>;

// Cache for icon names
let cachedIconNames: string[] | null = null;

// Get all icon names from Lucide - with better filtering
const getAllIconNames = (): string[] => {
  if (cachedIconNames) return cachedIconNames;
  
  const icons: string[] = [];
  
  for (const key of Object.keys(LucideIcons)) {
    // Skip non-icon exports
    if (
      key === "default" ||
      key === "createLucideIcon" ||
      key === "icons" ||
      key === "Icon" ||
      key.startsWith("Lucide") ||
      key.endsWith("Icon") ||
      !/^[A-Z]/.test(key)
    ) {
      continue;
    }
    
    const value = (LucideIcons as Record<string, unknown>)[key];
    
    // Check if it's a valid React component (function)
    if (typeof value === "function") {
      icons.push(key);
    }
  }
  
  cachedIconNames = icons.sort();
  return cachedIconNames;
};

// Icon categories for better organization
const ICON_CATEGORIES: Record<string, string[]> = {
  "Populaires": [
    "Star", "Heart", "Check", "X", "Plus", "Minus", "Search", "Settings",
    "User", "Mail", "Phone", "MapPin", "Clock", "Calendar", "Eye", "Glasses",
    "Home", "ArrowRight", "ChevronRight", "ExternalLink", "Info", "AlertCircle",
    "CheckCircle", "Gift", "ShoppingCart", "CreditCard", "Truck", "Package"
  ],
  "Actions": [
    "Check", "X", "Plus", "Minus", "Edit", "Trash", "Save", "Copy", "Download", "Upload",
    "Send", "Share", "Search", "Filter", "Settings", "MoreHorizontal", "MoreVertical"
  ],
  "Navigation": [
    "Home", "Menu", "ChevronLeft", "ChevronRight", "ChevronUp", "ChevronDown",
    "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "ExternalLink", "Link"
  ],
  "Communication": [
    "Mail", "Phone", "MessageCircle", "MessageSquare", "Bell", "BellRing", "AtSign",
    "Send", "Inbox", "Paperclip"
  ],
  "Médias": [
    "Image", "Camera", "Video", "Music", "Mic", "Volume2", "VolumeX", "Play", "Pause",
    "Film", "Youtube", "Instagram", "Facebook", "Twitter"
  ],
  "Utilisateurs": [
    "User", "Users", "UserPlus", "UserCheck", "UserX", "Lock", "Unlock", "Key",
    "Shield", "Eye", "EyeOff", "Glasses"
  ],
  "Commerce": [
    "ShoppingCart", "ShoppingBag", "CreditCard", "Wallet", "Receipt", "Tag", "Gift",
    "Package", "Truck", "Store"
  ],
  "Temps": [
    "Clock", "Timer", "Calendar", "CalendarDays", "CalendarCheck", "Hourglass",
    "Alarm", "Watch", "History", "RotateCcw"
  ],
  "Localisation": [
    "MapPin", "Map", "Compass", "Navigation", "Globe", "Building", "Home", "Flag"
  ],
  "Documents": [
    "File", "FileText", "Files", "Folder", "FolderOpen", "Clipboard", "Book",
    "BookOpen", "Newspaper", "ScrollText"
  ],
  "Alertes": [
    "Info", "AlertCircle", "AlertTriangle", "CheckCircle", "XCircle", "HelpCircle",
    "Ban", "ThumbsUp", "ThumbsDown"
  ],
  "Favoris": [
    "Star", "Heart", "Bookmark", "Award", "Trophy", "Medal", "Crown", "Sparkles"
  ],
};

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  label?: string;
  placeholder?: string;
}

export function IconPicker({ value, onChange, label, placeholder = "Choisir une icône" }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Populaires");
  const [modalPosition, setModalPosition] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Track if component is mounted (for portal)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate modal position when opening
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const modalWidth = 360;
      const modalHeight = 400; // approximate height
      
      // Calculate left position, ensuring modal doesn't overflow viewport
      let left = rect.left;
      if (left + modalWidth > window.innerWidth - 20) {
        left = window.innerWidth - modalWidth - 20;
      }
      if (left < 20) left = 20;
      
      // Calculate top position - prefer below the trigger, but go above if not enough space
      let top = rect.bottom + 8;
      if (top + modalHeight > window.innerHeight - 20) {
        top = rect.top - modalHeight - 8;
        if (top < 20) top = 20;
      }
      
      setModalPosition({ top, left });
    }
  }, [isOpen]);

  const allIcons = useMemo(() => getAllIconNames(), []);

  // Filter icons based on search or category
  const filteredIcons = useMemo(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return allIcons.filter((name) => name.toLowerCase().includes(query)).slice(0, 60);
    }
    // Get category icons - no need to check if they exist in allIcons 
    // since ICON_CATEGORIES contains valid icon names
    const categoryIcons = ICON_CATEGORIES[activeCategory] || [];
    return categoryIcons;
  }, [searchQuery, allIcons, activeCategory]);

  const handleSelect = useCallback((iconName: string) => {
    onChange(iconName);
    setIsOpen(false);
    setSearchQuery("");
  }, [onChange]);

  const handleClear = useCallback(() => {
    onChange("");
    setIsOpen(false);
  }, [onChange]);

  // Render icon component
  const renderIcon = (iconName: string, className = "w-5 h-5") => {
    const IconComponent = (LucideIcons as unknown as Record<string, LucideIconComponent>)[iconName];
    if (!IconComponent) return null;
    return <IconComponent className={className} />;
  };

  // Modal content to be portaled
  const modalContent = isOpen && modalPosition && (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[9998]" onClick={() => setIsOpen(false)} />
      
      {/* Picker Modal - White Theme - Fixed position via portal */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.15 }}
        className="fixed z-[9999] w-[360px] bg-white border border-gray-200 rounded-lg shadow-2xl overflow-hidden"
        style={{ top: modalPosition.top, left: modalPosition.left }}
      >
        {/* Search Header */}
        <div className="p-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-8 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-3 h-3 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        {!searchQuery && (
          <div className="flex gap-1 p-2 overflow-x-auto border-b border-gray-100 scrollbar-hide">
            {Object.keys(ICON_CATEGORIES).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap transition-colors ${
                  activeCategory === cat 
                    ? "bg-black text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Icons Grid */}
        <div className="p-3 max-h-[280px] overflow-y-auto">
          {/* Clear option */}
          {value && (
            <button
              onClick={handleClear}
              className="w-full flex items-center gap-2 px-3 py-2 mb-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-600 text-sm transition-colors"
            >
              <X className="w-4 h-4" />
              Supprimer l&apos;icône
            </button>
          )}
          
          <div className="grid grid-cols-8 gap-1">
            {filteredIcons.map((iconName) => (
              <button
                key={iconName}
                onClick={() => handleSelect(iconName)}
                className={`p-2.5 rounded-lg transition-all hover:bg-gray-100 hover:scale-110 ${
                  value === iconName ? "bg-black text-white" : "bg-gray-50 text-gray-700"
                }`}
                title={iconName}
              >
                {renderIcon(iconName, "w-4 h-4")}
              </button>
            ))}
          </div>

          {filteredIcons.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">
              Aucune icône trouvée
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-3 py-2 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            {filteredIcons.length} icône{filteredIcons.length > 1 ? "s" : ""}
          </p>
        </div>
      </motion.div>
    </>
  );

  return (
    <div className="relative">
      {label && (
        <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
      )}
      
      {/* Trigger Button - White Theme */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-left hover:border-gray-400 transition-colors"
      >
        {value ? (
          <>
            <span className="shrink-0 text-gray-700">{renderIcon(value)}</span>
            <span className="flex-1 text-sm text-gray-700 truncate">{value}</span>
          </>
        ) : (
          <span className="text-gray-400 text-sm">{placeholder}</span>
        )}
        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
      </button>

      {/* Modal rendered via portal to escape sidebar overflow */}
      {isMounted && createPortal(
        <AnimatePresence>
          {modalContent}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

// Helper function to convert icon name to PascalCase
function toPascalCase(str: string): string {
  if (!str) return str;
  // Already PascalCase
  if (/^[A-Z][a-zA-Z0-9]*$/.test(str)) return str;
  // Convert kebab-case or snake_case to PascalCase
  return str
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

// Utility function to render a Lucide icon by name
export function LucideIcon({ 
  name, 
  className = "w-5 h-5",
  style,
  fallback = null 
}: { 
  name: string; 
  className?: string;
  style?: React.CSSProperties;
  fallback?: React.ReactNode;
}) {
  // Early return if no name provided
  if (!name || typeof name !== 'string') {
    return fallback as React.ReactElement | null;
  }
  
  // Try original name first (handles PascalCase names like "Star", "MapPin")
  let IconComponent = (LucideIcons as unknown as Record<string, LucideIconComponent>)[name];
  
  // If not found, try PascalCase conversion (handles "map-pin" -> "MapPin", "star" -> "Star")
  if (!IconComponent) {
    const pascalName = toPascalCase(name);
    IconComponent = (LucideIcons as unknown as Record<string, LucideIconComponent>)[pascalName];
  }
  
  // Try capitalizing just the first letter (for simple lowercase like "star" -> "Star")
  if (!IconComponent && name.length > 0) {
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    IconComponent = (LucideIcons as unknown as Record<string, LucideIconComponent>)[capitalizedName];
  }
  
  if (!IconComponent) {
    // Development warning
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[LucideIcon] Icon "${name}" not found in lucide-react`);
    }
    return fallback as React.ReactElement | null;
  }
  
  return <IconComponent className={className} style={style} />;
}

// Export icon list for validation
export function getAvailableIcons(): string[] {
  return getAllIconNames();
}

// Check if icon exists (with case-insensitive matching)
export function isValidIcon(name: string): boolean {
  if (!name) return false;
  
  // Check original name
  if (name in LucideIcons && typeof (LucideIcons as Record<string, unknown>)[name] === "function") {
    return true;
  }
  
  // Check PascalCase version
  const pascalName = toPascalCase(name);
  if (pascalName in LucideIcons && typeof (LucideIcons as Record<string, unknown>)[pascalName] === "function") {
    return true;
  }
  
  // Check capitalized version
  if (name.length > 0) {
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    if (capitalizedName in LucideIcons && typeof (LucideIcons as Record<string, unknown>)[capitalizedName] === "function") {
      return true;
    }
  }
  
  return false;
}

export default IconPicker;
