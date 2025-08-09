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

  // Slower exponential curves for scroll-based text movement
  // Left text: moves up much further (completely out of screen)
  const leftY = useTransform(scroll, v => `${-900 * Math.pow(v as number, 2.4)}px`); // much more up
  // Right text: moves up slower and not as far
  const rightY = useTransform(scroll, v => `${-600 * Math.pow(v as number, 1.15)}px`); // slower, less far
  // Model rotation progress (0 to 1) with smoother interpolation
  const modelScroll = useTransform(scroll, [0, 1], [0, 1]);

  // Scroll-based opacity for SCROLL DOWN indicators
  const scrollIndicatorOpacity = useTransform(scroll, [0, 0.1], [1, 0]);
  // Fade out when glasses are put on (based on model scroll progress)
  const glassesOpacity = useTransform(modelScroll, [0, 0.3], [1, 0]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
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
        duration: 0.8,
        staggerChildren: 0.1,
        delayChildren: 0.8
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
        className="absolute top-0 left-0 flex items-center gap-2 p-6 z-20 select-none"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        <motion.div 
          className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-lg cursor-pointer hover:scale-110 transition-all duration-300 hover:shadow-lg hover-lift"
          variants={logoVariants}
          transition={{ duration: 1, type: "spring", bounce: 0.4, delay: 0.2 }}
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
          className="text-lg font-semibold tracking-widest text-black uppercase hover:text-gray-600 transition-colors duration-500 cursor-pointer"
          variants={itemVariants}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Optique de Bourbon
        </motion.span>
      </motion.div>

      {/* Top right: Navbar links */}
      <motion.nav 
        className="absolute top-0 right-0 flex items-center gap-6 p-6 z-20 select-none"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        {[
          { label: 'ACCUEIL', href: 'https://odb.re/' },
          { label: 'SPORT', href: 'https://odb.re/odb-sport/' },
          { label: 'KIDS', href: 'https://odb.re/odb-kids/' },
          { label: 'ODB À DOMICILE', href: 'https://odb.re/odb-a-domicile/' },
          { label: 'OPHTALMOLOGISTES', href: 'https://odb.re/ophtalmologistes/' },
          { label: 'LENTILLES', href: 'https://odb.re/choisir-ses-lentilles/' },
          { label: 'CONSEILS', href: 'https://odb.re/bien-choisir-ses-solaires/' },
          { label: 'NOUS REJOINDRE', href: 'https://odb.re/recrutement/' },
          { label: 'CONTACTS', href: 'https://odb.re/contacts/' },
        ].map((item, index) => (
          <motion.a 
            key={item.label}
            href={item.href}
            className="text-base font-medium text-black hover:text-gray-600 transition-all duration-500 ease-out relative group underline-animate cursor-pointer"
            variants={itemVariants}
            transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.07 }}
            whileHover={{ y: -1 }}
            target="_blank" rel="noopener noreferrer"
          >
            {item.label}
          </motion.a>
        ))}
        
        {/* Magasins Dropdown */}
        <MagasinsDropdown />
      </motion.nav>

      {/* Bottom left: Social icons */}
      <motion.div 
        className="absolute bottom-0 left-0 flex flex-col items-start gap-3 p-6 z-20 select-none"
        variants={socialVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        <motion.div className="flex gap-3 mb-2" variants={containerVariants}>
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
              className="text-xl text-black/70 hover:text-black transition-colors duration-300 rounded-full border border-black/10 hover:border-black/40 p-2 cursor-pointer shadow-none"
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
        className="fixed left-4 top-1/2 -translate-y-1/2 z-50 select-none flex flex-col items-center"
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
        className="fixed right-4 top-1/2 -translate-y-1/2 z-50 select-none flex flex-col items-center"
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
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 select-none flex flex-col items-center"
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

      <section className="relative w-full min-h-screen z-10">
        {/* Content that appears behind glasses - blurred initially, sharp when glasses are on */}
        <ContentReveal scrollProgress={modelScroll} cameraZ={cameraZ} />
        
        {/* Fullscreen Centered Glasses Model - positioned naturally in the layout */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 2.2 }}
        >
          <div className="w-screen h-screen relative flex items-center justify-center">
            <div className="w-full h-full">
              <GlassesModel 
                scrollProgress={modelScroll} 
                onCameraZChange={setCameraZ}
              />
            </div>
          </div>
        </motion.div>

        {/* Left text - positioned with proper spacing from edge and SCROLL DOWN */}
        <motion.div
          className="absolute left-12 sm:left-16 md:left-20 lg:left-24 xl:left-32 top-1/2 -translate-y-1/2 z-10 select-none"
          initial={{ opacity: 0, x: -60 }}
          animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 1.5 }}
        >
          <motion.div
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-black font-poppins leading-tight tracking-tight uppercase overflow-hidden"
            style={{ letterSpacing: '0.12em', lineHeight: '1.1', y: leftY }}
          >
            <motion.div
              className="overflow-hidden cursor-hover"
              initial={{ y: '100%' }}
              animate={isLoaded ? { y: '0%' } : { y: '100%' }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 1.7 }}
            >
              <span className="hover:text-gray-600 transition-colors duration-500">OPTIQUE</span>
            </motion.div>
            <motion.div
              className="overflow-hidden cursor-hover"
              initial={{ y: '100%' }}
              animate={isLoaded ? { y: '0%' } : { y: '100%' }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 1.9 }}
            >
              <span className="hover:text-gray-600 transition-colors duration-500">DE BOURBON</span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right text - positioned with proper spacing from edge and SCROLL DOWN */}
        <motion.div
          className="absolute right-12 sm:right-16 md:right-20 lg:right-24 xl:right-32 top-1/2 -translate-y-1/2 z-10 select-none"
          initial={{ opacity: 0, x: 60 }}
          animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 1.5 }}
        >
          <motion.div
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-black font-poppins leading-tight tracking-tight uppercase text-right overflow-hidden"
            style={{ letterSpacing: '0.12em', lineHeight: '1.1', y: rightY }}
          >
            <motion.div
              className="overflow-hidden cursor-hover"
              initial={{ y: '100%' }}
              animate={isLoaded ? { y: '0%' } : { y: '100%' }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 1.7 }}
            >
              <span className="hover:text-gray-600 transition-colors duration-500">OPTICIEN</span>
            </motion.div>
            <motion.div
              className="overflow-hidden cursor-hover"
              initial={{ y: '100%' }}
              animate={isLoaded ? { y: '0%' } : { y: '100%' }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 1.9 }}
            >
              <span className="hover:text-gray-600 transition-colors duration-500">FRANÇAIS</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
