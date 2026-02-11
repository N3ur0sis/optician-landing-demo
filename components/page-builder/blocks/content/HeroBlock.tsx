"use client";

import Link from "next/link";
import { usePageBuilder } from "@/components/page-builder/PageBuilderContext";
import { BlockContentProps, HEIGHT_MAP, TEXT_ALIGN_MAP, FLEX_ALIGN_MAP, ChildElementStyles, getChildElementInlineStyles } from "../types";

interface HeroButton {
  text: string;
  url: string;
  variant?: "primary" | "secondary";
  _styles?: ChildElementStyles;
}

interface HeroContent {
  title?: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  height?: "small" | "medium" | "large" | "full";
  alignment?: string;
  verticalAlign?: "top" | "center" | "bottom";
  layout?: "centered" | "center" | "left" | "right" | "split";
  style?: "default" | "gradient" | "minimal" | "bold" | "elegant";
  buttons?: HeroButton[];
  buttonText?: string;
  buttonLink?: string;
}

export function HeroBlock({ content }: BlockContentProps<HeroContent>) {
  const { isEditing } = usePageBuilder();
  const alignMap: Record<string, string> = {
    LEFT: "items-start text-left",
    CENTER: "items-center text-center",
    RIGHT: "items-end text-right",
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  };

  const verticalAlignMap: Record<string, string> = {
    top: "justify-start",
    center: "justify-center",
    bottom: "justify-end",
  };

  const layout = content.layout || "centered";
  const style = content.style || "default";
  const verticalAlign = content.verticalAlign || "center";

  const getLayoutClasses = () => {
    switch (layout) {
      case "left":
        return "items-start text-left";
      case "right":
        return "items-end text-right";
      case "split":
        return "items-start text-left";
      default:
        return alignMap[content.alignment || "center"] || "items-center text-center";
    }
  };

  const getStyleClasses = () => {
    switch (style) {
      case "gradient":
        return "bg-gradient-to-br from-black/80 to-black/40";
      default:
        return "";
    }
  };

  // Build buttons array from either buttons[] or buttonText/buttonLink
  let buttonsToRender: HeroButton[] = [];
  
  if (Array.isArray(content.buttons) && content.buttons.length > 0) {
    buttonsToRender = content.buttons;
  } else if (content.buttonText) {
    buttonsToRender = [{
      text: content.buttonText,
      url: content.buttonLink || "#",
      variant: "primary"
    }];
  }

  return (
    <section
      className={`relative flex flex-col ${verticalAlignMap[verticalAlign]} ${HEIGHT_MAP[content.height || "large"]} ${getStyleClasses()}`}
      style={{
        backgroundImage: content.backgroundImage ? `url(${content.backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      {Boolean(content.backgroundImage) && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: content.overlayColor || "#000000",
            opacity: (content.overlayOpacity || 50) / 100,
          }}
        />
      )}

      {/* Content */}
      <div className={`relative z-10 px-6 py-20 max-w-4xl mx-auto w-full flex flex-col ${getLayoutClasses()}`}>
        {Boolean(content.subtitle) && (
          <p 
            data-field="subtitle"
            className={`text-sm tracking-[0.3em] uppercase mb-4 opacity-70 ${style === "elegant" ? "font-light" : ""}`}
          >
            {content.subtitle}
          </p>
        )}
        {Boolean(content.title) && (
          <h1 
            data-field="title"
            className={`text-4xl @md:text-6xl @lg:text-7xl font-bold tracking-tight mb-6 whitespace-pre-line ${
              style === "elegant" ? "font-light tracking-wide" : style === "bold" ? "font-black" : ""
            }`}
          >
            {content.title}
          </h1>
        )}
        {Boolean(content.description) && (
          <p data-field="description" className="text-lg @md:text-xl opacity-80 max-w-2xl whitespace-pre-line">
            {content.description}
          </p>
        )}
        {buttonsToRender.length > 0 && (
          <div className={`flex flex-wrap gap-4 mt-8 ${layout === "centered" || layout === "center" ? "justify-center" : ""}`}>
            {buttonsToRender.map((button, index) => {
              const childStyles = getChildElementInlineStyles(button._styles);
              return isEditing ? (
                <span
                  key={index}
                  data-item-index={index}
                  data-child-type="button"
                  data-field="text"
                  className={`px-6 py-3 font-medium transition-all rounded-lg opacity-70 cursor-not-allowed ${
                    button.variant === "secondary"
                      ? "bg-white/10 backdrop-blur-sm"
                      : "bg-white text-black"
                  }`}
                  style={childStyles}
                >
                  {button.text}
                </span>
              ) : (
                <Link
                  key={index}
                  href={button.url || "#"}
                  data-item-index={index}
                  data-child-type="button"
                  data-field="text"
                  className={`px-6 py-3 font-medium transition-all rounded-lg ${
                    button.variant === "secondary"
                      ? "bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                      : "bg-white text-black hover:bg-white/90"
                  }`}
                  style={childStyles}
                >
                  {button.text}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
