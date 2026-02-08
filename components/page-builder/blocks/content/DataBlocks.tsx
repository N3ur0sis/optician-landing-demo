"use client";

import Link from "next/link";
import { LucideIcon } from "@/components/ui/icon-picker";
import { usePageBuilder } from "@/components/page-builder/PageBuilderContext";
import {
  BlockContentProps,
  ChildElementStyles,
  getChildElementInlineStyles,
  COLUMNS_MAP,
  GAP_MAP,
} from "../types";

// ============================================
// Stats Block
// ============================================

interface StatItem {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
  description?: string;
  _styles?: ChildElementStyles;
}

interface StatsContent {
  stats?: StatItem[];
  columns?: number;
  gap?: string;
  style?: string;
  layout?: "horizontal" | "vertical";
  valueColor?: string;
  animate?: boolean;
}

export function StatsBlock({ content }: BlockContentProps<StatsContent>) {
  const stats = content.stats || [];
  const columns = content.columns || 4;
  const gap = content.gap || "md";
  const style = content.style || "default";
  const layout = content.layout || "horizontal";
  const valueColor = content.valueColor || "#ffffff";
  const animate = content.animate;

  const gapMap: Record<string, string> = {
    none: "gap-0",
    sm: "gap-2",
    md: "gap-4 md:gap-8",
    lg: "gap-6 md:gap-12",
    xl: "gap-8 md:gap-16",
  };

  const styleMap: Record<string, string> = {
    default: "",
    bordered: "border border-white/10 p-4 rounded-lg",
    elevated: "bg-white/5 p-4 rounded-lg shadow-lg",
    glass: "bg-white/5 backdrop-blur-sm p-4 rounded-lg",
    minimal: "",
  };

  const layoutClasses =
    layout === "vertical"
      ? "flex flex-col items-center space-y-8"
      : `grid ${COLUMNS_MAP[columns] || COLUMNS_MAP[4]} ${gapMap[gap]}`;

  return (
    <div className={layoutClasses}>
      {stats.map((stat, index) => {
        const childStyles = getChildElementInlineStyles(stat._styles);
        return (
          <div
            key={index}
            data-item-index={index}
            data-child-type="stat"
            className={`text-center ${styleMap[style]} ${animate ? "animate-fadeIn" : ""}`}
            style={{
              animationDelay: animate ? `${index * 0.1}s` : undefined,
              ...childStyles,
            }}
          >
            <div
              className="text-4xl md:text-5xl font-bold mb-2"
              data-field="value"
              style={{ color: valueColor }}
            >
              {stat.prefix}
              {stat.value}
              {stat.suffix}
            </div>
            <div
              className="text-sm opacity-70 uppercase tracking-wider"
              data-field="label"
            >
              {stat.label}
            </div>
            {stat.description && (
              <p className="text-xs opacity-50 mt-2" data-field="description">
                {stat.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// Cards Block
// ============================================

interface CardItem {
  title: string;
  description?: string;
  image?: string;
  link?: string;
  tags?: string[];
  meta?: string;
  _styles?: ChildElementStyles;
}

interface CardsContent {
  cards?: CardItem[];
  columns?: number;
  gap?: string;
  cardStyle?: string;
  cardRadius?: string;
  imageRatio?: string;
  accentColor?: string;
  hoverEffect?: string;
  showImage?: boolean;
  showDescription?: boolean;
  showLink?: boolean;
}

export function CardsBlock({ content }: BlockContentProps<CardsContent>) {
  const { isEditing } = usePageBuilder();
  const cards = content.cards || [];
  const columns = content.columns || 3;
  const gap = content.gap || "md";
  const cardStyle = content.cardStyle || "default";
  const cardRadius = content.cardRadius || "md";
  const imageRatio = content.imageRatio || "video";
  const accentColor = content.accentColor || "#D4A574";
  const hoverEffect = content.hoverEffect || "lift";
  const showImage = content.showImage !== false;
  const showDescription = content.showDescription !== false;
  const showLink = content.showLink !== false;

  const gapMap: Record<string, string> = {
    none: "gap-0",
    sm: "gap-2",
    md: "gap-4 md:gap-6",
    lg: "gap-6 md:gap-8",
    xl: "gap-8 md:gap-12",
  };

  const radiusMap: Record<string, string> = {
    none: "rounded-none",
    sm: "rounded",
    md: "rounded-lg",
    lg: "rounded-xl",
    xl: "rounded-2xl",
    full: "rounded-3xl",
  };

  const aspectMap: Record<string, string> = {
    auto: "",
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-3/4",
    landscape: "aspect-4/3",
    wide: "aspect-[16/9]",
    ultrawide: "aspect-[21/9]",
  };

  const cardStyleMap: Record<string, string> = {
    default: "bg-white/5 hover:bg-white/10",
    bordered: "border border-white/10 hover:border-white/30",
    elevated: "bg-white/5 shadow-lg hover:shadow-xl",
    glass: "bg-white/5 backdrop-blur-sm hover:bg-white/10",
    minimal: "hover:bg-white/5",
  };

  const hoverMap: Record<string, string> = {
    none: "",
    zoom: "hover:scale-[1.02]",
    lift: "hover:-translate-y-1",
    glow: "hover:shadow-lg",
    fade: "hover:opacity-90",
    rotate: "hover:rotate-1",
  };

  const columnsClass = COLUMNS_MAP[columns] || COLUMNS_MAP[3];

  return (
    <div className={`grid ${columnsClass} ${gapMap[gap]}`}>
      {cards.map((card, index) => {
        const CardWrapper = showLink && card.link ? Link : "div";
        const childStyles = getChildElementInlineStyles(card._styles);
        return (
          <CardWrapper
            key={index}
            href={card.link || "#"}
            data-item-index={index}
            data-child-type="card"
            className={`block overflow-hidden transition-all duration-300 ${cardStyleMap[cardStyle]} ${radiusMap[cardRadius]} ${hoverMap[hoverEffect]} group`}
            style={childStyles}
          >
            {showImage && card.image && (
              <div
                className={`${aspectMap[imageRatio] || "aspect-video"} overflow-hidden`}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2" data-field="title">
                {card.title}
              </h3>
              {showDescription && card.description && (
                <p className="opacity-70 line-clamp-3 whitespace-pre-line" data-field="description">
                  {card.description}
                </p>
              )}
              {card.tags && card.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {card.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 text-xs rounded"
                      style={{
                        backgroundColor: `${accentColor}22`,
                        color: accentColor,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {showLink && card.link && (
                <div
                  className="mt-4 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all"
                  style={{ color: accentColor }}
                >
                  En savoir plus
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              )}
            </div>
          </CardWrapper>
        );
      })}
    </div>
  );
}

// ============================================
// Features Block
// ============================================

interface FeatureItem {
  icon?: string;
  title: string;
  description: string;
  link?: string;
  _styles?: ChildElementStyles;
}

interface FeaturesContent {
  features?: FeatureItem[];
  columns?: number;
  layout?: "cards" | "list" | "icons";
  iconStyle?: "circle" | "square" | "none";
  accentColor?: string;
  gap?: string;
}

export function FeaturesBlock({ content }: BlockContentProps<FeaturesContent>) {
  const { isEditing } = usePageBuilder();
  const features = content.features || [];
  const columns = content.columns || 3;
  const layout = content.layout || "cards";
  const iconStyle = content.iconStyle || "circle";
  const accentColor = content.accentColor || "#D4A574";
  const gap = content.gap || "md";

  const gapMap: Record<string, string> = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
    xl: "gap-10",
  };

  const iconContainerStyles: Record<string, string> = {
    circle: "w-12 h-12 rounded-full",
    square: "w-12 h-12 rounded-lg",
    none: "",
  };

  // List layout
  if (layout === "list") {
    return (
      <div className={`space-y-6`}>
        {features.map((feature, index) => {
          const childStyles = getChildElementInlineStyles(feature._styles);
          return (
            <div
              key={index}
              data-item-index={index}
              data-child-type="feature"
              className="flex gap-4"
              style={childStyles}
            >
              {feature.icon && iconStyle !== "none" && (
                <div
                  className={`${iconContainerStyles[iconStyle]} flex items-center justify-center shrink-0`}
                  style={{ backgroundColor: `${accentColor}22` }}
                >
                  <LucideIcon
                    name={feature.icon}
                    className="w-6 h-6"
                    style={{ color: accentColor }}
                  />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg mb-1" data-field="title">
                  {feature.title}
                </h3>
                <p className="opacity-70 whitespace-pre-line" data-field="description">
                  {feature.description}
                </p>
                {feature.link && (
                  isEditing ? (
                    <span
                      className="text-sm mt-2 inline-block cursor-not-allowed opacity-70"
                      style={{ color: accentColor }}
                    >
                      En savoir plus →
                    </span>
                  ) : (
                    <Link
                      href={feature.link}
                      className="text-sm mt-2 inline-block"
                      style={{ color: accentColor }}
                    >
                      En savoir plus →
                    </Link>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Icons layout (centered)
  if (layout === "icons") {
    const columnsClass = COLUMNS_MAP[columns] || COLUMNS_MAP[4];
    return (
      <div className={`grid ${columnsClass} ${gapMap[gap]}`}>
        {features.map((feature, index) => {
          const childStyles = getChildElementInlineStyles(feature._styles);
          return (
            <div
              key={index}
              data-item-index={index}
              data-child-type="feature"
              className="text-center"
              style={childStyles}
            >
              {feature.icon && (
                <div
                  className={`${iconContainerStyles[iconStyle]} flex items-center justify-center mx-auto mb-4`}
                  style={{ backgroundColor: `${accentColor}22` }}
                >
                  <LucideIcon
                    name={feature.icon}
                    className="w-6 h-6"
                    style={{ color: accentColor }}
                  />
                </div>
              )}
              <h3 className="font-semibold text-lg mb-2" data-field="title">
                {feature.title}
              </h3>
              <p className="text-sm opacity-70 whitespace-pre-line" data-field="description">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  // Cards layout (default)
  const columnsClass = COLUMNS_MAP[columns] || COLUMNS_MAP[3];
  return (
    <div className={`grid ${columnsClass} ${gapMap[gap]}`}>
      {features.map((feature, index) => {
        const childStyles = getChildElementInlineStyles(feature._styles);
        const Wrapper = feature.link ? Link : "div";
        return (
          <Wrapper
            key={index}
            href={feature.link || "#"}
            data-item-index={index}
            data-child-type="feature"
            className="p-6 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
            style={childStyles}
          >
            {feature.icon && iconStyle !== "none" && (
              <div
                className={`${iconContainerStyles[iconStyle]} flex items-center justify-center mb-4`}
                style={{ backgroundColor: `${accentColor}22` }}
              >
                <LucideIcon
                  name={feature.icon}
                  className="w-6 h-6"
                  style={{ color: accentColor }}
                />
              </div>
            )}
            <h3 className="font-semibold text-lg mb-2" data-field="title">
              {feature.title}
            </h3>
            <p className="text-sm opacity-70" data-field="description">
              {feature.description}
            </p>
            {feature.link && (
              <span
                className="text-sm mt-4 inline-block group-hover:translate-x-1 transition-transform"
                style={{ color: accentColor }}
              >
                En savoir plus →
              </span>
            )}
          </Wrapper>
        );
      })}
    </div>
  );
}
