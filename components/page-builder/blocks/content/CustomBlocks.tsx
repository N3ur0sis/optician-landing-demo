"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, User, Star, Check, Send, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePageBuilder } from "@/components/page-builder/PageBuilderContext";
import {
  BlockContentProps,
  ChildElementStyles,
  getChildElementInlineStyles,
  COLUMNS_MAP,
} from "../types";

// ============================================
// Team Block
// ============================================

interface TeamMember {
  name: string;
  role: string;
  image?: string;
  bio?: string;
  social?: { instagram?: string; linkedin?: string; email?: string };
  _styles?: ChildElementStyles;
}

interface TeamContent {
  members?: TeamMember[];
  columns?: number;
  style?: "grid" | "cards" | "circular" | "minimal" | "detailed";
  gap?: string;
  imageShape?: "rounded" | "circle" | "square";
  imageSize?: string;
  accentColor?: string;
  animation?: string;
  hoverEffect?: string;
  showBio?: boolean;
  showSocial?: boolean;
}

export function TeamBlock({ content }: BlockContentProps<TeamContent>) {
  const { isEditing } = usePageBuilder();
  const members = content.members || [];
  const columns = content.columns || 3;
  const style = content.style || "grid";
  const gap = content.gap || "md";
  const imageShape = content.imageShape || "rounded";
  const imageSize = content.imageSize || "md";
  const accentColor = content.accentColor || "#D4A574";
  const animation = content.animation || "none";
  const hoverEffect = content.hoverEffect || "none";
  const showBio = content.showBio !== false;
  const showSocial = content.showSocial !== false;

  const gapMap: Record<string, string> = {
    none: "gap-0",
    sm: "gap-2",
    md: "gap-4 @md:gap-6",
    lg: "gap-6 @md:gap-8",
    xl: "gap-8 @md:gap-12",
  };

  const imageSizeMap: Record<string, string> = {
    xs: "w-16 h-16",
    sm: "w-20 h-20",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-40 h-40",
    "2xl": "w-48 h-48",
  };

  const shapeMap: Record<string, string> = {
    rounded: "rounded-lg",
    circle: "rounded-full",
    square: "rounded-none",
  };

  const hoverMap: Record<string, string> = {
    none: "",
    zoom: "hover:scale-105",
    lift: "hover:-translate-y-2",
    glow: "hover:shadow-lg",
    fade: "hover:opacity-80",
  };

  const columnsClass = COLUMNS_MAP[columns] || COLUMNS_MAP[3];

  const renderSocialLinks = (member: TeamMember) => {
    if (!showSocial || !member.social) return null;
    return (
      <div className="flex gap-3">
        {isEditing ? (
          <>
            {member.social.email && (
              <span
                className="opacity-50 cursor-not-allowed"
                style={{ color: accentColor }}
              >
                <Mail className="w-5 h-5" />
              </span>
            )}
            {member.social.linkedin && (
              <span
                className="opacity-50 cursor-not-allowed"
                style={{ color: accentColor }}
              >
                <User className="w-5 h-5" />
              </span>
            )}
          </>
        ) : (
          <>
            {member.social.email && (
              <a
                href={`mailto:${member.social.email}`}
                className="opacity-50 hover:opacity-100"
                style={{ color: accentColor }}
              >
                <Mail className="w-5 h-5" />
              </a>
            )}
            {member.social.linkedin && (
              <a
                href={member.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-50 hover:opacity-100"
                style={{ color: accentColor }}
              >
                <User className="w-5 h-5" />
              </a>
            )}
          </>
        )}
      </div>
    );
  };

  // Circular style - round photos centered
  if (style === "circular") {
    return (
      <div className={`grid ${columnsClass} ${gapMap[gap]}`}>
        {members.map((member, index) => (
          <div
            key={index}
            data-item-index={index}
            data-child-type="member"
            className="text-center"
          >
            {member.image && (
              <div
                className={`w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-white/10 ${hoverMap[hoverEffect]}`}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <h3 className="font-semibold text-lg" data-field="name">
              {member.name}
            </h3>
            <p
              className="text-sm mb-2"
              data-field="role"
              style={{ color: accentColor }}
            >
              {member.role}
            </p>
            {showBio && member.bio && (
              <p
                className="text-sm opacity-70 max-w-xs mx-auto"
                data-field="bio"
              >
                {member.bio}
              </p>
            )}
            <div className="flex justify-center mt-3">
              {renderSocialLinks(member)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Cards style - elevated cards with shadow
  if (style === "cards") {
    return (
      <div className={`grid ${columnsClass} ${gapMap[gap]}`}>
        {members.map((member, index) => (
          <div
            key={index}
            data-item-index={index}
            data-child-type="member"
            className={`bg-white/5 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${hoverMap[hoverEffect] || "hover:-translate-y-1 hover:shadow-xl"}`}
          >
            {member.image && (
              <div className="aspect-square overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-5">
              <h3 className="text-lg font-semibold" data-field="name">
                {member.name}
              </h3>
              <p
                className="text-sm mb-2"
                data-field="role"
                style={{ color: accentColor }}
              >
                {member.role}
              </p>
              {showBio && member.bio && (
                <p className="text-sm opacity-70 line-clamp-3" data-field="bio">
                  {member.bio}
                </p>
              )}
              <div className="mt-3">{renderSocialLinks(member)}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Minimal style - simple text-focused
  if (style === "minimal") {
    return (
      <div className={`grid ${columnsClass} ${gapMap[gap]}`}>
        {members.map((member, index) => (
          <div
            key={index}
            data-item-index={index}
            data-child-type="member"
            className="text-center"
          >
            {member.image && (
              <div
                className={`${imageSizeMap[imageSize]} mx-auto mb-3 ${shapeMap[imageShape]} overflow-hidden`}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className={`w-full h-full object-cover ${hoverMap[hoverEffect]}`}
                />
              </div>
            )}
            <h3 className="font-semibold" data-field="name">
              {member.name}
            </h3>
            <p
              className="text-sm opacity-70"
              data-field="role"
              style={{ color: accentColor }}
            >
              {member.role}
            </p>
          </div>
        ))}
      </div>
    );
  }

  // Detailed style - full info with larger images and bio
  if (style === "detailed") {
    return (
      <div className={`grid ${columnsClass} ${gapMap[gap]}`}>
        {members.map((member, index) => (
          <div
            key={index}
            data-item-index={index}
            data-child-type="member"
            className="group"
          >
            {member.image && (
              <div className="aspect-3/4 overflow-hidden rounded-xl mb-4 relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className={`w-full h-full object-cover transition-transform duration-500 ${hoverMap[hoverEffect] || "group-hover:scale-105"}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
            <h3 className="text-xl font-semibold" data-field="name">
              {member.name}
            </h3>
            <p
              className="text-sm mb-3"
              data-field="role"
              style={{ color: accentColor }}
            >
              {member.role}
            </p>
            {showBio && member.bio && (
              <p
                className="text-sm opacity-70 mb-4 whitespace-pre-line"
                data-field="bio"
              >
                {member.bio}
              </p>
            )}
            {renderSocialLinks(member)}
          </div>
        ))}
      </div>
    );
  }

  // Default grid style
  return (
    <div className={`grid ${columnsClass} ${gapMap[gap]}`}>
      {members.map((member, index) => (
        <div
          key={index}
          data-item-index={index}
          data-child-type="member"
          className={`bg-white/5 ${shapeMap[imageShape]} overflow-hidden group ${hoverMap[hoverEffect]}`}
        >
          {member.image && (
            <div className="aspect-4/5 overflow-hidden">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
          <div className="p-6">
            <h3 className="text-xl font-semibold" data-field="name">
              {member.name}
            </h3>
            <p
              className="text-sm mb-3"
              data-field="role"
              style={{ color: accentColor }}
            >
              {member.role}
            </p>
            {showBio && member.bio && (
              <p
                className="text-sm opacity-70 mb-4 whitespace-pre-line"
                data-field="bio"
              >
                {member.bio}
              </p>
            )}
            {renderSocialLinks(member)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// Testimonials Block
// ============================================

interface Testimonial {
  text: string;
  author: string;
  role?: string;
  company?: string;
  image?: string;
  rating?: number;
  _styles?: ChildElementStyles;
}

interface TestimonialsContent {
  testimonials?: Testimonial[];
  layout?: string;
  columns?: number;
  gap?: string;
  style?: "card" | "bubble" | "minimal" | "elegant" | "quote";
  showRating?: boolean;
  showImage?: boolean;
  showQuoteIcon?: boolean;
  accentColor?: string;
  cardBackground?: string;
  animation?: string;
}

export function TestimonialsBlock({
  content,
}: BlockContentProps<TestimonialsContent>) {
  const { isEditing } = usePageBuilder();
  const testimonials = content.testimonials || [];
  const columns = content.columns || 2;
  const gap = content.gap || "md";
  const style = content.style || "card";
  const showRating = content.showRating !== false;
  const showImage = content.showImage !== false;
  const showQuoteIcon = content.showQuoteIcon !== false;
  const accentColor = content.accentColor || "#D4A574";
  const cardBackground = content.cardBackground;

  const gapMap: Record<string, string> = {
    none: "gap-0",
    sm: "gap-2",
    md: "gap-4 @md:gap-6",
    lg: "gap-6 @md:gap-8",
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-white/20"}`}
        />
      ))}
    </div>
  );

  const columnsClass = COLUMNS_MAP[columns] || COLUMNS_MAP[2];

  // Style-specific classes
  const getCardClasses = () => {
    switch (style) {
      case "bubble":
        return "relative p-6 rounded-2xl bg-white/5 before:content-[''] before:absolute before:bottom-0 before:left-8 before:translate-y-full before:border-8 before:border-transparent before:border-t-white/5";
      case "minimal":
        return "py-6 border-b border-white/10 last:border-b-0";
      case "elegant":
        return "p-8 border border-white/10 rounded-none";
      case "quote":
        return "p-6 text-center";
      default: // card
        return "p-6 rounded-lg";
    }
  };

  const getQuoteClasses = () => {
    switch (style) {
      case "elegant":
        return "text-xl @md:text-2xl italic mb-6 leading-relaxed";
      case "quote":
        return "text-xl @md:text-2xl mb-6 leading-relaxed";
      case "minimal":
        return "text-base mb-4";
      default:
        return "text-lg mb-4";
    }
  };

  return (
    <div className={`grid ${columnsClass} ${gapMap[gap]}`}>
      {testimonials.map((testimonial, index) => (
        <div
          key={index}
          data-item-index={index}
          data-child-type="testimonial"
          className={getCardClasses()}
          style={{
            backgroundColor:
              style !== "minimal" && style !== "quote"
                ? cardBackground || "rgba(255,255,255,0.05)"
                : undefined,
          }}
        >
          {/* Quote icon - different positioning for quote style */}
          {showQuoteIcon && style === "quote" && (
            <div
              className="mb-6 flex justify-center"
              style={{ color: accentColor }}
            >
              <svg
                className="w-16 h-16 opacity-30"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
          )}
          {showQuoteIcon && style !== "quote" && (
            <div className="mb-4" style={{ color: accentColor }}>
              <svg
                className="w-8 h-8 opacity-50"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
          )}
          {showRating && testimonial.rating && (
            <div
              className={`mb-4 ${style === "quote" ? "flex justify-center" : ""}`}
            >
              {renderStars(testimonial.rating)}
            </div>
          )}
          <blockquote
            className={`${getQuoteClasses()} whitespace-pre-line`}
            data-field="text"
          >
            {style === "elegant"
              ? `"${testimonial.text}"`
              : `"${testimonial.text}"`}
          </blockquote>
          <div
            className={`flex items-center gap-3 ${style === "quote" ? "justify-center" : ""}`}
          >
            {showImage && testimonial.image && (
              <div
                className={`overflow-hidden ${style === "elegant" ? "w-14 h-14" : "w-12 h-12"} rounded-full`}
                style={{
                  boxShadow:
                    style !== "minimal"
                      ? `0 0 0 2px ${accentColor}`
                      : undefined,
                }}
              >
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div
              className={
                style === "quote" && !testimonial.image ? "text-center" : ""
              }
            >
              <div
                className={`font-semibold ${style === "elegant" ? "text-lg" : ""}`}
                data-field="author"
              >
                {testimonial.author}
              </div>
              {(testimonial.role || testimonial.company) && (
                <div className="text-sm opacity-70">
                  {testimonial.role && (
                    <span data-field="role">{testimonial.role}</span>
                  )}
                  {testimonial.role && testimonial.company && " · "}
                  {testimonial.company && (
                    <span data-field="company">{testimonial.company}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// Pricing Block
// ============================================

interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  highlighted?: boolean;
  buttonText?: string;
  buttonUrl?: string;
  _styles?: ChildElementStyles;
}

interface PricingContent {
  plans?: PricingPlan[];
  columns?: number;
  style?: "default" | "gradient" | "bordered" | "elevated" | "compact";
  gap?: string;
  accentColor?: string;
  cardBackground?: string;
  showBadge?: boolean;
  showPeriod?: boolean;
}

export function PricingBlock({ content }: BlockContentProps<PricingContent>) {
  const { isEditing } = usePageBuilder();
  const plans = content.plans || [];
  const columns = content.columns || 3;
  const style = content.style || "default";
  const gap = content.gap || "md";
  const accentColor = content.accentColor || "#D4A574";
  const showBadge = content.showBadge !== false;
  const showPeriod = content.showPeriod !== false;

  const gapMap: Record<string, string> = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
  };

  const columnsClass = COLUMNS_MAP[columns] || COLUMNS_MAP[3];

  // Style-specific classes
  const getCardClasses = (isHighlighted: boolean) => {
    const baseClasses = `relative ${style === "compact" ? "p-4" : "p-6"}`;
    switch (style) {
      case "gradient":
        return `${baseClasses} rounded-xl ${isHighlighted ? "scale-105 shadow-2xl z-10" : ""}`;
      case "bordered":
        return `${baseClasses} rounded-xl border-2 ${isHighlighted ? "scale-105 shadow-2xl z-10 border-transparent" : "border-white/20"}`;
      case "elevated":
        return `${baseClasses} rounded-xl shadow-xl ${isHighlighted ? "scale-105 shadow-2xl z-10" : "hover:shadow-2xl transition-shadow"}`;
      case "compact":
        return `${baseClasses} rounded-lg ${isHighlighted ? "scale-105 shadow-xl z-10" : ""}`;
      default:
        return `${baseClasses} rounded-xl ${isHighlighted ? "scale-105 shadow-2xl z-10" : ""}`;
    }
  };

  const getCardStyle = (isHighlighted: boolean): React.CSSProperties => {
    if (style === "gradient" && isHighlighted) {
      return {
        background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`,
      };
    }
    if (isHighlighted) {
      return { backgroundColor: accentColor };
    }
    return { backgroundColor: "rgba(255,255,255,0.05)" };
  };

  return (
    <div className={`grid ${columnsClass} ${gapMap[gap]}`}>
      {plans.map((plan, index) => (
        <div
          key={index}
          data-item-index={index}
          data-child-type="plan"
          className={getCardClasses(plan.highlighted || false)}
          style={getCardStyle(plan.highlighted || false)}
        >
          {showBadge && plan.highlighted && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-bold rounded-full bg-white text-black">
              Populaire
            </span>
          )}
          <h3
            className={`font-bold mb-2 ${style === "compact" ? "text-lg" : "text-xl"}`}
            data-field="name"
          >
            {plan.name}
          </h3>
          <div className="flex items-baseline gap-1 mb-4">
            <span
              className={`font-bold ${style === "compact" ? "text-3xl" : "text-4xl"}`}
              data-field="price"
            >
              {plan.price}
            </span>
            {showPeriod && plan.period && (
              <span className="opacity-70" data-field="period">
                /{plan.period}
              </span>
            )}
          </div>
          {plan.description && (
            <p className="opacity-70 mb-6" data-field="description">
              {plan.description}
            </p>
          )}
          <ul className={`space-y-3 ${style === "compact" ? "mb-4" : "mb-6"}`}>
            {plan.features.map((feature, fIdx) => (
              <li
                key={fIdx}
                className="flex items-center gap-2"
                data-item-index={fIdx}
                data-child-type="feature"
              >
                <Check
                  className={`${style === "compact" ? "w-4 h-4" : "w-5 h-5"}`}
                  style={{ color: plan.highlighted ? "white" : accentColor }}
                />
                <span
                  data-field="feature"
                  className={style === "compact" ? "text-sm" : ""}
                >
                  {feature}
                </span>
              </li>
            ))}
          </ul>
          {plan.buttonUrl &&
            (isEditing ? (
              <span
                className={`block text-center py-3 rounded-lg font-medium transition-colors opacity-70 cursor-not-allowed ${plan.highlighted ? "bg-white text-black" : "border border-white/20"}`}
                data-field="buttonText"
              >
                {plan.buttonText || "Choisir"}
              </span>
            ) : (
              <Link
                href={plan.buttonUrl}
                className={`block text-center py-3 rounded-lg font-medium transition-colors ${plan.highlighted ? "bg-white text-black hover:bg-white/90" : "border border-white/20 hover:bg-white/10"}`}
                data-field="buttonText"
              >
                {plan.buttonText || "Choisir"}
              </Link>
            ))}
        </div>
      ))}
    </div>
  );
}

// ============================================
// FAQ Block
// ============================================

interface FAQItem {
  question: string;
  answer: string;
  _styles?: ChildElementStyles;
}

interface FAQContent {
  questions?: FAQItem[];
  layout?: "accordion" | "cards" | "two-column";
  style?: "accordion" | "minimal" | "bordered" | "cards" | "numbered";
  allowMultiple?: boolean;
  showIcon?: boolean;
  accentColor?: string;
  questionBackground?: string;
}

export function FAQBlock({ content }: BlockContentProps<FAQContent>) {
  const { isEditing } = usePageBuilder();
  const questions = content.questions || [];
  const layout = content.layout || "accordion";
  const style = content.style || "accordion";
  const allowMultiple = content.allowMultiple;
  const showIcon = content.showIcon !== false;
  const accentColor = content.accentColor || "#D4A574";

  const [openIndices, setOpenIndices] = useState<Set<number>>(
    () => new Set([0]),
  );

  const toggleQuestion = (index: number) => {
    setOpenIndices((prev) => {
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

  // Style classes based on style variant
  const getContainerClasses = () => {
    switch (style) {
      case "cards":
        return "grid grid-cols-1 @md:grid-cols-2 gap-4";
      case "bordered":
        return "space-y-3";
      case "minimal":
        return "space-y-2";
      case "numbered":
        return "space-y-4";
      default: // accordion
        return `${layout === "two-column" ? "grid grid-cols-1 @md:grid-cols-2 gap-x-12" : ""} divide-y divide-white/10`;
    }
  };

  const getItemClasses = (isOpen: boolean) => {
    switch (style) {
      case "cards":
        return "bg-white/5 rounded-lg overflow-hidden";
      case "bordered":
        return `border border-white/20 rounded-lg overflow-hidden ${isOpen ? "border-opacity-50" : ""}`;
      case "minimal":
        return "py-2";
      case "numbered":
        return "flex gap-4";
      default:
        return "";
    }
  };

  const getButtonClasses = () => {
    switch (style) {
      case "cards":
      case "bordered":
        return `w-full flex items-center justify-between p-4 text-left ${isEditing ? "cursor-default" : "hover:bg-white/5"}`;
      case "minimal":
        return `w-full flex items-center justify-between py-2 text-left ${isEditing ? "cursor-default" : "hover:opacity-80"}`;
      case "numbered":
        return `flex-1 flex items-center justify-between py-3 text-left ${isEditing ? "cursor-default" : "hover:opacity-80"}`;
      default:
        return `w-full flex items-center justify-between py-4 text-left ${isEditing ? "cursor-default" : "hover:opacity-80"}`;
    }
  };

  const getAnswerClasses = () => {
    switch (style) {
      case "cards":
      case "bordered":
        return "px-4 pb-4 opacity-70 whitespace-pre-line";
      case "numbered":
        return "pl-12 pb-4 opacity-70 whitespace-pre-line";
      default:
        return "pb-4 opacity-70 whitespace-pre-line";
    }
  };

  return (
    <div className={getContainerClasses()}>
      {questions.map((item, index) => {
        const isOpen = openIndices.has(index);
        const childStyles = getChildElementInlineStyles(item._styles);
        return (
          <div
            key={index}
            data-item-index={index}
            data-child-type="faq"
            className={getItemClasses(isOpen)}
            style={childStyles}
          >
            {style === "numbered" && (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                style={{ backgroundColor: accentColor, color: "#fff" }}
              >
                {index + 1}
              </div>
            )}
            <div className={style === "numbered" ? "flex-1" : "w-full"}>
              <button
                onClick={isEditing ? undefined : () => toggleQuestion(index)}
                className={getButtonClasses()}
              >
                <span
                  className="font-medium pr-4"
                  data-field="question"
                  style={isOpen ? { color: accentColor } : undefined}
                >
                  {item.question}
                </span>
                {showIcon && (
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    style={{ color: accentColor }}
                  />
                )}
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className={getAnswerClasses()} data-field="answer">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// Contact Form Block
// ============================================

interface FormField {
  type: string;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

interface ContactFormContent {
  title?: string;
  description?: string;
  fields?: FormField[];
  submitText?: string;
  successMessage?: string;
  style?: "default" | "minimal" | "bordered" | "floating-labels" | "modern";
  layout?: "stacked" | "inline" | "two-column";
  accentColor?: string;
  backgroundColor?: string;
  buttonColor?: string;
  borderRadius?: string;
  inputStyle?: string;
}

export function ContactFormBlock({
  content,
}: BlockContentProps<ContactFormContent>) {
  const title = content.title;
  const description = content.description;
  const fields = content.fields || [];
  const submitText = content.submitText || "Envoyer";
  const style = content.style || "default";
  const layout = content.layout || "stacked";
  const accentColor = content.accentColor || "#D4A574";
  const backgroundColor = content.backgroundColor;
  const buttonColor = content.buttonColor || "#ffffff";
  const borderRadius = content.borderRadius || "lg";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const radiusClasses: Record<string, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };
  const radiusClass = radiusClasses[borderRadius] || radiusClasses.lg;

  const getContainerClasses = () => {
    switch (style) {
      case "minimal":
        return "";
      case "bordered":
        return "p-6 border-2 border-white/20 rounded-xl";
      case "modern":
        return "p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10";
      case "floating-labels":
        return "";
      default:
        return "";
    }
  };

  const getContainerStyle = (): React.CSSProperties => {
    if (backgroundColor) {
      return {
        backgroundColor,
        padding: "2rem",
        borderRadius: "1rem",
      };
    }
    return {};
  };

  const getInputClasses = (fieldName?: string) => {
    const baseClasses = "w-full focus:outline-none transition-all duration-200";

    switch (style) {
      case "minimal":
        return `${baseClasses} px-0 py-3 bg-transparent border-b border-white/20 focus:border-white/50`;
      case "bordered":
        return `${baseClasses} px-4 py-3 bg-transparent border-2 border-white/20 ${radiusClass} focus:border-white/50`;
      case "modern":
        return `${baseClasses} px-4 py-3 bg-white/5 border-0 ${radiusClass} focus:bg-white/10 focus:ring-2 focus:ring-white/20`;
      case "floating-labels":
        const isFocused = focusedField === fieldName;
        const hasValue = fieldValues[fieldName || ""] ? true : false;
        const isActive = isFocused || hasValue;
        return `${baseClasses} px-4 pt-6 pb-2 bg-white/5 border border-white/10 ${radiusClass} ${isActive ? "border-white/30" : ""}`;
      default:
        return `${baseClasses} px-4 py-3 bg-white/5 border border-white/10 ${radiusClass} focus:border-white/30`;
    }
  };

  const getFormClasses = () => {
    switch (layout) {
      case "two-column":
        return "grid grid-cols-1 @md:grid-cols-2 gap-4";
      case "inline":
        return "flex flex-wrap gap-4";
      default:
        return "space-y-4";
    }
  };

  const getLabelClasses = (fieldName: string) => {
    if (style === "floating-labels") {
      const isFocused = focusedField === fieldName;
      const hasValue = fieldValues[fieldName] ? true : false;
      const isActive = isFocused || hasValue;
      return `absolute left-4 transition-all duration-200 pointer-events-none ${
        isActive
          ? "top-2 text-xs opacity-70"
          : "top-1/2 -translate-y-1/2 text-sm"
      }`;
    }
    return "block text-sm font-medium mb-1";
  };

  if (isSubmitted) {
    return (
      <div
        className="text-center p-8 rounded-lg"
        style={{ backgroundColor: backgroundColor || "rgba(255,255,255,0.05)" }}
      >
        <Check
          className="w-12 h-12 mx-auto mb-4"
          style={{ color: accentColor }}
        />
        <h3 className="text-xl font-semibold mb-2">Message envoyé !</h3>
        <p className="opacity-70">
          {content.successMessage || "Nous vous répondrons dès que possible."}
        </p>
      </div>
    );
  }

  const renderField = (field: FormField, index: number) => {
    const inputClasses = getInputClasses(field.name);
    const isFloating = style === "floating-labels";

    return (
      <div
        key={index}
        className={`${layout === "inline" ? "flex-1 min-w-[200px]" : ""} ${isFloating ? "relative" : ""}`}
      >
        {!isFloating && (
          <label className={getLabelClasses(field.name)}>
            {field.label}
            {field.required && (
              <span style={{ color: accentColor }} className="ml-1">
                *
              </span>
            )}
          </label>
        )}
        {field.type === "textarea" ? (
          <div className={isFloating ? "relative" : ""}>
            <textarea
              name={field.name}
              placeholder={isFloating ? "" : field.placeholder}
              required={field.required}
              rows={4}
              className={inputClasses}
              onFocus={() => setFocusedField(field.name)}
              onBlur={() => setFocusedField(null)}
              onChange={(e) =>
                setFieldValues((prev) => ({
                  ...prev,
                  [field.name]: e.target.value,
                }))
              }
            />
            {isFloating && (
              <label className={getLabelClasses(field.name)}>
                {field.label}
                {field.required && (
                  <span style={{ color: accentColor }} className="ml-1">
                    *
                  </span>
                )}
              </label>
            )}
          </div>
        ) : field.type === "select" ? (
          <select
            name={field.name}
            required={field.required}
            className={inputClasses}
          >
            <option value="">{field.placeholder || "Sélectionner..."}</option>
            {field.options?.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <div className={isFloating ? "relative" : ""}>
            <input
              type={field.type}
              name={field.name}
              placeholder={isFloating ? "" : field.placeholder}
              required={field.required}
              className={inputClasses}
              onFocus={() => setFocusedField(field.name)}
              onBlur={() => setFocusedField(null)}
              onChange={(e) =>
                setFieldValues((prev) => ({
                  ...prev,
                  [field.name]: e.target.value,
                }))
              }
            />
            {isFloating && (
              <label className={getLabelClasses(field.name)}>
                {field.label}
                {field.required && (
                  <span style={{ color: accentColor }} className="ml-1">
                    *
                  </span>
                )}
              </label>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={getContainerClasses()} style={getContainerStyle()}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-2xl font-semibold mb-2" data-field="title">
              {title}
            </h3>
          )}
          {description && (
            <p className="opacity-70" data-field="description">
              {description}
            </p>
          )}
        </div>
      )}
      <form onSubmit={handleSubmit} className={getFormClasses()}>
        {fields.map((field, index) => renderField(field, index))}
        <div className={layout === "two-column" ? "md:col-span-2" : ""}>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-6 py-3 font-medium ${radiusClass} hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all duration-200`}
            style={{
              backgroundColor: buttonColor,
              color: buttonColor === "#ffffff" ? "#000" : "#fff",
            }}
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span data-field="submitText">{submitText}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// ============================================
// Newsletter Block
// ============================================

interface NewsletterContent {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  style?: "default" | "minimal" | "boxed" | "gradient" | "floating";
  layout?: "horizontal" | "vertical" | "centered";
  accentColor?: string;
  backgroundColor?: string;
  buttonColor?: string;
  borderRadius?: string;
  inputStyle?: string;
}

export function NewsletterBlock({
  content,
}: BlockContentProps<NewsletterContent>) {
  const title = content.title;
  const description = content.description;
  const placeholder = content.placeholder || "Votre email";
  const buttonText = content.buttonText || "S'inscrire";
  const style = content.style || "default";
  const layout = content.layout || "horizontal";
  const accentColor = content.accentColor || "#D4A574";
  const backgroundColor = content.backgroundColor;
  const buttonColor = content.buttonColor || "#ffffff";
  const borderRadius = content.borderRadius || "lg";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const radiusClasses: Record<string, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };
  const radiusClass = radiusClasses[borderRadius] || radiusClasses.lg;

  const getContainerClasses = () => {
    switch (style) {
      case "minimal":
        return "";
      case "boxed":
        return "p-8 border-2 border-white/20 rounded-2xl";
      case "gradient":
        return "p-8 rounded-2xl";
      case "floating":
        return "p-8 rounded-2xl shadow-2xl backdrop-blur-lg bg-white/10";
      default:
        return "text-center";
    }
  };

  const getContainerStyle = (): React.CSSProperties => {
    if (style === "gradient") {
      return {
        background: `linear-gradient(135deg, ${accentColor}22 0%, ${accentColor}44 100%)`,
      };
    }
    if (backgroundColor) {
      return {
        backgroundColor,
        padding: "2rem",
        borderRadius: "1rem",
      };
    }
    return {};
  };

  const getInputClasses = () => {
    switch (style) {
      case "minimal":
        return `flex-1 px-4 py-3 bg-transparent border-b-2 border-white/20 focus:border-white/50 focus:outline-none`;
      case "floating":
        return `flex-1 px-4 py-3 bg-white/10 border-0 ${radiusClass} focus:bg-white/15 focus:outline-none`;
      default:
        return `flex-1 px-4 py-3 bg-white/5 border border-white/10 ${radiusClass} focus:border-white/30 focus:outline-none`;
    }
  };

  const getFormClasses = () => {
    switch (layout) {
      case "vertical":
        return "flex flex-col gap-3 max-w-md mx-auto";
      case "centered":
        return "flex flex-col gap-3 max-w-sm mx-auto text-center";
      default:
        return "flex flex-col @sm:flex-row gap-3 max-w-md mx-auto";
    }
  };

  if (isSubmitted) {
    return (
      <div
        className={`text-center p-6 ${radiusClass}`}
        style={{ backgroundColor: backgroundColor || "rgba(255,255,255,0.05)" }}
      >
        <Check
          className="w-10 h-10 mx-auto mb-3"
          style={{ color: accentColor }}
        />
        <p className="font-medium">Merci pour votre inscription !</p>
      </div>
    );
  }

  return (
    <div className={getContainerClasses()} style={getContainerStyle()}>
      {title && (
        <h3
          className={`text-2xl font-semibold mb-2 ${style === "minimal" ? "" : "text-center"}`}
          data-field="title"
        >
          {title}
        </h3>
      )}
      {description && (
        <p
          className={`opacity-70 mb-6 ${style === "minimal" ? "" : "text-center"}`}
          data-field="description"
        >
          {description}
        </p>
      )}
      <form onSubmit={handleSubmit} className={getFormClasses()}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          required
          className={getInputClasses()}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-3 font-medium ${radiusClass} hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap`}
          style={{
            backgroundColor: buttonColor,
            color: buttonColor === "#ffffff" ? "#000" : "#fff",
          }}
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          ) : (
            <>
              <Mail className="w-4 h-4" />
              <span data-field="buttonText">{buttonText}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
