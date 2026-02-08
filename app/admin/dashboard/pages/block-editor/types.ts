"use client";

import { PageBlock, BlockStyles } from "@/types/page-builder";

// Common editor props
export interface BlockEditorProps {
  block: PageBlock;
  onUpdate: (updates: Partial<PageBlock>) => void;
  onClose: () => void;
  onLiveStylePreview?: (width?: string, height?: string) => void;
}

export interface ContentEditorProps {
  block: PageBlock;
  updateContent: (key: string, value: unknown) => void;
}

export interface StyleEditorProps {
  styles: BlockStyles;
  updateStyles: (keyOrUpdates: string | Partial<BlockStyles>, value?: unknown) => void;
  onLiveStylePreview?: (width?: string, height?: string) => void;
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

// Column Item for COLUMNS block
export interface ColumnItem {
  width?: number; // Percentage
  content?: string;
}

// Service Item for SERVICES_LIST block
export interface ServiceItem {
  text: string;
}

// Hours Entry for HOURS_TABLE block
export interface HoursEntry {
  day: string;
  hours: string;
}

// CTA Button for CTA_CARD block
export interface CtaButton {
  label: string;
  url: string;
  icon?: string;
  newTab?: boolean;
}

// ============================================
// CENTRALIZED OPTIONS - Avoid duplication
// ============================================

// Button variants
export interface OptionItem {
  value: string;
  label: string;
}

export const BUTTON_VARIANTS: OptionItem[] = [
  { value: "primary", label: "Principal" },
  { value: "secondary", label: "Secondaire" },
  { value: "outline", label: "Contour" },
  { value: "ghost", label: "Fantôme" },
];

// Column count options
export const COLUMN_OPTIONS: OptionItem[] = [
  { value: "1", label: "1 colonne" },
  { value: "2", label: "2 colonnes" },
  { value: "3", label: "3 colonnes" },
  { value: "4", label: "4 colonnes" },
  { value: "5", label: "5 colonnes" },
  { value: "6", label: "6 colonnes" },
];

// Text alignment options
export const TEXT_ALIGN_OPTIONS: OptionItem[] = [
  { value: "left", label: "Gauche" },
  { value: "center", label: "Centre" },
  { value: "right", label: "Droite" },
];

// Icon options for various blocks - now using Lucide icon names
// These are kept for backward compatibility, but IconPicker should be preferred
export const ICON_OPTIONS: OptionItem[] = [
  { value: "", label: "Aucune" },
  { value: "Info", label: "Info" },
  { value: "AlertTriangle", label: "Avertissement" },
  { value: "CheckCircle", label: "Succès" },
  { value: "XCircle", label: "Erreur" },
  { value: "Lightbulb", label: "Astuce" },
  { value: "FileText", label: "Note" },
  { value: "Quote", label: "Citation" },
  { value: "Star", label: "Étoile" },
  { value: "Heart", label: "Cœur" },
  { value: "Phone", label: "Téléphone" },
  { value: "Mail", label: "Email" },
  { value: "MapPin", label: "Localisation" },
  { value: "Clock", label: "Horloge" },
  { value: "Calendar", label: "Calendrier" },
  { value: "User", label: "Utilisateur" },
  { value: "Settings", label: "Paramètres" },
  { value: "Search", label: "Recherche" },
  { value: "Eye", label: "Œil" },
  { value: "Glasses", label: "Lunettes" },
  { value: "Sun", label: "Soleil" },
  { value: "Moon", label: "Lune" },
  { value: "Gift", label: "Cadeau" },
  { value: "ShoppingCart", label: "Panier" },
  { value: "CreditCard", label: "Carte" },
  { value: "Truck", label: "Livraison" },
  { value: "Home", label: "Maison" },
  { value: "Building2", label: "Bâtiment" },
  { value: "Award", label: "Récompense" },
  { value: "Sparkles", label: "Étoiles" },
];

// Target options for links
export const LINK_TARGET_OPTIONS: OptionItem[] = [
  { value: "_self", label: "Même onglet" },
  { value: "_blank", label: "Nouvel onglet" },
];

// Size options (generic)
export const SIZE_OPTIONS: OptionItem[] = [
  { value: "sm", label: "Petit" },
  { value: "md", label: "Moyen" },
  { value: "lg", label: "Grand" },
  { value: "xl", label: "Très grand" },
];

// Heading levels
export const HEADING_LEVELS: OptionItem[] = [
  { value: "h1", label: "H1 - Titre principal" },
  { value: "h2", label: "H2 - Sous-titre" },
  { value: "h3", label: "H3 - Section" },
  { value: "h4", label: "H4 - Sous-section" },
  { value: "h5", label: "H5 - Petit titre" },
  { value: "h6", label: "H6 - Très petit titre" },
];

// List styles
export const LIST_STYLE_OPTIONS: OptionItem[] = [
  { value: "disc", label: "• Puces" },
  { value: "decimal", label: "1. Numéros" },
  { value: "check", label: "✓ Coches" },
  { value: "arrow", label: "→ Flèches" },
  { value: "none", label: "Sans style" },
];

// Social platforms
export const SOCIAL_PLATFORMS: OptionItem[] = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "Twitter/X" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
];

