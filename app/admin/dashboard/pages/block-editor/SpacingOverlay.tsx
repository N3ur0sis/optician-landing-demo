"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { BlockStyles } from "@/types/page-builder";
import {
  SPACING_OPTIONS,
  getSpacingPx,
  getSpacingValueFromIndex,
  getSpacingIndexFromValue,
} from "./types";

interface SpacingOverlayProps {
  blockElement: HTMLElement | null;
  styles: BlockStyles;
  onUpdateStyle: (key: string, value: string | undefined) => void;
  visible: boolean;
}

// Spacing zone rendering helper - returns style for a zone
function getZoneStyle(
  type: "margin" | "padding",
  side: "top" | "right" | "bottom" | "left",
  size: number,
  margins: { top: number; right: number; bottom: number; left: number },
  paddings: { top: number; right: number; bottom: number; left: number },
  isActive: boolean,
): React.CSSProperties | null {
  if (size === 0 && !isActive) return null;

  const isMargin = type === "margin";
  const isHorizontal = side === "left" || side === "right";
  const displaySize = Math.max(size, isActive ? 12 : 4);

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    backgroundColor: isMargin
      ? "rgba(251, 146, 60, 0.4)"
      : "rgba(74, 222, 128, 0.4)",
    border: `1px dashed ${isMargin ? "rgb(251, 146, 60)" : "rgb(74, 222, 128)"}`,
    cursor: isHorizontal ? "ew-resize" : "ns-resize",
    zIndex: isActive ? 15 : 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "auto",
  };

  if (isMargin) {
    switch (side) {
      case "top":
        return { ...baseStyle, top: 0, left: 0, right: 0, height: displaySize };
      case "bottom":
        return {
          ...baseStyle,
          bottom: 0,
          left: 0,
          right: 0,
          height: displaySize,
        };
      case "left":
        return {
          ...baseStyle,
          top: margins.top,
          bottom: margins.bottom,
          left: 0,
          width: displaySize,
        };
      case "right":
        return {
          ...baseStyle,
          top: margins.top,
          bottom: margins.bottom,
          right: 0,
          width: displaySize,
        };
    }
  } else {
    switch (side) {
      case "top":
        return {
          ...baseStyle,
          top: margins.top,
          left: margins.left,
          right: margins.right,
          height: displaySize,
        };
      case "bottom":
        return {
          ...baseStyle,
          bottom: margins.bottom,
          left: margins.left,
          right: margins.right,
          height: displaySize,
        };
      case "left":
        return {
          ...baseStyle,
          top: margins.top + paddings.top,
          bottom: margins.bottom + paddings.bottom,
          left: margins.left,
          width: displaySize,
        };
      case "right":
        return {
          ...baseStyle,
          top: margins.top + paddings.top,
          bottom: margins.bottom + paddings.bottom,
          right: margins.right,
          width: displaySize,
        };
    }
  }
  return null;
}

