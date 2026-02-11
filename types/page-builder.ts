// ============================================
// Page Builder Type Definitions
// ============================================

// Block Types (must match Prisma enum)
export type BlockType =
  // Text & Content
  | "HERO"
  | "TEXT"
  | "HEADING"
  | "PARAGRAPH"
  | "QUOTE"
  | "LIST"
  // Media
  | "IMAGE"
  | "GALLERY"
  | "VIDEO"
  | "FILE"
  // Layout
  | "COLUMNS"
  | "GRID"
  | "SPACER"
  | "DIVIDER"
  | "CONTAINER"
  // Interactive
  | "BUTTON"
  | "BUTTON_GROUP"
  | "LINK_BLOCK"
  | "ACCORDION"
  | "TABS"
  // Data Display
  | "TABLE"
  | "STATS"
  | "TIMELINE"
  | "CARDS"
  // Embeds
  | "IFRAME"
  | "MAP"
  | "SOCIAL"
  // Custom Components
  | "TEAM"
  | "TESTIMONIALS"
  | "PRICING"
  | "FAQ"
  | "CONTACT_FORM"
  | "NEWSLETTER"
  | "FEATURES"
  // Primitive Components (reusable)
  | "INFO_BOX"
  | "HOURS_TABLE"
  | "SERVICES_LIST"
  | "CTA_CARD"
  | "REVIEW_BADGE"
  | "LOCATION_CARD"
  | "ICON_FEATURE"
  // Store Components (legacy - kept for backward compatibility)
  | "STORE_LIST"
  | "STORE_HERO"
  | "STORE_CONTACT"
  | "STORE_SERVICES"
  | "STORE_CTA"
  | "STORE_REVIEWS"
  | "STORE_MAP"
  | "STORE_LAYOUT";

// Common Types
export type TextAlign = "LEFT" | "CENTER" | "RIGHT" | "JUSTIFY";
export type ContainerWidth = "NARROW" | "MEDIUM" | "WIDE" | "FULL" | "EDGE";
export type OverlayType = "LIGHT" | "DARK";
export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

// ============================================
// Block Content Types
// ============================================

// Hero Block
export interface HeroContent {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  overlayOpacity?: number; // 0-100
  overlayColor?: string;
  buttons?: ButtonItem[];
  height?: "small" | "medium" | "large" | "full";
  alignment?: TextAlign;
}

// Text/Rich Text Block
export interface TextContent {
  html: string; // Rich text HTML content
}

// Heading Block
export interface HeadingContent {
  text: string;
  level: HeadingLevel;
  subtitle?: string;
}

// Paragraph Block
export interface ParagraphContent {
  text: string;
}

// Quote Block
export interface QuoteContent {
  text: string;
  author?: string;
  role?: string;
  image?: string;
}

// List Block
export interface ListContent {
  items: string[];
  style: "bullet" | "number" | "check" | "arrow";
}

// Image Block
export interface ImageContent {
  src: string;
  alt: string;
  caption?: string;
  link?: string;
  width?: number;
  height?: number;
  objectFit?: "cover" | "contain" | "fill" | "none";
}

// Gallery Block
export interface GalleryContent {
  images: {
    src: string;
    alt: string;
    caption?: string;
  }[];
  columns?: 2 | 3 | 4 | 5;
  gap?: "none" | "small" | "medium" | "large";
  lightbox?: boolean;
}

// Video Block
export interface VideoContent {
  type: "youtube" | "vimeo" | "file";
  url: string;
  poster?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
}

// File Block
export interface FileContent {
  name: string;
  url: string;
  size?: string;
  type?: string;
  description?: string;
}

// Columns Block
export interface ColumnsContent {
  columns: {
    width?: number; // Percentage, e.g., 50
    blocks: PageBlock[];
  }[];
  gap?: "none" | "small" | "medium" | "large";
  verticalAlign?: "top" | "center" | "bottom";
  stackOnMobile?: boolean;
}

// Grid Block
export interface GridContent {
  columns?: 2 | 3 | 4;
  gap?: "none" | "small" | "medium" | "large";
  items: GridItem[];
}

export interface GridItem {
  title: string;
  description?: string;
  image?: string;
  link?: string;
  badge?: string;
}

// Spacer Block
export interface SpacerContent {
  height: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  mobileHeight?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}

// Divider Block
export interface DividerContent {
  style: "solid" | "dashed" | "dotted" | "gradient";
  width?: "full" | "medium" | "short";
  color?: string;
}

// Container Block
export interface ContainerContent {
  blocks: PageBlock[];
  width?: ContainerWidth;
}

