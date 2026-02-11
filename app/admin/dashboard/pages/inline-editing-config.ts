/**
 * Centralized configuration for inline text editing in the page builder.
 * This file defines which fields can be edited inline for each block type,
 * including simple text fields and array-based repeated elements.
 */

// ============================================================================
// SIMPLE TEXT FIELDS - Fields that can be inline-edited per block type
// ============================================================================
export const INLINE_EDITABLE_FIELDS: Record<string, string[]> = {
  // Core content blocks
  HERO: ["title", "subtitle", "buttonText", "description"],
  TEXT: ["text"],
  HEADING: ["text"],
  PARAGRAPH: ["text"],
  BUTTON: ["text"],
  QUOTE: ["text", "author", "role"],
  IMAGE: ["caption", "alt"],
  DIVIDER: [],
  SPACER: [],
  HTML: [],
  EMBED: [],

  // Media blocks
  VIDEO: ["caption", "title"],
  GALLERY: [],
  IFRAME: [],

  // Layout blocks
  COLUMNS: [],
  CONTAINER: [],
  GRID: ["title"],
  BENTO: [],

  // Content blocks
  STATS: ["title", "subtitle"],
  CARDS: ["title", "subtitle"],
  LIST: ["title"],
  ACCORDION: ["title"],
  TABS: [],
  TABLE: [],

  // Forms & CTA
  NEWSLETTER: ["title", "description", "buttonText"],
  CONTACT_FORM: ["title", "description", "submitText"],

  // Rich content
  FAQ: ["title", "subtitle"],
  TEAM: ["title", "subtitle"],
  TESTIMONIALS: ["title", "subtitle"],
  TIMELINE: ["title", "subtitle"],
  PRICING: ["title", "subtitle", "description"],
  FEATURES: ["title", "subtitle", "description"],
  SERVICES_LIST: ["title", "subtitle"],

  // Info blocks
  INFO_BOX: ["title", "content", "linkLabel"],
  HOURS_TABLE: ["title"],
  CTA_CARD: ["title", "description", "buttonText"],
  REVIEW_BADGE: ["title", "source"],
  LOCATION_CARD: ["title", "address"],
  ICON_FEATURE: ["title", "description"],

  // Links & Files
  LINK_BLOCK: ["title", "description"],
  FILE: ["name", "description"],

  // Store blocks
  STORE_HERO: ["title", "subtitle", "description"],
  STORE_CONTACT: ["title", "address", "phone", "email"],
  STORE_SERVICES: ["title"],
  STORE_CTA: ["title", "description", "buttonText"],
  STORE_REVIEWS: ["title"],
  STORE_MAP: ["title", "address"],
  STORE_LIST: ["title", "subtitle"],
  STORE_LAYOUT: ["storeName", "tagline", "description"],

  // Navigation & Menus
  NAVIGATION: [],
  FOOTER: [],

  // Maps
  MAP: ["title"],
  MAP_INTERACTIVE: ["title"],

  // Other
  LOGO: [],
  ICON: [],
  SOCIAL: [],
  SOCIAL_LINKS: [],
  BREADCRUMB: [],
  SEARCH: [],
  CODE: [],
};

// ============================================================================
// ARRAY FIELDS - Fields that contain repeated elements (cards, items, etc.)
// The arrayField must match the property name in block.content
// ============================================================================
export interface ArrayFieldConfig {
  arrayField: string;
  textFields: string[];
  childType: string; // For ChildElementEditor identification
}

