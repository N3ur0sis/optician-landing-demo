"use client";

import { BlockContentProps } from "../types";

// ============================================
// Text Blocks - Basic text elements
// ============================================

interface TextContent {
  html?: string;
  text?: string;
}

interface HeadingContent {
  text?: string;
  subtitle?: string;
  level?: number | string; // 1-6 or "h1"-"h6"
}

interface ParagraphContent {
  text?: string;
}

/**
 * TextBlock - Rich HTML content block
 */
export function TextBlock({ content }: BlockContentProps<TextContent>) {
  return (
    <div
      data-field="text"
      className="prose prose-invert prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: content.html || "" }}
    />
  );
}

/**
 * HeadingBlock - Title with optional subtitle
 */
export function HeadingBlock({ content }: BlockContentProps<HeadingContent>) {
  // ContentEditor stores level as number (1-6) but old format was string ("h1"-"h6")
  const rawLevel = content.level;
  const level = typeof rawLevel === 'number' 
    ? `h${rawLevel}` 
    : (rawLevel as string) || "h2";
  const text = content.text || "";
  const subtitle = content.subtitle;

  const sizeMap: Record<string, string> = {
    h1: "text-5xl @md:text-6xl @lg:text-7xl",
    h2: "text-4xl @md:text-5xl",
    h3: "text-3xl @md:text-4xl",
    h4: "text-2xl @md:text-3xl",
    h5: "text-xl @md:text-2xl",
    h6: "text-lg @md:text-xl",
  };

  const Tag = level as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  return (
    <div>
      <Tag
        data-field="text"
        className={`font-bold tracking-tight whitespace-pre-line ${sizeMap[level]}`}
      >
        {text}
      </Tag>
      {subtitle && (
        <p data-field="subtitle" className="mt-2 text-lg opacity-70 whitespace-pre-line">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/**
 * ParagraphBlock - Simple paragraph text
 */
export function ParagraphBlock({ content }: BlockContentProps<ParagraphContent>) {
  return (
    <p data-field="text" className="text-lg leading-relaxed whitespace-pre-line">
      {content.text || ""}
    </p>
  );
}