// Button Block
export interface ButtonContent {
  text: string;
  url: string;
  variant: "primary" | "secondary" | "outline" | "ghost";
  size: "sm" | "md" | "lg";
  icon?: string;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  newTab?: boolean;
}

// Link Block
export interface LinkBlockContent {
  title: string;
  description?: string;
  url: string;
  image?: string;
  newTab?: boolean;
}

// Accordion Block
export interface AccordionContent {
  items: {
    title: string;
    content: string;
    defaultOpen?: boolean;
  }[];
  allowMultiple?: boolean;
}

// Tabs Block
export interface TabsContent {
  tabs: {
    label: string;
    content: string;
    icon?: string;
  }[];
  variant?: "line" | "pill" | "enclosed";
}

// Table Block
export interface TableContent {
  headers: string[];
  rows: string[][];
  striped?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
}

// Stats Block
export interface StatsContent {
  stats: {
    value: string;
    label: string;
    prefix?: string;
    suffix?: string;
    description?: string;
  }[];
  columns?: 2 | 3 | 4;
}

// Timeline Block
export interface TimelineContent {
  items: {
    date: string;
    title: string;
    description?: string;
    image?: string;
  }[];
  layout?: "vertical" | "alternating";
}

// Cards Block
export interface CardsContent {
  cards: {
    title: string;
    description?: string;
    image?: string;
    link?: string;
    tags?: string[];
    meta?: string;
  }[];
  columns?: 2 | 3 | 4;
  variant?: "default" | "bordered" | "elevated";
}

// Iframe Block
export interface IframeContent {
  url: string;
  height?: number;
  title?: string;
  allowFullscreen?: boolean;
}

// Map Block
export interface MapContent {
  address?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  height?: number;
  markers?: {
    lat: number;
    lng: number;
    title?: string;
  }[];
}

// Social Block
export interface SocialContent {
  platform:
    | "instagram"
    | "facebook"
    | "twitter"
    | "linkedin"
    | "youtube"
    | "tiktok";
  embedCode?: string;
  url?: string;
}

// Team Block
export interface TeamContent {
  members: {
    name: string;
    role: string;
    image?: string;
    bio?: string;
    social?: {
      instagram?: string;
      linkedin?: string;
      email?: string;
    };
  }[];
  columns?: 2 | 3 | 4;
  variant?: "card" | "minimal" | "profile";
}

// Testimonials Block
export interface TestimonialsContent {
  testimonials: {
    text: string;
    author: string;
    role?: string;
    company?: string;
    image?: string;
    rating?: number;
  }[];
  layout?: "grid" | "carousel" | "masonry";
  columns?: 1 | 2 | 3;
}

// Pricing Block
export interface PricingContent {
  plans: {
    name: string;
    price: string;
    period?: string;
    description?: string;
    features: string[];
    highlighted?: boolean;
    buttonText?: string;
    buttonUrl?: string;
  }[];
  columns?: 2 | 3 | 4;
}

// FAQ Block
export interface FAQContent {
  questions: {
    question: string;
    answer: string;
  }[];
  layout?: "accordion" | "cards" | "two-column";
}

// Contact Form Block
export interface ContactFormContent {
  title?: string;
  description?: string;
  fields: {
    type: "text" | "email" | "phone" | "textarea" | "select" | "checkbox";
    name: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    options?: string[]; // For select fields
  }[];
  submitText?: string;
  successMessage?: string;
  recipientEmail?: string;
}

// Newsletter Block
export interface NewsletterContent {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  provider?: "mailchimp" | "sendinblue" | "custom";
  listId?: string;
}

// Features Block
export interface FeaturesContent {
  features: {
    icon?: string;
    title: string;
    description: string;
    link?: string;
  }[];
  columns?: 2 | 3 | 4;
  layout?: "cards" | "list" | "icons";
  iconStyle?: "circle" | "square" | "none";
}

// Button Item (reusable)
export interface ButtonItem {
  text: string;
  url: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  newTab?: boolean;
}

// ============================================
// Primitive Block Content Types (Reusable)
// ============================================

// Info Box Block - Display information with icon (address, phone, email, etc.)
export interface InfoBoxContent {
  icon:
    | "map-pin"
    | "phone"
    | "mail"
    | "clock"
    | "calendar"
    | "user"
    | "star"
    | "info"
    | "check"
    | "external-link";
  title: string;
  content: string;
  link?: string;
  linkLabel?: string;
  secondaryContent?: string;
  secondaryLink?: string;
  variant?: "default" | "compact" | "card";
}

