"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Save,
  Loader2,
  Check,
  AlertCircle,
  ImageIcon,
  Play,
  Monitor,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  Plus,
  Trash2,
  GripVertical,
  Link as LinkIcon,
  FileText,
  RefreshCw,
  Palette,
  Type,
  Layout,
  Sliders,
} from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
import MediaPicker from "@/components/media/MediaPicker";
import {
  ApparenceSettings,
  FooterLink,
  defaultApparenceSettings,
  parseSettingsFromAPI,
} from "@/types/apparence";

// =============================================================================
// TYPES
// =============================================================================

interface Page {
  id: string;
  title: string;
  slug: string;
  published: boolean;
}

// Use centralized defaults
const defaultSettings = defaultApparenceSettings;

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function PreviewModeSelector({
  mode,
  setMode,
}: {
  mode: "desktop" | "tablet" | "mobile";
  setMode: (mode: "desktop" | "tablet" | "mobile") => void;
}) {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-3">
      <span className="text-sm font-medium text-gray-700">
        Prévisualisation
      </span>
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setMode("desktop")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${mode === "desktop" ? "bg-white shadow text-gray-900" : "text-gray-600 hover:text-gray-900"}`}
        >
          <Monitor className="w-3.5 h-3.5" />
          Desktop
        </button>
        <button
          onClick={() => setMode("tablet")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${mode === "tablet" ? "bg-white shadow text-gray-900" : "text-gray-600 hover:text-gray-900"}`}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <rect x="4" y="2" width="16" height="20" rx="2" strokeWidth="2" />
          </svg>
          Tablette
        </button>
        <button
          onClick={() => setMode("mobile")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${mode === "mobile" ? "bg-white shadow text-gray-900" : "text-gray-600 hover:text-gray-900"}`}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <rect x="6" y="2" width="12" height="20" rx="2" strokeWidth="2" />
          </svg>
          Mobile
        </button>
      </div>
    </div>
  );
}

function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
  badge,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
            <Icon className="h-4 w-4 text-gray-600" />
          </div>
          <span className="text-sm font-semibold text-gray-900">{title}</span>
          {badge && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 pt-0 border-t border-gray-100">{children}</div>
      )}
    </div>
  );
}

function ColorInput({
  label,
  value,
  onChange,
  description,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  description?: string;
}) {
  // Use local state to prevent infinite loops when value is empty
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    // Only call onChange if value actually changed
    if (newValue !== value) {
      onChange(newValue);
    }
  };

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={localValue || "#000000"}
          onChange={(e) => handleChange(e.target.value)}
          className="h-9 w-12 border border-gray-300 rounded cursor-pointer"
        />
        <input
          type="text"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
        />
      </div>
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );
}

function RangeInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = "",
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <label className="text-xs font-medium text-gray-600">{label}</label>
        <span className="text-xs text-gray-900 font-mono bg-gray-100 px-2 py-0.5 rounded">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
      />
    </div>
  );
}

function ToggleSwitch({
  label,
  checked,
  onChange,
  description,
}: {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <div>
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${checked ? "bg-black" : "bg-gray-200"}`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`}
        />
      </button>
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
      />
    </div>
  );
}

function EditableText({
  value,
  onChange,
  className,
  style,
}: {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (editValue !== value) onChange(editValue);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleBlur();
    if (e.key === "Escape") {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`bg-white/90 border-2 border-blue-500 rounded px-2 py-1 outline-none ${className}`}
        style={{ ...style, minWidth: "80px", color: "#000" }}
      />
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      className={`cursor-text hover:ring-2 hover:ring-blue-400 hover:ring-dashed rounded px-1 transition-all ${className}`}
      style={style}
      title="Cliquez pour modifier"
    >
      {value || "Cliquez pour modifier"}
    </span>
  );
}

function DraggableLinkEditor({
  links,
  onChange,
  pages,
}: {
  links: FooterLink[];
  onChange: (links: FooterLink[]) => void;
  pages: Page[];
}) {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const draggedIndex = links.findIndex((l) => l.id === draggedId);
    const targetIndex = links.findIndex((l) => l.id === targetId);
    if (draggedIndex === -1 || targetIndex === -1) return;

    const newLinks = [...links];
    const [removed] = newLinks.splice(draggedIndex, 1);
    newLinks.splice(targetIndex, 0, removed);
    onChange(newLinks);
  };

  const handleDragEnd = () => setDraggedId(null);

  const addLink = () => {
    onChange([
      ...links,
      {
        id: Date.now().toString(),
        label: "Nouveau lien",
        url: "/",
        pageSlug: "",
      },
    ]);
  };

  const removeLink = (id: string) => onChange(links.filter((l) => l.id !== id));

  const updateLink = (id: string, field: keyof FooterLink, value: string) => {
    onChange(
      links.map((link) => {
        if (link.id !== id) return link;
        const updated = { ...link, [field]: value };
        if (field === "pageSlug" && value) {
          const page = pages.find((p) => p.slug === value);
          if (page) {
            updated.url = `/${value}`;
            if (updated.label === "Nouveau lien") updated.label = page.title;
          }
        }
        return updated;
      }),
    );
  };

  return (
    <div className="space-y-2 mt-3">
      {links.map((link) => (
        <div
          key={link.id}
          draggable
          onDragStart={(e) => handleDragStart(e, link.id)}
          onDragOver={(e) => handleDragOver(e, link.id)}
          onDragEnd={handleDragEnd}
          className={`flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200 ${draggedId === link.id ? "opacity-50" : ""}`}
        >
          <div className="cursor-grab text-gray-400 hover:text-gray-600">
            <GripVertical className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={link.label}
            onChange={(e) => updateLink(link.id, "label", e.target.value)}
            placeholder="Label"
            className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm bg-white"
          />
          <select
            value={link.pageSlug}
            onChange={(e) => updateLink(link.id, "pageSlug", e.target.value)}
            className="px-2 py-1.5 border border-gray-300 rounded text-sm bg-white"
          >
            <option value="">URL custom</option>
            <option value="/">Accueil</option>
            {pages.map((p) => (
              <option key={p.id} value={p.slug}>
                {p.title}
              </option>
            ))}
          </select>
          {!link.pageSlug && (
            <input
              type="text"
              value={link.url}
              onChange={(e) => updateLink(link.id, "url", e.target.value)}
              placeholder="/page"
              className="w-24 px-2 py-1.5 border border-gray-300 rounded text-sm bg-white"
            />
          )}
          <button
            onClick={() => removeLink(link.id)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        onClick={addLink}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-black border border-dashed border-gray-300 hover:border-gray-400 rounded-lg w-full justify-center"
      >
        <Plus className="h-4 w-4" /> Ajouter
      </button>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ApparenceClient() {
  const [settings, setSettings] = useState<ApparenceSettings>(defaultSettings);
  const [originalSettings, setOriginalSettings] =
    useState<ApparenceSettings>(defaultSettings);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<
    "logos" | "loading" | "intro" | "footer"
  >("logos");
  const [hasChanges, setHasChanges] = useState(false);
  const [loadingPreviewMode, setLoadingPreviewMode] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const [introPreviewMode, setIntroPreviewMode] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const [footerPreviewMode, setFooterPreviewMode] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");

  useEffect(() => {
    setHasChanges(
      JSON.stringify(settings) !== JSON.stringify(originalSettings),
    );
  }, [settings, originalSettings]);

  const fetchPages = useCallback(async () => {
    try {
      const response = await fetch("/api/pages");
      if (response.ok) setPages(await response.json());
    } catch (error) {
      console.error("Failed to fetch pages:", error);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch("/api/settings");
      if (response.ok) {
        const data = await response.json();
        const loadedSettings = parseSettingsFromAPI(data);
        setSettings(loadedSettings);
        setOriginalSettings(loadedSettings);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
    fetchPages();
  }, [fetchSettings, fetchPages]);

  const saveSettings = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const settingsToSave = {
        ...settings,
        footer_nav_links: JSON.stringify(settings.footer_nav_links),
        footer_legal_links: JSON.stringify(settings.footer_legal_links),
      };

      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: settingsToSave }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "✓ Sauvegardé !" });
        setOriginalSettings(settings);
        setHasChanges(false);
      } else throw new Error("Failed to save");
    } catch {
      setMessage({ type: "error", text: "Erreur de sauvegarde" });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const resetChanges = () => {
    setSettings(originalSettings);
    setHasChanges(false);
  };
  const updateSetting = <K extends keyof ApparenceSettings>(
    key: K,
    value: ApparenceSettings[K],
  ) => setSettings((prev) => ({ ...prev, [key]: value }));

  // Intro gradient - default is neutral gray, custom allows color change
  const getIntroBackground = () => {
    if (settings.intro_gradient_enabled) {
      const intensity = settings.intro_gradient_intensity / 100;
      return `radial-gradient(circle at center, #ffffff 0%, ${settings.intro_gradient_color}${Math.round(
        intensity * 40,
      )
        .toString(16)
        .padStart(2, "0")} 30%, ${settings.intro_gradient_color}${Math.round(
        intensity * 80,
      )
        .toString(16)
        .padStart(2, "0")} 60%, ${settings.intro_gradient_color} 100%)`;
    }
    // Default neutral gray gradient
    return `radial-gradient(circle at center, #ffffff 0%, #f5f5f5 20%, #e5e5e5 40%, #d4d4d4 60%, #a3a3a3 80%, #737373 100%)`;
  };

  const textColorWithOpacity = (opacity: number) => {
    const hex = (settings.footer_text_color || "#ffffff").replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16) || 255;
    const g = parseInt(hex.substring(2, 4), 16) || 255;
    const b = parseInt(hex.substring(4, 6), 16) || 255;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const tabs = [
    { id: "logos" as const, label: "Logos", icon: ImageIcon },
    { id: "loading" as const, label: "Chargement", icon: Play },
    { id: "intro" as const, label: "Introduction", icon: Sparkles },
    { id: "footer" as const, label: "Footer", icon: Layout },
  ];

  return (
    <div
      className="h-[calc(100vh-80px)] flex flex-col max-w-6xl mx-auto"
      style={{ colorScheme: "light" }}
    >
      {/* Fixed Header Section */}
      <div className="shrink-0 px-6 pt-6 pb-4">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Apparence</h1>
            <p className="text-sm text-gray-500 mt-1">
              Personnalisez l&apos;identité visuelle de votre site
            </p>
          </div>
          <div className="flex items-center gap-3">
            {hasChanges && (
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full text-sm font-medium">
                <AlertCircle className="h-4 w-4" />
                Non sauvegardé
              </div>
            )}
            {/* Save buttons in header */}
            {hasChanges && (
              <button
                onClick={resetChanges}
                className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-200 text-sm font-medium transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Annuler
              </button>
            )}
            <button
              onClick={saveSettings}
              disabled={saving || !hasChanges}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${hasChanges ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-4 p-3 rounded-xl flex items-center gap-2 text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
          >
            {message.type === "success" ? (
              <Check className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-all rounded-lg ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content - Split between Preview (fixed) and Options (scrollable) */}
      <div className="flex-1 flex flex-col min-h-0 px-6 pb-6">
        {/* LOGOS TAB */}
        {activeTab === "logos" && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {/* Checkerboard pattern for transparency - defined as CSS */}
            <style>{`
            .checkerboard-bg {
              background-image: linear-gradient(45deg, #ccc 25%, transparent 25%), 
                                linear-gradient(-45deg, #ccc 25%, transparent 25%), 
                                linear-gradient(45deg, transparent 75%, #ccc 75%), 
                                linear-gradient(-45deg, transparent 75%, #ccc 75%);
              background-size: 16px 16px;
              background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
              background-color: #fff;
            }
          `}</style>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Navbar Logo - white/light background typically */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Logo Navbar
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Logo affiché dans la barre de navigation (fond clair)
                </p>
                <div className="rounded-lg overflow-hidden border-2 border-dashed border-gray-200">
                  <div className="checkerboard-bg">
                    <div className="bg-white/90 p-4">
                      {settings.navbar_logo_url ? (
                        <div className="flex items-center justify-center h-24">
                          <img
                            src={settings.navbar_logo_url}
                            alt="Logo Navbar"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="h-24 flex items-center justify-center text-gray-400 text-sm">
                          Aucun logo
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 border-t border-gray-200">
                    <MediaPicker
                      value={settings.navbar_logo_url}
                      onChange={(url) => updateSetting("navbar_logo_url", url)}
                      acceptTypes="image"
                      placeholder="Logo navbar"
                      showPreview={false}
                    />
                  </div>
                </div>
              </div>

              {/* Intro Logo - uses intro gradient background */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Logo Introduction
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Logo affiché sur la page d&apos;introduction
                </p>
                <div className="rounded-lg overflow-hidden border-2 border-dashed border-gray-200">
                  <div className="checkerboard-bg">
                    <div
                      className="p-4"
                      style={{ background: getIntroBackground() }}
                    >
                      {settings.intro_logo_url ? (
                        <div className="flex items-center justify-center h-24">
                          <img
                            src={settings.intro_logo_url}
                            alt="Logo Introduction"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="h-24 flex items-center justify-center text-white/60 text-sm">
                          Aucun logo
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 border-t border-gray-200">
                    <MediaPicker
                      value={settings.intro_logo_url}
                      onChange={(url) => updateSetting("intro_logo_url", url)}
                      acceptTypes="image"
                      placeholder="Logo introduction"
                      showPreview={false}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Loading Logo - uses loading background */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Logo Chargement
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Logo affiché pendant le chargement
                </p>
                <div className="rounded-lg overflow-hidden border-2 border-dashed border-gray-200">
                  <div className="checkerboard-bg">
                    <div
                      className="p-4"
                      style={{ backgroundColor: settings.loading_bg_color }}
                    >
                      {settings.loading_logo_url ? (
                        <div className="flex items-center justify-center h-24">
                          <img
                            src={settings.loading_logo_url}
                            alt="Logo Chargement"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="h-24 flex items-center justify-center text-gray-400 text-sm">
                          Aucun logo
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 border-t border-gray-200">
                    <MediaPicker
                      value={settings.loading_logo_url}
                      onChange={(url) => updateSetting("loading_logo_url", url)}
                      acceptTypes="image"
                      placeholder="Logo chargement"
                      showPreview={false}
                    />
                  </div>
                </div>
              </div>

              {/* Footer Logo - uses footer background color */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Logo Footer
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Logo affiché dans le pied de page
                </p>
                <div className="rounded-lg overflow-hidden border-2 border-dashed border-gray-200">
                  <div className="checkerboard-bg">
                    <div
                      className="p-4"
                      style={{ backgroundColor: settings.footer_bg_color }}
                    >
                      {settings.footer_logo_url ? (
                        <div className="flex items-center justify-center h-24">
                          <img
                            src={settings.footer_logo_url}
                            alt="Logo Footer"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div
                          className="h-24 flex items-center justify-center text-sm"
                          style={{ color: textColorWithOpacity(0.5) }}
                        >
                          Aucun logo
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 border-t border-gray-200">
                    <MediaPicker
                      value={settings.footer_logo_url}
                      onChange={(url) => updateSetting("footer_logo_url", url)}
                      acceptTypes="image"
                      placeholder="Logo footer"
                      showPreview={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LOADING TAB */}
        {activeTab === "loading" && (
          <div className="flex flex-col h-full min-h-0">
            {/* Fixed Preview Section */}
            <div className="shrink-0 mb-5">
              {/* Preview Mode Selector */}
              <PreviewModeSelector
                mode={loadingPreviewMode}
                setMode={setLoadingPreviewMode}
              />

              {/* Preview */}
              <div className="flex justify-center mt-4">
                <div
                  className={`rounded-xl overflow-hidden border border-gray-200 shadow-sm transition-all duration-300 ${
                    loadingPreviewMode === "desktop"
                      ? "w-full"
                      : loadingPreviewMode === "tablet"
                        ? "w-[600px]"
                        : "w-[320px]"
                  }`}
                >
                  <div
                    className="flex items-center justify-center relative"
                    style={{
                      backgroundColor: settings.loading_bg_color,
                      height:
                        loadingPreviewMode === "mobile" ? "280px" : "220px",
                    }}
                  >
                    <div className="flex flex-col items-center gap-4 relative z-10">
                      <div
                        className={`flex items-center justify-center ${
                          settings.loading_animation_type === "pulse"
                            ? "animate-pulse"
                            : settings.loading_animation_type === "bounce"
                              ? "animate-bounce"
                              : settings.loading_animation_type === "rotate"
                                ? "animate-spin"
                                : ""
                        }`}
                        style={{
                          animationDuration: `${settings.loading_duration}s`,
                        }}
                      >
                        {settings.loading_logo_url && (
                          <Image
                            src={settings.loading_logo_url}
                            alt="Logo"
                            width={100}
                            height={90}
                            className={`object-contain ${
                              loadingPreviewMode === "mobile"
                                ? "h-14 w-auto"
                                : "h-16 w-auto"
                            }`}
                          />
                        )}
                      </div>
                      {settings.loading_dots_enabled && (
                        <div className="flex space-x-1">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className={`rounded-full animate-pulse ${loadingPreviewMode === "mobile" ? "w-1.5 h-1.5" : "w-2 h-2"}`}
                              style={{
                                backgroundColor: settings.loading_dots_color,
                                animationDelay: `${i * 0.2}s`,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Options */}
            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
              <div className="flex flex-col gap-4">
                <CollapsibleSection
                  title="Apparence"
                  icon={Palette}
                  defaultOpen={true}
                >
                  <div className="space-y-4 mt-4">
                    <ColorInput
                      label="Couleur de fond"
                      value={settings.loading_bg_color}
                      onChange={(val) => updateSetting("loading_bg_color", val)}
                    />
                  </div>
                </CollapsibleSection>

                <CollapsibleSection
                  title="Animation"
                  icon={Play}
                  defaultOpen={true}
                >
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        Type d&apos;animation
                      </label>
                      <select
                        value={settings.loading_animation_type}
                        onChange={(e) =>
                          updateSetting(
                            "loading_animation_type",
                            e.target.value,
                          )
                        }
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white"
                      >
                        <option value="pulse">Pulsation</option>
                        <option value="bounce">Rebond</option>
                        <option value="rotate">Rotation</option>
                        <option value="none">Aucune</option>
                      </select>
                    </div>
                    <RangeInput
                      label="Vitesse (cycle)"
                      value={settings.loading_duration}
                      onChange={(val) => updateSetting("loading_duration", val)}
                      min={0.5}
                      max={5}
                      step={0.1}
                      unit="s"
                    />
                    <div className="pt-2 border-t border-gray-100">
                      <ToggleSwitch
                        label="Points de chargement"
                        checked={settings.loading_dots_enabled}
                        onChange={(val) =>
                          updateSetting("loading_dots_enabled", val)
                        }
                      />
                      {settings.loading_dots_enabled && (
                        <div className="mt-4">
                          <ColorInput
                            label="Couleur des points"
                            value={settings.loading_dots_color}
                            onChange={(val) =>
                              updateSetting("loading_dots_color", val)
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CollapsibleSection>
              </div>
            </div>
          </div>
        )}

        {/* INTRODUCTION TAB */}
        {activeTab === "intro" && (
          <div className="flex flex-col h-full min-h-0">
            {/* Fixed Preview Section */}
            <div className="shrink-0 mb-5">
              {/* Responsive Preview Selector */}
              <PreviewModeSelector
                mode={introPreviewMode}
                setMode={setIntroPreviewMode}
              />

              {/* Preview - Fidèle à la vraie page: Logo gauche, Lunettes centre, Texte droite */}
              <div className="flex justify-center mt-4">
                <div
                  className={`rounded-xl overflow-hidden border border-gray-200 shadow-sm transition-all duration-300 ${
                    introPreviewMode === "desktop"
                      ? "w-full"
                      : introPreviewMode === "tablet"
                        ? "w-[600px]"
                        : "w-[320px]"
                  }`}
                >
                  <div
                    className="relative"
                    style={{
                      background: getIntroBackground(),
                      height: introPreviewMode === "mobile" ? "320px" : "240px",
                    }}
                  >
                    {/* Content layer */}
                    <div className="relative z-10 h-full">
                      {/* Main layout: Logo left, Glasses center, Text right (horizontal on desktop) */}
                      {/* On mobile: Logo top, Glasses middle, Text bottom (vertical centered) */}
                      <div
                        className={`h-full flex items-center ${introPreviewMode === "mobile" ? "flex-col justify-between py-4 px-4" : "justify-center gap-6 px-6"}`}
                      >
                        {/* Top/Left: Logo - centered on mobile */}
                        <div
                          className={`shrink-0 ${introPreviewMode === "mobile" ? "flex justify-center w-full" : ""}`}
                        >
                          {settings.intro_logo_url ? (
                            <img
                              src={settings.intro_logo_url}
                              alt="Logo"
                              className={`object-contain ${
                                introPreviewMode === "mobile"
                                  ? "h-8 w-auto"
                                  : introPreviewMode === "tablet"
                                    ? "h-12 w-auto max-w-[100px]"
                                    : "h-16 w-auto max-w-[150px]"
                              }`}
                            />
                          ) : (
                            <div
                              className={`border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center ${
                                introPreviewMode === "mobile"
                                  ? "w-14 h-8"
                                  : "w-24 h-14"
                              }`}
                            >
                              <span className="text-white/40 text-xs">
                                Logo
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Center: 3D Glasses placeholder - centered on all modes */}
                        <div
                          className={`shrink-0 ${introPreviewMode === "mobile" ? "flex justify-center w-full" : ""}`}
                        >
                          <div
                            className={`border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center ${
                              introPreviewMode === "mobile"
                                ? "w-28 h-20"
                                : introPreviewMode === "tablet"
                                  ? "w-36 h-24"
                                  : "w-48 h-28"
                            }`}
                          >
                            <span
                              className={`${introPreviewMode === "mobile" ? "text-3xl" : "text-4xl"}`}
                            >
                              🕶️
                            </span>
                          </div>
                        </div>

                        {/* Bottom/Right: Tagline text - centered on mobile */}
                        <div
                          className={`shrink-0 ${introPreviewMode === "mobile" ? "w-full text-center" : "text-right"}`}
                        >
                          <div
                            className={`font-bold leading-tight ${
                              introPreviewMode === "mobile"
                                ? "text-xl"
                                : introPreviewMode === "tablet"
                                  ? "text-2xl"
                                  : "text-3xl"
                            }`}
                            style={{ color: settings.intro_text_color }}
                          >
                            {settings.intro_tagline.split(" ").length >= 4 ? (
                              <>
                                <EditableText
                                  value={settings.intro_tagline
                                    .split(" ")
                                    .slice(0, 2)
                                    .join(" ")}
                                  onChange={(val) =>
                                    updateSetting(
                                      "intro_tagline",
                                      val +
                                        " " +
                                        settings.intro_tagline
                                          .split(" ")
                                          .slice(2)
                                          .join(" "),
                                    )
                                  }
                                  className="block"
                                  style={{ color: settings.intro_text_color }}
                                />
                                <EditableText
                                  value={settings.intro_tagline
                                    .split(" ")
                                    .slice(2)
                                    .join(" ")}
                                  onChange={(val) =>
                                    updateSetting(
                                      "intro_tagline",
                                      settings.intro_tagline
                                        .split(" ")
                                        .slice(0, 2)
                                        .join(" ") +
                                        " " +
                                        val,
                                    )
                                  }
                                  className="block"
                                  style={{ color: settings.intro_text_color }}
                                />
                              </>
                            ) : (
                              <EditableText
                                value={settings.intro_tagline}
                                onChange={(val) =>
                                  updateSetting("intro_tagline", val)
                                }
                                style={{ color: settings.intro_text_color }}
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Side scroll indicators - hidden on mobile */}
                      {settings.intro_scroll_indicator_enabled &&
                        introPreviewMode !== "mobile" && (
                          <>
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
                              <div className="w-px h-6 bg-black/30" />
                              <span className="-rotate-90 text-[8px] font-bold tracking-[0.2em] text-black/50 whitespace-nowrap">
                                {settings.intro_left_text}
                              </span>
                              <div className="w-1 h-1 bg-black/40 rounded-full animate-pulse" />
                            </div>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
                              <div className="w-px h-6 bg-black/30" />
                              <span className="rotate-90 text-[8px] font-bold tracking-[0.2em] text-black/50 whitespace-nowrap">
                                {settings.intro_right_text}
                              </span>
                              <div className="w-1 h-1 bg-black/40 rounded-full animate-pulse" />
                            </div>
                          </>
                        )}

                      {/* Mouse scroll indicator at bottom */}
                      <div
                        className={`absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center`}
                      >
                        <div
                          className={`border-2 border-black/30 rounded-full flex justify-center ${
                            introPreviewMode === "mobile"
                              ? "w-4 h-6 mb-1"
                              : "w-5 h-8 mb-1"
                          }`}
                        >
                          <div
                            className={`bg-black/40 rounded-full mt-1.5 animate-bounce ${
                              introPreviewMode === "mobile"
                                ? "w-0.5 h-1"
                                : "w-0.5 h-1.5"
                            }`}
                          />
                        </div>
                        <span
                          className={`font-medium tracking-widest text-black/40 uppercase ${
                            introPreviewMode === "mobile"
                              ? "text-[8px]"
                              : "text-[10px]"
                          }`}
                        >
                          Scroll
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Options */}
            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
              <div className="flex flex-col gap-4">
                <CollapsibleSection
                  title="Textes"
                  icon={Type}
                  defaultOpen={true}
                >
                  <div className="flex flex-col gap-4 mt-4">
                    <TextInput
                      label="Tagline principal"
                      value={settings.intro_tagline}
                      onChange={(val) => updateSetting("intro_tagline", val)}
                    />

                    <div className="pt-2 border-t border-gray-100">
                      <ColorInput
                        label="Couleur du texte"
                        value={settings.intro_text_color}
                        onChange={(val) =>
                          updateSetting("intro_text_color", val)
                        }
                      />
                    </div>

                    {settings.intro_scroll_indicator_enabled && (
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-3">
                          Textes des indicateurs latéraux
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <TextInput
                            label="Texte gauche"
                            value={settings.intro_left_text}
                            onChange={(val) =>
                              updateSetting("intro_left_text", val)
                            }
                          />
                          <TextInput
                            label="Texte droite"
                            value={settings.intro_right_text}
                            onChange={(val) =>
                              updateSetting("intro_right_text", val)
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CollapsibleSection>

                <CollapsibleSection
                  title="Gradient radial"
                  icon={Palette}
                  defaultOpen={true}
                >
                  <div className="flex flex-col gap-4 mt-4">
                    <ToggleSwitch
                      label="Couleur personnalisée"
                      checked={settings.intro_gradient_enabled}
                      onChange={(val) =>
                        updateSetting("intro_gradient_enabled", val)
                      }
                      description="Désactivé = gradient gris neutre"
                    />

                    {settings.intro_gradient_enabled && (
                      <div className="pt-2 border-t border-gray-100 space-y-4">
                        <ColorInput
                          label="Couleur"
                          value={settings.intro_gradient_color}
                          onChange={(val) =>
                            updateSetting("intro_gradient_color", val)
                          }
                        />
                        <RangeInput
                          label="Intensité"
                          value={settings.intro_gradient_intensity}
                          onChange={(val) =>
                            updateSetting("intro_gradient_intensity", val)
                          }
                          min={0}
                          max={100}
                          unit="%"
                        />
                      </div>
                    )}
                  </div>
                </CollapsibleSection>

                <CollapsibleSection
                  title="Indicateurs de scroll"
                  icon={Sliders}
                  defaultOpen={false}
                >
                  <div className="flex flex-col gap-4 mt-4">
                    <ToggleSwitch
                      label="Afficher les indicateurs latéraux"
                      checked={settings.intro_scroll_indicator_enabled}
                      onChange={(val) =>
                        updateSetting("intro_scroll_indicator_enabled", val)
                      }
                      description="Indicateurs SCROLL sur les côtés"
                    />
                  </div>
                </CollapsibleSection>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER TAB */}
        {activeTab === "footer" && (
          <div className="flex flex-col h-full min-h-0">
            {/* Fixed Preview Section */}
            <div className="shrink-0 mb-5">
              {/* Responsive Preview Selector */}
              <PreviewModeSelector
                mode={footerPreviewMode}
                setMode={setFooterPreviewMode}
              />

              {/* Preview - Responsive footer preview */}
              <div className="flex justify-center mt-4">
                <div
                  className={`rounded-xl overflow-hidden border border-gray-200 shadow-sm transition-all duration-300 ${
                    footerPreviewMode === "desktop"
                      ? "w-full"
                      : footerPreviewMode === "tablet"
                        ? "w-[600px]"
                        : "w-[320px]"
                  }`}
                >
                  <footer
                    className="border-t"
                    style={{
                      backgroundColor: settings.footer_bg_color,
                      color: settings.footer_text_color,
                      paddingTop: Math.min(settings.footer_padding_y / 2, 24),
                      paddingBottom: Math.min(
                        settings.footer_padding_y / 2,
                        24,
                      ),
                      borderColor:
                        settings.footer_border_color ||
                        textColorWithOpacity(0.1),
                    }}
                  >
                    <div
                      className={`mx-auto ${footerPreviewMode === "mobile" ? "px-3" : "px-4"}`}
                    >
                      {/* Responsive grid: 4 cols desktop, 2 cols tablet, 1 col mobile */}
                      <div
                        className={`grid gap-4 text-xs ${
                          footerPreviewMode === "desktop"
                            ? "grid-cols-4"
                            : footerPreviewMode === "tablet"
                              ? "grid-cols-2"
                              : "grid-cols-1"
                        }`}
                      >
                        {/* Logo & tagline */}
                        <div
                          className={
                            footerPreviewMode === "mobile" ? "text-center" : ""
                          }
                        >
                          {settings.footer_logo_url && (
                            <Image
                              src={settings.footer_logo_url}
                              alt="Logo"
                              width={120}
                              height={60}
                              className={`h-6 w-auto object-contain mb-2 ${footerPreviewMode === "mobile" ? "mx-auto" : ""}`}
                            />
                          )}
                          <EditableText
                            value={settings.footer_tagline}
                            onChange={(val) =>
                              updateSetting("footer_tagline", val)
                            }
                            className="text-[10px] opacity-60 block"
                          />
                          <div
                            className={`flex gap-1 mt-2 ${footerPreviewMode === "mobile" ? "justify-center" : ""}`}
                          >
                            {settings.social_facebook && (
                              <div
                                className="w-5 h-5 rounded-full border flex items-center justify-center"
                                style={{
                                  borderColor: textColorWithOpacity(0.2),
                                  color: settings.social_icon_color,
                                }}
                              >
                                <FaFacebook className="w-2 h-2" />
                              </div>
                            )}
                            {settings.social_instagram && (
                              <div
                                className="w-5 h-5 rounded-full border flex items-center justify-center"
                                style={{
                                  borderColor: textColorWithOpacity(0.2),
                                  color: settings.social_icon_color,
                                }}
                              >
                                <FaInstagram className="w-2 h-2" />
                              </div>
                            )}
                            {settings.social_linkedin && (
                              <div
                                className="w-5 h-5 rounded-full border flex items-center justify-center"
                                style={{
                                  borderColor: textColorWithOpacity(0.2),
                                  color: settings.social_icon_color,
                                }}
                              >
                                <FaLinkedin className="w-2 h-2" />
                              </div>
                            )}
                            {settings.social_twitter && (
                              <div
                                className="w-5 h-5 rounded-full border flex items-center justify-center"
                                style={{
                                  borderColor: textColorWithOpacity(0.2),
                                  color: settings.social_icon_color,
                                }}
                              >
                                <FaTwitter className="w-2 h-2" />
                              </div>
                            )}
                            {settings.social_youtube && (
                              <div
                                className="w-5 h-5 rounded-full border flex items-center justify-center"
                                style={{
                                  borderColor: textColorWithOpacity(0.2),
                                  color: settings.social_icon_color,
                                }}
                              >
                                <FaYoutube className="w-2 h-2" />
                              </div>
                            )}
                            {settings.social_tiktok && (
                              <div
                                className="w-5 h-5 rounded-full border flex items-center justify-center"
                                style={{
                                  borderColor: textColorWithOpacity(0.2),
                                  color: settings.social_icon_color,
                                }}
                              >
                                <FaTiktok className="w-2 h-2" />
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Navigation */}
                        <div
                          className={
                            footerPreviewMode === "mobile" ? "text-center" : ""
                          }
                        >
                          <h3 className="text-[10px] font-bold tracking-wider uppercase mb-1 opacity-80">
                            Navigation
                          </h3>
                          <ul className={`space-y-0.5 text-[10px] opacity-60`}>
                            {settings.footer_nav_links.map((link) => (
                              <li
                                key={link.id}
                                className={
                                  footerPreviewMode === "mobile"
                                    ? "text-center"
                                    : ""
                                }
                              >
                                <EditableText
                                  value={link.label}
                                  onChange={(val) =>
                                    updateSetting(
                                      "footer_nav_links",
                                      settings.footer_nav_links.map((l) =>
                                        l.id === link.id
                                          ? { ...l, label: val }
                                          : l,
                                      ),
                                    )
                                  }
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                        {/* Contact */}
                        <div
                          className={
                            footerPreviewMode === "mobile" ? "text-center" : ""
                          }
                        >
                          <h3 className="text-[10px] font-bold tracking-wider uppercase mb-1 opacity-80">
                            Contact
                          </h3>
                          <ul className={`space-y-0.5 text-[10px] opacity-60`}>
                            {settings.contact_phone && (
                              <li
                                className={`flex items-center gap-1 ${footerPreviewMode === "mobile" ? "justify-center" : ""}`}
                              >
                                <Phone className="w-2 h-2" />
                                <EditableText
                                  value={settings.contact_phone}
                                  onChange={(val) =>
                                    updateSetting("contact_phone", val)
                                  }
                                />
                              </li>
                            )}
                            {settings.contact_email && (
                              <li
                                className={`flex items-center gap-1 ${footerPreviewMode === "mobile" ? "justify-center" : ""}`}
                              >
                                <Mail className="w-2 h-2" />
                                <EditableText
                                  value={settings.contact_email}
                                  onChange={(val) =>
                                    updateSetting("contact_email", val)
                                  }
                                />
                              </li>
                            )}
                            {settings.contact_address && (
                              <li
                                className={`flex items-center gap-1 ${footerPreviewMode === "mobile" ? "justify-center" : ""}`}
                              >
                                <MapPin className="w-2 h-2" />
                                <EditableText
                                  value={settings.contact_address}
                                  onChange={(val) =>
                                    updateSetting("contact_address", val)
                                  }
                                />
                              </li>
                            )}
                          </ul>
                        </div>
                        {/* Newsletter */}
                        {settings.newsletter_enabled && (
                          <div
                            className={
                              footerPreviewMode === "mobile"
                                ? "text-center"
                                : ""
                            }
                          >
                            <h3 className="text-[10px] font-bold tracking-wider uppercase mb-1 opacity-80">
                              <EditableText
                                value={settings.newsletter_title}
                                onChange={(val) =>
                                  updateSetting("newsletter_title", val)
                                }
                              />
                            </h3>
                            <p className="text-[9px] opacity-60 mb-1">
                              <EditableText
                                value={settings.newsletter_description}
                                onChange={(val) =>
                                  updateSetting("newsletter_description", val)
                                }
                              />
                            </p>
                            <div
                              className={`flex gap-1 ${footerPreviewMode === "mobile" ? "flex-col" : ""}`}
                            >
                              <input
                                type="email"
                                placeholder="Email"
                                className={`px-1.5 py-1 border rounded text-[10px] ${footerPreviewMode === "mobile" ? "w-full" : "flex-1"}`}
                                style={{
                                  backgroundColor:
                                    settings.newsletter_input_bg_color ||
                                    textColorWithOpacity(0.1),
                                  borderColor: textColorWithOpacity(0.2),
                                  color: settings.footer_text_color,
                                }}
                              />
                              <button
                                className="px-2 py-1 text-[10px] font-medium rounded"
                                style={{
                                  backgroundColor:
                                    settings.newsletter_button_color,
                                  color: settings.footer_bg_color,
                                }}
                              >
                                <EditableText
                                  value={settings.newsletter_button_text}
                                  onChange={(val) =>
                                    updateSetting("newsletter_button_text", val)
                                  }
                                />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Bottom */}
                      <div
                        className={`pt-2 mt-2 border-t text-[9px] opacity-50 ${
                          footerPreviewMode === "mobile"
                            ? "flex flex-col items-center gap-1 text-center"
                            : "flex flex-wrap justify-between items-center gap-2"
                        }`}
                        style={{ borderColor: textColorWithOpacity(0.1) }}
                      >
                        <EditableText
                          value={settings.footer_copyright}
                          onChange={(val) =>
                            updateSetting("footer_copyright", val)
                          }
                        />
                        <div
                          className={`flex gap-2 ${footerPreviewMode === "mobile" ? "flex-wrap justify-center" : ""}`}
                        >
                          {settings.footer_legal_links.map((link) => (
                            <EditableText
                              key={link.id}
                              value={link.label}
                              onChange={(val) =>
                                updateSetting(
                                  "footer_legal_links",
                                  settings.footer_legal_links.map((l) =>
                                    l.id === link.id ? { ...l, label: val } : l,
                                  ),
                                )
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </footer>
                </div>
              </div>
            </div>

            {/* Scrollable Options */}
            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
              <div className="flex flex-col gap-4">
                <CollapsibleSection
                  title="Apparence"
                  icon={Palette}
                  defaultOpen={true}
                >
                  <div className="flex flex-col gap-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <ColorInput
                        label="Couleur de fond"
                        value={settings.footer_bg_color}
                        onChange={(val) =>
                          updateSetting("footer_bg_color", val)
                        }
                      />
                      <ColorInput
                        label="Couleur du texte"
                        value={settings.footer_text_color}
                        onChange={(val) =>
                          updateSetting("footer_text_color", val)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <ColorInput
                        label="Couleur bordure"
                        value={settings.footer_border_color}
                        onChange={(val) =>
                          updateSetting("footer_border_color", val)
                        }
                        description="Laissez vide pour auto"
                      />
                      <ColorInput
                        label="Couleur liens hover"
                        value={settings.footer_link_hover_color}
                        onChange={(val) =>
                          updateSetting("footer_link_hover_color", val)
                        }
                        description="Laissez vide pour auto"
                      />
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <RangeInput
                        label="Espacement vertical"
                        value={settings.footer_padding_y}
                        onChange={(val) =>
                          updateSetting("footer_padding_y", val)
                        }
                        min={24}
                        max={96}
                        unit="px"
                      />
                    </div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection
                  title="Contenu"
                  icon={Type}
                  defaultOpen={true}
                >
                  <div className="flex flex-col gap-4 mt-4">
                    <TextInput
                      label="Tagline"
                      value={settings.footer_tagline}
                      onChange={(val) => updateSetting("footer_tagline", val)}
                    />

                    <div className="pt-2 border-t border-gray-100">
                      <TextInput
                        label="Copyright"
                        value={settings.footer_copyright}
                        onChange={(val) =>
                          updateSetting("footer_copyright", val)
                        }
                      />
                    </div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection
                  title="Navigation"
                  icon={LinkIcon}
                  defaultOpen={false}
                  badge={`${settings.footer_nav_links.length}`}
                >
                  <DraggableLinkEditor
                    links={settings.footer_nav_links}
                    onChange={(links) =>
                      updateSetting("footer_nav_links", links)
                    }
                    pages={pages}
                  />
                </CollapsibleSection>

                <CollapsibleSection
                  title="Liens légaux"
                  icon={FileText}
                  defaultOpen={false}
                  badge={`${settings.footer_legal_links.length}`}
                >
                  <DraggableLinkEditor
                    links={settings.footer_legal_links}
                    onChange={(links) =>
                      updateSetting("footer_legal_links", links)
                    }
                    pages={pages}
                  />
                </CollapsibleSection>

                <CollapsibleSection
                  title="Réseaux sociaux"
                  icon={
                    FaInstagram as React.ComponentType<{ className?: string }>
                  }
                  defaultOpen={false}
                >
                  <div className="flex flex-col gap-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <TextInput
                        label="Facebook"
                        value={settings.social_facebook}
                        onChange={(val) =>
                          updateSetting("social_facebook", val)
                        }
                        type="url"
                      />
                      <TextInput
                        label="Instagram"
                        value={settings.social_instagram}
                        onChange={(val) =>
                          updateSetting("social_instagram", val)
                        }
                        type="url"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <TextInput
                        label="LinkedIn"
                        value={settings.social_linkedin}
                        onChange={(val) =>
                          updateSetting("social_linkedin", val)
                        }
                        type="url"
                      />
                      <TextInput
                        label="Twitter"
                        value={settings.social_twitter}
                        onChange={(val) => updateSetting("social_twitter", val)}
                        type="url"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <TextInput
                        label="YouTube"
                        value={settings.social_youtube}
                        onChange={(val) => updateSetting("social_youtube", val)}
                        type="url"
                      />
                      <TextInput
                        label="TikTok"
                        value={settings.social_tiktok}
                        onChange={(val) => updateSetting("social_tiktok", val)}
                        type="url"
                      />
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <ColorInput
                        label="Couleur des icônes"
                        value={settings.social_icon_color}
                        onChange={(val) =>
                          updateSetting("social_icon_color", val)
                        }
                      />
                    </div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection
                  title="Contact"
                  icon={Mail}
                  defaultOpen={false}
                >
                  <div className="flex flex-col gap-4 mt-4">
                    <TextInput
                      label="Email"
                      value={settings.contact_email}
                      onChange={(val) => updateSetting("contact_email", val)}
                      type="email"
                    />

                    <div className="pt-2 border-t border-gray-100">
                      <TextInput
                        label="Téléphone"
                        value={settings.contact_phone}
                        onChange={(val) => updateSetting("contact_phone", val)}
                        type="tel"
                      />
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <TextInput
                        label="Adresse"
                        value={settings.contact_address}
                        onChange={(val) =>
                          updateSetting("contact_address", val)
                        }
                      />
                    </div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection
                  title="Newsletter"
                  icon={Mail}
                  defaultOpen={false}
                >
                  <div className="flex flex-col gap-4 mt-4">
                    <ToggleSwitch
                      label="Afficher la newsletter"
                      checked={settings.newsletter_enabled}
                      onChange={(val) =>
                        updateSetting("newsletter_enabled", val)
                      }
                      description="Section d'inscription à la newsletter"
                    />

                    {settings.newsletter_enabled && (
                      <div className="pt-2 border-t border-gray-100 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <TextInput
                            label="Titre"
                            value={settings.newsletter_title}
                            onChange={(val) =>
                              updateSetting("newsletter_title", val)
                            }
                          />
                          <TextInput
                            label="Description"
                            value={settings.newsletter_description}
                            onChange={(val) =>
                              updateSetting("newsletter_description", val)
                            }
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <TextInput
                            label="Texte du bouton"
                            value={settings.newsletter_button_text}
                            onChange={(val) =>
                              updateSetting("newsletter_button_text", val)
                            }
                          />
                          <ColorInput
                            label="Couleur du bouton"
                            value={settings.newsletter_button_color}
                            onChange={(val) =>
                              updateSetting("newsletter_button_color", val)
                            }
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <ColorInput
                            label="Fond du champ email"
                            value={settings.newsletter_input_bg_color}
                            onChange={(val) =>
                              updateSetting("newsletter_input_bg_color", val)
                            }
                            description="Laissez vide pour auto"
                          />
                          <TextInput
                            label="Message de succès"
                            value={settings.newsletter_success_message}
                            onChange={(val) =>
                              updateSetting("newsletter_success_message", val)
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CollapsibleSection>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* End Main Content Area */}
    </div>
  );
}
