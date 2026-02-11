import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import archiver from "archiver"
import path from "path"
import fs from "fs"
import { PassThrough } from "stream"
import { createAutoBackup } from "@/app/api/backups/route"

// Current backup version - increment when schema changes
const BACKUP_VERSION = "2.0"

// GET /api/settings/export - Export full site backup as ZIP
export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé - Admin requis" }, { status: 401 })
    }

    // Check for format parameter (json or zip)
    const url = new URL(request.url)
    const format = url.searchParams.get("format") || "zip"
    const skipAutoBackup = url.searchParams.get("skipBackup") === "true"

    // Create automatic backup before export (optional, can be skipped)
    if (!skipAutoBackup) {
      try {
        await createAutoBackup("AUTO_PRE_EXPORT", session.user.id)
      } catch (backupError) {
        console.warn("Failed to create pre-export backup:", backupError)
        // Continue with export even if backup fails
      }
    }

    // Fetch all data for backup
    const [pages, blocks, pageRevisions, navigationMenus, navigationItems, gridTiles, media, settings, stores] = 
      await Promise.all([
        prisma.page.findMany({
          orderBy: { createdAt: "asc" }
        }),
        prisma.pageBlock.findMany({
          orderBy: [{ pageId: "asc" }, { order: "asc" }]
        }),
        prisma.pageRevision.findMany({
          orderBy: [{ pageId: "asc" }, { version: "asc" }]
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
        // Check if Store model exists and fetch stores
        (async () => {
          try {
            const result = await prisma.$queryRaw<{ exists: boolean }[]>`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Store')`
            if (result[0]?.exists) {
              return await prisma.$queryRaw`SELECT * FROM "Store" ORDER BY "createdAt" ASC`
            }
            return []
          } catch {
            return []
          }
        })(),
      ])

    const backup = {
      exportedAt: new Date().toISOString(),
      version: BACKUP_VERSION,
      schemaVersion: "prisma-7.1.0",
      site: "Optique de Bourbon",
      data: {
        pages,
        blocks,
        pageRevisions,
        navigationMenus,
        navigationItems,
        gridTiles,
        media,
        settings,
        stores,
      },
      stats: {
        pages: pages.length,
        blocks: blocks.length,
        pageRevisions: pageRevisions.length,
        navigationMenus: navigationMenus.length,
        navigationItems: navigationItems.length,
        gridTiles: gridTiles.length,
        media: media.length,
        settings: settings.length,
        stores: Array.isArray(stores) ? stores.length : 0,
      }
    }

    // JSON-only export
    if (format === "json") {
      const filename = `odb-backup-${new Date().toISOString().split("T")[0]}.json`
      return new NextResponse(JSON.stringify(backup, null, 2), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      })
    }

    // ZIP export with media files
    const filename = `odb-backup-${new Date().toISOString().split("T")[0]}.zip`
    
    // Create a PassThrough stream to pipe to response
    const passThrough = new PassThrough()
    
    // Create archive
    const archive = archiver("zip", {
      zlib: { level: 9 } // Maximum compression
    })

    // Pipe archive to passthrough stream
    archive.pipe(passThrough)

    // Add backup.json to archive
    archive.append(JSON.stringify(backup, null, 2), { name: "backup.json" })

    // Add media files to archive
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    
    if (fs.existsSync(uploadsDir)) {
      // Add entire uploads directory recursively
      archive.directory(uploadsDir, "uploads")
    }

    // Finalize archive
    archive.finalize()

    // Convert stream to response
    const chunks: Buffer[] = []
    
    return new Promise<NextResponse>((resolve, reject) => {
      passThrough.on("data", (chunk: Buffer) => chunks.push(chunk))
      passThrough.on("end", () => {
        const buffer = Buffer.concat(chunks)
        resolve(new NextResponse(buffer, {
          status: 200,
          headers: {
            "Content-Type": "application/zip",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Content-Length": buffer.length.toString(),
          },
        }))
      })
      passThrough.on("error", reject)
      archive.on("error", reject)
    })
  } catch (error) {
    console.error("Error exporting backup:", error)
    return NextResponse.json(
      { error: "Failed to export backup" },
      { status: 500 }
    )
  }
}
