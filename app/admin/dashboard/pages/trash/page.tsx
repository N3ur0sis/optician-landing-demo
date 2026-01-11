'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  RotateCcw, 
  AlertTriangle, 
  Search,
  ArrowLeft,
  Clock,
  FileText,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

interface DeletedPage {
  id: string;
  slug: string;
  title: string;
  deletedAt: string;
  template: string;
  published: boolean;
}

export default function TrashPage() {
  const [pages, setPages] = useState<DeletedPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmEmptyTrash, setConfirmEmptyTrash] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchDeletedPages();
  }, []);

  const fetchDeletedPages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pages?onlyDeleted=true');
      if (response.ok) {
        const data = await response.json();
        setPages(data);
      }
    } catch (error) {
      console.error('Error fetching deleted pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (slug: string) => {
    try {
      setActionLoading(slug);
      const response = await fetch(`/api/pages/${encodeURIComponent(slug)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restore: true }),
      });

      if (response.ok) {
        setPages(pages.filter(p => p.slug !== slug));
        setSelectedPages(prev => {
          const newSet = new Set(prev);
          newSet.delete(slug);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error restoring page:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handlePermanentDelete = async (slug: string) => {
    try {
      setActionLoading(slug);
      const response = await fetch(`/api/pages/${encodeURIComponent(slug)}?permanent=true`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPages(pages.filter(p => p.slug !== slug));
        setSelectedPages(prev => {
          const newSet = new Set(prev);
          newSet.delete(slug);
          return newSet;
        });
        setConfirmDelete(null);
      }
    } catch (error) {
      console.error('Error permanently deleting page:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleEmptyTrash = async () => {
    try {
      setActionLoading('empty-trash');
      for (const page of pages) {
        await fetch(`/api/pages/${encodeURIComponent(page.slug)}?permanent=true`, {
          method: 'DELETE',
        });
      }
      setPages([]);
      setConfirmEmptyTrash(false);
    } catch (error) {
      console.error('Error emptying trash:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkRestore = async () => {
    setActionLoading('bulk-restore');
    for (const slug of selectedPages) {
      await handleRestore(slug);
    }
    setSelectedPages(new Set());
    setActionLoading(null);
  };

  const handleBulkDelete = async () => {
    setActionLoading('bulk-delete');
    for (const slug of selectedPages) {
      await fetch(`/api/pages/${encodeURIComponent(slug)}?permanent=true`, {
        method: 'DELETE',
      });
    }
    setPages(pages.filter(p => !selectedPages.has(p.slug)));
    setSelectedPages(new Set());
    setActionLoading(null);
  };

  const toggleSelectAll = () => {
    if (selectedPages.size === filteredPages.length) {
      setSelectedPages(new Set());
    } else {
      setSelectedPages(new Set(filteredPages.map(p => p.slug)));
    }
  };

  const toggleSelect = (slug: string) => {
    setSelectedPages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(slug)) {
        newSet.delete(slug);
      } else {
        newSet.add(slug);
      }
      return newSet;
    });
  };

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Aujourd'hui";
    } else if (diffDays === 1) {
      return 'Hier';
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else if (diffDays < 30) {
      return `Il y a ${Math.floor(diffDays / 7)} semaine${Math.floor(diffDays / 7) > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/admin/dashboard/pages"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Trash2 className="w-6 h-6" />
                Corbeille
              </h1>
              <p className="text-gray-600 mt-1">
                Les pages supprimées sont conservées pendant 30 jours avant suppression définitive
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans la corbeille..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-900 placeholder:text-gray-500"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {selectedPages.size > 0 && (
                <>
                  <button
                    onClick={handleBulkRestore}
                    disabled={actionLoading === 'bulk-restore'}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === 'bulk-restore' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RotateCcw className="w-4 h-4" />
                    )}
                    Restaurer ({selectedPages.size})
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    disabled={actionLoading === 'bulk-delete'}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === 'bulk-delete' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Supprimer ({selectedPages.size})
                  </button>
                </>
              )}
              {pages.length > 0 && (
                <button
                  onClick={() => setConfirmEmptyTrash(true)}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Vider la corbeille
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="text-center py-16">
            <Trash2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'Aucun résultat' : 'La corbeille est vide'}
            </h3>
            <p className="text-gray-600">
              {searchQuery 
                ? 'Aucune page ne correspond à votre recherche'
                : 'Les pages supprimées apparaîtront ici'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[auto_1fr_200px_150px_150px] gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedPages.size === filteredPages.length && filteredPages.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-gray-300"
                />
              </div>
              <div>Page</div>
              <div>Supprimée</div>
              <div>Template</div>
              <div className="text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {filteredPages.map((page) => (
                <motion.div
                  key={page.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-[auto_1fr_200px_150px_150px] gap-4 p-4 items-center hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <input
                      type="checkbox"
                      checked={selectedPages.has(page.slug)}
                      onChange={() => toggleSelect(page.slug)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{page.title}</div>
                      <div className="text-sm text-gray-500">{page.slug}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    {formatDate(page.deletedAt)}
                  </div>
                  <div className="text-sm text-gray-600 capitalize">{page.template}</div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleRestore(page.slug)}
                      disabled={actionLoading === page.slug}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Restaurer"
                    >
                      {actionLoading === page.slug ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <RotateCcw className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(page.slug)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer définitivement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirm Delete Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl max-w-md w-full p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Supprimer définitivement ?</h3>
                  <p className="text-gray-600">Cette action est irréversible</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                La page <strong>"{pages.find(p => p.slug === confirmDelete)?.title}"</strong> et toutes ses révisions seront définitivement supprimées.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handlePermanentDelete(confirmDelete)}
                  disabled={actionLoading === confirmDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading === confirmDelete ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Supprimer définitivement
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Empty Trash Modal */}
      <AnimatePresence>
        {confirmEmptyTrash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setConfirmEmptyTrash(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl max-w-md w-full p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Vider la corbeille ?</h3>
                  <p className="text-gray-600">Cette action est irréversible</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Toutes les <strong>{pages.length} page{pages.length > 1 ? 's' : ''}</strong> dans la corbeille seront définitivement supprimées, ainsi que leurs révisions.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setConfirmEmptyTrash(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleEmptyTrash}
                  disabled={actionLoading === 'empty-trash'}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading === 'empty-trash' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Vider la corbeille
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
