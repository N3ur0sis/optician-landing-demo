"use client";

import { useState, useEffect, CSSProperties } from "react";
import { X, RotateCcw } from "lucide-react";
import { BlockStyles } from "@/types/page-builder";
import MediaPicker from "@/components/media/MediaPicker";
import { Field, CollapsibleSection, ToggleButtonGroup, RangeSlider, DebouncedColorInput, DebouncedTextInput } from "./Field";
import { StyleEditorProps } from "./types";
import SpacingEditor from "./SpacingEditor";

// Animation Preview Component
function AnimationPreview({
  animation,
  delay,
}: {
  animation: string;
  delay: number;
}) {
  const [key, setKey] = useState(0);

  const getAnimationStyle = (): CSSProperties => {
    const baseStyle: CSSProperties = {
      width: "60px",
      height: "40px",
      backgroundColor: "#3b82f6",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "10px",
      fontWeight: "bold",
      animationDelay: `${delay}ms`,
      animationDuration: "0.6s",
      animationFillMode: "both",
    };

    switch (animation) {
      case "fade-in":
        return {
          ...baseStyle,
          animation: `fadeIn 0.6s ease-out ${delay}ms both`,
        };
      case "slide-up":
        return {
          ...baseStyle,
          animation: `slideUp 0.6s ease-out ${delay}ms both`,
        };
      case "slide-left":
        return {
          ...baseStyle,
          animation: `slideLeft 0.6s ease-out ${delay}ms both`,
        };
      case "slide-right":
        return {
          ...baseStyle,
          animation: `slideRight 0.6s ease-out ${delay}ms both`,
        };
      case "scale":
        return {
          ...baseStyle,
          animation: `scaleIn 0.6s ease-out ${delay}ms both`,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div key={key} style={getAnimationStyle()}>
        Bloc
      </div>
      <button
        onClick={() => setKey((k) => k + 1)}
        className="text-xs text-blue-600 hover:text-blue-800"
      >
        Rejouer
      </button>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideLeft {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default function StyleEditor({
  styles,
  updateStyles,
  onLiveStylePreview,
}: StyleEditorProps) {
  // Determine current width mode from styles
  const getWidthMode = (): "auto" | "preset" | "custom" => {
    if (styles.widthMode) return styles.widthMode;
    // Legacy: Try to infer from old properties
    if (styles.widthValue !== undefined) return "custom";
    if (styles.widthPreset) return "preset";
    // Old format detection
    if (styles.widthPercent !== undefined) return "custom";
    if (styles.containerWidth) return "preset";
    return "auto";
  };

  // Determine current height mode from styles
  const getHeightMode = (): "auto" | "preset" | "custom" | "viewport" => {
    if (styles.heightMode) return styles.heightMode;
    // Legacy detection
    if (styles.fullHeight) return "viewport";
    if (styles.heightValue || styles.minHeight) return "custom";
    if (styles.heightPreset || (styles.height && styles.height !== "auto")) return "preset";
    return "auto";
  };

  const [widthMode, setWidthMode] = useState<"auto" | "preset" | "custom">(getWidthMode());
  const [heightMode, setHeightMode] = useState<"auto" | "preset" | "custom" | "viewport">(getHeightMode());
  const [widthUnit, setWidthUnit] = useState<"px" | "%">((styles.widthUnit as "px" | "%") || "%");
  const [heightUnit, setHeightUnit] = useState<"px" | "vh">((styles.heightUnit as "px" | "vh") || "px");
  
  // Local state for real-time slider preview
  const [liveWidthValue, setLiveWidthValue] = useState<number | null>(null);
  const [liveHeightValue, setLiveHeightValue] = useState<number | null>(null);
  const [isDraggingWidth, setIsDraggingWidth] = useState(false);
  const [isDraggingHeight, setIsDraggingHeight] = useState(false);

  // Sync local state with styles when they change from outside (e.g., resize handles, toolbar)
  useEffect(() => {
    const mode = (() => {
      if (styles.widthMode) return styles.widthMode;
      if (styles.widthValue !== undefined) return "custom";
      if (styles.widthPreset) return "preset";
      // Old format detection
      if (styles.widthPercent !== undefined) return "custom";
      if (styles.containerWidth) return "preset";
      return "auto";
    })();
    setWidthMode(mode);
  }, [styles.widthMode, styles.widthValue, styles.widthPreset]);

  useEffect(() => {
    const mode = (() => {
      if (styles.heightMode) return styles.heightMode;
      if (styles.fullHeight) return "viewport";
      if (styles.heightValue || styles.minHeight) return "custom";
      if (styles.heightPreset || (styles.height && styles.height !== "auto")) return "preset";
      return "auto";
    })();
    setHeightMode(mode);
  }, [styles.heightMode, styles.heightValue, styles.minHeight, styles.fullHeight, styles.heightPreset, styles.height]);

  useEffect(() => {
    if (styles.widthUnit) setWidthUnit(styles.widthUnit as "px" | "%");
  }, [styles.widthUnit]);

  useEffect(() => {
    if (styles.heightUnit) setHeightUnit(styles.heightUnit as "px" | "vh");
  }, [styles.heightUnit]);

  // Reset live values when not dragging
  useEffect(() => {
    if (!isDraggingWidth) {
      setLiveWidthValue(null);
    }
  }, [isDraggingWidth]);

  useEffect(() => {
    if (!isDraggingHeight) {
      setLiveHeightValue(null);
    }
  }, [isDraggingHeight]);

  // Real-time width update during drag - directly manipulates DOM for instant feedback
  const handleWidthSliderDrag = (value: number, unit: "px" | "%") => {
    setLiveWidthValue(value);
    // Directly manipulate DOM for instant visual feedback
    onLiveStylePreview?.(`${value}${unit}`, undefined);
  };

  // Final width update on drag end
  const handleWidthSliderEnd = (value: number, unit: "px" | "%") => {
    setIsDraggingWidth(false);
    setLiveWidthValue(null);
    onLiveStylePreview?.(undefined, undefined); // Reset styles to React-controlled
    updateWidth(value, unit);
  };

  // Real-time height update during drag - directly manipulates DOM for instant feedback
  const handleHeightSliderDrag = (value: number, unit: "px" | "vh") => {
    setLiveHeightValue(value);
    // Directly manipulate DOM for instant visual feedback
    onLiveStylePreview?.(undefined, `${value}${unit}`);
  };

  // Final height update on drag end
  const handleHeightSliderEnd = (value: number, unit: "px" | "vh") => {
    setIsDraggingHeight(false);
    setLiveHeightValue(null);
    onLiveStylePreview?.(undefined, undefined); // Reset styles to React-controlled
    updateHeight(value, unit);
  };

  // Width mode handlers
  const switchWidthMode = (mode: "auto" | "preset" | "custom") => {
    setWidthMode(mode);
    
    if (mode === "auto") {
      // Clear all width settings
      updateStyles({
        widthMode: mode,
        widthValue: undefined,
        widthUnit: undefined,
        widthPreset: undefined,
        widthPercent: undefined,
        containerWidth: undefined,
      });
    } else if (mode === "preset") {
      updateStyles({
        widthMode: mode,
        widthValue: undefined,
        widthUnit: undefined,
        widthPercent: undefined,
        widthPreset: "wide",
      });
    } else if (mode === "custom") {
      updateStyles({
        widthMode: mode,
        widthPreset: undefined,
        containerWidth: undefined,
        widthUnit: "%",
        widthValue: 100,
      });
      setWidthUnit("%");
    }
  };

  // Height mode handlers
  const switchHeightMode = (mode: "auto" | "preset" | "custom" | "viewport") => {
    setHeightMode(mode);
    
    if (mode === "auto") {
      updateStyles({
        heightMode: mode,
        heightValue: undefined,
        heightUnit: undefined,
        heightPreset: undefined,
        minHeight: undefined,
        maxHeight: undefined,
        fullHeight: undefined,
        height: undefined,
      });
    } else if (mode === "preset") {
      updateStyles({
        heightMode: mode,
        heightValue: undefined,
        heightUnit: undefined,
        fullHeight: undefined,
        minHeight: undefined,
        heightPreset: "medium",
      });
    } else if (mode === "custom") {
      updateStyles({
        heightMode: mode,
        heightPreset: undefined,
        fullHeight: undefined,
        height: undefined,
        heightUnit: "px",
        heightValue: 400,
      });
      setHeightUnit("px");
    } else if (mode === "viewport") {
      updateStyles({
        heightMode: mode,
        heightPreset: undefined,
        heightValue: undefined,
        heightUnit: undefined,
        minHeight: undefined,
        fullHeight: true,
      });
    }
  };

  // Update width value and unit
  const updateWidth = (value: number, unit: "px" | "%") => {
    setWidthUnit(unit);
    updateStyles({
      widthMode: "custom",
      widthValue: value,
      widthUnit: unit,
      widthPercent: undefined,
      containerWidth: undefined,
    });
  };

  // Update height value and unit
  const updateHeight = (value: number, unit: "px" | "vh") => {
    setHeightUnit(unit);
    updateStyles({
      heightMode: "custom",
      heightValue: value,
      heightUnit: unit,
      minHeight: unit === "px" ? value : undefined,
    });
  };

  return (
    <div className="space-y-4">
      {/* ============================================= */}
      {/* LARGEUR - Complete width control */}
      {/* ============================================= */}
      <CollapsibleSection 
        title="Largeur" 
        defaultOpen
        badge={widthMode !== "auto" ? (widthMode === "preset" ? styles.widthPreset : `${styles.widthValue || 100}${widthUnit}`) : undefined}
      >
        <div className="space-y-5">
          {/* Width mode selector - improved UX */}
          <ToggleButtonGroup
            options={[
              { value: "auto", label: "Auto", description: "100%" },
              { value: "preset", label: "Prédéfini", description: "Conteneur" },
              { value: "custom", label: "Personnalisé", description: "px ou %" },
            ]}
            value={widthMode}
            onChange={(mode) => mode && switchWidthMode(mode)}
            columns={3}
            size="md"
          />

          {/* Preset width options */}
          {widthMode === "preset" && (
            <Field label="Largeur prédéfinie">
              <ToggleButtonGroup
                options={[
                  { value: "narrow", label: "Étroit", description: "672px" },
                  { value: "medium", label: "Moyen", description: "896px" },
                  { value: "wide", label: "Large", description: "1152px" },
                  { value: "edge", label: "100%", description: "Pleine largeur" },
                ]}
                value={(styles.widthPreset as "narrow" | "medium" | "wide" | "edge") || "wide"}
                onChange={(val) => {
                  if (!val) return;
                  updateStyles({
                    widthPreset: val,
                    containerWidth: undefined, // Ne plus utiliser containerWidth
                  });
                }}
                columns={4}
                size="sm"
              />
            </Field>
          )}

          {/* Custom width options */}
          {widthMode === "custom" && (
            <>
              <Field label="Unité de mesure">
                <ToggleButtonGroup
                  options={[
                    { value: "%", label: "Pourcentage", description: "%" },
                    { value: "px", label: "Pixels", description: "px" },
                  ]}
                  value={widthUnit}
                  onChange={(unit) => {
                    if (!unit) return;
                    updateWidth(unit === "%" ? (styles.widthValue || 100) : (styles.widthValue || 800), unit);
                  }}
                  columns={2}
                  size="md"
                />
              </Field>

              {widthUnit === "%" && (
                <Field label="Largeur en pourcentage">
                  <RangeSlider
                    min={10}
                    max={100}
                    step={1}
                    value={liveWidthValue ?? styles.widthValue ?? 100}
                    onChange={(val) => {
                      setLiveWidthValue(val);
                      if (isDraggingWidth) {
                        handleWidthSliderDrag(val, "%");
                      }
                    }}
                    onDragStart={() => setIsDraggingWidth(true)}
                    onDragEnd={(val) => handleWidthSliderEnd(val, "%")}
                    unit="%"
                    presets={[25, 33, 50, 66, 75, 100]}
                  />
                </Field>
              )}

              {widthUnit === "px" && (
                <Field label="Largeur en pixels">
                  <RangeSlider
                    min={100}
                    max={1600}
                    step={10}
                    value={liveWidthValue ?? styles.widthValue ?? 800}
                    onChange={(val) => {
                      setLiveWidthValue(val);
                      if (isDraggingWidth) {
                        handleWidthSliderDrag(val, "px");
                      }
                    }}
                    onDragStart={() => setIsDraggingWidth(true)}
                    onDragEnd={(val) => handleWidthSliderEnd(val, "px")}
                    unit="px"
                    presets={[400, 600, 800, 1000, 1200]}
                  />
                </Field>
              )}
            </>
          )}

          {/* Block alignment - always visible when width < 100% */}
          {(widthMode === "custom" || widthMode === "preset") && (
            <Field label="Alignement du bloc" disabled={!!styles.inline}>
              {styles.inline ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                  <p className="font-medium">⚠️ Non disponible en mode inline</p>
                  <p className="text-xs mt-1 opacity-80">
                    L&apos;alignement n&apos;est pas applicable quand le bloc est en mode inline.
                  </p>
                </div>
              ) : (
                <ToggleButtonGroup
                  options={[
                    { value: "left", label: "← Gauche" },
                    { value: "center", label: "↔ Centre" },
                    { value: "right", label: "Droite →" },
                  ]}
                  value={(styles.alignment as "left" | "center" | "right") || "left"}
                  onChange={(val) => val && updateStyles("alignment", val)}
                  columns={3}
                  size="md"
                />
              )}
            </Field>
          )}

          {/* Inline option for side-by-side blocks */}
          {widthMode === "custom" && (
            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={styles.inline || false}
                onChange={(e) => updateStyles("inline", e.target.checked ? true : undefined)}
                className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
              />
              <div>
                <span className="text-sm font-semibold text-gray-800">
                  Affichage en ligne (inline)
                </span>
                <p className="text-xs text-gray-500 mt-0.5">
                  Permet de placer plusieurs blocs côte à côte
                </p>
              </div>
            </label>
          )}
        </div>
      </CollapsibleSection>

      {/* ============================================= */}
      {/* HAUTEUR - Complete height control */}
      {/* ============================================= */}
      <CollapsibleSection 
        title="Hauteur" 
        defaultOpen={false}
        badge={heightMode !== "auto" ? (heightMode === "preset" ? styles.heightPreset : heightMode === "viewport" ? "100vh" : `${styles.heightValue || 400}${heightUnit}`) : undefined}
      >
        <div className="space-y-5">
          {/* Height mode selector - improved UX */}
          <ToggleButtonGroup
            options={[
              { value: "auto", label: "Auto", description: "Contenu" },
              { value: "preset", label: "Prédéfini", description: "S/M/L/XL" },
              { value: "custom", label: "Personnalisé", description: "px / vh" },
              { value: "viewport", label: "Écran", description: "100vh" },
            ]}
            value={heightMode}
            onChange={(mode) => mode && switchHeightMode(mode)}
            columns={4}
            size="md"
          />

          {/* Preset height options */}
          {heightMode === "preset" && (
            <Field label="Hauteur prédéfinie">
              <ToggleButtonGroup
                options={[
                  { value: "small", label: "Petit", description: "200px" },
                  { value: "medium", label: "Moyen", description: "400px" },
                  { value: "large", label: "Grand", description: "600px" },
                  { value: "xlarge", label: "Très grand", description: "800px" },
                ]}
                value={(styles.heightPreset as "small" | "medium" | "large" | "xlarge") || (styles.height as "small" | "medium" | "large" | "xlarge") || "medium"}
                onChange={(val) => {
                  if (!val) return;
                  const pxMap: Record<string, number> = { small: 200, medium: 400, large: 600, xlarge: 800 };
                  onLiveStylePreview?.(undefined, `${pxMap[val]}px`);
                  updateStyles({
                    heightPreset: val,
                    height: val,
                  });
                  setTimeout(() => onLiveStylePreview?.(undefined, undefined), 50);
                }}
                columns={4}
                size="sm"
              />
            </Field>
          )}

          {/* Custom height options */}
          {heightMode === "custom" && (
            <>
              <Field label="Unité de mesure">
                <ToggleButtonGroup
                  options={[
                    { value: "px", label: "Pixels", description: "px" },
                    { value: "vh", label: "Viewport", description: "vh" },
                  ]}
                  value={heightUnit}
                  onChange={(unit) => {
                    if (!unit) return;
                    setHeightUnit(unit);
                    updateHeight(unit === "px" ? (styles.heightValue || 400) : (styles.heightValue || 50), unit);
                  }}
                  columns={2}
                  size="md"
                />
              </Field>

              {heightUnit === "px" && (
                <Field label="Hauteur en pixels">
                  <RangeSlider
                    min={100}
                    max={1000}
                    step={10}
                    value={liveHeightValue ?? styles.heightValue ?? 400}
                    onChange={(val) => {
                      if (isDraggingHeight) {
                        handleHeightSliderDrag(val, "px");
                      } else {
                        setLiveHeightValue(val);
                      }
                    }}
                    onDragStart={() => setIsDraggingHeight(true)}
                    onDragEnd={(val) => handleHeightSliderEnd(val, "px")}
                    unit="px"
                    presets={[200, 300, 400, 500, 600]}
                  />
                </Field>
              )}

              {heightUnit === "vh" && (
                <Field label="Hauteur en viewport (vh)">
                  <RangeSlider
                    min={10}
                    max={200}
                    step={1}
                    value={liveHeightValue ?? styles.heightValue ?? 50}
                    onChange={(val) => {
                      if (isDraggingHeight) {
                        handleHeightSliderDrag(val, "vh");
                      } else {
                        setLiveHeightValue(val);
                      }
                    }}
                    onDragStart={() => setIsDraggingHeight(true)}
                    onDragEnd={(val) => handleHeightSliderEnd(val, "vh")}
                    unit="vh"
                    presets={[25, 50, 75, 100, 150]}
                  />
                </Field>
              )}

              <Field label="Hauteur maximum" hint="optionnel">
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="100"
                    max="2000"
                    value={styles.maxHeight || ""}
                    onChange={(e) => updateStyles("maxHeight", parseInt(e.target.value) || undefined)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
                    placeholder="Pas de limite"
                  />
                  <span className="text-sm text-gray-500 font-medium">px</span>
                  {styles.maxHeight && (
                    <button
                      onClick={() => updateStyles("maxHeight", undefined)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Supprimer la limite"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </Field>
            </>
          )}

          {/* Vertical alignment - for viewport and custom heights */}
          {(heightMode === "viewport" || heightMode === "custom" || heightMode === "preset") && (
            <Field label="Alignement vertical du contenu">
              <ToggleButtonGroup
                options={[
                  { value: "top", label: "↑ Haut" },
                  { value: "center", label: "↕ Centre" },
                  { value: "bottom", label: "↓ Bas" },
                ]}
                value={(styles.verticalAlign as "top" | "center" | "bottom") || "top"}
                onChange={(val) => val && updateStyles("verticalAlign", val)}
                columns={3}
                size="md"
              />
            </Field>
          )}
        </div>
      </CollapsibleSection>

      {/* SPACING - Margins & Paddings - New Visual Editor */}
      <CollapsibleSection title="Espacements" defaultOpen>
        <SpacingEditor styles={styles} updateStyles={updateStyles} />
      </CollapsibleSection>

      {/* Apparence */}
      <CollapsibleSection title="Apparence">
        <div className="space-y-5">
          <Field label="Couleur de fond">
            <div className="flex items-center gap-3">
              <DebouncedColorInput
                value={styles.backgroundColor || "#ffffff"}
                onChange={(value) =>
                  updateStyles("backgroundColor", value)
                }
                className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-gray-400 transition-colors"
              />
              <DebouncedTextInput
                value={styles.backgroundColor || ""}
                onChange={(value) =>
                  updateStyles("backgroundColor", value)
                }
                className="input flex-1 font-mono text-sm"
                placeholder="transparent"
              />
              {styles.backgroundColor && (
                <button
                  onClick={() => updateStyles("backgroundColor", undefined)}
                  className="text-xs text-gray-500 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </Field>
          <Field label="Image de fond">
            <MediaPicker
              value={styles.backgroundImage || ""}
              onChange={(url) =>
                updateStyles("backgroundImage", url || undefined)
              }
              acceptTypes="image"
              placeholder="Sélectionner une image de fond"
              showPreview={true}
            />
          </Field>
          <Field label="Arrondi des coins">
            <ToggleButtonGroup
              options={[
                { value: "none", label: "0" },
                { value: "sm", label: "S" },
                { value: "md", label: "M" },
                { value: "lg", label: "L" },
                { value: "xl", label: "XL" },
                { value: "full", label: "∞" },
              ]}
              value={(styles.borderRadius as "none" | "sm" | "md" | "lg" | "xl" | "full") || "none"}
              onChange={(val) => updateStyles("borderRadius", val === "none" ? undefined : val)}
              columns={6}
              size="sm"
              allowDeselect
            />
          </Field>
          <Field label="Ombre">
            <ToggleButtonGroup
              options={[
                { value: "none", label: "0" },
                { value: "sm", label: "S" },
                { value: "md", label: "M" },
                { value: "lg", label: "L" },
                { value: "xl", label: "XL" },
              ]}
              value={(styles.shadow as "none" | "sm" | "md" | "lg" | "xl") || "none"}
              onChange={(val) => updateStyles("shadow", val === "none" ? undefined : val)}
              columns={5}
              size="sm"
              allowDeselect
            />
          </Field>
        </div>
      </CollapsibleSection>

      {/* Typographie */}
      <CollapsibleSection title="Typographie">
        <div className="space-y-5">
          <Field label="Couleur du texte">
            <div className="flex items-center gap-3">
              <DebouncedColorInput
                value={styles.textColor || "#000000"}
                onChange={(value) => updateStyles("textColor", value)}
                className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-gray-400 transition-colors"
              />
              <DebouncedTextInput
                value={styles.textColor || ""}
                onChange={(value) => updateStyles("textColor", value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
                placeholder="inherit"
              />
              {styles.textColor && (
                <button
                  onClick={() => updateStyles("textColor", undefined)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Supprimer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </Field>
          <Field label="Alignement du texte">
            <ToggleButtonGroup
              options={[
                { value: "left", label: "← Gauche" },
                { value: "center", label: "↔ Centre" },
                { value: "right", label: "Droite →" },
                { value: "justify", label: "Justifié" },
              ]}
              value={(styles.textAlign as "left" | "center" | "right" | "justify") || "left"}
              onChange={(val) => updateStyles("textAlign", val === "left" ? undefined : val)}
              columns={4}
              size="sm"
            />
          </Field>
          <Field label="Taille de police">
            <select
              value={(styles as unknown as Record<string, unknown>).fontSize as string || "inherit"}
              onChange={(e) =>
                updateStyles(
                  "fontSize" as keyof BlockStyles,
                  e.target.value === "inherit" ? undefined : e.target.value,
                )
              }
              className="input"
            >
              <option value="inherit">Héritée</option>
              <option value="xs">Très petit (12px)</option>
              <option value="sm">Petit (14px)</option>
              <option value="base">Normal (16px)</option>
              <option value="lg">Grand (18px)</option>
              <option value="xl">Très grand (20px)</option>
              <option value="2xl">2XL (24px)</option>
              <option value="3xl">3XL (30px)</option>
              <option value="4xl">4XL (36px)</option>
              <option value="5xl">5XL (48px)</option>
            </select>
          </Field>
          <Field label="Graisse de police">
            <select
              value={(styles as unknown as Record<string, unknown>).fontWeight as string || "inherit"}
              onChange={(e) =>
                updateStyles(
                  "fontWeight" as keyof BlockStyles,
                  e.target.value === "inherit" ? undefined : e.target.value,
                )
              }
              className="input"
            >
              <option value="inherit">Héritée</option>
              <option value="light">Légère (300)</option>
              <option value="normal">Normale (400)</option>
              <option value="medium">Moyenne (500)</option>
              <option value="semibold">Semi-gras (600)</option>
              <option value="bold">Gras (700)</option>
              <option value="extrabold">Très gras (800)</option>
            </select>
          </Field>
          <Field label="Espacement des lignes">
            <select
              value={(styles as unknown as Record<string, unknown>).lineHeight as string || "inherit"}
              onChange={(e) =>
                updateStyles(
                  "lineHeight" as keyof BlockStyles,
                  e.target.value === "inherit" ? undefined : e.target.value,
                )
              }
              className="input"
            >
              <option value="inherit">Héritée</option>
              <option value="none">Aucun (1)</option>
              <option value="tight">Serré (1.25)</option>
              <option value="snug">Compact (1.375)</option>
              <option value="normal">Normal (1.5)</option>
              <option value="relaxed">Relâché (1.625)</option>
              <option value="loose">Large (2)</option>
            </select>
          </Field>
          <Field label="Espacement des lettres">
            <select
              value={(styles as unknown as Record<string, unknown>).letterSpacing as string || "inherit"}
              onChange={(e) =>
                updateStyles(
                  "letterSpacing" as keyof BlockStyles,
                  e.target.value === "inherit" ? undefined : e.target.value,
                )
              }
              className="input"
            >
              <option value="inherit">Héritée</option>
              <option value="tighter">Très serré (-0.05em)</option>
              <option value="tight">Serré (-0.025em)</option>
              <option value="normal">Normal (0)</option>
              <option value="wide">Large (0.025em)</option>
              <option value="wider">Plus large (0.05em)</option>
              <option value="widest">Très large (0.1em)</option>
            </select>
          </Field>
        </div>
      </CollapsibleSection>

      {/* Animation */}
      <CollapsibleSection title="Animation">
        <div className="space-y-5">
          <Field label="Type d'animation">
            <ToggleButtonGroup
              options={[
                { value: "none", label: "Aucune" },
                { value: "fade-in", label: "Fondu" },
                { value: "slide-up", label: "↑ Haut" },
                { value: "slide-left", label: "← Gauche" },
                { value: "slide-right", label: "Droite →" },
                { value: "scale", label: "Zoom" },
              ]}
              value={(styles.animation as "none" | "fade-in" | "slide-up" | "slide-left" | "slide-right" | "scale") || "none"}
              onChange={(val) => updateStyles("animation", val === "none" ? undefined : val)}
              columns={3}
              size="sm"
              allowDeselect
            />
          </Field>
          {styles.animation && styles.animation !== "none" && (
            <>
              <Field label="Délai d'apparition" hint="en millisecondes">
                <RangeSlider
                  min={0}
                  max={2000}
                  step={100}
                  value={styles.animationDelay || 0}
                  onChange={(val) => updateStyles("animationDelay", val || undefined)}
                  onDragEnd={(val) => updateStyles("animationDelay", val || undefined)}
                  unit="ms"
                  presets={[0, 200, 500, 1000]}
                />
              </Field>
              {/* Animation Preview */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-500 mb-3 font-medium">
                  Aperçu de l&apos;animation
                </p>
                <AnimationPreview
                  animation={styles.animation}
                  delay={styles.animationDelay || 0}
                />
              </div>
            </>
          )}
        </div>
      </CollapsibleSection>

      {/* Avancé */}
      <CollapsibleSection title="Avancé">
        <div className="space-y-5">
          <Field label="Classes CSS Tailwind" hint="optionnel">
            <div className="space-y-2">
              <input
                type="text"
                value={styles.customClass || ""}
                onChange={(e) =>
                  updateStyles("customClass", e.target.value || undefined)
                }
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
                placeholder="ex: text-red-500 bg-blue-100 rounded-2xl"
              />
              <p className="text-xs text-gray-500">
                Ajoutez des classes Tailwind personnalisées séparées par des espaces
              </p>
            </div>
          </Field>
          
          {/* Reset button */}
          <button
            onClick={() => {
              // Reset all styles to default
              updateStyles("widthMode", undefined);
              updateStyles("widthValue", undefined);
              updateStyles("widthPreset", undefined);
              updateStyles("heightMode", undefined);
              updateStyles("heightValue", undefined);
              updateStyles("heightPreset", undefined);
              updateStyles("backgroundColor", undefined);
              updateStyles("textColor", undefined);
              updateStyles("animation", undefined);
              updateStyles("customClass", undefined);
            }}
            className="w-full flex items-center justify-center gap-2 p-3 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Réinitialiser tous les styles
          </button>
        </div>
      </CollapsibleSection>
    </div>
  );
}
