"use client";

import { PageBlock, BlockStyles } from "@/types/page-builder";

// Common editor props
export interface BlockEditorProps {
  block: PageBlock;
  onUpdate: (updates: Partial<PageBlock>) => void;
  onClose: () => void;
}

export interface ContentEditorProps {
  block: PageBlock;
  updateContent: (key: string, value: unknown) => void;
}

export interface StyleEditorProps {
  styles: BlockStyles;
  updateStyles: (key: string, value: unknown) => void;
}

export interface SettingsEditorProps {
  block: PageBlock;
  onUpdate: (updates: Partial<PageBlock>) => void;
}

// Spacing
export interface SpacingValue {
  value: string;
  label: string;
  px: number;
}

// Centralized spacing options - single source of truth
// Uniform 8px steps from 0 to 192px
export const SPACING_OPTIONS: SpacingValue[] = [
  { value: "none", label: "0", px: 0 },
  { value: "xs", label: "8", px: 8 },
  { value: "sm", label: "16", px: 16 },
  { value: "md", label: "24", px: 24 },
  { value: "lg", label: "32", px: 32 },
  { value: "xl", label: "40", px: 40 },
  { value: "2xl", label: "48", px: 48 },
  { value: "3xl", label: "56", px: 56 },
  { value: "4xl", label: "64", px: 64 },
  { value: "5xl", label: "72", px: 72 },
  { value: "6xl", label: "80", px: 80 },
  { value: "7xl", label: "88", px: 88 },
  { value: "8xl", label: "96", px: 96 },
  { value: "9xl", label: "104", px: 104 },
  { value: "10xl", label: "112", px: 112 },
  { value: "11xl", label: "120", px: 120 },
  { value: "12xl", label: "128", px: 128 },
  { value: "13xl", label: "136", px: 136 },
  { value: "14xl", label: "144", px: 144 },
  { value: "15xl", label: "152", px: 152 },
  { value: "16xl", label: "160", px: 160 },
  { value: "17xl", label: "168", px: 168 },
  { value: "18xl", label: "176", px: 176 },
  { value: "19xl", label: "184", px: 184 },
  { value: "20xl", label: "192", px: 192 },
];

// Get pixel value from spacing value
export function getSpacingPx(value: string | undefined): number {
  if (!value || value === "none") return 0;
  if (value === "auto") return 0;
  if (value.includes("%")) return parseInt(value) || 0;
  const option = SPACING_OPTIONS.find((o) => o.value === value);
  return option?.px || 0;
}

// Convert spacing value to CSS - simple: px / 16 = rem
export function spacingToCss(value: string | undefined): string | undefined {
  if (!value || value === "none") return undefined;
  if (value === "auto") return "auto";
  if (value.includes("%")) return value;
  const px = getSpacingPx(value);
  return px > 0 ? `${px / 16}rem` : undefined;
}

// Get spacing value from index
export function getSpacingValueFromIndex(index: number): string | undefined {
  if (index <= 0) return undefined;
  if (index >= SPACING_OPTIONS.length)
    return SPACING_OPTIONS[SPACING_OPTIONS.length - 1].value;
  return SPACING_OPTIONS[index].value;
}

// Get index from spacing value
export function getSpacingIndexFromValue(value: string | undefined): number {
  if (!value || value === "none") return 0;
  const index = SPACING_OPTIONS.findIndex((o) => o.value === value);
  return index >= 0 ? index : 0;
}

// Item editor types
export interface StatItem {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
}

export interface CardItem {
  title: string;
  description?: string;
  image?: string;
  link?: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface GridItem {
  title: string;
  description?: string;
  image?: string;
  link?: string;
  badge?: string;
}

export interface AccordionItem {
  title: string;
  content: string;
  defaultOpen?: boolean;
}

export interface TabItem {
  label: string;
  content: string;
  icon?: string;
}

export interface TimelineItem {
  date: string;
  title: string;
  description?: string;
  image?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image?: string;
  bio?: string;
  social?: {
    instagram?: string;
    linkedin?: string;
    email?: string;
  };
}

export interface Testimonial {
  text: string;
  author: string;
  role?: string;
  company?: string;
  image?: string;
  rating?: number;
}

export interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  highlighted?: boolean;
  buttonText?: string;
  buttonUrl?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FormField {
  type: string;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export interface FeatureItem {
  icon?: string;
  title: string;
  description: string;
  link?: string;
}
