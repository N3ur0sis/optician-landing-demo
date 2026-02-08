// ============================================
// Shared Types for All Blocks
// ============================================

import type { CSSProperties } from "react";
import type { TargetAndTransition } from "framer-motion";

// Re-export LucideIcon and isValidIcon from icon-picker
export { LucideIcon, isValidIcon } from "@/components/ui/icon-picker";

// Block Component Props
export interface BlockContentProps<T = Record<string, unknown>> {
  content: T;
}

// Child Element Styles - Applied via data-child-type for inline editing
export interface ChildElementStyles {
  width?: string;
  height?: string;
  padding?: string;
  margin?: string;
  backgroundColor?: string;
  borderRadius?: string;
  borderColor?: string;
  borderWidth?: string;
  fontSize?: string;
  fontWeight?: string;
  textColor?: string;
  gap?: string;
  aspectRatio?: string;
  opacity?: string;
  shadow?: string;
}

// Common Button Configuration
export interface ButtonConfig {
  label?: string;
  text?: string;
  href?: string;
  url?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  icon?: string;
  iconPosition?: "left" | "right";
  borderRadius?: string;
  fullWidth?: boolean;
  newTab?: boolean;
}

// Common Image Configuration
export interface ImageConfig {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  objectFit?: "cover" | "contain" | "fill" | "none";
  rounded?: string;
}

// Common Card Configuration
export interface CardConfig {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  link?: string;
  icon?: string;
  tags?: string[];
  meta?: string;
  _styles?: ChildElementStyles;
}

// Common Style Options
export interface CommonStyleOptions {
  variant?: string;
  alignment?: "left" | "center" | "right";
  textColor?: string;
  backgroundColor?: string;
  borderRadius?: string;
  shadow?: string;
  padding?: string;
}

// Layout Options
export interface LayoutOptions {
  columns?: number;
  gap?: string;
  direction?: "horizontal" | "vertical";
}

// Animation Configuration
export interface AnimationOptions {
  animation?:
    | "none"
    | "fade-in"
    | "slide-up"
    | "slide-left"
    | "slide-right"
    | "scale";
  delay?: number;
  stagger?: number;
}

// Animation Variants for Framer Motion
export type AnimationVariants = Record<
  string,
  { initial: TargetAndTransition; animate: TargetAndTransition }
>;

// Block Registry Entry
export interface BlockRegistryEntry {
  type: string;
  component: React.ComponentType<BlockContentProps>;
  category: string;
}

// ============================================
// Utility Functions
// ============================================

/**
 * Get default value if undefined
 */
export function getDefault<T>(value: T | undefined, defaultValue: T): T {
  return value !== undefined ? value : defaultValue;
}

/**
 * Build className string from array of classes
 */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Convert child element styles to React CSSProperties
 */
export function getChildElementInlineStyles(
  styles?: ChildElementStyles,
): CSSProperties {
  if (!styles || Object.keys(styles).length === 0) return {};

  const inlineStyles: CSSProperties = {};

  if (styles.width) inlineStyles.width = styles.width;
  if (styles.height) inlineStyles.height = styles.height;
  if (styles.padding) inlineStyles.padding = styles.padding;
  if (styles.margin) inlineStyles.margin = styles.margin;
  if (styles.backgroundColor)
    inlineStyles.backgroundColor = styles.backgroundColor;
  if (styles.borderRadius) inlineStyles.borderRadius = styles.borderRadius;
  if (styles.borderColor) inlineStyles.borderColor = styles.borderColor;
  if (styles.borderWidth) {
    inlineStyles.borderWidth = styles.borderWidth;
    inlineStyles.borderStyle = "solid";
  }
  if (styles.fontSize) inlineStyles.fontSize = styles.fontSize;
  if (styles.fontWeight) inlineStyles.fontWeight = styles.fontWeight;
  if (styles.textColor) inlineStyles.color = styles.textColor;
  if (styles.gap) inlineStyles.gap = styles.gap;
  if (styles.aspectRatio) inlineStyles.aspectRatio = styles.aspectRatio;
  if (styles.opacity) inlineStyles.opacity = parseFloat(styles.opacity);
  if (styles.shadow) {
    inlineStyles.boxShadow = SHADOW_MAP[styles.shadow] || "none";
  }

  return inlineStyles;
}

