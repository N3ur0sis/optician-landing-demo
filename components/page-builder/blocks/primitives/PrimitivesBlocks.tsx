"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar,
  User,
  Star,
  Check,
  ExternalLink,
  LucideIcon as LucideIconType,
} from "lucide-react";
import type { BlockContentProps } from "../types";
import { LucideIcon, isValidIcon } from "../types";

// ============================================
// ICON MAP (Legacy fallback)
// ============================================

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  "map-pin": MapPin,
  phone: Phone,
  mail: Mail,
  clock: Clock,
  calendar: Calendar,
  user: User,
  star: Star,
  info: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  check: Check,
  "external-link": ExternalLink,
  "arrow-right": (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
  ),
};

// ============================================
// INFO BOX BLOCK
// ============================================

interface InfoBoxBlockContent {
  icon?: string;
  title?: string;
  content?: string;
  link?: string;
  linkLabel?: string;
  secondaryContent?: string;
  secondaryLink?: string;
  variant?: "default" | "compact" | "card";
  iconColor?: string;
  backgroundColor?: string;
  textColor?: string;
}

export function InfoBoxBlock({ content }: BlockContentProps<InfoBoxBlockContent>) {
  const icon = content.icon || "info";
  const title = content.title;
  const mainContent = content.content;
  const link = content.link;
  const linkLabel = content.linkLabel;
  const secondaryContent = content.secondaryContent;
  const secondaryLink = content.secondaryLink;
  const variant = content.variant || "default";
  const iconColor = content.iconColor || "amber";
  const backgroundColor = content.backgroundColor;
  const textColor = content.textColor;

  // Color map for icon colors
  const colorMap: Record<string, { bg: string; text: string }> = {
    amber: { bg: "#fef3c7", text: "#d97706" },
    blue: { bg: "#dbeafe", text: "#2563eb" },
    green: { bg: "#dcfce7", text: "#16a34a" },
    red: { bg: "#fee2e2", text: "#dc2626" },
    purple: { bg: "#f3e8ff", text: "#9333ea" },
    pink: { bg: "#fce7f3", text: "#db2777" },
    indigo: { bg: "#e0e7ff", text: "#4f46e5" },
    gray: { bg: "#f3f4f6", text: "#4b5563" },
  };
  const colors = colorMap[iconColor] || colorMap.amber;

  // Use LucideIcon if valid, otherwise fallback to legacy iconMap
  const IconComponent = isValidIcon(icon) ? null : (iconMap[icon] || iconMap["info"]);

  const variantClasses = {
    default: "bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-neutral-100",
    compact: "p-3",
    card: "bg-white rounded-2xl shadow-lg p-6 border border-neutral-100 hover:shadow-xl transition-shadow duration-300",
  };

  const ContentWrapper = link ? motion.a : motion.div;
  const wrapperProps = link
    ? {
        href: link,
        target: link.startsWith("http") ? "_blank" : undefined,
        rel: link.startsWith("http") ? "noopener noreferrer" : undefined,
      }
    : {};

  const wrapperStyle: React.CSSProperties = {};
  if (backgroundColor) wrapperStyle.backgroundColor = backgroundColor;
  if (textColor) wrapperStyle.color = textColor;

  return (
    <ContentWrapper
      {...wrapperProps}
      className={`flex items-start gap-4 group ${variantClasses[variant] || variantClasses.default} ${link ? "cursor-pointer" : ""}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={link ? { scale: 1.01 } : undefined}
      style={wrapperStyle}
    >
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors"
        style={{ backgroundColor: colors.bg }}
      >
        {isValidIcon(icon) ? (
          <LucideIcon name={icon} className="w-5 h-5" style={{ color: colors.text }} />
        ) : IconComponent ? (
          <IconComponent className="w-5 h-5" style={{ color: colors.text }} />
        ) : null}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold mb-1" style={{ color: textColor || "#171717" }} data-field="title">{title}</h3>
        {mainContent && (
          <p className="whitespace-pre-line" style={{ color: textColor ? `${textColor}cc` : "#525252" }} data-field="content">{mainContent}</p>
        )}
        {secondaryContent &&
          (secondaryLink ? (
            <a
              href={secondaryLink}
              className="block mt-1 transition-colors"
              style={{ color: colors.text }}
            >
              {secondaryContent}
            </a>
          ) : (
            <p className="text-sm mt-1" style={{ color: textColor ? `${textColor}99` : "#737373" }}>{secondaryContent}</p>
          ))}
        {linkLabel && (
          <span className="font-medium text-sm mt-2 inline-flex items-center gap-1" style={{ color: colors.text }}>
            {linkLabel}
            <ExternalLink className="w-3 h-3" />
          </span>
        )}
      </div>
    </ContentWrapper>
  );
}

// ============================================
// HOURS TABLE BLOCK
// ============================================

interface HoursTableBlockContent {
  title?: string;
  hours?: Record<string, string>;
  showIcon?: boolean;
  highlightToday?: boolean;
  variant?: "table" | "compact" | "cards";
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
}

export function HoursTableBlock({ content }: BlockContentProps<HoursTableBlockContent>) {
  const title = content.title;
  const hours = content.hours || {};
  const showIcon = content.showIcon !== false;
  const highlightToday = content.highlightToday !== false;
  const variant = content.variant || "table";
  const accentColor = content.accentColor || "#f59e0b"; // amber-500
  const backgroundColor = content.backgroundColor;
  const textColor = content.textColor;

  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long" });
  const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1);

  if (Object.keys(hours).length === 0) return null;

  const containerStyle: React.CSSProperties = {};
  if (backgroundColor) containerStyle.backgroundColor = backgroundColor;

  // Cards variant
  if (variant === "cards") {
    return (
      <motion.div
        className="grid grid-cols-2 @sm:grid-cols-3 @lg:grid-cols-4 gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {Object.entries(hours).map(([day, hoursValue], idx) => {
          const isToday = highlightToday && day.toLowerCase() === todayCapitalized.toLowerCase();
          return (
            <div
              key={day}
              className="p-3 rounded-xl text-center transition-all hover:scale-105"
              style={{
                backgroundColor: isToday ? accentColor : (backgroundColor || "#f5f5f5"),
                color: isToday ? "#fff" : (textColor || "#171717"),
              }}
              data-item-index={idx}
              data-child-type="hour"
            >
              <span className="block text-sm font-medium opacity-80">{day}</span>
              <span className="block font-semibold mt-1">{hoursValue}</span>
              {isToday && <span className="text-xs opacity-80">Aujourd'hui</span>}
            </div>
          );
        })}
      </motion.div>
    );
  }

  // Compact variant
  if (variant === "compact") {
    return (
      <motion.div
        className="flex flex-wrap gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {Object.entries(hours).map(([day, hoursValue], idx) => {
          const isToday = highlightToday && day.toLowerCase() === todayCapitalized.toLowerCase();
          return (
            <div
              key={day}
              className="px-3 py-2 rounded-lg"
              style={{
                backgroundColor: isToday ? `${accentColor}20` : (backgroundColor || "#f5f5f5"),
                borderLeft: isToday ? `3px solid ${accentColor}` : "none",
                color: textColor || "#171717",
              }}
              data-item-index={idx}
              data-child-type="hour"
            >
              <span className="text-sm font-medium">{day.slice(0, 3)}</span>
              <span className="mx-2 opacity-50">:</span>
              <span className="font-semibold">{hoursValue}</span>
            </div>
          );
        })}
      </motion.div>
    );
  }

  // Table variant (default)
  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-neutral-100"
      style={containerStyle}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {title && (
        <div className="flex items-center gap-3 mb-4">
          {showIcon && (
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accentColor}20` }}>
              <Clock className="w-5 h-5" style={{ color: accentColor }} />
            </div>
          )}
          <h3 className="font-semibold" style={{ color: textColor || "#171717" }} data-field="title">{title}</h3>
        </div>
      )}
      <div className={`space-y-2 ${title ? "" : "pt-0"}`}>
        {Object.entries(hours).map(([day, hoursValue], idx) => {
          const isToday = highlightToday && day.toLowerCase() === todayCapitalized.toLowerCase();
          return (
            <div
              key={day}
              className="flex justify-between py-2 px-3 rounded-lg transition-colors"
              style={{
                backgroundColor: isToday ? `${accentColor}15` : "transparent",
                border: isToday ? `1px solid ${accentColor}40` : "none",
                borderBottom: isToday ? undefined : "1px solid #f5f5f5",
              }}
              data-item-index={idx}
              data-child-type="hour"
            >
              <span style={{ color: isToday ? accentColor : (textColor ? `${textColor}aa` : "#525252") }}>
                {day}
                {isToday && <span className="ml-2 text-xs" style={{ color: accentColor }}>(Aujourd'hui)</span>}
              </span>
              <span className="font-medium" style={{ color: isToday ? accentColor : (textColor || "#171717") }}>
                {hoursValue}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ============================================
// SERVICES LIST BLOCK
// ============================================

interface ServicesListBlockContent {
  title?: string;
  subtitle?: string;
  services?: (string | { title?: string; name?: string; text?: string; [key: string]: unknown })[];
  columns?: number;
  variant?: "bullets" | "checks" | "cards" | "badges";
  iconColor?: string;
  backgroundColor?: string;
  textColor?: string;
  showTitle?: boolean;
}

// Helper to extract string from service item (handles both string and object formats)
function getServiceText(service: string | { title?: string; name?: string; text?: string; [key: string]: unknown }): string {
  if (typeof service === "string") return service;
  if (typeof service === "object" && service !== null) {
    // Try common text properties
    if (typeof service.title === "string") return service.title;
    if (typeof service.name === "string") return service.name;
    if (typeof service.text === "string") return service.text;
    // If object has indexed characters (from styled text), reconstruct the string
    const keys = Object.keys(service).filter(k => !isNaN(Number(k))).sort((a, b) => Number(a) - Number(b));
    if (keys.length > 0) {
      return keys.map(k => service[k]).join("");
    }
  }
  return String(service || "");
}

export function ServicesListBlock({ content }: BlockContentProps<ServicesListBlockContent>) {
  const title = content.title;
  const subtitle = content.subtitle;
  const rawServices = content.services || [];
  const services = rawServices.map(getServiceText).filter(Boolean);
  const columns = content.columns || 2;
  const variant = content.variant || "bullets";
  const iconColor = content.iconColor || "amber";
  const backgroundColor = content.backgroundColor;
  const textColor = content.textColor;
  const showTitle = content.showTitle !== false;

  if (services.length === 0) return null;

  const gridCols: Record<number, string> = {
    1: "grid-cols-1",
    2: "@sm:grid-cols-2",
    3: "@sm:grid-cols-2 @lg:grid-cols-3",
  };

  // Color map for bullet icon
  const colorMap: Record<string, string> = {
    amber: "#f59e0b", blue: "#3b82f6", green: "#22c55e", red: "#ef4444",
    purple: "#a855f7", pink: "#ec4899", indigo: "#6366f1", gray: "#6b7280",
  };
  const bulletColor = colorMap[iconColor] || colorMap.amber;

  const variantStyles = {
    bullets: {
      container: "bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-neutral-100",
      item: "flex items-center gap-3 p-3 hover:bg-neutral-50 rounded-lg transition-colors group",
      icon: <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: bulletColor }} />,
    },
    checks: {
      container: "bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-neutral-100",
      item: "flex items-center gap-3 p-3 hover:bg-green-50 rounded-lg transition-colors group",
      icon: <Check className="w-4 h-4 shrink-0" style={{ color: bulletColor }} />,
    },
    cards: {
      container: "",
      item: "bg-white rounded-xl p-4 shadow-sm border border-neutral-100 hover:shadow-md hover:border-amber-200 transition-all group",
      icon: <Star className="w-4 h-4 shrink-0" style={{ color: bulletColor }} />,
    },
    badges: {
      container: "flex flex-wrap gap-2",
      item: "inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-amber-100 rounded-full transition-colors group",
      icon: <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: bulletColor }} />,
    },
  };

  const styles = variantStyles[variant] || variantStyles.bullets;

  const containerStyle: React.CSSProperties = {};
  if (backgroundColor) containerStyle.backgroundColor = backgroundColor;
  if (textColor) containerStyle.color = textColor;

  return (
    <motion.div
      className={styles.container}
      style={containerStyle}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {showTitle && title && (
        <h3 className="text-xl font-bold mb-2 flex items-center" style={{ color: textColor || "#171717" }} data-field="title">
          <span className="w-1.5 h-5 rounded-full mr-3" style={{ backgroundColor: bulletColor }}></span>
          {title}
        </h3>
      )}
      {showTitle && subtitle && <p className="mb-4 ml-5" style={{ color: textColor ? `${textColor}cc` : "#525252" }} data-field="subtitle">{subtitle}</p>}
      <div className={`grid gap-3 ${gridCols[columns] || gridCols[2]}`}>
        {services.map((service, idx) => (
          <motion.div
            key={idx}
            className={styles.item}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.03 }}
            whileHover={{ x: variant === "badges" ? 0 : 3 }}
            data-item-index={idx}
            data-child-type="service"
          >
            {styles.icon}
            <span className="font-medium transition-colors" style={{ color: textColor || "#262626" }}>
              {service}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================
// CTA CARD BLOCK
// ============================================

interface CtaCardBlockContent {
  title?: string;
  description?: string;
  primaryButton?: {
    label: string;
    url: string;
    icon?: string;
    newTab?: boolean;
  };
  secondaryButton?: {
    label: string;
    url: string;
    icon?: string;
    newTab?: boolean;
  };
  variant?: "default" | "dark" | "gradient" | "outline";
}

export function CtaCardBlock({ content }: BlockContentProps<CtaCardBlockContent>) {
  const title = content.title;
  const description = content.description;
  const primaryButton = content.primaryButton;
  const secondaryButton = content.secondaryButton;
  const variant = content.variant || "default";

  const variantClasses = {
    default: "bg-white rounded-2xl shadow-lg p-6 border border-neutral-100",
    dark: "bg-neutral-900 rounded-2xl p-6 text-white",
    gradient: "bg-linear-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white",
    outline: "border-2 border-neutral-200 rounded-2xl p-6 hover:border-amber-300 transition-colors",
  };

  const primaryBtnClasses = {
    default: "bg-neutral-900 hover:bg-amber-700 text-white",
    dark: "bg-amber-500 hover:bg-amber-400 text-black",
    gradient: "bg-white hover:bg-neutral-100 text-amber-700",
    outline: "bg-amber-500 hover:bg-amber-600 text-white",
  };

  const secondaryBtnClasses = {
    default: "border-2 border-neutral-300 hover:border-neutral-400 text-neutral-800",
    dark: "border-2 border-white/30 hover:border-white/60 text-white",
    gradient: "border-2 border-white/50 hover:border-white text-white",
    outline: "border-2 border-neutral-300 hover:border-amber-400 text-neutral-800",
  };

  const renderIcon = (iconName?: string) => {
    if (!iconName) return null;
    if (isValidIcon(iconName)) {
      return <LucideIcon name={iconName} className="w-5 h-5" />;
    }
    const IconComp = iconMap[iconName];
    return IconComp ? <IconComp className="w-5 h-5" /> : null;
  };

  return (
    <motion.div
      className={variantClasses[variant] || variantClasses.default}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {title && (
        <h3
          data-field="title"
          className={`text-xl font-bold mb-3 flex items-center gap-2 ${
            variant === "default" || variant === "outline" ? "text-neutral-900" : ""
          }`}
        >
          <Calendar className="w-5 h-5 text-amber-500" />
          {title}
        </h3>
      )}
      {description && (
        <p
          data-field="description"
          className={`mb-4 ${variant === "default" || variant === "outline" ? "text-neutral-600" : "opacity-90"}`}
        >
          {description}
        </p>
      )}
      <div className="space-y-3">
        {primaryButton && (
          <motion.a
            href={primaryButton.url}
            target={primaryButton.newTab ? "_blank" : undefined}
            rel={primaryButton.newTab ? "noopener noreferrer" : undefined}
            data-field="buttonText"
            className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
              primaryBtnClasses[variant] || primaryBtnClasses.default
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {renderIcon(primaryButton.icon)}
            <span>{primaryButton.label}</span>
          </motion.a>
        )}
        {secondaryButton && (
          <motion.a
            href={secondaryButton.url}
            target={secondaryButton.newTab ? "_blank" : undefined}
            rel={secondaryButton.newTab ? "noopener noreferrer" : undefined}
            className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              secondaryBtnClasses[variant] || secondaryBtnClasses.default
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {renderIcon(secondaryButton.icon)}
            <span>{secondaryButton.label}</span>
          </motion.a>
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// REVIEW BADGE BLOCK
// ============================================

interface ReviewBadgeBlockContent {
  title?: string;
  rating?: number;
  reviewCount?: number;
  source?: string;
  sourceUrl?: string;
  showStars?: boolean;
  variant?: "default" | "compact" | "detailed";
  starColor?: string;
  backgroundColor?: string;
  textColor?: string;
}

export function ReviewBadgeBlock({ content }: BlockContentProps<ReviewBadgeBlockContent>) {
  const title = content.title;
  const rating = content.rating || 0;
  const reviewCount = content.reviewCount || 0;
  const source = content.source;
  const sourceUrl = content.sourceUrl;
  const showStars = content.showStars !== false;
  const variant = content.variant || "default";
  const starColor = content.starColor || "#f59e0b"; // amber-500
  const backgroundColor = content.backgroundColor;
  const textColor = content.textColor;

  const variantClasses = {
    default: "bg-white rounded-2xl shadow-lg p-6 border border-neutral-100",
    compact: "bg-white rounded-xl p-4 border border-neutral-100 flex items-center gap-4",
    detailed: "bg-linear-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100",
  };

  const SourceWrapper = sourceUrl ? "a" : "span";
  const sourceProps = sourceUrl
    ? { href: sourceUrl, target: "_blank", rel: "noopener noreferrer" }
    : {};

  const containerStyle: React.CSSProperties = {};
  if (backgroundColor) containerStyle.backgroundColor = backgroundColor;

  return (
    <motion.div
      className={variantClasses[variant] || variantClasses.default}
      style={containerStyle}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {variant === "compact" ? (
        <>
          {showStars && (
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5"
                  style={{
                    color: i < Math.floor(rating) ? starColor : "#e5e5e5",
                    fill: i < Math.floor(rating) ? starColor : "none",
                  }}
                />
              ))}
            </div>
          )}
          <div>
            <span className="text-xl font-bold" style={{ color: textColor || "#171717" }}>{rating}</span>
            <span style={{ color: textColor ? `${textColor}80` : "#a3a3a3" }}>/5</span>
            <span className="text-sm ml-2" style={{ color: textColor ? `${textColor}aa` : "#737373" }}>({reviewCount} avis)</span>
          </div>
        </>
      ) : (
        <>
          {title && (
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: textColor || "#171717" }} data-field="title">
              <Star className="w-5 h-5" style={{ color: starColor, fill: starColor }} />
              {title}
            </h3>
          )}
          <div className="text-center py-2">
            {showStars && (
              <div className="flex items-center justify-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6"
                    style={{
                      color: i < Math.floor(rating) ? starColor : "#e5e5e5",
                      fill: i < Math.floor(rating) ? starColor : "none",
                    }}
                  />
                ))}
              </div>
            )}
            <div className="text-3xl font-bold mb-1" style={{ color: textColor || "#171717" }}>
              {rating}
              <span className="text-lg" style={{ color: textColor ? `${textColor}80` : "#a3a3a3" }}>/5</span>
            </div>
            <p className="text-sm mb-3" style={{ color: textColor ? `${textColor}aa` : "#525252" }}>{reviewCount} avis vérifiés</p>
            {source && (
              <SourceWrapper
                {...sourceProps}
                className="font-medium text-sm underline-offset-4 hover:underline transition-all cursor-pointer"
                style={{ color: starColor }}
              >
                {source}
              </SourceWrapper>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}

// ============================================
// LOCATION CARD BLOCK
// ============================================

interface LocationCardBlockContent {
  title?: string;
  address?: string;
  mapUrl?: string;
  embedUrl?: string;
  showPreview?: boolean;
  showIcon?: boolean;
  variant?: "default" | "compact" | "map-only";
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
}

export function LocationCardBlock({ content }: BlockContentProps<LocationCardBlockContent>) {
  const title = content.title;
  const address = content.address;
  const mapUrl = content.mapUrl;
  const embedUrl = content.embedUrl;
  const showPreview = content.showPreview !== false;
  const showIcon = content.showIcon !== false;
  const variant = content.variant || "default";
  const accentColor = content.accentColor || "#f59e0b"; // amber-500
  const backgroundColor = content.backgroundColor;
  const textColor = content.textColor;

  const variantClasses = {
    default: "bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral-100",
    compact: "bg-white rounded-xl p-4 border border-neutral-100",
    "map-only": "rounded-2xl overflow-hidden shadow-lg",
  };

  const containerStyle: React.CSSProperties = {};
  if (backgroundColor) containerStyle.backgroundColor = backgroundColor;

  return (
    <motion.div
      className={variantClasses[variant] || variantClasses.default}
      style={containerStyle}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {variant !== "map-only" && (
        <div className={`${variant === "compact" ? "" : "p-6"}`}>
          {title && (
            <h3 className="text-lg font-bold flex items-center gap-2 mb-3" style={{ color: textColor || "#171717" }} data-field="title">
              {showIcon && <MapPin className="w-5 h-5" style={{ color: accentColor }} />}
              {title}
            </h3>
          )}
          {variant === "compact" && address && (
            <p className="text-sm mb-2" style={{ color: textColor ? `${textColor}aa` : "#525252" }} data-field="address">{address}</p>
          )}
          {variant === "compact" && mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
              style={{ color: accentColor }}
            >
              Voir sur Maps
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}
      {showPreview && variant !== "compact" && (
        <div className="aspect-16/10 bg-linear-to-br from-neutral-100 to-neutral-200 relative">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
              <MapPin className="w-12 h-12 mb-4" style={{ color: `${accentColor}80` }} />
              {address && (
                <p className="text-center text-sm mb-4 whitespace-pre-line" style={{ color: textColor ? `${textColor}aa` : "#525252" }} data-field="address">
                  {address}
                </p>
              )}
              {mapUrl && (
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                  style={{ backgroundColor: accentColor }}
                >
                  <ExternalLink className="w-4 h-4" />
                  Voir sur Google Maps
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ============================================
// ICON FEATURE BLOCK
// ============================================

interface IconFeatureBlockContent {
  icon?: string;
  title?: string;
  description?: string;
  link?: string;
  variant?: "default" | "card" | "centered" | "horizontal";
  iconBackground?: boolean;
  iconColor?: string;
  backgroundColor?: string;
  titleColor?: string;
  descriptionColor?: string;
}

export function IconFeatureBlock({ content }: BlockContentProps<IconFeatureBlockContent>) {
  const icon = content.icon || "star";
  const title = content.title;
  const description = content.description;
  const link = content.link;
  const variant = content.variant || "default";
  const iconBackground = content.iconBackground !== false;
  const iconColor = content.iconColor || "amber";
  const backgroundColor = content.backgroundColor;
  const titleColor = content.titleColor;
  const descriptionColor = content.descriptionColor;

  // Color map for icon colors
  const colorMap: Record<string, { bg: string; bgHover: string; text: string }> = {
    amber: { bg: "#fef3c7", bgHover: "#fde68a", text: "#d97706" },
    blue: { bg: "#dbeafe", bgHover: "#bfdbfe", text: "#2563eb" },
    green: { bg: "#dcfce7", bgHover: "#bbf7d0", text: "#16a34a" },
    red: { bg: "#fee2e2", bgHover: "#fecaca", text: "#dc2626" },
    purple: { bg: "#f3e8ff", bgHover: "#e9d5ff", text: "#9333ea" },
    gray: { bg: "#f3f4f6", bgHover: "#e5e7eb", text: "#4b5563" },
  };
  const colors = colorMap[iconColor] || colorMap.amber;

  // Use LucideIcon if valid, otherwise fallback to legacy iconMap
  const IconComponent = isValidIcon(icon) ? null : (iconMap[icon] || Star);

  const variantClasses = {
    default: "flex items-start gap-4",
    card: "bg-white rounded-xl p-5 shadow-sm border border-neutral-100 hover:shadow-md transition-all",
    centered: "text-center flex flex-col items-center",
    horizontal: "flex items-center gap-4 p-4 bg-neutral-50 rounded-xl hover:bg-amber-50 transition-colors",
  };

  const Wrapper = link ? motion.a : motion.div;
  const wrapperProps = link
    ? {
        href: link,
        target: link.startsWith("http") ? "_blank" : undefined,
        rel: link.startsWith("http") ? "noopener noreferrer" : undefined,
      }
    : {};

  const containerStyle: React.CSSProperties = {};
  if (backgroundColor && (variant === "card" || variant === "horizontal")) {
    containerStyle.backgroundColor = backgroundColor;
  }

  return (
    <Wrapper
      {...wrapperProps}
      className={`group ${variantClasses[variant] || variantClasses.default} ${link ? "cursor-pointer" : ""}`}
      style={containerStyle}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={link || variant === "card" ? { y: -2 } : undefined}
    >
      <div
        className={`shrink-0 ${iconBackground ? "w-12 h-12 rounded-xl flex items-center justify-center transition-colors" : ""} ${variant === "centered" ? "mb-3" : ""}`}
        style={iconBackground ? { backgroundColor: colors.bg } : undefined}
        onMouseEnter={(e) => iconBackground && (e.currentTarget.style.backgroundColor = colors.bgHover)}
        onMouseLeave={(e) => iconBackground && (e.currentTarget.style.backgroundColor = colors.bg)}
      >
        {isValidIcon(icon) ? (
          <LucideIcon name={icon} className="w-6 h-6" style={{ color: colors.text }} />
        ) : IconComponent ? (
          <IconComponent className="w-6 h-6" />
        ) : null}
      </div>
      <div className={variant === "centered" ? "" : "flex-1"}>
        <h4 className="font-bold mb-1 transition-colors" style={{ color: titleColor || "#171717" }} data-field="title">
          {title}
        </h4>
        {description && (
          <p className="text-sm" style={{ color: descriptionColor || "#525252" }} data-field="description">{description}</p>
        )}
        {link && (
          <span className="text-sm font-medium inline-flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: colors.text }}>
            En savoir plus
            <ExternalLink className="w-3 h-3" />
          </span>
        )}
      </div>
    </Wrapper>
  );
}

// Export all primitives blocks
export const PrimitivesBlocks = {
  infoBox: InfoBoxBlock,
  hoursTable: HoursTableBlock,
  servicesList: ServicesListBlock,
  ctaCard: CtaCardBlock,
  reviewBadge: ReviewBadgeBlock,
  locationCard: LocationCardBlock,
  iconFeature: IconFeatureBlock,
};

export default PrimitivesBlocks;
