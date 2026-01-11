'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Plus,
  Menu,
  ChevronRight,
  ChevronDown,
  GripVertical,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Link2,
  Settings2,
  Palette,
  LayoutGrid,
  Save,
  X,
  FileText,
  Home,
  Star,
  Copy,
  MoreHorizontal,
} from 'lucide-react';

// Types
interface NavigationMenu {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type: string;
  position: string;
  layout: string;
  alignment: string;
  animation: string;
  animationDuration: number;
  backgroundColor?: string;
  textColor?: string;
  hoverColor?: string;
  activeColor?: string;
  borderColor?: string;
  itemSpacing: number;
  padding?: string;
  dropdownAnimation: string;
  dropdownDelay: number;
  customCSS?: string;
  cssClasses?: string;
  mobileBreakpoint: number;
  mobileStyle: string;
  published: boolean;
  items: NavigationItem[];
}

interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  parentId?: string;
  menuId?: string;
  order: number;
  depth: number;
  pageSlug?: string;
  openInNewTab: boolean;
  icon?: string;
  iconPosition: string;
  cssClass?: string;
  style: Record<string, unknown>;
  dropdownStyle: string;
  published: boolean;
  highlighted: boolean;
  children?: NavigationItem[];
}

interface Page {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  navLabel?: string;
}

