import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import * as pako from "pako"

// Backup types (matching Prisma enum)
type BackupType = "MANUAL" | "AUTO_PRE_IMPORT" | "AUTO_PRE_EXPORT" | "SCHEDULED"

// Current backup version
const BACKUP_VERSION = "2.0"

// Minimum interval between automatic backups (in minutes)
const MIN_BACKUP_INTERVAL = 5

// Maximum number of automatic backups to keep
const MAX_AUTO_BACKUPS = 20

// Types for backup data
interface BackupData {
  exportedAt: string
  version: string
  schemaVersion: string
  site: string
  data: {
    pages: unknown[]
    blocks: unknown[]
    pageRevisions: unknown[]
    navigationMenus: unknown[]
    navigationItems: unknown[]
    gridTiles: unknown[]
    media: unknown[]
    settings: unknown[]
    stores: unknown[]
  }
  stats: Record<string, number>
}

// Helper to create backup data object
async function createBackupData(): Promise<BackupData> {
  const [pages, blocks, pageRevisions, navigationMenus, navigationItems, gridTiles, media, settings, stores] = 
    await Promise.all([
      prisma.page.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.pageBlock.findMany({ orderBy: [{ pageId: "asc" }, { order: "asc" }] }),
      prisma.pageRevision.findMany({ orderBy: [{ pageId: "asc" }, { version: "asc" }] }),
      prisma.navigationMenu.findMany({ include: { items: true }, orderBy: { createdAt: "asc" } }),
      prisma.navigationItem.findMany({ orderBy: [{ menuId: "asc" }, { order: "asc" }] }),
      prisma.gridTile.findMany({ orderBy: { order: "asc" } }),
      prisma.media.findMany({ orderBy: { uploadedAt: "asc" } }),
      prisma.settings.findMany(),
      // Check if Store model exists
      (async () => {
        try {
          const result = await prisma.$queryRaw<{ exists: boolean }[]>`
            SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Store')
          `
          if (result[0]?.exists) {
            return await prisma.$queryRaw`SELECT * FROM "Store" ORDER BY "createdAt" ASC`
          }
          return []
        } catch {
          return []
        }
      })(),
    ])

  return {
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
      stores: Array.isArray(stores) ? stores : [],
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
}

// Helper to compress backup data
function compressBackup(data: BackupData): { compressed: string; originalSize: number; compressedSize: number } {
  const jsonString = JSON.stringify(data)
  const originalSize = Buffer.byteLength(jsonString, 'utf8')
  
  // Compress using pako (gzip)
  const compressed = pako.gzip(jsonString)
  const compressedBase64 = Buffer.from(compressed).toString('base64')
  const compressedSize = Buffer.byteLength(compressedBase64, 'utf8')
  
  return { compressed: compressedBase64, originalSize, compressedSize }
}

// Helper to decompress backup data
export function decompressBackup(compressedBase64: string): BackupData {
  const compressed = Buffer.from(compressedBase64, 'base64')
  const decompressed = pako.ungzip(compressed, { to: 'string' })
  return JSON.parse(decompressed)
}

// Check if we should skip creating a backup (to avoid duplicates)
async function shouldSkipBackup(type: BackupType): Promise<boolean> {
  // Only skip for automatic backups
  if (type === "MANUAL") return false
  
  const recentBackup = await prisma.databaseBackup.findFirst({
    where: {
      type: type,
      createdAt: {
        gte: new Date(Date.now() - MIN_BACKUP_INTERVAL * 60 * 1000)
      }
    },
    orderBy: { createdAt: "desc" }
  })
  
  return !!recentBackup
}

// Cleanup old automatic backups
async function cleanupOldBackups(): Promise<number> {
  // Get auto backups count
  const autoBackups = await prisma.databaseBackup.findMany({
    where: {
      type: { in: ["AUTO_PRE_IMPORT", "AUTO_PRE_EXPORT", "SCHEDULED"] },
      isProtected: false
    },
    orderBy: { createdAt: "desc" }
  })
  
  if (autoBackups.length <= MAX_AUTO_BACKUPS) return 0
  
  // Delete excess backups
  const toDelete = autoBackups.slice(MAX_AUTO_BACKUPS)
  await prisma.databaseBackup.deleteMany({
    where: { id: { in: toDelete.map(b => b.id) } }
  })
  
  return toDelete.length
}

// Exported helper to create automatic backups (used by import/export routes)
export async function createAutoBackup(type: "AUTO_PRE_IMPORT" | "AUTO_PRE_EXPORT", userId?: string): Promise<{ id: string; skipped: boolean }> {
  // Check if we should skip
  if (await shouldSkipBackup(type)) {
    return { id: "", skipped: true }
  }
  
  // Create backup data
  const backupData = await createBackupData()
  
  // Compress
  const { compressed, originalSize, compressedSize } = compressBackup(backupData)
  
  // Generate name
  const backupName = `Sauvegarde automatique ${type === "AUTO_PRE_IMPORT" ? "pré-import" : "pré-export"} - ${new Date().toLocaleString("fr-FR")}`

  // Create backup record
  const backup = await prisma.databaseBackup.create({
    data: {
      name: backupName,
      type: type,
      data: compressed,
      size: originalSize,
      compressedSize: compressedSize,
      version: BACKUP_VERSION,
      stats: backupData.stats,
      description: `Sauvegarde automatique créée avant ${type === "AUTO_PRE_IMPORT" ? "l'import" : "l'export"}`,
      createdBy: userId,
      isProtected: false,
    },
    select: { id: true }
  })

  // Cleanup old backups
  await cleanupOldBackups()

  return { id: backup.id, skipped: false }
}

// GET /api/backups - List all backups
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé - Admin requis" }, { status: 401 })
    }

    const backups = await prisma.databaseBackup.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        size: true,
        compressedSize: true,
        version: true,
        stats: true,
        description: true,
        createdBy: true,
        createdAt: true,
        isProtected: true,
        expiresAt: true,
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(backups)
  } catch (error) {
    console.error("Error fetching backups:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des sauvegardes" }, { status: 500 })
  }
}

