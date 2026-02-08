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

  return (
    <ContentWrapper
      {...wrapperProps}
      className={`flex items-start gap-4 group ${variantClasses[variant] || variantClasses.default} ${link ? "cursor-pointer" : ""}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={link ? { scale: 1.01 } : undefined}
    >
      <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors">
        {isValidIcon(icon) ? (
          <LucideIcon name={icon} className="w-5 h-5 text-amber-600" />
        ) : IconComponent ? (
          <IconComponent className="w-5 h-5 text-amber-600" />
        ) : null}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-neutral-900 mb-1" data-field="title">{title}</h3>
        {mainContent && (
          <p className="text-neutral-600 whitespace-pre-line" data-field="content">{mainContent}</p>
        )}
        {secondaryContent &&
          (secondaryLink ? (
            <a
              href={secondaryLink}
              className="text-amber-700 hover:text-amber-900 transition-colors block mt-1"
            >
              {secondaryContent}
            </a>
          ) : (
            <p className="text-neutral-500 text-sm mt-1">{secondaryContent}</p>
          ))}
        {linkLabel && (
          <span className="text-amber-700 font-medium text-sm mt-2 inline-flex items-center gap-1">
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
}

export function HoursTableBlock({ content }: BlockContentProps<HoursTableBlockContent>) {
  const title = content.title;
  const hours = content.hours || {};
  const showIcon = content.showIcon !== false;
  const highlightToday = content.highlightToday !== false;

  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long" });
  const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1);

  if (Object.keys(hours).length === 0) return null;

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-neutral-100"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {title && (
        <div className="flex items-center gap-3 mb-4">
          {showIcon && (
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
          )}
          <h3 className="font-semibold text-neutral-900" data-field="title">{title}</h3>
        </div>
      )}
      <div className={`space-y-2 ${title ? "" : "pt-0"}`}>
        {Object.entries(hours).map(([day, hoursValue]) => {
          const isToday = highlightToday && day.toLowerCase() === todayCapitalized.toLowerCase();
          return (
            <div
              key={day}
              className={`flex justify-between py-2 px-3 rounded-lg transition-colors ${
                isToday
                  ? "bg-amber-50 border border-amber-200"
                  : "border-b border-neutral-100 last:border-0"
              }`}
            >
              <span className={`${isToday ? "font-semibold text-amber-800" : "text-neutral-600"}`}>
                {day}
                {isToday && <span className="ml-2 text-xs text-amber-600">(Aujourd'hui)</span>}
              </span>
              <span className={`font-medium ${isToday ? "text-amber-900" : "text-neutral-900"}`}>
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
  services?: string[];
  columns?: number;
  variant?: "bullets" | "checks" | "cards" | "badges";
  iconColor?: string;
}

export function ServicesListBlock({ content }: BlockContentProps<ServicesListBlockContent>) {
  const title = content.title;
  const subtitle = content.subtitle;
  const services = content.services || [];
  const columns = content.columns || 2;
  const variant = content.variant || "bullets";
  const iconColor = content.iconColor || "amber";

  if (services.length === 0) return null;

  const gridCols: Record<number, string> = {
    1: "grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
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
      icon: <Check className="w-4 h-4 text-green-600 shrink-0" />,
    },
    cards: {
      container: "",
      item: "bg-white rounded-xl p-4 shadow-sm border border-neutral-100 hover:shadow-md hover:border-amber-200 transition-all group",
      icon: <Star className="w-4 h-4 text-amber-500 shrink-0" />,
    },
    badges: {
      container: "flex flex-wrap gap-2",
      item: "inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-amber-100 rounded-full transition-colors group",
      icon: <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />,
    },
  };

  const styles = variantStyles[variant] || variantStyles.bullets;

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {title && (
        <h3 className="text-xl font-bold mb-2 text-neutral-900 flex items-center" data-field="title">
          <span className="w-1.5 h-5 bg-amber-500 rounded-full mr-3"></span>
          {title}
        </h3>
      )}
      {subtitle && <p className="text-neutral-600 mb-4 ml-5" data-field="subtitle">{subtitle}</p>}
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
            <span className="font-medium text-neutral-800 group-hover:text-amber-800 transition-colors">
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
}

export function ReviewBadgeBlock({ content }: BlockContentProps<ReviewBadgeBlockContent>) {
  const title = content.title;
  const rating = content.rating || 0;
  const reviewCount = content.reviewCount || 0;
  const source = content.source;
  const sourceUrl = content.sourceUrl;
  const showStars = content.showStars !== false;
  const variant = content.variant || "default";

  const variantClasses = {
    default: "bg-white rounded-2xl shadow-lg p-6 border border-neutral-100",
    compact: "bg-white rounded-xl p-4 border border-neutral-100 flex items-center gap-4",
    detailed: "bg-linear-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100",
  };

  const SourceWrapper = sourceUrl ? "a" : "span";
  const sourceProps = sourceUrl
    ? { href: sourceUrl, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <motion.div
      className={variantClasses[variant] || variantClasses.default}
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
                  className={`w-5 h-5 ${i < Math.floor(rating) ? "text-amber-500 fill-amber-500" : "text-neutral-200"}`}
                />
              ))}
            </div>
          )}
          <div>
            <span className="text-xl font-bold text-neutral-900">{rating}</span>
            <span className="text-neutral-400">/5</span>
            <span className="text-sm text-neutral-500 ml-2">({reviewCount} avis)</span>
          </div>
        </>
      ) : (
        <>
          {title && (
            <h3 className="text-lg font-bold mb-4 text-neutral-900 flex items-center gap-2" data-field="title">
              <Star className="w-5 h-5 text-amber-500" />
              {title}
            </h3>
          )}
          <div className="text-center py-2">
            {showStars && (
              <div className="flex items-center justify-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${i < Math.floor(rating) ? "text-amber-500 fill-amber-500" : "text-neutral-200"}`}
                  />
                ))}
              </div>
            )}
            <div className="text-3xl font-bold text-neutral-900 mb-1">
              {rating}
              <span className="text-lg text-neutral-400">/5</span>
            </div>
            <p className="text-sm text-neutral-600 mb-3">{reviewCount} avis vérifiés</p>
            {source && (
              <SourceWrapper
                {...sourceProps}
                className="text-amber-700 hover:text-amber-900 font-medium text-sm underline-offset-4 hover:underline transition-all cursor-pointer"
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
  variant?: "default" | "compact" | "map-only";
}

export function LocationCardBlock({ content }: BlockContentProps<LocationCardBlockContent>) {
  const title = content.title;
  const address = content.address;
  const mapUrl = content.mapUrl;
  const embedUrl = content.embedUrl;
  const showPreview = content.showPreview !== false;
  const variant = content.variant || "default";

  const variantClasses = {
    default: "bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral-100",
    compact: "bg-white rounded-xl p-4 border border-neutral-100",
    "map-only": "rounded-2xl overflow-hidden shadow-lg",
  };

  return (
    <motion.div
      className={variantClasses[variant] || variantClasses.default}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {variant !== "map-only" && (
        <div className={`${variant === "compact" ? "" : "p-6"}`}>
          {title && (
            <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2 mb-3" data-field="title">
              <MapPin className="w-5 h-5 text-amber-500" />
              {title}
            </h3>
          )}
          {variant === "compact" && address && (
            <p className="text-neutral-600 text-sm mb-2" data-field="address">{address}</p>
          )}
          {variant === "compact" && mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-700 hover:text-amber-900 text-sm font-medium inline-flex items-center gap-1"
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
              <MapPin className="w-12 h-12 text-amber-500/50 mb-4" />
              {address && (
                <p className="text-neutral-600 text-center text-sm mb-4 whitespace-pre-line" data-field="address">
                  {address}
                </p>
              )}
              {mapUrl && (
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors flex items-center gap-2"
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
}

export function IconFeatureBlock({ content }: BlockContentProps<IconFeatureBlockContent>) {
  const icon = content.icon || "star";
  const title = content.title;
  const description = content.description;
  const link = content.link;
  const variant = content.variant || "default";
  const iconBackground = content.iconBackground !== false;
  const iconColor = content.iconColor || "amber";

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

  return (
    <Wrapper
      {...wrapperProps}
      className={`group ${variantClasses[variant] || variantClasses.default} ${link ? "cursor-pointer" : ""}`}
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
        <h4 className="font-bold text-neutral-900 mb-1 group-hover:text-amber-800 transition-colors" data-field="title">
          {title}
        </h4>
        {description && (
          <p className="text-sm text-neutral-600" data-field="description">{description}</p>
        )}
        {link && (
          <span className="text-amber-700 text-sm font-medium inline-flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
