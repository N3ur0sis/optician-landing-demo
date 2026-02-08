"use client";

import { useState, useCallback, useMemo } from "react";
import { RotateCcw } from "lucide-react";
import { BlockStyles } from "@/types/page-builder";
import {
  SPACING_OPTIONS,
  getSpacingPx,
  getSpacingIndexFromValue,
} from "./types";

// Unit type for spacing
type SpacingUnit = "px" | "%";

// Parse value to get unit and numeric value
function parseSpacingValue(value: string | undefined): {
  unit: SpacingUnit;
  numericValue: number;
} {
  if (!value || value === "none") return { unit: "px", numericValue: 0 };
  if (value === "auto") return { unit: "px", numericValue: 0 };
  if (value.includes("%"))
    return { unit: "%", numericValue: parseInt(value) || 0 };
  return { unit: "px", numericValue: getSpacingPx(value) };
}

// Simple spacing control with unit switch
function SpacingControl({
  value,
  onChange,
  label,
  color,
  showAuto = false,
}: {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  label: string;
  color: "orange" | "green";
  showAuto?: boolean;
}) {
  const { unit, numericValue } = parseSpacingValue(value);
  const isAuto = value === "auto";
  const pxIndex = getSpacingIndexFromValue(value);

  const c =
    color === "orange"
      ? {
          accent: "accent-orange-500",
          bg: "bg-orange-100",
          active: "bg-orange-500",
          border: "border-orange-300",
          text: "text-orange-700",
          switchBg: "bg-orange-500",
        }
      : {
          accent: "accent-green-500",
          bg: "bg-green-100",
          active: "bg-green-500",
          border: "border-green-300",
          text: "text-green-700",
          switchBg: "bg-green-500",
        };

  const displayValue = isAuto
    ? "auto"
    : unit === "%"
      ? `${numericValue}%`
      : `${numericValue}px`;

  const handleUnitChange = (newUnit: SpacingUnit) => {
    if (isAuto) return;
    if (newUnit === unit) return;
    if (newUnit === "%") {
      onChange("5%");
    } else {
      onChange(undefined);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (unit === "%") {
      onChange(val === 0 ? undefined : `${val}%`);
    } else {
      const opt = SPACING_OPTIONS[val];
      onChange(opt?.value === "none" ? undefined : opt?.value);
    }
  };

  const handlePresetClick = (presetValue: string) => {
    if (value === presetValue || (presetValue === "none" && !value)) {
      onChange(undefined);
    } else {
      onChange(presetValue === "none" ? undefined : presetValue);
    }
  };

  return (
    <div className="space-y-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-gray-700">{label}</span>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-1.5 py-0.5 rounded ${c.bg} ${c.text} font-mono min-w-[45px] text-center`}
          >
            {displayValue}
          </span>

          {!isAuto && (
            <div className="flex rounded-md overflow-hidden border border-gray-300">
              <button
                onClick={() => handleUnitChange("px")}
                className={`px-2 py-0.5 text-[10px] font-medium transition-colors ${
                  unit === "px"
                    ? `${c.switchBg} text-white`
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                px
              </button>
              <button
                onClick={() => handleUnitChange("%")}
                className={`px-2 py-0.5 text-[10px] font-medium transition-colors ${
                  unit === "%"
                    ? `${c.switchBg} text-white`
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                %
              </button>
            </div>
          )}

          {showAuto && (
            <button
              onClick={() => onChange(isAuto ? undefined : "auto")}
              className={`px-2 py-0.5 text-[10px] font-medium rounded border transition-colors ${
                isAuto
                  ? `${c.active} text-white border-transparent`
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
              }`}
            >
              auto
            </button>
          )}
        </div>
      </div>

      {!isAuto && (
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max={unit === "%" ? 50 : SPACING_OPTIONS.length - 1}
            value={unit === "%" ? numericValue : pxIndex}
            onChange={handleSliderChange}
            className={`flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer ${c.accent}`}
          />
        </div>
      )}

      {!isAuto && unit === "px" && (
        <div className="flex gap-1">
          {SPACING_OPTIONS.slice(0, 6).map((opt) => (
            <button
              key={opt.value}
              onClick={() => handlePresetClick(opt.value)}
              className={`flex-1 py-1 text-[10px] rounded transition-all ${
                (value || "none") === opt.value
                  ? `${c.active} text-white`
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {!isAuto && unit === "%" && (
        <div className="flex gap-1">
          {[5, 10, 15, 20, 25, 30].map((pct) => (
            <button
              key={pct}
              onClick={() => onChange(`${pct}%`)}
              className={`flex-1 py-1 text-[10px] rounded transition-all ${
                numericValue === pct
                  ? `${c.active} text-white`
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {pct}%
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Compact box model visualization
function BoxModelVisual({
  type,
  values,
  activeSide,
  onSelectSide,
}: {
  type: "margin" | "padding";
  values: { top?: string; right?: string; bottom?: string; left?: string };
  activeSide: "top" | "right" | "bottom" | "left" | null;
  onSelectSide: (side: "top" | "right" | "bottom" | "left" | null) => void;
}) {
  const isMargin = type === "margin";
  const c = isMargin
    ? {
        bg: "bg-orange-50",
        border: "border-orange-200",
        text: "text-orange-600",
      }
    : { bg: "bg-green-50", border: "border-green-200", text: "text-green-600" };

  const getDisplay = (side: "top" | "right" | "bottom" | "left") => {
    const v = values[side];
    if (!v || v === "none") return "0";
    if (v === "auto") return "A";
    if (v.includes("%")) return v;
    return `${getSpacingPx(v)}`;
  };

  const getSideClasses = (
    side: "top" | "right" | "bottom" | "left",
    baseClass: string,
  ) =>
    `${baseClass} ${c.bg} cursor-pointer transition-all flex items-center justify-center ${
      activeSide === side
        ? "ring-2 ring-blue-500 ring-inset"
        : "hover:brightness-95"
    }`;

  return (
    <div className={`relative border-2 ${c.border} rounded-lg overflow-hidden`}>
      <div
        className={getSideClasses("top", "h-6 w-full")}
        onClick={() => onSelectSide(activeSide === "top" ? null : "top")}
      >
        <span className={`text-[10px] font-medium ${c.text}`}>
          {getDisplay("top")}
        </span>
      </div>
      <div className="flex items-stretch">
        <div
          className={getSideClasses("left", "w-10 py-2")}
          onClick={() => onSelectSide(activeSide === "left" ? null : "left")}
        >
          <span className={`text-[10px] font-medium ${c.text}`}>
            {getDisplay("left")}
          </span>
        </div>
        <div className="flex-1 flex items-center justify-center py-2 bg-white border-x border-gray-200">
          <span className="text-[10px] text-gray-400">
            {isMargin ? "M" : "P"}
          </span>
        </div>
        <div
          className={getSideClasses("right", "w-10 py-2")}
          onClick={() => onSelectSide(activeSide === "right" ? null : "right")}
        >
          <span className={`text-[10px] font-medium ${c.text}`}>
            {getDisplay("right")}
          </span>
        </div>
      </div>
      <div
        className={getSideClasses("bottom", "h-6 w-full")}
        onClick={() => onSelectSide(activeSide === "bottom" ? null : "bottom")}
      >
        <span className={`text-[10px] font-medium ${c.text}`}>
          {getDisplay("bottom")}
        </span>
      </div>
    </div>
  );
}

interface SpacingEditorProps {
  styles: BlockStyles;
  updateStyles: (keyOrUpdates: string | Partial<BlockStyles>, value?: unknown) => void;
}

export default function SpacingEditor({
  styles,
  updateStyles,
}: SpacingEditorProps) {
  const [activeMarginSide, setActiveMarginSide] = useState<
    "top" | "right" | "bottom" | "left" | null
  >(null);
  const [activePaddingSide, setActivePaddingSide] = useState<
    "top" | "right" | "bottom" | "left" | null
  >(null);

  const marginValues = useMemo(
    () => ({
      top: styles.marginTop,
      right: styles.marginRight,
      bottom: styles.marginBottom,
      left: styles.marginLeft,
    }),
    [
      styles.marginTop,
      styles.marginRight,
      styles.marginBottom,
      styles.marginLeft,
    ],
  );

  const paddingValues = useMemo(
    () => ({
      top: styles.paddingTop,
      right: styles.paddingRight,
      bottom: styles.paddingBottom,
      left: styles.paddingLeft,
    }),
    [
      styles.paddingTop,
      styles.paddingRight,
      styles.paddingBottom,
      styles.paddingLeft,
    ],
  );

  const handleMarginChange = useCallback(
    (side: "top" | "right" | "bottom" | "left", value: string | undefined) => {
      updateStyles(
        `margin${side.charAt(0).toUpperCase() + side.slice(1)}`,
        value,
      );
    },
    [updateStyles],
  );

  const handlePaddingChange = useCallback(
    (side: "top" | "right" | "bottom" | "left", value: string | undefined) => {
      updateStyles(
        `padding${side.charAt(0).toUpperCase() + side.slice(1)}`,
        value,
      );
    },
    [updateStyles],
  );

  const resetMargins = () => {
    updateStyles({
      marginTop: undefined,
      marginRight: undefined,
      marginBottom: undefined,
      marginLeft: undefined,
    });
    setActiveMarginSide(null);
  };

  const resetPaddings = () => {
    updateStyles({
      paddingTop: undefined,
      paddingRight: undefined,
      paddingBottom: undefined,
      paddingLeft: undefined,
    });
    setActivePaddingSide(null);
  };

  const sideLabels: Record<string, string> = {
    top: "Haut",
    right: "Droite",
    bottom: "Bas",
    left: "Gauche",
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm bg-orange-400" />
            <h4 className="text-xs font-semibold text-gray-800">Marges</h4>
          </div>
          <button
            onClick={resetMargins}
            className="text-[10px] text-gray-400 hover:text-red-500 flex items-center gap-0.5"
            title="Reset"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        <BoxModelVisual
          type="margin"
          values={marginValues}
          activeSide={activeMarginSide}
          onSelectSide={setActiveMarginSide}
        />

        {activeMarginSide && (
          <SpacingControl
            value={marginValues[activeMarginSide]}
            onChange={(v) => handleMarginChange(activeMarginSide, v)}
            label={`Marge ${sideLabels[activeMarginSide]}`}
            color="orange"
            showAuto={
              activeMarginSide === "left" || activeMarginSide === "right"
            }
          />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm bg-green-400" />
            <h4 className="text-xs font-semibold text-gray-800">Paddings</h4>
          </div>
          <button
            onClick={resetPaddings}
            className="text-[10px] text-gray-400 hover:text-red-500 flex items-center gap-0.5"
            title="Reset"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        <BoxModelVisual
          type="padding"
          values={paddingValues}
          activeSide={activePaddingSide}
          onSelectSide={setActivePaddingSide}
        />

        {activePaddingSide && (
          <SpacingControl
            value={paddingValues[activePaddingSide]}
            onChange={(v) => handlePaddingChange(activePaddingSide, v)}
            label={`Padding ${sideLabels[activePaddingSide]}`}
            color="green"
          />
        )}
      </div>
    </div>
  );
}
