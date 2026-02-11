"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApparence } from "@/lib/apparence-context";

import {
  NavigationMenu,
  NavigationItem,
  buildNestedItems,
  getItemHref,
  isItemActive,
  DropdownAnimation,
  DisplayMode,
} from "@/types/navigation";

// ============================================
// ANIMATION VARIANTS
// ============================================

const dropdownAnimations = {
  none: {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit: { opacity: 1 },
  },
  fadeDown: {
    initial: { opacity: 0, y: -8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
};

// ============================================
// PROPS
// ============================================

interface DynamicNavbarProps {
  className?: string;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function DynamicNavbar({
  className,
  title,
  subtitle,
  showBackButton = false,
}: DynamicNavbarProps) {
  const [menu, setMenu] = useState<NavigationMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  const pathname = usePathname();
  const router = useRouter();
  const { settings: apparenceSettings } = useApparence();
  const { scrollY } = useScroll();

  const navbarLogoUrl = apparenceSettings.navbar_logo_url;

  // Fetch menu data (singleton menu "header")
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(
          "/api/navigation/menus/header?includeItems=true",
        );
        if (response.ok) {
          const data = await response.json();
          setMenu(data);
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Handle scroll behavior
  useMotionValueEvent(scrollY, "change", (latest) => {
    // Ignore scroll events when mobile menu is open
    if (mobileOpen) return;

    const currentScrollY = latest;

    // Set scrolled state for all scroll effects (shadow, shrink, opacity)
    setScrolled(currentScrollY > 50);

    // Hide on scroll down
    if (menu?.hideOnScrollDown) {
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
    }

    lastScrollY.current = currentScrollY;
  });

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < (menu?.mobileBreakpoint || 768));
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [menu?.mobileBreakpoint]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('mobile-menu-open');
      // Also reset hidden state when menu opens
      setHidden(false);
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('mobile-menu-open');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('mobile-menu-open');
    };
  }, [mobileOpen]);

  // Back button handler - always navigate to home
  const handleBackClick = useCallback(() => {
    sessionStorage.setItem("scrollToContentReveal", "true");
    router.push("/");
  }, [router]);

  // Logo click handler - skip animation when returning to home
  const handleLogoClick = useCallback((e: { preventDefault: () => void }) => {
    e.preventDefault();
    sessionStorage.setItem("scrollToContentReveal", "true");
    router.push("/");
  }, [router]);

  // Get navbar height from menu (with fallback for SSR/loading state)
  const navbarHeight = menu?.navbarHeight || 64;

  // Set CSS custom property for navbar height
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--navbar-height",
      `${navbarHeight}px`,
    );
    return () => {
      document.documentElement.style.removeProperty("--navbar-height");
    };
  }, [navbarHeight]);

  // Don't render if loading or no menu
  if (loading || !menu || !menu.published) {
    return null;
  }

  const nestedItems = buildNestedItems(menu.items);
  const displayMode = menu.displayMode || "hamburger-only";

  // Determine what to show
  const showTraditionalMenu =
    !isMobile && (displayMode === "traditional" || displayMode === "hybrid");
  const showHamburger =
    isMobile || displayMode === "hamburger-only" || displayMode === "hybrid";

  // Get scroll behavior settings from menu
  const shadowOnScroll = menu.shadowOnScroll ?? true;
  const shrinkOnScroll = menu.shrinkOnScroll ?? true;
  const scrollOpacity = menu.scrollOpacity ?? 100;
  const alignment = menu.alignment || "center";

  // Get colors from menu with sensible defaults
  const bgColor = menu.backgroundColor || "rgba(255,255,255,0.9)";
  const textColor = menu.textColor || "#000000";
  const hoverColor = menu.hoverColor || "#666666";
  const activeColor = menu.activeColor || textColor;

  // Calculate current navbar height based on scroll state
  const shrinkAmount = 16; // pixels to shrink
  const currentHeight =
    scrolled && shrinkOnScroll ? navbarHeight - shrinkAmount : navbarHeight;

  // Calculate background opacity based on scroll state
  const getScrolledBgColor = () => {
    if (!scrolled) return bgColor;
    // Apply scroll opacity
    const opacity = scrollOpacity / 100;
    // If bgColor is hex, convert to rgba with opacity
    if (bgColor.startsWith("#")) {
      const r = parseInt(bgColor.slice(1, 3), 16);
      const g = parseInt(bgColor.slice(3, 5), 16);
      const b = parseInt(bgColor.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    // If bgColor is rgba, replace the alpha
    if (bgColor.startsWith("rgba")) {
      return bgColor.replace(/[\d.]+\)$/, `${opacity})`);
    }
    return bgColor;
  };

  // Dynamic background with scroll effect
  const getNavBackgroundClass = () => {
    return cn(
      "backdrop-blur-md",
      scrolled && shadowOnScroll && "shadow-lg",
    );
  };

  // Alignment classes for center section
  const alignmentClass =
    {
      left: "justify-start",
      center: "justify-center",
      right: "justify-end",
      "space-between": "justify-between",
    }[alignment] || "justify-center";

  return (
    <>
      {/* Spacer to push content below fixed navbar */}
      <div style={{ height: navbarHeight }} aria-hidden="true" />

      <motion.nav
        initial={false}
        animate={{
          y: hidden ? -(navbarHeight + 10) : 0,
          height: currentHeight,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          getNavBackgroundClass(),
          className,
        )}
        style={{
          backgroundColor: getScrolledBgColor(),
          color: textColor,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center h-full">
            {/* Left side - Logo or Back button */}
            <div className="flex items-center gap-6 min-w-40">
              {showBackButton ? (
                <button
                  onClick={handleBackClick}
                  className="flex items-center space-x-2 transition-colors duration-200 group"
                  style={{ color: textColor }}
                >
                  <div
                    className="w-8 h-8 border flex items-center justify-center transition-colors duration-200"
                    style={{ borderColor: `${textColor}33` }}
                  >
                    <div className="w-0 h-0 border-r-[6px] border-r-current border-y-[3px] border-y-transparent" />
                  </div>
                  <span className="text-sm font-medium tracking-widest uppercase">
                    Retour
                  </span>
                </button>
              ) : (
                <Link
                  href="/"
                  aria-label="Accueil"
                  className="flex items-center px-3 py-2 transition-colors duration-200 hover:opacity-80"
                  onClick={handleLogoClick}
                >
                  <div className="h-8 flex items-center">
                    <Image
                      src={navbarLogoUrl}
                      alt="Logo"
                      width={200}
                      height={100}
                      priority
                      className="h-full w-auto object-contain"
                    />
                  </div>
                </Link>
              )}
            </div>

            {/* Center - Title (when showBackButton) or Desktop Navigation (when traditional/hybrid) */}
            <div className={cn("flex-1 flex", alignmentClass)}>
              {showBackButton && title ? (
                <div className="text-center">
                  <h1
                    className="text-lg font-bold tracking-wide"
                    style={{ color: textColor }}
                  >
                    {title}
                  </h1>
                  {subtitle && (
                    <p
                      className="text-xs tracking-[0.2em] uppercase opacity-60"
                      style={{ color: textColor }}
                    >
                      {subtitle}
                    </p>
                  )}
                </div>
              ) : showTraditionalMenu ? (
                <div
                  className="hidden md:flex items-center"
                  style={{ gap: menu.itemSpacing || 32 }}
                >
                  {nestedItems.map((item) => (
                    <NavItem
                      key={item.id}
                      item={item}
                      menu={menu}
                      pathname={pathname}
                    />
                  ))}
                </div>
              ) : null}
            </div>

            {/* Right side - Hamburger menu button (only when needed) */}
            <div className="flex items-center justify-end min-w-40">
              {showHamburger && (
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="w-8 h-8 border flex flex-col items-center justify-center space-y-1 transition-colors duration-200"
                  style={{ borderColor: `${textColor}33` }}
                  aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
                >
                  <div
                    className={cn(
                      "w-4 h-px transition-all duration-300",
                      mobileOpen && "rotate-45 translate-y-1.5",
                    )}
                    style={{ backgroundColor: textColor }}
                  />
                  <div
                    className={cn(
                      "w-4 h-px transition-all duration-300",
                      mobileOpen && "opacity-0",
                    )}
                    style={{ backgroundColor: textColor }}
                  />
                  <div
                    className={cn(
                      "w-4 h-px transition-all duration-300",
                      mobileOpen && "-rotate-45 -translate-y-1.5",
                    )}
                    style={{ backgroundColor: textColor }}
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu
            items={nestedItems}
            menu={menu}
            pathname={pathname}
            navbarHeight={navbarHeight}
            onClose={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================
// NAV ITEM (Desktop)
// ============================================

interface NavItemProps {
  item: NavigationItem;
  menu: NavigationMenu;
  pathname: string;
}

function NavItem({ item, menu, pathname }: NavItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasChildren = item.children && item.children.length > 0;

  const active = isItemActive(item, pathname);
  const href = getItemHref(item);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsOpen(true), menu.dropdownDelay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  const anim =
    dropdownAnimations[menu.dropdownAnimation as DropdownAnimation] ||
    dropdownAnimations.fadeDown;

  // Get colors from menu with sensible defaults
  const textColor = menu.textColor || "#000000";
  const activeColor = menu.activeColor || textColor;
  const hoverColor = menu.hoverColor || "#666666";
  const fontSize = menu.fontSize || 14;

  // For parent items with no href/pageSlug, they should not be clickable
  const isClickable = !!(item.href || item.pageSlug);

  const itemContent = (
    <span
      className={cn(
        "flex items-center gap-1 font-medium tracking-wide transition-colors duration-200",
        item.highlighted &&
          "px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800",
      )}
      style={{
        color: item.highlighted ? undefined : active ? activeColor : textColor,
        fontSize,
      }}
      onMouseEnter={(e) =>
        !item.highlighted && (e.currentTarget.style.color = hoverColor)
      }
      onMouseLeave={(e) =>
        !item.highlighted &&
        (e.currentTarget.style.color = active ? activeColor : textColor)
      }
    >
      {item.label}
      {hasChildren && (
        <ChevronDown
          className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")}
        />
      )}
      {item.openInNewTab && !hasChildren && (
        <ExternalLink className="w-3 h-3 opacity-50" />
      )}
    </span>
  );

  return (
    <div
      className="relative"
      onMouseEnter={hasChildren ? handleMouseEnter : undefined}
      onMouseLeave={hasChildren ? handleMouseLeave : undefined}
    >
      {hasChildren && !isClickable ? (
        <button className="cursor-pointer">{itemContent}</button>
      ) : (
        <Link
          href={href}
          target={item.openInNewTab ? "_blank" : undefined}
          rel={item.openInNewTab ? "noopener noreferrer" : undefined}
        >
          {itemContent}
        </Link>
      )}

      {/* Dropdown */}
      <AnimatePresence>
        {hasChildren && isOpen && (
          <motion.div
            initial={anim.initial}
            animate={anim.animate}
            exit={anim.exit}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 min-w-[200px] bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50"
          >
            {item.children!.map((child) => {
              const childHref = getItemHref(child);
              const childActive = isItemActive(child, pathname);

              return (
                <Link
                  key={child.id}
                  href={childHref}
                  target={child.openInNewTab ? "_blank" : undefined}
                  rel={child.openInNewTab ? "noopener noreferrer" : undefined}
                  className={cn(
                    "block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors",
                    childActive && "bg-gray-50 font-medium",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span>{child.label}</span>
                    {child.openInNewTab && (
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    )}
                  </div>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// MOBILE MENU
// ============================================

interface MobileMenuProps {
  items: NavigationItem[];
  menu: NavigationMenu;
  pathname: string;
  navbarHeight: number;
  onClose: () => void;
}

function MobileMenu({ items, menu, pathname, navbarHeight, onClose }: MobileMenuProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Block body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Get mobile menu colors from settings
  const mobileMenuBg = menu.mobileMenuBg || "rgba(0,0,0,0.95)";
  const mobileMenuText = menu.mobileMenuText || "#ffffff";
  const mobileMenuAccent = menu.mobileMenuAccent || "#f59e0b";
  const mobileMenuHover = menu.mobileMenuHover || "#999999";
  const mobileFontSize = menu.mobileFontSize || 18;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 backdrop-blur-lg overflow-hidden touch-none"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", overscrollBehavior: "contain" }}
      onClick={onClose}
      onTouchMove={(e) => e.preventDefault()}
      onWheel={(e) => e.stopPropagation()}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="absolute right-0 top-0 h-full w-80 border-l border-white/10 overflow-y-auto touch-auto"
        style={{ backgroundColor: mobileMenuBg, overscrollBehavior: "contain" }}
        onClick={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        <div className="p-8" style={{ paddingTop: navbarHeight + 16 }}>
          <div className="space-y-4">
            {items.map((item, index) => (
              <MobileMenuItem
                key={item.id}
                item={item}
                index={index}
                pathname={pathname}
                expanded={expandedItems.has(item.id)}
                onToggleExpand={() => toggleExpand(item.id)}
                onClose={onClose}
                textColor={mobileMenuText}
                accentColor={mobileMenuAccent}
                hoverColor={mobileMenuHover}
                fontSize={mobileFontSize}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                style={{ backgroundColor: mobileMenuText, color: mobileMenuBg }}
              >
                O
              </div>
              <span
                className="text-sm tracking-[0.2em] uppercase"
                style={{ color: mobileMenuText }}
              >
                Optique de Bourbon
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// MOBILE MENU ITEM
// ============================================

interface MobileMenuItemProps {
  item: NavigationItem;
  index: number;
  pathname: string;
  expanded: boolean;
  onToggleExpand: () => void;
  onClose: () => void;
  textColor: string;
  accentColor: string;
  hoverColor: string;
  fontSize: number;
}

function MobileMenuItem({
  item,
  index,
  pathname,
  expanded,
  onToggleExpand,
  onClose,
  textColor,
  accentColor,
  hoverColor,
  fontSize,
}: MobileMenuItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const href = getItemHref(item);
  const active = isItemActive(item, pathname);
  const isClickable = !!(item.href || item.pageSlug);

  const handleClick = () => {
    // If navigating to home, set flag to skip animation
    if (href === "/") {
      sessionStorage.setItem("scrollToContentReveal", "true");
    } else {
      sessionStorage.setItem("fromContentReveal", "true");
    }
    onClose();
  };

  // Determine current color based on state
  const currentColor = item.highlighted
    ? accentColor
    : active
      ? accentColor
      : isHovered
        ? hoverColor
        : textColor;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div
        className="flex items-center justify-between border-b pb-3"
        style={{ borderColor: `${textColor}20` }}
      >
        {hasChildren ? (
          // Items with children: clicking the label opens the dropdown
          <button
            onClick={onToggleExpand}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex-1 text-left font-medium tracking-wide transition-colors duration-200"
            style={{ color: currentColor, fontSize }}
          >
            {item.label}
          </button>
        ) : (
          // Items without children: clicking navigates
          <Link
            href={href}
            target={item.openInNewTab ? "_blank" : undefined}
            rel={item.openInNewTab ? "noopener noreferrer" : undefined}
            className="flex-1 font-medium tracking-wide transition-colors duration-200"
            style={{
              color: currentColor,
              fontWeight: active ? 700 : 500,
              fontSize,
            }}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {item.label}
          </Link>
        )}
        {hasChildren && (
          <button
            onClick={onToggleExpand}
            className="p-2"
            style={{ color: textColor }}
          >
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform",
                expanded && "rotate-180",
              )}
            />
          </button>
        )}
      </div>

      {/* Sub-items */}
      <AnimatePresence>
        {hasChildren && expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pl-4 pt-2 space-y-2">
              {item.children!.map((child) => {
                const childHref = getItemHref(child);
                const childActive = isItemActive(child, pathname);

                return (
                  <Link
                    key={child.id}
                    href={childHref}
                    target={child.openInNewTab ? "_blank" : undefined}
                    rel={child.openInNewTab ? "noopener noreferrer" : undefined}
                    className="block text-sm py-1 transition-colors hover:opacity-70"
                    style={{
                      color: childActive ? accentColor : textColor,
                      opacity: childActive ? 1 : 0.7,
                      fontWeight: childActive ? 500 : 400,
                    }}
                    onClick={handleClick}
                  >
                    {child.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
