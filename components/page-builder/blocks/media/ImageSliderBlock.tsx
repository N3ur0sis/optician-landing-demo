"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlockContentProps } from "../types";

// ============================================
// Image Slider Block
// ============================================

interface SliderSlide {
  id?: string;
  src: string;
  alt?: string;
  title?: string;
  description?: string;
  link?: string;
}

interface ImageSliderContent {
  slides?: SliderSlide[];
  autoplay?: boolean;
  interval?: number; // ms between slides (default 5000)
  height?: "small" | "medium" | "large" | "xlarge" | "custom";
  customHeight?: number; // px for custom height
  showDots?: boolean;
  showArrows?: boolean;
  pauseOnHover?: boolean;
  transition?: "slide" | "fade" | "none";
  borderRadius?: string;
  objectFit?: "cover" | "contain" | "fill";
  overlayEnabled?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  showCaptions?: boolean;
}

const HEIGHT_MAP: Record<string, string> = {
  small: "h-[250px] sm:h-[300px]",
  medium: "h-[350px] sm:h-[450px]",
  large: "h-[450px] sm:h-[600px]",
  xlarge: "h-[550px] sm:h-[750px]",
};

export function ImageSliderBlock({ content }: BlockContentProps<ImageSliderContent>) {
  const slides = (content.slides || []).filter((s) => s.src);
  const autoplay = content.autoplay ?? true;
  const interval = content.interval || 5000;
  const height = content.height || "medium";
  const customHeight = content.customHeight || 400;
  const showDots = content.showDots ?? true;
  const showArrows = content.showArrows ?? true;
  const pauseOnHover = content.pauseOnHover ?? true;
  const transition = content.transition || "slide";
  const borderRadius = content.borderRadius || "lg";
  const objectFit = content.objectFit || "cover";
  const overlayEnabled = content.overlayEnabled ?? false;
  const overlayColor = content.overlayColor || "#000000";
  const overlayOpacity = content.overlayOpacity ?? 30;
  const showCaptions = content.showCaptions ?? true;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const slideCount = slides.length;

  // Navigate to specific slide
  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || slideCount === 0) return;
      setIsTransitioning(true);
      setCurrentSlide(((index % slideCount) + slideCount) % slideCount);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [isTransitioning, slideCount]
  );

  const nextSlide = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  // Autoplay
  useEffect(() => {
    if (!autoplay || isPaused || slideCount <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoplay, isPaused, slideCount, interval]);

  if (slideCount === 0) {
    return (
      <div className="flex items-center justify-center bg-gray-100 rounded-lg h-[300px] text-gray-400">
        <p>Aucune image dans le slider. Ajoutez des slides dans l&apos;éditeur.</p>
      </div>
    );
  }

  const heightClass =
    height === "custom" ? "" : HEIGHT_MAP[height] || HEIGHT_MAP.medium;
  const heightStyle = height === "custom" ? { height: `${customHeight}px` } : {};

  const radiusMap: Record<string, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
  };

  return (
    <div
      className={cn("relative w-full overflow-hidden group", heightClass, radiusMap[borderRadius] || "rounded-lg")}
      style={heightStyle}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          const imgElement = (
            <Image
              src={slide.src}
              alt={slide.alt || `Slide ${index + 1}`}
              fill
              className={cn("object-cover", objectFit === "contain" && "object-contain!", objectFit === "fill" && "object-fill!")}
              sizes="100vw"
              priority={index === 0}
            />
          );
          const slideContent = slide.link ? (
            <Link href={slide.link} className="block absolute inset-0">
              {imgElement}
            </Link>
          ) : imgElement;

          if (transition === "fade") {
            return (
              <div
                key={slide.id || index}
                className={cn(
                  "absolute inset-0 transition-opacity duration-500 ease-in-out",
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0"
                )}
              >
                {slideContent}
              </div>
            );
          }

          // Slide transition
          return (
            <div
              key={slide.id || index}
              className={cn(
                "absolute inset-0 transition-transform duration-500 ease-in-out",
                transition === "none" && "transition-none"
              )}
              style={{
                transform: `translateX(${(index - currentSlide) * 100}%)`,
              }}
            >
              {slideContent}
            </div>
          );
        })}
      </div>

      {/* Overlay */}
      {overlayEnabled && (
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity / 100,
          }}
        />
      )}

      {/* Captions */}
      {showCaptions && slides[currentSlide] && (slides[currentSlide].title || slides[currentSlide].description) && (
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-linear-to-t from-black/70 to-transparent p-6 pt-12">
          {slides[currentSlide].title && (
            <h3 className="text-white text-xl font-bold mb-1">
              {slides[currentSlide].title}
            </h3>
          )}
          {slides[currentSlide].description && (
            <p className="text-white/80 text-sm">
              {slides[currentSlide].description}
            </p>
          )}
        </div>
      )}

      {/* Navigation Arrows */}
      {showArrows && slideCount > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            aria-label="Slide précédent"
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            aria-label="Slide suivant"
          >
            <ChevronRight className="w-5 h-5 text-gray-800" />
          </button>
        </>
      )}

      {/* Dots Indicators */}
      {showDots && slideCount > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                index === currentSlide
                  ? "bg-white w-6"
                  : "bg-white/50 hover:bg-white/80"
              )}
              aria-label={`Aller au slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
