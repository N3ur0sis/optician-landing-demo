// ============================================
// Navigation Types & Constants
// Centralized navigation system configuration
// ============================================

// ============================================
// CONSTANTS
// ============================================

/** Menu positions */
export const MENU_POSITIONS = {
  top: 'Haut',
  bottom: 'Bas',
} as const;

/** Menu layouts */
export const MENU_LAYOUTS = {
  horizontal: 'Horizontal',
  vertical: 'Vertical',
} as const;

/** Menu alignments */
export const MENU_ALIGNMENTS = {
  left: 'Gauche',
  center: 'Centre',
  right: 'Droite',
  'space-between': 'Réparti',
} as const;

/** Mobile menu styles */
export const MOBILE_STYLES = {
  hamburger: 'Menu hamburger',
  slide: 'Slide',
} as const;

/** Desktop display modes */
export const DISPLAY_MODES = {
  'hamburger-only': 'Menu hamburger uniquement',
  'traditional': 'Menu traditionnel (liens au centre)',
  'hybrid': 'Hybride (liens + hamburger)',
} as const;

/** Dropdown animations */
export const DROPDOWN_ANIMATIONS = {
  none: 'Aucune',
  fadeDown: 'Fondu',
  scale: 'Zoom',
} as const;

/** Icon positions */
export const ICON_POSITIONS = {
  left: 'Gauche',
  right: 'Droite',
} as const;

// Type helpers from constants
export type MenuPosition = keyof typeof MENU_POSITIONS;
export type MenuLayout = keyof typeof MENU_LAYOUTS;
export type MenuAlignment = keyof typeof MENU_ALIGNMENTS;
export type MobileStyle = keyof typeof MOBILE_STYLES;
export type DisplayMode = keyof typeof DISPLAY_MODES;
export type DropdownAnimation = keyof typeof DROPDOWN_ANIMATIONS;
export type IconPosition = keyof typeof ICON_POSITIONS;

// ============================================
// INTERFACES
// ============================================

/**
 * Navigation Item - represents a single menu link or parent dropdown
 */
export interface NavigationItem {
  id: string;
  label: string;
  href?: string | null;
  
  // Hierarchy
  parentId?: string | null;
  order: number;
  depth: number;
  
  // Page linkage
  pageSlug?: string | null;
  openInNewTab: boolean;
  
  // Visual
  icon?: string | null;
  iconPosition: IconPosition;
  
  // State
  published: boolean;
  highlighted: boolean;
  
  // Nested children (computed client-side)
  children?: NavigationItem[];
}

/**
 * Navigation Menu - the main menu container (one per site)
 */
export interface NavigationMenu {
  id: string;
  name: string;
  slug: string;
  
  // Layout
  position: MenuPosition;
  layout: MenuLayout;
  alignment: MenuAlignment;
  
  // Display mode
  displayMode: DisplayMode;
  
  // Navbar styling
  navbarHeight: number;
  fontSize: number;
  backgroundColor?: string | null;
  textColor?: string | null;
  hoverColor?: string | null;
  activeColor?: string | null;
  itemSpacing: number;
  
  // Mobile menu styling
  mobileMenuBg?: string | null;
  mobileMenuText?: string | null;
  mobileMenuHover?: string | null;
  mobileMenuAccent?: string | null;
  mobileFontSize: number;
  
  // Scroll behavior
  shadowOnScroll: boolean;
  shrinkOnScroll: boolean;
  scrollOpacity: number;
  hideOnScrollDown: boolean;
  
  // Dropdown
  dropdownAnimation: DropdownAnimation;
  dropdownDelay: number;
  
  // Mobile
  mobileBreakpoint: number;
  mobileStyle: MobileStyle;
  
  // State
  published: boolean;
  
  // Relations
  items: NavigationItem[];
}

/**
 * Menu style configuration - subset for style editing
 */
export interface MenuStyleConfig {
  // Display
  displayMode: DisplayMode;
  alignment: MenuAlignment;
  
  // Navbar
  navbarHeight: number;
  fontSize: number;
  backgroundColor?: string | null;
  textColor?: string | null;
  hoverColor?: string | null;
  activeColor?: string | null;
  itemSpacing: number;
  