// POST /api/backups - Create a new backup
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé - Admin requis" }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const {
      name,
      type = "MANUAL",
      description,
      isProtected = false
    } = body as {
      name?: string
      type?: BackupType
      description?: string
      isProtected?: boolean
    }

    // Check if we should skip (to avoid duplicates)
    if (await shouldSkipBackup(type)) {
      return NextResponse.json({
        skipped: true,
        message: `Une sauvegarde ${type} a déjà été créée récemment`
      })
    }

    // Create backup data
    const backupData = await createBackupData()
    
    // Compress
    const { compressed, originalSize, compressedSize } = compressBackup(backupData)
    
    // Generate name if not provided
    const backupName = name || `Sauvegarde ${type === "MANUAL" ? "manuelle" : type === "AUTO_PRE_IMPORT" ? "pré-import" : type === "AUTO_PRE_EXPORT" ? "pré-export" : "automatique"} - ${new Date().toLocaleString("fr-FR")}`

    // Create backup record
    const backup = await prisma.databaseBackup.create({
      data: {
        name: backupName,
        type: type,
        data: compressed,
        size: originalSize,
        compressedSize: compressedSize,
        version: BACKUP_VERSION,
        stats: backupData.stats,
        description: description,
        createdBy: session.user.id,
        isProtected: isProtected,
      },
      select: {
        id: true,
        name: true,
        type: true,
        size: true,
        compressedSize: true,
        version: true,
        stats: true,
        description: true,
        createdBy: true,
        createdAt: true,
        isProtected: true,
      }
    })

    // Cleanup old automatic backups
    const deleted = await cleanupOldBackups()

    return NextResponse.json({
      success: true,
      backup,
      deletedOldBackups: deleted
    })
  } catch (error) {
    console.error("Error creating backup:", error)
    return NextResponse.json({ error: "Erreur lors de la création de la sauvegarde" }, { status: 500 })
  }
}
