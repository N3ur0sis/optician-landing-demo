'use client';

import { useState, useRef } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, closestCenter, useSensor, useSensors, PointerSensor, CollisionDetection, pointerWithin, rectIntersection } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { GridTile } from './GridManagerClient';
import ResizableGridTile from './ResizableGridTile';
import { useDroppable } from '@dnd-kit/core';

// Droppable grid background to catch drops on empty space
function GridDropZone({ children }: { children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id: 'grid-dropzone' });
  return <div ref={setNodeRef} className="relative">{children}</div>;
}

type InteractiveGridPreviewProps = {
  tiles: GridTile[];
  onTileUpdate: (tileId: string, updates: Partial<GridTile>) => void;
  onBatchUpdateTiles: (updates: Array<{ id: string; updates: Partial<GridTile> }>) => void;
  onTileClick: (tile: GridTile) => void;
  onTileDelete: (tileId: string) => void;
};

// Helper function to check if two tiles overlap
function tilesOverlap(
  tile1: { colStart: number; colSpan: number; rowStart: number; rowSpan: number },
  tile2: { colStart: number; colSpan: number; rowStart: number; rowSpan: number }
): boolean {
  const tile1ColEnd = tile1.colStart + tile1.colSpan;
  const tile1RowEnd = tile1.rowStart + tile1.rowSpan;
  const tile2ColEnd = tile2.colStart + tile2.colSpan;
  const tile2RowEnd = tile2.rowStart + tile2.rowSpan;

  return !(
    tile1ColEnd <= tile2.colStart ||
    tile1.colStart >= tile2ColEnd ||
    tile1RowEnd <= tile2.rowStart ||
    tile1.rowStart >= tile2RowEnd
  );
}

// Validate and correct grid position to stay within bounds
function validateGridPosition(
  colStart: number,
  rowStart: number,
  colSpan: number,
  rowSpan: number,
  maxCols: number = 4
): { colStart: number; rowStart: number } {
  // Ensure colStart is at least 1
  let validColStart = Math.max(1, colStart);
  
  // Ensure the tile doesn't exceed grid width
  if (validColStart + colSpan > maxCols + 1) {
    validColStart = maxCols - colSpan + 1;
  }
  
  // Ensure rowStart is at least 1
  const validRowStart = Math.max(1, rowStart);
  
  return { colStart: validColStart, rowStart: validRowStart };
}

// UNIFIED ALGORITHM: Calculate new positions for all affected tiles
// Used by BOTH preview (handleDragMove) and actual movement (handleDragEnd)
function calculateTileRepositions(
  activeTile: GridTile,
  newPosition: { colStart: number; rowStart: number },
  oldPosition: { colStart: number; rowStart: number },
  allTiles: GridTile[]
): Map<string, { colStart: number; rowStart: number }> {
  const repositions = new Map<string, { colStart: number; rowStart: number }>();
  
  // Find tiles that overlap with active tile's new position
  const otherTiles = allTiles.filter(t => t.id !== activeTile.id);
  const blockedTiles = otherTiles.filter(t => 
    tilesOverlap(
      { ...newPosition, colSpan: activeTile.colSpan, rowSpan: activeTile.rowSpan },
      t
    )
  );
  
  if (blockedTiles.length === 0) {
    return repositions;
  }
  
  // Build working grid with tiles in their current positions
  const workingGrid = new Map<string, GridTile>();
  
  // Add active tile at new position
  workingGrid.set(activeTile.id, { ...activeTile, ...newPosition });
  
  // Add all other tiles at current positions
  otherTiles.forEach(t => {
    workingGrid.set(t.id, { ...t });
  });
  
  // Process each blocked tile
  for (const blockedTile of blockedTiles) {
    // Strategy 1: Try to swap with active tile's old position
    const swapPos = validateGridPosition(
      oldPosition.colStart,
      oldPosition.rowStart,
      blockedTile.colSpan,
      blockedTile.rowSpan
    );
    
    // Check if swap position is clear
    const swapClear = !Array.from(workingGrid.values()).some(t => 
      t.id !== blockedTile.id && 
      tilesOverlap({ ...swapPos, colSpan: blockedTile.colSpan, rowSpan: blockedTile.rowSpan }, t)
    );
    
    if (swapClear && swapPos.colStart === oldPosition.colStart && swapPos.rowStart === oldPosition.rowStart) {
      // Perfect swap
      repositions.set(blockedTile.id, swapPos);
      workingGrid.set(blockedTile.id, { ...blockedTile, ...swapPos });
    } else {
      // Strategy 2: Push down below active tile
      let targetRow = newPosition.rowStart + activeTile.rowSpan;
      let finalPos = validateGridPosition(
        blockedTile.colStart,
        targetRow,
        blockedTile.colSpan,
        blockedTile.rowSpan
      );
      
      // Keep moving down until we find a clear spot (max 20 attempts)
      let attempts = 0;
      while (attempts < 20) {
        const hasCollision = Array.from(workingGrid.values()).some(t => 
          t.id !== blockedTile.id && 
          tilesOverlap({ ...finalPos, colSpan: blockedTile.colSpan, rowSpan: blockedTile.rowSpan }, t)
        );
        
        if (!hasCollision) break;
        
        targetRow++;
        finalPos = validateGridPosition(
          blockedTile.colStart,
          targetRow,
          blockedTile.colSpan,
          blockedTile.rowSpan
        );
        attempts++;
      }
      
      repositions.set(blockedTile.id, finalPos);
      workingGrid.set(blockedTile.id, { ...blockedTile, ...finalPos });
    }
  }
  
  return repositions;
}

