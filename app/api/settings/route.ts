import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

interface SettingRecord {
  id: string
  key: string
  value: unknown
  updatedAt: Date
}

// GET /api/settings - Get all settings or specific keys
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get("key")
    
    if (key) {
      const setting = await prisma.settings.findUnique({
        where: { key }
      })
      return NextResponse.json(setting?.value ?? null)
    }
    
    const settings: SettingRecord[] = await prisma.settings.findMany()
    
    // Convert to key-value object for easier consumption
    const settingsObject = settings.reduce((acc: Record<string, unknown>, setting: SettingRecord) => {
      acc[setting.key] = setting.value
      return acc
    }, {} as Record<string, unknown>)
    
    return NextResponse.json(settingsObject)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

// POST /api/settings - Update multiple settings at once
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
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

// PUT /api/settings - Update a single setting
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
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
