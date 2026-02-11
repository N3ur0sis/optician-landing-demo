"use client";

import Image from "next/image";
import GlassesModel from "../components/GlassesModel";
import ContentReveal from "../components/ContentReveal";

import DynamicNavbar from "../components/DynamicNavbar";
import {
  motion,
  useTransform,
  useInView,
  AnimatePresence,
  useMotionValueEvent,
} from "framer-motion";
import { useContext, useRef, useState, useEffect } from "react";
import { ScrollContext } from "./ClientLayout";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { useApparence } from "@/lib/apparence-context";
import {
  LandingPageSettings,
  defaultApparenceSettings,
} from "@/types/apparence";

export default function Page() {
  const { scroll, setScroll } = useContext(ScrollContext);
  const { settings: apparenceSettings, isLoaded: settingsLoaded } =
    useApparence();
  const [isLoaded, setIsLoaded] = useState(false);
  const [cameraZ, setCameraZ] = useState(100);
  const [forceContentRevealed, setForceContentRevealed] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const heroRef = useRef(null);
  const revealRef = useRef(false);
  const isInView = useInView(heroRef, { once: true, amount: 0.3 });

  // Extract landing page settings from context
  const branding: LandingPageSettings = {
    loading_logo_url: apparenceSettings.loading_logo_url,
    loading_bg_color: apparenceSettings.loading_bg_color,
    loading_animation_type: apparenceSettings.loading_animation_type,
    loading_duration: apparenceSettings.loading_duration,
    loading_dots_enabled: apparenceSettings.loading_dots_enabled,
    loading_dots_color: apparenceSettings.loading_dots_color,
    intro_logo_url: apparenceSettings.intro_logo_url,
    intro_tagline: apparenceSettings.intro_tagline,
    intro_text_color: apparenceSettings.intro_text_color,
    intro_gradient_enabled: apparenceSettings.intro_gradient_enabled,
    intro_gradient_color: apparenceSettings.intro_gradient_color,
    intro_gradient_intensity: apparenceSettings.intro_gradient_intensity,
    intro_left_text: apparenceSettings.intro_left_text,
    intro_right_text: apparenceSettings.intro_right_text,
    intro_scroll_indicator_enabled:
      apparenceSettings.intro_scroll_indicator_enabled,
    social_facebook: apparenceSettings.social_facebook,
    social_instagram: apparenceSettings.social_instagram,
  };

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Loading completes when settings are loaded - reflects real page loading
  useEffect(() => {
    if (!settingsLoaded) return;

    const shouldScrollToContentReveal = sessionStorage.getItem(
      "scrollToContentReveal",
    );
    if (shouldScrollToContentReveal === "true") {
      // Skip loading animation when returning from subpage
      setIsLoaded(true);
    } else {
      // Small delay to show the loading animation, then reveal page
      // The loading_duration setting controls animation SPEED, not total loading time
      const timer = setTimeout(() => setIsLoaded(true), 800);
      return () => clearTimeout(timer);
    }
  }, [settingsLoaded]);

  // Check if we should scroll to content reveal on load
  useEffect(() => {
    const shouldScrollToContentReveal = sessionStorage.getItem(
      "scrollToContentReveal",
    );
    if (shouldScrollToContentReveal === "true" && isLoaded) {
      sessionStorage.removeItem("scrollToContentReveal");
      // Set scroll to 1 to show content reveal immediately
      setTimeout(() => {
        setScroll(1);
        // Force cameraZ to 0 to ensure content is fully revealed
        setCameraZ(0);
        setForceContentRevealed(true);
        setIsNavVisible(true);
        revealRef.current = true;
      }, 100);
    }
  }, [isLoaded, setScroll]);

  useMotionValueEvent(scroll, "change", (latest) => {
    if (revealRef.current) {
      return;
    }
    if (latest >= 0.9) {
      setIsNavVisible(true);
    } else if (latest <= 0.7) {
      setIsNavVisible(false);
    }
  });

  useEffect(() => {
    if (forceContentRevealed) {
      setIsNavVisible(true);
      revealRef.current = true;
    }
  }, [forceContentRevealed]);

  // Enhanced exponential curves for buttery smooth scroll-based text movement
  // Desktop: Left text (logo) moves up, Right text moves up
  const leftY = useTransform(
    scroll,
    (v) => `${-1400 * Math.pow(v as number, 1.8)}px`,
  );
  const rightY = useTransform(
    scroll,
    (v) => `${-1200 * Math.pow(v as number, 1.6)}px`,
  );

  // Mobile: Inverted animations - logo goes up, text goes down
  const mobileLogoY = useTransform(
    scroll,
    (v) => `${-800 * Math.pow(v as number, 1.8)}px`,
  ); // Logo goes UP
  const mobileTextY = useTransform(
    scroll,
    (v) => `${800 * Math.pow(v as number, 1.6)}px`,
  ); // Text goes DOWN

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
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.96,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  };

  const socialVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1.0,
        staggerChildren: 0.08,
        delayChildren: 0.6,
      },
    },
  };

  const socialItemVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
    },
  };

  return (
    <main
      className="relative h-screen w-full overflow-hidden cursor-custom"
      ref={heroRef}
    >
      {isNavVisible && (
        <DynamicNavbar
          showBackButton={false}
        />
      )}

      {/* Loading Screen - Wait for settings before showing personalized loader */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: settingsLoaded ? branding.loading_bg_color : '#000000' }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* Only show personalized content when settings are loaded */}
            {settingsLoaded ? (
            <motion.div
              className="flex flex-col items-center gap-6 relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div
                className="flex items-center justify-center"
                animate={
                  branding.loading_animation_type === "pulse"
                    ? {
                        scale: [1, 1.05, 1],
                        opacity: [0.9, 1, 0.9],
                      }
                    : branding.loading_animation_type === "rotate"
                      ? {
                          rotate: [0, 360],
                        }
                      : branding.loading_animation_type === "bounce"
                        ? {
                            y: [0, -20, 0],
                          }
                        : {}
                }
                transition={{
                  duration: branding.loading_duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src={branding.loading_logo_url}
                  alt="Chargement"
                  width={105}
                  height={95}
                  priority
                  className="h-24 w-auto object-contain"
                />
              </motion.div>
              {branding.loading_dots_enabled && (
                <motion.div
                  className="flex space-x-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: branding.loading_dots_color }}
                      animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen gradient background - dynamic based on branding */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: branding.intro_gradient_enabled
            ? `radial-gradient(circle at center, #ffffff 0%, ${branding.intro_gradient_color}${Math.round(
                (branding.intro_gradient_intensity / 100) * 40,
              )
                .toString(16)
                .padStart(
                  2,
                  "0",
                )} 30%, ${branding.intro_gradient_color}${Math.round(
                (branding.intro_gradient_intensity / 100) * 80,
              )
                .toString(16)
                .padStart(2, "0")} 60%, ${branding.intro_gradient_color} 100%)`
            : "radial-gradient(circle at center, #ffffff 0%, #f5f5f5 20%, #e5e5e5 40%, #d4d4d4 60%, #a3a3a3 80%, #737373 100%)",
        }}
      />

      {/* Bottom left: Social icons */}
      <motion.div
        className="absolute bottom-0 left-0 flex flex-col items-start gap-2 sm:gap-3 p-4 sm:p-6 z-20 select-none"
        variants={socialVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        <motion.div
          className="flex gap-2 sm:gap-3 mb-2"
          variants={containerVariants}
        >
          {branding.social_facebook && (
            <motion.a
              href={branding.social_facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-lg sm:text-xl text-black/70 hover:text-black transition-colors duration-300 rounded-full border border-black/10 hover:border-black/40 p-1.5 sm:p-2 cursor-pointer shadow-none"
              variants={socialItemVariants}
              transition={{ duration: 0.5, type: "spring", bounce: 0.6 }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaFacebook />
            </motion.a>
          )}
          {branding.social_instagram && (
            <motion.a
              href={branding.social_instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-lg sm:text-xl text-black/70 hover:text-black transition-colors duration-300 rounded-full border border-black/10 hover:border-black/40 p-1.5 sm:p-2 cursor-pointer shadow-none"
              variants={socialItemVariants}
              transition={{
                duration: 0.5,
                type: "spring",
                bounce: 0.6,
                delay: 0.1,
              }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaInstagram />
            </motion.a>
          )}
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
        animate={
          isLoaded && !forceContentRevealed
            ? { opacity: 1, x: 0 }
            : { opacity: 0, x: -30 }
        }
        transition={{ duration: 0.8, delay: 1.2 }}
        style={{
          opacity: useTransform([scroll, modelScroll], ([s, m]) => {
            if (forceContentRevealed) return 0;
            const scrollFade =
              (s as number) > 0.1 ? 0 : 1 - (s as number) / 0.1;
            const glassesFade =
              (m as number) > 0.3 ? 0 : 1 - (m as number) / 0.3;
            return Math.min(scrollFade, glassesFade);
          }),
        }}
        whileHover={{ scale: 1.05, x: 8 }}
      >
        <motion.div
          className="flex flex-col items-center cursor-pointer group"
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
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
            <motion.span className="text-xs font-bold tracking-[0.3em] text-black/60 group-hover:text-black/90 -rotate-90 whitespace-nowrap transition-colors duration-300 origin-center">
              {branding.intro_left_text}
            </motion.span>
          </motion.div>

          {/* Bottom dot */}
          <motion.div
            className="w-1.5 h-1.5 bg-black/40 group-hover:bg-black/70 rounded-full transition-all duration-300"
            initial={{ scale: 0, opacity: 0.4 }}
            animate={
              isLoaded
                ? {
                    scale: 1,
                    opacity: [0.4, 1, 0.4],
                  }
                : {
                    scale: 0,
                    opacity: 0.4,
                  }
            }
            transition={{
              scale: { duration: 0.4, delay: 1.8 },
              opacity: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              },
            }}
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="fixed right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 z-50 select-none flex-col items-center hidden xl:flex"
        initial={{ opacity: 0, x: 30 }}
        animate={
          isLoaded && !forceContentRevealed
            ? { opacity: 1, x: 0 }
            : { opacity: 0, x: 30 }
        }
        transition={{ duration: 0.8, delay: 1.2 }}
        style={{
          opacity: useTransform([scroll, modelScroll], ([s, m]) => {
            if (forceContentRevealed) return 0;
            const scrollFade =
              (s as number) > 0.1 ? 0 : 1 - (s as number) / 0.1;
            const glassesFade =
              (m as number) > 0.3 ? 0 : 1 - (m as number) / 0.3;
            return Math.min(scrollFade, glassesFade);
          }),
        }}
        whileHover={{ scale: 1.05, x: -8 }}
      >
        <motion.div
          className="flex flex-col items-center cursor-pointer group"
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.2,
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
            <motion.span className="text-xs font-bold tracking-[0.3em] text-black/60 group-hover:text-black/90 rotate-90 whitespace-nowrap transition-colors duration-300 origin-center">
              {branding.intro_right_text}
            </motion.span>
          </motion.div>

          {/* Bottom dot */}
          <motion.div
            className="w-1.5 h-1.5 bg-black/40 group-hover:bg-black/70 rounded-full transition-all duration-300"
            initial={{ scale: 0, opacity: 0.4 }}
            animate={
              isLoaded
                ? {
                    scale: 1,
                    opacity: [0.4, 1, 0.4],
                  }
                : {
                    scale: 0,
                    opacity: 0.4,
                  }
            }
            transition={{
              scale: { duration: 0.4, delay: 1.8 },
              opacity: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              },
            }}
          />
        </motion.div>
      </motion.div>

      {/* Bottom center mouse scroll indicator */}
      <motion.div
        className="fixed bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-50 select-none flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={
          isLoaded && !forceContentRevealed
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 20 }
        }
        transition={{ duration: 0.8, delay: 1.4 }}
        style={{
          opacity: useTransform([scroll, modelScroll], ([s, m]) => {
            if (forceContentRevealed) return 0;
            const scrollFade =
              (s as number) > 0.1 ? 0 : 1 - (s as number) / 0.1;
            const glassesFade =
              (m as number) > 0.3 ? 0 : 1 - (m as number) / 0.3;
            return Math.min(scrollFade, glassesFade);
          }),
        }}
        whileHover={{ scale: 1.1 }}
      >
        <motion.div
          className="flex flex-col items-center cursor-pointer group"
          animate={{
            y: [0, 4, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Mouse icon */}
          <motion.div
            className="w-6 h-10 border-2 border-black/40 group-hover:border-black/70 rounded-full flex justify-center transition-colors duration-300 mb-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
            }
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <motion.div
              className="w-1 h-2 bg-black/40 group-hover:bg-black/70 rounded-full mt-2 transition-colors duration-300"
              animate={{
                y: [0, 4, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
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

      <section className="fixed inset-0 w-full h-screen z-10">
        {/* Content that appears behind glasses - blurred initially, sharp when glasses are on */}
        <ContentReveal
          scrollProgress={modelScroll}
          cameraZ={cameraZ}
          forceRevealed={forceContentRevealed}
        />

        {/* Fullscreen Centered Glasses Model - positioned naturally in the layout */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden glasses-model-mobile"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={
            isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
          }
          transition={{ duration: 1.5, ease: "easeOut", delay: 2.2 }}
          style={{
            zIndex: cameraZ < 50 ? 5 : 15, // Lower z-index when glasses are "put on"
            pointerEvents: "none",
          }}
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

        {/* Logo - Desktop: Left side | Mobile: Top center */}
        <motion.div
          className="absolute select-none pointer-events-none
                     md:top-1/2 md:-translate-y-1/2 md:left-0 hero-spacing-left
                     max-md:top-8 max-md:left-0 max-md:right-0 max-md:flex max-md:justify-center"
          initial={{ opacity: 0, x: isMobile ? 0 : -60, y: isMobile ? -30 : 0 }}
          animate={
            isLoaded
              ? { opacity: 1, x: 0, y: 0 }
              : { opacity: 0, x: isMobile ? 0 : -60, y: isMobile ? -30 : 0 }
          }
          transition={{ duration: 1.2, ease: "easeOut", delay: 1.5 }}
          style={{
            zIndex: scroll.get() > 0.1 ? -1 : 12,
            pointerEvents: "none",
          }}
        >
          <motion.div
            className="overflow-hidden"
            style={{
              y: isMobile ? mobileLogoY : leftY,
            }}
            initial={{ y: isMobile ? "-50%" : "100%", scale: 0.8 }}
            animate={
              isLoaded
                ? { y: "0%", scale: 1 }
                : { y: isMobile ? "-50%" : "100%", scale: 0.8 }
            }
            transition={{ duration: 1.0, ease: "easeOut", delay: 1.7 }}
          >
            <Image
              src={branding.intro_logo_url}
              alt="Optique de Bourbon"
              width={400}
              height={200}
              priority
              className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[300px] lg:max-w-[400px] object-contain"
            />
          </motion.div>
        </motion.div>

        {/* Text - Desktop: Right side | Mobile: Bottom center */}
        <motion.div
          className="absolute select-none pointer-events-none
                     md:top-1/2 md:-translate-y-1/2 md:right-0 hero-spacing-right
                     max-md:bottom-16 max-md:left-0 max-md:right-0 max-md:flex max-md:justify-center"
          initial={{ opacity: 0, x: isMobile ? 0 : 60, y: isMobile ? 30 : 0 }}
          animate={
            isLoaded
              ? { opacity: 1, x: 0, y: 0 }
              : { opacity: 0, x: isMobile ? 0 : 60, y: isMobile ? 30 : 0 }
          }
          transition={{ duration: 1.2, ease: "easeOut", delay: 1.5 }}
          style={{
            zIndex: scroll.get() > 0.1 ? -1 : 12,
            pointerEvents: "none",
          }}
        >
          <motion.div
            className="font-bold leading-tight tracking-tight overflow-hidden
                       md:text-right md:ml-auto hero-text-adaptive hero-text-narrow hero-text-desktop
                       max-md:text-center max-md:ml-0"
            style={{
              fontFamily: "var(--font-gotham-narrow)",
              letterSpacing: "0.05em",
              lineHeight: "1.2",
              y: isMobile ? mobileTextY : rightY,
              color: branding.intro_text_color,
            }}
          >
            <motion.div
              className="overflow-hidden cursor-hover"
              initial={{ y: "100%" }}
              animate={isLoaded ? { y: "0%" } : { y: "100%" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 1.7 }}
            >
              <span className="hover:opacity-80 transition-opacity duration-500 block text-2xl sm:text-3xl md:text-5xl lg:text-6xl">
                {branding.intro_tagline.split(" ").slice(0, 2).join(" ")}
              </span>
            </motion.div>
            <motion.div
              className="overflow-hidden cursor-hover"
              initial={{ y: "100%" }}
              animate={isLoaded ? { y: "0%" } : { y: "100%" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 1.9 }}
            >
              <span className="hover:opacity-80 transition-opacity duration-500 block text-2xl sm:text-3xl md:text-5xl lg:text-6xl">
                {branding.intro_tagline.split(" ").slice(2).join(" ")}
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
