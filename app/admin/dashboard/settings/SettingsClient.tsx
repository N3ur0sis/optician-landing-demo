"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Save,
  Globe,
  Search,
  Database,
  Download,
  Upload,
  Loader2,
  Check,
  AlertCircle,
  Building2,
  Mail,
  RefreshCw,
  Trash2,
  History,
  Shield,
  ShieldOff,
  Clock,
  RotateCcw,
  Plus,
  HardDrive,
} from "lucide-react";

interface SiteSettings {
  site_title: string;
  site_description: string;
  site_keywords: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  social_facebook: string;
  social_instagram: string;
  social_linkedin: string;
  meta_robots: string;
  google_analytics_id: string;
  google_search_console: string;
  homepage_slug: string;
}

interface DatabaseBackup {
  id: string;
  name: string;
  type: "MANUAL" | "AUTO_PRE_IMPORT" | "AUTO_PRE_EXPORT" | "SCHEDULED";
  size: number;
  compressedSize: number | null;
  version: string;
  stats: Record<string, number>;
  description: string | null;
  createdBy: string | null;
  createdAt: string;
  isProtected: boolean;
  expiresAt: string | null;
}

const defaultSettings: SiteSettings = {
  site_title: "Optique de Bourbon",
  site_description: "Votre opticien de confiance à La Réunion depuis 1975",
  site_keywords: "optique, lunettes, opticien, La Réunion, Saint-Denis, vue",
  contact_email: "contact@optiquedebourbon.re",
  contact_phone: "0262 XX XX XX",
  contact_address: "Saint-Denis, La Réunion",
  social_facebook: "",
  social_instagram: "",
  social_linkedin: "",
  meta_robots: "index, follow",
  google_analytics_id: "",
  google_search_console: "",
  homepage_slug: "",
};

