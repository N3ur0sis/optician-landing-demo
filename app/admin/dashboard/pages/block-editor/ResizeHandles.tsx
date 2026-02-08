"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { BlockStyles } from "@/types/page-builder";

interface ResizeHandlesProps {
  blockElement: HTMLElement | null;
  styles: BlockStyles;
  onUpdateStyle: (updates: Partial<BlockStyles>) => void;
  onLivePreview?: (width?: string, height?: string) => void;
  visible: boolean;
  containerWidth: number;
}

type HandlePosition = "e" | "w" | "s" | "se" | "sw";

interface DragState {
  handle: HandlePosition;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  startWidthValue: number;
  startHeightValue: number;
  widthUnit: "%" | "px";
  heightUnit: "px" | "vh";
}

export default function ResizeHandles({
  blockElement,
  styles,
  onUpdateStyle,
  onLivePreview,
  visible,
  containerWidth,
}: ResizeHandlesProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [liveWidth, setLiveWidth] = useState<{ value: number; unit: "%" | "px" } | null>(null);
  const [liveHeight, setLiveHeight] = useState<{ value: number; unit: "px" | "vh" } | null>(null);

  const dragStateRef = useRef<DragState | null>(null);
  const onUpdateStyleRef = useRef(onUpdateStyle);
  const onLivePreviewRef = useRef(onLivePreview);
  const blockElementRef = useRef(blockElement);

  useEffect(() => {
    onUpdateStyleRef.current = onUpdateStyle;
  }, [onUpdateStyle]);

  useEffect(() => {
    onLivePreviewRef.current = onLivePreview;
  }, [onLivePreview]);

  useEffect(() => {
    blockElementRef.current = blockElement;
  }, [blockElement]);

  // Get current width value from styles
  const getCurrentWidth = useCallback((): { value: number; unit: "%" | "px" } => {
    if (styles.widthMode === "custom" && styles.widthValue !== undefined) {
      return {
        value: styles.widthValue,
        unit: (styles.widthUnit as "%" | "px") || "%",
      };
    }
    if (styles.widthMode === "preset" && styles.widthPreset) {
      const presetValues: Record<string, number> = {
        narrow: 42, medium: 56, wide: 72, full: 80, edge: 100,
      };
      return { value: presetValues[styles.widthPreset] || 100, unit: "%" };
    }
    return { value: 100, unit: "%" };
  }, [styles]);

  // Get current height value from styles
  const getCurrentHeight = useCallback((): { value: number; unit: "px" | "vh" } | null => {
    if (styles.heightMode === "custom" && styles.heightValue !== undefined) {
      return {
        value: styles.heightValue,
        unit: (styles.heightUnit as "px" | "vh") || "px",
      };
    }
    if (styles.heightMode === "viewport" || styles.fullHeight) {
      return { value: 100, unit: "vh" };
    }
    if (styles.minHeight) {
      const match = String(styles.minHeight).match(/^(\d+)(px|vh)?$/);
      if (match) {
        return {
          value: parseInt(match[1]),
          unit: (match[2] as "px" | "vh") || "px",
        };
      }
    }
    return null;
  }, [styles]);

  // Handle mouse down on a resize handle
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, handle: HandlePosition) => {
      e.preventDefault();
      e.stopPropagation();

      const element = blockElementRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const currentWidth = getCurrentWidth();
      const currentHeight = getCurrentHeight();

      const state: DragState = {
        handle,
        startX: e.clientX,
        startY: e.clientY,
        startWidth: rect.width,
        startHeight: rect.height,
        startWidthValue: currentWidth.value,
        startHeightValue: currentHeight?.value || rect.height,
        widthUnit: currentWidth.unit,
        heightUnit: currentHeight?.unit || "px",
      };

      dragStateRef.current = state;
      setIsDragging(true);
      
      // Initialize live values
      if (["e", "w", "se", "sw"].includes(handle)) {
        setLiveWidth({ value: currentWidth.value, unit: currentWidth.unit });
      }
      if (["s", "se", "sw"].includes(handle)) {
        setLiveHeight({ value: currentHeight?.value || rect.height, unit: currentHeight?.unit || "px" });
      }
    },
    [getCurrentWidth, getCurrentHeight]
  );

  // Mouse move and mouse up handlers
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const state = dragStateRef.current;
      if (!state) return;

      const deltaX = e.clientX - state.startX;
      const deltaY = e.clientY - state.startY;

      let newWidth: { value: number; unit: "%" | "px" } | null = null;
      let newHeight: { value: number; unit: "px" | "vh" } | null = null;

      // Calculate new width
      if (["e", "se"].includes(state.handle)) {
        let newValue: number;
        if (state.widthUnit === "%") {
          const percentChange = (deltaX / containerWidth) * 100;
          newValue = Math.max(10, Math.min(100, state.startWidthValue + percentChange));
        } else {
          newValue = Math.max(50, state.startWidth + deltaX);
        }
        newValue = Math.round(newValue);
        newWidth = { value: newValue, unit: state.widthUnit };
        setLiveWidth(newWidth);
      } else if (["w", "sw"].includes(state.handle)) {
        let newValue: number;
        if (state.widthUnit === "%") {
          const percentChange = (-deltaX / containerWidth) * 100;
          newValue = Math.max(10, Math.min(100, state.startWidthValue + percentChange));
        } else {
          newValue = Math.max(50, state.startWidth - deltaX);
        }
        newValue = Math.round(newValue);
        newWidth = { value: newValue, unit: state.widthUnit };
        setLiveWidth(newWidth);
      }

      // Calculate new height
      if (["s", "se", "sw"].includes(state.handle)) {
        let newValue: number;
        if (state.heightUnit === "vh") {
          const vhChange = (deltaY / window.innerHeight) * 100;
          newValue = Math.max(10, Math.min(100, state.startHeightValue + vhChange));
        } else {
          newValue = Math.max(50, state.startHeight + deltaY);
        }
        newValue = Math.round(newValue);
        newHeight = { value: newValue, unit: state.heightUnit };
        setLiveHeight(newHeight);
      }

      // Use onLivePreview callback for dynamic rendering (same as sidebar slider)
      if (onLivePreviewRef.current) {
        const widthStr = newWidth ? `${newWidth.value}${newWidth.unit}` : undefined;
        const heightStr = newHeight ? `${newHeight.value}${newHeight.unit}` : undefined;
        onLivePreviewRef.current(widthStr, heightStr);
      }
    };

    const handleMouseUp = () => {
      const state = dragStateRef.current;
      
      if (state) {
        // Reset live preview
        if (onLivePreviewRef.current) {
          onLivePreviewRef.current(undefined, undefined);
        }

        // Build final updates
        const updates: Partial<BlockStyles> = {};

        if (liveWidth) {
          updates.widthMode = "custom";
          updates.widthValue = liveWidth.value;
          updates.widthUnit = liveWidth.unit;
          // Clear legacy properties
          updates.widthPercent = undefined;
          updates.containerWidth = undefined;
        }

        if (liveHeight) {
          updates.heightMode = "custom";
          updates.heightValue = liveHeight.value;
          updates.heightUnit = liveHeight.unit;
          // Only set minHeight if using px, otherwise leave it for heightValue to handle
          if (liveHeight.unit === "px") {
            updates.minHeight = liveHeight.value;
          }
        }

        if (Object.keys(updates).length > 0) {
          onUpdateStyleRef.current(updates);
        }
      }

      // Cleanup
      dragStateRef.current = null;
      setIsDragging(false);
      setLiveWidth(null);
      setLiveHeight(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, containerWidth, liveWidth, liveHeight]);

  if (!visible || !blockElement) return null;

  // Handle base styles
  const handleBase: React.CSSProperties = {
    position: "absolute",
    backgroundColor: "#3b82f6",
    border: "2px solid white",
    borderRadius: "3px",
    zIndex: 30,
    pointerEvents: "auto",
    boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
  };

  const cornerSize = 12;
  const edgeWidth = 8;
  const edgeLength = 32;

  return (
    <>
      {/* Live dimension display during drag */}
      {isDragging && (liveWidth || liveHeight) && (
        <div
          className="fixed z-9999 bg-black/90 text-white px-4 py-2 rounded-lg text-sm font-mono shadow-lg pointer-events-none"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="flex items-center gap-3">
            {liveWidth && (
              <div className="flex items-center gap-1">
                <span className="text-blue-300">W:</span>
                <span className="font-bold">{liveWidth.value}{liveWidth.unit}</span>
              </div>
            )}
            {liveWidth && liveHeight && (
              <span className="text-gray-400">×</span>
            )}
            {liveHeight && (
              <div className="flex items-center gap-1">
                <span className="text-green-300">H:</span>
                <span className="font-bold">{liveHeight.value}{liveHeight.unit}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* East (Right) edge handle */}
      <div
        className="hover:scale-110 transition-transform"
        style={{
          ...handleBase,
          top: "50%",
          right: -edgeWidth / 2,
          width: edgeWidth,
          height: edgeLength,
          transform: "translateY(-50%)",
          cursor: "ew-resize",
        }}
        onMouseDown={(e) => handleMouseDown(e, "e")}
        title="Redimensionner la largeur (→)"
      />

      {/* West (Left) edge handle */}
      <div
        className="hover:scale-110 transition-transform"
        style={{
          ...handleBase,
          top: "50%",
          left: -edgeWidth / 2,
          width: edgeWidth,
          height: edgeLength,
          transform: "translateY(-50%)",
          cursor: "ew-resize",
        }}
        onMouseDown={(e) => handleMouseDown(e, "w")}
        title="Redimensionner la largeur (←)"
      />

      {/* South (Bottom) edge handle */}
      <div
        className="hover:scale-110 transition-transform"
        style={{
          ...handleBase,
          bottom: -edgeWidth / 2,
          left: "50%",
          width: edgeLength,
          height: edgeWidth,
          transform: "translateX(-50%)",
          cursor: "ns-resize",
        }}
        onMouseDown={(e) => handleMouseDown(e, "s")}
        title="Redimensionner la hauteur (↓)"
      />

      {/* Southeast corner handle */}
      <div
        className="hover:scale-125 transition-transform"
        style={{
          ...handleBase,
          bottom: -cornerSize / 2,
          right: -cornerSize / 2,
          width: cornerSize,
          height: cornerSize,
          cursor: "nwse-resize",
        }}
        onMouseDown={(e) => handleMouseDown(e, "se")}
        title="Redimensionner (↘)"
      />

      {/* Southwest corner handle */}
      <div
        className="hover:scale-125 transition-transform"
        style={{
          ...handleBase,
          bottom: -cornerSize / 2,
          left: -cornerSize / 2,
          width: cornerSize,
          height: cornerSize,
          cursor: "nesw-resize",
        }}
        onMouseDown={(e) => handleMouseDown(e, "sw")}
        title="Redimensionner (↙)"
      />
    </>
  );
}