export default function SpacingOverlay({
  blockElement,
  styles,
  onUpdateStyle,
  visible,
}: SpacingOverlayProps) {
  const [isDragging, setIsDragging] = useState<{
    type: "margin" | "padding";
    side: "top" | "right" | "bottom" | "left";
  } | null>(null);
  const [currentDragValue, setCurrentDragValue] = useState<number>(0);
  const [isPercentMode, setIsPercentMode] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Refs to avoid stale closures and prevent infinite loops
  const dragStartRef = useRef<{
    x: number;
    y: number;
    startValue: number;
    isPercent: boolean;
  }>({ x: 0, y: 0, startValue: 0, isPercent: false });
  const onUpdateStyleRef = useRef(onUpdateStyle);
  const lastValueRef = useRef<number>(-1); // Track last value to prevent duplicate updates

  useEffect(() => {
    onUpdateStyleRef.current = onUpdateStyle;
  });

  // Measure block dimensions for percentage calculations
  useEffect(() => {
    if (!blockElement) return;
    const updateDimensions = () => {
      setDimensions({
        width: blockElement.offsetWidth,
        height: blockElement.offsetHeight,
      });
    };
    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(blockElement);
    return () => observer.disconnect();
  }, [blockElement]);

  // Convert spacing value to pixels
  const toPixels = useCallback(
    (
      value: string | undefined,
      dimension: "width" | "height" = "width",
    ): number => {
      if (!value || value === "none" || value === "auto") return 0;
      if (value.includes("%")) {
        const percent = parseInt(value) || 0;
        const size =
          dimension === "width" ? dimensions.width : dimensions.height;
        return Math.round((percent / 100) * size);
      }
      return getSpacingPx(value);
    },
    [dimensions],
  );

  // Get all spacing values as pixels
  const m = {
    top: toPixels(styles.marginTop, "height"),
    right: toPixels(styles.marginRight, "width"),
    bottom: toPixels(styles.marginBottom, "height"),
    left: toPixels(styles.marginLeft, "width"),
  };
  const p = {
    top: toPixels(styles.paddingTop, "height"),
    right: toPixels(styles.paddingRight, "width"),
    bottom: toPixels(styles.paddingBottom, "height"),
    left: toPixels(styles.paddingLeft, "width"),
  };

  // Format label for display
  const formatLabel = (value: string | undefined, pxSize: number): string => {
    if (!value || value === "none") return "0";
    if (value === "auto") return "auto";
    if (value.includes("%")) return value;
    return `${pxSize}px`;
  };

  const mLabels = {
    top: formatLabel(styles.marginTop, m.top),
    right: formatLabel(styles.marginRight, m.right),
    bottom: formatLabel(styles.marginBottom, m.bottom),
    left: formatLabel(styles.marginLeft, m.left),
  };
  const pLabels = {
    top: formatLabel(styles.paddingTop, p.top),
    right: formatLabel(styles.paddingRight, p.right),
    bottom: formatLabel(styles.paddingBottom, p.bottom),
    left: formatLabel(styles.paddingLeft, p.left),
  };

  // Drag handling
  const handleDragStart = useCallback(
    (
      e: React.MouseEvent,
      type: "margin" | "padding",
      side: "top" | "right" | "bottom" | "left",
    ) => {
      e.preventDefault();
      e.stopPropagation();
      const key =
        `${type}${side.charAt(0).toUpperCase() + side.slice(1)}` as keyof BlockStyles;
      const value = styles[key] as string;
      const isPercent = value?.includes("%");
      const startValue = isPercent
        ? parseInt(value) || 0
        : getSpacingIndexFromValue(value);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        startValue,
        isPercent,
      };
      lastValueRef.current = startValue; // Initialize last value
      setCurrentDragValue(startValue);
      setIsPercentMode(isPercent);
      setIsDragging({ type, side });
    },
    [styles],
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const isH = isDragging.side === "left" || isDragging.side === "right";
      const { isPercent } = dragStartRef.current;

      // Calculate drag direction: inward = increase, outward = decrease
      const delta = isH
        ? isDragging.side === "left"
          ? e.clientX - dragStartRef.current.x
          : dragStartRef.current.x - e.clientX
        : isDragging.side === "top"
          ? e.clientY - dragStartRef.current.y
          : dragStartRef.current.y - e.clientY;

      const key = `${isDragging.type}${isDragging.side.charAt(0).toUpperCase() + isDragging.side.slice(1)}`;

      if (isPercent) {
        const percentDelta = Math.round(delta / 5);
        const newPercent = Math.max(
          0,
          Math.min(50, dragStartRef.current.startValue + percentDelta),
        );
        // Only update if value actually changed
        if (newPercent !== lastValueRef.current) {
          lastValueRef.current = newPercent;
          setCurrentDragValue(newPercent);
          onUpdateStyleRef.current(
            key,
            newPercent === 0 ? undefined : `${newPercent}%`,
          );
        }
      } else {
        const indexDelta = Math.round(delta / 10);
        const newIndex = Math.max(
          0,
          Math.min(
            SPACING_OPTIONS.length - 1,
            dragStartRef.current.startValue + indexDelta,
          ),
        );
        // Only update if value actually changed
        if (newIndex !== lastValueRef.current) {
          lastValueRef.current = newIndex;
          setCurrentDragValue(newIndex);
          const newValue = getSpacingValueFromIndex(newIndex);
          onUpdateStyleRef.current(key, newValue);
        }
      }
    };

    const handleMouseUp = () => {
      lastValueRef.current = -1; // Reset
      setIsDragging(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  if (!visible || !blockElement) return null;

  const isActive = (
    t: "margin" | "padding",
    s: "top" | "right" | "bottom" | "left",
  ) => isDragging?.type === t && isDragging?.side === s;

  const hasNoSpacing =
    m.top === 0 &&
    m.right === 0 &&
    m.bottom === 0 &&
    m.left === 0 &&
    p.top === 0 &&
    p.right === 0 &&
    p.bottom === 0 &&
    p.left === 0;

  // Render a spacing zone
  const renderZone = (
    type: "margin" | "padding",
    side: "top" | "right" | "bottom" | "left",
    size: number,
    label: string,
  ) => {
    const active = isActive(type, side);
    const style = getZoneStyle(type, side, size, m, p, active);
    if (!style) return null;

    const isMargin = type === "margin";

    return (
      <div
        key={`${type}-${side}`}
        style={style}
        className="group"
        onMouseDown={(e) => handleDragStart(e, type, side)}
      >
        {size > 0 && (
          <span
            className={`px-1 py-0.5 rounded text-[9px] font-medium text-white whitespace-nowrap ${
              isMargin ? "bg-orange-500" : "bg-green-500"
            } opacity-0 group-hover:opacity-100 transition-opacity`}
          >
            {label}
          </span>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Margin zones */}
      {renderZone("margin", "top", m.top, mLabels.top)}
      {renderZone("margin", "bottom", m.bottom, mLabels.bottom)}
      {renderZone("margin", "left", m.left, mLabels.left)}
      {renderZone("margin", "right", m.right, mLabels.right)}

      {/* Padding zones */}
      {renderZone("padding", "top", p.top, pLabels.top)}
      {renderZone("padding", "bottom", p.bottom, pLabels.bottom)}
      {renderZone("padding", "left", p.left, pLabels.left)}
      {renderZone("padding", "right", p.right, pLabels.right)}

      {/* Drag indicator */}
      {isDragging && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-full pointer-events-none flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${isDragging.type === "margin" ? "bg-orange-400" : "bg-green-400"}`}
          />
          <span className="text-xs">
            {isDragging.type === "margin" ? "Marge" : "Padding"}{" "}
            {isDragging.side === "top"
              ? "haut"
              : isDragging.side === "bottom"
                ? "bas"
                : isDragging.side === "left"
                  ? "gauche"
                  : "droite"}
          </span>
          <span className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded">
            {isPercentMode
              ? `${currentDragValue}%`
              : `${SPACING_OPTIONS[currentDragValue]?.px || 0}px`}
          </span>
        </div>
      )}

      {/* No spacing indicator */}
      {hasNoSpacing && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-gray-800/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap pointer-events-none">
          Aucun espacement
        </div>
      )}
    </>
  );
}
