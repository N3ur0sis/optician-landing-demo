"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GridTile, SliderConfig, SliderSlideData } from "./GridManagerClient";
import { AlertCircle, Image as ImageIcon, Link as LinkIcon, ExternalLink, Plus, Trash2, GripVertical, ChevronUp, ChevronDown, Play, Layers } from "lucide-react";
import MediaPicker from "@/components/media/MediaPicker";

type Page = {
  id: string;
  title: string;
  slug: string;
};

type GridTileFormProps = {
  tile: GridTile | null;
  onSave: (tile: Partial<GridTile>) => void;
  onClose: () => void;
};

type ValidationErrors = {
  title?: string;
  href?: string;
  backgroundUrl?: string;
  rowStart?: string;
};

const defaultSliderConfig: SliderConfig = {
  slides: [],
  autoplay: true,
  interval: 5,
  transition: "slide",
  showDots: true,
  showArrows: true,
  pauseOnHover: true,
};

export default function GridTileForm({
  tile,
  onSave,
  onClose,
}: GridTileFormProps) {
  const [formData, setFormData] = useState({
    title: tile?.title || "",
    caption: tile?.caption || "",
    href: tile?.href || "/",
    backgroundUrl: tile?.backgroundUrl || "",
    tileType: (tile?.tileType || "image") as "image" | "slider",
    sliderData: (tile?.sliderData || defaultSliderConfig) as SliderConfig,
    colSpan: tile?.colSpan || 2,
    rowSpan: tile?.rowSpan || 1,
    colStart: tile?.colStart || 1,
    rowStart: tile?.rowStart || 1,
    overlayType: tile?.overlayType || ("DARK" as "LIGHT" | "DARK"),
    overlayColor: tile?.overlayColor || "",
    overlayOpacity: tile?.overlayOpacity ?? 60,
    published: tile?.published ?? true,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [pages, setPages] = useState<Page[]>([]);
  const [linkType, setLinkType] = useState<"page" | "custom">(
    tile?.href?.startsWith("/") && !tile?.href?.startsWith("http") ? "page" : "custom"
  );

  // Fetch pages for the page selector
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await fetch("/api/pages");
        if (response.ok) {
          const data = await response.json();
          setPages(data.filter((p: Page) => p.slug !== "/")); // Exclude homepage
        }
      } catch (error) {
        console.error("Failed to fetch pages:", error);
      }
    };
    fetchPages();
  }, []);

  const validateField = (
    name: string,
    value: string | number,
  ): string | undefined => {
    switch (name) {
      case "title":
        if (
          !value ||
          (typeof value === "string" && value.trim().length === 0)
        ) {
          return "Le titre est requis";
        }
        if (typeof value === "string" && value.trim().length < 2) {
          return "Le titre doit contenir au moins 2 caractères";
        }
        if (typeof value === "string" && value.trim().length > 100) {
          return "Le titre ne peut pas dépasser 100 caractères";
        }
        break;

      case "href":
        if (
          !value ||
          (typeof value === "string" && value.trim().length === 0)
        ) {
          return "Le lien est requis";
        }
        if (
          typeof value === "string" &&
          !value.startsWith("/") &&
          !value.startsWith("http")
        ) {
          return "Le lien doit commencer par / ou http";
        }
        break;

      case "backgroundUrl":
        if (
          !value ||
          (typeof value === "string" && value.trim().length === 0)
        ) {
          return "L'URL de l'image est requise";
        }
        if (
          typeof value === "string" &&
          !value.startsWith("http") &&
          !value.startsWith("/") &&
          !value.startsWith("url(")
        ) {
          return "L'URL doit commencer par http, / ou être un gradient CSS";
        }
        break;

      case "rowStart":
        if (typeof value === "number" && value < 1) {
          return "La rangée de départ doit être au moins 1";
        }
        break;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    const titleError = validateField("title", formData.title);
    if (titleError) newErrors.title = titleError;

    // href not required for sliders (they don't link anywhere)
    if (formData.tileType !== "slider") {
      const hrefError = validateField("href", formData.href);
      if (hrefError) newErrors.href = hrefError;
    }

    // backgroundUrl only required for image tiles
    if (formData.tileType !== "slider") {
      const backgroundUrlError = validateField(
        "backgroundUrl",
        formData.backgroundUrl,
      );
      if (backgroundUrlError) newErrors.backgroundUrl = backgroundUrlError;
    }

    const rowStartError = validateField("rowStart", formData.rowStart);
    if (rowStartError) newErrors.rowStart = rowStartError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (fieldName: string) => {
    setTouched({ ...touched, [fieldName]: true });
    const fieldValue = formData[fieldName as keyof typeof formData];
    if (typeof fieldValue === "object" && fieldValue !== null) return; // skip complex fields like sliderData
    const error = validateField(
      fieldName,
      typeof fieldValue === "boolean" ? String(fieldValue) : fieldValue,
    );
    setErrors({ ...errors, [fieldName]: error });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      title: true,
      href: true,
      backgroundUrl: true,
      rowStart: true,
    });

    if (validateForm()) {
      const dataToSave: Partial<GridTile> = {
        ...formData,
        sliderData: formData.tileType === "slider" ? formData.sliderData : null,
        // For slider tiles: use first slide image as backgroundUrl preview, set href to empty
        backgroundUrl: formData.tileType === "slider" && formData.sliderData.slides.length > 0
          ? formData.sliderData.slides[0].src
          : formData.backgroundUrl,
        href: formData.tileType === "slider" ? (formData.href || "/") : formData.href,
      };
      onSave(dataToSave);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {tile ? "Modifier la Tuile" : "Ajouter une Nouvelle Tuile"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {tile
                ? "Modifier les propriétés et l'apparence de la tuile"
                : "Créer une nouvelle tuile pour votre grille"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-6 overflow-y-auto flex-1"
        >
          {/* Tile Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de tuile
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, tileType: "image" })}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-sm font-medium transition-colors border-2 ${
                  formData.tileType === "image"
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                Image statique
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, tileType: "slider" })}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-sm font-medium transition-colors border-2 ${
                  formData.tileType === "slider"
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Layers className="w-4 h-4" />
                Slider (défilant)
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (touched.title) {
                  const error = validateField("title", e.target.value);
                  setErrors({ ...errors, title: error });
                }
              }}
              onBlur={() => handleBlur("title")}
              className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors ${
                touched.title && errors.title
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
              placeholder="ex: Qui est ODB ?"
            />
            {touched.title && errors.title && (
              <div className="flex items-center gap-1 mt-1.5 text-red-600 text-xs">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.title}</span>
              </div>
            )}
          </div>

          {/* Caption - visible for all tile types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Légende
            </label>
            <input
              type="text"
              value={formData.caption}
              onChange={(e) =>
                setFormData({ ...formData, caption: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
              placeholder="ex: Découvrir la maison"
            />
          </div>

          {/* Link - only for image tiles */}
          {formData.tileType === "image" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lien <span className="text-red-500">*</span>
            </label>
            
            {/* Link type selector */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setLinkType("page")}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  linkType === "page"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <LinkIcon className="w-4 h-4" />
                Page interne
              </button>
              <button
                type="button"
                onClick={() => setLinkType("custom")}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  linkType === "custom"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <ExternalLink className="w-4 h-4" />
                URL personnalisée
              </button>
            </div>

            {/* Page selector */}
            {linkType === "page" && (
              <select
                value={formData.href}
                onChange={(e) => {
                  setFormData({ ...formData, href: e.target.value });
                  if (touched.href) {
                    const error = validateField("href", e.target.value);
                    setErrors({ ...errors, href: error });
                  }
                }}
                onBlur={() => handleBlur("href")}
                className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors ${
                  touched.href && errors.href
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              >
                <option value="/">Accueil</option>
                {pages.map((page) => (
                  <option key={page.id} value={`/${page.slug}`}>
                    {page.title}
                  </option>
                ))}
              </select>
            )}

            {/* Custom URL input */}
            {linkType === "custom" && (
              <input
                type="text"
                value={formData.href}
                onChange={(e) => {
                  setFormData({ ...formData, href: e.target.value });
                  if (touched.href) {
                    const error = validateField("href", e.target.value);
                    setErrors({ ...errors, href: error });
                  }
                }}
                onBlur={() => handleBlur("href")}
                className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors ${
                  touched.href && errors.href
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="https://exemple.com ou /page-personnalisee"
              />
            )}
            
            {touched.href && errors.href && (
              <div className="flex items-center gap-1 mt-1.5 text-red-600 text-xs">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.href}</span>
              </div>
            )}
          </div>
          )}

          {/* Background Image - only for image type */}
          {formData.tileType === "image" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image de fond <span className="text-red-500">*</span>
            </label>
            
            {/* MediaPicker for selecting from library */}
            <div className="mb-3">
              <MediaPicker
                value={formData.backgroundUrl}
                onChange={(url) => {
                  setFormData({ ...formData, backgroundUrl: url });
                  if (touched.backgroundUrl) {
                    const error = validateField("backgroundUrl", url);
                    setErrors({ ...errors, backgroundUrl: error });
                  }
                }}
                acceptTypes="image"
                placeholder="Sélectionner une image de la médiathèque"
                showPreview={true}
              />
            </div>

            {/* Or enter custom URL */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-gray-500">ou URL personnalisée</span>
              </div>
            </div>

            <input
              type="text"
              value={formData.backgroundUrl}
              onChange={(e) => {
                setFormData({ ...formData, backgroundUrl: e.target.value });
                if (touched.backgroundUrl) {
                  const error = validateField("backgroundUrl", e.target.value);
                  setErrors({ ...errors, backgroundUrl: error });
                }
              }}
              onBlur={() => handleBlur("backgroundUrl")}
              className={`mt-3 w-full px-4 py-2.5 border rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors text-sm ${
                touched.backgroundUrl && errors.backgroundUrl
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
              placeholder="https://images.unsplash.com/photo-..."
            />
            {touched.backgroundUrl && errors.backgroundUrl && (
              <div className="flex items-center gap-1 mt-1.5 text-red-600 text-xs">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.backgroundUrl}</span>
              </div>
            )}
          </div>
          )}

          {/* Slider Configuration - only for slider type */}
          {formData.tileType === "slider" && (
          <div className="space-y-4 p-4 bg-purple-50 border border-purple-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-5 h-5 text-purple-600" />
              <h3 className="text-sm font-semibold text-purple-900">Configuration du slider</h3>
            </div>

            {/* Slides list */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slides ({formData.sliderData.slides.length})
              </label>
              <div className="space-y-2">
                {formData.sliderData.slides.map((slide, idx) => (
                  <div key={slide.id} className="flex items-start gap-2 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex flex-col gap-0.5 mt-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          const slides = [...formData.sliderData.slides];
                          [slides[idx - 1], slides[idx]] = [slides[idx], slides[idx - 1]];
                          setFormData({ ...formData, sliderData: { ...formData.sliderData, slides } });
                        }}
                        className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        <ChevronUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === formData.sliderData.slides.length - 1}
                        onClick={() => {
                          const slides = [...formData.sliderData.slides];
                          [slides[idx], slides[idx + 1]] = [slides[idx + 1], slides[idx]];
                          setFormData({ ...formData, sliderData: { ...formData.sliderData, slides } });
                        }}
                        className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="w-20 h-14 bg-gray-100 rounded overflow-hidden shrink-0">
                      {slide.src ? (
                        <img src={slide.src} alt={slide.alt || ""} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2 min-w-0">
                      <MediaPicker
                        value={slide.src}
                        onChange={(url) => {
                          const slides = [...formData.sliderData.slides];
                          slides[idx] = { ...slides[idx], src: url };
                          setFormData({ ...formData, sliderData: { ...formData.sliderData, slides } });
                        }}
                        acceptTypes="image"
                        placeholder="Image du slide"
                        showPreview={false}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={slide.title || ""}
                          onChange={(e) => {
                            const slides = [...formData.sliderData.slides];
                            slides[idx] = { ...slides[idx], title: e.target.value };
                            setFormData({ ...formData, sliderData: { ...formData.sliderData, slides } });
                          }}
                          placeholder="Titre (optionnel)"
                          className="col-span-2 px-2 py-1.5 border border-gray-300 rounded text-sm"
                        />
                        <textarea
                          rows={3}
                          value={slide.description || ""}
                          onChange={(e) => {
                            const slides = [...formData.sliderData.slides];
                            slides[idx] = { ...slides[idx], description: e.target.value };
                            setFormData({ ...formData, sliderData: { ...formData.sliderData, slides } });
                          }}
                          placeholder="Description / texte affiché sur la tuile (optionnel)"
                          className="col-span-2 px-2 py-1.5 border border-gray-300 rounded text-sm resize-none"
                        />
                      </div>
                      {/* Slide link */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          {(() => {
                            const knownPaths = ["/", ...pages.map(p => `/${p.slug}`)];
                            const isCustom = slide.href && !knownPaths.includes(slide.href);
                            const selectValue = !slide.href ? "" : isCustom ? "__custom__" : slide.href;
                            return (
                              <>
                                <select
                                  value={selectValue}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const slides = [...formData.sliderData.slides];
                                    if (val === "__custom__") {
                                      slides[idx] = { ...slides[idx], href: "https://" };
                                    } else {
                                      slides[idx] = { ...slides[idx], href: val || undefined };
                                    }
                                    setFormData({ ...formData, sliderData: { ...formData.sliderData, slides } });
                                  }}
                                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-white"
                                >
                                  <option value="">Pas de lien (non cliquable)</option>
                                  <option value="/">Accueil</option>
                                  {pages.map((page) => (
                                    <option key={page.id} value={`/${page.slug}`}>
                                      {page.title}
                                    </option>
                                  ))}
                                  <option value="__custom__">URL personnalisée...</option>
                                </select>
                                {isCustom && (
                                  <input
                                    type="text"
                                    value={slide.href || ""}
                                    onChange={(e) => {
                                      const slides = [...formData.sliderData.slides];
                                      slides[idx] = { ...slides[idx], href: e.target.value };
                                      setFormData({ ...formData, sliderData: { ...formData.sliderData, slides } });
                                    }}
                                    placeholder="https://exemple.com ou /page"
                                    className="mt-1 px-2 py-1.5 border border-gray-300 rounded text-sm w-full"
                                  />
                                )}
                              </>
                            );
                          })()}
                        </div>
                        <LinkIcon className="w-4 h-4 text-gray-400 shrink-0" />
                      </div>
                      {slide.href && slide.href !== "" && (
                        <div className="flex items-center gap-1 text-xs text-purple-600">
                          <ExternalLink className="w-3 h-3" />
                          <span>Redirige vers : {slide.href}</span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const slides = formData.sliderData.slides.filter((_, i) => i !== idx);
                        setFormData({ ...formData, sliderData: { ...formData.sliderData, slides } });
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newSlide: SliderSlideData = {
                      id: Date.now().toString(),
                      src: "",
                      alt: "",
                      title: "",
                      description: "",
                      href: "",
                    };
                    setFormData({
                      ...formData,
                      sliderData: {
                        ...formData.sliderData,
                        slides: [...formData.sliderData.slides, newSlide],
                      },
                    });
                  }}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm text-purple-600 hover:text-purple-800 border border-dashed border-purple-300 hover:border-purple-400 rounded-lg w-full justify-center bg-white"
                >
                  <Plus className="h-4 w-4" /> Ajouter un slide
                </button>
              </div>
            </div>

            {/* Slider options */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-purple-200">
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sliderData.autoplay}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sliderData: { ...formData.sliderData, autoplay: e.target.checked },
                      })
                    }
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Défilement automatique</span>
                </label>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Intervalle ({formData.sliderData.interval}s)
                </label>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={formData.sliderData.interval}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sliderData: { ...formData.sliderData, interval: parseInt(e.target.value) },
                    })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Transition</label>
                <select
                  value={formData.sliderData.transition}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sliderData: { ...formData.sliderData, transition: e.target.value as "slide" | "fade" | "none" },
                    })
                  }
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-white"
                >
                  <option value="slide">Glissement</option>
                  <option value="fade">Fondu</option>
                  <option value="none">Aucune</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sliderData.showDots}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sliderData: { ...formData.sliderData, showDots: e.target.checked },
                      })
                    }
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-xs text-gray-700">Puces</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sliderData.showArrows}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sliderData: { ...formData.sliderData, showArrows: e.target.checked },
                      })
                    }
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-xs text-gray-700">Flèches</span>
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sliderData.pauseOnHover}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sliderData: { ...formData.sliderData, pauseOnHover: e.target.checked },
                      })
                    }
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-xs text-gray-700">Pause au survol</span>
                </label>
              </div>
            </div>
          </div>
          )}

          {/* Grid Size */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Largeur (1-4 colonnes)
              </label>
              <select
                value={formData.colSpan}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    colSpan: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white transition-colors cursor-pointer"
              >
                <option value={1}>1 colonne</option>
                <option value={2}>2 colonnes</option>
                <option value={3}>3 colonnes</option>
                <option value={4}>4 colonnes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hauteur (1-2 rangées)
              </label>
              <select
                value={formData.rowSpan}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rowSpan: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white transition-colors cursor-pointer"
              >
                <option value={1}>1 rangée</option>
                <option value={2}>2 rangées</option>
              </select>
            </div>
          </div>

          {/* Grid Position */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Colonne de Départ (1-4)
              </label>
              <select
                value={formData.colStart}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    colStart: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white transition-colors cursor-pointer"
              >
                <option value={1}>Colonne 1</option>
                <option value={2}>Colonne 2</option>
                <option value={3}>Colonne 3</option>
                <option value={4}>Colonne 4</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rangée de Départ
              </label>
              <input
                type="number"
                value={formData.rowStart}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setFormData({ ...formData, rowStart: value });
                  if (touched.rowStart) {
                    const error = validateField("rowStart", value);
                    setErrors({ ...errors, rowStart: error });
                  }
                }}
                onBlur={() => handleBlur("rowStart")}
                min={1}
                className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors ${
                  touched.rowStart && errors.rowStart
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {touched.rowStart && errors.rowStart && (
                <div className="flex items-center gap-1 mt-1.5 text-red-600 text-xs">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.rowStart}</span>
                </div>
              )}
            </div>
          </div>

          {/* Overlay Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de Filtre
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  value="DARK"
                  checked={formData.overlayType === "DARK"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      overlayType: e.target.value as "DARK",
                    })
                  }
                  className="mr-2 w-4 h-4 text-gray-900 border-gray-300 focus:ring-2 focus:ring-gray-900 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                  Sombre (texte clair)
                </span>
              </label>
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  value="LIGHT"
                  checked={formData.overlayType === "LIGHT"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      overlayType: e.target.value as "LIGHT",
                    })
                  }
                  className="mr-2 w-4 h-4 text-gray-900 border-gray-300 focus:ring-2 focus:ring-gray-900 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                  Clair (texte sombre)
                </span>
              </label>
            </div>
          </div>

          {/* Overlay Color & Opacity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Couleur du filtre (optionnel)
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={
                    formData.overlayColor ||
                    (formData.overlayType === "DARK" ? "#000000" : "#ffffff")
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, overlayColor: e.target.value })
                  }
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.overlayColor}
                  onChange={(e) =>
                    setFormData({ ...formData, overlayColor: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Défaut (noir/blanc)"
                />
                {formData.overlayColor && (
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, overlayColor: "" })
                    }
                    className="px-2 text-gray-400 hover:text-red-500"
                  >
                    ✕
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Laissez vide pour utiliser la couleur par défaut
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opacité du filtre ({formData.overlayOpacity}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.overlayOpacity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    overlayOpacity: parseInt(e.target.value),
                  })
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0% (transparent)</span>
                <span>100% (opaque)</span>
              </div>
            </div>
          </div>

          {/* Published */}
          <div>
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) =>
                  setFormData({ ...formData, published: e.target.checked })
                }
                className="mr-2 w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-2 focus:ring-gray-900 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                Publié
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Les tuiles non publiées n'apparaîtront pas sur le site
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-medium text-white bg-black rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-black/10"
            >
              {tile ? "✓ Mettre à Jour" : "+ Créer la Tuile"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