// Hours Table Block - Opening hours display
export interface HoursTableContent {
  title?: string;
  hours: Record<string, string>; // { "Lundi": "9h-19h", "Mardi": "9h-19h", ... }
  showIcon?: boolean;
  highlightToday?: boolean;
  variant?: "table" | "list" | "compact";
}

// Services List Block - List of services with styling
export interface ServicesListContent {
  title?: string;
  subtitle?: string;
  services: string[];
  columns?: 1 | 2 | 3;
  variant?: "bullets" | "checks" | "cards" | "badges";
  iconColor?: string;
}

// CTA Card Block - Call to action card with buttons
export interface CtaCardContent {
  title?: string;
  description?: string;
  primaryButton?: {
    label: string;
    url: string;
    icon?: "calendar" | "phone" | "mail" | "external-link" | "arrow-right";
    newTab?: boolean;
  };
  secondaryButton?: {
    label: string;
    url: string;
    icon?: "calendar" | "phone" | "mail" | "external-link" | "arrow-right";
    newTab?: boolean;
  };
  variant?: "default" | "dark" | "gradient" | "outline";
}

// Review Badge Block - Customer reviews rating display
export interface ReviewBadgeContent {
  title?: string;
  rating: number; // 0-5
  reviewCount: number;
  source?: string;
  sourceUrl?: string;
  showStars?: boolean;
  variant?: "default" | "compact" | "detailed";
}

// Location Card Block - Address with map link
export interface LocationCardContent {
  title?: string;
  address: string;
  mapUrl?: string;
  embedUrl?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  showPreview?: boolean;
  variant?: "default" | "compact" | "map-only";
}

// Icon Feature Block - Feature with icon, title and description
export interface IconFeatureContent {
  icon: string;
  title: string;
  description?: string;
  link?: string;
  variant?: "default" | "card" | "centered" | "horizontal";
  iconBackground?: boolean;
  iconColor?: string;
}

// ============================================
// Block Styles Types
// ============================================

export interface BlockStyles {
  // Section Background (full width, behind the content)
  sectionBackgroundColor?: string;
  sectionBackgroundImage?: string;
  sectionOverlayColor?: string;
  sectionOverlayOpacity?: number; // 0-100

  // Content Background (applies to the content container only)
  backgroundColor?: string;
  backgroundImage?: string;

  // Text
  textColor?: string;
  textAlign?: "left" | "center" | "right" | "justify";

  // Typography
  fontSize?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  fontWeight?:
    | "light"
    | "normal"
    | "medium"
    | "semibold"
    | "bold"
    | "extrabold";
  lineHeight?: "none" | "tight" | "snug" | "normal" | "relaxed" | "loose";
  letterSpacing?: "tighter" | "tight" | "normal" | "wide" | "wider" | "widest";

  // =====================================================
  // WIDTH - Complete system
  // =====================================================
  widthMode?: "auto" | "preset" | "custom"; // How width is determined
  widthPreset?: "narrow" | "medium" | "wide" | "full" | "edge"; // Preset widths
  widthValue?: number; // Custom width value
  widthUnit?: "px" | "%"; // Unit for custom width

  // Legacy support
  widthPercent?: number; // 10, 20, 25, 33, 50, 66, 75, 100 (deprecated, use widthValue + widthUnit)
  containerWidth?: ContainerWidth; // Legacy preset widths

  // =====================================================
  // HEIGHT - Complete system
  // =====================================================
  heightMode?: "auto" | "preset" | "custom" | "viewport"; // How height is determined
  heightPreset?: "small" | "medium" | "large" | "xlarge"; // Preset heights
  heightValue?: number; // Custom height value
  heightUnit?: "px" | "vh"; // Unit for custom height (px or viewport height)

  // Legacy support
  height?: "auto" | "small" | "medium" | "large" | "xlarge" | "screen";
  minHeight?: number; // Minimum height in px (legacy)
  maxHeight?: number; // Maximum height in px
  fullHeight?: boolean; // 100vh mode (legacy)

  // =====================================================
  // BLOCK ALIGNMENT - Position of the block in its container
  // =====================================================
  alignment?: "left" | "center" | "right"; // Horizontal alignment of the block
  verticalAlign?: "top" | "center" | "bottom"; // Vertical alignment (when height > content)

  // Layout - inline allows blocks side by side
  inline?: boolean;

  // Section Spacing (applies to full-width section) - up to 8xl (96px)
  sectionPaddingTop?:
    | "none"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "8xl";
  sectionPaddingBottom?:
    | "none"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "8xl";

  // Content Spacing - full range up to 8xl (96px) + percentage options
  paddingTop?: string; // Preset values (xs-8xl) or percentage
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string; // Also supports 'auto' for centering
  marginRight?: string;

