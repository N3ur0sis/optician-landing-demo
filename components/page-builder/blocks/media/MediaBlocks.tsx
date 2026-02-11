"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { usePageBuilder } from "@/components/page-builder/PageBuilderContext";
import { BlockContentProps, RADIUS_MAP } from "../types";

// ============================================
// Image Block
// ============================================

interface ImageContent {
  src?: string;
  alt?: string;
  caption?: string;
  link?: string;
  aspectRatio?: "auto" | "square" | "video" | "portrait" | "landscape" | "wide";
  borderRadius?: string;
  shadow?: string;
  hoverEffect?: string;
  showCaption?: boolean;
  lightbox?: boolean;
  objectFit?: "cover" | "contain" | "fill" | "none";
}

export function ImageBlock({ content }: BlockContentProps<ImageContent>) {
  const { isEditing } = usePageBuilder();
  const src = content.src || "";
  const alt = content.alt || "";
  const caption = content.caption;
  const link = content.link;
  const aspectRatio = content.aspectRatio || "auto";
  const borderRadius = content.borderRadius || "md";
  const shadow = content.shadow || "none";
  const hoverEffect = content.hoverEffect || "none";
  const showCaption = content.showCaption;
  const lightbox = content.lightbox;

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const aspectRatioMap: Record<string, string> = {
    auto: "",
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-3/4",
    landscape: "aspect-4/3",
    wide: "aspect-[21/9]",
  };

  const radiusMap: Record<string, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  const shadowMap: Record<string, string> = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  };

  const hoverMap: Record<string, string> = {
    none: "",
    lift: "hover:-translate-y-2 transition-transform duration-300",
    glow: "hover:shadow-lg hover:shadow-primary/20 transition-shadow duration-300",
    zoom: "hover:scale-105 transition-transform duration-300",
    border: "hover:ring-2 hover:ring-primary transition-all duration-300",
    shadow: "hover:shadow-xl transition-shadow duration-300",
  };

  if (!src) {
    return (
      <div
        className={`bg-gray-200 ${aspectRatioMap[aspectRatio] || "aspect-video"} flex items-center justify-center text-gray-400 ${radiusMap[borderRadius]}`}
      >
        No image source
      </div>
    );
  }

  const imageElement = (
    <figure className={hoverMap[hoverEffect]}>
      <div
        className={`relative overflow-hidden ${aspectRatioMap[aspectRatio]} ${radiusMap[borderRadius]} ${shadowMap[shadow]}`}
      >
        <img
          src={src}
          alt={alt}
          className={`w-full h-auto ${aspectRatio !== "auto" ? "object-cover w-full h-full absolute inset-0" : ""}`}
          style={{ objectFit: content.objectFit || "cover" }}
        />
      </div>
      {showCaption && caption && (
        <figcaption className="mt-2 text-sm text-center opacity-70">
          {caption}
        </figcaption>
      )}
    </figure>
  );

  // Lightbox modal
  const lightboxModal = isLightboxOpen && (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm cursor-pointer"
      onClick={() => setIsLightboxOpen(false)}
    >
      <button
        className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        onClick={() => setIsLightboxOpen(false)}
        aria-label="Fermer"
      >
        <X className="w-8 h-8" />
      </button>
      <img
        src={src}
        alt={alt}
        className="max-w-[90vw] max-h-[90vh] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      {caption && (
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-center px-4 py-2 bg-black/50 rounded-lg">
          {caption}
        </p>
      )}
    </div>
  );

  if (lightbox && !link && !isEditing) {
    return (
      <>
        <div className="cursor-zoom-in" onClick={() => setIsLightboxOpen(true)}>
          {imageElement}
        </div>
        {lightboxModal}
      </>
    );
  }

  if (link && !isEditing) {
    return (
      <Link href={link} className="block hover:opacity-90 transition-opacity">
        {imageElement}
      </Link>
    );
  }

  if (isEditing && (link || lightbox)) {
    return (
      <div className="relative opacity-70">
        {imageElement}
        {(link || lightbox) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
            <span className="text-xs text-white/70 bg-black/50 px-2 py-1 rounded">
              {link ? "Lien désactivé" : "Lightbox désactivée"}
            </span>
          </div>
        )}
      </div>
    );
  }

  return imageElement;
}

