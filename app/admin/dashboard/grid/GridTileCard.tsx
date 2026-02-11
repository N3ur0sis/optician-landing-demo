'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GridTile } from './GridManagerClient';

type GridTileCardProps = {
  tile: GridTile;
  onEdit: (tile: GridTile) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
};

export default function GridTileCard({ tile, onEdit, onDelete, isDragging = false }: GridTileCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: tile.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-all ${
        isDragging ? 'shadow-2xl scale-105' : 'hover:shadow-md'
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-3 left-3 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-white transition-colors"
      >
        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>

      {/* Background Image Preview */}
      <div className="aspect-video relative bg-gray-100">
        {tile.backgroundUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: tile.backgroundUrl.startsWith('http')
                ? tile.backgroundUrl
                : `url(${tile.backgroundUrl})`,
            }}
          >
            {(() => {
              const hexToRgb = (hex: string) => {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result
                  ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
                  : { r: 0, g: 0, b: 0 };
              };
              const baseHex = tile.overlayColor || (tile.overlayType === 'DARK' ? '#000000' : '#ffffff');
              const { r, g, b } = hexToRgb(baseHex);
              const alpha = (tile.overlayOpacity ?? 60) / 100;
              return <div className="absolute inset-0" style={{ backgroundColor: `rgba(${r}, ${g}, ${b}, ${alpha})` }} />;
            })()}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Grid Span Badge */}
        <div className="absolute top-3 right-3 flex gap-2">
          <span className="px-2 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded">
            {tile.colSpan}×{tile.rowSpan}
          </span>
          {!tile.published && (
            <span className="px-2 py-1 bg-orange-500/90 backdrop-blur-sm text-white text-xs font-medium rounded">
              Brouillon
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">{tile.title}</h3>
        {tile.caption && <p className="text-xs text-gray-600 mb-2 line-clamp-1">{tile.caption}</p>}
        <p className="text-xs text-gray-500 mb-3 line-clamp-1">→ {tile.href}</p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(tile)}
            className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition-colors"
          >
            Modifier
          </button>
          <button
            onClick={() => onDelete(tile.id)}
            className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
