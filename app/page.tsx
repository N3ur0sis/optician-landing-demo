'use client';

import GlassesModel from '../components/GlassesModel';
import ContentReveal from '../components/ContentReveal';
import CustomCursor from '../components/CustomCursor';
import MagasinsDropdown from '../components/MagasinsDropdown';
import { motion, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { useContext, useRef, useState, useEffect } from 'react';
import { ScrollContext } from './ClientLayout';
import { FaInstagram, FaFacebook, FaBehance } from 'react-icons/fa';

// Remove the MagasinsDropdown component definition since it's now imported

export default function Page() {
  const { scroll } = useContext(ScrollContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cameraZ, setCameraZ] = useState(100);
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { once: true, amount: 0.3 });

  // Simulate loading completion
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Enhanced exponential curves for buttery smooth scroll-based text movement
  // Left text: elegant upward motion with luxury easing
  const leftY = useTransform(scroll, v => `${-850 * Math.pow(v as number, 2.2)}px`); 
  // Right text: sophisticated slower movement with refined curve
  const rightY = useTransform(scroll, v => `${-550 * Math.pow(v as number, 1.25)}px`); 
  // Model rotation progress with smooth interpolation
  const modelScroll = useTransform(scroll, [0, 1], [0, 1]);

  // Scroll-based opacity for SCROLL DOWN indicators
  const scrollIndicatorOpacity = useTransform(scroll, [0, 0.1], [1, 0]);
  // Fade out when glasses are put on (based on model scroll progress)
  const glassesOpacity = useTransform(modelScroll, [0, 0.3], [1, 0]);

  // Enhanced Animation variants for luxury experience
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.12,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.96
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1
    }
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0, rotate: -180 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0
    }
  };

  const socialVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1.0,
        staggerChildren: 0.08,
        delayChildren: 0.6
      }
    }
  };

  const socialItemVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1
    }
  };

  return (
    <main className="relative min-h-[300vh] w-full overflow-x-hidden font-poppins cursor-custom" ref={heroRef}>
      {/* Custom Cursor */}
      <CustomCursor />
      
      {/* Loading Screen */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            className="fixed inset-0 bg-white z-50 flex items-center justify-center"
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <motion.div
              className="flex flex-col items-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div
                className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white font-bold text-2xl"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                O
              </motion.div>
              <motion.div
                className="flex space-x-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen gradient background */}
      <div className="fixed inset-0 radial-gradient-bg z-0" />

      {/* Top left: Logo and name */}
      <motion.div 
        className="absolute top-0 left-0 flex items-center gap-2 p-4 sm:p-6 z-20 select-none"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        <motion.div 
          className="w-6 h-6 sm:w-8 sm:h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg cursor-pointer hover:scale-110 transition-all duration-300 hover:shadow-lg hover-lift"
          variants={logoVariants}
          transition={{ duration: 1.2, type: "spring", bounce: 0.3, delay: 0.2 }}
          whileHover={{ 
            scale: 1.15, 
            rotate: 5,
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          O
        </motion.div>
        <motion.span 
          className="text-sm sm:text-lg font-semibold tracking-widest text-black uppercase hover:text-gray-600 transition-colors duration-500 cursor-pointer"
          variants={itemVariants}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <span className="hidden sm:inline">Optique de Bourbon</span>
          <span className="sm:hidden">ODB</span>
        </motion.span>
      </motion.div>

      {/* Top right: Navbar links */}
      <motion.nav 
        className="absolute top-0 right-0 flex items-center gap-3 sm:gap-4 md:gap-6 p-4 sm:p-6 z-20 select-none"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        {/* Desktop Navigation - Show condensed version */}
        <div className="hidden lg:flex items-center gap-6">
          {[
            { label: 'ACCUEIL', href: 'https://odb.re/' },
            { label: 'SPORT', href: 'https://odb.re/odb-sport/' },
            { label: 'KIDS', href: 'https://odb.re/odb-kids/' },
            { label: 'LENTILLES', href: 'https://odb.re/choisir-ses-lentilles/' },
            { label: 'CONTACTS', href: 'https://odb.re/contacts/' },
          ].map((item, index) => (
            <motion.a 
              key={item.label}
              href={item.href}
              className="text-sm lg:text-base font-medium text-black hover:text-gray-600 transition-all duration-500 ease-out relative group underline-animate cursor-pointer"
              variants={itemVariants}
              transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.07 }}
              whileHover={{ y: -1 }}
              target="_blank" rel="noopener noreferrer"
            >
              {item.label}
            </motion.a>
          ))}
          <MagasinsDropdown />
        </div>

        {/* Tablet Navigation - More condensed */}
        <div className="hidden md:flex lg:hidden items-center gap-4">
          {[
            { label: 'ACCUEIL', href: 'https://odb.re/' },
            { label: 'SPORT', href: 'https://odb.re/odb-sport/' },
            { label: 'KIDS', href: 'https://odb.re/odb-kids/' },
            { label: 'CONTACTS', href: 'https://odb.re/contacts/' },
          ].map((item, index) => (
            <motion.a 
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-black hover:text-gray-600 transition-all duration-500 ease-out relative group underline-animate cursor-pointer"
              variants={itemVariants}
              transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.07 }}
              whileHover={{ y: -1 }}
              target="_blank" rel="noopener noreferrer"
            >
              {item.label}
            </motion.a>
          ))}
          <MagasinsDropdown />
        </div>

        {/* Mobile Navigation - Just essential items + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <motion.a 
            href="https://odb.re/"
            className="text-sm font-medium text-black hover:text-gray-600 transition-all duration-500 ease-out relative group underline-animate cursor-pointer"
            variants={itemVariants}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ y: -1 }}
            target="_blank" rel="noopener noreferrer"
          >
            ACCUEIL
          </motion.a>
          <MagasinsDropdown />
          
          {/* Mobile Menu Button */}
          <motion.button 
            className="text-black hover:text-gray-600 transition-colors duration-300 p-1"
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // For now, redirect to main site for full menu
              window.open('https://odb.re/', '_blank');
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>
      </motion.nav>

      {/* Bottom left: Social icons */}
      <motion.div 
        className="absolute bottom-0 left-0 flex flex-col items-start gap-2 sm:gap-3 p-4 sm:p-6 z-20 select-none"
        variants={socialVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        <motion.div className="flex gap-2 sm:gap-3 mb-2" variants={containerVariants}>
          {[ 
            { icon: FaFacebook, href: "https://www.facebook.com/ODBreunion/", label: "Facebook" },
            { icon: FaInstagram, href: "https://www.instagram.com/odbreunion/", label: "Instagram" }
          ].map(({ icon: Icon, href, label }, index) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-lg sm:text-xl text-black/70 hover:text-black transition-colors duration-300 rounded-full border border-black/10 hover:border-black/40 p-1.5 sm:p-2 cursor-pointer shadow-none"
              variants={socialItemVariants}
              transition={{ duration: 0.5, type: "spring", bounce: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.1, 
                y: -2
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon />
            </motion.a>
          ))}
        </motion.div>
        <motion.span 
          className="text-xs tracking-widest text-black/60 font-medium"
          variants={itemVariants}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          @optique
        </motion.span>
      </motion.div>

      {/* Side scroll indicators with animations - positioned closer to edges */}
      <motion.div 
        className="fixed left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 z-50 select-none flex-col items-center hidden xl:flex"
        initial={{ opacity: 0, x: -30 }}
        animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        style={{ 
          opacity: useTransform(
            [scroll, modelScroll],
            ([s, m]) => {
              const scrollFade = (s as number) > 0.1 ? 0 : 1 - (s as number) / 0.1;
              const glassesFade = (m as number) > 0.3 ? 0 : 1 - (m as number) / 0.3;
              return Math.min(scrollFade, glassesFade);
            }
          )
        }}
        whileHover={{ scale: 1.05, x: 8 }}
      >
        <motion.div
          className="flex flex-col items-center cursor-pointer group"
          animate={{ 
            y: [0, -6, 0]
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          {/* Top line */}
          <motion.div
            className="w-px h-6 bg-black/40 group-hover:bg-black/70 transition-colors duration-300"
            initial={{ scaleY: 0 }}
            animate={isLoaded ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          />
          
          {/* Rotated text - positioned with proper spacing */}
          <motion.div
            className="flex items-center justify-center py-4"
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
          >
            <motion.span 
              className="text-xs font-bold tracking-[0.3em] text-black/60 group-hover:text-black/90 rotate-[-90deg] whitespace-nowrap transition-colors duration-300 origin-center"
            >
              SCROLL DOWN
            </motion.span>
          </motion.div>
          
          {/* Bottom dot */}
          <motion.div
            className="w-1.5 h-1.5 bg-black/40 group-hover:bg-black/70 rounded-full transition-all duration-300"
            initial={{ scale: 0, opacity: 0.4 }}
            animate={isLoaded ? { 
              scale: 1,
              opacity: [0.4, 1, 0.4]
            } : { 
              scale: 0,
              opacity: 0.4
            }}
            transition={{ 
              scale: { duration: 0.4, delay: 1.8 },
              opacity: { 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0.5
              }
            }}
          />
        </motion.div>
      </motion.div>

      <motion.div 
        className="fixed right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 z-50 select-none flex-col items-center hidden xl:flex"
        initial={{ opacity: 0, x: 30 }}
        animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        style={{ 
          opacity: useTransform(
            [scroll, modelScroll],
            ([s, m]) => {
              const scrollFade = (s as number) > 0.1 ? 0 : 1 - (s as number) / 0.1;
              const glassesFade = (m as number) > 0.3 ? 0 : 1 - (m as number) / 0.3;
              return Math.min(scrollFade, glassesFade);
            }
          )
        }}
        whileHover={{ scale: 1.05, x: -8 }}
      >
        <motion.div
          className="flex flex-col items-center cursor-pointer group"
          animate={{ 
            y: [0, -6, 0]
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1.2
          }}
        >
          {/* Top line */}
          <motion.div
            className="w-px h-6 bg-black/40 group-hover:bg-black/70 transition-colors duration-300"
            initial={{ scaleY: 0 }}
            animate={isLoaded ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          />
          
          {/* Rotated text - positioned with proper spacing */}
          <motion.div
            className="flex items-center justify-center py-4"
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
          >
            <motion.span 
              className="text-xs font-bold tracking-[0.3em] text-black/60 group-hover:text-black/90 rotate-90 whitespace-nowrap transition-colors duration-300 origin-center"
            >
              SCROLL DOWN
            </motion.span>
          </motion.div>
          
          {/* Bottom dot */}
          <motion.div
            className="w-1.5 h-1.5 bg-black/40 group-hover:bg-black/70 rounded-full transition-all duration-300"
            initial={{ scale: 0, opacity: 0.4 }}
            animate={isLoaded ? { 
              scale: 1,
              opacity: [0.4, 1, 0.4]
            } : { 
              scale: 0,
              opacity: 0.4
            }}
            transition={{ 
              scale: { duration: 0.4, delay: 1.8 },
              opacity: { 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1.5
              }
            }}
          />
        </motion.div>
      </motion.div>

      {/* Bottom center mouse scroll indicator */}
      <motion.div 
        className="fixed bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-50 select-none flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        style={{ 
          opacity: useTransform(
            [scroll, modelScroll],
            ([s, m]) => {
              const scrollFade = (s as number) > 0.1 ? 0 : 1 - (s as number) / 0.1;
              const glassesFade = (m as number) > 0.3 ? 0 : 1 - (m as number) / 0.3;
              return Math.min(scrollFade, glassesFade);
            }
          )
        }}
        whileHover={{ scale: 1.1 }}
      >
        <motion.div
          className="flex flex-col items-center cursor-pointer group"
          animate={{ 
            y: [0, 4, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          {/* Mouse icon */}
          <motion.div
            className="w-6 h-10 border-2 border-black/40 group-hover:border-black/70 rounded-full flex justify-center transition-colors duration-300 mb-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <motion.div
              className="w-1 h-2 bg-black/40 group-hover:bg-black/70 rounded-full mt-2 transition-colors duration-300"
              animate={{ 
                y: [0, 4, 0],
                opacity: [0.4, 1, 0.4]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
          </motion.div>
          
          {/* Text */}
          <motion.span 
            className="text-xs font-medium tracking-[0.2em] text-black/50 group-hover:text-black/80 transition-colors duration-300 uppercase"
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            Scroll
          </motion.span>
        </motion.div>
      </motion.div>

      <section className="relative w-full min-h-screen z-10 overflow-hidden">
        {/* Content that appears behind glasses - blurred initially, sharp when glasses are on */}
        <ContentReveal scrollProgress={modelScroll} cameraZ={cameraZ} />
        
        {/* Fullscreen Centered Glasses Model - positioned naturally in the layout */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none overflow-hidden glasses-model-mobile"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 2.2 }}
        >
          <div className="w-full h-full max-w-full max-h-full relative flex items-center justify-center">
            <div className="w-full h-full min-h-0 min-w-0">
              <GlassesModel 
                scrollProgress={modelScroll} 
                onCameraZChange={setCameraZ}
              />
            </div>
          </div>
        </motion.div>

        {/* Left text - positioned with intelligent spacing based on viewport and model */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 z-10 select-none hero-spacing-left"
          initial={{ opacity: 0, x: -60 }}
          animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 1.5 }}
        >
          <motion.div
            className="font-bold text-black font-poppins leading-tight tracking-tight uppercase overflow-hidden hero-text-adaptive hero-text-narrow hero-text-desktop"
            style={{ 
              letterSpacing: '0.08em', 
              lineHeight: '1.1', 
              y: leftY 
            }}
          >
            <motion.div
              className="overflow-hidden cursor-hover"
              initial={{ y: '100%' }}
              animate={isLoaded ? { y: '0%' } : { y: '100%' }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 1.7 }}
            >
              <span className="hover:text-gray-600 transition-colors duration-500 block">OPTIQUE</span>
            </motion.div>
            <motion.div
              className="overflow-hidden cursor-hover"
              initial={{ y: '100%' }}
              animate={isLoaded ? { y: '0%' } : { y: '100%' }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 1.9 }}
            >
              <span className="hover:text-gray-600 transition-colors duration-500 block">DE BOURBON</span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right text - positioned with intelligent spacing based on viewport and model */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 z-10 select-none hero-spacing-right"
          initial={{ opacity: 0, x: 60 }}
          animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 1.5 }}
        >
          <motion.div
            className="font-bold text-black font-poppins leading-tight tracking-tight uppercase text-right overflow-hidden ml-auto hero-text-adaptive hero-text-narrow hero-text-desktop"
            style={{ 
              letterSpacing: '0.08em', 
              lineHeight: '1.1', 
              y: rightY 
            }}
          >
            <motion.div
              className="overflow-hidden cursor-hover"
              initial={{ y: '100%' }}
              animate={isLoaded ? { y: '0%' } : { y: '100%' }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 1.7 }}
            >
              <span className="hover:text-gray-600 transition-colors duration-500 block">OPTICIEN</span>
            </motion.div>
            <motion.div
              className="overflow-hidden cursor-hover"
              initial={{ y: '100%' }}
              animate={isLoaded ? { y: '0%' } : { y: '100%' }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 1.9 }}
            >
              <span className="hover:text-gray-600 transition-colors duration-500 block">FRANÇAIS</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
