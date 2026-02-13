"use client";

import Link from "next/link";
import { BlockContentProps, SPACER_HEIGHT_MAP, COLUMNS_MAP } from "../types";

// ============================================
// Spacer Block
// ============================================

interface SpacerContent {
  height?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  mobileHeight?: string;
}

export function SpacerBlock({ content }: BlockContentProps<SpacerContent>) {
  const heightMap: Record<string, string> = {
    xs: "h-2",
    sm: "h-4",
    md: "h-8",
    lg: "h-12",
    xl: "h-16",
    "2xl": "h-24",
  };

  return <div className={heightMap[content.height || "md"]} />;
}

// ============================================
// Divider Block
// ============================================

interface DividerContent {
  variant?: string;
  style?: string; // legacy
  width?: string;
  color?: string;
  thickness?: string;
}

export function DividerBlock({ content }: BlockContentProps<DividerContent>) {
  const variant = content.variant || content.style || "solid";
  const width = content.width || "full";
  const color = content.color || "rgba(255,255,255,0.2)";
  const thickness = content.thickness || "thin";

  const widthMap: Record<string, string> = {
    short: "w-16",
    half: "w-1/2",
    long: "w-3/4",
    full: "w-full",
    medium: "w-1/3",
  };

  const thicknessMap: Record<string, string> = {
    thin: "1px",
    medium: "2px",
    thick: "4px",
  };

  const heightPx = thicknessMap[thickness] || "1px";

  if (variant === "gradient") {
    return (
      <div
        className={`${widthMap[width]} mx-auto`}
        style={{
          height: heightPx,
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }}
      />
    );
  }
  
  if (variant === "decorative") {
    return (
      <div className={`${widthMap[width]} mx-auto flex items-center gap-4`}>
        <div className="flex-1 h-px" style={{ backgroundColor: color }} />
        <div className="w-2 h-2 rotate-45" style={{ backgroundColor: color }} />
        <div className="flex-1 h-px" style={{ backgroundColor: color }} />
      </div>
    );
  }
  
  if (variant === "double") {
    return (
      <div className={`${widthMap[width]} mx-auto flex flex-col gap-1`}>
        <div className="h-px" style={{ backgroundColor: color }} />
        <div className="h-px" style={{ backgroundColor: color }} />
      </div>
    );
  }

  return (
    <hr
      className={`${widthMap[width]} mx-auto border-0`}
      style={{
        height: heightPx,
        borderTopWidth: heightPx,
        borderTopStyle: variant as React.CSSProperties["borderTopStyle"],
        borderTopColor: color,
      }}
    />
  );
}

// ============================================
// Columns Block
// ============================================

interface ColumnItem {
  width?: number;
  content?: string;
}

interface ColumnsContent {
  columns?: ColumnItem[] | number;
  gap?: string;
  stackOnMobile?: boolean;
}

