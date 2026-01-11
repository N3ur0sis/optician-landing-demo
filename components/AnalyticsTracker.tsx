"use client"

import { useEffect, useRef, useCallback } from "react"
import { usePathname } from "next/navigation"

export function AnalyticsTracker() {
  const pathname = usePathname()
  const sessionIdRef = useRef<string | null>(null)
  const startTimeRef = useRef<number>(Date.now())

  const trackPageView = useCallback(async (path: string) => {
    try {
      const response = await fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path,
          sessionId: sessionIdRef.current,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        sessionIdRef.current = data.sessionId
      }
    } catch (error) {
      console.error("Analytics tracking error:", error)
    }
  }, [])

  const trackDuration = useCallback(async (path: string) => {
    if (!sessionIdRef.current) return
    
    const duration = Math.round((Date.now() - startTimeRef.current) / 1000)
    if (duration < 1) return // Ignore very short visits
    
    try {
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path,
          sessionId: sessionIdRef.current,
          duration,
        }),
      })
    } catch (error) {
      console.error("Duration tracking error:", error)
    }
  }, [])

  useEffect(() => {
    // Track page view on mount and route change
    startTimeRef.current = Date.now()
    trackPageView(pathname)

    // Track duration when leaving page
    const handleBeforeUnload = () => {
      trackDuration(pathname)
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      trackDuration(pathname)
    }
  }, [pathname, trackPageView, trackDuration])

  return null // This is a tracking component, no UI
}
