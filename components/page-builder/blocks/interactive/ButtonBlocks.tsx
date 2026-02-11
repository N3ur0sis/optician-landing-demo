"use client";

import Link from "next/link";
import { usePageBuilder } from "@/components/page-builder/PageBuilderContext";
import { LucideIcon } from "@/components/ui/icon-picker";
import {
  BlockContentProps,
  ChildElementStyles,
  getChildElementInlineStyles,
} from "../types";

// ============================================
// Button Block
// ============================================

interface ButtonContent {
  text?: string;
  url?: string;
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  newTab?: boolean;
  borderRadius?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  icon?: string;
}

export function ButtonBlock({ content }: BlockContentProps<ButtonContent>) {
  const { isEditing } = usePageBuilder();
  const text = content.text || "Button";
  const url = content.url || content.href || "#";
  const variant = content.variant || "primary";
  const size = content.size || "md";
  const fullWidth = content.fullWidth;
  const newTab = content.newTab;
  const borderRadius = content.borderRadius || "md";
  const backgroundColor = content.backgroundColor;
  const textColor = content.textColor;
  const borderColor = content.borderColor;
  const icon = content.icon;

  const sizeStyles: Record<string, string> = {
    xs: "px-3 py-1.5 text-xs",
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };

  const radiusStyles: Record<string, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  // Build inline styles based on variant and custom colors
  const inlineStyles: React.CSSProperties = {};

  if (variant === "primary") {
    inlineStyles.backgroundColor = backgroundColor || "#D4A574";
    inlineStyles.color = textColor || "#ffffff";
  } else if (variant === "secondary") {
    inlineStyles.backgroundColor = backgroundColor || "rgba(255,255,255,0.1)";
    inlineStyles.color = textColor || "#ffffff";
  } else if (variant === "outline") {
    inlineStyles.backgroundColor = "transparent";
    inlineStyles.color = textColor || borderColor || "#D4A574";
    inlineStyles.border = `2px solid ${borderColor || "#D4A574"}`;
  } else if (variant === "ghost") {
    inlineStyles.backgroundColor = "transparent";
    inlineStyles.color = textColor || "#D4A574";
  }

  if (fullWidth) {
    inlineStyles.width = "100%";
    inlineStyles.display = "flex";
  }

  // Render icon element - LucideIcon handles all name formats internally
  const renderIcon = () => {
    if (!icon) return null;
    return <LucideIcon name={icon} className="w-4 h-4" />;
  };

  return isEditing ? (
    <span
      data-field="text"
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all opacity-70 cursor-not-allowed ${sizeStyles[size]} ${radiusStyles[borderRadius]}`}
      style={inlineStyles}
    >
      {renderIcon()}
      <span data-field="text">{text}</span>
    </span>
  ) : (
    <Link
      href={url}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      data-field="text"
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all hover:opacity-80 ${sizeStyles[size]} ${radiusStyles[borderRadius]}`}
      style={inlineStyles}
    >
      {renderIcon()}
      <span data-field="text">{text}</span>
    </Link>
  );
}

// ============================================
// Button Group Block
// ============================================

interface ButtonItem {
  label: string;
  href: string;
  variant?: string;
  openInNewTab?: boolean;
  _styles?: ChildElementStyles;
}

interface ButtonGroupContent {
  buttons?: ButtonItem[];
  alignment?: string;
  gap?: string;
  direction?: "horizontal" | "vertical";
  stackOnMobile?: boolean;
}

