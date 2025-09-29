'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MotionValue } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useRef, useEffect } from 'react';

type ContentRevealProps = {
  scrollProgress?: MotionValue<number>;
  cameraZ?: number;
  forceRevealed?: boolean;
};

type Tile = {
  title: string;
  href: string;
  background: string;
  span?: string;
  overlay?: 'light' | 'dark';
  caption?: string;
};

const tiles: Tile[] = [
  {
    title: 'Qui est ODB ?',
    caption: 'Découvrir la maison',
    href: '/maison',
    // Updated to a warm interior / atelier photo for the "about" card
    background: 'url(https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80)',
    span: 'lg:col-span-4 lg:row-span-2',
    overlay: 'dark',
  },
  {
    title: 'Nos boutiques',
    caption: 'Toutes les adresses',
    href: '/boutiques',
    background: 'url(https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&h=400&fit=crop&crop=center)',
    span: 'lg:col-span-2',
    overlay: 'dark',
  },
  {
    title: 'Actualités',
    caption: 'Le journal ODB',
    href: '/magazine',
    background: 'url(https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=400&fit=crop&crop=center)',
    span: 'lg:col-span-2',
    overlay: 'dark',
  },
  {
    title: 'Prenez rendez-vous',
    caption: 'Réserver en ligne',
    href: '/rendez-vous',
    // Updated to a different calendar image for the "appointment" card
    background: 'url(https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1400&q=80)',
    span: 'lg:col-span-4 lg:row-span-2',
    overlay: 'dark',
  },
  {
    title: 'Créateurs',
    caption: 'Sélection exclusive',
    href: '/collections/createurs',
    background: 'url(https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=400&fit=crop&crop=center)',
    span: 'lg:col-span-2',
    overlay: 'dark',
  },
  {
    title: 'Services',
    caption: 'Voir les expertises',
    href: '/services',
    background: 'url(https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=600&h=400&fit=crop&crop=center)',
    span: 'lg:col-span-2',
    overlay: 'dark',
  },
];

const ContentReveal = ({ cameraZ = 100, forceRevealed = false }: ContentRevealProps) => {
  const blurAmount = forceRevealed ? 0 : Math.max(0, (cameraZ / 100) * 20);
  const opacity = forceRevealed ? 1 : Math.max(0.1, 1 - (cameraZ / 100) * 0.8);
  const isContentRevealed = forceRevealed || blurAmount < 5; // Content is considered revealed when blur is minimal
  const router = useRouter();
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Force click handlers
  useEffect(() => {
    cardRefs.current.forEach((card, index) => {
      if (card) {
        const handleForceClick = (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('Force click:', tiles[index].title);
          // Set flag to indicate user came from content reveal
          sessionStorage.setItem('fromContentReveal', 'true');
          router.push(tiles[index].href);
        };
        
        card.addEventListener('click', handleForceClick, { passive: false });
        
        return () => {
          card.removeEventListener('click', handleForceClick);
        };
      }
    });
  }, [router]);

  return (
    <motion.div
      className={`absolute inset-0 ${isContentRevealed ? 'z-[25]' : 'z-[5]'}`}
      style={{
        filter: `blur(${blurAmount}px)` ,
        opacity,
        transition: 'filter 0.3s ease-out, opacity 0.3s ease-out',
        pointerEvents: 'auto'
      }}
    >
      {/* Force cards to be clickable with CSS */}
      <style jsx>{`
        .content-reveal-card {
          pointer-events: auto !important;
          position: relative !important;
          z-index: 50 !important;
          cursor: pointer !important;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(1px);
        }
        .content-reveal-card:hover {
          transform: scale(1.02) !important;
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        .content-reveal-card * {
          pointer-events: auto !important;
        }
        .content-reveal-grid {
          pointer-events: auto !important;
          position: relative !important;
          z-index: 40 !important;
        }
        .content-reveal-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          z-index: 1;
        }
        .content-reveal-card:hover::before {
          opacity: 1;
        }
      `}</style>
      
      <div className="absolute inset-0 bg-gradient-to-br from-[#fdfbf7] via-[#f5eee6] to-[#f1e2d2]" />

      <div className="relative h-full w-full overflow-y-auto" data-reveal-scroll>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pb-24 pt-16 sm:px-6 md:px-10 lg:px-12 xl:px-16">
          <div className="flex items-center justify-center py-6">
            <span className="text-sm tracking-[0.3em] text-neutral-500 uppercase">Optique de Bourbon</span>
          </div>

          <div className="content-reveal-grid grid auto-rows-[220px] gap-5 sm:auto-rows-[260px] lg:auto-rows-[320px] lg:grid-cols-4" style={{ pointerEvents: 'auto', position: 'relative', zIndex: 40 }}>
            {tiles.map((tile, index) => (
              <Link
                key={tile.title}
                href={tile.href}
                ref={(el) => { cardRefs.current[index] = el; }}
                className={`content-reveal-card group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-black/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer transform-gpu z-[30] pointer-events-auto ${
                  tile.span ?? ''
                }`}
                style={{
                  pointerEvents: 'auto',
                  position: 'relative',
                  zIndex: 30
                }}
                onClick={(e) => {
                  console.log('Link clicked:', tile.title);
                  // Set flag to indicate user came from content reveal
                  sessionStorage.setItem('fromContentReveal', 'true');
                  // Allow normal navigation
                }}
                onMouseEnter={() => {
                  console.log('Card hovered:', tile.title);
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={forceRevealed ? { opacity: 1, y: 0 } : {}}
                  whileInView={!forceRevealed ? { opacity: 1, y: 0 } : {}}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  whileFocus={{ 
                    scale: 1.01,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  whileTap={{ 
                    scale: 0.99,
                    transition: { duration: 0.1, ease: "easeInOut" }
                  }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  viewport={{ once: true, amount: 0.4 }}
                  className="relative h-full w-full cursor-pointer"
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage: tile.background,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                  <div
                    className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-all duration-500"
                  />
                  {/* Professional grid overlay */}
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-5 transition-opacity duration-500" 
                    style={{
                      backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: '20px 20px'
                    }}
                  />
                  <div className="relative flex h-full flex-col justify-between p-6 lg:p-8">
                    {/* Top section - Category indicator */}
                    <div className="flex justify-between items-start">
                      <div className="bg-white/10 backdrop-blur-sm px-3 py-1 text-xs font-medium tracking-[0.2em] text-white uppercase">
                        {tile.caption}
                      </div>
                      <div className="w-6 h-6 border border-white/30 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white/80 transform rotate-45"></div>
                      </div>
                    </div>
                    
                    {/* Bottom section - Title and CTA */}
                    <div>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-4 leading-tight">
                        {tile.title}
                      </h2>
                      <div className="flex items-center text-white/80 group-hover:text-white transition-colors duration-300">
                        <span className="text-sm font-medium tracking-[0.15em] uppercase mr-3">
                          Explorer
                        </span>
                        <div className="flex items-center space-x-1 transform group-hover:translate-x-2 transition-transform duration-300">
                          <div className="w-8 h-px bg-current"></div>
                          <div className="w-0 h-0 border-l-[6px] border-l-current border-y-[3px] border-y-transparent"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContentReveal;
