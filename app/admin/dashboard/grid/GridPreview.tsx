'use client';

import { GridTile } from './GridManagerClient';

type GridPreviewProps = {
  tiles: GridTile[];
};

export default function GridPreview({ tiles }: GridPreviewProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Live Preview</h3>
          <p className="text-xs text-gray-600 mt-0.5">How your grid will appear on the landing page</p>
        </div>
        <span className="text-xs text-gray-500">Desktop view (4 columns)</span>
      </div>

      {/* Grid Preview */}
      <div className="bg-black rounded-lg p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-4 gap-5 auto-rows-[320px]">
            {tiles
              .filter((tile) => tile.published)
              .map((tile) => {
                const spanClass = `col-span-${tile.colSpan} row-span-${tile.rowSpan}`;
                const startClass = `col-start-${tile.colStart} row-start-${tile.rowStart}`;
                
                return (
                  <div
                    key={tile.id}
                    className={`relative group overflow-hidden rounded-xl ${spanClass} ${startClass}`}
                    style={{
                      gridColumn: `${tile.colStart} / span ${tile.colSpan}`,
                      gridRow: `${tile.rowStart} / span ${tile.rowSpan}`,
                    }}
                  >
                    {/* Background */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{
                        backgroundImage: tile.backgroundUrl.startsWith('http')
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
                            View
                          </span>
                          <svg
                            className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                              tile.overlayType === 'DARK' ? 'text-white' : 'text-black'
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Size indicator */}
                    <div className="absolute top-2 right-2 z-10">
                      <span className="px-2 py-1 bg-blue-500/80 backdrop-blur-sm text-white text-[10px] font-medium rounded">
                        {tile.colSpan}×{tile.rowSpan}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 flex items-center gap-2 text-xs text-gray-600">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>This is a preview. Click "Publish Changes" to update the live website.</span>
      </div>
    </div>
  );
}