  // Mobile menu
  mobileMenuBg?: string | null;
  mobileMenuText?: string | null;
  mobileMenuHover?: string | null;
  mobileMenuAccent?: string | null;
  mobileFontSize: number;
  
  // Scroll behavior
  shadowOnScroll: boolean;
  shrinkOnScroll: boolean;
  scrollOpacity: number;
  hideOnScrollDown: boolean;
  
  // Animation
  dropdownAnimation: DropdownAnimation;
  dropdownDelay: number;
  
  // Mobile
  mobileStyle: MobileStyle;
}

/**
 * Page reference for linking
 */
export interface NavigationPage {
  id: string;
  slug: string;
  title: string;
  published: boolean;
}

// ============================================
// DEFAULTS
// ============================================

export const DEFAULT_MENU: Partial<NavigationMenu> = {
  name: 'Menu Principal',
  slug: 'header',
  position: 'top',
  layout: 'horizontal',
  alignment: 'center',
  displayMode: 'hamburger-only',
  navbarHeight: 64,
  fontSize: 14,
  backgroundColor: '#ffffff',
  textColor: '#000000',
  hoverColor: '#666666',
  activeColor: '#000000',
  itemSpacing: 32,
  mobileMenuBg: 'rgba(0,0,0,0.95)',
  mobileMenuText: '#ffffff',
  mobileMenuHover: '#999999',
  mobileMenuAccent: '#f59e0b',
  mobileFontSize: 18,
  shadowOnScroll: true,
  shrinkOnScroll: true,
  scrollOpacity: 100,
  hideOnScrollDown: false,
  dropdownAnimation: 'fadeDown',
  dropdownDelay: 0,
  mobileBreakpoint: 768,
  mobileStyle: 'hamburger',
  published: true,
};

export const DEFAULT_ITEM: Partial<NavigationItem> = {
  order: 0,
  depth: 0,
  openInNewTab: false,
  iconPosition: 'left',
  published: true,
  highlighted: false,
};

// ============================================
// HELPERS
// ============================================

/**
 * Build nested items structure from flat array
 * @param items - Flat array of navigation items
 * @param parentId - Parent ID to filter by (null for root items)
 * @param includeUnpublished - Whether to include unpublished items (for admin views)
 */
export function buildNestedItems(
  items: NavigationItem[],
  parentId: string | null = null,
  includeUnpublished: boolean = false
): NavigationItem[] {
  return items
    .filter(item => item.parentId === parentId && (includeUnpublished || item.published))
    .sort((a, b) => a.order - b.order)
    .map(item => ({
      ...item,
      children: buildNestedItems(items, item.id, includeUnpublished),
    }));
}

/**
 * Flatten nested items for reordering
 */
export function flattenItems(items: NavigationItem[], depth = 0): NavigationItem[] {
  return items.reduce<NavigationItem[]>((acc, item) => {
    const flatItem = { ...item, depth };
    acc.push(flatItem);
    if (item.children && item.children.length > 0) {
      acc.push(...flattenItems(item.children, depth + 1));
    }
    return acc;
  }, []);
}

/**
 * Get item href - resolves page slug or direct href
 */
export function getItemHref(item: NavigationItem): string {
  if (item.pageSlug) {
    // Handle home page
    if (item.pageSlug === 'home' || item.pageSlug === '/') {
      return '/';
    }
    // Ensure slug starts with / but doesn't have double slashes
    const slug = item.pageSlug.startsWith('/') ? item.pageSlug : `/${item.pageSlug}`;
    return slug;
  }
  // For custom href, ensure it's properly formatted
  if (item.href) {
    // External URLs stay as-is
    if (item.href.startsWith('http://') || item.href.startsWith('https://')) {
      return item.href;
    }
    // Internal paths should start with /
    return item.href.startsWith('/') ? item.href : `/${item.href}`;
  }
  return '#';
}

/**
 * Check if item is active based on current path
 */
export function isItemActive(item: NavigationItem, pathname: string): boolean {
  const href = getItemHref(item);
  if (href === '/') {
    return pathname === '/';
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
