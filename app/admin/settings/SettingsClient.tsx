"use client"

import { useState, useEffect } from "react"
import { 
  Settings, 
  Globe, 
  Search, 
  Download, 
  Save, 
  Loader2,
  Building,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  CheckCircle,
  AlertCircle
} from "lucide-react"

interface SiteSettings {
  // General
  site_name: string
  site_description: string
  site_logo: string
  site_favicon: string
  
  // Contact
  contact_email: string
  contact_phone: string
  contact_address: string
  
  // Social
  social_facebook: string
  social_instagram: string
  social_linkedin: string
  
  // SEO
  seo_title_suffix: string
  seo_default_description: string
  seo_keywords: string
  seo_og_image: string
  
  // Analytics
  analytics_google_id: string
  analytics_enabled: boolean
  
  // Maintenance
  maintenance_mode: boolean
  maintenance_message: string
}

const defaultSettings: SiteSettings = {
  site_name: "Optique de Bourbon",
  site_description: "Opticien de luxe à La Réunion depuis 1988",
  site_logo: "/logo.png",
  site_favicon: "/favicon.ico",
  contact_email: "contact@optiquedebourbon.re",
  contact_phone: "0262 XX XX XX",
  contact_address: "Saint-Denis, La Réunion",
  social_facebook: "https://facebook.com/optiquedebourbon",
  social_instagram: "https://instagram.com/optiquedebourbon",
  social_linkedin: "",
  seo_title_suffix: " | Optique de Bourbon",
  seo_default_description: "Découvrez les collections de lunettes de luxe chez Optique de Bourbon, votre opticien de référence à La Réunion depuis 1988.",
  seo_keywords: "opticien, lunettes, luxe, La Réunion, Saint-Denis, optique",
  seo_og_image: "/og-image.jpg",
  analytics_google_id: "",
  analytics_enabled: true,
  maintenance_mode: false,
  maintenance_message: "Le site est en maintenance. Nous serons bientôt de retour !",
}

type TabId = "general" | "seo" | "backup"

