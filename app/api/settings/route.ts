import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

// Force dynamic rendering to prevent Next.js from caching this route
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface SettingRecord {
  id: string
  key: string
  value: unknown
  updatedAt: Date
}

// Public setting keys that can be read without auth (needed by frontend)
const PUBLIC_SETTING_KEYS = [
  "site_name", "site_description", "logo_url", "logo_dark_url",
  "footer_", "social_", "contact_", "newsletter_",
  "intro_", "loading_", "grid_", "navbar_",
  "apparence",
]

function isPublicKey(key: string): boolean {
  return PUBLIC_SETTING_KEYS.some(prefix => key.startsWith(prefix))
}

// Helper to check admin role
async function checkSettingsPermission() {
  const session = await auth()
  if (!session?.user) {
    return { authorized: false, error: "Non autorisé" }
  }
  const role = session.user.role as string
  if (role !== "ADMIN") {
    return { authorized: false, error: "Accès réservé aux administrateurs" }
  }
  return { authorized: true, session }
}

// GET /api/settings - Get all settings or specific keys
// Public keys accessible without auth, all keys require ADMIN
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get("key")
    
    if (key) {
      const setting = await prisma.settings.findUnique({
        where: { key }
      })
      // Allow public keys without auth, restrict others
      if (!isPublicKey(key)) {
        const check = await checkSettingsPermission()
        if (!check.authorized) {
          return NextResponse.json({ error: check.error }, { status: 403 })
        }
      }
      const response = NextResponse.json(setting?.value ?? null)
      // Disable caching to ensure fresh settings are always fetched
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
      return response
    }
    
    const settings: SettingRecord[] = await prisma.settings.findMany()
    
    // Check if user is admin — if not, only return public keys
    const session = await auth()
    const isAdmin = session?.user?.role === "ADMIN"
    
    const filteredSettings = isAdmin 
      ? settings 
      : settings.filter(s => isPublicKey(s.key))
    
    const settingsObject = filteredSettings.reduce((acc: Record<string, unknown>, setting: SettingRecord) => {
      acc[setting.key] = setting.value
      return acc
    }, {} as Record<string, unknown>)
    
    const response = NextResponse.json(settingsObject)
    // Disable caching to ensure fresh settings are always fetched
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

// POST /api/settings - Update multiple settings at once (ADMIN only)
export async function POST(request: NextRequest) {
  try {
    const check = await checkSettingsPermission()
    if (!check.authorized) {
      return NextResponse.json({ error: check.error }, { status: 403 })
    }

    const body = await request.json()
    const { settings } = body as { settings: Record<string, unknown> }
    
    if (!settings || typeof settings !== "object") {
      return NextResponse.json(
        { error: "Invalid settings format" },
        { status: 400 }
      )
    }

    // Upsert each setting
    const updates = await Promise.all(
      Object.entries(settings).map(([key, value]) =>
        prisma.settings.upsert({
          where: { key },
          update: { value: value as object },
          create: { key, value: value as object },
        })
      )
    )

    return NextResponse.json({
      success: true,
      updated: updates.length,
    })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    )
  }
}

// PUT /api/settings - Update a single setting (ADMIN only)
export async function PUT(request: NextRequest) {
  try {
    const check = await checkSettingsPermission()
    if (!check.authorized) {
      return NextResponse.json({ error: check.error }, { status: 403 })
    }

    const body = await request.json()
    const { key, value } = body as { key: string; value: unknown }
    
    if (!key) {
      return NextResponse.json(
        { error: "Key is required" },
        { status: 400 }
      )
    }

    const setting = await prisma.settings.upsert({
      where: { key },
      update: { value: value as object },
      create: { key, value: value as object },
    })

    return NextResponse.json(setting)
  } catch (error) {
    console.error("Error updating setting:", error)
    return NextResponse.json(
      { error: "Failed to update setting" },
      { status: 500 }
    )
  }
}