// ============================================
// Gallery Block
// ============================================

interface GalleryImage {
  src: string;
  alt?: string;
  caption?: string;
}

interface GalleryContent {
  images?: GalleryImage[];
  columns?: number;
  gap?: string;
  lightbox?: boolean;
  aspectRatio?: string;
  borderRadius?: string;
  style?: "grid" | "masonry" | "carousel" | "lightbox" | "polaroid";
}

export function GalleryBlock({ content }: BlockContentProps<GalleryContent>) {
  const { isEditing } = usePageBuilder();
  const images = content.images || [];
  const columns = content.columns || 3;
  const gap = content.gap || "medium";
  const lightboxEnabled = content.lightbox !== false;
  const aspectRatio = content.aspectRatio || "square";
  const borderRadius = content.borderRadius || "lg";
  const style = content.style || "grid";

  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const gapMap: Record<string, string> = {
    none: "gap-0",
    small: "gap-2",
    medium: "gap-4",
    large: "gap-6",
  };

  const columnsMap: Record<number, string> = {
    2: "grid-cols-1 @md:grid-cols-2",
    3: "grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3",
    4: "grid-cols-2 @md:grid-cols-3 @lg:grid-cols-4",
    5: "grid-cols-2 @md:grid-cols-3 @lg:grid-cols-5",
  };

  const aspectMap: Record<string, string> = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-3/4",
    landscape: "aspect-4/3",
    auto: "",
  };

  const radiusMap: Record<string, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
  };

  if (images.length === 0) {
    return (
      <div className="bg-gray-100/10 rounded-lg p-8 text-center text-gray-400">
        No images in gallery
      </div>
    );
  }

  // Masonry style
  if (style === "masonry") {
    return (
      <>
        <div
          className={`columns-1 @md:columns-2 @lg:columns-${columns} ${gapMap[gap]}`}
          style={{
            columnGap:
              gap === "none"
                ? "0"
                : gap === "small"
                  ? "0.5rem"
                  : gap === "large"
                    ? "1.5rem"
                    : "1rem",
          }}
        >
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`mb-4 break-inside-avoid overflow-hidden ${radiusMap[borderRadius]} group ${lightboxEnabled && !isEditing ? "cursor-pointer" : ""}`}
              onClick={
                isEditing
                  ? undefined
                  : () => lightboxEnabled && setSelectedImage(img)
              }
            >
              <img
                src={img.src}
                alt={img.alt || `Gallery image ${idx + 1}`}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {img.caption && (
                <div className="p-3 bg-white/5">
                  <p className="text-sm opacity-70">{img.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        {renderLightbox()}
      </>
    );
  }

  // Polaroid style
  if (style === "polaroid") {
    return (
      <>
        <div
          className={`grid ${columnsMap[columns] || columnsMap[3]} ${gapMap[gap]}`}
        >
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`bg-white p-3 pb-12 shadow-lg transform hover:rotate-0 transition-transform ${idx % 2 === 0 ? "rotate-2" : "-rotate-2"} ${lightboxEnabled && !isEditing ? "cursor-pointer" : ""}`}
              onClick={
                isEditing
                  ? undefined
                  : () => lightboxEnabled && setSelectedImage(img)
              }
            >
              <div className={`${aspectMap[aspectRatio]} overflow-hidden`}>
                <img
                  src={img.src}
                  alt={img.alt || `Gallery image ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              {img.caption && (
                <p className="text-center mt-3 text-sm text-gray-600 font-handwriting">
                  {img.caption}
                </p>
              )}
            </div>
          ))}
        </div>
        {renderLightbox()}
      </>
    );
  }

  // Carousel style
  if (style === "carousel") {
    return (
      <>
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`flex-shrink-0 w-80 snap-center overflow-hidden ${radiusMap[borderRadius]} group ${lightboxEnabled && !isEditing ? "cursor-pointer" : ""}`}
              onClick={
                isEditing
                  ? undefined
                  : () => lightboxEnabled && setSelectedImage(img)
              }
            >
              <div className={`${aspectMap[aspectRatio]} relative`}>
                <img
                  src={img.src}
                  alt={img.alt || `Gallery image ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {img.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm">{img.caption}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {renderLightbox()}
      </>
    );
  }

  // Lightbox style (larger focus on modal)
  if (style === "lightbox") {
    return (
      <>
        <div
          className={`grid ${columnsMap[columns] || columnsMap[3]} ${gapMap[gap]}`}
        >
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`relative overflow-hidden ${aspectMap[aspectRatio]} ${radiusMap[borderRadius]} group cursor-pointer`}
              onClick={isEditing ? undefined : () => setSelectedImage(img)}
            >
              <img
                src={img.src}
                alt={img.alt || `Gallery image ${idx + 1}`}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-75"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <X className="w-6 h-6 text-white rotate-45" />
                </div>
              </div>
            </div>
          ))}
        </div>
        {renderLightbox()}
      </>
    );
  }

  // Default grid style
  function renderLightbox() {
    if (!selectedImage) return null;
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm cursor-pointer"
        onClick={() => setSelectedImage(null)}
      >
        <button
          className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
          onClick={() => setSelectedImage(null)}
          aria-label="Fermer"
        >
          <X className="w-8 h-8" />
        </button>
        <img
          src={selectedImage.src}
          alt={selectedImage.alt || ""}
          className="max-w-[90vw] max-h-[90vh] object-contain"
          onClick={(e) => e.stopPropagation()}
        />
        {selectedImage.caption && (
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-center">
            {selectedImage.caption}
          </p>
        )}
      </div>
    );
  }

  return (
    <>
      <div
        className={`grid ${columnsMap[columns] || columnsMap[3]} ${gapMap[gap]}`}
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`relative overflow-hidden ${aspectMap[aspectRatio]} ${radiusMap[borderRadius]} group ${lightboxEnabled && !isEditing ? "cursor-pointer" : ""}`}
            onClick={
              isEditing
                ? undefined
                : () => lightboxEnabled && setSelectedImage(img)
            }
          >
            <img
              src={img.src}
              alt={img.alt || `Gallery image ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {img.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm">{img.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      {renderLightbox()}
    </>
  );
}

// ============================================
// Video Block
// ============================================

interface VideoContent {
  type?: "youtube" | "vimeo" | "file";
  url?: string;
  poster?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  aspectRatio?: string;
  borderRadius?: string;
}

export function VideoBlock({ content }: BlockContentProps<VideoContent>) {
  const type = content.type || "youtube";
  const url = content.url || "";
  const aspectRatio = content.aspectRatio || "video";
  const borderRadius = content.borderRadius || "lg";
  const autoplay = content.autoplay;
  const muted = content.muted ?? true;
  const loop = content.loop;
  const controls = content.controls ?? true;

  const aspectMap: Record<string, string> = {
    video: "aspect-video",
    square: "aspect-square",
    wide: "aspect-[21/9]",
  };

  const radiusMap: Record<string, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
  };

  // Extract video ID for YouTube/Vimeo
  const getEmbedUrl = () => {
    if (type === "youtube") {
      const match = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/,
      );
      const videoId = match ? match[1] : url;
      let embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0`;
      if (autoplay) embedUrl += "&autoplay=1";
      if (muted) embedUrl += "&mute=1";
      if (loop) embedUrl += `&loop=1&playlist=${videoId}`;
      return embedUrl;
    }
    if (type === "vimeo") {
      const match = url.match(/vimeo\.com\/(\d+)/);
      const videoId = match ? match[1] : url;
      let embedUrl = `https://player.vimeo.com/video/${videoId}`;
      const params = [];
      if (autoplay) params.push("autoplay=1");
      if (muted) params.push("muted=1");
      if (loop) params.push("loop=1");
      if (params.length) embedUrl += `?${params.join("&")}`;
      return embedUrl;
    }
    return url;
  };

  if (!url) {
    return (
      <div
        className={`bg-gray-100/10 ${aspectMap[aspectRatio]} ${radiusMap[borderRadius]} flex items-center justify-center text-gray-400`}
      >
        No video URL
      </div>
    );
  }

  if (type === "file") {
    return (
      <div
        className={`${aspectMap[aspectRatio]} ${radiusMap[borderRadius]} overflow-hidden`}
      >
        <video
          src={url}
          poster={content.poster}
          autoPlay={autoplay}
          muted={muted}
          loop={loop}
          controls={controls}
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`${aspectMap[aspectRatio]} ${radiusMap[borderRadius]} overflow-hidden`}
    >
      <iframe
        src={getEmbedUrl()}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Video"
      />
    </div>
  );
}

