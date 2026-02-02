"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Eye,
  Settings2,
  Plus,
  Trash2,
  Copy,
  GripVertical,
  EyeOff,
  Check,
  X,
  Undo,
  Redo,
  Smartphone,
  Monitor,
  Tablet,
  History,
  RotateCcw,
  Clock,
  ChevronRight,
  Loader2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Columns,
  Ruler,
} from "lucide-react";
import {
  Page,
  PageBlock,
  BlockType,
  BLOCK_DEFINITIONS,
  BLOCK_CATEGORIES,
} from "@/types/page-builder";
import BlockEditor from "./block-editor";
import InlineEditableBlock from "./InlineEditableBlock";
import SpacingOverlay from "./block-editor/SpacingOverlay";

interface PageRevision {
  id: string;
  version: number;
  title: string;
  createdAt: string;
  createdBy?: string;
  changeNote?: string;
  published: boolean;
  blocksSnapshot?: PageBlock[];
}

interface PageBuilderEditorProps {
  page: Page;
  isNew?: boolean;
}

type ViewMode = "edit" | "preview";
type DeviceMode = "desktop" | "tablet" | "mobile";

// Maximum history size for undo/redo
const MAX_HISTORY_SIZE = 50;

export default function PageBuilderEditor({
  page: initialPage,
  isNew = false,
}: PageBuilderEditorProps) {
  const router = useRouter();
  const [page, setPage] = useState<Page>(initialPage);
  const [blocks, setBlocks] = useState<PageBlock[]>(initialPage.blocks || []);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("edit");
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [showBlockPicker, setShowBlockPicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [insertAfterBlockId, setInsertAfterBlockId] = useState<string | null>(
    null,
  );
  const [showRevisions, setShowRevisions] = useState(false);
  const [revisions, setRevisions] = useState<PageRevision[]>([]);
  const [loadingRevisions, setLoadingRevisions] = useState(false);
  const [selectedRevision, setSelectedRevision] = useState<PageRevision | null>(
    null,
  );
  const [restoringRevision, setRestoringRevision] = useState(false);
  const [showSpacingOverlay, setShowSpacingOverlay] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);
  const blockElementsRef = useRef<Map<string, HTMLElement>>(new Map());

  // Undo/Redo history - using refs to avoid dependency issues
  const historyRef = useRef<PageBlock[][]>([initialPage.blocks || []]);
  const historyIndexRef = useRef(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const isUndoRedoAction = useRef(false);
  const lastBlocksJsonRef = useRef(JSON.stringify(initialPage.blocks || []));
  const isInitializedRef = useRef(false); // Track if initial render is complete

  // Update history when blocks change (debounced to avoid loops)
  const updateHistory = useCallback(
    (newBlocks: PageBlock[]) => {
      const newBlocksJson = JSON.stringify(newBlocks);

      // Skip if blocks haven't actually changed
      if (newBlocksJson === lastBlocksJsonRef.current) {
        return;
      }

      // Skip if this is an undo/redo action
      if (isUndoRedoAction.current) {
        isUndoRedoAction.current = false;
        lastBlocksJsonRef.current = newBlocksJson;
        return;
      }

      lastBlocksJsonRef.current = newBlocksJson;

      // Trim history to current index and add new state
      const newHistory = historyRef.current.slice(
        0,
        historyIndexRef.current + 1,
      );
      newHistory.push(newBlocks);

      // Limit history size
      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory.shift();
      } else {
        historyIndexRef.current = newHistory.length - 1;
      }

      historyRef.current = newHistory;

      // Update undo/redo state directly - only if values actually changed
      const newCanUndo = historyIndexRef.current > 0;
      const newCanRedo = false;
      if (canUndo !== newCanUndo) setCanUndo(newCanUndo);
      if (canRedo !== newCanRedo) setCanRedo(newCanRedo);
    },
    [canUndo, canRedo],
  );

  // Call updateHistory when blocks change
  useEffect(() => {
    updateHistory(blocks);
  }, [blocks, updateHistory]);

  // Undo function
  const handleUndo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      isUndoRedoAction.current = true;
      historyIndexRef.current -= 1;
      const prevBlocks = historyRef.current[historyIndexRef.current];
      setBlocks(prevBlocks);
      lastBlocksJsonRef.current = JSON.stringify(prevBlocks);
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(true);
    }
  }, []);

  // Redo function
  const handleRedo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      isUndoRedoAction.current = true;
      historyIndexRef.current += 1;
      const nextBlocks = historyRef.current[historyIndexRef.current];
      setBlocks(nextBlocks);
      lastBlocksJsonRef.current = JSON.stringify(nextBlocks);
      setCanUndo(true);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    }
  }, []);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "y") {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Track changes - skip initial render to avoid unnecessary state updates
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      return;
    }
    setHasChanges(true);
    setSaved(false);
  }, [page, blocks]);

  // Fetch revisions
  const fetchRevisions = useCallback(async () => {
    if (isNew) return;

    try {
      setLoadingRevisions(true);
      const response = await fetch(
        `/api/pages/${encodeURIComponent(page.slug)}/revisions`,
      );
      if (response.ok) {
        const data = await response.json();
        setRevisions(data.revisions || []);
      }
    } catch (error) {
      console.error("Error fetching revisions:", error);
    } finally {
      setLoadingRevisions(false);
    }
  }, [page.slug, isNew]);

  // Load revisions when panel opens
  useEffect(() => {
    if (showRevisions && revisions.length === 0) {
      fetchRevisions();
    }
  }, [showRevisions, fetchRevisions, revisions.length]);

  // Fetch full revision details
  const fetchRevisionDetails = async (revisionId: string) => {
    try {
      const response = await fetch(
        `/api/pages/${encodeURIComponent(page.slug)}/revisions/${revisionId}`,
      );
      if (response.ok) {
        const revision = await response.json();
        setSelectedRevision(revision);
      }
    } catch (error) {
      console.error("Error fetching revision details:", error);
    }
  };

  // Restore a revision
  const handleRestoreRevision = async (revisionId: string) => {
    if (
      !confirm(
        "Voulez-vous restaurer cette version ? La version actuelle sera sauvegardée avant la restauration.",
      )
    ) {
      return;
    }

    try {
      setRestoringRevision(true);
      const response = await fetch(
        `/api/pages/${encodeURIComponent(page.slug)}/revisions/${revisionId}`,
        {
          method: "POST",
        },
      );

      if (response.ok) {
        const data = await response.json();
        setPage(data.page);
        setBlocks(data.page.blocks || []);
        setSelectedRevision(null);
        setShowRevisions(false);
        setSaved(true);
        setHasChanges(false);
        // Refresh revisions list
        fetchRevisions();
      }
    } catch (error) {
      console.error("Error restoring revision:", error);
    } finally {
      setRestoringRevision(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = isNew
        ? "/api/pages"
        : `/api/pages/${encodeURIComponent(page.slug)}`;
      const method = isNew ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...page,
          blocks: blocks.map((block, index) => ({
            ...block,
            order: index,
          })),
        }),
      });

      if (response.ok) {
        const updatedPage = await response.json();
        setPage(updatedPage);
        setBlocks(updatedPage.blocks || []);
        setSaved(true);
        setHasChanges(false);

        // Refresh revisions after save
        if (!isNew) {
          fetchRevisions();
        }

        if (isNew) {
          router.push(
            `/admin/dashboard/pages/edit/${updatedPage.slug.replace(/^\//, "")}`,
          );
        }
      }
    } catch (error) {
      console.error("Error saving page:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddBlock = useCallback(
    (type: BlockType) => {
      const definition = BLOCK_DEFINITIONS.find((d) => d.type === type);
      if (!definition) return;

      const newBlock: PageBlock = {
        id: `temp-${Date.now()}`,
        pageId: page.id,
        type,
        order: 0, // Will be calculated in setBlocks
        content: definition.defaultContent,
        settings: {},
        styles: definition.defaultStyles,
        visible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setBlocks((prevBlocks) => {
        newBlock.order = prevBlocks.length;

        if (insertAfterBlockId) {
          const insertIndex =
            prevBlocks.findIndex((b) => b.id === insertAfterBlockId) + 1;
          const newBlocks = [...prevBlocks];
          newBlocks.splice(insertIndex, 0, newBlock);
          return newBlocks;
        } else {
          return [...prevBlocks, newBlock];
        }
      });

      setShowBlockPicker(false);
      setInsertAfterBlockId(null);
      setSelectedBlockId(newBlock.id);
    },
    [page.id, insertAfterBlockId],
  );

  const handleUpdateBlock = useCallback(
    (blockId: string, updates: Partial<PageBlock>) => {
      setBlocks((prevBlocks) =>
        prevBlocks.map((b) =>
          b.id === blockId ? { ...b, ...updates, updatedAt: new Date() } : b,
        ),
      );
    },
    [],
  );

  const handleDeleteBlock = useCallback((blockId: string) => {
    setBlocks((prevBlocks) => prevBlocks.filter((b) => b.id !== blockId));
    setSelectedBlockId((prevSelected) =>
      prevSelected === blockId ? null : prevSelected,
    );
  }, []);

  const handleDuplicateBlock = useCallback((blockId: string) => {
    setBlocks((prevBlocks) => {
      const block = prevBlocks.find((b) => b.id === blockId);
      if (!block) return prevBlocks;

      const duplicatedBlock: PageBlock = {
        ...block,
        id: `temp-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const index = prevBlocks.findIndex((b) => b.id === blockId);
      const newBlocks = [...prevBlocks];
      newBlocks.splice(index + 1, 0, duplicatedBlock);
      return newBlocks;
    });
  }, []);

  const handleToggleBlockVisibility = useCallback((blockId: string) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((b) =>
        b.id === blockId ? { ...b, visible: !b.visible } : b,
      ),
    );
  }, []);

  const handleReorderBlocks = useCallback((newBlocks: PageBlock[]) => {
    setBlocks(newBlocks);
  }, []);

  const selectedBlock = useMemo(
    () => blocks.find((b) => b.id === selectedBlockId),
    [blocks, selectedBlockId]
  );

  // Memoized callback for BlockEditor to prevent infinite loops
  const handleSelectedBlockUpdate = useCallback(
    (updates: Partial<PageBlock>) => {
      if (selectedBlockId) {
        handleUpdateBlock(selectedBlockId, updates);
      }
    },
    [selectedBlockId, handleUpdateBlock]
  );

  const deviceWidths = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Toolbar */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/dashboard/pages")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="border-l border-gray-200 h-8" />
          <div>
            <input
              type="text"
              value={page.title}
              onChange={(e) => setPage({ ...page, title: e.target.value })}
              className="font-semibold text-lg bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-black/10 rounded px-2 -mx-2 text-gray-900 placeholder:text-gray-500"
              placeholder="Titre de la page"
            />
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>/</span>
              <input
                type="text"
                value={page.slug.replace(/^\//, "")}
                onChange={(e) =>
                  setPage({
                    ...page,
                    slug: `/${e.target.value.replace(/^\//, "")}`,
                  })
                }
                className="bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-black/10 rounded px-1 text-gray-700 placeholder:text-gray-500"
                placeholder="url-de-la-page"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Device Preview Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {[
              { mode: "desktop" as DeviceMode, icon: Monitor },
              { mode: "tablet" as DeviceMode, icon: Tablet },
              { mode: "mobile" as DeviceMode, icon: Smartphone },
            ].map(({ mode, icon: Icon }) => (
              <button
                key={mode}
                onClick={() => setDeviceMode(mode)}
                className={`p-2 rounded-md transition-colors ${
                  deviceMode === mode
                    ? "bg-white shadow-sm text-gray-900"
                    : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          <div className="border-l border-gray-200 h-8 mx-2" />

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("edit")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === "edit"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
              }`}
            >
              Éditer
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === "preview"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
              }`}
            >
              Aperçu
            </button>
          </div>

          <div className="border-l border-gray-200 h-8 mx-2" />

          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              className={`p-2 rounded-lg transition-colors ${
                canUndo
                  ? "hover:bg-gray-100 text-gray-700"
                  : "text-gray-300 cursor-not-allowed"
              }`}
              title="Annuler (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={!canRedo}
              className={`p-2 rounded-lg transition-colors ${
                canRedo
                  ? "hover:bg-gray-100 text-gray-700"
                  : "text-gray-300 cursor-not-allowed"
              }`}
              title="Rétablir (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>

          <div className="border-l border-gray-200 h-8 mx-2" />

          {/* Spacing Overlay Toggle */}
          <button
            onClick={() => setShowSpacingOverlay(!showSpacingOverlay)}
            className={`p-2 rounded-lg transition-colors ${
              showSpacingOverlay
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100 text-gray-600"
            }`}
            title={
              showSpacingOverlay
                ? "Masquer les espacements"
                : "Afficher les espacements"
            }
          >
            <Ruler className="w-5 h-5" />
          </button>

          {/* History */}
          {!isNew && (
            <button
              onClick={() => {
                setShowRevisions(!showRevisions);
                setShowSettings(false);
              }}
              className={`p-2 rounded-lg transition-colors ${
                showRevisions ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              title="Historique des versions"
            >
              <History className="w-5 h-5 text-gray-700" />
            </button>
          )}

          {/* Settings */}
          <button
            onClick={() => {
              setShowSettings(!showSettings);
              setShowRevisions(false);
            }}
            className={`p-2 rounded-lg transition-colors ${
              showSettings ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
          >
            <Settings2 className="w-5 h-5 text-gray-700" />
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              hasChanges
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Enregistrement...
              </>
            ) : saved ? (
              <>
                <Check className="w-4 h-4" />
                Enregistré
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Enregistrer
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Block List */}
        {viewMode === "edit" && (
          <div className="w-72 bg-white border-r border-gray-200 flex flex-col overflow-hidden shrink-0">
            <div className="p-4 border-b border-gray-200">
              <button
                onClick={() => {
                  setInsertAfterBlockId(null);
                  setShowBlockPicker(true);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Ajouter un bloc
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {blocks.length === 0 ? (
                <div className="text-center text-gray-700 py-8">
                  <p className="text-sm">Aucun bloc ajouté</p>
                  <p className="text-xs mt-1 text-gray-600">
                    Cliquez sur "Ajouter un bloc" pour commencer
                  </p>
                </div>
              ) : (
                <Reorder.Group
                  axis="y"
                  values={blocks}
                  onReorder={handleReorderBlocks}
                  className="space-y-2"
                  layoutScroll
                >
                  {blocks.map((block) => {
                    const definition = BLOCK_DEFINITIONS.find(
                      (d) => d.type === block.type,
                    );
                    return (
                      <Reorder.Item
                        key={block.id}
                        value={block}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        layout
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 40,
                        }}
                        dragTransition={{
                          bounceStiffness: 600,
                          bounceDamping: 30,
                        }}
                        whileDrag={{
                          scale: 1.02,
                          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                          zIndex: 50,
                          cursor: "grabbing",
                        }}
                        className={`bg-gray-50 rounded-lg border transition-colors ${
                          selectedBlockId === block.id
                            ? "border-black ring-2 ring-black/10"
                            : "border-gray-200 hover:border-gray-300"
                        } ${!block.visible ? "opacity-50" : ""}`}
                        style={{ position: "relative" }}
                        onClick={() => setSelectedBlockId(block.id)}
                      >
                        <div className="flex items-center gap-2 p-3 cursor-grab active:cursor-grabbing">
                          <GripVertical className="w-4 h-4 text-gray-400 shrink-0" />
                          <span className="flex-1 text-sm font-medium truncate text-gray-800">
                            {definition?.label || block.type}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleBlockVisibility(block.id);
                              }}
                              className="p-1 hover:bg-gray-200 rounded transition-colors"
                            >
                              {block.visible ? (
                                <Eye className="w-3.5 h-3.5 text-gray-700" />
                              ) : (
                                <EyeOff className="w-3.5 h-3.5 text-gray-600" />
                              )}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicateBlock(block.id);
                              }}
                              className="p-1 hover:bg-gray-200 rounded transition-colors"
                            >
                              <Copy className="w-3.5 h-3.5 text-gray-700" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteBlock(block.id);
                              }}
                              className="p-1 hover:bg-red-100 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            </button>
                          </div>
                        </div>
                      </Reorder.Item>
                    );
                  })}
                </Reorder.Group>
              )}
            </div>
          </div>
        )}

        {/* Canvas / Preview */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4 md:p-8">
          <div
            ref={previewRef}
            className="mx-auto transition-all duration-300 bg-white shadow-xl rounded-lg overflow-hidden"
            style={{
              width: deviceWidths[deviceMode],
              maxWidth: "100%",
              minHeight: "600px",
              backgroundColor: page.backgroundColor,
              color: page.textColor,
            }}
          >
            {blocks.length === 0 ? (
              <div className="flex items-center justify-center h-96 text-gray-600">
                <div className="text-center">
                  <Plus className="w-12 h-12 mx-auto mb-4 opacity-80" />
                  <p>Ajoutez des blocs pour créer votre page</p>
                </div>
              </div>
            ) : (
              <div className="min-h-full relative">
                {blocks.map((block) => {
                  const isInline = block.styles?.inline === true;
                  const widthPercent = block.styles?.widthPercent;
                  const isSelected = selectedBlockId === block.id;

                  return (
                    <div
                      key={block.id}
                      ref={(el) => {
                        if (el) blockElementsRef.current.set(block.id, el);
                        else blockElementsRef.current.delete(block.id);
                      }}
                      className={`relative ${viewMode === "edit" ? "group" : ""} ${
                        !block.visible ? "opacity-30" : ""
                      }`}
                      style={{
                        display: isInline ? "inline-block" : "flow-root",
                        verticalAlign: isInline ? "top" : undefined,
                        width: widthPercent ? `${widthPercent}%` : undefined,
                      }}
                      onClick={() =>
                        viewMode === "edit" && setSelectedBlockId(block.id)
                      }
                    >
                      {/* Spacing Overlay - visible when block is selected */}
                      {viewMode === "edit" &&
                        isSelected &&
                        showSpacingOverlay && (
                          <SpacingOverlay
                            blockElement={
                              blockElementsRef.current.get(block.id) || null
                            }
                            styles={block.styles || {}}
                            onUpdateStyle={(key, value) =>
                              handleUpdateBlock(block.id, {
                                styles: { ...block.styles, [key]: value },
                              })
                            }
                            visible={showSpacingOverlay}
                          />
                        )}

                      {/* Block Selection Outline */}
                      {viewMode === "edit" && (
                        <div
                          className={`absolute inset-0 border-2 transition-colors pointer-events-none z-10 ${
                            isSelected
                              ? "border-blue-500"
                              : "border-transparent group-hover:border-blue-300"
                          }`}
                        />
                      )}

                      {/* Block Actions */}
                      {viewMode === "edit" && isSelected && (
                        <>
                          {/* Top Toolbar - Compact and Responsive */}
                          <div className="absolute top-2 right-2 z-20 flex items-center gap-0.5 bg-white rounded-lg shadow-lg p-0.5 border border-gray-200">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setInsertAfterBlockId(block.id);
                                setShowBlockPicker(true);
                              }}
                              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                              title="Ajouter après"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicateBlock(block.id);
                              }}
                              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                              title="Dupliquer"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteBlock(block.id);
                              }}
                              className="p-1.5 hover:bg-red-100 rounded transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>

                          {/* Bottom Quick Toolbar - Size & Alignment - Scrollable on small screens */}
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 max-w-[calc(100%-1rem)] overflow-x-auto">
                            <div className="flex items-center gap-0.5 bg-white rounded-lg shadow-lg p-0.5 border border-gray-200">
                              {/* Inline Toggle */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateBlock(block.id, {
                                    styles: {
                                      ...block.styles,
                                      inline: !block.styles?.inline,
                                    },
                                  });
                                }}
                                className={`p-1.5 rounded transition-colors border-r border-gray-200 mr-1 ${
                                  block.styles?.inline
                                    ? "bg-blue-500 text-white"
                                    : "hover:bg-gray-100 text-gray-700"
                                }`}
                                title="Affichage en ligne (côte à côte)"
                              >
                                <Columns className="w-3.5 h-3.5" />
                              </button>

                              {/* Block Width Quick Selectors */}
                              <div className="flex items-center gap-0.5 border-r border-gray-200 pr-1 mr-1">
                                {[
                                  { value: 25, label: "25%" },
                                  { value: 50, label: "50%" },
                                  { value: 75, label: "75%" },
                                  { value: 100, label: "100%" },
                                ].map((opt) => (
                                  <button
                                    key={opt.value}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUpdateBlock(block.id, {
                                        styles: {
                                          ...block.styles,
                                          widthPercent: opt.value,
                                        },
                                      });
                                    }}
                                    className={`px-2 py-1 text-xs rounded transition-colors ${
                                      block.styles?.widthPercent === opt.value
                                        ? "bg-black text-white"
                                        : "hover:bg-gray-100 text-gray-700"
                                    }`}
                                    title={`Largeur ${opt.label}`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>

                              {/* Block Alignment */}
                              <div className="flex items-center gap-0.5">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateBlock(block.id, {
                                      styles: {
                                        ...block.styles,
                                        alignment: "left",
                                      },
                                    });
                                  }}
                                  className={`p-1.5 rounded transition-colors ${
                                    block.styles?.alignment === "left"
                                      ? "bg-black text-white"
                                      : "hover:bg-gray-100 text-gray-700"
                                  }`}
                                  title="Aligner à gauche"
                                >
                                  <AlignLeft className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateBlock(block.id, {
                                      styles: {
                                        ...block.styles,
                                        alignment: "center",
                                      },
                                    });
                                  }}
                                  className={`p-1.5 rounded transition-colors ${
                                    block.styles?.alignment === "center"
                                      ? "bg-black text-white"
                                      : "hover:bg-gray-100 text-gray-700"
                                  }`}
                                  title="Centrer le bloc"
                                >
                                  <AlignCenter className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateBlock(block.id, {
                                      styles: {
                                        ...block.styles,
                                        alignment: "right",
                                      },
                                    });
                                  }}
                                  className={`p-1.5 rounded transition-colors ${
                                    block.styles?.alignment === "right"
                                      ? "bg-black text-white"
                                      : "hover:bg-gray-100 text-gray-700"
                                  }`}
                                  title="Aligner à droite"
                                >
                                  <AlignRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Block Content - Inline Editable */}
                      <InlineEditableBlock
                        block={block}
                        isEditing={
                          viewMode === "edit" && selectedBlockId === block.id
                        }
                        onUpdate={(updates) =>
                          handleUpdateBlock(block.id, updates)
                        }
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Block Editor / Settings / Revisions */}
        {viewMode === "edit" &&
          (selectedBlock || showSettings || showRevisions) && (
            <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto shrink-0">
              {showRevisions ? (
                <RevisionHistory
                  revisions={revisions}
                  loading={loadingRevisions}
                  selectedRevision={selectedRevision}
                  onSelectRevision={fetchRevisionDetails}
                  onClearSelection={() => setSelectedRevision(null)}
                  onRestore={handleRestoreRevision}
                  onClose={() => {
                    setShowRevisions(false);
                    setSelectedRevision(null);
                  }}
                  restoring={restoringRevision}
                />
              ) : showSettings ? (
                <PageSettings
                  page={page}
                  onUpdate={setPage}
                  onClose={() => setShowSettings(false)}
                />
              ) : selectedBlock ? (
                <BlockEditor
                  block={selectedBlock}
                  onUpdate={handleSelectedBlockUpdate}
                  onClose={() => setSelectedBlockId(null)}
                />
              ) : null}
            </div>
          )}
      </div>

      {/* Block Picker Modal */}
      <AnimatePresence>
        {showBlockPicker && (
          <BlockPickerModal
            onSelect={handleAddBlock}
            onClose={() => {
              setShowBlockPicker(false);
              setInsertAfterBlockId(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Page Settings Panel
function PageSettings({
  page,
  onUpdate,
  onClose,
}: {
  page: Page;
  onUpdate: (page: Page) => void;
  onClose: () => void;
}) {
  // Local state for color inputs to avoid infinite loops during continuous updates
  const [bgColor, setBgColor] = useState(page.backgroundColor);
  const [txtColor, setTxtColor] = useState(page.textColor);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced update for colors
  const handleColorChange = useCallback(
    (field: "backgroundColor" | "textColor", value: string) => {
      if (field === "backgroundColor") {
        setBgColor(value);
      } else {
        setTxtColor(value);
      }

      // Debounce the parent update
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      updateTimeoutRef.current = setTimeout(() => {
        onUpdate({ ...page, [field]: value });
      }, 100);
    },
    [page, onUpdate],
  );

  // Sync local state when page prop changes (e.g., from undo/redo)
  useEffect(() => {
    setBgColor(page.backgroundColor);
    setTxtColor(page.textColor);
  }, [page.backgroundColor, page.textColor]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Paramètres de la page</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {/* SEO */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre SEO
          </label>
          <input
            type="text"
            value={page.metaTitle || ""}
            onChange={(e) => onUpdate({ ...page, metaTitle: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-900 placeholder:text-gray-500"
            placeholder={page.title}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description SEO
          </label>
          <textarea
            value={page.metaDescription || ""}
            onChange={(e) =>
              onUpdate({ ...page, metaDescription: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-900 placeholder:text-gray-500"
            rows={3}
            placeholder="Description de la page pour les moteurs de recherche..."
          />
        </div>

        {/* Colors */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Couleur de fond
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={bgColor}
              onChange={(e) =>
                handleColorChange("backgroundColor", e.target.value)
              }
              className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) =>
                handleColorChange("backgroundColor", e.target.value)
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 font-mono text-sm text-gray-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Couleur du texte
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={txtColor}
              onChange={(e) => handleColorChange("textColor", e.target.value)}
              className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={txtColor}
              onChange={(e) => handleColorChange("textColor", e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 font-mono text-sm text-gray-900"
            />
          </div>
        </div>

        {/* Template */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Template
          </label>
          <select
            value={page.template}
            onChange={(e) => onUpdate({ ...page, template: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-900"
          >
            <option value="default">Par défaut</option>
            <option value="landing">Landing page</option>
            <option value="minimal">Minimal</option>
            <option value="full-width">Pleine largeur</option>
          </select>
        </div>

        {/* Navbar Title Settings */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-medium mb-3 text-gray-900">Titre dans la navbar</h4>

          <label className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              checked={page.showNavbarTitle ?? false}
              onChange={(e) =>
                onUpdate({ ...page, showNavbarTitle: e.target.checked })
              }
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-800">
              Afficher un titre dans la navbar
            </span>
          </label>
          
          <p className="text-xs text-gray-500 mb-3">
            Si activé, le titre remplace le menu central de la navbar et un bouton retour s&apos;affiche.
          </p>

          {page.showNavbarTitle && (
            <>
              <div className="mb-3">
                <label className="block text-sm text-gray-800 mb-1">
                  Titre
                </label>
                <input
                  type="text"
                  value={page.navbarTitle || ""}
                  onChange={(e) =>
                    onUpdate({ ...page, navbarTitle: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-900 placeholder:text-gray-500"
                  placeholder={page.title}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-800 mb-1">
                  Sous-titre (optionnel)
                </label>
                <input
                  type="text"
                  value={page.navbarSubtitle || ""}
                  onChange={(e) =>
                    onUpdate({ ...page, navbarSubtitle: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-900 placeholder:text-gray-500"
                  placeholder="Ex: Votre opticien depuis 1988"
                />
              </div>
            </>
          )}
        </div>

        {/* Publish Status */}
        <div className="pt-4 border-t border-gray-200">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={page.published}
              onChange={(e) =>
                onUpdate({ ...page, published: e.target.checked })
              }
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm font-medium text-gray-800">
              {page.published ? "Publié" : "Brouillon"}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}

// Block Picker Modal
function BlockPickerModal({
  onSelect,
  onClose,
}: {
  onSelect: (type: BlockType) => void;
  onClose: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    keyof typeof BLOCK_CATEGORIES | "all"
  >("all");

  const filteredBlocks = BLOCK_DEFINITIONS.filter((block) => {
    const matchesSearch =
      block.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || block.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedBlocks = filteredBlocks.reduce(
    (acc, block) => {
      if (!acc[block.category]) {
        acc[block.category] = [];
      }
      acc[block.category].push(block);
      return acc;
    },
    {} as Record<string, typeof BLOCK_DEFINITIONS>,
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Ajouter un bloc</h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <input
            type="text"
            placeholder="Rechercher un bloc..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-900 placeholder:text-gray-500"
            autoFocus
          />

          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === "all"
                  ? "bg-black text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Tous
            </button>
            {(
              Object.entries(BLOCK_CATEGORIES) as [
                keyof typeof BLOCK_CATEGORIES,
                string,
              ][]
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === key
                    ? "bg-black text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {Object.entries(groupedBlocks).map(([category, blocks]) => (
            <div key={category} className="mb-6 last:mb-0">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                {BLOCK_CATEGORIES[category as keyof typeof BLOCK_CATEGORIES]}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {blocks.map((block) => (
                  <button
                    key={block.type}
                    onClick={() => onSelect(block.type)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-black hover:shadow-md transition-all text-left group"
                  >
                    <div className="font-medium text-sm mb-1 text-gray-900 group-hover:text-black">
                      {block.label}
                    </div>
                    <div className="text-xs text-gray-700 line-clamp-2">
                      {block.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Revision History Panel
function RevisionHistory({
  revisions,
  loading,
  selectedRevision,
  onSelectRevision,
  onClearSelection,
  onRestore,
  onClose,
  restoring,
}: {
  revisions: PageRevision[];
  loading: boolean;
  selectedRevision: PageRevision | null;
  onSelectRevision: (id: string) => void;
  onClearSelection: () => void;
  onRestore: (id: string) => void;
  onClose: () => void;
  restoring: boolean;
}) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "à l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return formatDate(dateStr);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Historique</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          Versions sauvegardées automatiquement
        </p>
      </div>

      {selectedRevision ? (
        // Revision Detail View
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={onClearSelection}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-3"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à la liste
            </button>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">
                  Version {selectedRevision.version}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    selectedRevision.published
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {selectedRevision.published ? "Publié" : "Brouillon"}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {formatDate(selectedRevision.createdAt)}
              </p>
              {selectedRevision.changeNote && (
                <p className="text-sm text-gray-700 mt-2 italic">
                  {selectedRevision.changeNote}
                </p>
              )}
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Aperçu du contenu
            </h4>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-gray-500">Titre:</span>{" "}
                <span className="text-gray-900">{selectedRevision.title}</span>
              </div>
              {selectedRevision.blocksSnapshot && (
                <div className="text-sm">
                  <span className="text-gray-500">Blocs:</span>{" "}
                  <span className="text-gray-900">
                    {(selectedRevision.blocksSnapshot as unknown[]).length}{" "}
                    bloc(s)
                  </span>
                </div>
              )}
            </div>

            {selectedRevision.blocksSnapshot && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Blocs dans cette version
                </h4>
                <div className="space-y-1">
                  {(
                    selectedRevision.blocksSnapshot as Array<{
                      type: string;
                      content?: { title?: string; text?: string };
                    }>
                  ).map((block, index) => (
                    <div
                      key={index}
                      className="text-xs p-2 bg-gray-50 rounded flex items-center gap-2"
                    >
                      <span className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center text-gray-600">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{block.type}</span>
                      {block.content?.title && (
                        <span className="text-gray-500 truncate">
                          - {block.content.title}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => onRestore(selectedRevision.id)}
              disabled={restoring}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {restoring ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Restauration...
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  Restaurer cette version
                </>
              )}
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              La version actuelle sera sauvegardée avant restauration
            </p>
          </div>
        </div>
      ) : (
        // Revision List View
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : revisions.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Clock className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-600 text-sm">
                Aucune version sauvegardée
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Les versions sont créées automatiquement à chaque sauvegarde
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {revisions.map((revision) => (
                <button
                  key={revision.id}
                  onClick={() => onSelectRevision(revision.id)}
                  className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">
                      Version {revision.version}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-3.5 h-3.5" />
                    {formatRelativeTime(revision.createdAt)}
                  </div>
                  {revision.changeNote && (
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {revision.changeNote}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        revision.published
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {revision.published ? "Publié" : "Brouillon"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
