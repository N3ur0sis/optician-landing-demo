'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApparence } from '@/lib/apparence-context';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  order: number;
  published: boolean;
  highlighted?: boolean;
  openInNewTab?: boolean;
}

interface PageNavigationProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  variant?: 'default' | 'home';
  visible?: boolean;
}

const PageNavigation = ({
  title,
  subtitle,
  showBackButton = true,
  variant = 'default',
  visible = true,
}: PageNavigationProps) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cameFromContentReveal, setCameFromContentReveal] = useState(false);
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const { settings: apparenceSettings } = useApparence();
  const navbarLogoUrl = apparenceSettings.navbar_logo_url;
  const isHome = variant === 'home';

  // Fetch navigation items from database
  useEffect(() => {
    const fetchNavigation = async () => {
      try {
        const response = await fetch('/api/navigation/items?onlyPublished=true');
        if (response.ok) {
          const items = await response.json();
          // Sort by order and filter published items
          const sortedItems = items
            .filter((item: NavigationItem) => item.published)
            .sort((a: NavigationItem, b: NavigationItem) => a.order - b.order);
          setNavigationItems(sortedItems);
        }
      } catch (error) {
        console.error('Failed to fetch navigation:', error);
        // Fallback to default navigation
        setNavigationItems([
          { id: '1', label: 'Accueil', href: '/', order: 1, published: true },
          { id: '2', label: 'Qui est ODB ?', href: '/maison', order: 2, published: true },
          { id: '3', label: 'Nos boutiques', href: '/boutiques', order: 3, published: true },
          { id: '4', label: 'Actualités', href: '/magazine', order: 4, published: true },
          { id: '5', label: 'Services', href: '/services', order: 5, published: true },
          { id: '6', label: 'Rendez-vous', href: '/rendez-vous', order: 6, published: true },
        ]);
      }
    };

    fetchNavigation();
  }, []);

  useEffect(() => {
    const fromContentReveal = sessionStorage.getItem('fromContentReveal');
    if (fromContentReveal === 'true') {
      setCameFromContentReveal(true);
    }
  }, []);

  useEffect(() => {
    if (!visible) {
      setIsMenuOpen(false);
    }
  }, [visible]);

  const handleBackClick = () => {
    if (cameFromContentReveal) {
      sessionStorage.removeItem('fromContentReveal');
      sessionStorage.setItem('scrollToContentReveal', 'true');
      router.push('/');
      return;
    }
    router.back();
  };

  const navBackgroundClass = isHome
    ? 'bg-white/20 backdrop-blur-md shadow-[0_12px_30px_-20px_rgba(0,0,0,0.35)]'
    : 'bg-black/80 backdrop-blur-md border-b border-white/10';

  const overlayBackgroundClass = isHome ? 'bg-black/60' : 'bg-black/90';
  const panelBackgroundClass = isHome ? 'bg-black/70' : 'bg-black/90';

  const backButtonTextClass = isHome ? 'text-black hover:text-black/70' : 'text-white hover:text-gray-300';
  const backButtonBorderClass = isHome
    ? 'border-black/20 group-hover:border-black/40'
    : 'border-white/30 group-hover:border-white/50';
  const brandWrapperClass = isHome
    ? 'hover:bg-white/10'
    : 'bg-white/10 hover:bg-white/20';
  const burgerBorderClass = isHome ? 'border-black/20 hover:border-black/40' : 'border-white/30 hover:border-white/50';
  const burgerLineColor = isHome ? 'bg-black' : 'bg-white';

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.nav
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className={`fixed top-0 left-0 right-0 z-50 ${navBackgroundClass}`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center h-16">
                <div className="flex items-center gap-6 min-w-[160px]">
                  {showBackButton ? (
                    <button
                      onClick={handleBackClick}
                      className={`flex items-center space-x-2 transition-colors duration-200 group ${backButtonTextClass}`}
                    >
                      <div className={`w-8 h-8 border flex items-center justify-center transition-colors duration-200 ${backButtonBorderClass}`}>
                        <div className="w-0 h-0 border-r-[6px] border-r-current border-y-[3px] border-y-transparent"></div>
                      </div>
                      <span className="text-sm font-medium tracking-[0.1em] uppercase">Retour</span>
                    </button>
                  ) : (
                    <Link
                      href="/"
                      aria-label="Optique de Bourbon"
                      className={`flex items-center px-3 py-2 transition-colors duration-200 ${brandWrapperClass}`}
                    >
                        <div className="h-8 flex items-center">
                        <Image
                          src={navbarLogoUrl}
                          alt="Optique de Bourbon"
                          width={200}
                          height={100}
                          priority
                          className="h-full w-auto object-contain"
                        />
                        </div>
                    </Link>
                  )}
                </div>

                <div className="flex-1 flex justify-center">
                  {showBackButton && title && (
                    <div className="text-center">
                      <h1 className="text-white text-lg font-bold tracking-wide">{title}</h1>
                      {subtitle && (
                        <p className="text-white/60 text-xs tracking-[0.2em] uppercase">{subtitle}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end min-w-[160px]">
                  <button
                    onClick={() => setIsMenuOpen((open) => !open)}
                    className={`w-8 h-8 border flex flex-col items-center justify-center space-y-1 transition-colors duration-200 group ${burgerBorderClass}`}
                    aria-label="Ouvrir le menu"
                  >
                    <div className={`w-4 h-px transition-all duration-300 ${burgerLineColor} ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                    <div className={`w-4 h-px transition-all duration-300 ${burgerLineColor} ${isMenuOpen ? 'opacity-0' : ''}`}></div>
                    <div className={`w-4 h-px transition-all duration-300 ${burgerLineColor} ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
                  </button>
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {visible && isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-40 ${overlayBackgroundClass} backdrop-blur-lg`}
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className={`absolute right-0 top-0 h-full w-80 border-l border-white/10 ${panelBackgroundClass}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 pt-24">
                <div className="space-y-6">
                  {navigationItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        target={item.openInNewTab ? '_blank' : undefined}
                        rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                        className={`block text-lg font-medium tracking-wide border-b border-white/10 pb-3 transition-colors duration-200 ${
                          item.highlighted 
                            ? 'text-yellow-400 hover:text-yellow-300' 
                            : 'text-white hover:text-gray-300'
                        }`}
                        onClick={() => {
                          if (!showBackButton && item.href !== '/') {
                            sessionStorage.setItem('fromContentReveal', 'true');
                          }
                          setIsMenuOpen(false);
                        }}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-12 pt-8 border-t border-white/10"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold">
                      O
                    </div>
                    <span className="text-white text-sm tracking-[0.2em] uppercase">Optique de Bourbon</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PageNavigation;
