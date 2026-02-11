import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { decompressBackup, createAutoBackup } from "../../route"

interface RouteParams {
  params: Promise<{ id: string }>
}

// POST /api/backups/[id]/restore - Restore from a backup
export async function POST(_request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé - Admin requis" }, { status: 401 })
    }

    const { id } = await params

    // Get the backup
    const backup = await prisma.databaseBackup.findUnique({
      where: { id }
    })

    if (!backup) {
      return NextResponse.json({ error: "Sauvegarde non trouvée" }, { status: 404 })
    }

    // Create a pre-restore backup first (safety net)
    try {
      await createAutoBackup("AUTO_PRE_IMPORT", session.user.id)
    } catch (backupError) {
      console.warn("Failed to create pre-restore backup:", backupError)
      // Continue with restore even if backup fails
    }

    // Decompress backup data
    const backupData = decompressBackup(backup.data)

    // Restore data in transaction
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
      
      // Import settings
      if (backupData.data.settings && Array.isArray(backupData.data.settings)) {
        for (const setting of backupData.data.settings) {
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
      if (backupData.data.media && Array.isArray(backupData.data.media)) {
        for (const m of backupData.data.media) {
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
      if (backupData.data.gridTiles && Array.isArray(backupData.data.gridTiles)) {
        for (const tile of backupData.data.gridTiles) {
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

      // Import navigation menus
      if (backupData.data.navigationMenus && Array.isArray(backupData.data.navigationMenus)) {
        for (const menu of backupData.data.navigationMenus) {
          const m = menu as Record<string, unknown>
          await tx.navigationMenu.create({
            data: {
              id: m.id as string,
              name: m.name as string,
              slug: m.slug as string,
              description: m.description as string | undefined,
              type: (m.type as string) ?? "header",
              position: (m.position as string) ?? "top",
              layout: (m.layout as string) ?? "horizontal",
              alignment: (m.alignment as string) ?? "center",
              displayMode: (m.displayMode as string) ?? "hamburger-only",
              animation: (m.animation as string) ?? "none",
              animationDuration: (m.animationDuration as number) ?? 200,
              navbarHeight: (m.navbarHeight as number) ?? 64,
              fontSize: (m.fontSize as number) ?? 14,
              backgroundColor: m.backgroundColor as string | undefined,
              textColor: m.textColor as string | undefined,
              hoverColor: m.hoverColor as string | undefined,
              activeColor: m.activeColor as string | undefined,
              borderColor: m.borderColor as string | undefined,
              mobileMenuBg: (m.mobileMenuBg as string) ?? "rgba(0,0,0,0.95)",
              mobileMenuText: (m.mobileMenuText as string) ?? "#ffffff",
              mobileMenuHover: (m.mobileMenuHover as string) ?? "#999999",
              mobileMenuAccent: (m.mobileMenuAccent as string) ?? "#f59e0b",
              mobileFontSize: (m.mobileFontSize as number) ?? 18,
              itemSpacing: (m.itemSpacing as number) ?? 24,
              padding: m.padding as string | undefined,
              shadowOnScroll: (m.shadowOnScroll as boolean) ?? true,
              shrinkOnScroll: (m.shrinkOnScroll as boolean) ?? true,
              scrollOpacity: (m.scrollOpacity as number) ?? 100,
              hideOnScrollDown: (m.hideOnScrollDown as boolean) ?? false,
              dropdownAnimation: (m.dropdownAnimation as string) ?? "fadeDown",
              dropdownDelay: (m.dropdownDelay as number) ?? 0,
              customCSS: m.customCSS as string | undefined,
              cssClasses: m.cssClasses as string | undefined,
              mobileBreakpoint: (m.mobileBreakpoint as number) ?? 768,
              mobileStyle: (m.mobileStyle as string) ?? "hamburger",
              published: (m.published as boolean) ?? true,
              createdAt: m.createdAt ? new Date(m.createdAt as string) : new Date(),
              updatedAt: m.updatedAt ? new Date(m.updatedAt as string) : new Date(),
            }
          })
        }
      }

      // Import navigation items (without parent references first)
      if (backupData.data.navigationItems && Array.isArray(backupData.data.navigationItems)) {
        // First pass - create all items without parent references
        for (const item of backupData.data.navigationItems) {
          const i = item as Record<string, unknown>
          await tx.navigationItem.create({
            data: {
              id: i.id as string,
              label: i.label as string,
              href: i.href as string | undefined,
              parentId: null,
              order: (i.order as number) ?? 0,
              depth: (i.depth as number) ?? 0,
              menuId: i.menuId as string | undefined,
              pageSlug: i.pageSlug as string | undefined,
              openInNewTab: (i.openInNewTab as boolean) ?? false,
              icon: i.icon as string | undefined,
              iconPosition: (i.iconPosition as string) ?? "left",
              cssClass: i.cssClass as string | undefined,
              style: ((i.style ?? {}) as object) as never,
              dropdownStyle: (i.dropdownStyle as string) ?? "dropdown",
              parentClickable: (i.parentClickable as boolean) ?? true,
              published: (i.published as boolean) ?? true,
              highlighted: (i.highlighted as boolean) ?? false,
              createdAt: i.createdAt ? new Date(i.createdAt as string) : new Date(),
              updatedAt: i.updatedAt ? new Date(i.updatedAt as string) : new Date(),
            }
          })
        }
        
        // Second pass - update parent references
        for (const item of backupData.data.navigationItems) {
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
      if (backupData.data.pages && Array.isArray(backupData.data.pages)) {
        for (const page of backupData.data.pages) {
          const p = page as Record<string, unknown>
          await tx.page.create({
            data: {
              id: p.id as string,
              slug: p.slug as string,
              title: p.title as string,
              metaTitle: p.metaTitle as string | undefined,
              metaDescription: p.metaDescription as string | undefined,
              published: (p.published as boolean) ?? false,
              publishedAt: p.publishedAt ? new Date(p.publishedAt as string) : null,
              template: (p.template as string) ?? "default",
              backgroundColor: (p.backgroundColor as string) ?? "#ffffff",
              textColor: (p.textColor as string) ?? "#171717",
              customCSS: p.customCSS as string | undefined,
              showNavbarTitle: (p.showNavbarTitle as boolean) ?? false,
              navbarTitle: p.navbarTitle as string | undefined,
              navbarSubtitle: p.navbarSubtitle as string | undefined,
              showInNav: (p.showInNav as boolean) ?? true,
              navOrder: (p.navOrder as number) ?? 0,
              navLabel: p.navLabel as string | undefined,
              parentSlug: p.parentSlug as string | undefined,
              deletedAt: p.deletedAt ? new Date(p.deletedAt as string) : null,
              createdAt: p.createdAt ? new Date(p.createdAt as string) : new Date(),
              updatedAt: p.updatedAt ? new Date(p.updatedAt as string) : new Date(),
            }
          })
        }
      }

      // Import page blocks
      if (backupData.data.blocks && Array.isArray(backupData.data.blocks)) {
        for (const block of backupData.data.blocks) {
          const b = block as Record<string, unknown>
          await tx.pageBlock.create({
            data: {
              id: b.id as string,
              pageId: b.pageId as string,
              type: b.type as never,
              order: (b.order as number) ?? 0,
              content: ((b.content ?? {}) as object) as never,
              settings: ((b.settings ?? {}) as object) as never,
              styles: ((b.styles ?? {}) as object) as never,
              visible: (b.visible as boolean) ?? true,
              createdAt: b.createdAt ? new Date(b.createdAt as string) : new Date(),
              updatedAt: b.updatedAt ? new Date(b.updatedAt as string) : new Date(),
            }
          })
        }
      }

      // Import page revisions
      if (backupData.data.pageRevisions && Array.isArray(backupData.data.pageRevisions)) {
        for (const revision of backupData.data.pageRevisions) {
          const r = revision as Record<string, unknown>
          await tx.pageRevision.create({
            data: {
              id: r.id as string,
              pageId: r.pageId as string,
              version: r.version as number,
              title: r.title as string,
              slug: r.slug as string,
              metaTitle: r.metaTitle as string | undefined,
              metaDescription: r.metaDescription as string | undefined,
              template: (r.template as string) ?? "default",
              backgroundColor: (r.backgroundColor as string) ?? "#ffffff",
              textColor: (r.textColor as string) ?? "#171717",
              customCSS: r.customCSS as string | undefined,
              published: (r.published as boolean) ?? false,
              showInNav: (r.showInNav as boolean) ?? true,
              navOrder: (r.navOrder as number) ?? 0,
              navLabel: r.navLabel as string | undefined,
              parentSlug: r.parentSlug as string | undefined,
              blocksSnapshot: ((r.blocksSnapshot ?? []) as object) as never,
              createdAt: r.createdAt ? new Date(r.createdAt as string) : new Date(),
              createdBy: r.createdBy as string | undefined,
              changeNote: r.changeNote as string | undefined,
            }
          })
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: "Restauration réussie",
      restoredFrom: {
        id: backup.id,
        name: backup.name,
        createdAt: backup.createdAt,
      },
      stats: backupData.stats
    })
  } catch (error) {
    console.error("Error restoring backup:", error)
    return NextResponse.json({ 
      error: `Erreur lors de la restauration: ${error instanceof Error ? error.message : String(error)}` 
    }, { status: 500 })
  }
}
