"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Plus,
  Search,
  FileText,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  Copy,
  ExternalLink,
  MoreHorizontal,
  Globe,
  Calendar,
  ChevronRight,
  Palette,
  Home,
  Grid3X3,
  Lock,
} from "lucide-react";
import { Page } from "@/types/page-builder";

// Helper to check if a page is the protected homepage
const isHomePage = (slug: string): boolean => {
  const normalized = slug.replace(/^\//, '').toLowerCase();
  return normalized === '' || normalized === '/' || normalized === 'accueil' || normalized === 'home';
};

interface PagesListClientProps {
  initialPages?: Page[];
}

export default function PagesListClient({
  initialPages = [],
}: PagesListClientProps) {
  const [pages, setPages] = useState<Page[]>(initialPages);
  const [loading, setLoading] = useState(!initialPages.length);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  const fetchPages = useCallback(async () => {
    try {
      const response = await fetch("/api/pages");
      if (response.ok) {
        const data = await response.json();
        setPages(data);
      }
    } catch (error) {
      console.error("Error fetching pages:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialPages.length) {
      fetchPages();
    }
  }, [fetchPages, initialPages.length]);

  const handleTogglePublished = async (page: Page) => {
    try {
      const response = await fetch(
        `/api/pages/${encodeURIComponent(page.slug)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ published: !page.published }),
        },
      );

      if (response.ok) {
        setPages(
          pages.map((p) =>
            p.id === page.id ? { ...p, published: !p.published } : p,
          ),
        );
      }
    } catch (error) {
      console.error("Error toggling page status:", error);
    }
  };

  const handleDuplicate = async (page: Page) => {
    try {
      const newSlug = `${page.slug}-copy-${Date.now()}`;
      const response = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${page.title} (copie)`,
          slug: newSlug,
          template: page.template,
          backgroundColor: page.backgroundColor,
          textColor: page.textColor,
          showInNav: false,
          blocks: page.blocks || [],
        }),
      });

      if (response.ok) {
        fetchPages();
      }
    } catch (error) {
      console.error("Error duplicating page:", error);
    }
    setActionMenuOpen(null);
  };

  const handleDelete = async (slug: string) => {
    try {
      const response = await fetch(`/api/pages/${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPages(pages.filter((p) => p.slug !== slug));
        setShowDeleteModal(null);
      }
    } catch (error) {
      console.error("Error deleting page:", error);
    }
  };

  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "published" && page.published) ||
      (filter === "draft" && !page.published);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Pages</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Gérez les pages de votre site</p>
          </div>
          <Link
            href="/admin/dashboard/pages/new"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Nouvelle page
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher une page..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-900 placeholder:text-gray-500"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(["all", "published", "draft"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  filter === f
                    ? "bg-black text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {f === "all"
                  ? "Toutes"
                  : f === "published"
                    ? "Publiées"
                    : "Brouillons"}
              </button>
            ))}
          </div>
        </div>

        {/* Pages List */}
        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-1/4 mb-2" />
                    <div className="h-4 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
            <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery || filter !== "all"
                ? "Aucune page trouvée"
                : "Aucune page créée"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filter !== "all"
                ? "Essayez de modifier vos filtres"
                : "Commencez par créer votre première page"}
            </p>
            {!searchQuery && filter === "all" && (
              <Link
                href="/admin/dashboard/pages/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Créer une page
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {filteredPages.map((page) => {
                const isHome = isHomePage(page.slug);
                
                return (
                <motion.div
                  key={page.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`bg-white rounded-xl p-6 border hover:shadow-lg transition-shadow group ${
                    isHome ? 'border-amber-200 bg-amber-50/30' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        isHome ? 'bg-amber-100' : ''
                      }`}
                      style={isHome ? {} : { backgroundColor: page.backgroundColor + "20" }}
                    >
                      {isHome ? (
                        <Home className="w-6 h-6 text-amber-600" />
                      ) : (
                        <FileText
                          className="w-6 h-6"
                          style={{ color: page.backgroundColor }}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {page.title}
                        </h3>
                        {isHome && (
                          <span className="flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700">
                            <Lock className="w-3 h-3" />
                            Protégée
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            page.published
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {page.published ? "Publié" : "Brouillon"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5" />
                          {page.slug}
                        </span>
                        {page.publishedAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(page.publishedAt).toLocaleDateString(
                              "fr-FR",
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleTogglePublished(page)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title={page.published ? "Dépublier" : "Publier"}
                      >
                        {page.published ? (
                          <EyeOff className="w-4 h-4 text-gray-600" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                      {isHome ? (
                        // Homepage: Link to grid manager instead of page builder
                        <Link
                          href="/admin/dashboard/grid"
                          className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
                          title="Gérer la grille d'accueil"
                        >
                          <Grid3X3 className="w-4 h-4 text-amber-600" />
                        </Link>
                      ) : (
                        <Link
                          href={`/admin/dashboard/pages/edit/${page.slug.replace(/^\//, "")}`}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Pencil className="w-4 h-4 text-gray-600" />
                        </Link>
                      )}
                      <a
                        href={`/${page.slug.replace(/^\//, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Voir la page"
                      >
                        <ExternalLink className="w-4 h-4 text-gray-600" />
                      </a>
                      {/* More actions menu - only for non-homepage */}
                      {!isHome && (
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActionMenuOpen(
                              actionMenuOpen === page.id ? null : page.id,
                            )
                          }
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4 text-gray-600" />
                        </button>
                        {actionMenuOpen === page.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <Link
                              href={`/admin/visual-builder?page=${encodeURIComponent(page.slug)}`}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              onClick={() => setActionMenuOpen(null)}
                            >
                              <Palette className="w-4 h-4" />
                              Visual Builder
                            </Link>
                            <button
                              onClick={() => handleDuplicate(page)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Copy className="w-4 h-4" />
                              Dupliquer
                            </button>
                            <button
                              onClick={() => {
                                setShowDeleteModal(page.slug);
                                setActionMenuOpen(null);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              Supprimer
                            </button>
                          </div>
                        )}
                      </div>
                      )}
                    </div>

                    {/* Arrow - link to grid for homepage, page editor for others */}
                    <Link
                      href={isHome 
                        ? "/admin/dashboard/grid"
                        : `/admin/dashboard/pages/edit/${page.slug.replace(/^\//, "")}`
                      }
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    </Link>
                  </div>
                </motion.div>
              );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Supprimer cette page ?
              </h3>
              <p className="text-gray-600 mb-6">
                Cette action est irréversible. La page et tous ses blocs seront
                définitivement supprimés.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDelete(showDeleteModal)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