export default function SettingsClient() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>("general")
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings")
      if (response.ok) {
        const data = await response.json()
        setSettings({ ...defaultSettings, ...data })
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      })

      if (response.ok) {
        showNotification("success", "Paramètres enregistrés avec succès")
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      showNotification("error", "Erreur lors de l'enregistrement")
    } finally {
      setSaving(false)
    }
  }

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleExport = async (format: "zip" | "json" = "zip") => {
    try {
      const response = await fetch(`/api/settings/export?format=${format}`)
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Export failed")
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `odb-backup-${new Date().toISOString().split("T")[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      
      showNotification("success", `Backup ${format.toUpperCase()} exporté avec succès`)
    } catch (error) {
      console.error("Export error:", error)
      showNotification("error", error instanceof Error ? error.message : "Erreur lors de l'export")
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".zip") && !file.name.endsWith(".json")) {
      showNotification("error", "Format non supporté. Utilisez .zip ou .json")
      return
    }

    try {
      const formData = new FormData()
      formData.append("file", file)
      const response = await fetch("/api/settings/import", {
        method: "POST",
        body: formData,
      })
      
      const result = await response.json()
      
      if (response.ok) {
        const stats = result.stats
        showNotification("success", `Import réussi: ${stats.pages} pages, ${stats.blocks} blocs`)
        setTimeout(() => window.location.reload(), 2000)
      } else {
        throw new Error(result.error || "Import failed")
      }
    } catch (error) {
      showNotification("error", error instanceof Error ? error.message : "Erreur lors de l'import")
    } finally {
      event.target.value = ""
    }
  }

  const updateSetting = (key: keyof SiteSettings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const tabs = [
    { id: "general" as TabId, label: "Général", icon: Settings },
    { id: "seo" as TabId, label: "SEO", icon: Search },
    { id: "backup" as TabId, label: "Sauvegarde", icon: Download },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    )
  }

  return (
    <>
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
          notification.type === "success" 
            ? "bg-green-500 text-white" 
            : "bg-red-500 text-white"
        }`}>
          {notification.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {notification.message}
        </div>
      )}

      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif text-stone-900">Paramètres</h1>
            <p className="text-stone-500 mt-1">Configuration générale du site</p>
          </div>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Enregistrer
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-stone-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-stone-500 hover:text-stone-700"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          {activeTab === "general" && (
            <div className="space-y-8">
              {/* Site Identity */}
              <section>
                <h2 className="text-xl font-medium text-stone-900 mb-4 flex items-center gap-2">
                  <Building className="w-5 h-5 text-amber-600" />
                  Identité du site
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Nom du site
                    </label>
                    <input
                      type="text"
                      value={settings.site_name}
                      onChange={(e) => updateSetting("site_name", e.target.value)}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={settings.site_description}
                      onChange={(e) => updateSetting("site_description", e.target.value)}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-xl font-medium text-stone-900 mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-amber-600" />
                  Informations de contact
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={settings.contact_email}
                      onChange={(e) => updateSetting("contact_email", e.target.value)}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={settings.contact_phone}
                      onChange={(e) => updateSetting("contact_phone", e.target.value)}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Adresse
                    </label>
                    <input
                      type="text"
                      value={settings.contact_address}
                      onChange={(e) => updateSetting("contact_address", e.target.value)}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </section>

              {/* Social Media */}
              <section>
                <h2 className="text-xl font-medium text-stone-900 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-amber-600" />
                  Réseaux sociaux
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      <Facebook className="w-4 h-4 inline mr-1" />
                      Facebook
                    </label>
                    <input
                      type="url"
                      value={settings.social_facebook}
                      onChange={(e) => updateSetting("social_facebook", e.target.value)}
                      placeholder="https://facebook.com/..."
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      <Instagram className="w-4 h-4 inline mr-1" />
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={settings.social_instagram}
                      onChange={(e) => updateSetting("social_instagram", e.target.value)}
                      placeholder="https://instagram.com/..."
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={settings.social_linkedin}
                      onChange={(e) => updateSetting("social_linkedin", e.target.value)}
                      placeholder="https://linkedin.com/company/..."
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </section>

              {/* Maintenance Mode */}
              <section>
                <h2 className="text-xl font-medium text-stone-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  Mode maintenance
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="maintenance_mode"
                      checked={settings.maintenance_mode}
                      onChange={(e) => updateSetting("maintenance_mode", e.target.checked)}
                      className="w-5 h-5 text-amber-600 border-stone-300 rounded focus:ring-amber-500"
                    />
                    <label htmlFor="maintenance_mode" className="text-stone-700">
                      Activer le mode maintenance
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Message de maintenance
                    </label>
                    <textarea
                      value={settings.maintenance_message}
                      onChange={(e) => updateSetting("maintenance_message", e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === "seo" && (
            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-medium text-stone-900 mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5 text-amber-600" />
                  Référencement SEO
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Suffixe du titre (ajouté à chaque page)
                    </label>
                    <input
                      type="text"
                      value={settings.seo_title_suffix}
                      onChange={(e) => updateSetting("seo_title_suffix", e.target.value)}
                      placeholder=" | Optique de Bourbon"
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    <p className="text-sm text-stone-500 mt-1">
                      Ex: "Accueil{settings.seo_title_suffix}"
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Description par défaut
                    </label>
                    <textarea
                      value={settings.seo_default_description}
                      onChange={(e) => updateSetting("seo_default_description", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    <p className="text-sm text-stone-500 mt-1">
                      {settings.seo_default_description.length}/160 caractères recommandés
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Mots-clés (séparés par des virgules)
                    </label>
                    <input
                      type="text"
                      value={settings.seo_keywords}
                      onChange={(e) => updateSetting("seo_keywords", e.target.value)}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Image Open Graph (partage réseaux sociaux)
                    </label>
                    <input
                      type="text"
                      value={settings.seo_og_image}
                      onChange={(e) => updateSetting("seo_og_image", e.target.value)}
                      placeholder="/og-image.jpg"
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    <p className="text-sm text-stone-500 mt-1">
                      Taille recommandée: 1200x630 pixels
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-medium text-stone-900 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-amber-600" />
                  Google Analytics
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="analytics_enabled"
                      checked={settings.analytics_enabled}
                      onChange={(e) => updateSetting("analytics_enabled", e.target.checked)}
                      className="w-5 h-5 text-amber-600 border-stone-300 rounded focus:ring-amber-500"
                    />
                    <label htmlFor="analytics_enabled" className="text-stone-700">
                      Activer le tracking analytics interne
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      ID Google Analytics (optionnel)
                    </label>
                    <input
                      type="text"
                      value={settings.analytics_google_id}
                      onChange={(e) => updateSetting("analytics_google_id", e.target.value)}
                      placeholder="G-XXXXXXXXXX"
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === "backup" && (
            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-medium text-stone-900 mb-4 flex items-center gap-2">
                  <Download className="w-5 h-5 text-amber-600" />
                  Exporter les données
                </h2>
                <p className="text-stone-600 mb-6">
                  Créez une sauvegarde complète du site incluant pages, navigation, paramètres et médias.
                </p>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <h3 className="font-medium text-amber-900 mb-2">Contenu de l&apos;export :</h3>
                  <ul className="text-amber-800 space-y-1 text-sm mb-4">
                    <li>• Pages et leurs révisions</li>
                    <li>• Blocs de contenu</li>
                    <li>• Menus de navigation</li>
                    <li>• Tuiles de la grille d&apos;accueil</li>
                    <li>• Fichiers médias (ZIP uniquement)</li>
                    <li>• Paramètres du site</li>
                  </ul>
                  
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => handleExport("zip")}
                      className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Export complet (ZIP)
                    </button>
                    <button
                      onClick={() => handleExport("json")}
                      className="flex items-center gap-2 px-6 py-3 bg-white border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Base de données (JSON)
                    </button>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-medium text-stone-900 mb-4">
                  Importer des données
                </h2>
                <div className="bg-stone-50 border border-stone-200 rounded-lg p-6">
                  <p className="text-stone-600 mb-4">
                    Restaurez une sauvegarde précédente. Les formats ZIP et JSON sont supportés.
                  </p>
                  <label className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-dashed border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 hover:border-stone-400 transition-colors cursor-pointer">
                    <Download className="w-5 h-5 rotate-180" />
                    <span>Sélectionner un fichier .zip ou .json</span>
                    <input
                      type="file"
                      accept=".zip,.json"
                      onChange={handleImport}
                      className="hidden"
                    />
                  </label>
                  <p className="text-stone-500 text-sm mt-3">
                    ⚠️ L&apos;import remplacera toutes les données existantes. Faites un export avant.
                  </p>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
