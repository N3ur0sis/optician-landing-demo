"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, Reorder } from "framer-motion";
import {
  Plus,
  ChevronRight,
  ChevronDown,
  GripVertical,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Link2,
  Palette,
  Save,
  X,
  FileText,
  Star,
  AlertCircle,
} from "lucide-react";

import {
  NavigationMenu,
  NavigationItem,
  NavigationPage,
  MenuStyleConfig,
  MENU_ALIGNMENTS,
  MOBILE_STYLES,
  DROPDOWN_ANIMATIONS,
  DISPLAY_MODES,
  DEFAULT_MENU,
  DEFAULT_ITEM,
  buildNestedItems,
} from "@/types/navigation";

// ============================================
// MAIN COMPONENT
// ============================================

export default function NavigationManagerClient() {
  const [menu, setMenu] = useState<NavigationMenu | null>(null);
  const [pages, setPages] = useState<NavigationPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal states
  const [showItemModal, setShowItemModal] = useState(false);
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const [parentItemId, setParentItemId] = useState<string | null>(null);

  // Expanded items for tree view
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Fetch menu (singleton - only one menu "header")
  const fetchMenu = useCallback(async () => {
    try {
      const response = await fetch("/api/navigation/menus/header?includeItems=true");
      if (response.ok) {
        const data = await response.json();
        setMenu(data);
      } else if (response.status === 404) {
        // Create default menu if not exists
        const createResponse = await fetch("/api/navigation/menus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(DEFAULT_MENU),
        });
        if (createResponse.ok) {
          const newMenu = await createResponse.json();
          setMenu({ ...newMenu, items: [] });
        }
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch pages for linking
  const fetchPages = useCallback(async () => {
    try {
      const response = await fetch("/api/navigation/pages");
      if (response.ok) {
        const data = await response.json();
        setPages(data);
      }
    } catch (error) {
      console.error("Error fetching pages:", error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchMenu();
    fetchPages();
  }, [fetchMenu, fetchPages]);

  // Save menu style
  const handleSaveStyle = async (styleData: MenuStyleConfig): Promise<boolean> => {
    if (!menu) return false;

    setSaving(true);
    try {
      const response = await fetch(`/api/navigation/menus/${menu.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(styleData),
      });

      if (response.ok) {
        await fetchMenu();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error saving style:", error);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Save item
  const handleSaveItem = async (itemData: Partial<NavigationItem>) => {
    if (!menu) return;

    setSaving(true);
    try {
      const url = editingItem
        ? `/api/navigation/items/${editingItem.id}`
        : "/api/navigation/items";

      const response = await fetch(url, {
        method: editingItem ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...itemData,
          menuId: menu.id,
          parentId: parentItemId,
        }),
      });

      if (response.ok) {
        await fetchMenu();
        setShowItemModal(false);
        setEditingItem(null);
        setParentItemId(null);
      }
    } catch (error) {
      console.error("Error saving item:", error);
    } finally {
      setSaving(false);
    }
  };

  // Delete item
  const handleDeleteItem = async (id: string) => {
    if (!confirm("Supprimer cet élément et ses sous-éléments ?")) return;

    try {
      const response = await fetch(`/api/navigation/items/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchMenu();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Toggle item visibility
  const handleTogglePublished = async (item: NavigationItem) => {
    try {
      await fetch(`/api/navigation/items/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !item.published }),
      });
      await fetchMenu();
    } catch (error) {
      console.error("Error toggling item:", error);
    }
  };

  // Reorder items
  const handleReorderItems = async (items: NavigationItem[], parentId: string | null = null) => {
    const updates = items.map((item, index) => ({
      id: item.id,
      order: index,
      parentId,
    }));

    try {
      await fetch("/api/navigation/items", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updates }),
      });
      await fetchMenu();
    } catch (error) {
      console.error("Error reordering items:", error);
    }
  };

  // Toggle expanded state
  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded w-1/4" />
            <div className="h-96 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const nestedItems = menu ? buildNestedItems(menu.items, null, true) : [];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Navigation</h1>
            <p className="text-gray-600 mt-1">
              Gérez le menu principal de votre site
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowStyleModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
            >
              <Palette className="w-4 h-4" />
              Style
            </button>
            <button
              onClick={() => {
                setEditingItem(null);
                setParentItemId(null);
                setShowItemModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Ajouter un lien
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="font-semibold text-gray-900">Menu Principal</h2>
                <span className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded">
                  {menu?.items?.length || 0} éléments
                </span>
              </div>
              {menu && (
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Alignement: {MENU_ALIGNMENTS[menu.alignment]}</span>
                  <span>Mobile: {MOBILE_STYLES[menu.mobileStyle]}</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-4">
            {nestedItems.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Link2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium">Aucun élément dans le menu</p>
                <p className="text-sm mt-1">Ajoutez des liens vers vos pages</p>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setParentItemId(null);
                    setShowItemModal(true);
                  }}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter un lien
                </button>
              </div>
            ) : (
              <NavigationTree
                items={nestedItems}
                expandedItems={expandedItems}
                onToggleExpand={toggleExpanded}
                onEdit={(item) => {
                  setEditingItem(item);
                  setParentItemId(item.parentId || null);
                  setShowItemModal(true);
                }}
                onAddChild={(parentId) => {
                  setEditingItem(null);
                  setParentItemId(parentId);
                  setShowItemModal(true);
                }}
                onDelete={handleDeleteItem}
                onTogglePublished={handleTogglePublished}
                onReorder={handleReorderItems}
              />
            )}
          </div>
        </div>

        {/* Help text */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-800">
            <strong>Astuce :</strong> Glissez-déposez les éléments pour les réorganiser. 
            Utilisez le bouton "+" sur un élément pour créer un sous-menu (dropdown).
          </p>
        </div>
      </div>

      {/* Item Modal */}
      <ItemModal
        isOpen={showItemModal}
        onClose={() => {
          setShowItemModal(false);
          setEditingItem(null);
          setParentItemId(null);
        }}
        item={editingItem}
        pages={pages}
        isSubItem={parentItemId !== null}
        onSave={handleSaveItem}
        saving={saving}
      />

      {/* Style Modal */}
      {menu && (
        <StyleModal
          isOpen={showStyleModal}
          onClose={() => setShowStyleModal(false)}
          menu={menu}
          onSave={handleSaveStyle}
          saving={saving}
        />
      )}
    </div>
  );
}

// ============================================
// NAVIGATION TREE COMPONENT
// ============================================

interface NavigationTreeProps {
  items: NavigationItem[];
  expandedItems: Set<string>;
  onToggleExpand: (id: string) => void;
  onEdit: (item: NavigationItem) => void;
  onAddChild: (parentId: string) => void;
  onDelete: (id: string) => void;
  onTogglePublished: (item: NavigationItem) => void;
  onReorder: (items: NavigationItem[], parentId: string | null) => void;
  depth?: number;
  parentId?: string | null;
}

function NavigationTree({
  items,
  expandedItems,
  onToggleExpand,
  onEdit,
  onAddChild,
  onDelete,
  onTogglePublished,
  onReorder,
  depth = 0,
  parentId = null,
}: NavigationTreeProps) {
  return (
    <Reorder.Group
      axis="y"
      values={items}
      onReorder={(newOrder) => onReorder(newOrder, parentId)}
      className="space-y-2"
      layoutScroll
    >
      {items.map((item) => (
        <Reorder.Item
          key={item.id}
          value={item}
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 40 }}
          whileDrag={{ scale: 1.02, boxShadow: '0 8px 20px rgba(0,0,0,0.15)', zIndex: 50 }}
        >
          <div
            className={`group border rounded-lg bg-white transition-colors ${
              !item.published ? "opacity-50 border-gray-200" : "border-gray-200 hover:border-gray-300"
            }`}
            style={{ marginLeft: depth * 24 }}
          >
            <div className="flex items-center gap-2 p-3">
              {/* Drag Handle */}
              <GripVertical className="w-4 h-4 text-gray-400 cursor-grab active:cursor-grabbing shrink-0" />

              {/* Expand/Collapse */}
              {item.children && item.children.length > 0 ? (
                <button
                  onClick={() => onToggleExpand(item.id)}
                  className="p-1 hover:bg-gray-100 rounded shrink-0"
                >
                  {expandedItems.has(item.id) ? (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              ) : (
                <div className="w-6 shrink-0" />
              )}

              {/* Item Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 truncate">
                    {item.label}
                  </span>
                  {item.highlighted && (
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 shrink-0" />
                  )}
                  {item.openInNewTab && (
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {item.pageSlug ? (
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      /{item.pageSlug}
                    </span>
                  ) : item.href ? (
                    <span className="flex items-center gap-1">
                      <Link2 className="w-3 h-3" />
                      {item.href}
                    </span>
                  ) : (
                    <span className="text-gray-400">Menu dropdown</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={() => onAddChild(item.id)}
                  className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
                  title="Ajouter un sous-élément"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onTogglePublished(item)}
                  className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
                  title={item.published ? "Masquer" : "Afficher"}
                >
                  {item.published ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => onEdit(item)}
                  className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
                  title="Modifier"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-1.5 hover:bg-red-100 rounded text-red-600"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Children */}
          {item.children && item.children.length > 0 && expandedItems.has(item.id) && (
            <div className="mt-2">
              <NavigationTree
                items={item.children}
                expandedItems={expandedItems}
                onToggleExpand={onToggleExpand}
                onEdit={onEdit}
                onAddChild={onAddChild}
                onDelete={onDelete}
                onTogglePublished={onTogglePublished}
                onReorder={onReorder}
                depth={depth + 1}
                parentId={item.id}
              />
            </div>
          )}
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}

// ============================================
// ITEM MODAL
// ============================================

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: NavigationItem | null;
  pages: NavigationPage[];
  isSubItem: boolean;
  onSave: (data: Partial<NavigationItem>) => void;
  saving: boolean;
}

function ItemModal({ isOpen, onClose, item, pages, isSubItem, onSave, saving }: ItemModalProps) {
  const [formData, setFormData] = useState({
    label: "",
    href: "",
    pageSlug: "",
    linkType: "page" as "custom" | "page" | "none",
    openInNewTab: false,
    highlighted: false,
    published: true,
  });

  useEffect(() => {
    if (item) {
      setFormData({
        label: item.label,
        href: item.href || "",
        pageSlug: item.pageSlug || "",
        linkType: item.pageSlug ? "page" : item.href ? "custom" : "none",
        openInNewTab: item.openInNewTab,
        highlighted: item.highlighted,
        published: item.published,
      });
    } else {
      setFormData({
        label: "",
        href: "",
        pageSlug: "",
        linkType: "page",
        openInNewTab: false,
        highlighted: false,
        published: true,
      });
    }
  }, [item, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: Partial<NavigationItem> = {
      label: formData.label,
      openInNewTab: formData.openInNewTab,
      highlighted: formData.highlighted,
      published: formData.published,
      ...DEFAULT_ITEM,
    };

    if (formData.linkType === "page" && formData.pageSlug) {
      // Store the pageSlug as-is (may or may not have leading /)
      data.pageSlug = formData.pageSlug;
      // Build href - ensure single leading slash
      const cleanSlug = formData.pageSlug.replace(/^\/+/, '');
      data.href = cleanSlug === "home" || cleanSlug === "" ? "/" : `/${cleanSlug}`;
    } else if (formData.linkType === "custom" && formData.href) {
      data.href = formData.href;
      data.pageSlug = undefined;
    } else {
      // No link - dropdown parent only (never clickable)
      data.href = undefined;
      data.pageSlug = undefined;
    }

    onSave(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md m-4"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {item ? "Modifier" : isSubItem ? "Nouveau sous-élément" : "Nouveau lien"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Label */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Libellé
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-900"
              placeholder="Accueil, Services, Contact..."
              required
            />
          </div>

          {/* Link Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de lien
            </label>
            <div className="flex gap-2">
              {[
                { value: "page", label: "Page du site" },
                { value: "custom", label: "URL externe" },
                { value: "none", label: "Menu parent" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, linkType: opt.value as "page" | "custom" | "none" })}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                    formData.linkType === opt.value
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Page selector */}
          {formData.linkType === "page" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Page
              </label>
              <select
                value={formData.pageSlug}
                onChange={(e) => setFormData({ ...formData, pageSlug: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-900"
              >
                <option value="">Sélectionner une page...</option>
                {pages.map((page) => (
                  <option key={page.id} value={page.slug}>
                    {page.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Custom URL */}
          {formData.linkType === "custom" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL
              </label>
              <input
                type="text"
                value={formData.href}
                onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-900"
                placeholder="https://exemple.com ou /page"
              />
            </div>
          )}

          {/* No link info */}
          {formData.linkType === "none" && (
            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
              Cet élément servira uniquement de parent pour un menu dropdown. 
              Ajoutez des sous-éléments après la création.
            </div>
          )}

          {/* Options */}
          <div className="space-y-2 pt-2">
            {formData.linkType !== "none" && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.openInNewTab}
                  onChange={(e) => setFormData({ ...formData, openInNewTab: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Ouvrir dans un nouvel onglet</span>
              </label>
            )}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Publié</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving || !formData.label}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {item ? "Enregistrer" : "Ajouter"}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ============================================
// PREVIEW COMPONENTS WITH HOVER STATE
// ============================================

interface PreviewItemProps {
  label: string;
  isActive: boolean;
  textColor: string;
  hoverColor: string;
  activeColor: string;
  fontSize: number;
}

function PreviewItem({ label, isActive, textColor, hoverColor, activeColor, fontSize }: PreviewItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <span
      className="font-medium transition-colors cursor-pointer"
      style={{ 
        color: isActive ? activeColor : isHovered ? hoverColor : textColor,
        fontSize,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {label}
    </span>
  );
}

interface NavbarPreviewProps {
  formData: MenuStyleConfig;
  menuItems: NavigationItem[];
}

function NavbarPreview({ formData, menuItems }: NavbarPreviewProps) {
  const items = menuItems.length > 0 
    ? menuItems.map(item => item.label)
    : ["Accueil", "Services", "Contact"];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Aperçu (survolez pour voir l&apos;effet)</label>
      <div
        className="rounded-lg flex items-center px-4"
        style={{ 
          backgroundColor: formData.backgroundColor || "#ffffff",
          height: formData.navbarHeight || 64,
          justifyContent: formData.alignment === 'left' ? 'flex-start' : 
                          formData.alignment === 'right' ? 'flex-end' : 
                          formData.alignment === 'space-between' ? 'space-between' : 'center',
          gap: formData.itemSpacing || 24,
        }}
      >
        {items.map((label, i) => (
          <PreviewItem
            key={i}
            label={label}
            isActive={i === 0}
            textColor={formData.textColor || "#000000"}
            hoverColor={formData.hoverColor || "#666666"}
            activeColor={formData.activeColor || "#000000"}
            fontSize={formData.fontSize || 14}
          />
        ))}
      </div>
    </div>
  );
}

interface MobilePreviewProps {
  formData: MenuStyleConfig;
  menuItems: NavigationItem[];
}

function MobilePreview({ formData, menuItems }: MobilePreviewProps) {
  const items = menuItems.length > 0 
    ? menuItems.map(item => item.label)
    : ["Accueil", "Services", "Contact"];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Aperçu (survolez pour voir l&apos;effet)</label>
      <div
        className="rounded-lg p-4 space-y-3"
        style={{ backgroundColor: formData.mobileMenuBg || "rgba(0,0,0,0.95)" }}
      >
        {items.map((label, i) => (
          <MobilePreviewItem
            key={i}
            label={label}
            isActive={i === 0}
            textColor={formData.mobileMenuText || "#ffffff"}
            hoverColor={formData.mobileMenuHover || "#999999"}
            accentColor={formData.mobileMenuAccent || "#f59e0b"}
            fontSize={formData.mobileFontSize || 18}
          />
        ))}
      </div>
    </div>
  );
}

interface MobilePreviewItemProps {
  label: string;
  isActive: boolean;
  textColor: string;
  hoverColor: string;
  accentColor: string;
  fontSize: number;
}

function MobilePreviewItem({ label, isActive, textColor, hoverColor, accentColor, fontSize }: MobilePreviewItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className="font-medium border-b pb-2 cursor-pointer transition-colors"
      style={{
        color: isActive ? accentColor : isHovered ? hoverColor : textColor,
        borderColor: `${textColor}20`,
        fontSize,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {label}
    </div>
  );
}

// ============================================
// STYLE MODAL
// ============================================

interface StyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  menu: NavigationMenu;
  onSave: (data: MenuStyleConfig) => Promise<boolean>;
  saving: boolean;
}

function StyleModal({ isOpen, onClose, menu, onSave, saving }: StyleModalProps) {
  const [activeTab, setActiveTab] = useState<"navbar" | "mobile">("navbar");
  
  const getInitialFormData = useCallback((): MenuStyleConfig => ({
    // Navbar
    navbarHeight: menu.navbarHeight || 64,
    backgroundColor: menu.backgroundColor || "#ffffff",
    textColor: menu.textColor || "#000000",
    hoverColor: menu.hoverColor || "#666666",
    activeColor: menu.activeColor || "#000000",
    itemSpacing: menu.itemSpacing,
    fontSize: menu.fontSize || 14,
    // Mobile menu
    mobileMenuBg: menu.mobileMenuBg || "rgba(0,0,0,0.95)",
    mobileMenuText: menu.mobileMenuText || "#ffffff",
    mobileMenuHover: menu.mobileMenuHover || "#999999",
    mobileMenuAccent: menu.mobileMenuAccent || "#f59e0b",
    mobileFontSize: menu.mobileFontSize || 18,
    // Display
    displayMode: menu.displayMode || "hamburger-only",
    alignment: menu.alignment || "center",
    mobileStyle: menu.mobileStyle || "hamburger",
    // Behavior
    shadowOnScroll: menu.shadowOnScroll ?? true,
    shrinkOnScroll: menu.shrinkOnScroll ?? true,
    scrollOpacity: menu.scrollOpacity ?? 100,
    hideOnScrollDown: menu.hideOnScrollDown ?? false,
    // Animation
    dropdownAnimation: menu.dropdownAnimation,
    dropdownDelay: menu.dropdownDelay,
  }), [menu]);

  const [formData, setFormData] = useState<MenuStyleConfig>(getInitialFormData());
  const [initialFormData, setInitialFormData] = useState<MenuStyleConfig>(getInitialFormData());

  // Check if there are unsaved changes
  const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialFormData);

  const handleColorChange = (field: keyof MenuStyleConfig, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const data = getInitialFormData();
    setFormData(data);
    setInitialFormData(data);
  }, [menu, isOpen, getInitialFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSave(formData);
    if (success) {
      // Reset initialFormData to current formData after successful save
      setInitialFormData(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-xl m-4 max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Style de la navigation</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("navbar")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "navbar"
                ? "text-black border-b-2 border-black"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Barre de navigation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("mobile")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "mobile"
                ? "text-black border-b-2 border-black"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Menu hamburger
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-5">
            {activeTab === "navbar" && (
              <>
                {/* Mode d'affichage */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mode d&apos;affichage</label>
                    <select
                      value={formData.displayMode || "hamburger-only"}
                      onChange={(e) => setFormData({ ...formData, displayMode: e.target.value as MenuStyleConfig["displayMode"] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                    >
                      {Object.entries(DISPLAY_MODES).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alignement du menu</label>
                    <select
                      value={formData.alignment || "center"}
                      onChange={(e) => setFormData({ ...formData, alignment: e.target.value as MenuStyleConfig["alignment"] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                    >
                      {Object.entries(MENU_ALIGNMENTS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Dimensions */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hauteur (px)</label>
                    <input
                      type="number"
                      value={formData.navbarHeight}
                      onChange={(e) => setFormData({ ...formData, navbarHeight: parseInt(e.target.value) || 64 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                      min="40"
                      max="120"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Espacement items (px)</label>
                    <input
                      type="number"
                      value={formData.itemSpacing}
                      onChange={(e) => setFormData({ ...formData, itemSpacing: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                {/* Taille de police */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taille du texte: {formData.fontSize || 14}px
                  </label>
                  <input
                    type="range"
                    value={formData.fontSize || 14}
                    onChange={(e) => setFormData({ ...formData, fontSize: parseInt(e.target.value) })}
                    className="w-full"
                    min="10"
                    max="20"
                    step="1"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>10px</span>
                    <span>20px</span>
                  </div>
                </div>

                {/* Couleurs navbar */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Couleurs</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: "backgroundColor", label: "Fond" },
                      { key: "textColor", label: "Texte" },
                      { key: "hoverColor", label: "Survol" },
                      { key: "activeColor", label: "Actif" },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-2">
                        <input
                          type="color"
                          value={(formData[key as keyof MenuStyleConfig] as string) || "#000000"}
                          onChange={(e) => handleColorChange(key as keyof MenuStyleConfig, e.target.value)}
                          className="w-8 h-8 rounded border border-gray-200 cursor-pointer shrink-0"
                        />
                        <span className="text-sm text-gray-600">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comportement au scroll */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Comportement au scroll</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.shadowOnScroll ?? true}
                        onChange={(e) => setFormData({ ...formData, shadowOnScroll: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Ombre au scroll</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.shrinkOnScroll ?? true}
                        onChange={(e) => setFormData({ ...formData, shrinkOnScroll: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Réduire la hauteur au scroll</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.hideOnScrollDown ?? false}
                        onChange={(e) => setFormData({ ...formData, hideOnScrollDown: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Masquer au scroll vers le bas</span>
                    </label>
                  </div>
                </div>

                {/* Opacité au scroll */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Opacité au scroll: {formData.scrollOpacity ?? 100}%
                  </label>
                  <input
                    type="range"
                    value={formData.scrollOpacity ?? 100}
                    onChange={(e) => setFormData({ ...formData, scrollOpacity: parseInt(e.target.value) })}
                    className="w-full"
                    min="0"
                    max="100"
                    step="5"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Transparent</span>
                    <span>Opaque</span>
                  </div>
                </div>

                {/* Aperçu navbar */}
                <NavbarPreview 
                  formData={formData} 
                  menuItems={menu.items?.filter(item => item.published).slice(0, 5) || []}
                />
              </>
            )}

            {activeTab === "mobile" && (
              <>
                {/* Couleurs menu mobile */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Couleurs du menu</label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.mobileMenuBg?.startsWith("rgba") ? "#000000" : (formData.mobileMenuBg || "#000000")}
                        onChange={(e) => setFormData({ ...formData, mobileMenuBg: e.target.value })}
                        className="w-10 h-10 rounded border border-gray-200 cursor-pointer shrink-0"
                      />
                      <div className="flex-1">
                        <span className="text-sm text-gray-700">Fond du menu</span>
                        <input
                          type="text"
                          value={formData.mobileMenuBg || ""}
                          onChange={(e) => setFormData({ ...formData, mobileMenuBg: e.target.value })}
                          className="w-full mt-1 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900 font-mono"
                          placeholder="rgba(0,0,0,0.95) ou #000000"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={(formData.mobileMenuText || "#ffffff")}
                        onChange={(e) => setFormData({ ...formData, mobileMenuText: e.target.value })}
                        className="w-10 h-10 rounded border border-gray-200 cursor-pointer shrink-0"
                      />
                      <span className="text-sm text-gray-700">Couleur du texte</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={(formData.mobileMenuHover || "#999999")}
                        onChange={(e) => setFormData({ ...formData, mobileMenuHover: e.target.value })}
                        className="w-10 h-10 rounded border border-gray-200 cursor-pointer shrink-0"
                      />
                      <span className="text-sm text-gray-700">Couleur de survol</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={(formData.mobileMenuAccent || "#f59e0b")}
                        onChange={(e) => setFormData({ ...formData, mobileMenuAccent: e.target.value })}
                        className="w-10 h-10 rounded border border-gray-200 cursor-pointer shrink-0"
                      />
                      <span className="text-sm text-gray-700">Couleur d&apos;accent (éléments actifs)</span>
                    </div>
                  </div>
                </div>

                {/* Taille de police mobile */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taille du texte: {formData.mobileFontSize || 18}px
                  </label>
                  <input
                    type="range"
                    value={formData.mobileFontSize || 18}
                    onChange={(e) => setFormData({ ...formData, mobileFontSize: parseInt(e.target.value) })}
                    className="w-full"
                    min="14"
                    max="28"
                    step="1"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>14px</span>
                    <span>28px</span>
                  </div>
                </div>

                {/* Aperçu menu mobile */}
                <MobilePreview 
                  formData={formData} 
                  menuItems={menu.items?.filter(item => item.published).slice(0, 4) || []}
                />
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50 shrink-0">
            <div className="flex items-center gap-2">
              {hasChanges && (
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full text-sm font-medium">
                  <AlertCircle className="h-4 w-4" />
                  Non sauvegardé
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Fermer
              </button>
              <button
                type="submit"
                disabled={saving || !hasChanges}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  hasChanges 
                    ? "bg-black text-white hover:bg-gray-800" 
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Appliquer
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
