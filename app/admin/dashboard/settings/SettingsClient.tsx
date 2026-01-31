"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    fetchSettings();
    fetchPages();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings({ ...defaultSettings, ...data });
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

  const handleExport = async () => {
    setBackupLoading(true);
    try {
      const response = await fetch("/api/settings/export");
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `odb-backup-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        setMessage({ type: "success", text: "Export réussi" });
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

    setBackupLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/settings/import", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setMessage({
          type: "success",
          text: "Import réussi - Rechargez la page",
        });
        fetchSettings();
      } else {
        throw new Error("Import failed");
      }
    } catch {
      setMessage({ type: "error", text: "Erreur lors de l'import" });
    } finally {
      setBackupLoading(false);
    }
  };

  const updateSetting = (key: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600 mt-1">Configuration générale du site</p>
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
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Database className="h-5 w-5" />
              Sauvegarde des données
            </h2>
            <p className="text-gray-600 mb-6">
              Exportez ou importez les données du site (pages, navigation,
              paramètres, grille).
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleExport}
                disabled={backupLoading}
                className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {backupLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Download className="h-5 w-5" />
                )}
                Exporter les données
              </button>
              <label className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <Upload className="h-5 w-5" />
                Importer des données
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h3 className="text-amber-800 font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Attention
            </h3>
            <p className="text-amber-700 text-sm">
              L&apos;import de données remplacera les données existantes.
              Assurez-vous d&apos;avoir une sauvegarde avant d&apos;importer.
            </p>
          </div>
        </div>
      )}

      {/* Save Button */}
      {activeTab !== "backup" && (
        <div className="mt-8 flex justify-end">
          <button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            Sauvegarder
          </button>
        </div>
      )}
    </div>
  );
}
