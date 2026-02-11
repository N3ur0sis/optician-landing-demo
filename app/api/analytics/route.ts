import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { hasPermission, parsePermissions } from "@/types/permissions"

interface PageViewRecord {
  path: string
  sessionId: string
  device: string | null
  browser: string | null
  referrer: string | null
  duration: number | null
  createdAt: Date
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // Check analytics permission
    const role = session.user?.role as "ADMIN" | "WEBMASTER";
    const permissions = parsePermissions(session.user?.permissions);
    
    if (!hasPermission(role, permissions, "analytics")) {
      return NextResponse.json({ error: "Permission denied" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "7d" // 7d, 30d, 90d
    
    // Calculate date range
    const days = period === "90d" ? 90 : period === "30d" ? 30 : 7
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    startDate.setHours(0, 0, 0, 0)

    // Get page views for the period
    const pageViews: PageViewRecord[] = await prisma.pageView.findMany({
      where: {
        createdAt: { gte: startDate }
      },
      select: {
        path: true,
        sessionId: true,
        device: true,
        browser: true,
        referrer: true,
        duration: true,
        createdAt: true,
      }
    })

    // Calculate metrics
    const totalViews = pageViews.length
    const uniqueSessions = new Set(pageViews.map((pv: PageViewRecord) => pv.sessionId)).size
    const viewsWithDuration = pageViews.filter((pv: PageViewRecord) => pv.duration !== null)
    const avgDuration = viewsWithDuration.length > 0
      ? viewsWithDuration.reduce((acc: number, pv: PageViewRecord) => acc + (pv.duration || 0), 0) / viewsWithDuration.length
      : 0

    // Device breakdown
    const devices = {
      desktop: pageViews.filter((pv: PageViewRecord) => pv.device === "desktop").length,
      mobile: pageViews.filter((pv: PageViewRecord) => pv.device === "mobile").length,
      tablet: pageViews.filter((pv: PageViewRecord) => pv.device === "tablet").length,
    }

    // Browser breakdown
    const browserCounts: Record<string, number> = {}
    pageViews.forEach((pv: PageViewRecord) => {
      const browser = pv.browser || "other"
      browserCounts[browser] = (browserCounts[browser] || 0) + 1
    })

    // Top pages
    const pageCounts: Record<string, { views: number; sessions: Set<string> }> = {}
    pageViews.forEach((pv: PageViewRecord) => {
      if (!pageCounts[pv.path]) {
        pageCounts[pv.path] = { views: 0, sessions: new Set() }
      }
      pageCounts[pv.path].views++
      pageCounts[pv.path].sessions.add(pv.sessionId)
    })
    
    const topPages = Object.entries(pageCounts)
      .map(([path, data]) => ({
        path,
        views: data.views,
        uniqueVisitors: data.sessions.size,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    // Views by day
    const viewsByDay: Record<string, { views: number; sessions: Set<string> }> = {}
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const key = date.toISOString().split("T")[0]
      viewsByDay[key] = { views: 0, sessions: new Set() }
    }
    
    pageViews.forEach((pv: PageViewRecord) => {
      const day = pv.createdAt.toISOString().split("T")[0]
      if (viewsByDay[day]) {
        viewsByDay[day].views++
        viewsByDay[day].sessions.add(pv.sessionId)
      }
    })

    const dailyStats = Object.entries(viewsByDay)
      .map(([date, data]) => ({
        date,
        views: data.views,
        uniqueVisitors: data.sessions.size,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Traffic sources
    const referrerCounts: Record<string, number> = {}
    pageViews.forEach((pv: PageViewRecord) => {
      let source = "Direct"
      if (pv.referrer) {
        try {
          const url = new URL(pv.referrer)
          // Don't count internal referrers
          if (!url.hostname.includes("optiquedebourbon") && !url.hostname.includes("localhost")) {
            source = url.hostname.replace("www.", "")
          }
        } catch {
          source = "Direct"
        }
      }
      referrerCounts[source] = (referrerCounts[source] || 0) + 1
    })
    
    const trafficSources = Object.entries(referrerCounts)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Active sessions (last 5 minutes)
    const fiveMinutesAgo = new Date()
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5)
    
    const activeSessions = await prisma.activeSession.count({
      where: {
        lastSeenAt: { gte: fiveMinutesAgo }
      }
    })

    return NextResponse.json({
      period,
      overview: {
        totalViews,
        uniqueVisitors: uniqueSessions,
        avgDuration: Math.round(avgDuration),
        activeSessions,
      },
      devices,
      browsers: browserCounts,
      topPages,
      dailyStats,
      trafficSources,
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}
