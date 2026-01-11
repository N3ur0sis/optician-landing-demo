import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

// GET /api/settings/export - Export full site backup
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé - Admin requis" }, { status: 401 })
    }

    // Fetch all data for backup
    const [pages, blocks, navigationMenus, navigationItems, gridTiles, media, settings] = 
      await Promise.all([
        prisma.page.findMany({
          orderBy: { createdAt: "asc" }
        }),
        prisma.pageBlock.findMany({
          orderBy: [{ pageId: "asc" }, { order: "asc" }]
        }),
        prisma.navigationMenu.findMany({
          include: { items: true },
          orderBy: { createdAt: "asc" }
        }),
        prisma.navigationItem.findMany({
          orderBy: [{ menuId: "asc" }, { order: "asc" }]
        }),
        prisma.gridTile.findMany({
          orderBy: { order: "asc" }
        }),
        prisma.media.findMany({
          orderBy: { uploadedAt: "asc" }
        }),
        prisma.settings.findMany(),
      ])

    const backup = {
      exportedAt: new Date().toISOString(),
      version: "1.0",
      site: "Optique de Bourbon",
      data: {
        pages,
        blocks,
        navigationMenus,
        navigationItems,
        gridTiles,
        media,
        settings,
      },
      stats: {
        pages: pages.length,
        blocks: blocks.length,
        navigationMenus: navigationMenus.length,
        navigationItems: navigationItems.length,
        gridTiles: gridTiles.length,
        media: media.length,
        settings: settings.length,
      }
    }

    const filename = `odb-backup-${new Date().toISOString().split("T")[0]}.json`
    
    return new NextResponse(JSON.stringify(backup, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Error exporting backup:", error)
    return NextResponse.json(
      { error: "Failed to export backup" },
      { status: 500 }
    )
  }
}
