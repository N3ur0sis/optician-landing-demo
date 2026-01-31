'use client';

import { useState, ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

// Field component - simple form field wrapper
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-800 mb-1">{label}</label>
      {children}
    </div>
  );
}

// Collapsible section component
export function CollapsibleSection({ 
  title, 
  children, 
  defaultOpen = false 
}: { 
  title: string; 
  children: ReactNode; 
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-300 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
      >
        <span className="font-medium text-sm text-gray-900">{title}</span>
        {isOpen ? <ChevronDown className="w-4 h-4 text-gray-700" /> : <ChevronRight className="w-4 h-4 text-gray-700" />}
      </button>
      {isOpen && <div className="p-3 pt-0 border-t border-gray-200">{children}</div>}
    </div>
  );
}
