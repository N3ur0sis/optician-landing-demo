'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  parentId?: string;
  order: number;
  depth: number;
  pageSlug?: string;
  openInNewTab: boolean;
  icon?: string;
  iconPosition: string;
  cssClass?: string;
  style: Record<string, unknown>;
  dropdownStyle: string;
  published: boolean;
  highlighted: boolean;
  children?: NavigationItem[];
}

interface NavigationMenu {
  id: string;
  name: string;
  slug: string;
  type: string;
  position: string;
  layout: string;
  alignment: string;
  animation: string;
  animationDuration: number;
  backgroundColor?: string;
  textColor?: string;
  hoverColor?: string;
  activeColor?: string;
  borderColor?: string;
  itemSpacing: number;
  padding?: string;
  dropdownAnimation: string;
  dropdownDelay: number;
  customCSS?: string;
  cssClasses?: string;
  mobileBreakpoint: number;
  mobileStyle: string;
  published: boolean;
  items: NavigationItem[];
}

interface DynamicNavbarProps {
  menuSlug?: string;
  className?: string;
  logo?: React.ReactNode;
}

// Animation variants
const menuAnimations = {
  none: {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit: { opacity: 1 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
};

const dropdownAnimations = {
  none: {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit: { opacity: 1 },
  },
  fadeDown: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },
  slideDown: {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: 'auto' },
    exit: { opacity: 0, height: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95, y: -5 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -5 },
  },
};

// Build nested items structure
function buildNestedItems(items: NavigationItem[], parentId: string | null = null): NavigationItem[] {
  return items
    .filter(item => item.parentId === parentId && item.published)
    .sort((a, b) => a.order - b.order)
    .map(item => ({
      ...item,
      children: buildNestedItems(items, item.id),
    }));
}

