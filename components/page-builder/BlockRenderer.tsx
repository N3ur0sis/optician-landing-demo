"use client";

import { type TargetAndTransition } from "framer-motion";
import { motion } from "framer-motion";
import { PageBlock, BlockStyles, BlockType } from "@/types/page-builder";
import { spacingToCss } from "@/app/admin/dashboard/pages/block-editor/types";
import { usePageBuilder } from "./PageBuilderContext";

// Import Block Registry - All block components are now modular
import { BLOCK_REGISTRY } from "./blocks";

interface BlockRendererProps {
  block: PageBlock;
}

// ============================================================================
// Section Wrapper Styles (full-width background container)
// ============================================================================

function getSectionWrapperStyles(styles: BlockStyles): {
  className: string;
  style: React.CSSProperties;
} {
  const classNames: string[] = ["w-full", "relative"];
  const inlineStyles: React.CSSProperties = {};

  if (styles.sectionBackgroundColor) {
    inlineStyles.backgroundColor = styles.sectionBackgroundColor;
  }

  if (styles.sectionBackgroundImage) {
    inlineStyles.backgroundImage = `url(${styles.sectionBackgroundImage})`;
    inlineStyles.backgroundSize = "cover";
    inlineStyles.backgroundPosition = "center";
  }

  if (styles.sectionPaddingTop && styles.sectionPaddingTop !== "none") {
    inlineStyles.paddingTop = spacingToCss(styles.sectionPaddingTop) || "0";
  }
  if (styles.sectionPaddingBottom && styles.sectionPaddingBottom !== "none") {
    inlineStyles.paddingBottom = spacingToCss(styles.sectionPaddingBottom) || "0";
  }

  return { className: classNames.join(" "), style: inlineStyles };
}

function getSectionOverlayStyles(styles: BlockStyles): React.CSSProperties | null {
  if (!styles.sectionOverlayColor || !styles.sectionOverlayOpacity) return null;

  return {
    position: "absolute" as const,
    inset: 0,
    backgroundColor: styles.sectionOverlayColor,
    opacity: styles.sectionOverlayOpacity / 100,
    pointerEvents: "none" as const,
  };
}

function needsSectionWrapper(styles: BlockStyles): boolean {
  return !!(
    styles.sectionBackgroundColor ||
    styles.sectionBackgroundImage ||
    styles.sectionPaddingTop ||
    styles.sectionPaddingBottom
  );
}

// ============================================================================
// Block Styles - Convert BlockStyles to CSS classes/inline styles
// ============================================================================

