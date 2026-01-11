import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { headers } from "next/headers"
import { v4 as uuidv4 } from "uuid"

// Helper to parse user agent
function parseUserAgent(ua: string): { device: string; browser: string; os: string } {
  const device = /Mobile|Android|iPhone|iPad/i.test(ua) 
    ? (/iPad|Tablet/i.test(ua) ? "tablet" : "mobile")
    : "desktop"
    
  let browser = "other"
  if (/Chrome/i.test(ua) && !/Edge|Edg/i.test(ua)) browser = "chrome"
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "safari"
  else if (/Firefox/i.test(ua)) browser = "firefox"
  else if (/Edge|Edg/i.test(ua)) browser = "edge"
  else if (/MSIE|Trident/i.test(ua)) browser = "ie"
  
  let os = "other"
  if (/Windows/i.test(ua)) os = "windows"
  else if (/Mac/i.test(ua)) os = "macos"
  else if (/Linux/i.test(ua)) os = "linux"
  else if (/Android/i.test(ua)) os = "android"
  else if (/iOS|iPhone|iPad/i.test(ua)) os = "ios"
  
  return { device, browser, os }
}

// POST /api/analytics/track - Track a page view
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { path, pageId, duration, sessionId: existingSessionId } = body as {
      path: string
      pageId?: string
      duration?: number
      sessionId?: string
    }

    if (!path) {
      return NextResponse.json({ error: "Path required" }, { status: 400 })
    }

    const headersList = await headers()
    const userAgent = headersList.get("user-agent") || ""
    const referrer = headersList.get("referer") || ""
    
    // Get or create session ID
    const sessionId = existingSessionId || uuidv4()
    
    // Parse user agent
    const { device, browser, os } = parseUserAgent(userAgent)

    // If duration is provided, update existing pageview
    if (duration && existingSessionId) {
      await prisma.pageView.updateMany({
        where: {
          sessionId: existingSessionId,
          path,
          duration: null,
        },
        data: { duration },
      })
      
      return NextResponse.json({ success: true, sessionId })
    }

    // Create page view
    await prisma.pageView.create({
      data: {
        path,
        pageId,
        sessionId,
        userAgent,
        referrer,
        device,
        browser,
        os,
      }
    })

    // Update or create active session
    await prisma.activeSession.upsert({
      where: { sessionId },
      update: {
        path,
        lastSeenAt: new Date(),
        pageViews: { increment: 1 },
      },
      create: {
        sessionId,
        path,
      },
    })

    return NextResponse.json({ success: true, sessionId })
  } catch (error) {
    console.error("Error tracking page view:", error)
    return NextResponse.json(
      { error: "Failed to track" },
      { status: 500 }
    )
  }
}