export default function DynamicNavbar({ menuSlug = 'header', className, logo }: DynamicNavbarProps) {
  const [menu, setMenu] = useState<NavigationMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Fetch menu data
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`/api/navigation/menus/${menuSlug}?nested=true`);
        if (response.ok) {
          const data = await response.json();
          setMenu(data);
        }
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [menuSlug]);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < (menu?.mobileBreakpoint || 768));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [menu?.mobileBreakpoint]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (loading || !menu || !menu.published) {
    return null;
  }

  const nestedItems = buildNestedItems(menu.items);
  const animation = menuAnimations[menu.animation as keyof typeof menuAnimations] || menuAnimations.none;

  // Custom styles
  const navStyle: React.CSSProperties = {
    backgroundColor: menu.backgroundColor || undefined,
    color: menu.textColor || undefined,
    borderColor: menu.borderColor || undefined,
    padding: menu.padding || undefined,
  };

  return (
    <>
      {/* Inject custom CSS */}
      {menu.customCSS && (
        <style dangerouslySetInnerHTML={{ __html: menu.customCSS }} />
      )}

      <motion.nav
        initial={animation.initial}
        animate={animation.animate}
        transition={{ duration: menu.animationDuration / 1000 }}
        style={navStyle}
        className={cn(
          'relative z-50',
          menu.cssClasses,
          className
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={cn(
            'flex items-center h-16',
            menu.alignment === 'left' && 'justify-start',
            menu.alignment === 'center' && 'justify-center',
            menu.alignment === 'right' && 'justify-end',
            menu.alignment === 'space-between' && 'justify-between',
          )}>
            {/* Logo */}
            {logo && (
              <div className="flex-shrink-0">
                {logo}
              </div>
            )}

            {/* Desktop Navigation */}
            {!isMobile && (
              <div
                className={cn(
                  'hidden md:flex items-center',
                  menu.layout === 'horizontal' && 'flex-row',
                  menu.layout === 'vertical' && 'flex-col',
                )}
                style={{ gap: menu.itemSpacing }}
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
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-md hover:bg-black/5 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <X className="w-6 h-6" style={{ color: menu.textColor || 'currentColor' }} />
                ) : (
                  <Menu className="w-6 h-6" style={{ color: menu.textColor || 'currentColor' }} />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobile && mobileOpen && (
            <MobileMenu
              items={nestedItems}
              menu={menu}
              pathname={pathname}
              onClose={() => setMobileOpen(false)}
            />
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}

// NavItem Component
interface NavItemProps {
  item: NavigationItem;
  menu: NavigationMenu;
  pathname: string;
  depth?: number;
}

function NavItem({ item, menu, pathname, depth = 0 }: NavItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasChildren = item.children && item.children.length > 0;
  
  const isActive = item.href === pathname || 
    (item.pageSlug && pathname === `/${item.pageSlug}`);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, menu.dropdownDelay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const dropdownAnim = dropdownAnimations[menu.dropdownAnimation as keyof typeof dropdownAnimations] || dropdownAnimations.fadeDown;

  const linkStyle: React.CSSProperties = {
    color: isActive ? menu.activeColor || menu.textColor : menu.textColor,
  };

  const content = (
    <>
      {item.icon && item.iconPosition === 'left' && (
        <span className="mr-1">{item.icon}</span>
      )}
      <span>{item.label}</span>
      {item.icon && item.iconPosition === 'right' && (
        <span className="ml-1">{item.icon}</span>
      )}
      {hasChildren && (
        <ChevronDown className={cn(
          'w-4 h-4 ml-1 transition-transform',
          isOpen && 'rotate-180'
        )} />
      )}
      {item.openInNewTab && !hasChildren && (
        <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
      )}
    </>
  );

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {item.href ? (
        <Link
          href={item.href}
          target={item.openInNewTab ? '_blank' : undefined}
          rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
          style={linkStyle}
          className={cn(
            'flex items-center px-3 py-2 text-sm font-medium transition-colors rounded-md',
            'hover:bg-black/5',
            isActive && 'font-semibold',
            item.highlighted && 'bg-black text-white hover:bg-gray-800 rounded-full px-4',
            item.cssClass
          )}
        >
          {content}
        </Link>
      ) : (
        <button
          style={linkStyle}
          className={cn(
            'flex items-center px-3 py-2 text-sm font-medium transition-colors rounded-md',
            'hover:bg-black/5',
            item.cssClass
          )}
        >
          {content}
        </button>
      )}

      {/* Dropdown */}
      <AnimatePresence>
        {hasChildren && isOpen && (
          <motion.div
            initial={dropdownAnim.initial}
            animate={dropdownAnim.animate}
            exit={dropdownAnim.exit}
            transition={{ duration: menu.animationDuration / 1000 }}
            className={cn(
              'absolute top-full left-0 mt-1 min-w-[200px]',
              'bg-white rounded-lg shadow-lg border border-gray-200 py-2 overflow-hidden',
              item.dropdownStyle === 'mega' && 'min-w-[400px]',
              item.dropdownStyle === 'flyout' && 'left-full top-0 ml-1 mt-0'
            )}
            style={{
              backgroundColor: menu.backgroundColor || '#ffffff',
            }}
          >
            {item.children!.map((child) => (
              <NavItem
                key={child.id}
                item={child}
                menu={menu}
                pathname={pathname}
                depth={depth + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Mobile Menu Component
interface MobileMenuProps {
  items: NavigationItem[];
  menu: NavigationMenu;
  pathname: string;
  onClose: () => void;
}

function MobileMenu({ items, menu, pathname, onClose }: MobileMenuProps) {
  const mobileAnimations = {
    hamburger: {
      initial: { opacity: 0, y: -10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
    },
    slide: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
    },
    accordion: {
      initial: { opacity: 0, height: 0 },
      animate: { opacity: 1, height: 'auto' },
      exit: { opacity: 0, height: 0 },
    },
  };

  const animation = mobileAnimations[menu.mobileStyle as keyof typeof mobileAnimations] || mobileAnimations.hamburger;

  if (menu.mobileStyle === 'slide') {
    return (
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40"
        />
        
        {/* Slide Panel */}
        <motion.div
          initial={animation.initial}
          animate={animation.animate}
          exit={animation.exit}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 bottom-0 w-80 bg-white z-50 shadow-xl overflow-y-auto"
          style={{ backgroundColor: menu.backgroundColor || '#ffffff' }}
        >
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <span className="font-semibold" style={{ color: menu.textColor }}>Menu</span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" style={{ color: menu.textColor || 'currentColor' }} />
            </button>
          </div>
          <div className="p-4">
            {items.map((item) => (
              <MobileNavItem
                key={item.id}
                item={item}
                menu={menu}
                pathname={pathname}
                style={menu.mobileStyle}
              />
            ))}
          </div>
        </motion.div>
      </>
    );
  }

  // Hamburger or Accordion style
  return (
    <motion.div
      initial={animation.initial}
      animate={animation.animate}
      exit={animation.exit}
      transition={{ duration: menu.animationDuration / 1000 }}
      className="md:hidden border-t border-gray-200"
      style={{ backgroundColor: menu.backgroundColor || '#ffffff' }}
    >
      <div className="px-4 py-2 space-y-1">
        {items.map((item) => (
          <MobileNavItem
            key={item.id}
            item={item}
            menu={menu}
            pathname={pathname}
            style={menu.mobileStyle}
          />
        ))}
      </div>
    </motion.div>
  );
}

// Mobile Nav Item
interface MobileNavItemProps {
  item: NavigationItem;
  menu: NavigationMenu;
  pathname: string;
  style: string;
  depth?: number;
}

function MobileNavItem({ item, menu, pathname, style, depth = 0 }: MobileNavItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  
  const isActive = item.href === pathname || 
    (item.pageSlug && pathname === `/${item.pageSlug}`);

  const linkStyle: React.CSSProperties = {
    color: isActive ? menu.activeColor || menu.textColor : menu.textColor,
    paddingLeft: depth * 16,
  };

  return (
    <div>
      <div className="flex items-center">
        {item.href ? (
          <Link
            href={item.href}
            target={item.openInNewTab ? '_blank' : undefined}
            rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
            style={linkStyle}
            className={cn(
              'flex-1 flex items-center px-3 py-3 text-sm font-medium transition-colors rounded-md',
              'hover:bg-black/5',
              isActive && 'font-semibold bg-black/5',
              item.highlighted && 'bg-black text-white hover:bg-gray-800',
              item.cssClass
            )}
          >
            {item.label}
            {item.openInNewTab && (
              <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
            )}
          </Link>
        ) : (
          <button
            onClick={() => hasChildren && setIsExpanded(!isExpanded)}
            style={linkStyle}
            className={cn(
              'flex-1 flex items-center justify-between px-3 py-3 text-sm font-medium transition-colors rounded-md',
              'hover:bg-black/5',
              item.cssClass
            )}
          >
            <span>{item.label}</span>
          </button>
        )}
        
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-3 hover:bg-black/5 rounded-md"
          >
            <ChevronDown
              className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-180')}
              style={{ color: menu.textColor || 'currentColor' }}
            />
          </button>
        )}
      </div>

      {/* Children */}
      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {item.children!.map((child) => (
              <MobileNavItem
                key={child.id}
                item={child}
                menu={menu}
                pathname={pathname}
                style={style}
                depth={depth + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Export a simple footer navigation component
export function DynamicFooterNav({ menuSlug = 'footer', className }: { menuSlug?: string; className?: string }) {
  const [menu, setMenu] = useState<NavigationMenu | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`/api/navigation/menus/${menuSlug}?nested=true`);
        if (response.ok) {
          const data = await response.json();
          setMenu(data);
        }
      } catch (error) {
        console.error('Error fetching footer menu:', error);
      }
    };

    fetchMenu();
  }, [menuSlug]);

  if (!menu || !menu.published) {
    return null;
  }

  const nestedItems = buildNestedItems(menu.items);

  return (
    <>
      {menu.customCSS && (
        <style dangerouslySetInnerHTML={{ __html: menu.customCSS }} />
      )}
      
      <nav
        className={cn(
          menu.cssClasses,
          className
        )}
        style={{
          backgroundColor: menu.backgroundColor || undefined,
          color: menu.textColor || undefined,
          padding: menu.padding || undefined,
        }}
      >
        <div
          className={cn(
            'flex',
            menu.layout === 'horizontal' && 'flex-row flex-wrap',
            menu.layout === 'vertical' && 'flex-col',
            menu.layout === 'grid' && 'grid grid-cols-2 md:grid-cols-4',
            menu.alignment === 'left' && 'justify-start',
            menu.alignment === 'center' && 'justify-center',
            menu.alignment === 'right' && 'justify-end',
            menu.alignment === 'space-between' && 'justify-between',
          )}
          style={{ gap: menu.itemSpacing }}
        >
          {nestedItems.map((item) => (
            <FooterNavItem
              key={item.id}
              item={item}
              menu={menu}
              pathname={pathname}
            />
          ))}
        </div>
      </nav>
    </>
  );
}

// Footer Nav Item
function FooterNavItem({ item, menu, pathname }: { item: NavigationItem; menu: NavigationMenu; pathname: string }) {
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.href === pathname || (item.pageSlug && pathname === `/${item.pageSlug}`);

  const linkStyle: React.CSSProperties = {
    color: isActive ? menu.activeColor || menu.textColor : menu.textColor,
  };

  // If has children, render as a column with heading
  if (hasChildren) {
    return (
      <div className="space-y-3">
        {item.href ? (
          <Link
            href={item.href}
            style={linkStyle}
            className={cn(
              'block font-semibold text-sm hover:opacity-80 transition-opacity',
              item.cssClass
            )}
          >
            {item.label}
          </Link>
        ) : (
          <span
            style={linkStyle}
            className={cn('block font-semibold text-sm', item.cssClass)}
          >
            {item.label}
          </span>
        )}
        <ul className="space-y-2">
          {item.children!.map((child) => (
            <li key={child.id}>
              <Link
                href={child.href || '#'}
                target={child.openInNewTab ? '_blank' : undefined}
                rel={child.openInNewTab ? 'noopener noreferrer' : undefined}
                style={{
                  color: pathname === child.href || (child.pageSlug && pathname === `/${child.pageSlug}`)
                    ? menu.activeColor || menu.textColor
                    : menu.textColor,
                }}
                className={cn(
                  'text-sm opacity-70 hover:opacity-100 transition-opacity flex items-center gap-1',
                  child.cssClass
                )}
              >
                {child.label}
                {child.openInNewTab && <ExternalLink className="w-3 h-3" />}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Single link item
  return (
    <Link
      href={item.href || '#'}
      target={item.openInNewTab ? '_blank' : undefined}
      rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
      style={linkStyle}
      className={cn(
        'text-sm hover:opacity-80 transition-opacity flex items-center gap-1',
        item.highlighted && 'font-semibold',
        item.cssClass
      )}
    >
      {item.label}
      {item.openInNewTab && <ExternalLink className="w-3 h-3" />}
    </Link>
  );
}
