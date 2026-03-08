"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MotionValue } from "framer-motion";
import { useRouter } from "next/navigation";
import { useRef, useEffect, useState, useCallback } from "react";
import Footer from "./Footer";
import { useApparence } from "@/lib/apparence-context";

type ContentRevealProps = {
  scrollProgress?: MotionValue<number>;
  cameraZ?: number;
  forceRevealed?: boolean;
};

type SliderSlideData = {
  id: string;
  src: string;
  alt?: string;
  title?: string;
  description?: string;
  href?: string;
};

type SliderConfig = {
  slides: SliderSlideData[];
  autoplay: boolean;
  interval: number;
  transition: "slide" | "fade" | "none";
  showDots: boolean;
  showArrows: boolean;
  pauseOnHover: boolean;
};

type GridTile = {
  id: string;
  title: string;
  caption: string | null;
  href: string;
  backgroundUrl: string;
  tileType: "image" | "slider";
  sliderData: string | SliderConfig | null;
  colSpan: number;
  rowSpan: number;
  colStart: number;
  rowStart: number;
  overlayType: "LIGHT" | "DARK";
  overlayColor: string | null;
  overlayOpacity: number;
  order: number;
  published: boolean;
};

type Tile = {
  title: string;
  href: string;
  background: string;
  tileType: "image" | "slider";
  sliderConfig?: SliderConfig;
  colSpan: number;
  rowSpan: number;
  colStart: number;
  rowStart: number;
  overlay: "light" | "dark";
  overlayColor?: string;
  overlayOpacity: number;
  caption?: string;
};

