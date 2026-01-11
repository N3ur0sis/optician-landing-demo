'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  Image as ImageIcon,
  Video,
  FileText,
  Grid3X3,
  List,
  Trash2,
  Check,
  ChevronLeft,
  ChevronRight,
  Upload,
  Edit2,
  Download,
} from 'lucide-react';
import MediaUploader from './MediaUploader';

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

interface MediaLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (media: MediaItem | MediaItem[]) => void;
  multiple?: boolean;
  acceptTypes?: 'all' | 'image' | 'video' | 'document';
}

export default function MediaLibrary({
  isOpen,
  onClose,
  onSelect,
  multiple = false,
  acceptTypes = 'all',
}: MediaLibraryProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'document'>(
    acceptTypes === 'all' ? 'all' : acceptTypes
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showUploader, setShowUploader] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 24,
    total: 0,
    totalPages: 0,
  });

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
        search: searchQuery,
        type: filterType === 'all' ? '' : filterType,
        sortBy: 'uploadedAt',
        sortOrder: 'desc',
      });

      const response = await fetch(`/api/media?${params}`);
      if (response.ok) {
        const data = await response.json();
        setMedia(data.media);
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        }));
      }
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchQuery, filterType]);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen, fetchMedia]);

  const handleSelect = (item: MediaItem) => {
    if (multiple) {
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        if (newSet.has(item.id)) {
          newSet.delete(item.id);
        } else {
          newSet.add(item.id);
        }
        return newSet;
      });
    } else {
      setSelectedItems(new Set([item.id]));
    }
  };

  const handleConfirmSelection = () => {
    const selected = media.filter(m => selectedItems.has(m.id));
    if (onSelect) {
      onSelect(multiple ? selected : selected[0]);
    }
    onClose();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce fichier définitivement ?')) return;

    try {
      const response = await fetch(`/api/media/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setMedia(prev => prev.filter(m => m.id !== id));
        setSelectedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error deleting media:', error);
    }
  };

  const handleUpdateMedia = async (id: string, data: { altText?: string; caption?: string }) => {
    try {
      const response = await fetch(`/api/media/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const updated = await response.json();
        setMedia(prev => prev.map(m => (m.id === id ? updated : m)));
        setEditingMedia(null);
      }
    } catch (error) {
      console.error('Error updating media:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return ImageIcon;
    if (mimeType.startsWith('video/')) return Video;
    return FileText;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Médiathèque</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowUploader(!showUploader)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  showUploader
                    ? 'bg-gray-200 text-gray-800'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                <Upload className="w-4 h-4" />
                Ajouter
              </button>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Upload Zone (collapsible) */}
          <AnimatePresence>
            {showUploader && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-b border-gray-200 overflow-hidden"
              >
                <div className="p-4">
                  <MediaUploader
                    onUploadComplete={() => {
                      fetchMedia();
                      setShowUploader(false);
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toolbar */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setPagination(prev => ({ ...prev, page: 1 }));
                  }}
                  placeholder="Rechercher..."
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>

              {/* Type Filter */}
              <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-1">
                {[
                  { value: 'all', label: 'Tous' },
                  { value: 'image', label: 'Images', icon: ImageIcon },
                  { value: 'video', label: 'Vidéos', icon: Video },
                  { value: 'document', label: 'Documents', icon: FileText },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => {
                      setFilterType(value as typeof filterType);
                      setPagination(prev => ({ ...prev, page: 1 }));
                    }}
                    disabled={acceptTypes !== 'all' && value !== 'all' && value !== acceptTypes}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      filterType === value
                        ? 'bg-black text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : media.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-600">
                <ImageIcon className="w-12 h-12 mb-4 opacity-60" />
                <p className="text-lg font-medium">Aucun média</p>
                <p className="text-sm mt-1">
                  {searchQuery
                    ? 'Aucun résultat pour cette recherche'
                    : 'Ajoutez des fichiers pour commencer'}
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-4 gap-4">
                {media.map(item => {
                  const isSelected = selectedItems.has(item.id);
                  const FileIcon = getFileIcon(item.mimeType);

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className={`group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                        isSelected
                          ? 'border-black ring-2 ring-black/20'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      {item.mimeType.startsWith('image/') ? (
                        <img
                          src={item.url}
                          alt={item.altText || item.filename}
                          className="w-full h-full object-cover"
                        />
                      ) : item.mimeType.startsWith('video/') ? (
                        <video
                          src={item.url}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileIcon className="w-12 h-12 text-gray-500" />
                        </div>
                      )}

                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}

                      {/* Hover Actions */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setEditingMedia(item);
                          }}
                          className="p-2 bg-white rounded-lg hover:bg-gray-100"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                          className="p-2 bg-white rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>

                      {/* Filename */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="text-white text-xs truncate">{item.filename}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                {media.map(item => {
                  const isSelected = selectedItems.has(item.id);
                  const FileIcon = getFileIcon(item.mimeType);

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer border transition-all ${
                        isSelected
                          ? 'border-black bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        {item.mimeType.startsWith('image/') ? (
                          <img
                            src={item.url}
                            alt={item.altText || item.filename}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileIcon className="w-8 h-8 text-gray-500" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{item.filename}</p>
                        <p className="text-sm text-gray-600">
                          {formatFileSize(item.size)} • {formatDate(item.uploadedAt)}
                        </p>
                        {item.altText && (
                          <p className="text-xs text-gray-500 truncate mt-1">
                            Alt: {item.altText}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setEditingMedia(item);
                          }}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                        <a
                          href={item.url}
                          download={item.filename}
                          onClick={e => e.stopPropagation()}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                        >
                          <Download className="w-4 h-4 text-gray-600" />
                        </a>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                          className="p-2 hover:bg-red-100 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>

                      {/* Selection */}
                      {isSelected && (
                        <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-200">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600">
                Page {pagination.page} sur {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Footer with selection */}
          {onSelect && (
            <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600">
                {selectedItems.size > 0
                  ? `${selectedItems.size} fichier${selectedItems.size > 1 ? 's' : ''} sélectionné${selectedItems.size > 1 ? 's' : ''}`
                  : 'Aucune sélection'}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmSelection}
                  disabled={selectedItems.size === 0}
                  className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sélectionner
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Edit Modal */}
        <AnimatePresence>
          {editingMedia && (
            <MediaEditModal
              media={editingMedia}
              onClose={() => setEditingMedia(null)}
              onSave={data => handleUpdateMedia(editingMedia.id, data)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

// Edit Modal Component
function MediaEditModal({
  media,
  onClose,
  onSave,
}: {
  media: MediaItem;
  onClose: () => void;
  onSave: (data: { altText?: string; caption?: string }) => void;
}) {
  const [altText, setAltText] = useState(media.altText || '');
  const [caption, setCaption] = useState(media.caption || '');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-xl w-full max-w-lg overflow-hidden"
      >
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Modifier le média</h3>
        </div>

        <div className="p-4 space-y-4">
          {/* Preview */}
          {media.mimeType.startsWith('image/') && (
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={media.url}
                alt={media.altText || media.filename}
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* Filename */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Nom du fichier
            </label>
            <p className="text-sm text-gray-600">{media.filename}</p>
          </div>

          {/* Alt Text */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Texte alternatif (SEO)
            </label>
            <input
              type="text"
              value={altText}
              onChange={e => setAltText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-900 placeholder:text-gray-500"
              placeholder="Description de l'image pour l'accessibilité"
            />
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Légende
            </label>
            <textarea
              value={caption}
              onChange={e => setCaption(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-900 placeholder:text-gray-500"
              placeholder="Légende optionnelle"
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={media.url}
                readOnly
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-600"
              />
              <button
                onClick={() => navigator.clipboard.writeText(media.url)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
              >
                Copier
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
          >
            Annuler
          </button>
          <button
            onClick={() => onSave({ altText, caption })}
            className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800"
          >
            Enregistrer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