export const ARRAY_EDITABLE_FIELDS: Record<string, ArrayFieldConfig[]> = {
  // Hero buttons
  HERO: [{ arrayField: "buttons", textFields: ["text"], childType: "button" }],

  // FAQ
  FAQ: [
    {
      arrayField: "questions",
      textFields: ["question", "answer"],
      childType: "faq",
    },
  ],

  // Features
  FEATURES: [
    {
      arrayField: "features",
      textFields: ["title", "description"],
      childType: "feature",
    },
  ],

  // Cards
  CARDS: [
    {
      arrayField: "cards",
      textFields: ["title", "description", "buttonText"],
      childType: "card",
    },
  ],

  // Grid
  GRID: [
    {
      arrayField: "items",
      textFields: ["title", "description"],
      childType: "grid-item",
    },
  ],

  // Stats
  STATS: [
    {
      arrayField: "stats",
      textFields: ["value", "label", "prefix", "suffix"],
      childType: "stat",
    },
  ],

  // Team
  TEAM: [
    {
      arrayField: "members",
      textFields: ["name", "role", "bio"],
      childType: "member",
    },
  ],

  // Testimonials
  TESTIMONIALS: [
    {
      arrayField: "testimonials",
      textFields: ["text", "quote", "author", "role", "company"],
      childType: "testimonial",
    },
  ],

  // Timeline
  TIMELINE: [
    {
      arrayField: "items",
      textFields: ["title", "description", "date"],
      childType: "timeline-item",
    },
  ],

  // Pricing with nested features
  PRICING: [
    {
      arrayField: "plans",
      textFields: ["name", "price", "period", "description", "buttonText"],
      childType: "plan",
    },
    {
      arrayField: "plans.features",
      textFields: ["feature"],
      childType: "feature",
    },
  ],

  // Accordion
  ACCORDION: [
    {
      arrayField: "items",
      textFields: ["title", "content"],
      childType: "accordion-item",
    },
  ],

  // List
  LIST: [{ arrayField: "items", textFields: ["text"], childType: "list-item" }],

  // Services List - services are simple strings, not objects
  // The inline editing finds the text in the span and updates the array item directly
  SERVICES_LIST: [],

  // Tabs
  TABS: [
    { arrayField: "tabs", textFields: ["label", "content"], childType: "tab" },
  ],

  // Gallery
  GALLERY: [
    {
      arrayField: "images",
      textFields: ["alt", "caption"],
      childType: "image",
    },
  ],

  // Table
  TABLE: [{ arrayField: "headers", textFields: ["text"], childType: "header" }],

  // Buttons group
  BUTTONS: [
    { arrayField: "buttons", textFields: ["text"], childType: "button" },
  ],

  // Store blocks with items
  // STORE_SERVICES - services are simple strings, not objects
  STORE_SERVICES: [],
  STORE_REVIEWS: [
    {
      arrayField: "reviews",
      textFields: ["text", "author", "rating"],
      childType: "review",
    },
  ],
};

// ============================================================================
// CSS SELECTORS - Maps field names to CSS selectors for finding elements
// ============================================================================
export const FIELD_SELECTORS: Record<string, string> = {
  // Headings and titles
  title: "[data-field='title'], h1, h2, h3, h4, h5, h6",
  name: "[data-field='name'], h3, h4, h5, span",
  question: "[data-field='question'], h3, h4, button, summary",
  label: "[data-field='label'], span, p",
  subtitle: "[data-field='subtitle'], p, span",

  // Text content
  description: "[data-field='description'], p, span",
  content: "[data-field='content'], p, div",
  answer: "[data-field='answer'], p, div",
  text: "[data-field='text'], p, span, a",
  bio: "[data-field='bio'], p",

  // Quotes and testimonials
  quote: "[data-field='quote'], blockquote, p",
  author: "[data-field='author'], cite, span, div",
  role: "[data-field='role'], span, p, div",
  company: "[data-field='company'], span, p",

  // Values and numbers
  value: "[data-field='value'], span, h2, h3",
  price: "[data-field='price'], span",
  period: "[data-field='period'], span",
  date: "[data-field='date'], span, time",
  prefix: "[data-field='prefix'], span",
  suffix: "[data-field='suffix'], span",

  // Captions and alt text
  caption: "[data-field='caption'], figcaption, span, p",
  alt: "[data-field='alt']",

  // Buttons and links
  buttonText: "[data-field='buttonText'], button, a, span",
  submitText: "[data-field='submitText'], button",
  linkLabel: "[data-field='linkLabel'], a, span",

  // Store/Contact
  address: "[data-field='address'], address, p, span",
  phone: "[data-field='phone'], a[href^='tel:'], span, p",
  email: "[data-field='email'], a[href^='mailto:'], span, p",
  storeName: "[data-field='storeName'], h1, h2, h3",
  tagline: "[data-field='tagline'], p, span",

  // Table
  header: "[data-field='header'], th",
  cell: "[data-field='cell'], td",

  // List
  item: "[data-field='item'], span, li",
  feature: "[data-field='feature'], span, li",

  // Default fallback
  default: "p, span, h1, h2, h3, h4, h5, h6, div, a, button",
};

/**
 * Get CSS selectors for a specific field name
 */