function getBlockStyles(styles: BlockStyles, isEditing = false): {
  className: string;
  style: React.CSSProperties;
} {
  // Base classes to prevent overflow - blocks should never exceed page width
  const classNames: string[] = ["max-w-full", "overflow-hidden"];
  const inlineStyles: React.CSSProperties = {};

  let hasCustomWidth = false;
  let requestedFullWidth = false; // Track if 100% width was requested

  if (!isEditing) {
    // New width system
    if (styles.widthMode === "custom" && styles.widthValue) {
      const unit = styles.widthUnit || "%";
      const widthVal = Number(styles.widthValue);
      if (widthVal === 100 && unit === "%") {
        requestedFullWidth = true; // Will handle after margins are processed
      } else {
        inlineStyles.width = `${widthVal}${unit}`;
        hasCustomWidth = widthVal < 100 || unit === "px";
      }
    } else if (styles.widthPercent && styles.widthPercent > 0 && styles.widthPercent < 100) {
      inlineStyles.width = `${styles.widthPercent}%`;
      hasCustomWidth = true;
    } else if (styles.widthMode === "preset") {
      const preset = styles.widthPreset as string | undefined;
      if (preset) {
        // Note: 'full' is deprecated, mapped to 'wide' for backwards compatibility
        const widthMap: Record<string, string> = {
          narrow: "max-w-2xl", medium: "max-w-4xl", wide: "max-w-6xl",
          full: "max-w-6xl", edge: "max-w-none w-full",
          NARROW: "max-w-2xl", MEDIUM: "max-w-4xl", WIDE: "max-w-6xl",
          FULL: "max-w-6xl", EDGE: "max-w-none w-full",
        };
        const widthClass = widthMap[preset];
        if (widthClass) {
          classNames.push(widthClass);
          if (preset.toLowerCase() !== "edge") hasCustomWidth = true;
        }
      }
    }

    if (styles.inline) {
      inlineStyles.display = "inline-block";
      inlineStyles.verticalAlign = "top";
    }

    // Block alignment
    if (hasCustomWidth && !styles.inline) {
      if (styles.alignment === "left") {
        inlineStyles.marginLeft = "0";
        inlineStyles.marginRight = "auto";
      } else if (styles.alignment === "right") {
        inlineStyles.marginLeft = "auto";
        inlineStyles.marginRight = "0";
      } else if (styles.alignment === "center") {
        inlineStyles.marginLeft = "auto";
        inlineStyles.marginRight = "auto";
      }
    }

    // Height system
    if (styles.heightMode === "viewport" || styles.fullHeight) {
      inlineStyles.minHeight = "100vh";
    } else if (styles.heightMode === "custom" && styles.heightValue) {
      const unit = styles.heightUnit || "px";
      inlineStyles.minHeight = `${styles.heightValue}${unit}`;
    } else if (styles.heightMode === "preset" || styles.heightPreset || styles.height) {
      const preset = styles.heightPreset || styles.height;
      if (preset && preset !== "auto") {
        const heightMap: Record<string, string> = {
          small: "200px", medium: "400px", large: "600px", xlarge: "800px", screen: "100vh",
        };
        if (heightMap[preset]) inlineStyles.minHeight = heightMap[preset];
      }
    } else if (styles.minHeight) {
      inlineStyles.minHeight = typeof styles.minHeight === "number" 
        ? `${styles.minHeight}px` 
        : styles.minHeight;
    }
  }

  // Manual margins
  const hasManualMarginLeft = styles.marginLeft && styles.marginLeft !== "none";
  const hasManualMarginRight = styles.marginRight && styles.marginRight !== "none";

  let marginLeftPx = "";
  let marginRightPx = "";

  if (hasManualMarginLeft) {
    const resolved = spacingToCss(styles.marginLeft);
    if (resolved) {
      inlineStyles.marginLeft = resolved;
      marginLeftPx = resolved;
    }
  }
  if (hasManualMarginRight) {
    const resolved = spacingToCss(styles.marginRight);
    if (resolved) {
      inlineStyles.marginRight = resolved;
      marginRightPx = resolved;
    }
  }

  // Handle full width with margins - use calc() to prevent overflow
  if (requestedFullWidth && !isEditing) {
    if (marginLeftPx || marginRightPx) {
      // Calculate width = 100% - margins to prevent overflow
      let calcParts = ["100%"];
      if (marginLeftPx) calcParts.push(marginLeftPx);
      if (marginRightPx) calcParts.push(marginRightPx);
      inlineStyles.width = `calc(${calcParts.join(" - ")})`;
    } else {
      inlineStyles.width = "100%";
    }
  }

  // Vertical alignment
  const hasDefinedHeight = !!(
    styles.heightMode === "viewport" || 
    styles.fullHeight ||
    (styles.heightMode === "custom" && styles.heightValue) ||
    styles.heightPreset ||
    styles.minHeight ||
    styles.height
  );

  if (styles.maxHeight) {
    inlineStyles.maxHeight = `${styles.maxHeight}px`;
    inlineStyles.overflow = "hidden";
  }

  if (hasDefinedHeight && styles.verticalAlign) {
    classNames.push("flex flex-col h-full");
    const verticalAlignMap: Record<string, string> = {
      top: "justify-start", center: "justify-center", bottom: "justify-end",
    };
    classNames.push(verticalAlignMap[styles.verticalAlign]);
  }

  // Text alignment
  if (styles.textAlign) {
    const textAlignMap: Record<string, string> = {
      left: "text-left", center: "text-center", right: "text-right", justify: "text-justify",
    };
    classNames.push(textAlignMap[styles.textAlign]);
  }

  // Margins & Paddings
  // In edit mode: margins are visualized via wrapper padding in PageBuilderEditor
  // In render mode: apply REAL CSS margins for actual spacing between blocks
  if (!isEditing) {
    const marginTopResolved = spacingToCss(styles.marginTop);
    if (marginTopResolved) inlineStyles.marginTop = marginTopResolved;
    const marginBottomResolved = spacingToCss(styles.marginBottom);
    if (marginBottomResolved) inlineStyles.marginBottom = marginBottomResolved;
  }

  // Paddings are always applied (internal spacing)
  const paddingTopResolved = spacingToCss(styles.paddingTop);
  if (paddingTopResolved) inlineStyles.paddingTop = paddingTopResolved;
  const paddingBottomResolved = spacingToCss(styles.paddingBottom);
  if (paddingBottomResolved) inlineStyles.paddingBottom = paddingBottomResolved;
  const paddingLeftResolved = spacingToCss(styles.paddingLeft);
  if (paddingLeftResolved) inlineStyles.paddingLeft = paddingLeftResolved;
  const paddingRightResolved = spacingToCss(styles.paddingRight);
  if (paddingRightResolved) inlineStyles.paddingRight = paddingRightResolved;

  // Colors
  if (styles.backgroundColor) inlineStyles.backgroundColor = styles.backgroundColor;
  if (styles.textColor) inlineStyles.color = styles.textColor;
  if (styles.backgroundImage) {
    inlineStyles.backgroundImage = `url(${styles.backgroundImage})`;
    inlineStyles.backgroundSize = "cover";
    inlineStyles.backgroundPosition = "center";
  }

  // Typography
  if (styles.fontSize) {
    const fontSizeMap: Record<string, string> = {
      xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem", xl: "1.25rem",
      "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.25rem", "5xl": "3rem",
    };
    inlineStyles.fontSize = fontSizeMap[styles.fontSize];
  }

  if (styles.fontWeight) {
    const fontWeightMap: Record<string, string> = {
      light: "300", normal: "400", medium: "500", semibold: "600", bold: "700", extrabold: "800",
    };
    inlineStyles.fontWeight = fontWeightMap[styles.fontWeight];
  }

  if (styles.lineHeight) {
    const lineHeightMap: Record<string, string> = {
      none: "1", tight: "1.25", snug: "1.375", normal: "1.5", relaxed: "1.625", loose: "2",
    };
    inlineStyles.lineHeight = lineHeightMap[styles.lineHeight];
  }

  if (styles.letterSpacing) {
    const letterSpacingMap: Record<string, string> = {
      tighter: "-0.05em", tight: "-0.025em", normal: "0", wide: "0.025em", wider: "0.05em", widest: "0.1em",
    };
    inlineStyles.letterSpacing = letterSpacingMap[styles.letterSpacing];
  }

  // Border radius
  const radiusMap: Record<string, string> = {
    none: "0", sm: "0.25rem", md: "0.5rem", lg: "0.75rem", xl: "1rem", full: "9999px",
  };
  if (styles.borderRadius && styles.borderRadius !== "none") {
    inlineStyles.borderRadius = radiusMap[styles.borderRadius];
  }

  // Shadow
  const shadowMap: Record<string, string> = {
    sm: "shadow-sm", md: "shadow-md", lg: "shadow-lg", xl: "shadow-xl",
  };
  if (styles.shadow && styles.shadow !== "none") {
    classNames.push(shadowMap[styles.shadow] || "");
  }

  // Custom class
  if (styles.customClass) classNames.push(styles.customClass);

  // Final safeguard: if width is 100% and there are horizontal margins, use calc()
  // This prevents overflow when width: 100% + margins would exceed parent width
  if (!isEditing && inlineStyles.width === "100%" && (marginLeftPx || marginRightPx)) {
    let calcParts = ["100%"];
    if (marginLeftPx) calcParts.push(marginLeftPx);
    if (marginRightPx) calcParts.push(marginRightPx);
    inlineStyles.width = `calc(${calcParts.join(" - ")})`;
  }

  return { className: classNames.join(" "), style: inlineStyles };
}

