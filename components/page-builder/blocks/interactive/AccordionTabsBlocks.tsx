"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { usePageBuilder } from "@/components/page-builder/PageBuilderContext";
import { LucideIcon } from "@/components/ui/icon-picker";
import {
  BlockContentProps,
  ChildElementStyles,
  getChildElementInlineStyles,
} from "../types";

// ============================================
// Accordion Block
// ============================================

interface AccordionItem {
  title: string;
  content: string;
  defaultOpen?: boolean;
  _styles?: ChildElementStyles;
}

interface AccordionContent {
  items?: AccordionItem[];
  allowMultiple?: boolean;
  style?: string;
  accentColor?: string;
}

export function AccordionBlock({
  content,
}: BlockContentProps<AccordionContent>) {
  const { isEditing } = usePageBuilder();
  const items = content.items || [];
  const allowMultiple = content.allowMultiple;
  const style = content.style || "default";
  const accentColor = content.accentColor || "#D4A574";

  const [openItems, setOpenItems] = useState<Set<number>>(() => {
    const defaultOpen = new Set<number>();
    items.forEach((item, index) => {
      if (item.defaultOpen) defaultOpen.add(index);
    });
    return defaultOpen;
  });

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        if (!allowMultiple) newSet.clear();
        newSet.add(index);
      }
      return newSet;
    });
  };

  const getStyleClasses = () => {
    switch (style) {
      case "bordered":
        return "border border-white/10 rounded-lg mb-2";
      case "separated":
        return "bg-white/5 rounded-lg mb-3";
      case "minimal":
        return "";
      default:
        return "";
    }
  };

  return (
    <div className={style === "default" ? "divide-y divide-white/10" : ""}>
      {items.map((item, index) => {
        const childStyles = getChildElementInlineStyles(item._styles);
        return (
          <div
            key={index}
            data-item-index={index}
            data-child-type="accordion-item"
            className={getStyleClasses()}
            style={childStyles}
          >
            <button
              onClick={isEditing ? undefined : () => toggleItem(index)}
              className={`w-full flex items-center justify-between py-4 ${style !== "default" ? "px-4" : ""} text-left ${isEditing ? "cursor-default" : "hover:opacity-80 transition-opacity"}`}
            >
              <span
                data-field="title"
                className="font-medium"
                style={
                  openItems.has(index) ? { color: accentColor } : undefined
                }
              >
                {item.title}
              </span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${openItems.has(index) ? "rotate-180" : ""}`}
                style={
                  openItems.has(index) ? { color: accentColor } : undefined
                }
              />
            </button>
            <AnimatePresence>
              {openItems.has(index) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div
                    data-field="content"
                    className={`pb-4 ${style !== "default" ? "px-4" : ""} opacity-70`}
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// Tabs Block
// ============================================

interface TabItem {
  label: string;
  content: string;
  icon?: string;
  _styles?: ChildElementStyles;
}

interface TabsContent {
  tabs?: TabItem[];
  style?: string;
  variant?: string;
  accentColor?: string;
  tabBackground?: string;
  activeTabColor?: string;
}

export function TabsBlock({ content }: BlockContentProps<TabsContent>) {
  const { isEditing } = usePageBuilder();
  const tabs = content.tabs || [];
  const styleVariant = content.style || content.variant || "default";
  const accentColor = content.accentColor || "#D4A574";
  const tabBackground = content.tabBackground;
  const activeTabColor = content.activeTabColor;
  const [activeTab, setActiveTab] = useState(0);

  const getTabStyles = () => {
    switch (styleVariant) {
      case "pills":
        return {
          container: "bg-white/5 p-1 rounded-lg",
          tab: "py-2 px-4 rounded-md hover:bg-white/10 transition-colors",
          activeTab: { backgroundColor: accentColor, color: "#fff" },
        };
      case "underline":
        return {
          container: "",
          tab: "py-3 px-4 border-b-2 border-transparent hover:border-white/30 transition-colors",
          activeTab: {
            borderBottomColor: accentColor,
            borderBottomWidth: "2px",
          },
        };
      case "boxed":
        return {
          container: "border border-white/10 rounded-lg p-1",
          tab: "py-2 px-4 rounded-md hover:bg-white/5 transition-colors",
          activeTab: { backgroundColor: accentColor, color: "#fff" },
        };
      case "vertical":
        return {
          container: "flex-col border-r border-white/10",
          tab: "py-3 px-4 text-left border-r-2 border-transparent hover:bg-white/5 transition-colors",
          activeTab: {
            borderRightColor: accentColor,
            backgroundColor: "rgba(255,255,255,0.05)",
          },
        };
      default:
        return {
          container: "border-b border-white/10",
          tab: "py-3 px-4 border-b-2 border-transparent hover:border-white/30 transition-colors",
          activeTab: {
            borderBottomColor: accentColor,
            borderBottomWidth: "2px",
          },
        };
    }
  };

  const styles = getTabStyles();
  const isVertical = styleVariant === "vertical";

  return (
    <div className={isVertical ? "flex flex-col @md:flex-row gap-4 @md:gap-6" : ""}>
      <div
        className={`flex gap-2 ${styles.container} ${isVertical ? "w-full @md:w-48 shrink-0" : ""}`}
        style={tabBackground ? { backgroundColor: tabBackground } : undefined}
      >
        {tabs.map((tab, index) => {
          const childStyles = getChildElementInlineStyles(tab._styles);
          return (
            <button
              key={index}
              onClick={isEditing ? undefined : () => setActiveTab(index)}
              data-item-index={index}
              data-child-type="tab"
              className={`${styles.tab} flex items-center gap-2 ${isVertical ? "w-full" : ""} ${isEditing ? "cursor-default" : ""}`}
              style={{
                ...(activeTab === index
                  ? {
                      ...styles.activeTab,
                      ...(activeTabColor ? { color: activeTabColor } : {}),
                    }
                  : {}),
                ...childStyles,
              }}
            >
              {tab.icon && <LucideIcon name={tab.icon} className="w-4 h-4" />}
              <span data-field="label">{tab.label}</span>
            </button>
          );
        })}
      </div>
      <div className={isVertical ? "flex-1 py-2" : "py-6"}>
        {tabs[activeTab] && (
          <div
            data-field="content"
            data-item-index={activeTab}
            dangerouslySetInnerHTML={{ __html: tabs[activeTab].content }}
          />
        )}
      </div>
    </div>
  );
}

// ============================================
// Table Block
// ============================================

interface TableContent {
  headers?: string[];
  rows?: string[][];
  striped?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  style?: string;
  stripeColor?: string;
  headerBackground?: string;
  accentColor?: string;
}

export function TableBlock({ content }: BlockContentProps<TableContent>) {
  const headers = content.headers || [];
  const rows = content.rows || [];
  const striped = content.striped;
  const bordered = content.bordered;
  const hoverable = content.hoverable;
  const style = content.style || "default";
  const stripeColor = content.stripeColor || "rgba(255,255,255,0.05)";
  const headerBackground = content.headerBackground || "rgba(255,255,255,0.05)";
  const accentColor = content.accentColor || "#D4A574";

  const getTableClasses = () => {
    switch (style) {
      case "minimal":
        return "border-collapse";
      case "modern":
        return "border-separate border-spacing-0 rounded-lg overflow-hidden";
      case "bordered":
        return "border border-white/10";
      default:
        return bordered ? "border border-white/10" : "";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className={`w-full ${getTableClasses()}`}>
        {headers.length > 0 && (
          <thead>
            <tr style={{ backgroundColor: headerBackground }}>
              {headers.map((header, index) => (
                <th
                  key={index}
                  data-item-index={index}
                  data-child-type="header"
                  data-field="header"
                  className={`px-4 py-3 text-left font-semibold ${bordered || style === "bordered" ? "border border-white/10" : ""}`}
                  style={
                    style === "modern"
                      ? { borderBottom: `2px solid ${accentColor}` }
                      : undefined
                  }
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              data-row-index={rowIndex}
              className={hoverable ? "hover:bg-white/10 transition-colors" : ""}
              style={
                (striped || style === "striped") && rowIndex % 2 === 1
                  ? { backgroundColor: stripeColor }
                  : undefined
              }
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  data-cell-index={cellIndex}
                  data-field="cell"
                  className={`px-4 py-3 ${bordered || style === "bordered" ? "border border-white/10" : ""}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================
// Timeline Block
// ============================================

interface TimelineItem {
  date: string;
  title: string;
  description?: string;
  image?: string;
  icon?: string;
  _styles?: ChildElementStyles;
}

interface TimelineContent {
  items?: TimelineItem[];
  style?: "vertical" | "horizontal" | "alternating" | "minimal" | "cards";
  accentColor?: string;
  animation?: string;
  showDates?: boolean;
  showIcon?: boolean;
  lineColor?: string;
  dotColor?: string;
}

export function TimelineBlock({ content }: BlockContentProps<TimelineContent>) {
  const items = content.items || [];
  const style = content.style || "vertical";
  const accentColor = content.accentColor || content.dotColor || "#ffffff";
  const animation = content.animation || "none";
  const showDates = content.showDates !== false;
  const showIcon = content.showIcon !== false;
  const lineColor = content.lineColor || "rgba(255,255,255,0.2)";

  const animationClass = animation !== "none" ? "animate-fadeIn" : "";

  const getDotStyle = (): React.CSSProperties => ({
    backgroundColor: accentColor,
    boxShadow: style === "cards" ? `0 0 0 4px ${accentColor}22` : undefined,
  });

  // Horizontal layout
  if (style === "horizontal") {
    return (
      <div className="relative overflow-x-auto pb-4">
        <div
          className="absolute top-6 left-0 right-0 h-0.5"
          style={{ backgroundColor: lineColor }}
        />
        <div className="flex gap-8 min-w-max px-4">
          {items.map((item, index) => {
            const childStyles = getChildElementInlineStyles(item._styles);
            return (
              <div
                key={index}
                data-item-index={index}
                data-child-type="timeline-item"
                className={`relative flex flex-col items-center min-w-[200px] ${animationClass}`}
                style={{
                  animationDelay:
                    animation !== "none" ? `${index * 100}ms` : undefined,
                  ...childStyles,
                }}
              >
                <div
                  className="w-4 h-4 rounded-full z-10 mb-4"
                  style={getDotStyle()}
                />
                {showDates && (
                  <span className="text-sm opacity-50 mb-2" data-field="date">
                    {item.date}
                  </span>
                )}
                <h3
                  className="text-lg font-semibold text-center"
                  data-field="title"
                  style={{ color: accentColor }}
                >
                  {item.title}
                </h3>
                {item.description && (
                  <p
                    className="text-sm opacity-70 mt-2 text-center max-w-[180px]"
                    data-field="description"
                  >
                    {item.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Alternating layout
  if (style === "alternating") {
    return (
      <div className="relative">
        <div
          className="absolute left-4 @md:left-1/2 top-0 bottom-0 w-px @md:-translate-x-1/2"
          style={{ backgroundColor: lineColor }}
        />
        <div className="space-y-8 @md:space-y-12">
          {items.map((item, index) => {
            const childStyles = getChildElementInlineStyles(item._styles);
            return (
              <div
                key={index}
                data-item-index={index}
                data-child-type="timeline-item"
                className={`relative flex items-start @md:items-center gap-4 @md:gap-8 ${animationClass} flex-row ${index % 2 === 0 ? "@md:flex-row" : "@md:flex-row-reverse"}`}
                style={{
                  animationDelay:
                    animation !== "none" ? `${index * 100}ms` : undefined,
                  ...childStyles,
                }}
              >
                <div
                  className={`flex-1 text-left ${index % 2 === 0 ? "@md:text-right" : "@md:text-left"}`}
                >
                  {showDates && (
                    <span className="text-sm opacity-50" data-field="date">
                      {item.date}
                    </span>
                  )}
                  <h3
                    className="text-lg font-semibold mt-1"
                    data-field="title"
                    style={{ color: accentColor }}
                  >
                    {item.title}
                  </h3>
                  {item.description && (
                    <p
                      className="text-sm opacity-70 mt-2"
                      data-field="description"
                    >
                      {item.description}
                    </p>
                  )}
                </div>
                <div
                  className="w-4 h-4 rounded-full shrink-0 z-10"
                  style={getDotStyle()}
                >
                  {showIcon && item.icon && (
                    <span className="flex items-center justify-center w-full h-full text-xs">
                      <LucideIcon name={item.icon} className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="rounded-lg max-w-xs"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Minimal layout - simple without line or cards
  if (style === "minimal") {
    return (
      <div className="space-y-8">
        {items.map((item, index) => {
          const childStyles = getChildElementInlineStyles(item._styles);
          return (
            <div
              key={index}
              data-item-index={index}
              data-child-type="timeline-item"
              className={`flex gap-4 ${animationClass}`}
              style={{
                animationDelay:
                  animation !== "none" ? `${index * 100}ms` : undefined,
                ...childStyles,
              }}
            >
              {showDates && (
                <span
                  className="text-sm opacity-50 w-24 shrink-0"
                  data-field="date"
                >
                  {item.date}
                </span>
              )}
              <div>
                <h3 className="text-lg font-semibold" data-field="title">
                  {item.title}
                </h3>
                {item.description && (
                  <p
                    className="text-sm opacity-70 mt-1"
                    data-field="description"
                  >
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Cards layout
  if (style === "cards") {
    return (
      <div
        className="relative pl-8"
        style={{ borderLeft: `2px solid ${lineColor}` }}
      >
        <div className="space-y-8">
          {items.map((item, index) => {
            const childStyles = getChildElementInlineStyles(item._styles);
            return (
              <div
                key={index}
                data-item-index={index}
                data-child-type="timeline-item"
                className={`relative bg-white/5 p-4 rounded-lg ml-4 ${animationClass}`}
                style={{
                  animationDelay:
                    animation !== "none" ? `${index * 100}ms` : undefined,
                  ...childStyles,
                }}
              >
                <div
                  className="absolute -left-[2.6rem] top-4 w-4 h-4 rounded-full"
                  style={getDotStyle()}
                />
                {showDates && (
                  <span className="text-sm opacity-50" data-field="date">
                    {item.date}
                  </span>
                )}
                <h3
                  className="text-lg font-semibold mt-1"
                  data-field="title"
                  style={{ color: accentColor }}
                >
                  {item.title}
                </h3>
                {item.description && (
                  <p
                    className="text-sm opacity-70 mt-2"
                    data-field="description"
                  >
                    {item.description}
                  </p>
                )}
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="rounded-lg mt-4 max-w-md"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Vertical layout (default)
  return (
    <div
      className="relative pl-8"
      style={{ borderLeft: `2px solid ${lineColor}` }}
    >
      <div className="space-y-8">
        {items.map((item, index) => {
          const childStyles = getChildElementInlineStyles(item._styles);
          return (
            <div
              key={index}
              data-item-index={index}
              data-child-type="timeline-item"
              className={`relative ${animationClass}`}
              style={{
                animationDelay:
                  animation !== "none" ? `${index * 100}ms` : undefined,
                ...childStyles,
              }}
            >
              <div
                className="absolute -left-[2.6rem] top-1 w-4 h-4 rounded-full"
                style={getDotStyle()}
              />
              {showDates && (
                <span className="text-sm opacity-50" data-field="date">
                  {item.date}
                </span>
              )}
              <h3
                className="text-lg font-semibold mt-1"
                data-field="title"
                style={{ color: accentColor }}
              >
                {item.title}
              </h3>
              {item.description && (
                <p className="text-sm opacity-70 mt-2" data-field="description">
                  {item.description}
                </p>
              )}
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="rounded-lg mt-4 max-w-md"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