  // Border
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl" | "full";

  // Effects
  shadow?: "none" | "sm" | "md" | "lg" | "xl";

  // Animation
  animation?:
    | "none"
    | "fade-in"
    | "slide-up"
    | "slide-left"
    | "slide-right"
    | "scale";
  animationDelay?: number; // Delay in milliseconds

  // Custom CSS Class
  customClass?: string;
}

// Block Settings Types
export interface BlockSettings {
  // Visibility
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  hideOnDesktop?: boolean;

  // ID and anchor
  anchorId?: string;

  // Custom CSS (inline styles)
  customCSS?: string;

  // Additional custom settings
  [key: string]: unknown;
}

// ============================================
// Page Block Type (complete)
// ============================================

export interface PageBlock {
  id: string;
  pageId: string;
  type: BlockType;
  order: number;
  content: Record<string, unknown>;
  settings: BlockSettings;
  styles: BlockStyles;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Page Type
export interface Page {
  id: string;
  slug: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  published: boolean;
  publishedAt?: Date;
  template: string;
  backgroundColor: string;
  textColor: string;
  customCSS?: string;
  // Navbar title settings
  showNavbarTitle: boolean;
  navbarTitle?: string;
  navbarSubtitle?: string;
  // Navigation (deprecated)
  showInNav: boolean;
  navOrder: number;
  navLabel?: string;
  parentSlug?: string;
  createdAt: Date;
  updatedAt: Date;
  blocks: PageBlock[];
}

// ============================================
// Block Registry (for editor)
// ============================================

export interface BlockDefinition {
  type: BlockType;
  label: string;
  category:
    | "text"
    | "media"
    | "layout"
    | "interactive"
    | "data"
    | "embed"
    | "custom";
  icon: string;
  description: string;
  defaultContent: Record<string, unknown>;
  defaultStyles: BlockStyles;
}

export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  // Text & Content
  {
    type: "HERO",
    label: "Hero",
    category: "text",
    icon: "Layout",
    description: "Grande section d'en-tête avec image de fond",
    defaultContent: {
      title: "Titre de la page",
      subtitle: "Sous-titre",
      height: "large",
      alignment: "CENTER",
    },
    defaultStyles: {
      paddingTop: "xl",
      paddingBottom: "xl",
    },
  },
  {
    type: "TEXT",
    label: "Texte riche",
    category: "text",
    icon: "Type",
    description: "Bloc de texte formaté",
    defaultContent: {
      html: "<p>Ajoutez votre contenu ici...</p>",
    },
    defaultStyles: {
      paddingTop: "md",
      paddingBottom: "md",
      containerWidth: "MEDIUM",
    },
  },
  {
    type: "HEADING",
    label: "Titre",
    category: "text",
    icon: "Heading",
    description: "Titre seul (H1-H6)",
    defaultContent: {
      text: "Nouveau titre",
      level: "h2",
    },
    defaultStyles: {
      paddingTop: "md",
      paddingBottom: "sm",
    },
  },
  {
    type: "PARAGRAPH",
    label: "Paragraphe",
    category: "text",
    icon: "AlignLeft",
    description: "Paragraphe de texte simple",
    defaultContent: {
      text: "Votre texte ici...",
    },
    defaultStyles: {
      paddingTop: "sm",
      paddingBottom: "sm",
    },
  },
  {
    type: "QUOTE",
    label: "Citation",
    category: "text",
    icon: "Quote",
    description: "Citation avec attribution",
    defaultContent: {
      text: "Votre citation...",
      author: "Auteur",
    },
    defaultStyles: {
      paddingTop: "md",
      paddingBottom: "md",
    },
  },
  {
    type: "LIST",
    label: "Liste",
    category: "text",
    icon: "List",
    description: "Liste à puces ou numérotée",
    defaultContent: {
      items: ["Élément 1", "Élément 2", "Élément 3"],
      style: "bullet",
    },
    defaultStyles: {
      paddingTop: "sm",
      paddingBottom: "sm",
    },
  },
  // Media
  {
    type: "IMAGE",
    label: "Image",
    category: "media",
    icon: "Image",
    description: "Image avec légende optionnelle",
    defaultContent: {
      src: "",
      alt: "",
      objectFit: "cover",
    },
    defaultStyles: {
      paddingTop: "md",
      paddingBottom: "md",
    },
  },
  {
    type: "GALLERY",
    label: "Galerie",
    category: "media",
    icon: "Images",
    description: "Galerie d'images",
    defaultContent: {
      images: [
        { src: "/images/placeholder.svg", alt: "Image 1", caption: "" },
        { src: "/images/placeholder.svg", alt: "Image 2", caption: "" },
        { src: "/images/placeholder.svg", alt: "Image 3", caption: "" },
      ],
      columns: 3,
      gap: "medium",
      lightbox: true,
    },
    defaultStyles: {
      paddingTop: "md",
      paddingBottom: "md",
    },
  },
  {
    type: "VIDEO",
    label: "Vidéo",
    category: "media",
    icon: "Video",
    description: "Vidéo YouTube, Vimeo ou fichier",
    defaultContent: {
      type: "youtube",
      url: "",
      controls: true,
    },
    defaultStyles: {
      paddingTop: "md",
      paddingBottom: "md",
    },
  },
  {
    type: "FILE",
    label: "Fichier",
    category: "media",
    icon: "FileDown",
    description: "Fichier téléchargeable",
    defaultContent: {
      name: "",
      url: "",
    },
    defaultStyles: {
      paddingTop: "sm",
      paddingBottom: "sm",
    },
  },
  // Layout
  {
    type: "COLUMNS",
    label: "Colonnes",
    category: "layout",
    icon: "Columns",
    description: "Mise en page multi-colonnes",
    defaultContent: {
      columns: [
        { width: 50, blocks: [] },
        { width: 50, blocks: [] },
      ],
      gap: "medium",
      stackOnMobile: true,
    },
    defaultStyles: {
      paddingTop: "md",
      paddingBottom: "md",
    },
  },
  {
    type: "GRID",
    label: "Grille",
    category: "layout",
    icon: "Grid3x3",
    description: "Grille d'éléments",
    defaultContent: {
      columns: 3,
      gap: "medium",
      items: [
        {
          title: "Élément 1",
          description: "Description de l'élément",
          image: "",
        },
        {
          title: "Élément 2",
          description: "Description de l'élément",
          image: "",
        },
        {
          title: "Élément 3",
          description: "Description de l'élément",
          image: "",
        },
      ],
    },
    defaultStyles: {
      paddingTop: "md",
      paddingBottom: "md",
    },
  },
  {
    type: "SPACER",
    label: "Espacement",
    category: "layout",
    icon: "MoveVertical",
    description: "Espace vertical",
    defaultContent: {
      height: "md",
    },
    defaultStyles: {},
  },
  {
    type: "DIVIDER",
    label: "Séparateur",
    category: "layout",
    icon: "Minus",
    description: "Ligne de séparation horizontale",
    defaultContent: {
      style: "solid",
      width: "medium",
    },
    defaultStyles: {
      paddingTop: "md",
      paddingBottom: "md",
    },
  },
  {
    type: "CONTAINER",
    label: "Conteneur",
    category: "layout",
    icon: "Square",
    description: "Conteneur avec fond personnalisable",
    defaultContent: {
      blocks: [],
      width: "WIDE",
    },
    defaultStyles: {
      paddingTop: "lg",
      paddingBottom: "lg",
    },
  },
  // Interactive
  {
    type: "BUTTON",
    label: "Bouton",
    category: "interactive",
    icon: "MousePointer",
    description: "Bouton d'action",
    defaultContent: {
      text: "Cliquez ici",
      url: "#",
      variant: "primary",
      size: "md",
      borderRadius: "md",
    },
    defaultStyles: {
      paddingTop: "sm",
      paddingBottom: "sm",
    },
  },
  {
    type: "BUTTON_GROUP",
    label: "Groupe de boutons",
    category: "interactive",
    icon: "LayoutGrid",
    description: "Plusieurs boutons côte à côte",
    defaultContent: {
      buttons: [
        { label: "Bouton 1", href: "#", variant: "primary" },
        { label: "Bouton 2", href: "#", variant: "outline" },
      ],
      alignment: "center",
      gap: "md",
      direction: "horizontal",
      stackOnMobile: true,
    },
    defaultStyles: {
      paddingTop: "sm",
      paddingBottom: "sm",
    },
  },
  {
    type: "LINK_BLOCK",
    label: "Bloc lien",
    category: "interactive",
    icon: "ExternalLink",
    description: "Lien avec aperçu",
    defaultContent: {
      title: "En savoir plus",
      description: "Cliquez pour découvrir notre page",
      url: "#",
      newTab: false,
    },
    defaultStyles: {
      paddingTop: "sm",
      paddingBottom: "sm",
    },
  },
  {
    type: "ACCORDION",
    label: "Accordéon",
    category: "interactive",
    icon: "ChevronDown",
    description: "Sections pliables",
    defaultContent: {
      items: [
        {
          title: "Comment prendre rendez-vous ?",
          content: "Vous pouvez prendre rendez-vous en ligne ou par téléphone.",
          defaultOpen: true,
        },
        {
          title: "Quels modes de paiement acceptez-vous ?",
          content: "Nous acceptons les cartes bancaires, espèces et chèques.",
        },
        {
          title: "Proposez-vous un service après-vente ?",
          content:
            "Oui, nous assurons l'entretien et les réparations de vos lunettes.",
        },
      ],
      allowMultiple: false,
      style: "default",
    },
    defaultStyles: {
      paddingTop: "md",
      paddingBottom: "md",
    },
  },
  {
    type: "TABS",
    label: "Onglets",
    category: "interactive",
    icon: "PanelTop",
    description: "Contenu à onglets",
    defaultContent: {
      tabs: [
        {
          label: "Verres",
          content: "Découvrez notre gamme de verres optiques et solaires.",
          icon: "eye",
        },
        {
          label: "Montures",
          content: "Plus de 500 montures de grandes marques.",
          icon: "glasses",
        },
        {
          label: "Lentilles",
          content: "Toutes les marques de lentilles de contact.",
          icon: "circle",
        },
      ],
      variant: "line",
    },
    defaultStyles: {
      paddingTop: "md",
      paddingBottom: "md",
    },
  },
  // Data Display
  {
    type: "TABLE",
    label: "Tableau",
    category: "data",
    icon: "Table",
    description: "Tableau de données",
    defaultContent: {
      headers: ["Colonne 1", "Colonne 2", "Colonne 3"],
      rows: [["Donnée 1", "Donnée 2", "Donnée 3"]],
      striped: true,
    },
    defaultStyles: {
      paddingTop: "md",
      paddingBottom: "md",
    },
  },
  {
    type: "STATS",
    label: "Statistiques",
    category: "data",
    icon: "BarChart2",
    description: "Chiffres clés",
    defaultContent: {
      stats: [
        { value: "25+", label: "Années d'expérience" },
        { value: "5000+", label: "Clients satisfaits" },
        { value: "500+", label: "Montures" },
        { value: "4.9", label: "Note clients", suffix: "/5" },
      ],
      columns: 4,
      style: "default",
    },
    defaultStyles: {
      paddingTop: "lg",
      paddingBottom: "lg",
    },
  },
  {
    type: "TIMELINE",
    label: "Timeline",
    category: "data",
    icon: "GitBranch",
    description: "Chronologie",
    defaultContent: {
      items: [
        {
          date: "1998",
          title: "Création",
          description: "Ouverture de notre première boutique.",
        },
        {
          date: "2010",
          title: "Expansion",
          description: "Ouverture de 3 nouvelles boutiques.",
        },
        {
          date: "2024",
          title: "Innovation",
          description: "Lancement de nos services en ligne.",
        },
      ],
      layout: "vertical",
    },
    defaultStyles: {
      paddingTop: "lg",
      paddingBottom: "lg",
    },
  },
  {
    type: "CARDS",
    label: "Cartes",
    category: "data",
    icon: "LayoutGrid",
    description: "Grille de cartes",
    defaultContent: {
      cards: [
        {
          title: "Service 1",
          description: "Description du premier service offert.",
          image: "",
        },
        {
          title: "Service 2",
          description: "Description du deuxième service offert.",
          image: "",
        },
        {
          title: "Service 3",
          description: "Description du troisième service offert.",
          image: "",
        },
      ],
      columns: 3,
      variant: "default",
      cardStyle: "elevated",
      showImage: true,
      showDescription: true,
    },
    defaultStyles: {
      paddingTop: "md",
      paddingBottom: "md",
    },
  },
  // Embeds
  {
    type: "IFRAME",
    label: "Iframe",
    category: "embed",
    icon: "Frame",
    description: "Contenu externe intégré",
    defaultContent: {
      url: "",
      height: 400,
    },
    defaultStyles: {
      paddingTop: "md",
      paddingBottom: "md",
    },
  },
  {
    type: "MAP",
    label: "Carte",
    category: "embed",
    icon: "MapPin",
    description: "Google Maps",
    defaultContent: {
      address: "",
      zoom: 14,
      height: 400,
    },
    defaultStyles: {
      paddingTop: "md",
      paddingBottom: "md",
    },
  },
  {
    type: "SOCIAL",
    label: "Réseau social",
    category: "embed",
    icon: "Share2",
    description: "Intégration réseaux sociaux",
    defaultContent: {
      platform: "instagram",
      url: "",
    },
    defaultStyles: {
      paddingTop: "md",
      paddingBottom: "md",
    },
  },
  // Custom Components
  {
    type: "TEAM",
    label: "Équipe",
    category: "custom",
    icon: "Users",
    description: "Présentation d'équipe",
    defaultContent: {
      members: [
        {
          name: "Jean Dupont",
          role: "Directeur",
          image: "",
          bio: "Passionné par l'optique depuis 20 ans.",
        },
        {
          name: "Marie Martin",
          role: "Opticienne",
          image: "",
          bio: "Spécialiste en contactologie.",
        },
        {
          name: "Pierre Bernard",
          role: "Opticien",
          image: "",
          bio: "Expert en verres progressifs.",
        },
      ],
      columns: 3,
      variant: "card",
      showBio: true,
      showSocial: false,
    },
    defaultStyles: {
      paddingTop: "lg",
      paddingBottom: "lg",
    },
  },
  {
    type: "TESTIMONIALS",
    label: "Témoignages",
    category: "custom",
    icon: "MessageSquare",
    description: "Avis clients",
    defaultContent: {
      testimonials: [
        {
          text: "Un service exceptionnel et des conseils personnalisés. Je recommande vivement !",
          author: "Sophie L.",
          role: "Cliente fidèle",
          rating: 5,
        },
        {
          text: "Équipe très professionnelle et à l'écoute. Mes nouvelles lunettes sont parfaites.",
          author: "Marc D.",
          role: "Client",
          rating: 5,
        },
      ],
      layout: "grid",
      columns: 2,
      showRating: true,
      showImage: false,
    },
    defaultStyles: {
      paddingTop: "lg",
      paddingBottom: "lg",
    },
  },
  {
    type: "PRICING",
    label: "Tarifs",
    category: "custom",
    icon: "DollarSign",
    description: "Tableau de prix",
    defaultContent: {
      plans: [
        {
          name: "Essentiel",
          price: "29€",
          period: "mois",
          description: "Pour débuter",
          features: ["Verres simples", "Monture basique", "Garantie 1 an"],
          buttonText: "Choisir",
          buttonUrl: "#",
        },
        {
          name: "Confort",
          price: "49€",
          period: "mois",
          description: "Le plus populaire",
          features: [
            "Verres progressifs",
            "Monture premium",
            "Garantie 2 ans",
            "Nettoyage offert",
          ],
          highlighted: true,
          buttonText: "Choisir",
          buttonUrl: "#",
        },
        {
          name: "Premium",
          price: "79€",
          period: "mois",
          description: "Le meilleur",
          features: [
            "Verres haute définition",
            "Monture luxe",
            "Garantie 3 ans",
            "Service VIP",
          ],
          buttonText: "Choisir",
          buttonUrl: "#",
        },
      ],
      columns: 3,
    },
    defaultStyles: {
      paddingTop: "lg",
      paddingBottom: "lg",
    },
  },
  {
    type: "FAQ",
    label: "FAQ",
    category: "custom",
    icon: "HelpCircle",
    description: "Questions fréquentes",
    defaultContent: {
      questions: [
        {
          question: "Quels sont vos horaires d'ouverture ?",
          answer: "Nous sommes ouverts du lundi au samedi de 9h à 19h.",
        },
        {
          question: "Acceptez-vous la carte vitale ?",
          answer:
            "Oui, nous acceptons la carte vitale et travaillons avec toutes les mutuelles.",
        },
        {
          question: "Combien de temps pour recevoir mes lunettes ?",
          answer:
            "Comptez généralement 7 à 10 jours ouvrés pour des verres simples, et jusqu'à 15 jours pour des verres progressifs.",
        },
      ],
      layout: "accordion",
      allowMultiple: false,
      showIcon: true,
    },
    defaultStyles: {
      paddingTop: "lg",
      paddingBottom: "lg",
    },
  },
  {
    type: "CONTACT_FORM",
    label: "Formulaire de contact",
    category: "custom",
    icon: "Mail",
    description: "Formulaire de contact",
    defaultContent: {
      title: "Contactez-nous",
      fields: [
        { type: "text", name: "name", label: "Nom", required: true },
        { type: "email", name: "email", label: "Email", required: true },
        { type: "textarea", name: "message", label: "Message", required: true },
      ],
      submitText: "Envoyer",
    },
    defaultStyles: {
      paddingTop: "lg",
      paddingBottom: "lg",
    },
  },
  {
    type: "NEWSLETTER",
    label: "Newsletter",
    category: "custom",
    icon: "Send",
    description: "Inscription newsletter",
    defaultContent: {
      title: "Restez informé",
      buttonText: "S'inscrire",
    },
    defaultStyles: {
      paddingTop: "md",
      paddingBottom: "md",
    },
  },
  {
    type: "FEATURES",
    label: "Fonctionnalités",
    category: "custom",
    icon: "Star",
    description: "Liste de fonctionnalités",
    defaultContent: {
      features: [
        {
          icon: "eye",
          title: "Examen de vue",
          description: "Un examen complet pour déterminer votre correction.",
        },
        {
          icon: "glasses",
          title: "Large choix",
          description: "Plus de 500 montures de grandes marques.",
        },
        {
          icon: "shield",
          title: "Garantie",
          description: "Tous nos produits sont garantis 2 ans.",
        },
      ],
      columns: 3,
      layout: "cards",
      iconStyle: "circle",
    },
    defaultStyles: {
      paddingTop: "lg",
      paddingBottom: "lg",
    },
  },
  // Primitive Components (Reusable building blocks)
  {
    type: "INFO_BOX",
    label: "Info box",
    category: "data",
    icon: "Info",
    description:
      "Boîte d'information avec icône (adresse, téléphone, email...)",
    defaultContent: {
      icon: "info",
      title: "Titre",
      content: "Contenu de l'information",
      variant: "default",
    },
    defaultStyles: {
      paddingTop: "sm",
      paddingBottom: "sm",
    },
  },
  {
    type: "HOURS_TABLE",
    label: "Horaires",
    category: "data",
    icon: "Clock",
    description: "Tableau des horaires d'ouverture",
    defaultContent: {
      title: "Horaires d'ouverture",
      hours: {
        Lundi: "9h00 - 19h00",
        Mardi: "9h00 - 19h00",
        Mercredi: "9h00 - 19h00",
        Jeudi: "9h00 - 19h00",
        Vendredi: "9h00 - 19h00",
        Samedi: "9h00 - 18h00",
        Dimanche: "Fermé",
      },
      showIcon: true,
      highlightToday: true,
      variant: "table",
    },
    defaultStyles: {
      paddingTop: "md",
      paddingBottom: "md",
    },
  },
  {
    type: "SERVICES_LIST",
    label: "Liste de services",
    category: "data",
    icon: "CheckSquare",
    description: "Liste de services avec puces stylisées",
    defaultContent: {
      title: "Nos services",
      services: ["Service 1", "Service 2", "Service 3"],
      columns: 2,
      variant: "bullets",
    },
    defaultStyles: {
      paddingTop: "md",
      paddingBottom: "md",
    },
  },
  {
    type: "CTA_CARD",
    label: "Carte CTA",
    category: "interactive",
    icon: "MousePointerClick",
    description: "Carte d'appel à l'action avec boutons",
    defaultContent: {
      title: "Prendre rendez-vous",
      primaryButton: {
        label: "Réserver en ligne",
        url: "#",
        icon: "calendar",
      },
      variant: "default",
    },
    defaultStyles: {
      paddingTop: "md",
      paddingBottom: "md",
    },
  },
  {
    type: "REVIEW_BADGE",
    label: "Badge avis",
    category: "data",
    icon: "Star",
    description: "Badge de notation et avis clients",
    defaultContent: {
      title: "Avis clients",
      rating: 4.8,
      reviewCount: 120,
      showStars: true,
      variant: "default",
    },
    defaultStyles: {
      paddingTop: "md",
      paddingBottom: "md",
    },
  },
  {
    type: "LOCATION_CARD",
    label: "Carte localisation",
    category: "embed",
    icon: "MapPin",
    description: "Carte de localisation avec lien Google Maps",
    defaultContent: {
      title: "Nous trouver",
      address: "Adresse du lieu",
      showPreview: true,
      variant: "default",
    },
    defaultStyles: {
      paddingTop: "md",
      paddingBottom: "md",
    },
  },
  {
    type: "ICON_FEATURE",
    label: "Feature icône",
    category: "data",
    icon: "Sparkles",
    description: "Fonctionnalité avec icône, titre et description",
    defaultContent: {
      icon: "star",
      title: "Fonctionnalité",
      description: "Description de la fonctionnalité",
      iconBackground: true,
      variant: "default",
    },
    defaultStyles: {
      paddingTop: "sm",
      paddingBottom: "sm",
    },
  },
];

// Category labels
export const BLOCK_CATEGORIES = {
  text: "Texte & Contenu",
  media: "Médias",
  layout: "Mise en page",
  interactive: "Interactif",
  data: "Données",
  embed: "Intégrations",
  custom: "Composants",
} as const;