export default function NavigationManagerClient() {
  const [menus, setMenus] = useState<NavigationMenu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<NavigationMenu | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Modal states
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [editingMenu, setEditingMenu] = useState<NavigationMenu | null>(null);
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const [parentItemId, setParentItemId] = useState<string | null>(null);
  
  // Expanded items for tree view
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Fetch menus
  const fetchMenus = useCallback(async () => {
    try {
      const response = await fetch('/api/navigation/menus?includeItems=true');
      if (response.ok) {
        const data = await response.json();
        setMenus(data);
        if (data.length > 0 && !selectedMenu) {
          setSelectedMenu(data[0]);
        } else if (selectedMenu) {
          // Refresh selected menu
          const updated = data.find((m: NavigationMenu) => m.id === selectedMenu.id);
          if (updated) setSelectedMenu(updated);
        }
      }
    } catch (error) {
      console.error('Error fetching menus:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedMenu]);

  // Fetch pages for linking
  const fetchPages = useCallback(async () => {
    try {
      const response = await fetch('/api/navigation/pages');
      if (response.ok) {
        const data = await response.json();
        setPages(data);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
  }, []);

  useEffect(() => {
    fetchMenus();
    fetchPages();
  }, [fetchMenus, fetchPages]);

  // Create/Update Menu
  const handleSaveMenu = async (menuData: Partial<NavigationMenu>) => {
    setSaving(true);
    try {
      const url = editingMenu 
        ? `/api/navigation/menus/${editingMenu.slug}`
        : '/api/navigation/menus';
      
      const response = await fetch(url, {
        method: editingMenu ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menuData),
      });

      if (response.ok) {
        await fetchMenus();
        setShowMenuModal(false);
        setEditingMenu(null);
      }
    } catch (error) {
      console.error('Error saving menu:', error);
    } finally {
      setSaving(false);
    }
  };

  // Delete Menu
  const handleDeleteMenu = async (slug: string) => {
    if (!confirm('Supprimer ce menu et tous ses éléments ?')) return;
    
    try {
      const response = await fetch(`/api/navigation/menus/${slug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        if (selectedMenu?.slug === slug) {
          setSelectedMenu(null);
        }
        await fetchMenus();
      }
    } catch (error) {
      console.error('Error deleting menu:', error);
    }
  };

  // Create/Update Item
  const handleSaveItem = async (itemData: Partial<NavigationItem>) => {
    setSaving(true);
    try {
      const url = editingItem 
        ? `/api/navigation/items/${editingItem.id}`
        : '/api/navigation/items';
      
      const response = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...itemData,
          menuId: selectedMenu?.id,
          parentId: parentItemId,
        }),
      });

      if (response.ok) {
        await fetchMenus();
        setShowItemModal(false);
        setEditingItem(null);
        setParentItemId(null);
      }
    } catch (error) {
      console.error('Error saving item:', error);
    } finally {
      setSaving(false);
    }
  };

  // Delete Item
  const handleDeleteItem = async (id: string) => {
    if (!confirm('Supprimer cet élément ?')) return;
    
    try {
      const response = await fetch(`/api/navigation/items/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchMenus();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  // Toggle item visibility
  const handleToggleItemPublished = async (item: NavigationItem) => {
    try {
      await fetch(`/api/navigation/items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !item.published }),
      });
      await fetchMenus();
    } catch (error) {
      console.error('Error toggling item:', error);
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
      await fetch('/api/navigation/items', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updates }),
      });
      await fetchMenus();
    } catch (error) {
      console.error('Error reordering items:', error);
    }
  };

  // Build nested items structure
  const buildNestedItems = (items: NavigationItem[], parentId: string | null = null): NavigationItem[] => {
    return items
      .filter(item => item.parentId === parentId)
      .sort((a, b) => a.order - b.order)
      .map(item => ({
        ...item,
        children: buildNestedItems(items, item.id),
      }));
  };

  // Toggle expanded state
  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
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
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded w-1/4" />
            <div className="grid grid-cols-4 gap-6">
              <div className="h-96 bg-gray-200 rounded-xl" />
              <div className="col-span-3 h-96 bg-gray-200 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Navigation</h1>
            <p className="text-gray-600 mt-1">Gérez les menus et la navigation de votre site</p>
          </div>
          <button
            onClick={() => {
              setEditingMenu(null);
              setShowMenuModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouveau menu
          </button>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {/* Menus List */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Menu className="w-4 h-4" />
                Menus
              </h2>
            </div>
            <div className="p-2">
              {menus.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <LayoutGrid className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucun menu créé</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {menus.map((menu) => (
                    <div
                      key={menu.id}
                      onClick={() => setSelectedMenu(menu)}
                      className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedMenu?.id === menu.id
                          ? 'bg-black text-white'
                          : 'hover:bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="truncate font-medium">{menu.name}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          selectedMenu?.id === menu.id
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {menu.items?.length || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingMenu(menu);
                            setShowMenuModal(true);
                          }}
                          className={`p-1 rounded hover:bg-white/20 ${
                            selectedMenu?.id === menu.id ? 'text-white' : 'text-gray-600'
                          }`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMenu(menu.slug);
                          }}
                          className={`p-1 rounded hover:bg-red-500/20 ${
                            selectedMenu?.id === menu.id ? 'text-white' : 'text-gray-600'
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Menu Items Editor */}
          <div className="col-span-3 bg-white rounded-xl border border-gray-200 overflow-hidden">
            {selectedMenu ? (
              <>
                {/* Menu Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedMenu.name}</h2>
                    <p className="text-sm text-gray-500">
                      {selectedMenu.type} • {selectedMenu.layout} • {selectedMenu.items?.length || 0} éléments
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowStyleModal(true)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700"
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
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-black text-white rounded-lg hover:bg-gray-800"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter
                    </button>
                  </div>
                </div>

                {/* Items Tree */}
                <div className="p-4">
                  {!selectedMenu.items || selectedMenu.items.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Link2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="font-medium">Aucun élément dans ce menu</p>
                      <p className="text-sm mt-1">Ajoutez des liens, pages ou sous-menus</p>
                      <button
                        onClick={() => {
                          setEditingItem(null);
                          setParentItemId(null);
                          setShowItemModal(true);
                        }}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter un élément
                      </button>
                    </div>
                  ) : (
                    <NavigationTree
                      items={buildNestedItems(selectedMenu.items)}
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
                      onTogglePublished={handleToggleItemPublished}
                      onReorder={handleReorderItems}
                    />
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-96 text-gray-500">
                <div className="text-center">
                  <Menu className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">Sélectionnez un menu</p>
                  <p className="text-sm mt-1">ou créez-en un nouveau</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu Modal */}
      <MenuModal
        isOpen={showMenuModal}
        onClose={() => {
          setShowMenuModal(false);
          setEditingMenu(null);
        }}
        menu={editingMenu}
        onSave={handleSaveMenu}
        saving={saving}
      />

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
        onSave={handleSaveItem}
        saving={saving}
      />

      {/* Style Modal */}
      {selectedMenu && (
        <StyleModal
          isOpen={showStyleModal}
          onClose={() => setShowStyleModal(false)}
          menu={selectedMenu}
          onSave={handleSaveMenu}
          saving={saving}
        />
      )}
    </div>
  );
}

// Navigation Tree Component
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
      className="space-y-1"
    >
      {items.map((item) => (
        <Reorder.Item key={item.id} value={item}>
          <div
            className={`group border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-colors ${
              !item.published ? 'opacity-60' : ''
            }`}
            style={{ marginLeft: depth * 24 }}
          >
            <div className="flex items-center gap-2 p-3">
              {/* Drag Handle */}
              <GripVertical className="w-4 h-4 text-gray-400 cursor-grab active:cursor-grabbing" />
              
              {/* Expand/Collapse */}
              {item.children && item.children.length > 0 ? (
                <button
                  onClick={() => onToggleExpand(item.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {expandedItems.has(item.id) ? (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              ) : (
                <div className="w-6" />
              )}

              {/* Item Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 truncate">{item.label}</span>
                  {item.highlighted && (
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  )}
                  {item.openInNewTab && (
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {item.pageSlug ? (
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Page: {item.pageSlug}
                    </span>
                  ) : item.href ? (
                    <span className="flex items-center gap-1">
                      <Link2 className="w-3 h-3" />
                      {item.href}
                    </span>
                  ) : (
                    <span className="text-gray-400">Sous-menu uniquement</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                  title={item.published ? 'Masquer' : 'Afficher'}
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
            <div className="mt-1">
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

// Menu Modal Component
interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  menu: NavigationMenu | null;
  onSave: (data: Partial<NavigationMenu>) => void;
  saving: boolean;
}

function MenuModal({ isOpen, onClose, menu, onSave, saving }: MenuModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    type: 'header',
    position: 'top',
    layout: 'horizontal',
    alignment: 'center',
    mobileStyle: 'hamburger',
    published: true,
  });

  useEffect(() => {
    if (menu) {
      setFormData({
        name: menu.name,
        slug: menu.slug,
        description: menu.description || '',
        type: menu.type,
        position: menu.position,
        layout: menu.layout,
        alignment: menu.alignment,
        mobileStyle: menu.mobileStyle,
        published: menu.published,
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        type: 'header',
        position: 'top',
        layout: 'horizontal',
        alignment: 'center',
        mobileStyle: 'hamburger',
        published: true,
      });
    }
  }, [menu, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-lg m-4"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {menu ? 'Modifier le menu' : 'Nouveau menu'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-900"
                placeholder="Menu principal"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-900"
                placeholder="header"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-900"
              placeholder="Description optionnelle"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-900"
              >
                <option value="header">Header</option>
                <option value="footer">Footer</option>
                <option value="sidebar">Sidebar</option>
                <option value="mobile">Mobile</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <select
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-900"
              >
                <option value="top">Haut</option>
                <option value="bottom">Bas</option>
                <option value="left">Gauche</option>
                <option value="right">Droite</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Layout</label>
              <select
                value={formData.layout}
                onChange={(e) => setFormData({ ...formData, layout: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-900"
              >
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
                <option value="grid">Grille</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alignement</label>
              <select
                value={formData.alignment}
                onChange={(e) => setFormData({ ...formData, alignment: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-900"
              >
                <option value="left">Gauche</option>
                <option value="center">Centre</option>
                <option value="right">Droite</option>
                <option value="space-between">Réparti</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Style mobile</label>
            <select
              value={formData.mobileStyle}
              onChange={(e) => setFormData({ ...formData, mobileStyle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-900"
            >
              <option value="hamburger">Menu hamburger</option>
              <option value="slide">Slide</option>
              <option value="accordion">Accordéon</option>
            </select>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Publié</span>
          </label>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {menu ? 'Enregistrer' : 'Créer'}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// Item Modal Component
interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: NavigationItem | null;
  pages: Page[];
  onSave: (data: Partial<NavigationItem>) => void;
  saving: boolean;
}

function ItemModal({ isOpen, onClose, item, pages, onSave, saving }: ItemModalProps) {
  const [formData, setFormData] = useState({
    label: '',
    href: '',
    pageSlug: '',
    linkType: 'custom' as 'custom' | 'page',
    openInNewTab: false,
    icon: '',
    iconPosition: 'left',
    highlighted: false,
    published: true,
  });

  useEffect(() => {
    if (item) {
      setFormData({
        label: item.label,
        href: item.href || '',
        pageSlug: item.pageSlug || '',
        linkType: item.pageSlug ? 'page' : 'custom',
        openInNewTab: item.openInNewTab,
        icon: item.icon || '',
        iconPosition: item.iconPosition,
        highlighted: item.highlighted,
        published: item.published,
      });
    } else {
      setFormData({
        label: '',
        href: '',
        pageSlug: '',
        linkType: 'custom',
        openInNewTab: false,
        icon: '',
        iconPosition: 'left',
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
      icon: formData.icon || undefined,
      iconPosition: formData.iconPosition,
      highlighted: formData.highlighted,
      published: formData.published,
    };

    if (formData.linkType === 'page') {
      data.pageSlug = formData.pageSlug;
      data.href = `/${formData.pageSlug}`;
    } else {
      data.href = formData.href || undefined;
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
        className="bg-white rounded-xl shadow-xl w-full max-w-lg m-4"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {item ? 'Modifier l\'élément' : 'Nouvel élément'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-900"
              placeholder="Accueil"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type de lien</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formData.linkType === 'page'}
                  onChange={() => setFormData({ ...formData, linkType: 'page' })}
                  className="text-black"
                />
                <span className="text-sm text-gray-700">Page du site</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formData.linkType === 'custom'}
                  onChange={() => setFormData({ ...formData, linkType: 'custom' })}
                  className="text-black"
                />
                <span className="text-sm text-gray-700">URL personnalisée</span>
              </label>
            </div>
          </div>

          {formData.linkType === 'page' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Page</label>
              <select
                value={formData.pageSlug}
                onChange={(e) => setFormData({ ...formData, pageSlug: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-900"
              >
                <option value="">Sélectionner une page...</option>
                {pages.map((page) => (
                  <option key={page.id} value={page.slug}>
                    {page.title} ({page.slug})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <input
                type="text"
                value={formData.href}
                onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-900"
                placeholder="https://... ou /page"
              />
              <p className="text-xs text-gray-500 mt-1">
                Laissez vide pour un élément parent sans lien (sous-menu uniquement)
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icône (optionnel)</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-900"
                placeholder="home, menu, star..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position icône</label>
              <select
                value={formData.iconPosition}
                onChange={(e) => setFormData({ ...formData, iconPosition: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-900"
              >
                <option value="left">Gauche</option>
                <option value="right">Droite</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.openInNewTab}
                onChange={(e) => setFormData({ ...formData, openInNewTab: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Ouvrir dans un nouvel onglet</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.highlighted}
                onChange={(e) => setFormData({ ...formData, highlighted: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Mettre en évidence (style CTA)</span>
            </label>
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

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {item ? 'Enregistrer' : 'Ajouter'}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// Style Modal Component
interface StyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  menu: NavigationMenu;
  onSave: (data: Partial<NavigationMenu>) => void;
  saving: boolean;
}

function StyleModal({ isOpen, onClose, menu, onSave, saving }: StyleModalProps) {
  const [formData, setFormData] = useState({
    backgroundColor: '',
    textColor: '',
    hoverColor: '',
    activeColor: '',
    borderColor: '',
    itemSpacing: 24,
    padding: '',
    animation: 'none',
    animationDuration: 200,
    dropdownAnimation: 'fadeDown',
    dropdownDelay: 0,
    customCSS: '',
    cssClasses: '',
  });

  useEffect(() => {
    setFormData({
      backgroundColor: menu.backgroundColor || '',
      textColor: menu.textColor || '',
      hoverColor: menu.hoverColor || '',
      activeColor: menu.activeColor || '',
      borderColor: menu.borderColor || '',
      itemSpacing: menu.itemSpacing,
      padding: menu.padding || '',
      animation: menu.animation,
      animationDuration: menu.animationDuration,
      dropdownAnimation: menu.dropdownAnimation,
      dropdownDelay: menu.dropdownDelay,
      customCSS: menu.customCSS || '',
      cssClasses: menu.cssClasses || '',
    });
  }, [menu, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl m-4 max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Style du menu - {menu.name}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6 overflow-y-auto flex-1">
          {/* Colors */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Couleurs</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Fond</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.backgroundColor || '#ffffff'}
                    onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                    className="w-10 h-10 rounded border border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.backgroundColor}
                    onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded text-gray-900"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Texte</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.textColor || '#000000'}
                    onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                    className="w-10 h-10 rounded border border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.textColor}
                    onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded text-gray-900"
                    placeholder="#000000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Survol</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.hoverColor || '#666666'}
                    onChange={(e) => setFormData({ ...formData, hoverColor: e.target.value })}
                    className="w-10 h-10 rounded border border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.hoverColor}
                    onChange={(e) => setFormData({ ...formData, hoverColor: e.target.value })}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded text-gray-900"
                    placeholder="#666666"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Spacing */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Espacement</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Espace entre items (px)</label>
                <input
                  type="number"
                  value={formData.itemSpacing}
                  onChange={(e) => setFormData({ ...formData, itemSpacing: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Padding (CSS)</label>
                <input
                  type="text"
                  value={formData.padding}
                  onChange={(e) => setFormData({ ...formData, padding: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  placeholder="16px 24px"
                />
              </div>
            </div>
          </div>

          {/* Animations */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Animations</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Animation menu</label>
                <select
                  value={formData.animation}
                  onChange={(e) => setFormData({ ...formData, animation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                >
                  <option value="none">Aucune</option>
                  <option value="fade">Fondu</option>
                  <option value="slide">Glissement</option>
                  <option value="scale">Échelle</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Durée (ms)</label>
                <input
                  type="number"
                  value={formData.animationDuration}
                  onChange={(e) => setFormData({ ...formData, animationDuration: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  min="0"
                  step="50"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Animation dropdown</label>
                <select
                  value={formData.dropdownAnimation}
                  onChange={(e) => setFormData({ ...formData, dropdownAnimation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                >
                  <option value="none">Aucune</option>
                  <option value="fadeDown">Fondu vers le bas</option>
                  <option value="slideDown">Glissement vers le bas</option>
                  <option value="scale">Échelle</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Délai dropdown (ms)</label>
                <input
                  type="number"
                  value={formData.dropdownDelay}
                  onChange={(e) => setFormData({ ...formData, dropdownDelay: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  min="0"
                  step="50"
                />
              </div>
            </div>
          </div>

          {/* Custom CSS */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">CSS personnalisé</h3>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Classes CSS additionnelles</label>
              <input
                type="text"
                value={formData.cssClasses}
                onChange={(e) => setFormData({ ...formData, cssClasses: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 mb-3"
                placeholder="my-custom-class another-class"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">CSS personnalisé</label>
              <textarea
                value={formData.customCSS}
                onChange={(e) => setFormData({ ...formData, customCSS: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 font-mono text-sm"
                rows={4}
                placeholder=".nav-item { font-weight: 600; }"
              />
            </div>
          </div>
        </form>

        <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Appliquer
          </button>
        </div>
      </motion.div>
    </div>
  );
}