// ============================================================================
// Animation Variants
// ============================================================================

const animationVariants: Record<string, { initial: TargetAndTransition; animate: TargetAndTransition }> = {
  "fade-in": { initial: { opacity: 0 }, animate: { opacity: 1 } },
  "slide-up": { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } },
  "slide-left": { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 } },
  "slide-right": { initial: { opacity: 0, x: -30 }, animate: { opacity: 1, x: 0 } },
  scale: { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 } },
};

// ============================================================================
// Responsive Classes
// ============================================================================

function getResponsiveClasses(settings: Record<string, unknown>): string {
  const classes: string[] = [];
  if (settings.hideOnMobile) classes.push("hidden md:block");
  if (settings.hideOnTablet) classes.push("md:hidden lg:block");
  if (settings.hideOnDesktop) classes.push("lg:hidden");
  return classes.join(" ");
}

// ============================================================================
// Parse Custom CSS
// ============================================================================

function parseCustomCSS(cssString: string): React.CSSProperties {
  if (!cssString) return {};
  const styles: Record<string, string> = {};
  const lines = cssString.split(";").filter((line) => line.trim());

  for (const line of lines) {
    const [property, value] = line.split(":").map((s) => s.trim());
    if (property && value) {
      const camelProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      styles[camelProperty] = value;
    }
  }

  return styles as React.CSSProperties;
}