// Inline Slider Component for Grid Tiles
function GridSliderTile({
  tile,
  forceRevealed,
}: {
  tile: Tile;
  forceRevealed: boolean;
}) {
  const config = tile.sliderConfig;
  const slides = config?.slides || [];
  const [current, setCurrent] = useState(0);
  // Use ref so the running interval callback checks pause state synchronously
  const isPausedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();

  const goTo = useCallback(
    (idx: number) => {
      setCurrent((idx + slides.length) % slides.length);
    },
    [slides.length],
  );

  // Autoplay — single stable interval; callback gates on isPausedRef
  useEffect(() => {
    if (!config?.autoplay || slides.length <= 1) return;
    intervalRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        setCurrent((prev) => (prev + 1) % slides.length);
      }
    }, (config.interval || 5) * 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [config?.autoplay, config?.interval, slides.length]);

  if (slides.length === 0) {
    return (
      <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
        <span className="text-white/50 text-sm">Aucun slide configuré</span>
      </div>
    );
  }

  const transition = config?.transition || "slide";
  const currentSlide = slides[current];
  const currentHref = currentSlide?.href;

  // Compute overlay color
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
      : { r: 0, g: 0, b: 0 };
  };
  const baseHex = tile.overlayColor || (tile.overlay === "dark" ? "#000000" : "#ffffff");
  const { r, g, b } = hexToRgb(baseHex);
  const baseAlpha = tile.overlayOpacity / 100;

  return (
    <div
      className="absolute inset-0 overflow-hidden group"
      style={{ cursor: currentHref ? "pointer" : "default" }}
      onMouseEnter={() => { if (config?.pauseOnHover) isPausedRef.current = true; }}
      onMouseLeave={() => { if (config?.pauseOnHover) isPausedRef.current = false; }}
      onClick={() => {
        if (currentHref) {
          sessionStorage.setItem("fromContentReveal", "true");
          router.push(currentHref);
        }
      }}
    >
      {/* Slide images */}
      {transition === "fade" ? (
        slides.map((slide, idx) => (
          <div
            key={slide.id || idx}
            className="absolute inset-0 overflow-hidden transition-opacity duration-700"
            style={{ opacity: idx === current ? 1 : 0 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${slide.src})` }}
            />
          </div>
        ))
      ) : (
        slides.map((slide, idx) => (
          <div
            key={slide.id || idx}
            className="absolute inset-0 overflow-hidden"
            style={{
              transform: `translateX(${(idx - current) * 100}%)`,
              transition: transition === "slide" ? "transform 500ms ease-out" : "none",
            }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${slide.src})` }}
            />
          </div>
        ))
      )}

      {/* Color overlay — base fades out on hover, lighter version fades in */}
      <div
        className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0"
        style={{ backgroundColor: `rgba(${r}, ${g}, ${b}, ${baseAlpha})`, pointerEvents: "none" }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
        style={{ backgroundColor: `rgba(${r}, ${g}, ${b}, ${Math.max(0, baseAlpha - 0.2)})`, pointerEvents: "none" }}
      />
      {/* Professional grid overlay */}
      <div
        className="absolute inset-0 opacity-10 group-hover:opacity-5 transition-opacity duration-500"
        style={{
          backgroundImage: `
            linear-gradient(${tile.overlay === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} 1px, transparent 1px),
            linear-gradient(90deg, ${tile.overlay === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
          pointerEvents: "none",
        }}
      />

      {/* Content layout — matches image tile structure */}
      <div
        className="relative flex h-full flex-col justify-between p-6 lg:p-8"
        style={{ pointerEvents: "none" }}
      >
        {/* Top: caption badge + diamond icon */}
        <div className="flex justify-between items-start">
          {tile.caption ? (
            <div className={`${tile.overlay === "dark" ? "bg-white/10 text-white" : "bg-black/10 text-black"} backdrop-blur-sm px-3 py-1 text-xs font-medium tracking-[0.2em] uppercase`}>
              {tile.caption}
            </div>
          ) : <div />}
          <div className={`w-6 h-6 border ${tile.overlay === "dark" ? "border-white/30" : "border-black/30"} flex items-center justify-center`}>
            <div className={`w-2 h-2 ${tile.overlay === "dark" ? "bg-white/80" : "bg-black/80"} transform rotate-45`} />
          </div>
        </div>

        {/* Bottom: gradient scrim + slide title + description + cta */}
        <div className="relative">
          {/* Gradient scrim — only when there is text to display */}
          {(currentSlide?.title || currentSlide?.description) && (
            <div
              className="absolute inset-x-0 -inset-y-6 -mx-6 lg:-mx-8 -mb-6 lg:-mb-8"
              style={{
                background: tile.overlay === "dark"
                  ? "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)"
                  : "linear-gradient(to top, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 70%, transparent 100%)",
                pointerEvents: "none",
              }}
            />
          )}
          {currentSlide?.title && (
            <h2 className={`relative text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight uppercase ${tile.overlay === "dark" ? "text-white" : "text-black"} mb-2 leading-tight`}>
              {currentSlide.title}
            </h2>
          )}
          {currentSlide?.description && (
            <p
              className={`relative text-sm leading-relaxed mb-3 ${tile.overlay === "dark" ? "text-white/90" : "text-black/90"}`}
              style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}
            >
              {currentSlide.description}
            </p>
          )}
          {currentHref && (
            <div className={`relative flex items-center ${tile.overlay === "dark" ? "text-white/80 group-hover:text-white" : "text-black/80 group-hover:text-black"} transition-colors duration-300`}>
              <div className="flex items-center space-x-1 transform group-hover:translate-x-2 transition-transform duration-300">
                <div className="w-8 h-px bg-current" />
                <div className="w-0 h-0 border-l-[6px] border-l-current border-y-[3px] border-y-transparent" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dots */}
      {config?.showDots && slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                goTo(idx);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === current
                  ? "bg-white scale-125"
                  : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}

      {/* Arrows */}
      {config?.showArrows && slides.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goTo(current - 1);
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white z-20 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goTo(current + 1);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white z-20 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

const ContentReveal = ({
  cameraZ = 100,
  forceRevealed = false,
}: ContentRevealProps) => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { settings: apparenceSettings } = useApparence();

  // Grid settings from apparence - responsive
  const gridPadding = isMobile 
    ? apparenceSettings.grid_horizontal_padding_mobile 
    : apparenceSettings.grid_horizontal_padding;
  const gridGap = isMobile 
    ? apparenceSettings.grid_gap_mobile 
    : apparenceSettings.grid_gap;
  const gridRowHeight = isMobile 
    ? apparenceSettings.grid_row_height_mobile 
    : apparenceSettings.grid_row_height;
  const forceSingleColumn = isMobile && apparenceSettings.grid_force_single_column_mobile;

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch grid tiles from API
  useEffect(() => {
    const fetchTiles = async () => {
      try {
        const response = await fetch("/api/grid", {
          cache: "no-store",
        });
        if (response.ok) {
          const gridTiles: GridTile[] = await response.json();

          // Convert GridTile format to Tile format with proper grid positioning
          const convertedTiles = gridTiles
            .filter((tile) => tile.published)
            .map((tile) => {
              // Parse sliderData if it's a JSON string
              let sliderConfig: SliderConfig | undefined;
              if (tile.tileType === "slider" && tile.sliderData) {
                if (typeof tile.sliderData === "string") {
                  try {
                    sliderConfig = JSON.parse(tile.sliderData);
                  } catch {
                    sliderConfig = undefined;
                  }
                } else {
                  sliderConfig = tile.sliderData as SliderConfig;
                }
              }
              return {
                title: tile.title,
                caption: tile.caption || undefined,
                href: tile.href,
                background: `url(${tile.backgroundUrl})`,
                tileType: tile.tileType || "image",
                sliderConfig,
                colSpan: tile.colSpan,
                rowSpan: tile.rowSpan,
                colStart: tile.colStart,
                rowStart: tile.rowStart,
                overlay: tile.overlayType.toLowerCase() as "light" | "dark",
                overlayColor: tile.overlayColor || undefined,
                overlayOpacity: tile.overlayOpacity ?? 60,
              };
            });

          setTiles(convertedTiles);
        }
      } catch (error) {
        console.error("Failed to fetch grid tiles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTiles();
  }, []);
  const blurAmount = forceRevealed ? 0 : Math.max(0, (cameraZ / 100) * 20);
  const opacity = forceRevealed ? 1 : Math.max(0.1, 1 - (cameraZ / 100) * 0.8);
  const isContentRevealed = forceRevealed || blurAmount < 5; // Content is considered revealed when blur is minimal
  const router = useRouter();

  return (
    <motion.div
      className={`absolute inset-0 ${isContentRevealed ? "z-[25]" : "z-[5]"}`}
      style={{
        filter: `blur(${blurAmount}px)`,
        opacity,
        transition: "filter 0.3s ease-out, opacity 0.3s ease-out",
        pointerEvents: "auto",
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
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1) 0%,
            transparent 50%,
            rgba(0, 0, 0, 0.1) 100%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          z-index: 1;
        }
        .content-reveal-card:hover::before {
          opacity: 1;
        }
        /* Slider cards — same visuals but NO pointer-events override on children */
        .slider-reveal-card {
          pointer-events: auto !important;
          position: relative !important;
          z-index: 50 !important;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(1px);
          transition: box-shadow 0.5s ease, border-color 0.5s ease;
        }
        .slider-reveal-card:hover {
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        .slider-reveal-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1) 0%,
            transparent 50%,
            rgba(0, 0, 0, 0.1) 100%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          z-index: 1;
        }
        .slider-reveal-card:hover::before {
          opacity: 1;
        }
      `}</style>

      <div className="absolute inset-0 bg-gradient-to-br from-[#fdfbf7] via-[#f5eee6] to-[#f1e2d2]" />

      <div
        className="absolute inset-0 overflow-y-auto"
        data-reveal-scroll
      >
        <div
          className="mx-auto flex w-full max-w-7xl flex-col gap-12 pb-8 pt-16"
          style={{
            paddingLeft: `${gridPadding}px`,
            paddingRight: `${gridPadding}px`,
          }}
        >
          <div className="flex items-center justify-center py-6">
            <span className="text-sm tracking-[0.3em] text-neutral-500 uppercase">
              Optique de Bourbon
            </span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-neutral-400 text-sm tracking-wider">
                Loading...
              </div>
            </div>
          ) : (
            <div
              className={`content-reveal-grid grid ${forceSingleColumn ? 'grid-cols-1' : 'lg:grid-cols-4'}`}
              style={{
                pointerEvents: "auto",
                position: "relative",
                zIndex: 40,
                gap: `${gridGap}px`,
                gridAutoRows: `${gridRowHeight}px`,
              }}
            >
              {tiles.map((tile, index) => {
                const gridStyle = {
                  pointerEvents: "auto" as const,
                  position: "relative" as const,
                  zIndex: 30,
                  gridColumn: forceSingleColumn ? '1 / span 1' : `${tile.colStart} / span ${tile.colSpan}`,
                  gridRow: forceSingleColumn ? 'auto' : `${tile.rowStart} / span ${tile.rowSpan}`,
                };

                // === SLIDER TILE ===
                if (tile.tileType === "slider") {
                  return (
                    <div
                      key={`slider-${index}`}
                      className="slider-reveal-card group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-black/20 transform-gpu"
                      style={gridStyle}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={forceRevealed ? { opacity: 1, y: 0 } : {}}
                        whileInView={!forceRevealed ? { opacity: 1, y: 0 } : {}}
                        whileHover={{
                          scale: 1.02,
                          transition: { duration: 0.3, ease: "easeOut" },
                        }}
                        whileFocus={{
                          scale: 1.01,
                          transition: { duration: 0.2, ease: "easeOut" },
                        }}
                        whileTap={{
                          scale: 0.99,
                          transition: { duration: 0.1, ease: "easeInOut" },
                        }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                        viewport={{ once: true, amount: 0.4 }}
                        className="relative h-full w-full"
                      >
                        <GridSliderTile tile={tile} forceRevealed={forceRevealed} />
                      </motion.div>
                    </div>
                  );
                }

                // === IMAGE TILE (default) ===
                return (
                <Link
                  key={tile.title}
                  href={tile.href}
                  className="content-reveal-card group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-black/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer transform-gpu z-[30] pointer-events-auto"
                  style={gridStyle}
                  onClick={() => {
                    sessionStorage.setItem("fromContentReveal", "true");
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={forceRevealed ? { opacity: 1, y: 0 } : {}}
                    whileInView={!forceRevealed ? { opacity: 1, y: 0 } : {}}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.3, ease: "easeOut" },
                    }}
                    whileFocus={{
                      scale: 1.01,
                      transition: { duration: 0.2, ease: "easeOut" },
                    }}
                    whileTap={{
                      scale: 0.99,
                      transition: { duration: 0.1, ease: "easeInOut" },
                    }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.4 }}
                    className="relative h-full w-full cursor-pointer"
                  >
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{
                        backgroundImage: tile.background,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    />
                    {/* Color overlay with hover transition */}
                    {(() => {
                      const hexToRgb = (hex: string) => {
                        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                        return result
                          ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
                          : { r: 0, g: 0, b: 0 };
                      };
                      const baseHex = tile.overlayColor
                        ? tile.overlayColor
                        : tile.overlay === "dark"
                          ? "#000000"
                          : "#ffffff";
                      const { r, g, b } = hexToRgb(baseHex);
                      const baseAlpha = tile.overlayOpacity / 100;
                      const hoverAlpha = Math.max(0, tile.overlayOpacity - 20) / 100;
                      return (
                        <>
                          {/* Base overlay - visible by default, hidden on hover */}
                          <div
                            className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0"
                            style={{ backgroundColor: `rgba(${r}, ${g}, ${b}, ${baseAlpha})` }}
                          />
                          {/* Hover overlay - hidden by default, visible on hover */}
                          <div
                            className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                            style={{ backgroundColor: `rgba(${r}, ${g}, ${b}, ${hoverAlpha})` }}
                          />
                        </>
                      );
                    })()}
                    {/* Professional grid overlay */}
                    <div
                      className="absolute inset-0 opacity-10 group-hover:opacity-5 transition-opacity duration-500"
                      style={{
                        backgroundImage: `
                        linear-gradient(${tile.overlay === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} 1px, transparent 1px),
                        linear-gradient(90deg, ${tile.overlay === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} 1px, transparent 1px)
                      `,
                        backgroundSize: "20px 20px",
                      }}
                    />
                    <div className="relative flex h-full flex-col justify-between p-6 lg:p-8">
                      {/* Top section - Category indicator */}
                      <div className="flex justify-between items-start">
                        <div
                          className={`${tile.overlay === "dark" ? "bg-white/10 text-white" : "bg-black/10 text-black"} backdrop-blur-sm px-3 py-1 text-xs font-medium tracking-[0.2em] uppercase`}
                        >
                          {tile.caption}
                        </div>
                        <div
                          className={`w-6 h-6 border ${tile.overlay === "dark" ? "border-white/30" : "border-black/30"} flex items-center justify-center`}
                        >
                          <div
                            className={`w-2 h-2 ${tile.overlay === "dark" ? "bg-white/80" : "bg-black/80"} transform rotate-45`}
                          ></div>
                        </div>
                      </div>

                      {/* Bottom section - Title and CTA */}
                      <div>
                        <h2
                          className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${tile.overlay === "dark" ? "text-white" : "text-black"} mb-4 leading-tight`}
                        >
                          {tile.title}
                        </h2>
                        <div
                          className={`flex items-center ${tile.overlay === "dark" ? "text-white/80 group-hover:text-white" : "text-black/80 group-hover:text-black"} transition-colors duration-300`}
                        >
                          <div className="flex items-center space-x-1 transform group-hover:translate-x-2 transition-transform duration-300">
                            <div className="w-8 h-px bg-current"></div>
                            <div className="w-0 h-0 border-l-[6px] border-l-current border-y-[3px] border-y-transparent"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer - Same width as grid but with max padding limit */}
        <div
          className="mx-auto max-w-7xl pb-24"
          style={{
            paddingLeft: `${Math.min(gridPadding, 64)}px`,
            paddingRight: `${Math.min(gridPadding, 64)}px`,
          }}
        >
          <Footer />
        </div>
      </div>
    </motion.div>
  );
};

export default ContentReveal;