// Info box types
export const INFO_BOX_TYPES: OptionItem[] = [
  { value: "info", label: "ℹ️ Information" },
  { value: "success", label: "✅ Succès" },
  { value: "warning", label: "⚠️ Avertissement" },
  { value: "error", label: "❌ Erreur" },
  { value: "tip", label: "💡 Astuce" },
];

// Form field types
export const FORM_FIELD_TYPES: OptionItem[] = [
  { value: "text", label: "Texte" },
  { value: "email", label: "Email" },
  { value: "tel", label: "Téléphone" },
  { value: "textarea", label: "Zone de texte" },
  { value: "select", label: "Liste déroulante" },
  { value: "checkbox", label: "Case à cocher" },
  { value: "radio", label: "Bouton radio" },
];

// Gap options for grids/lists
export const GAP_OPTIONS: OptionItem[] = [
  { value: "none", label: "Aucun" },
  { value: "sm", label: "Petit (8px)" },
  { value: "md", label: "Moyen (16px)" },
  { value: "lg", label: "Grand (24px)" },
  { value: "xl", label: "Très grand (32px)" },
];

// Card style options
export const CARD_STYLE_OPTIONS: OptionItem[] = [
  { value: "default", label: "Par défaut" },
  { value: "bordered", label: "Avec bordure" },
  { value: "elevated", label: "Avec ombre" },
  { value: "glass", label: "Effet verre" },
  { value: "minimal", label: "Minimaliste" },
];

// Border radius options for content elements
export const RADIUS_OPTIONS: OptionItem[] = [
  { value: "none", label: "Aucun" },
  { value: "sm", label: "Léger" },
  { value: "md", label: "Moyen" },
  { value: "lg", label: "Grand" },
  { value: "xl", label: "Très grand" },
  { value: "full", label: "Arrondi" },
];

// Hero layout variants
export const HERO_LAYOUT_OPTIONS: OptionItem[] = [
  { value: "centered", label: "Centré" },
  { value: "left", label: "Aligné à gauche" },
  { value: "right", label: "Aligné à droite" },
  { value: "split", label: "Divisé (texte + image)" },
  { value: "overlay", label: "Superposé" },
];

// Hero style variants
export const HERO_STYLE_OPTIONS: OptionItem[] = [
  { value: "default", label: "Classique" },
  { value: "gradient", label: "Dégradé" },
  { value: "minimal", label: "Minimaliste" },
  { value: "bold", label: "Audacieux" },
  { value: "elegant", label: "Élégant" },
];

// Stats layout options
export const STATS_LAYOUT_OPTIONS: OptionItem[] = [
  { value: "horizontal", label: "Horizontal" },
  { value: "vertical", label: "Vertical" },
  { value: "cards", label: "En cartes" },
  { value: "inline", label: "En ligne" },
];

// Quote style options
export const QUOTE_STYLE_OPTIONS: OptionItem[] = [
  { value: "default", label: "Classique" },
  { value: "large", label: "Grande citation" },
  { value: "boxed", label: "Encadré" },
  { value: "accent", label: "Avec accent" },
  { value: "minimal", label: "Minimaliste" },
];

// Divider style options
export const DIVIDER_STYLE_OPTIONS: OptionItem[] = [
  { value: "solid", label: "Ligne pleine" },
  { value: "dashed", label: "Tirets" },
  { value: "dotted", label: "Points" },
  { value: "gradient", label: "Dégradé" },
  { value: "double", label: "Double ligne" },
  { value: "decorative", label: "Décoratif" },
];

// Testimonial style options
export const TESTIMONIAL_STYLE_OPTIONS: OptionItem[] = [
  { value: "card", label: "Carte" },
  { value: "bubble", label: "Bulle" },
  { value: "minimal", label: "Minimaliste" },
  { value: "elegant", label: "Élégant" },
  { value: "quote", label: "Citation" },
];

// CTA style options
export const CTA_STYLE_OPTIONS: OptionItem[] = [
  { value: "default", label: "Classique" },
  { value: "gradient", label: "Dégradé" },
  { value: "outlined", label: "Contour" },
  { value: "filled", label: "Rempli" },
  { value: "floating", label: "Flottant" },
];