export default function InteractiveGridPreview({ tiles, onTileUpdate, onBatchUpdateTiles, onTileClick }: InteractiveGridPreviewProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [dropPreview, setDropPreview] = useState<{ colStart: number; rowStart: number } | null>(null);
  const [affectedTilesPreview, setAffectedTilesPreview] = useState<Map<string, { colStart: number; rowStart: number }>>(new Map());
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Filter published tiles for display
  const publishedTiles = tiles.filter((tile) => tile.published);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Custom collision detection: prefer tiles, but fallback to dropzone
  const customCollisionDetection: CollisionDetection = (args) => {
    // First check for tile collisions using rect intersection
    const tileCollisions = rectIntersection(args);
    
    // If we found a tile collision, use it
    if (tileCollisions && tileCollisions.length > 0) {
      return tileCollisions;
    }
    
    // Otherwise, check if pointer is within the dropzone
    const dropzoneCollisions = pointerWithin(args);
    return dropzoneCollisions;
  };
  
  // Track mouse position during drag to calculate drop preview
  const handleDragMove = (event: any) => {
    document.body.style.cursor = 'grabbing';
    
    if (!gridRef.current || !event.active) return;
    
    const activeTile = publishedTiles.find((t) => t.id === event.active.id);
    if (!activeTile) return;
    
    // Get current mouse position from the active drag event
    const initialX = (event.activatorEvent as PointerEvent)?.clientX || 0;
    const initialY = (event.activatorEvent as PointerEvent)?.clientY || 0;
    const currentMouseX = initialX + (event.delta?.x || 0);
    const currentMouseY = initialY + (event.delta?.y || 0);
    
    // Get grid bounds (updates with scroll)
    const rect = gridRef.current.getBoundingClientRect();
    
    // Calculate position relative to grid
    const relX = currentMouseX - rect.left;
    const relY = currentMouseY - rect.top;
    
    // Calculate which grid cell the mouse is over
    const colWidth = rect.width / 4;
    const gap = 20;
    const rowHeight = 320; // Base tile height
    const rowHeightWithGap = rowHeight + gap;
    
    const col = Math.max(1, Math.min(4 - activeTile.colSpan + 1, Math.floor(relX / (colWidth + gap)) + 1));
    const row = Math.max(1, Math.floor(relY / rowHeightWithGap) + 1);
    
    // Validate the target position
    const desiredPosition = validateGridPosition(col, row, activeTile.colSpan, activeTile.rowSpan);
    
    // Only update if position changed
    if (dropPreview && dropPreview.colStart === desiredPosition.colStart && dropPreview.rowStart === desiredPosition.rowStart) {
      return;
    }
    
    setDropPreview(desiredPosition);
    
    // Use unified algorithm to calculate preview positions
    const activeTileOriginalPosition = { 
      colStart: activeTile.colStart, 
      rowStart: activeTile.rowStart 
    };
    
    const previewPositions = calculateTileRepositions(
      activeTile,
      desiredPosition,
      activeTileOriginalPosition,
      publishedTiles
    );
    
    setAffectedTilesPreview(previewPositions);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };
  
  const handleDragOver = (event: any) => {
    const { over } = event;
    setOverId(over ? over.id as string : null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeTile = publishedTiles.find((t) => t.id === active.id);
    const previewPosition = dropPreview;
    const affectedTiles = new Map(affectedTilesPreview);
    
    setActiveId(null);
    setOverId(null);
    setDropPreview(null);
    setAffectedTilesPreview(new Map());

    if (!activeTile || !previewPosition) return;
    
    // Check if tile actually moved
    if (activeTile.colStart === previewPosition.colStart && activeTile.rowStart === previewPosition.rowStart) {
      return; // No movement
    }

    // previewPosition already contains validated colStart/rowStart
    const desiredPosition = previewPosition;

    // Get all other tiles
    const otherTiles = publishedTiles.filter(t => t.id !== activeTile.id);
    
    // Find tiles that will be blocked by the new position
    const blockedTiles = otherTiles.filter(t => 
      tilesOverlap(
        { ...desiredPosition, colSpan: activeTile.colSpan, rowSpan: activeTile.rowSpan },
        t
      )
    );

    if (blockedTiles.length === 0) {
      // Simple case: no conflicts
      onTileUpdate(activeTile.id, desiredPosition);
      return;
    }

    // Use unified algorithm to calculate all repositions
    const activeTileOriginalPosition = { 
      colStart: activeTile.colStart, 
      rowStart: activeTile.rowStart 
    };
    
    const repositions = calculateTileRepositions(
      activeTile,
      desiredPosition,
      activeTileOriginalPosition,
      publishedTiles
    );
    
    // Build updates array
    const updates: Array<{ id: string; updates: Partial<GridTile> }> = [
      { id: activeTile.id, updates: desiredPosition }
    ];
    
    repositions.forEach((position, tileId) => {
      updates.push({ id: tileId, updates: position });
    });
    
    // Apply all updates in a single batch
    onBatchUpdateTiles(updates);
  };

  const handleResize = (tileId: string, newColSpan: number, newRowSpan: number) => {
    const tile = publishedTiles.find(t => t.id === tileId);
    if (!tile) return;
    
    // Validate position with new size
    const validPosition = validateGridPosition(
      tile.colStart,
      tile.rowStart,
      newColSpan,
      newRowSpan
    );
    
    onTileUpdate(tileId, {
      colSpan: newColSpan,
      rowSpan: newRowSpan,
      ...validPosition,
    });
  };

  return (
    <div>
      {/* Grid Editor */}
      <div className="overflow-auto select-none relative flex justify-center">
        <div className="relative" style={{ width: '60%', minWidth: '800px' }}>
          {/* Grid Guide Lines */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full grid grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((col) => (
                <div key={col} className="border-2 border-dashed border-gray-200 rounded-lg" />
              ))}
            </div>
          </div>
          
          <div className="relative">
          <DndContext
            sensors={sensors}
            collisionDetection={customCollisionDetection}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragOver={handleDragOver}
            onDragEnd={(event) => {
              document.body.style.cursor = '';
              setDropPreview(null);
              handleDragEnd(event);
            }}
            onDragCancel={() => {
              document.body.style.cursor = '';
              setActiveId(null);
              setOverId(null);
              setDropPreview(null);
              setAffectedTilesPreview(new Map());
            }}
          >
            <GridDropZone>
              <SortableContext items={publishedTiles.map((t) => t.id)} strategy={rectSortingStrategy}>
                <div ref={gridRef} className="relative grid grid-cols-4 gap-5 auto-rows-[320px]">
                {/* Drop preview indicator */}
                {dropPreview && activeId && (() => {
                  const activeTile = publishedTiles.find(t => t.id === activeId);
                  if (!activeTile) return null;
                  
                  return (
                    <div
                      className="bg-green-500/20 border-2 border-green-500 border-dashed rounded-xl pointer-events-none z-40 flex items-center justify-center"
                      style={{
                        gridColumnStart: dropPreview.colStart,
                        gridColumnEnd: dropPreview.colStart + activeTile.colSpan,
                        gridRowStart: dropPreview.rowStart,
                        gridRowEnd: dropPreview.rowStart + activeTile.rowSpan,
                      }}
                    >

                    </div>
                  );
                })()}
                
                {/* Preview where affected tiles will move to */}
                {activeId && Array.from(affectedTilesPreview.entries()).map(([tileId, position]) => {
                  const tile = publishedTiles.find(t => t.id === tileId);
                  if (!tile) return null;
                  
                  return (
                    <div
                      key={`preview-${tileId}`}
                      className="bg-yellow-500/20 border-2 border-yellow-500 border-dashed rounded-xl pointer-events-none z-30 flex items-center justify-center"
                      style={{
                        gridColumnStart: position.colStart,
                        gridColumnEnd: position.colStart + tile.colSpan,
                        gridRowStart: position.rowStart,
                        gridRowEnd: position.rowStart + tile.rowSpan,
                      }}
                    >

                    </div>
                  );
                })}
                
                {publishedTiles.map((tile) => {
                  // Completely hide tiles that are being moved (active or affected)
                  const isBeingMoved = activeId !== null && affectedTilesPreview.has(tile.id);
                  const isActive = activeId === tile.id;
                  
                  if (isActive || isBeingMoved) {
                    return null; // Don't render tiles that are being moved
                  }
                  
                  return (
                    <ResizableGridTile
                      key={tile.id}
                      tile={tile}
                      onResize={handleResize}
                      onClick={() => onTileClick(tile)}
                      isDragging={false}
                    />
                  );
                })}
                </div>
              </SortableContext>
            </GridDropZone>
            
            {/* No DragOverlay - we only show green/yellow outline previews */}
            <DragOverlay />
          </DndContext>
          </div>
        </div>
      </div>
    </div>
  );
}
