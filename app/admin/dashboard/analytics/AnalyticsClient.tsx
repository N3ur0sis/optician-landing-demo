"use client"

import { useState, useEffect, useCallback } from "react"
import {
  BarChart3,
  Users,
  Eye,
  Clock,
  Monitor,
  Smartphone,
  Tablet,
  TrendingUp,
  Globe,
  Loader2,
  RefreshCw,
  Activity,
} from "lucide-react"

interface AnalyticsData {
  period: string
  overview: {
    totalViews: number
    uniqueVisitors: number
    avgDuration: number
    activeSessions: number
  }
  devices: {
    desktop: number
    mobile: number
    tablet: number
  }
  browsers: Record<string, number>
  topPages: Array<{
    path: string
    views: number
    uniqueVisitors: number
  }>
  dailyStats: Array<{
    date: string
    views: number
    uniqueVisitors: number
  }>
  trafficSources: Array<{
    source: string
    count: number
  }>
}

type Period = "7d" | "30d" | "90d"

export default function AnalyticsClient() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<Period>("7d")

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics?period=${period}`)
      if (response.ok) {
        const result = await response.json()
        setData(result)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }, [period])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })
  }

  const getPageName = (path: string): string => {
    const names: Record<string, string> = {
      "/": "Accueil",
      "/maison": "La Maison",
      "/magasins": "Nos Boutiques",
      "/services": "Services",
      "/collections/createurs": "Collections Créateurs",
      "/rendez-vous": "Rendez-vous",
    }
    return names[path] || path
  }

  const maxViews = data?.dailyStats.reduce((max, d) => Math.max(max, d.views), 0) || 1

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif text-stone-900">Analytics</h1>
          <p className="text-stone-500 mt-1">Statistiques de fréquentation du site</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-stone-100 rounded-lg p-1">
            {(["7d", "30d", "90d"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  period === p
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {p === "7d" ? "7 jours" : p === "30d" ? "30 jours" : "90 jours"}
              </button>
            ))}
          </div>
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="p-2 text-stone-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-stone-500 text-sm">Pages vues</span>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-semibold text-stone-900">
                {data.overview.totalViews.toLocaleString()}
              </p>
              <p className="text-sm text-stone-500 mt-1">
                sur les {period === "7d" ? "7" : period === "30d" ? "30" : "90"} derniers jours
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-stone-500 text-sm">Visiteurs uniques</span>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-semibold text-stone-900">
                {data.overview.uniqueVisitors.toLocaleString()}
              </p>
              <p className="text-sm text-stone-500 mt-1">sessions distinctes</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-stone-500 text-sm">Durée moyenne</span>
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <p className="text-3xl font-semibold text-stone-900">
                {formatDuration(data.overview.avgDuration)}
              </p>
              <p className="text-sm text-stone-500 mt-1">temps par page</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-stone-500 text-sm">En ligne maintenant</span>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-semibold text-stone-900">
                {data.overview.activeSessions}
              </p>
              <p className="text-sm text-stone-500 mt-1">visiteurs actifs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-stone-200 p-6">
              <h2 className="text-lg font-medium text-stone-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-600" />
                Évolution des visites
              </h2>
              <div className="h-64 flex items-end gap-1">
                {data.dailyStats.map((day, i) => (
                  <div key={day.date} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-amber-500 rounded-t transition-all hover:bg-amber-600"
                        style={{ height: `${(day.views / maxViews) * 180}px`, minHeight: "4px" }}
                        title={`${day.views} vues`}
                      />
                      <div
                        className="w-full bg-amber-200 rounded-t"
                        style={{ height: `${(day.uniqueVisitors / maxViews) * 180}px`, minHeight: "2px" }}
                        title={`${day.uniqueVisitors} visiteurs`}
                      />
                    </div>
                    {(i % Math.ceil(data.dailyStats.length / 7) === 0 || i === data.dailyStats.length - 1) && (
                      <span className="text-xs text-stone-500 mt-2 transform -rotate-45 origin-left">
                        {formatDate(day.date)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded" />
                  <span className="text-stone-600">Pages vues</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-200 rounded" />
                  <span className="text-stone-600">Visiteurs uniques</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
              <h2 className="text-lg font-medium text-stone-900 mb-4 flex items-center gap-2">
                <Monitor className="w-5 h-5 text-amber-600" />
                Appareils
              </h2>
              <div className="space-y-4">
                {[
                  { key: "desktop", icon: Monitor, label: "Desktop", count: data.devices.desktop },
                  { key: "mobile", icon: Smartphone, label: "Mobile", count: data.devices.mobile },
                  { key: "tablet", icon: Tablet, label: "Tablette", count: data.devices.tablet },
                ].map(({ key, icon: Icon, label, count }) => {
                  const total = data.devices.desktop + data.devices.mobile + data.devices.tablet
                  const percentage = total > 0 ? Math.round((count / total) * 100) : 0
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-stone-500" />
                          <span className="text-sm text-stone-700">{label}</span>
                        </div>
                        <span className="text-sm font-medium text-stone-900">{percentage}%</span>
                      </div>
                      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-stone-500 mt-1">{count.toLocaleString()} visites</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
              <h2 className="text-lg font-medium text-stone-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-600" />
                Pages les plus visitées
              </h2>
              <div className="space-y-3">
                {data.topPages.length === 0 ? (
                  <p className="text-stone-500 text-center py-8">Pas encore de données</p>
                ) : (
                  data.topPages.map((page, i) => (
                    <div
                      key={page.path}
                      className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-sm font-medium">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-stone-900">{getPageName(page.path)}</p>
                          <p className="text-xs text-stone-500">{page.path}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-stone-900">{page.views.toLocaleString()}</p>
                        <p className="text-xs text-stone-500">{page.uniqueVisitors} visiteurs</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
              <h2 className="text-lg font-medium text-stone-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-amber-600" />
                Sources de trafic
              </h2>
              <div className="space-y-3">
                {data.trafficSources.length === 0 ? (
                  <p className="text-stone-500 text-center py-8">Pas encore de données</p>
                ) : (
                  data.trafficSources.map((source) => {
                    const total = data.trafficSources.reduce((acc, s) => acc + s.count, 0)
                    const percentage = total > 0 ? Math.round((source.count / total) * 100) : 0
                    return (
                      <div key={source.source}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-stone-700">{source.source}</span>
                          <span className="text-sm font-medium text-stone-900">
                            {source.count.toLocaleString()} ({percentage}%)
                          </span>
                        </div>
                        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