// ============================================
// Style Constants & Maps
// ============================================

/** Shadow presets */
export const SHADOW_MAP: Record<string, string> = {
  none: "none",
  sm: "0 1px 2px 0 rgba(0,0,0,0.05)",
  md: "0 4px 6px -1px rgba(0,0,0,0.1)",
  lg: "0 10px 15px -3px rgba(0,0,0,0.1)",
  xl: "0 20px 25px -5px rgba(0,0,0,0.1)",
};

/** Column class map */
export const COLUMNS_MAP: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-5",
};

/** Gap class map */
export const GAP_MAP: Record<string, string> = {
  none: "gap-0",
  small: "gap-4",
  medium: "gap-6",
  large: "gap-8",
};

/** Border radius class map */
export const RADIUS_MAP: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

/** Text alignment class map */
export const TEXT_ALIGN_MAP: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
  LEFT: "text-left",
  CENTER: "text-center",
  RIGHT: "text-right",
};

/** Flex alignment class map */
export const FLEX_ALIGN_MAP: Record<string, string> = {
  left: "items-start",
  center: "items-center",
  right: "items-end",
  LEFT: "items-start",
  CENTER: "items-center",
  RIGHT: "items-end",
};

/** Height presets */
export const HEIGHT_MAP: Record<string, string> = {
  small: "min-h-[300px]",
  medium: "min-h-[500px]",
  large: "min-h-[700px]",
  full: "min-h-screen",
};

/** Spacer height map */
export const SPACER_HEIGHT_MAP: Record<string, string> = {
  xs: "h-2",
  sm: "h-4",
  md: "h-8",
  lg: "h-16",
  xl: "h-24",
  "2xl": "h-32",
};

/** Font size map */
export const FONT_SIZE_MAP: Record<string, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
};

/** Font weight map */
export const FONT_WEIGHT_MAP: Record<string, string> = {
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
};

/** Divider style map */
export const DIVIDER_STYLE_MAP: Record<string, string> = {
  solid: "border-solid",
  dashed: "border-dashed",
  dotted: "border-dotted",
};

/** Divider width map */
export const DIVIDER_WIDTH_MAP: Record<string, string> = {
  full: "w-full",
  medium: "w-2/3 mx-auto",
  short: "w-1/3 mx-auto",
};

/** Button variant classes */
export const BUTTON_VARIANT_MAP: Record<string, string> = {
  primary: "bg-black text-white hover:bg-gray-800",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
  outline: "border border-black text-black hover:bg-black hover:text-white",
  ghost: "text-black hover:bg-gray-100",
  link: "text-black underline hover:no-underline",
};

/** Button size classes */
export const BUTTON_SIZE_MAP: Record<string, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

/** Quote style classes */
export const QUOTE_STYLE_MAP: Record<
  string,
  { container: string; text: string; author: string }
> = {
  elegant: {
    container: "border-l-4 border-black pl-6 py-2",
    text: "text-lg md:text-xl italic text-gray-700",
    author: "mt-4 text-sm text-gray-500",
  },
  modern: {
    container: "bg-gray-50 p-6 md:p-8 rounded-lg",
    text: "text-lg md:text-xl font-medium text-gray-800",
    author: "mt-4 text-sm text-gray-600",
  },
  minimal: {
    container: "",
    text: "text-lg md:text-2xl text-gray-600 before:content-['\"'] after:content-['\"'] before:text-3xl after:text-3xl before:text-gray-300 after:text-gray-300",
    author: "mt-4 text-sm text-gray-500",
  },
};
