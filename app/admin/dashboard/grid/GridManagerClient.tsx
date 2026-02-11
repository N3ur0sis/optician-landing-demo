"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import GridTileForm from "./GridTileForm";
import InteractiveGridPreview from "./InteractiveGridPreview";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle2 } from "lucide-react";

export type GridTile = {
  id: string;
  title: string;
  caption: string | null;
  href: string;
  backgroundUrl: string;
  colSpan: number;
  rowSpan: number;
  colStart: number;
  rowStart: number;
  overlayType: "LIGHT" | "DARK";
  overlayColor: string | null;
  overlayOpacity: number;
  order: number;
  published: boolean;
};

export default function GridManagerClient() {
  const [tiles, setTiles] = useState<GridTile[]>([]);
  const [selectedTile, setSelectedTile] = useState<GridTile | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Load tiles from API
  useEffect(() => {
    fetchTiles();
  }, []);

  const fetchTiles = async () => {
    try {
      const response = await fetch("/api/grid");
      const data = await response.json();
      setTiles(data);
    } catch (error) {
      console.error("Failed to fetch tiles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTile = () => {
    setSelectedTile(null);
    setIsFormOpen(true);
  };

  const handleEditTile = (tile: GridTile) => {
    setSelectedTile(tile);
    setIsFormOpen(true);
  };

  const handleDeleteTile = (tileId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette tuile ?")) {
      setTiles(tiles.filter((t) => t.id !== tileId));
    }
  };

  const handleUpdateTile = (tileId: string, updates: Partial<GridTile>) => {
    setTiles((currentTiles) =>
      currentTiles.map((t) => (t.id === tileId ? { ...t, ...updates } : t)),
    );
  };

  const handleBatchUpdateTiles = (
    updates: Array<{ id: string; updates: Partial<GridTile> }>,
  ) => {
    setTiles((currentTiles) => {
      const updatesMap = new Map(updates.map((u) => [u.id, u.updates]));
      return currentTiles.map((t) => {
        const update = updatesMap.get(t.id);
        return update ? { ...t, ...update } : t;
      });
    });
  };

  const handleSaveTile = (tile: Partial<GridTile>) => {
    if (selectedTile) {
      // Update existing tile
      setTiles(
        tiles.map((t) => (t.id === selectedTile.id ? { ...t, ...tile } : t)),
      );
    } else {
      // Add new tile
      const newTile: GridTile = {
        id: `temp-${Date.now()}`,
        title: tile.title || "New Tile",
        caption: tile.caption || null,
        href: tile.href || "/",
        backgroundUrl: tile.backgroundUrl || "",
        colSpan: tile.colSpan || 2,
        rowSpan: tile.rowSpan || 1,
        colStart: tile.colStart || 1,
        rowStart: tile.rowStart || 1,
        overlayType: tile.overlayType || "DARK",
        overlayColor: tile.overlayColor || null,
        overlayOpacity: tile.overlayOpacity ?? 60,
        order: tiles.length + 1,
        published: tile.published ?? true,
      };
      setTiles([...tiles, newTile]);
    }
    setIsFormOpen(false);
  };

  const handlePublishClick = () => {
    setShowConfirmDialog(true);
  };

  const handlePublish = async () => {
    setShowConfirmDialog(false);
    setIsSaving(true);
    try {
      const response = await fetch("/api/grid", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tiles),
      });

      if (response.ok) {
        const updatedTiles = await response.json();
        setTiles(updatedTiles);
        setShowSuccessDialog(true);
      } else {
        alert("Échec de la publication. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Failed to publish:", error);
      alert("Une erreur s'est produite lors de la publication.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-9 bg-gray-200 rounded-lg w-64 animate-pulse mb-2" />
            <div className="h-5 bg-gray-100 rounded w-96 animate-pulse" />
          </div>
          <div className="flex gap-3">
            <div className="h-12 bg-gray-200 rounded-lg w-40 animate-pulse" />
            <div className="h-12 bg-black/20 rounded-lg w-32 animate-pulse" />
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-4">
          <div className="grid grid-cols-4 gap-4 min-h-[500px]">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className={`bg-gray-100 rounded-xl animate-pulse ${
                  i % 3 === 0 ? "col-span-2 row-span-2" : ""
                }`}
                style={{ minHeight: i % 3 === 0 ? "200px" : "100px" }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header with Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
            Gestionnaire de Grille
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Glissez pour repositionner • Redimensionnez en tirant les coins •
            Cliquez pour éditer
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            onClick={handleAddTile}
            className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-md"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="hidden sm:inline">Ajouter une Tuile</span>
            <span className="sm:hidden">Ajouter</span>
          </button>
          <button
            onClick={handlePublishClick}
            disabled={isSaving}
            className="px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="hidden sm:inline">Publication...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="hidden sm:inline">
                  Publier les Modifications
                </span>
                <span className="sm:hidden">Publier</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Grid Preview */}
      {tiles.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-16 text-center shadow-sm">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-black mb-3">
              Aucune tuile pour le moment
            </h3>
            <p className="text-gray-600 mb-8">
              Créez votre première tuile pour commencer à construire votre
              grille. Vous pourrez la glisser, la redimensionner et la
              personnaliser.
            </p>
            <button
              onClick={handleAddTile}
              className="px-8 py-3 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
            >
              + Créer Votre Première Tuile
            </button>
          </div>
        </div>
      ) : (
        <InteractiveGridPreview
          tiles={tiles}
          onTileClick={handleEditTile}
          onTileUpdate={handleUpdateTile}
          onBatchUpdateTiles={handleBatchUpdateTiles}
          onTileDelete={handleDeleteTile}
        />
      )}

      {/* Edit/Add Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <GridTileForm
            tile={selectedTile}
            onSave={handleSaveTile}
            onClose={() => setIsFormOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Confirm Publish Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publier les modifications ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cela mettra à jour la grille sur votre site en direct. Tous les
              visiteurs verront ces modifications immédiatement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handlePublish}>
              Publier Maintenant
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
            <div
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-green-100 border border-green-200"
              aria-hidden="true"
            >
              <CheckCircle2
                className="text-green-600"
                size={24}
                strokeWidth={2}
              />
            </div>
            <AlertDialogHeader>
              <AlertDialogTitle>Modifications Publiées !</AlertDialogTitle>
              <AlertDialogDescription>
                Votre grille a été mise à jour avec succès et est maintenant en
                ligne sur votre site.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSuccessDialog(false)}>
              Terminé
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