// ============================================
// File Block
// ============================================

interface FileContent {
  name?: string;
  url?: string;
  size?: string;
  type?: string;
  description?: string;
}

export function FileBlock({ content }: BlockContentProps<FileContent>) {
  const name = content.name || "Document";
  const url = content.url || "#";
  const size = content.size;
  const type = content.type;
  const description = content.description;

  const getFileIcon = () => {
    const ext = name.split(".").pop()?.toLowerCase() || type?.toLowerCase();
    const iconClasses = "w-8 h-8";

    if (["pdf"].includes(ext || "")) {
      return <span className={`${iconClasses} text-red-500`}>PDF</span>;
    }
    if (["doc", "docx"].includes(ext || "")) {
      return <span className={`${iconClasses} text-blue-500`}>DOC</span>;
    }
    if (["xls", "xlsx"].includes(ext || "")) {
      return <span className={`${iconClasses} text-green-500`}>XLS</span>;
    }
    if (["zip", "rar"].includes(ext || "")) {
      return <span className={`${iconClasses} text-yellow-500`}>ZIP</span>;
    }
    return <span className={iconClasses}>📄</span>;
  };

  return (
    <a
      href={url}
      download
      className="flex items-center gap-4 p-4 bg-gray-100/10 rounded-lg hover:bg-gray-100/20 transition-colors group"
    >
      <div className="flex-shrink-0 w-12 h-12 bg-gray-100/20 rounded-lg flex items-center justify-center">
        {getFileIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate group-hover:text-primary transition-colors">
          {name}
        </p>
        {description && (
          <p className="text-sm opacity-70 truncate">{description}</p>
        )}
        {size && <p className="text-xs opacity-50">{size}</p>}
      </div>
      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        ↓
      </div>
    </a>
  );
}

// ============================================
// Iframe Block
// ============================================

interface IframeContent {
  url?: string;
  height?: number;
  title?: string;
  allowFullscreen?: boolean;
  aspectRatio?: string;
  borderRadius?: string;
}

export function IframeBlock({ content }: BlockContentProps<IframeContent>) {
  const url = content.url || "";
  const height = content.height || 400;
  const title = content.title || "Embedded content";
  const allowFullscreen = content.allowFullscreen ?? true;
  const aspectRatio = content.aspectRatio;
  const borderRadius = content.borderRadius || "lg";

  const radiusMap: Record<string, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
  };

  if (!url) {
    return (
      <div
        className={`bg-gray-100/10 h-64 ${radiusMap[borderRadius]} flex items-center justify-center text-gray-400`}
      >
        No URL provided
      </div>
    );
  }

  const aspectClass = aspectRatio === "video" ? "aspect-video" : "";

  return (
    <div
      className={`overflow-hidden ${radiusMap[borderRadius]} ${aspectClass}`}
      style={!aspectRatio ? { height: `${height}px` } : undefined}
    >
      <iframe
        src={url}
        title={title}
        className="w-full h-full border-0"
        allowFullScreen={allowFullscreen}
      />
    </div>
  );
}