// Image aspect ratio options
export const ASPECT_RATIO_OPTIONS: OptionItem[] = [
  { value: "auto", label: "Auto" },
  { value: "square", label: "Carré (1:1)" },
  { value: "video", label: "Vidéo (16:9)" },
  { value: "portrait", label: "Portrait (3:4)" },
  { value: "landscape", label: "Paysage (4:3)" },
  { value: "wide", label: "Large (21:9)" },
];

// FAQ style options
export const FAQ_STYLE_OPTIONS: OptionItem[] = [
  { value: "accordion", label: "Accordéon classique" },
  { value: "minimal", label: "Minimaliste" },
  { value: "bordered", label: "Avec bordures" },
  { value: "cards", label: "En cartes" },
  { value: "numbered", label: "Numéroté" },
];

// Pricing style options
export const PRICING_STYLE_OPTIONS: OptionItem[] = [
  { value: "default", label: "Classique" },
  { value: "gradient", label: "Avec dégradé" },
  { value: "bordered", label: "Avec bordures" },
  { value: "elevated", label: "Avec ombre" },
  { value: "compact", label: "Compact" },
];

// Team style options
export const TEAM_STYLE_OPTIONS: OptionItem[] = [
  { value: "grid", label: "Grille" },
  { value: "cards", label: "Cartes" },
  { value: "circular", label: "Photos rondes" },
  { value: "minimal", label: "Minimaliste" },
  { value: "detailed", label: "Détaillé" },
];

// Gallery style options
export const GALLERY_STYLE_OPTIONS: OptionItem[] = [
  { value: "grid", label: "Grille" },
  { value: "masonry", label: "Masonry" },
  { value: "carousel", label: "Carrousel" },
  { value: "lightbox", label: "Lightbox" },
  { value: "polaroid", label: "Polaroid" },
];

// Feature style options
export const FEATURE_STYLE_OPTIONS: OptionItem[] = [
  { value: "icon-top", label: "Icône en haut" },
  { value: "icon-left", label: "Icône à gauche" },
  { value: "cards", label: "En cartes" },
  { value: "minimal", label: "Minimaliste" },
  { value: "bordered", label: "Avec bordures" },
];

// Newsletter style options
export const NEWSLETTER_STYLE_OPTIONS: OptionItem[] = [
  { value: "default", label: "Classique" },
  { value: "minimal", label: "Minimaliste" },
  { value: "boxed", label: "Encadré" },
  { value: "gradient", label: "Avec dégradé" },
  { value: "floating", label: "Flottant" },
];

// Contact form style options
export const FORM_STYLE_OPTIONS: OptionItem[] = [
  { value: "default", label: "Classique" },
  { value: "minimal", label: "Minimaliste" },
  { value: "bordered", label: "Avec bordures" },
  { value: "floating-labels", label: "Labels flottants" },
  { value: "modern", label: "Moderne" },
];

// Timeline style options
export const TIMELINE_STYLE_OPTIONS: OptionItem[] = [
  { value: "vertical", label: "Vertical" },
  { value: "horizontal", label: "Horizontal" },
  { value: "alternating", label: "Alterné" },
  { value: "minimal", label: "Minimaliste" },
  { value: "cards", label: "Avec cartes" },
];

// Tabs style options
export const TABS_STYLE_OPTIONS: OptionItem[] = [
  { value: "default", label: "Classique" },
  { value: "pills", label: "Pilules" },
  { value: "underline", label: "Souligné" },
  { value: "boxed", label: "Encadré" },
  { value: "vertical", label: "Vertical" },
];

// Table style options
export const TABLE_STYLE_OPTIONS: OptionItem[] = [
  { value: "default", label: "Classique" },
  { value: "striped", label: "Rayé" },
  { value: "bordered", label: "Avec bordures" },
  { value: "minimal", label: "Minimaliste" },
  { value: "modern", label: "Moderne" },
];

// Animation options
export const ANIMATION_OPTIONS: OptionItem[] = [
  { value: "none", label: "Aucune" },
  { value: "fade", label: "Fondu" },
  { value: "slide-up", label: "Glisser vers le haut" },
  { value: "slide-left", label: "Glisser à gauche" },
  { value: "scale", label: "Échelle" },
  { value: "bounce", label: "Rebond" },
];

// Hover effect options
export const HOVER_EFFECT_OPTIONS: OptionItem[] = [
  { value: "none", label: "Aucun" },
  { value: "lift", label: "Élévation" },
  { value: "glow", label: "Lueur" },
  { value: "zoom", label: "Zoom" },
  { value: "border", label: "Bordure" },
  { value: "shadow", label: "Ombre" },
];