export default function SettingsClient() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [initialSettings, setInitialSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "seo" | "backup">(
    "general",
  );
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [backupLoading, setBackupLoading] = useState(false);
  const [availablePages, setAvailablePages] = useState<
    { slug: string; title: string }[]
  >([]);
  
  // Backup management state
  const [backups, setBackups] = useState<DatabaseBackup[]>([]);
  const [backupsLoading, setBackupsLoading] = useState(false);
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmRestore, setConfirmRestore] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Check for unsaved changes
  const hasChanges = JSON.stringify(settings) !== JSON.stringify(initialSettings);

  // Fetch backups
  const fetchBackups = useCallback(async () => {
    setBackupsLoading(true);
    try {
      const response = await fetch("/api/backups");
      if (response.ok) {
        const data = await response.json();
        setBackups(data);
      }
    } catch (error) {
      console.error("Failed to fetch backups:", error);
    } finally {
      setBackupsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
    fetchPages();
  }, []);

  // Fetch backups when backup tab is active
  useEffect(() => {
    if (activeTab === "backup") {
      fetchBackups();
    }
  }, [activeTab, fetchBackups]);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      if (response.ok) {
        const data = await response.json();
        const mergedSettings = { ...defaultSettings, ...data };
        setSettings(mergedSettings);
        setInitialSettings(mergedSettings);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPages = async () => {
    try {
      const response = await fetch("/api/pages");
      if (response.ok) {
        const data = await response.json();
        setAvailablePages(
          data.map((p: { slug: string; title: string }) => ({
            slug: p.slug,
            title: p.title,
          })),
        );
      }
    } catch (error) {
      console.error("Failed to fetch pages:", error);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      if (response.ok) {
        setInitialSettings(settings);
        setMessage({
          type: "success",
          text: "Paramètres sauvegardés avec succès",
        });
      } else {
        throw new Error("Failed to save");
      }
    } catch {
      setMessage({ type: "error", text: "Erreur lors de la sauvegarde" });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const resetChanges = () => {
    setSettings(initialSettings);
  };

  const handleExport = async (format: "zip" | "json" = "zip") => {
    setBackupLoading(true);
    try {
      const response = await fetch(`/api/settings/export?format=${format}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `odb-backup-${new Date().toISOString().split("T")[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        setMessage({ type: "success", text: `Export ${format.toUpperCase()} réussi` });
      }
    } catch {
      setMessage({ type: "error", text: "Erreur lors de l'export" });
    } finally {
      setBackupLoading(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith(".zip") && !file.name.endsWith(".json")) {
      setMessage({ type: "error", text: "Format non supporté. Utilisez .zip ou .json" });
      return;
    }

    setBackupLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/settings/import", {
        method: "POST",
        body: formData,
      });
      
      const result = await response.json();
      
      if (response.ok) {
        const stats = result.stats;
        setMessage({
          type: "success",
          text: `Import réussi: ${stats.pages} pages, ${stats.blocks} blocs, ${stats.mediaFilesRestored || 0} fichiers média`,
        });
        fetchSettings();
        // Reload page after short delay to reflect changes
        setTimeout(() => window.location.reload(), 2000);
      } else {
        throw new Error(result.error || "Import failed");
      }
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Erreur lors de l'import" });
    } finally {
      setBackupLoading(false);
      // Reset file input
      event.target.value = "";
    }
  };

  const updateSetting = (key: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Backup management functions
  const createManualBackup = async () => {
    setCreatingBackup(true);
    try {
      const response = await fetch("/api/backups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "MANUAL",
          isProtected: false,
        }),
      });
      const result = await response.json();
      if (response.ok && !result.skipped) {
        setMessage({ type: "success", text: "Sauvegarde créée avec succès" });
        fetchBackups();
      } else if (result.skipped) {
        setMessage({ type: "error", text: "Une sauvegarde récente existe déjà" });
      } else {
        throw new Error(result.error || "Erreur");
      }
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Erreur lors de la création" });
    } finally {
      setCreatingBackup(false);
    }
  };

  const handleDeleteBackup = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/backups/${id}`, { method: "DELETE" });
      if (response.ok) {
        setMessage({ type: "success", text: "Sauvegarde supprimée" });
        fetchBackups();
      } else {
        const result = await response.json();
        throw new Error(result.error || "Erreur");
      }
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Erreur lors de la suppression" });
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const handleRestoreBackup = async (id: string) => {
    setRestoringId(id);
    try {
      const response = await fetch(`/api/backups/${id}/restore`, { method: "POST" });
      const result = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: "Restauration réussie. Rechargement..." });
        setTimeout(() => window.location.reload(), 2000);
      } else {
        throw new Error(result.error || "Erreur");
      }
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Erreur lors de la restauration" });
    } finally {
      setRestoringId(null);
      setConfirmRestore(null);
    }
  };

  const toggleProtected = async (backup: DatabaseBackup) => {
    try {
      const response = await fetch(`/api/backups/${backup.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isProtected: !backup.isProtected }),
      });
      if (response.ok) {
        fetchBackups();
      }
    } catch (error) {
      console.error("Failed to toggle protection:", error);
    }
  };

  const downloadBackup = async (id: string) => {
    try {
      const response = await fetch(`/api/backups/${id}?download=true`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `backup-${id.slice(0, 8)}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    } catch (error) {
      console.error("Failed to download backup:", error);
    }
  };

  // Helper to format bytes
  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Helper to format backup type
  const formatBackupType = (type: DatabaseBackup["type"]): string => {
    switch (type) {
      case "MANUAL": return "Manuelle";
      case "AUTO_PRE_IMPORT": return "Avant import";
      case "AUTO_PRE_EXPORT": return "Avant export";
      case "SCHEDULED": return "Planifiée";
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-9 bg-gray-200 rounded-lg w-48 animate-pulse" />
          <div className="h-5 bg-gray-100 rounded w-64 mt-2 animate-pulse" />
        </div>

        {/* Tabs skeleton */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 pb-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-gray-200 rounded-lg w-28 animate-pulse" />
          ))}
        </div>

        {/* Cards skeleton */}
        <div className="space-y-6">
          {/* Card 1 - Site info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 bg-gray-200 rounded" />
              <div className="h-6 bg-gray-200 rounded w-40" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="h-4 bg-gray-100 rounded w-24 mb-2" />
                <div className="h-10 bg-gray-100 rounded-lg w-full" />
              </div>
              <div>
                <div className="h-4 bg-gray-100 rounded w-24 mb-2" />
                <div className="h-24 bg-gray-100 rounded-lg w-full" />
              </div>
            </div>
          </div>

          {/* Card 2 - Contact */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 bg-gray-200 rounded" />
              <div className="h-6 bg-gray-200 rounded w-24" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-100 rounded w-20 mb-2" />
                  <div className="h-10 bg-gray-100 rounded-lg w-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Card 3 - Social */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-36 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-100 rounded w-20 mb-2" />
                  <div className="h-10 bg-gray-100 rounded-lg w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "general" as const, label: "Général", icon: Building2 },
    { id: "seo" as const, label: "SEO", icon: Search },
    { id: "backup" as const, label: "Sauvegarde", icon: Database },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600 mt-1">Configuration générale du site</p>
        </div>
        {activeTab !== "backup" && (
          <div className="flex items-center gap-3">
            {hasChanges && (
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full text-sm font-medium">
                <AlertCircle className="h-4 w-4" />
                Non sauvegardé
              </div>
            )}
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
              className={`flex items-center gap-2 px-5 py-2 rounded-lg transition-colors ${
                hasChanges
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Sauvegarder
            </button>
          </div>
        )}
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <Check className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Informations du site
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du site
                </label>
                <input
                  type="text"
                  value={settings.site_title}
                  onChange={(e) => updateSetting("site_title", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={settings.site_description}
                  onChange={(e) =>
                    updateSetting("site_description", e.target.value)
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) =>
                    updateSetting("contact_email", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={settings.contact_phone}
                  onChange={(e) =>
                    updateSetting("contact_phone", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <input
                  type="text"
                  value={settings.contact_address}
                  onChange={(e) =>
                    updateSetting("contact_address", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Réseaux sociaux
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook
                </label>
                <input
                  type="url"
                  value={settings.social_facebook}
                  onChange={(e) =>
                    updateSetting("social_facebook", e.target.value)
                  }
                  placeholder="https://facebook.com/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram
                </label>
                <input
                  type="url"
                  value={settings.social_instagram}
                  onChange={(e) =>
                    updateSetting("social_instagram", e.target.value)
                  }
                  placeholder="https://instagram.com/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={settings.social_linkedin}
                  onChange={(e) =>
                    updateSetting("social_linkedin", e.target.value)
                  }
                  placeholder="https://linkedin.com/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Homepage Selection */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Page d&apos;accueil
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sélectionner la page d&apos;accueil
                </label>
                <select
                  value={settings.homepage_slug}
                  onChange={(e) =>
                    updateSetting("homepage_slug", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Page par défaut (index)</option>
                  {availablePages.map((page) => (
                    <option key={page.slug} value={page.slug}>
                      {page.title} (/{page.slug})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  Cette page sera affichée à l&apos;accueil du site (/)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO Tab */}
      {activeTab === "seo" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Search className="h-5 w-5" />
              Métadonnées SEO
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mots-clés (séparés par des virgules)
                </label>
                <input
                  type="text"
                  value={settings.site_keywords}
                  onChange={(e) =>
                    updateSetting("site_keywords", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Directive robots
                </label>
                <select
                  value={settings.meta_robots}
                  onChange={(e) => updateSetting("meta_robots", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="index, follow">
                    index, follow (recommandé)
                  </option>
                  <option value="noindex, follow">noindex, follow</option>
                  <option value="index, nofollow">index, nofollow</option>
                  <option value="noindex, nofollow">noindex, nofollow</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Outils Google
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Google Analytics ID
                </label>
                <input
                  type="text"
                  value={settings.google_analytics_id}
                  onChange={(e) =>
                    updateSetting("google_analytics_id", e.target.value)
                  }
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Identifiant de mesure Google Analytics 4
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Google Search Console
                </label>
                <input
                  type="text"
                  value={settings.google_search_console}
                  onChange={(e) =>
                    updateSetting("google_search_console", e.target.value)
                  }
                  placeholder="Code de vérification"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backup Tab */}
      {activeTab === "backup" && (
        <div className="space-y-6">
          {/* Export Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Download className="h-5 w-5" />
              Exporter les données
            </h2>
            <p className="text-gray-600 mb-6">
              Créez une sauvegarde complète du site incluant pages, navigation, paramètres et médias.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => handleExport("zip")}
                disabled={backupLoading}
                className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {backupLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Database className="h-5 w-5" />
                )}
                Export complet (ZIP)
              </button>
              <button
                onClick={() => handleExport("json")}
                disabled={backupLoading}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Download className="h-5 w-5" />
                Base de données (JSON)
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Le ZIP inclut la base de données et tous les fichiers médias. Le JSON contient uniquement la base de données.
            </p>
          </div>

          {/* Import Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Importer des données
            </h2>
            <p className="text-gray-600 mb-6">
              Restaurez une sauvegarde précédente. Les formats ZIP et JSON sont supportés.
            </p>
            <label className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-50 border-2 border-dashed border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-colors cursor-pointer">
              {backupLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Upload className="h-5 w-5" />
              )}
              <span>Sélectionner un fichier .zip ou .json</span>
              <input
                type="file"
                accept=".zip,.json"
                onChange={handleImport}
                disabled={backupLoading}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 mt-3">
              L&apos;import ZIP restaurera automatiquement les fichiers médias associés.
            </p>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h3 className="text-amber-800 font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Attention
            </h3>
            <ul className="text-amber-700 text-sm space-y-1">
              <li>• L&apos;import remplacera <strong>toutes</strong> les données existantes</li>
              <li>• Une sauvegarde automatique est créée avant chaque import</li>
              <li>• Les backups d&apos;anciennes versions sont automatiquement migrés</li>
            </ul>
          </div>

          {/* Backup History Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <History className="h-5 w-5" />
                Historique des sauvegardes
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchBackups}
                  disabled={backupsLoading}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Actualiser"
                >
                  <RefreshCw className={`h-4 w-4 ${backupsLoading ? "animate-spin" : ""}`} />
                </button>
                <button
                  onClick={createManualBackup}
                  disabled={creatingBackup}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {creatingBackup ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Nouvelle sauvegarde
                </button>
              </div>
            </div>

            {backupsLoading && backups.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : backups.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <HardDrive className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Aucune sauvegarde disponible</p>
                <p className="text-sm mt-1">Créez votre première sauvegarde manuellement ou elle sera créée automatiquement lors du prochain import/export.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {backups.map((backup) => (
                  <div
                    key={backup.id}
                    className={`border rounded-lg p-4 ${
                      backup.isProtected ? "border-blue-200 bg-blue-50/30" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium text-gray-900 truncate">
                            {backup.name}
                          </h3>
                          {backup.isProtected && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                              <Shield className="h-3 w-3" />
                              Protégée
                            </span>
                          )}
                          <span className={`inline-flex px-2 py-0.5 text-xs rounded-full ${
                            backup.type === "MANUAL" 
                              ? "bg-green-100 text-green-700"
                              : backup.type === "AUTO_PRE_IMPORT"
                              ? "bg-orange-100 text-orange-700"
                              : backup.type === "AUTO_PRE_EXPORT"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-gray-100 text-gray-700"
                          }`}>
                            {formatBackupType(backup.type)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(backup.createdAt).toLocaleString("fr-FR")}
                          </span>
                          <span className="flex items-center gap-1">
                            <HardDrive className="h-3.5 w-3.5" />
                            {formatBytes(backup.compressedSize || backup.size)}
                            {backup.compressedSize && backup.compressedSize < backup.size && (
                              <span className="text-xs text-gray-400">
                                ({Math.round((1 - backup.compressedSize / backup.size) * 100)}% compressé)
                              </span>
                            )}
                          </span>
                        </div>
                        {backup.stats && (
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                            <span>{(backup.stats as Record<string, number>).pages || 0} pages</span>
                            <span>{(backup.stats as Record<string, number>).blocks || 0} blocs</span>
                            <span>{(backup.stats as Record<string, number>).media || 0} médias</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleProtected(backup)}
                          className={`p-2 rounded-lg transition-colors ${
                            backup.isProtected
                              ? "text-blue-600 hover:bg-blue-100"
                              : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                          }`}
                          title={backup.isProtected ? "Retirer la protection" : "Protéger"}
                        >
                          {backup.isProtected ? <Shield className="h-4 w-4" /> : <ShieldOff className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => downloadBackup(backup.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Télécharger"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        {confirmRestore === backup.id ? (
                          <div className="flex items-center gap-1 bg-orange-50 rounded-lg px-2 py-1">
                            <span className="text-xs text-orange-600">Confirmer ?</span>
                            <button
                              onClick={() => handleRestoreBackup(backup.id)}
                              disabled={restoringId === backup.id}
                              className="p-1 text-orange-600 hover:bg-orange-100 rounded"
                            >
                              {restoringId === backup.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              onClick={() => setConfirmRestore(null)}
                              className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmRestore(backup.id)}
                            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Restaurer"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        )}
                        {!backup.isProtected && (
                          confirmDelete === backup.id ? (
                            <div className="flex items-center gap-1 bg-red-50 rounded-lg px-2 py-1">
                              <span className="text-xs text-red-600">Supprimer ?</span>
                              <button
                                onClick={() => handleDeleteBackup(backup.id)}
                                disabled={deletingId === backup.id}
                                className="p-1 text-red-600 hover:bg-red-100 rounded"
                              >
                                {deletingId === backup.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                              >
                                ×
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete(backup.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {backups.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Les sauvegardes automatiques sont limitées à 20 et les plus anciennes sont supprimées automatiquement.
                  Protégez les sauvegardes importantes pour éviter leur suppression automatique.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
