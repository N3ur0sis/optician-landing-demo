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
    <div className={`${stackOnMobile ? "flex flex-col md:flex-row" : "flex"} ${gapMap[gap]}`}>
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
}

interface GridContent {
  items?: GridItem[];
  columns?: number;
  gap?: string;
}

export function GridBlock({ content }: BlockContentProps<GridContent>) {
  const items = content.items || [];
  const columns = content.columns || 3;
  const gap = content.gap || "medium";

  const gapMap: Record<string, string> = {
    none: "gap-0",
    small: "gap-2",
    medium: "gap-4",
    large: "gap-6",
  };

  const columnsClass = COLUMNS_MAP[columns] || COLUMNS_MAP[3];

  return (
    <div className={`grid ${columnsClass} ${gapMap[gap]}`}>
      {items.map((item, index) => {
        const Wrapper = item.link ? Link : "div";
        return (
          <Wrapper
            key={index}
            href={item.link || "#"}
            className="relative overflow-hidden rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
          >
            {item.badge && (
              <span className="absolute top-3 right-3 px-2 py-1 bg-white text-black text-xs font-medium rounded z-10">
                {item.badge}
              </span>
            )}
            {item.image && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold">{item.title}</h3>
              {item.description && (
                <p className="text-sm opacity-70 mt-1 line-clamp-2">{item.description}</p>
              )}
            </div>
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