export function getSelectorsForField(fieldName: string): string {
  return FIELD_SELECTORS[fieldName] || FIELD_SELECTORS.default;
}

/**
 * Check if a block type has inline editable fields
 */
export function hasInlineEditableFields(blockType: string): boolean {
  const fields = INLINE_EDITABLE_FIELDS[blockType];
  return fields && fields.length > 0;
}

/**
 * Check if a block type has array editable fields
 */
export function hasArrayEditableFields(blockType: string): boolean {
  const fields = ARRAY_EDITABLE_FIELDS[blockType];
  return fields && fields.length > 0;
}

/**
 * Get all editable field paths for a block (including array items)
 */
export function getAllEditableFieldPaths(
  blockType: string,
  content: Record<string, unknown>,
): string[] {
  const paths: string[] = [];

  // Add simple fields
  const simpleFields = INLINE_EDITABLE_FIELDS[blockType] || [];
  simpleFields.forEach((field) => {
    if (content[field]) {
      paths.push(field);
    }
  });

  // Add array fields
  const arrayConfigs = ARRAY_EDITABLE_FIELDS[blockType] || [];
  arrayConfigs.forEach(({ arrayField, textFields }) => {
    const items = content[arrayField] as
      | Array<Record<string, unknown>>
      | undefined;
    if (items && Array.isArray(items)) {
      items.forEach((item, index) => {
        textFields.forEach((field) => {
          if (item[field]) {
            paths.push(`${arrayField}.${index}.${field}`);
          }
        });
      });
    }
  });

  return paths;
}

// ============================================================================
// CHILD ELEMENT TYPES - For ChildElementEditor styling
// ============================================================================
export const CHILD_ELEMENT_NAMES: Record<string, string> = {
  card: "Carte",
  button: "Bouton",
  image: "Image",
  stat: "Statistique",
  feature: "Fonctionnalité",
  testimonial: "Témoignage",
  member: "Membre",
  item: "Élément",
  plan: "Plan",
  tab: "Onglet",
  service: "Service",
  faq: "Question FAQ",
  "timeline-item": "Étape",
  "accordion-item": "Accordéon",
  "list-item": "Élément de liste",
  header: "En-tête",
  cell: "Cellule",
  row: "Ligne",
  review: "Avis",
  question: "Question",
  answer: "Réponse",
};

export function getChildElementName(type: string): string {
  return CHILD_ELEMENT_NAMES[type] || "Élément";
}

// ============================================================================
// STYLE PRESETS - Reusable style options
// ============================================================================
export const STYLE_PRESETS = {
  borderRadius: [
    { value: "0", label: "Carré" },
    { value: "0.25rem", label: "XS" },
    { value: "0.5rem", label: "S" },
    { value: "0.75rem", label: "M" },
    { value: "1rem", label: "L" },
    { value: "1.5rem", label: "XL" },
    { value: "9999px", label: "Rond" },
  ],
  fontSize: [
    { value: "0.75rem", label: "XS" },
    { value: "0.875rem", label: "SM" },
    { value: "1rem", label: "Base" },
    { value: "1.125rem", label: "LG" },
    { value: "1.25rem", label: "XL" },
    { value: "1.5rem", label: "2XL" },
    { value: "2rem", label: "3XL" },
  ],
  spacing: [
    { value: "0", label: "0" },
    { value: "0.25rem", label: "1" },
    { value: "0.5rem", label: "2" },
    { value: "0.75rem", label: "3" },
    { value: "1rem", label: "4" },
    { value: "1.5rem", label: "6" },
    { value: "2rem", label: "8" },
    { value: "3rem", label: "12" },
  ],
  size: [
    { value: "auto", label: "Auto" },
    { value: "100%", label: "100%" },
    { value: "75%", label: "75%" },
    { value: "50%", label: "50%" },
    { value: "200px", label: "200px" },
    { value: "300px", label: "300px" },
    { value: "400px", label: "400px" },
  ],
  fontWeight: [
    { value: "400", label: "Normal" },
    { value: "500", label: "Medium" },
    { value: "600", label: "Semi" },
    { value: "700", label: "Bold" },
  ],
  borderWidth: [
    { value: "0", label: "Aucune" },
    { value: "1px", label: "Fine" },
    { value: "2px", label: "Moyenne" },
    { value: "4px", label: "Épaisse" },
  ],
};
