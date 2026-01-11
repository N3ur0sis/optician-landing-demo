'use client';

import { useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import MediaLibrary from './MediaLibrary';

interface MediaItem {
  id: string;
  filename: string;
  path: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  altText?: string;
  caption?: string;
  uploadedAt: string;
}

interface MediaPickerProps {
  value?: string;
  onChange: (url: string, media?: MediaItem) => void;
  acceptTypes?: 'all' | 'image' | 'video' | 'document';
  label?: string;
  placeholder?: string;
  showPreview?: boolean;
  className?: string;
}

export default function MediaPicker({
  value,
  onChange,
  acceptTypes = 'image',
  label,
  placeholder = 'Sélectionner un média',
  showPreview = true,
  className = '',
}: MediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (media: MediaItem | MediaItem[]) => {
    const item = Array.isArray(media) ? media[0] : media;
    if (item) {
      onChange(item.url, item);
    }
  };

  const handleClear = () => {
    onChange('');
  };

  const isImage = value && acceptTypes === 'image';

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-800 mb-1">
          {label}
        </label>
      )}

      {/* Preview */}
      {showPreview && value && isImage && (
        <div className="relative mb-2 rounded-lg overflow-hidden border border-gray-300 bg-gray-50">
          <img
            src={value}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          <button
            onClick={handleClear}
            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input with picker button */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-900 placeholder:text-gray-500 text-sm"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors text-sm font-medium text-gray-700"
        >
          <ImageIcon className="w-4 h-4" />
          Parcourir
        </button>
      </div>

      {/* Media Library Modal */}
      <MediaLibrary
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelect={handleSelect}
        acceptTypes={acceptTypes}
      />
    </div>
  );
}