export function ButtonGroupBlock({
  content,
}: BlockContentProps<ButtonGroupContent>) {
  const { isEditing } = usePageBuilder();
  const buttons = content.buttons || [];
  const alignment = content.alignment || "center";
  const gap = content.gap || "md";
  const direction = content.direction || "horizontal";
  const stackOnMobile = content.stackOnMobile !== false;

  const gapStyles: Record<string, string> = {
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  const alignStyles: Record<string, string> = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
    "space-between": "justify-between",
  };

  const variantClasses: Record<string, string> = {
    primary: "bg-[#D4A574] text-white hover:bg-[#c69565]",
    secondary: "bg-white/10 text-white hover:bg-white/20",
    outline: "border-2 border-[#D4A574] text-[#D4A574] hover:bg-[#D4A574]/10",
    ghost: "text-[#D4A574] hover:bg-[#D4A574]/10",
  };

  return (
    <div
      className={`flex ${direction === "vertical" ? "flex-col" : stackOnMobile ? "flex-col @md:flex-row" : "flex-row"} ${gapStyles[gap]} ${alignStyles[alignment]} flex-wrap`}
    >
      {buttons.map((btn, idx) => {
        const childStyles = getChildElementInlineStyles(btn._styles);
        return isEditing ? (
          <span
            key={idx}
            data-item-index={idx}
            data-child-type="button"
            data-field="label"
            className={`inline-flex items-center justify-center gap-2 font-medium transition-all px-6 py-3 rounded-lg opacity-70 cursor-not-allowed ${variantClasses[btn.variant || "primary"] || variantClasses.primary}`}
            style={childStyles}
          >
            {btn.label}
          </span>
        ) : (
          <Link
            key={idx}
            href={btn.href || "#"}
            target={btn.openInNewTab ? "_blank" : undefined}
            rel={btn.openInNewTab ? "noopener noreferrer" : undefined}
            data-item-index={idx}
            data-child-type="button"
            data-field="label"
            className={`inline-flex items-center justify-center gap-2 font-medium transition-all px-6 py-3 rounded-lg ${variantClasses[btn.variant || "primary"] || variantClasses.primary}`}
            style={childStyles}
          >
            {btn.label}
          </Link>
        );
      })}
    </div>
  );
}

// ============================================
// Quote Block
// ============================================

interface QuoteContent {
  text?: string;
  author?: string;
  role?: string;
  style?: string;
  accentColor?: string;
}

export function QuoteBlock({ content }: BlockContentProps<QuoteContent>) {
  const style = content.style || "default";
  const accentColor = content.accentColor || "#D4A574";

  const getQuoteStyles = () => {
    switch (style) {
      case "large":
        return {
          container: "py-8",
          text: "text-2xl md:text-4xl",
          border: "border-l-8",
        };
      case "boxed":
        return {
          container: "bg-gray-100/10 p-8 rounded-xl",
          text: "text-xl md:text-2xl",
          border: "",
        };
      case "accent":
        return {
          container: "py-6",
          text: "text-xl md:text-2xl",
          border: "border-l-4",
        };
      case "minimal":
        return { container: "py-4", text: "text-lg md:text-xl", border: "" };
      default:
        return {
          container: "py-4",
          text: "text-xl md:text-2xl",
          border: "border-l-4",
        };
    }
  };

  const styles = getQuoteStyles();

  return (
    <blockquote
      className={`${styles.border} pl-6 ${styles.container}`}
      style={{ borderColor: styles.border ? accentColor : undefined }}
    >
      <p
        data-field="text"
        className={`${styles.text} italic leading-relaxed mb-4`}
      >
        "{content.text || ""}"
      </p>
      {(Boolean(content.author) || Boolean(content.role)) && (
        <footer className="text-sm opacity-70">
          {Boolean(content.author) && (
            <cite data-field="author" className="not-italic font-medium">
              {content.author}
            </cite>
          )}
          {Boolean(content.role) && (
            <span data-field="role" className="ml-2">
              — {content.role}
            </span>
          )}
        </footer>
      )}
    </blockquote>
  );
}

// ============================================
// List Block
// ============================================

interface ListContent {
  items?: string[];
  style?: "bullet" | "number" | "check" | "arrow";
  iconColor?: string;
}

export function ListBlock({ content }: BlockContentProps<ListContent>) {
  const items = content.items || [];
  const style = content.style || "bullet";
  const iconColor = content.iconColor || "#D4A574";

  const iconMap: Record<string, string> = {
    bullet: "•",
    number: "",
    check: "✓",
    arrow: "→",
  };

  if (items.length === 0) {
    return <p className="text-gray-400">No items</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li
          key={index}
          data-item-index={index}
          data-child-type="list-item"
          className="flex items-start gap-3"
        >
          <span className="flex-shrink-0 mt-1" style={{ color: iconColor }}>
            {style === "number" ? `${index + 1}.` : iconMap[style]}
          </span>
          <span data-field="text">{item}</span>
        </li>
      ))}
    </ul>
  );
}
