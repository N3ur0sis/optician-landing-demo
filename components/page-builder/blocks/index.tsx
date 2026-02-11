// ============================================
// Block Components Registry & Exports
// ============================================

// Export types
export * from "./types";

// Export Content Blocks
export { HeroBlock } from "./content/HeroBlock";
export { TextBlock, HeadingBlock, ParagraphBlock } from "./content/TextBlocks";
export { StatsBlock, CardsBlock, FeaturesBlock } from "./content/DataBlocks";
export {
  TeamBlock,
  TestimonialsBlock,
  PricingBlock,
  FAQBlock,
  ContactFormBlock,
  NewsletterBlock,
} from "./content/CustomBlocks";

// Export Media Blocks
export {
  ImageBlock,
  GalleryBlock,
  VideoBlock,
  FileBlock,
  IframeBlock,
} from "./media/MediaBlocks";

// Export Interactive Blocks
export {
  ButtonBlock,
  ButtonGroupBlock,
  QuoteBlock,
  ListBlock,
} from "./interactive/ButtonBlocks";
export {
  AccordionBlock,
  TabsBlock,
  TableBlock,
  TimelineBlock,
} from "./interactive/AccordionTabsBlocks";

// Export Layout Blocks
export {
  SpacerBlock,
  DividerBlock,
  ColumnsBlock,
  GridBlock,
  ContainerBlock,
} from "./layout/LayoutBlocks";

// Export Embeds Blocks
export { MapBlock, SocialBlock } from "./embeds/EmbedsBlocks";

// Export Store Blocks
export {
  StoreListBlock,
  StoreHeroBlock,
  StoreContactBlock,
  StoreServicesBlock,
  StoreCtaBlock,
  StoreReviewsBlock,
  StoreMapBlock,
  StoreLayoutBlock,
} from "./store/StoreBlocks";

// Export Primitives Blocks
export {
  InfoBoxBlock,
  HoursTableBlock,
  ServicesListBlock,
  CtaCardBlock,
  ReviewBadgeBlock,
  LocationCardBlock,
  IconFeatureBlock,
} from "./primitives/PrimitivesBlocks";

// ============================================
// Block Registry - Maps BlockType to Component
// ============================================

import type { BlockType } from "../../../types/page-builder";
import type { FC } from "react";
import type { BlockContentProps } from "./types";

// Import all blocks for registry
import { HeroBlock } from "./content/HeroBlock";
import { TextBlock, HeadingBlock, ParagraphBlock } from "./content/TextBlocks";
import { StatsBlock, CardsBlock, FeaturesBlock } from "./content/DataBlocks";
import {
  TeamBlock,
  TestimonialsBlock,
  PricingBlock,
  FAQBlock,
  ContactFormBlock,
  NewsletterBlock,
} from "./content/CustomBlocks";
import {
  ImageBlock,
  GalleryBlock,
  VideoBlock,
  FileBlock,
  IframeBlock,
} from "./media/MediaBlocks";
import {
  ButtonBlock,
  ButtonGroupBlock,
  QuoteBlock,
  ListBlock,
} from "./interactive/ButtonBlocks";
import {
  AccordionBlock,
  TabsBlock,
  TableBlock,
  TimelineBlock,
} from "./interactive/AccordionTabsBlocks";
import {
  SpacerBlock,
  DividerBlock,
  ColumnsBlock,
  GridBlock,
  ContainerBlock,
} from "./layout/LayoutBlocks";
import { MapBlock, SocialBlock } from "./embeds/EmbedsBlocks";
import {
  StoreListBlock,
  StoreHeroBlock,
  StoreContactBlock,
  StoreServicesBlock,
  StoreCtaBlock,
  StoreReviewsBlock,
  StoreMapBlock,
  StoreLayoutBlock,
} from "./store/StoreBlocks";
import {
  InfoBoxBlock,
  HoursTableBlock,
  ServicesListBlock,
  CtaCardBlock,
  ReviewBadgeBlock,
  LocationCardBlock,
  IconFeatureBlock,
} from "./primitives/PrimitivesBlocks";

// Type for block component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BlockComponent = FC<BlockContentProps<any>>;

// Block Registry - maps BlockType to React component
export const BLOCK_REGISTRY: Record<BlockType, BlockComponent> = {
  // Content Blocks
  HERO: HeroBlock,
  TEXT: TextBlock,
  HEADING: HeadingBlock,
  PARAGRAPH: ParagraphBlock,
  QUOTE: QuoteBlock,
  LIST: ListBlock,

  // Media Blocks
  IMAGE: ImageBlock,
  GALLERY: GalleryBlock,
  VIDEO: VideoBlock,
  FILE: IframeBlock, // File uses IframeBlock for preview
  IFRAME: IframeBlock,

  // Layout Blocks
  COLUMNS: ColumnsBlock,
  GRID: GridBlock,
  SPACER: SpacerBlock,
  DIVIDER: DividerBlock,
  CONTAINER: ContainerBlock,

  // Interactive Blocks
  BUTTON: ButtonBlock,
  BUTTON_GROUP: ButtonGroupBlock,
  LINK_BLOCK: ButtonBlock, // Link uses Button component
  ACCORDION: AccordionBlock,
  TABS: TabsBlock,

  // Data Display Blocks
  TABLE: TableBlock,
  STATS: StatsBlock,
  TIMELINE: TimelineBlock,
  CARDS: CardsBlock,

  // Embed Blocks
  MAP: MapBlock,
  SOCIAL: SocialBlock,

  // Custom Component Blocks
  TEAM: TeamBlock,
  TESTIMONIALS: TestimonialsBlock,
  PRICING: PricingBlock,
  FAQ: FAQBlock,
  CONTACT_FORM: ContactFormBlock,
  NEWSLETTER: NewsletterBlock,
  FEATURES: FeaturesBlock,

  // Primitive Blocks
  INFO_BOX: InfoBoxBlock,
  HOURS_TABLE: HoursTableBlock,
  SERVICES_LIST: ServicesListBlock,
  CTA_CARD: CtaCardBlock,
  REVIEW_BADGE: ReviewBadgeBlock,
  LOCATION_CARD: LocationCardBlock,
  ICON_FEATURE: IconFeatureBlock,

  // Store Blocks
  STORE_LIST: StoreListBlock,
  STORE_HERO: StoreHeroBlock,
  STORE_CONTACT: StoreContactBlock,
  STORE_SERVICES: StoreServicesBlock,
  STORE_CTA: StoreCtaBlock,
  STORE_REVIEWS: StoreReviewsBlock,
  STORE_MAP: StoreMapBlock,
  STORE_LAYOUT: StoreLayoutBlock,
};

