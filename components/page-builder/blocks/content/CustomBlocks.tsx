"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, User, Star, Check, Send, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePageBuilder } from "@/components/page-builder/PageBuilderContext";
import { BlockContentProps, ChildElementStyles, getChildElementInlineStyles, COLUMNS_MAP } from "../types";

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
  style?: "grid" | "minimal" | "overlay" | "compact";
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
    none: "gap-0", sm: "gap-2", md: "gap-4 md:gap-6", lg: "gap-6 md:gap-8", xl: "gap-8 md:gap-12",
  };

  const imageSizeMap: Record<string, string> = {
    xs: "w-16 h-16", sm: "w-20 h-20", md: "w-24 h-24", lg: "w-32 h-32", xl: "w-40 h-40", "2xl": "w-48 h-48",
  };

  const shapeMap: Record<string, string> = {
    rounded: "rounded-lg", circle: "rounded-full", square: "rounded-none",
  };

  const hoverMap: Record<string, string> = {
    none: "", zoom: "hover:scale-105", lift: "hover:-translate-y-2", glow: "hover:shadow-lg", fade: "hover:opacity-80",
  };

  const columnsClass = COLUMNS_MAP[columns] || COLUMNS_MAP[3];

  // Minimal style
  if (style === "minimal") {
    return (
      <div className={`grid ${columnsClass} ${gapMap[gap]}`}>
        {members.map((member, index) => (
          <div key={index} data-item-index={index} data-child-type="member" className="text-center">
            {member.image && (
              <div className={`${imageSizeMap[imageSize]} mx-auto mb-3 ${shapeMap[imageShape]} overflow-hidden`}>
                <img src={member.image} alt={member.name} className={`w-full h-full object-cover ${hoverMap[hoverEffect]}`} />
              </div>
            )}
            <h3 className="font-semibold" data-field="name">{member.name}</h3>
            <p className="text-sm opacity-70" data-field="role" style={{ color: accentColor }}>{member.role}</p>
          </div>
        ))}
      </div>
    );
  }

  // Overlay style
  if (style === "overlay") {
    return (
      <div className={`grid ${columnsClass} ${gapMap[gap]}`}>
        {members.map((member, index) => (
          <div key={index} data-item-index={index} data-child-type="member" className={`relative aspect-3/4 overflow-hidden ${shapeMap[imageShape]} group`}>
            {member.image && <img src={member.image} alt={member.name} className="w-full h-full object-cover" />}
            <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(to top, ${accentColor}ee, transparent)` }}>
              <h3 className="text-xl font-semibold text-white" data-field="name">{member.name}</h3>
              <p className="text-sm text-white/80" data-field="role">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default grid style
  return (
    <div className={`grid ${columnsClass} ${gapMap[gap]}`}>
      {members.map((member, index) => (
        <div key={index} data-item-index={index} data-child-type="member" className={`bg-white/5 ${shapeMap[imageShape]} overflow-hidden group ${hoverMap[hoverEffect]}`}>
          {member.image && (
            <div className="aspect-4/5 overflow-hidden">
              <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          )}
          <div className="p-6">
            <h3 className="text-xl font-semibold" data-field="name">{member.name}</h3>
            <p className="text-sm mb-3" data-field="role" style={{ color: accentColor }}>{member.role}</p>
            {showBio && member.bio && <p className="text-sm opacity-70 mb-4 whitespace-pre-line" data-field="bio">{member.bio}</p>}
            {showSocial && member.social && (
              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    {member.social.email && <span className="opacity-50 cursor-not-allowed" style={{ color: accentColor }}><Mail className="w-5 h-5" /></span>}
                    {member.social.linkedin && <span className="opacity-50 cursor-not-allowed" style={{ color: accentColor }}><User className="w-5 h-5" /></span>}
                  </>
                ) : (
                  <>
                    {member.social.email && <a href={`mailto:${member.social.email}`} className="opacity-50 hover:opacity-100" style={{ color: accentColor }}><Mail className="w-5 h-5" /></a>}
                    {member.social.linkedin && <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100" style={{ color: accentColor }}><User className="w-5 h-5" /></a>}
                  </>
                )}
              </div>
            )}
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
  style?: string;
  showRating?: boolean;
  showImage?: boolean;
  showQuoteIcon?: boolean;
  accentColor?: string;
  cardBackground?: string;
  animation?: string;
}

export function TestimonialsBlock({ content }: BlockContentProps<TestimonialsContent>) {
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
    none: "gap-0", sm: "gap-2", md: "gap-4 md:gap-6", lg: "gap-6 md:gap-8",
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-white/20"}`} />
      ))}
    </div>
  );

  const columnsClass = COLUMNS_MAP[columns] || COLUMNS_MAP[2];

  return (
    <div className={`grid ${columnsClass} ${gapMap[gap]}`}>
      {testimonials.map((testimonial, index) => (
        <div
          key={index}
          data-item-index={index}
          data-child-type="testimonial"
          className="p-6 rounded-lg"
          style={{ backgroundColor: cardBackground || "rgba(255,255,255,0.05)" }}
        >
          {showQuoteIcon && (
            <div className="mb-4" style={{ color: accentColor }}>
              <svg className="w-8 h-8 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
            </div>
          )}
          {showRating && testimonial.rating && <div className="mb-4">{renderStars(testimonial.rating)}</div>}
          <blockquote className="text-lg mb-4 whitespace-pre-line" data-field="quote">"{testimonial.text}"</blockquote>
          <div className="flex items-center gap-3">
            {showImage && testimonial.image && (
              <div className="w-12 h-12 rounded-full overflow-hidden" style={{ boxShadow: `0 0 0 2px ${accentColor}` }}>
                <img src={testimonial.image} alt={testimonial.author} className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <div className="font-semibold" data-field="author">{testimonial.author}</div>
              {(testimonial.role || testimonial.company) && (
                <div className="text-sm opacity-70">
                  {testimonial.role}{testimonial.role && testimonial.company && " · "}{testimonial.company}
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
  style?: string;
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
  const gap = content.gap || "md";
  const accentColor = content.accentColor || "#D4A574";
  const showBadge = content.showBadge !== false;
  const showPeriod = content.showPeriod !== false;

  const gapMap: Record<string, string> = {
    sm: "gap-4", md: "gap-6", lg: "gap-8",
  };

  const columnsClass = COLUMNS_MAP[columns] || COLUMNS_MAP[3];

  return (
    <div className={`grid ${columnsClass} ${gapMap[gap]}`}>
      {plans.map((plan, index) => (
        <div
          key={index}
          data-item-index={index}
          data-child-type="plan"
          className={`relative p-6 rounded-xl ${plan.highlighted ? "scale-105 shadow-2xl z-10" : ""}`}
          style={{ backgroundColor: plan.highlighted ? accentColor : "rgba(255,255,255,0.05)" }}
        >
          {showBadge && plan.highlighted && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-bold rounded-full bg-white text-black">
              Populaire
            </span>
          )}
          <h3 className="text-xl font-bold mb-2" data-field="name">{plan.name}</h3>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-4xl font-bold" data-field="price">{plan.price}</span>
            {showPeriod && plan.period && <span className="opacity-70">/{plan.period}</span>}
          </div>
          {plan.description && <p className="opacity-70 mb-6">{plan.description}</p>}
          <ul className="space-y-3 mb-6">
            {plan.features.map((feature, fIdx) => (
              <li key={fIdx} className="flex items-center gap-2">
                <Check className="w-5 h-5" style={{ color: plan.highlighted ? "white" : accentColor }} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          {plan.buttonUrl && (
            isEditing ? (
              <span
                className={`block text-center py-3 rounded-lg font-medium transition-colors opacity-70 cursor-not-allowed ${plan.highlighted ? "bg-white text-black" : "border border-white/20"}`}
              >
                {plan.buttonText || "Choisir"}
              </span>
            ) : (
              <Link
                href={plan.buttonUrl}
                className={`block text-center py-3 rounded-lg font-medium transition-colors ${plan.highlighted ? "bg-white text-black hover:bg-white/90" : "border border-white/20 hover:bg-white/10"}`}
              >
                {plan.buttonText || "Choisir"}
              </Link>
            )
          )}
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
}

interface FAQContent {
  questions?: FAQItem[];
  layout?: "accordion" | "cards" | "two-column";
  style?: string;
  allowMultiple?: boolean;
  showIcon?: boolean;
  accentColor?: string;
  questionBackground?: string;
}

export function FAQBlock({ content }: BlockContentProps<FAQContent>) {
  const { isEditing } = usePageBuilder();
  const questions = content.questions || [];
  const layout = content.layout || "accordion";
  const style = content.style || "default";
  const allowMultiple = content.allowMultiple;
  const showIcon = content.showIcon !== false;
  const accentColor = content.accentColor || "#D4A574";

  const [openIndices, setOpenIndices] = useState<Set<number>>(() => new Set([0]));

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

  // Cards layout
  if (layout === "cards") {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
        {questions.map((item, index) => {
          const isOpen = openIndices.has(index);
          return (
            <div key={index} data-item-index={index} data-child-type="faq" className="bg-white/5 rounded-lg overflow-hidden">
              <button onClick={isEditing ? undefined : () => toggleQuestion(index)} className={`w-full flex items-center justify-between p-4 text-left ${isEditing ? 'cursor-default' : 'hover:bg-white/5'}`}>
                <span className="font-medium" style={isOpen ? { color: accentColor } : undefined}>{item.question}</span>
                {showIcon && <ChevronDown className={`w-5 h-5 ${isOpen ? "rotate-180" : ""}`} style={{ color: accentColor }} />}
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                    <p className="px-4 pb-4 opacity-70 whitespace-pre-line" data-field="answer">{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    );
  }

  // Default accordion layout
  return (
    <div className={`${layout === "two-column" ? "grid grid-cols-1 md:grid-cols-2 gap-x-12" : ""} divide-y divide-white/10`}>
      {questions.map((item, index) => {
        const isOpen = openIndices.has(index);
        return (
          <div key={index} data-item-index={index} data-child-type="faq">
            <button onClick={isEditing ? undefined : () => toggleQuestion(index)} className={`w-full flex items-center justify-between py-4 text-left ${isEditing ? 'cursor-default' : 'hover:opacity-80'}`}>
              <span className="font-medium pr-4">{item.question}</span>
              {showIcon && <ChevronDown className={`w-5 h-5 ${isOpen ? "rotate-180" : ""}`} style={{ color: accentColor }} />}
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <p className="pb-4 opacity-70 whitespace-pre-line" data-field="answer">{item.answer}</p>
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
  style?: string;
  accentColor?: string;
  backgroundColor?: string;
  buttonColor?: string;
  borderRadius?: string;
  inputStyle?: string;
}

export function ContactFormBlock({ content }: BlockContentProps<ContactFormContent>) {
  const title = content.title;
  const description = content.description;
  const fields = content.fields || [];
  const submitText = content.submitText || "Envoyer";
  const accentColor = content.accentColor || "#D4A574";
  const backgroundColor = content.backgroundColor;
  const buttonColor = content.buttonColor || "#ffffff";
  const borderRadius = content.borderRadius || "lg";
  const inputStyle = content.inputStyle || "default";
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const radiusClasses: Record<string, string> = {
    none: "rounded-none", sm: "rounded-sm", md: "rounded-md", lg: "rounded-lg", xl: "rounded-xl", full: "rounded-full",
  };
  const radiusClass = radiusClasses[borderRadius] || radiusClasses.lg;

  const getInputClasses = () => {
    switch (inputStyle) {
      case "underline": return `w-full px-2 py-3 bg-transparent border-b-2 border-white/20 focus:border-opacity-100 focus:outline-none`;
      case "filled": return `w-full px-4 py-3 bg-white/10 border-0 ${radiusClass} focus:bg-white/15 focus:outline-none`;
      default: return `w-full px-4 py-3 bg-white/5 border border-white/10 ${radiusClass} focus:border-white/30 focus:outline-none`;
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center p-8 rounded-lg" style={{ backgroundColor: backgroundColor || "rgba(255,255,255,0.05)" }}>
        <Check className="w-12 h-12 mx-auto mb-4" style={{ color: accentColor }} />
        <h3 className="text-xl font-semibold mb-2">Message envoyé !</h3>
        <p className="opacity-70">{content.successMessage || "Nous vous répondrons dès que possible."}</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor, padding: backgroundColor ? "2rem" : undefined, borderRadius: backgroundColor ? "1rem" : undefined }}>
      {(title || description) && (
        <div className="mb-6">
          {title && <h3 className="text-2xl font-semibold mb-2">{title}</h3>}
          {description && <p className="opacity-70">{description}</p>}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field, index) => (
          <div key={index}>
            <label className="block text-sm font-medium mb-1">
              {field.label}
              {field.required && <span style={{ color: accentColor }} className="ml-1">*</span>}
            </label>
            {field.type === "textarea" ? (
              <textarea name={field.name} placeholder={field.placeholder} required={field.required} rows={4} className={getInputClasses()} />
            ) : field.type === "select" ? (
              <select name={field.name} required={field.required} className={getInputClasses()}>
                <option value="">{field.placeholder || "Sélectionner..."}</option>
                {field.options?.map((option, i) => <option key={i} value={option}>{option}</option>)}
              </select>
            ) : (
              <input type={field.type} name={field.name} placeholder={field.placeholder} required={field.required} className={getInputClasses()} />
            )}
          </div>
        ))}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-6 py-3 font-medium ${radiusClass} hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2`}
          style={{ backgroundColor: buttonColor, color: buttonColor === "#ffffff" ? "#000" : "#fff" }}
        >
          {isSubmitting ? <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" /> : <><Send className="w-4 h-4" />{submitText}</>}
        </button>
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
  style?: string;
  layout?: "inline" | "stacked" | "minimal";
  accentColor?: string;
  backgroundColor?: string;
  buttonColor?: string;
  borderRadius?: string;
  inputStyle?: string;
}

export function NewsletterBlock({ content }: BlockContentProps<NewsletterContent>) {
  const title = content.title;
  const description = content.description;
  const placeholder = content.placeholder || "Votre email";
  const buttonText = content.buttonText || "S'inscrire";
  const layout = content.layout || "inline";
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
    none: "rounded-none", sm: "rounded-sm", md: "rounded-md", lg: "rounded-lg", xl: "rounded-xl", full: "rounded-full",
  };
  const radiusClass = radiusClasses[borderRadius] || radiusClasses.lg;

  if (isSubmitted) {
    return (
      <div className="text-center p-6 rounded-lg" style={{ backgroundColor: backgroundColor || "rgba(255,255,255,0.05)" }}>
        <Check className="w-10 h-10 mx-auto mb-3" style={{ color: accentColor }} />
        <p className="font-medium">Merci pour votre inscription !</p>
      </div>
    );
  }

  const inputClasses = `flex-1 px-4 py-3 bg-white/5 border border-white/10 ${radiusClass} focus:border-white/30 focus:outline-none`;

  return (
    <div className={layout !== "minimal" ? "text-center" : ""} style={{ backgroundColor, padding: backgroundColor ? "2rem" : undefined, borderRadius: backgroundColor ? "1rem" : undefined }}>
      {title && <h3 className="text-2xl font-semibold mb-2">{title}</h3>}
      {description && <p className="opacity-70 mb-6">{description}</p>}
      <form onSubmit={handleSubmit} className={`flex ${layout === "stacked" ? "flex-col" : "flex-col sm:flex-row"} gap-3 max-w-md mx-auto`}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={placeholder} required className={inputClasses} />
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-3 font-medium ${radiusClass} hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap`}
          style={{ backgroundColor: buttonColor, color: buttonColor === "#ffffff" ? "#000" : "#fff" }}
        >
          {isSubmitting ? <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" /> : <><Mail className="w-4 h-4" />{buttonText}</>}
        </button>
      </form>
    </div>
  );
}
