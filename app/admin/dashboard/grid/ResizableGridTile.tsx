'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS, Transform } from '@dnd-kit/utilities';
import { GridTile } from './GridManagerClient';
import { useState } from 'react';
import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

type ResizableGridTileProps = {
  tile: GridTile;
  onResize: (tileId: string, newColSpan: number, newRowSpan: number) => void;
  onClick: () => void;
  isDragging?: boolean;
};

export default function ResizableGridTile({ tile, onResize, onClick, isDragging = false }: ResizableGridTileProps) {
  const [isResizing, setIsResizing] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: tile.id }) as {
    attributes: DraggableAttributes;
    listeners: SyntheticListenerMap | undefined;
    setNodeRef: (node: HTMLElement | null) => void;
    transform: Transform | null;
    transition: string | undefined;
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    gridColumn: `${tile.colStart} / span ${tile.colSpan}`,
    gridRow: `${tile.rowStart} / span ${tile.rowSpan}`,
  };

  const handleResizeStart = (e: React.MouseEvent, direction: 'col' | 'row') => {
    e.stopPropagation();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startColSpan = tile.colSpan;
    const startRowSpan = tile.rowSpan;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (direction === 'col') {
        const deltaX = moveEvent.clientX - startX;
        const cellWidth = 250; // approximate
        const spanChange = Math.round(deltaX / cellWidth);
        const newColSpan = Math.max(1, Math.min(4, startColSpan + spanChange));
        
        if (newColSpan !== tile.colSpan) {
          onResize(tile.id, newColSpan, tile.rowSpan);
        }
      } else {
        const deltaY = moveEvent.clientY - startY;
        const cellHeight = 320;
        const spanChange = Math.round(deltaY / cellHeight);
        const newRowSpan = Math.max(1, Math.min(2, startRowSpan + spanChange));
        
        if (newRowSpan !== tile.rowSpan) {
          onResize(tile.id, tile.colSpan, newRowSpan);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
      {...attributes}
      {...listeners}
      className={`group relative overflow-hidden rounded-xl transition-all ${
        isDragging ? 'opacity-50 scale-95' : 'hover:ring-2 hover:ring-blue-500'
      } ${isResizing ? 'ring-2 ring-blue-500' : ''}`}
      onMouseDown={(e) => {
        // Prevent text selection during drag
        e.preventDefault();
      }}
      onClick={(e) => {
        // Only trigger onClick if not dragging and not clicking resize handles
        if (!isDragging && !isResizing) {
          onClick();
        }
      }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{
          backgroundImage: tile.backgroundUrl.startsWith('url(')
            ? tile.backgroundUrl
            : `url(${tile.backgroundUrl})`,
        }}
      />

      {/* Overlay */}
      <div
        className={`absolute inset-0 transition-all duration-300 ${
          tile.overlayType === 'DARK'
            ? 'bg-black/60 group-hover:bg-black/40'
            : 'bg-white/60 group-hover:bg-white/40'
        }`}
      />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(${tile.overlayType === 'DARK' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px),
            linear-gradient(90deg, ${tile.overlayType === 'DARK' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Content */}
      <div className="relative h-full p-6 flex flex-col justify-between">
        {/* Drag Indicator - Top Left */}
        <div className="absolute top-3 left-3 w-8 h-8 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-lg flex items-center justify-center pointer-events-none transition-colors z-20 opacity-0 group-hover:opacity-100">
          <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>

        {/* Caption Badge */}
        {tile.caption && (
          <div className="self-start">
            <span
              className={`inline-block px-3 py-1 backdrop-blur-md text-xs font-medium rounded-full ${
                tile.overlayType === 'DARK'
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'bg-black/10 text-black border border-black/20'
              }`}
            >
              {tile.caption}
            </span>
          </div>
        )}

        {/* Title */}
        <div>
          <h3
            className={`text-2xl font-bold mb-2 ${
              tile.overlayType === 'DARK' ? 'text-white' : 'text-black'
            }`}
          >
            {tile.title}
          </h3>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium ${
                tile.overlayType === 'DARK' ? 'text-white/90' : 'text-black/90'
              }`}
            >
              {tile.href}
            </span>
          </div>
        </div>
      </div>

      {/* Size Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className="px-2 py-1 bg-blue-500/90 backdrop-blur-sm text-white text-xs font-medium rounded">
          {tile.colSpan}×{tile.rowSpan}
        </span>
      </div>

      {/* Resize Handles */}
      {!isDragging && (
        <>
          {/* Right Edge - Column Resize */}
          <div
            className="absolute top-0 right-0 w-2 h-full cursor-ew-resize z-20 group/handle hover:bg-blue-500/30"
            onMouseDown={(e) => handleResizeStart(e, 'col')}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-blue-500 opacity-0 group-hover/handle:opacity-100 transition-opacity" />
          </div>

          {/* Bottom Edge - Row Resize */}
          <div
            className="absolute bottom-0 left-0 h-2 w-full cursor-ns-resize z-20 group/handle hover:bg-blue-500/30"
            onMouseDown={(e) => handleResizeStart(e, 'row')}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-12 bg-blue-500 opacity-0 group-hover/handle:opacity-100 transition-opacity" />
          </div>

          {/* Bottom-Right Corner - Both */}
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-30 group/handle"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute bottom-1 right-1 w-2 h-2 bg-blue-500 rounded-sm opacity-0 group-hover/handle:opacity-100 transition-opacity" />
          </div>
        </>
      )}

      {/* Hover Overlay Indicator */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/50 rounded-xl pointer-events-none transition-colors" />
    </div>
  );
}
