import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { decompressBackup } from "../route"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/backups/[id] - Get backup details or download
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé - Admin requis" }, { status: 401 })
    }

    const { id } = await params
    const url = new URL(request.url)
    const download = url.searchParams.get("download") === "true"

    const backup = await prisma.databaseBackup.findUnique({
      where: { id }
    })

    if (!backup) {
      return NextResponse.json({ error: "Sauvegarde non trouvée" }, { status: 404 })
    }

    // If download requested, return the decompressed JSON
    if (download) {
      const backupData = decompressBackup(backup.data)
      const filename = `odb-backup-${backup.createdAt.toISOString().split("T")[0]}-${backup.id.slice(0, 8)}.json`
      
      return new NextResponse(JSON.stringify(backupData, null, 2), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      })
    }

    // Otherwise return metadata only (without the data field for performance)
    return NextResponse.json({
      id: backup.id,
      name: backup.name,
      type: backup.type,
      size: backup.size,
      compressedSize: backup.compressedSize,
      version: backup.version,
      stats: backup.stats,
      description: backup.description,
      createdBy: backup.createdBy,
      createdAt: backup.createdAt,
      isProtected: backup.isProtected,
      expiresAt: backup.expiresAt,
    })
  } catch (error) {
    console.error("Error fetching backup:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération de la sauvegarde" }, { status: 500 })
  }
}

// DELETE /api/backups/[id] - Delete a backup
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé - Admin requis" }, { status: 401 })
    }

    const { id } = await params

    const backup = await prisma.databaseBackup.findUnique({
      where: { id }
    })

    if (!backup) {
      return NextResponse.json({ error: "Sauvegarde non trouvée" }, { status: 404 })
    }

    if (backup.isProtected) {
      return NextResponse.json({ error: "Cette sauvegarde est protégée et ne peut pas être supprimée" }, { status: 403 })
    }

    await prisma.databaseBackup.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: "Sauvegarde supprimée" })
  } catch (error) {
    console.error("Error deleting backup:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression de la sauvegarde" }, { status: 500 })
  }
}

// PATCH /api/backups/[id] - Update backup metadata (name, description, protected)
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé - Admin requis" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, description, isProtected } = body as {
      name?: string
      description?: string
      isProtected?: boolean
    }

    const backup = await prisma.databaseBackup.findUnique({
      where: { id }
    })

    if (!backup) {
      return NextResponse.json({ error: "Sauvegarde non trouvée" }, { status: 404 })
    }

    const updated = await prisma.databaseBackup.update({
      where: { id },
      data: {
        name: name !== undefined ? name : backup.name,
        description: description !== undefined ? description : backup.description,
        isProtected: isProtected !== undefined ? isProtected : backup.isProtected,
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
        expiresAt: true,
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating backup:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour de la sauvegarde" }, { status: 500 })
  }
}
