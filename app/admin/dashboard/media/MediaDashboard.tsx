'use client';

import { useState, useEffect, useCallback } from 'react';
import {
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
  X,
  MoreVertical,
  FolderOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MediaUploader from '@/components/media/MediaUploader';

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

export default function MediaDashboard() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showUploader, setShowUploader] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
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
    fetchMedia();
  }, [fetchMedia]);

  const handleSelect = (id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.size === media.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(media.map(m => m.id)));
    }
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

  const handleBulkDelete = async () => {
    if (!confirm(`Supprimer ${selectedItems.size} fichier(s) définitivement ?`)) return;

    for (const id of selectedItems) {
      await fetch(`/api/media/${id}`, { method: 'DELETE' });
    }

    fetchMedia();
    setSelectedItems(new Set());
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return ImageIcon;
    if (mimeType.startsWith('video/')) return Video;
    return FileText;
  };

  const totalSize = media.reduce((acc, m) => acc + m.size, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Médiathèque</h1>
          <p className="text-gray-600 mt-1">
            {pagination.total} fichier{pagination.total !== 1 ? 's' : ''} • {formatFileSize(totalSize)} au total
          </p>
        </div>
        <button
          onClick={() => setShowUploader(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          <Upload className="w-4 h-4" />
          Ajouter des fichiers
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex items-center gap-4">
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
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-900 placeholder:text-gray-500"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
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
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  filterType === value
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Bulk actions */}
          {selectedItems.size > 0 && (
            <div className="flex items-center gap-2 pr-3 border-r border-gray-300">
              <span className="text-sm text-gray-600">
                {selectedItems.size} sélectionné{selectedItems.size > 1 ? 's' : ''}
              </span>
              <button
                onClick={handleBulkDelete}
                className="p-1.5 hover:bg-red-100 rounded text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Select all */}
          {media.length > 0 && (
            <button
              onClick={handleSelectAll}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {selectedItems.size === media.length ? 'Tout désélectionner' : 'Tout sélectionner'}
            </button>
          )}

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6">
            <div className={viewMode === 'grid' ? 'grid grid-cols-6 gap-4' : 'space-y-2'}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={`bg-gray-200 rounded-lg animate-pulse ${
                    viewMode === 'grid' ? 'aspect-square' : 'h-16'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : media.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-600">
            <FolderOpen className="w-16 h-16 mb-4 opacity-60" />
            <p className="text-lg font-medium text-gray-700">Aucun média</p>
            <p className="text-sm mt-1">
              {searchQuery
                ? 'Aucun résultat pour cette recherche'
                : 'Commencez par ajouter des fichiers'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowUploader(true)}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                <Upload className="w-4 h-4" />
                Ajouter des fichiers
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-6 gap-4 p-6">
            {media.map(item => {
              const isSelected = selectedItems.has(item.id);
              const FileIcon = getFileIcon(item.mimeType);

              return (
                <div
                  key={item.id}
                  className={`group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                    isSelected
                      ? 'border-black ring-2 ring-black/20'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  onClick={() => setPreviewMedia(item)}
                >
                  {item.mimeType.startsWith('image/') ? (
                    <img
                      src={item.url}
                      alt={item.altText || item.filename}
                      className="w-full h-full object-cover"
                    />
                  ) : item.mimeType.startsWith('video/') ? (
                    <video src={item.url} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileIcon className="w-12 h-12 text-gray-500" />
                    </div>
                  )}

                  {/* Selection Checkbox */}
                  <div
                    className={`absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-black border-black'
                        : 'bg-white/80 border-gray-300 opacity-0 group-hover:opacity-100'
                    }`}
                    onClick={e => {
                      e.stopPropagation();
                      handleSelect(item.id);
                    }}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
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
          <div className="divide-y divide-gray-200">
            {media.map(item => {
              const isSelected = selectedItems.has(item.id);
              const FileIcon = getFileIcon(item.mimeType);

              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                    isSelected ? 'bg-gray-50' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer ${
                      isSelected ? 'bg-black border-black' : 'border-gray-300'
                    }`}
                    onClick={() => handleSelect(item.id)}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>

                  {/* Thumbnail */}
                  <div
                    className="w-14 h-14 bg-gray-100 rounded overflow-hidden flex-shrink-0 cursor-pointer"
                    onClick={() => setPreviewMedia(item)}
                  >
                    {item.mimeType.startsWith('image/') ? (
                      <img
                        src={item.url}
                        alt={item.altText || item.filename}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileIcon className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => setPreviewMedia(item)}
                  >
                    <p className="font-medium text-gray-900 truncate">{item.filename}</p>
                    <p className="text-sm text-gray-600">
                      {formatFileSize(item.size)} • {formatDate(item.uploadedAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingMedia(item)}
                      className="p-2 hover:bg-gray-200 rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <a
                      href={item.url}
                      download={item.filename}
                      className="p-2 hover:bg-gray-200 rounded transition-colors"
                    >
                      <Download className="w-4 h-4 text-gray-600" />
                    </a>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 hover:bg-red-100 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

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
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowUploader(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-xl w-full max-w-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Ajouter des fichiers</h3>
                <button
                  onClick={() => setShowUploader(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <MediaUploader
                  onUploadComplete={() => {
                    fetchMedia();
                    setShowUploader(false);
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewMedia(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex"
            >
              {/* Preview */}
              <div className="flex-1 bg-gray-900 flex items-center justify-center min-h-[400px]">
                {previewMedia.mimeType.startsWith('image/') ? (
                  <img
                    src={previewMedia.url}
                    alt={previewMedia.altText || previewMedia.filename}
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                ) : previewMedia.mimeType.startsWith('video/') ? (
                  <video src={previewMedia.url} controls className="max-w-full max-h-[70vh]" />
                ) : (
                  <div className="text-white text-center">
                    <FileText className="w-24 h-24 mx-auto mb-4 opacity-50" />
                    <p>{previewMedia.filename}</p>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="w-80 p-4 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 truncate">{previewMedia.filename}</h3>
                  <button
                    onClick={() => setPreviewMedia(null)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 flex-1 text-sm">
                  <div>
                    <p className="text-gray-600">Type</p>
                    <p className="text-gray-900">{previewMedia.mimeType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Taille</p>
                    <p className="text-gray-900">{formatFileSize(previewMedia.size)}</p>
                  </div>
                  {previewMedia.width && previewMedia.height && (
                    <div>
                      <p className="text-gray-600">Dimensions</p>
                      <p className="text-gray-900">
                        {previewMedia.width} × {previewMedia.height}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-600">Date d'ajout</p>
                    <p className="text-gray-900">{formatDate(previewMedia.uploadedAt)}</p>
                  </div>
                  {previewMedia.altText && (
                    <div>
                      <p className="text-gray-600">Texte alternatif</p>
                      <p className="text-gray-900">{previewMedia.altText}</p>
                    </div>
                  )}
                  {previewMedia.caption && (
                    <div>
                      <p className="text-gray-600">Légende</p>
                      <p className="text-gray-900">{previewMedia.caption}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-600">URL</p>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={previewMedia.url}
                        readOnly
                        className="flex-1 px-2 py-1 bg-gray-50 border border-gray-300 rounded text-xs"
                      />
                      <button
                        onClick={() => navigator.clipboard.writeText(previewMedia.url)}
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs"
                      >
                        Copier
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-200 mt-4">
                  <button
                    onClick={() => {
                      setEditingMedia(previewMedia);
                      setPreviewMedia(null);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
                  >
                    <Edit2 className="w-4 h-4" />
                    Modifier
                  </button>
                  <a
                    href={previewMedia.url}
                    download={previewMedia.filename}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Télécharger
                  </a>
                  <button
                    onClick={() => {
                      handleDelete(previewMedia.id);
                      setPreviewMedia(null);
                    }}
                    className="p-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingMedia && (
          <EditMediaModal
            media={editingMedia}
            onClose={() => setEditingMedia(null)}
            onSave={data => handleUpdateMedia(editingMedia.id, data)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Edit Modal Component
function EditMediaModal({
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