// ============================================
// Render Block Content Function
// ============================================

/**
 * Renders a block's content based on its type
 * @param type - The BlockType
 * @param content - The block content object
 * @returns React element or null if block type not found
 */
export function renderBlockContent(
  type: BlockType,
  content: Record<string, unknown>
): React.ReactElement | null {
  const BlockComponent = BLOCK_REGISTRY[type];
  
  if (!BlockComponent) {
    console.warn(`Unknown block type: ${type}`);
    return null;
  }

  return <BlockComponent content={content} />;
}

// ============================================
// Block Categories for UI grouping
// ============================================

export const BLOCK_CATEGORIES = {
  content: ["HERO", "TEXT", "HEADING", "PARAGRAPH", "QUOTE", "LIST"] as BlockType[],
  media: ["IMAGE", "GALLERY", "VIDEO", "FILE", "IFRAME"] as BlockType[],
  layout: ["COLUMNS", "GRID", "SPACER", "DIVIDER", "CONTAINER"] as BlockType[],
  interactive: ["BUTTON", "BUTTON_GROUP", "LINK_BLOCK", "ACCORDION", "TABS"] as BlockType[],
  data: ["TABLE", "STATS", "TIMELINE", "CARDS"] as BlockType[],
  embeds: ["MAP", "SOCIAL"] as BlockType[],
  custom: ["TEAM", "TESTIMONIALS", "PRICING", "FAQ", "CONTACT_FORM", "NEWSLETTER", "FEATURES"] as BlockType[],
  primitives: ["INFO_BOX", "HOURS_TABLE", "SERVICES_LIST", "CTA_CARD", "REVIEW_BADGE", "LOCATION_CARD", "ICON_FEATURE"] as BlockType[],
  store: ["STORE_LIST", "STORE_HERO", "STORE_CONTACT", "STORE_SERVICES", "STORE_CTA", "STORE_REVIEWS", "STORE_MAP", "STORE_LAYOUT"] as BlockType[],
};

// ============================================
// Block Labels (French)
// ============================================

export const BLOCK_LABELS: Record<BlockType, string> = {
  // Content
  HERO: "Section héros",
  TEXT: "Texte riche",
  HEADING: "Titre",
  PARAGRAPH: "Paragraphe",
  QUOTE: "Citation",
  LIST: "Liste",
  
  // Media
  IMAGE: "Image",
  GALLERY: "Galerie",
  VIDEO: "Vidéo",
  FILE: "Fichier",
  IFRAME: "iFrame",
  
  // Layout
  COLUMNS: "Colonnes",
  GRID: "Grille",
  SPACER: "Espaceur",
  DIVIDER: "Séparateur",
  CONTAINER: "Conteneur",
  
  // Interactive
  BUTTON: "Bouton",
  BUTTON_GROUP: "Groupe de boutons",
  LINK_BLOCK: "Lien",
  ACCORDION: "Accordéon",
  TABS: "Onglets",
  
  // Data
  TABLE: "Tableau",
  STATS: "Statistiques",
  TIMELINE: "Chronologie",
  CARDS: "Cartes",
  
  // Embeds
  MAP: "Carte",
  SOCIAL: "Réseau social",
  
  // Custom
  TEAM: "Équipe",
  TESTIMONIALS: "Témoignages",
  PRICING: "Tarification",
  FAQ: "FAQ",
  CONTACT_FORM: "Formulaire de contact",
  NEWSLETTER: "Newsletter",
  FEATURES: "Fonctionnalités",
  
  // Primitives
  INFO_BOX: "Boîte d'info",
  HOURS_TABLE: "Horaires",
  SERVICES_LIST: "Liste de services",
  CTA_CARD: "Carte CTA",
  REVIEW_BADGE: "Badge avis",
  LOCATION_CARD: "Carte localisation",
  ICON_FEATURE: "Fonctionnalité avec icône",
  
  // Store
  STORE_LIST: "Liste des magasins",
  STORE_HERO: "Héros magasin",
  STORE_CONTACT: "Contact magasin",
  STORE_SERVICES: "Services magasin",
  STORE_CTA: "CTA magasin",
  STORE_REVIEWS: "Avis magasin",
  STORE_MAP: "Carte magasin",
  STORE_LAYOUT: "Layout magasin",
};

export default BLOCK_REGISTRY;
