import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import AdmZip from "adm-zip"
import path from "path"
import fs from "fs"
import { createAutoBackup } from "@/app/api/backups/route"

// Supported backup versions for migration
const SUPPORTED_VERSIONS = ["1.0", "2.0"]

interface BackupData {
  exportedAt: string
  version: string
  schemaVersion?: string
  site?: string
  data: {
    pages?: unknown[]
    blocks?: unknown[]
    pageRevisions?: unknown[]
    navigationMenus?: unknown[]
    navigationItems?: unknown[]
    gridTiles?: unknown[]
    media?: unknown[]
    settings?: unknown[]
    stores?: unknown[]
  }
  stats?: Record<string, number>
}

// Migrate old backup formats to current schema
function migrateBackup(backup: BackupData): BackupData {
  const version = backup.version || "1.0"
  
  // v1.0 -> v2.0 migration
  if (version === "1.0") {
    // Add pageRevisions if not present
    if (!backup.data.pageRevisions) {
      backup.data.pageRevisions = []
    }
    // Add stores if not present
    if (!backup.data.stores) {
      backup.data.stores = []
    }
    backup.version = "2.0"
  }
  
  return backup
}

// POST /api/settings/import - Import site backup from ZIP or JSON
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé - Admin requis" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    let backup: BackupData
    let mediaFiles: { path: string; data: Buffer }[] = []

    // Detect file type and parse
    if (file.name.endsWith(".zip")) {
      // ZIP file - extract backup.json and media files
      const zip = new AdmZip(buffer)
      const entries = zip.getEntries()
      
      // Find backup.json
      const backupEntry = entries.find(e => e.entryName === "backup.json")
      if (!backupEntry) {
        return NextResponse.json({ error: "Fichier backup.json introuvable dans le ZIP" }, { status: 400 })
      }
      
      const backupJson = backupEntry.getData().toString("utf8")
      backup = JSON.parse(backupJson)
      
      // Extract media files
      for (const entry of entries) {
        if (entry.entryName.startsWith("uploads/") && !entry.isDirectory) {
          mediaFiles.push({
            path: entry.entryName, // e.g., "uploads/2026/01/image.jpg"
            data: entry.getData()
          })
        }
      }
    } else if (file.name.endsWith(".json")) {
      // JSON file - database only
      const jsonString = buffer.toString("utf8")
      backup = JSON.parse(jsonString)
    } else {
      return NextResponse.json({ error: "Format de fichier non supporté. Utilisez .zip ou .json" }, { status: 400 })
    }

    // Validate backup structure
    if (!backup.data) {
      return NextResponse.json({ error: "Structure de backup invalide" }, { status: 400 })
    }

    // Check version compatibility
    const version = backup.version || "1.0"
    if (!SUPPORTED_VERSIONS.includes(version)) {
      return NextResponse.json({ 
        error: `Version de backup non supportée: ${version}. Versions supportées: ${SUPPORTED_VERSIONS.join(", ")}` 
      }, { status: 400 })
    }

    // Migrate backup to current version
    backup = migrateBackup(backup)

    // Create automatic backup before import (safety net)
    let autoBackupId: string | null = null
    try {
      const autoBackup = await createAutoBackup("AUTO_PRE_IMPORT", session.user.id)
      if (!autoBackup.skipped) {
        autoBackupId = autoBackup.id
      }
    } catch (backupError) {
      console.warn("Failed to create pre-import backup:", backupError)
      // Continue with import even if backup fails
    }

    // Import data in transaction
    await prisma.$transaction(async (tx) => {
      // Clear existing data in reverse dependency order
      await tx.pageBlock.deleteMany({})
      await tx.pageRevision.deleteMany({})
      await tx.page.deleteMany({})
      await tx.navigationItem.deleteMany({})
      await tx.navigationMenu.deleteMany({})
      await tx.gridTile.deleteMany({})
      await tx.media.deleteMany({})
      await tx.settings.deleteMany({})
      
      // Import settings first
      if (backup.data.settings && Array.isArray(backup.data.settings)) {
        for (const setting of backup.data.settings) {
          const s = setting as { id: string; key: string; value: unknown; updatedAt?: string }
          await tx.settings.create({
            data: {
              id: s.id,
              key: s.key,
              value: s.value as never,
              updatedAt: s.updatedAt ? new Date(s.updatedAt) : new Date(),
            }
          })
        }
      }

      // Import media
      if (backup.data.media && Array.isArray(backup.data.media)) {
        for (const m of backup.data.media) {
          const mediaItem = m as {
            id: string
            filename: string
            path: string
            url: string
            mimeType: string
            size: number
            width?: number
            height?: number
            altText?: string
            caption?: string
            uploadedAt?: string
            updatedAt?: string
          }
          await tx.media.create({
            data: {
              id: mediaItem.id,
              filename: mediaItem.filename,
              path: mediaItem.path,
              url: mediaItem.url,
              mimeType: mediaItem.mimeType,
              size: mediaItem.size,
              width: mediaItem.width,
              height: mediaItem.height,
              altText: mediaItem.altText,
              caption: mediaItem.caption,
              uploadedAt: mediaItem.uploadedAt ? new Date(mediaItem.uploadedAt) : new Date(),
              updatedAt: mediaItem.updatedAt ? new Date(mediaItem.updatedAt) : new Date(),
            }
          })
        }
      }

      // Import grid tiles
      if (backup.data.gridTiles && Array.isArray(backup.data.gridTiles)) {
        for (const tile of backup.data.gridTiles) {
          const t = tile as {
            id: string
            title: string
            caption?: string
            href: string
            backgroundUrl: string
            colSpan: number
            rowSpan: number
            colStart: number
            rowStart: number
            overlayType: "LIGHT" | "DARK"
            overlayColor?: string
            overlayOpacity: number
            order: number
            published: boolean
            createdAt?: string
            updatedAt?: string
          }
          await tx.gridTile.create({
            data: {
              id: t.id,
              title: t.title,
              caption: t.caption,
              href: t.href,
              backgroundUrl: t.backgroundUrl,
              colSpan: t.colSpan ?? 2,
              rowSpan: t.rowSpan ?? 1,
              colStart: t.colStart ?? 1,
              rowStart: t.rowStart ?? 1,
              overlayType: t.overlayType ?? "DARK",
              overlayColor: t.overlayColor,
              overlayOpacity: t.overlayOpacity ?? 60,
              order: t.order ?? 0,
              published: t.published ?? true,
              createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
              updatedAt: t.updatedAt ? new Date(t.updatedAt) : new Date(),
            }
          })
        }
      }

      // Import navigation menus first (before items that reference them)
      if (backup.data.navigationMenus && Array.isArray(backup.data.navigationMenus)) {
        for (const menu of backup.data.navigationMenus) {
          const m = menu as {
            id: string
            name: string
            slug: string
            description?: string
            type: string
            position: string
            layout: string
            alignment: string
            displayMode: string
            animation: string
            animationDuration: number
            navbarHeight: number
            fontSize: number
            backgroundColor?: string
            textColor?: string
            hoverColor?: string
            activeColor?: string
            borderColor?: string
            mobileMenuBg?: string
            mobileMenuText?: string
            mobileMenuHover?: string
            mobileMenuAccent?: string
            mobileFontSize: number
            itemSpacing: number
            padding?: string
            shadowOnScroll: boolean
            shrinkOnScroll: boolean
            scrollOpacity: number
            hideOnScrollDown: boolean
            dropdownAnimation: string
            dropdownDelay: number
            customCSS?: string
            cssClasses?: string
            mobileBreakpoint: number
            mobileStyle: string
            published: boolean
            createdAt?: string
            updatedAt?: string
          }
          await tx.navigationMenu.create({
            data: {
              id: m.id,
              name: m.name,
              slug: m.slug,
              description: m.description,
              type: m.type ?? "header",
              position: m.position ?? "top",
              layout: m.layout ?? "horizontal",
              alignment: m.alignment ?? "center",
              displayMode: m.displayMode ?? "hamburger-only",
              animation: m.animation ?? "none",
              animationDuration: m.animationDuration ?? 200,
              navbarHeight: m.navbarHeight ?? 64,
              fontSize: m.fontSize ?? 14,
              backgroundColor: m.backgroundColor,
              textColor: m.textColor,
              hoverColor: m.hoverColor,
              activeColor: m.activeColor,
              borderColor: m.borderColor,
              mobileMenuBg: m.mobileMenuBg ?? "rgba(0,0,0,0.95)",
              mobileMenuText: m.mobileMenuText ?? "#ffffff",
              mobileMenuHover: m.mobileMenuHover ?? "#999999",
              mobileMenuAccent: m.mobileMenuAccent ?? "#f59e0b",
              mobileFontSize: m.mobileFontSize ?? 18,
              itemSpacing: m.itemSpacing ?? 24,
              padding: m.padding,
              shadowOnScroll: m.shadowOnScroll ?? true,
              shrinkOnScroll: m.shrinkOnScroll ?? true,
              scrollOpacity: m.scrollOpacity ?? 100,
              hideOnScrollDown: m.hideOnScrollDown ?? false,
              dropdownAnimation: m.dropdownAnimation ?? "fadeDown",
              dropdownDelay: m.dropdownDelay ?? 0,
              customCSS: m.customCSS,
              cssClasses: m.cssClasses,
              mobileBreakpoint: m.mobileBreakpoint ?? 768,
              mobileStyle: m.mobileStyle ?? "hamburger",
              published: m.published ?? true,
              createdAt: m.createdAt ? new Date(m.createdAt) : new Date(),
              updatedAt: m.updatedAt ? new Date(m.updatedAt) : new Date(),
            }
          })
        }
      }

      // Import navigation items (without parent references first)
      if (backup.data.navigationItems && Array.isArray(backup.data.navigationItems)) {
        // First pass - create all items without parent references
        for (const item of backup.data.navigationItems) {
          const i = item as {
            id: string
            label: string
            href?: string
            parentId?: string
            order: number
            depth: number
            menuId?: string
            pageSlug?: string
            openInNewTab: boolean
            icon?: string
            iconPosition: string
            cssClass?: string
            style: unknown
            dropdownStyle: string
            parentClickable: boolean
            published: boolean
            highlighted: boolean
            createdAt?: string
            updatedAt?: string
          }
          await tx.navigationItem.create({
            data: {
              id: i.id,
              label: i.label,
              href: i.href,
              parentId: null, // Set to null first, update later
              order: i.order ?? 0,
              depth: i.depth ?? 0,
              menuId: i.menuId,
              pageSlug: i.pageSlug,
              openInNewTab: i.openInNewTab ?? false,
              icon: i.icon,
              iconPosition: i.iconPosition ?? "left",
              cssClass: i.cssClass,
              style: (i.style ?? {}) as never,
              dropdownStyle: i.dropdownStyle ?? "dropdown",
              parentClickable: i.parentClickable ?? true,
              published: i.published ?? true,
              highlighted: i.highlighted ?? false,
              createdAt: i.createdAt ? new Date(i.createdAt) : new Date(),
              updatedAt: i.updatedAt ? new Date(i.updatedAt) : new Date(),
            }
          })
        }
        
        // Second pass - update parent references
        for (const item of backup.data.navigationItems) {
          const i = item as { id: string; parentId?: string }
          if (i.parentId) {
            await tx.navigationItem.update({
              where: { id: i.id },
              data: { parentId: i.parentId }
            })
          }
        }
      }

      // Import pages
      if (backup.data.pages && Array.isArray(backup.data.pages)) {
        for (const page of backup.data.pages) {
          const p = page as {
            id: string
            slug: string
            title: string
            metaTitle?: string
            metaDescription?: string
            published: boolean
            publishedAt?: string
            template: string
            backgroundColor: string
            textColor: string
            customCSS?: string
            showNavbarTitle?: boolean
            navbarTitle?: string
            navbarSubtitle?: string
            showInNav: boolean
            navOrder: number
            navLabel?: string
            parentSlug?: string
            deletedAt?: string
            createdAt?: string
            updatedAt?: string
          }
          await tx.page.create({
            data: {
              id: p.id,
              slug: p.slug,
              title: p.title,
              metaTitle: p.metaTitle,
              metaDescription: p.metaDescription,
              published: p.published ?? false,
              publishedAt: p.publishedAt ? new Date(p.publishedAt) : null,
              template: p.template ?? "default",
              backgroundColor: p.backgroundColor ?? "#ffffff",
              textColor: p.textColor ?? "#171717",
              customCSS: p.customCSS,
              showNavbarTitle: p.showNavbarTitle ?? false,
              navbarTitle: p.navbarTitle,
              navbarSubtitle: p.navbarSubtitle,
              showInNav: p.showInNav ?? true,
              navOrder: p.navOrder ?? 0,
              navLabel: p.navLabel,
              parentSlug: p.parentSlug,
              deletedAt: p.deletedAt ? new Date(p.deletedAt) : null,
              createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
              updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
            }
          })
        }
      }

      // Import page blocks
      if (backup.data.blocks && Array.isArray(backup.data.blocks)) {
        for (const block of backup.data.blocks) {
          const b = block as {
            id: string
            pageId: string
            type: string
            order: number
            content: unknown
            settings: unknown
            styles: unknown
            visible: boolean
            createdAt?: string
            updatedAt?: string
          }
          await tx.pageBlock.create({
            data: {
              id: b.id,
              pageId: b.pageId,
              type: b.type as never,
              order: b.order ?? 0,
              content: (b.content ?? {}) as never,
              settings: (b.settings ?? {}) as never,
              styles: (b.styles ?? {}) as never,
              visible: b.visible ?? true,
              createdAt: b.createdAt ? new Date(b.createdAt) : new Date(),
              updatedAt: b.updatedAt ? new Date(b.updatedAt) : new Date(),
            }
          })
        }
      }

      // Import page revisions
      if (backup.data.pageRevisions && Array.isArray(backup.data.pageRevisions)) {
        for (const revision of backup.data.pageRevisions) {
          const r = revision as {
            id: string
            pageId: string
            version: number
            title: string
            slug: string
            metaTitle?: string
            metaDescription?: string
            template: string
            backgroundColor: string
            textColor: string
            customCSS?: string
            published: boolean
            showInNav: boolean
            navOrder: number
            navLabel?: string
            parentSlug?: string
            blocksSnapshot: unknown
            createdAt?: string
            createdBy?: string
            changeNote?: string
          }
          await tx.pageRevision.create({
            data: {
              id: r.id,
              pageId: r.pageId,
              version: r.version,
              title: r.title,
              slug: r.slug,
              metaTitle: r.metaTitle,
              metaDescription: r.metaDescription,
              template: r.template ?? "default",
              backgroundColor: r.backgroundColor ?? "#ffffff",
              textColor: r.textColor ?? "#171717",
              customCSS: r.customCSS,
              published: r.published ?? false,
              showInNav: r.showInNav ?? true,
              navOrder: r.navOrder ?? 0,
              navLabel: r.navLabel,
              parentSlug: r.parentSlug,
              blocksSnapshot: (r.blocksSnapshot ?? []) as never,
              createdAt: r.createdAt ? new Date(r.createdAt) : new Date(),
              createdBy: r.createdBy,
              changeNote: r.changeNote,
            }
          })
        }
      }
    })

    // Restore media files from ZIP
    if (mediaFiles.length > 0) {
      const uploadsDir = path.join(process.cwd(), "public")
      
      for (const file of mediaFiles) {
        const filePath = path.join(uploadsDir, file.path)
        const dirPath = path.dirname(filePath)
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true })
        }
        
        // Write file
        fs.writeFileSync(filePath, file.data)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Import réussi",
      stats: {
        pages: backup.data.pages?.length ?? 0,
        blocks: backup.data.blocks?.length ?? 0,
        pageRevisions: backup.data.pageRevisions?.length ?? 0,
        navigationMenus: backup.data.navigationMenus?.length ?? 0,
        navigationItems: backup.data.navigationItems?.length ?? 0,
        gridTiles: backup.data.gridTiles?.length ?? 0,
        media: backup.data.media?.length ?? 0,
        settings: backup.data.settings?.length ?? 0,
        mediaFilesRestored: mediaFiles.length,
      },
      originalVersion: backup.version,
      migratedFrom: backup.version !== "2.0" ? backup.version : undefined,
      autoBackupCreated: autoBackupId ? true : false,
      autoBackupId: autoBackupId,
    })
  } catch (error) {
    console.error("Error importing backup:", error)
    return NextResponse.json(
      { error: `Erreur lors de l'import: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    )
  }
}