export function ColumnsBlock({ content }: BlockContentProps<ColumnsContent>) {
  const rawColumns = content.columns;
  const columns = Array.isArray(rawColumns) ? rawColumns : [];
  const gap = content.gap || "medium";
  const stackOnMobile = content.stackOnMobile !== false;

  const gapMap: Record<string, string> = {
    none: "gap-0",
    small: "gap-4",
    medium: "gap-8",
    large: "gap-12",
  };

  if (columns.length === 0) {
    return null;
  }

  return (
    <div className={`${stackOnMobile ? "flex flex-col @md:flex-row" : "flex"} ${gapMap[gap]}`}>
      {columns.map((column, index) => (
        <div
          key={index}
          className="flex-1"
          style={column.width ? { flex: `0 0 ${column.width}%` } : undefined}
        >
          {column.content && (
            <div dangerouslySetInnerHTML={{ __html: column.content }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================
// Grid Block
// ============================================

interface GridItem {
  title: string;
  description?: string;
  image?: string;
  link?: string;
  badge?: string;
  _styles?: {
    backgroundColor?: string;
    borderRadius?: string;
    padding?: string;
  };
}

interface GridContent {
  items?: GridItem[];
  columns?: number;
  gap?: string;
  // Item styling
  itemStyle?: "default" | "bordered" | "elevated" | "glass" | "minimal";
  itemBgColor?: string;
  itemRadius?: string;
  itemPadding?: string;
  // Image options
  imageAspect?: "video" | "square" | "portrait" | "wide" | "auto";
  showImage?: boolean;
  imagePosition?: "top" | "left" | "right" | "background";
  // Text styling
  titleSize?: "sm" | "md" | "lg";
  showDescription?: boolean;
  textAlign?: "left" | "center" | "right";
}

export function GridBlock({ content }: BlockContentProps<GridContent>) {
  const items = content.items || [];
  const columns = content.columns || 3;
  const gap = content.gap || "md";
  
  // Item styling
  const itemStyle = content.itemStyle || "default";
  const itemBgColor = content.itemBgColor;
  const itemRadius = content.itemRadius || "lg";
  const itemPadding = content.itemPadding || "md";
  
  // Image options
  const imageAspect = content.imageAspect || "video";
  const showImage = content.showImage !== false;
  const imagePosition = content.imagePosition || "top";
  
  // Text styling
  const titleSize = content.titleSize || "md";
  const showDescription = content.showDescription !== false;
  const textAlign = content.textAlign || "left";

  // Gap mapping - matches GAP_OPTIONS values
  const gapMap: Record<string, string> = {
    none: "gap-0",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
    // Legacy support
    small: "gap-2",
    medium: "gap-4",
    large: "gap-6",
  };

  // Item style presets
  const itemStyleMap: Record<string, string> = {
    default: "bg-white/5 hover:bg-white/10",
    bordered: "bg-transparent border border-neutral-200 hover:border-neutral-400",
    elevated: "bg-white shadow-md hover:shadow-lg",
    glass: "bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20",
    minimal: "bg-transparent hover:bg-neutral-100/50",
  };

  // Border radius mapping
  const radiusMap: Record<string, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-3xl",
  };

  // Padding mapping
  const paddingMap: Record<string, string> = {
    none: "p-0",
    sm: "p-2",
    md: "p-4",
    lg: "p-6",
    xl: "p-8",
  };

  // Image aspect ratio mapping
  const aspectMap: Record<string, string> = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    wide: "aspect-[21/9]",
    auto: "",
  };

  // Title size mapping
  const titleSizeMap: Record<string, string> = {
    sm: "text-sm font-medium",
    md: "text-base font-semibold",
    lg: "text-lg font-bold",
  };

  // Text alignment mapping
  const textAlignMap: Record<string, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const columnsClass = COLUMNS_MAP[columns] || COLUMNS_MAP[3];
  const gapClass = gapMap[gap] || gapMap.md;
  const baseItemClass = itemStyleMap[itemStyle] || itemStyleMap.default;
  const radiusClass = radiusMap[itemRadius] || radiusMap.lg;
  const textAlignClass = textAlignMap[textAlign] || textAlignMap.left;

  return (
    <div className={`grid ${columnsClass} ${gapClass}`}>
      {items.map((item, index) => {
        const Wrapper = item.link ? Link : "div";
        const childStyles = item._styles || {};
        
        // Build item styles
        const itemInlineStyles: React.CSSProperties = {};
        if (itemBgColor) itemInlineStyles.backgroundColor = itemBgColor;
        if (childStyles.backgroundColor) itemInlineStyles.backgroundColor = childStyles.backgroundColor;
        if (childStyles.borderRadius) itemInlineStyles.borderRadius = childStyles.borderRadius;
        if (childStyles.padding) itemInlineStyles.padding = childStyles.padding;

        const isBackgroundImage = imagePosition === "background" && item.image && showImage;

        return (
          <Wrapper
            key={index}
            href={item.link || "#"}
            className={`relative overflow-hidden ${radiusClass} ${baseItemClass} transition-all duration-300 group ${isBackgroundImage ? "min-h-[200px] flex items-end" : ""}`}
            style={itemInlineStyles}
            data-item-index={index}
            data-child-type="grid-item"
          >
            {/* Background image mode */}
            {isBackgroundImage && (
              <>
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
              </>
            )}

            {/* Badge */}
            {item.badge && (
              <span className="absolute top-3 right-3 px-2 py-1 bg-white text-black text-xs font-medium rounded z-10">
                {item.badge}
              </span>
            )}

            {/* Image top position */}
            {item.image && showImage && imagePosition === "top" && (
              <div className={`${aspectMap[imageAspect]} overflow-hidden`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}

            {/* Horizontal layout (image left/right) */}
            {item.image && showImage && (imagePosition === "left" || imagePosition === "right") ? (
              <div className={`flex ${imagePosition === "right" ? "flex-row-reverse" : "flex-row"} gap-4`}>
                <div className={`w-1/3 shrink-0 ${aspectMap[imageAspect]} overflow-hidden`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className={`flex-1 ${paddingMap[itemPadding]} ${textAlignClass}`}>
                  <h3 className={`${titleSizeMap[titleSize]} whitespace-pre-line`} data-field="title">{item.title}</h3>
                  {item.description && showDescription && (
                    <p className="text-sm opacity-70 mt-1 line-clamp-2 whitespace-pre-line" data-field="description">{item.description}</p>
                  )}
                </div>
              </div>
            ) : (
              /* Standard vertical layout (top or background) */
              <div className={`${paddingMap[itemPadding]} ${textAlignClass} ${isBackgroundImage ? "relative z-10 text-white" : ""}`}>
                <h3 className={`${titleSizeMap[titleSize]} whitespace-pre-line`} data-field="title">{item.title}</h3>
                {item.description && showDescription && (
                  <p className={`text-sm mt-1 line-clamp-2 whitespace-pre-line ${isBackgroundImage ? "text-white/80" : "opacity-70"}`} data-field="description">{item.description}</p>
                )}
              </div>
            )}
          </Wrapper>
        );
      })}
    </div>
  );
}

// ============================================
// Container Block
// ============================================

interface ContainerContent {
  content?: string;
  width?: string;
}

export function ContainerBlock({ content }: BlockContentProps<ContainerContent>) {
  const innerContent = content.content;

  return (
    <div className="p-6">
      {innerContent && (
        <div dangerouslySetInnerHTML={{ __html: innerContent }} />
      )}
    </div>
  );
}