// ============================================================================
// Render Block Content using Registry
// ============================================================================

function renderBlockContent(block: PageBlock) {
  const content = block.content as Record<string, unknown>;
  const blockType = block.type as BlockType;

  const BlockComponent = BLOCK_REGISTRY[blockType];

  if (!BlockComponent) {
    return (
      <div className="p-4 bg-gray-100 text-gray-500 text-center rounded">
        Block type &quot;{block.type}&quot; not implemented
      </div>
    );
  }

  return <BlockComponent content={content} />;
}

// ============================================================================
// Main BlockRenderer Component
// ============================================================================

export default function BlockRenderer({ block }: BlockRendererProps) {
  const { isEditing } = usePageBuilder();

  if (!block.visible) return null;

  const styles = block.styles as BlockStyles;
  const settings = block.settings as Record<string, unknown>;
  const { className, style } = getBlockStyles(styles, isEditing);
  const animation =
    styles.animation && styles.animation !== "none"
      ? animationVariants[styles.animation]
      : null;
  const hasSectionWrapper = needsSectionWrapper(styles);
  const responsiveClasses = getResponsiveClasses(settings);
  const customCSSStyles = settings.customCSS
    ? parseCustomCSS(settings.customCSS as string)
    : {};

  const content = renderBlockContent(block);

  const combinedClassName = [className, responsiveClasses].filter(Boolean).join(" ");
  const combinedStyle = { ...style, ...customCSSStyles };

  const contentElement = animation ? (
    <motion.div
      data-page-block={block.type}
      initial={animation.initial}
      whileInView={animation.animate}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: (styles.animationDelay || 0) / 1000 }}
      className={combinedClassName}
      style={combinedStyle}
    >
      {content}
    </motion.div>
  ) : (
    <div data-page-block={block.type} className={combinedClassName} style={combinedStyle}>
      {content}
    </div>
  );

  if (hasSectionWrapper) {
    const sectionStyles = getSectionWrapperStyles(styles);
    const overlayStyles = getSectionOverlayStyles(styles);

    return (
      <div data-page-block={block.type} className={sectionStyles.className} style={sectionStyles.style}>
        {overlayStyles && <div style={overlayStyles} />}
        <div className="relative z-10">{contentElement}</div>
      </div>
    );
  }

  return contentElement;
}
