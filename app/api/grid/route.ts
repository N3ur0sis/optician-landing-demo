import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { hasPermission, parsePermissions } from "@/types/permissions";

// GET /api/grid - Fetch all grid tiles
export async function GET() {
  try {
    const tiles = await prisma.gridTile.findMany({
      orderBy: [{ order: "asc" }],
    });

    return NextResponse.json(tiles);
  } catch (error) {
    console.error("Error fetching grid tiles:", error);
    return NextResponse.json(
      { error: "Failed to fetch grid tiles" },
      { status: 500 },
    );
  }
}

// Helper to check grid permission
async function checkGridPermission() {
  const session = await auth();
  if (!session) {
    return { authorized: false, error: "Unauthorized" };
  }
  
  const role = session.user?.role as "ADMIN" | "WEBMASTER";
  const permissions = parsePermissions(session.user?.permissions);
  
  if (!hasPermission(role, permissions, "grid")) {
    return { authorized: false, error: "Permission denied" };
  }
  
  return { authorized: true, session };
}

// PUT /api/grid - Update all grid tiles (bulk update)
export async function PUT(request: NextRequest) {
  try {
    const check = await checkGridPermission();
    if (!check.authorized) {
      return NextResponse.json({ error: check.error }, { status: 401 });
    }

    const tiles = await request.json();

    // Delete all existing tiles and recreate with new data
    await prisma.gridTile.deleteMany();

    await prisma.gridTile.createMany({
      data: tiles.map((tile: any, index: number) => ({
        id: tile.id || undefined, // Let Prisma generate new IDs if not provided
        title: tile.title,
        caption: tile.caption || null,
        href: tile.href,
        backgroundUrl: tile.backgroundUrl,
        colSpan: tile.colSpan,
        rowSpan: tile.rowSpan,
        colStart: tile.colStart,
        rowStart: tile.rowStart,
        overlayType: tile.overlayType,
        overlayColor: tile.overlayColor || null,
        overlayOpacity: tile.overlayOpacity ?? 60,
        order: index + 1,
        published: tile.published ?? true,
      })),
    });

    const updatedTiles = await prisma.gridTile.findMany({
      orderBy: [{ order: "asc" }],
    });

    return NextResponse.json(updatedTiles);
  } catch (error) {
    console.error("Error updating grid tiles:", error);
    return NextResponse.json(
      { error: "Failed to update grid tiles" },
      { status: 500 },
    );
  }
}

// POST /api/grid - Create a new grid tile
export async function POST(request: NextRequest) {
  try {
    const check = await checkGridPermission();
    if (!check.authorized) {
      return NextResponse.json({ error: check.error }, { status: 401 });
    }

    const data = await request.json();

    // Get the highest order number
    const maxOrder = await prisma.gridTile.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newTile = await prisma.gridTile.create({
      data: {
        title: data.title,
        caption: data.caption || null,
        href: data.href,
        backgroundUrl: data.backgroundUrl,
        colSpan: data.colSpan || 2,
        rowSpan: data.rowSpan || 1,
        colStart: data.colStart || 1,
        rowStart: data.rowStart || 1,
        overlayType: data.overlayType || "DARK",
        overlayColor: data.overlayColor || null,
        overlayOpacity: data.overlayOpacity ?? 60,
        order: (maxOrder?.order || 0) + 1,
        published: data.published ?? true,
      },
    });

    return NextResponse.json(newTile);
  } catch (error) {
    console.error("Error creating grid tile:", error);
    return NextResponse.json(
      { error: "Failed to create grid tile" },
      { status: 500 },
    );
  }
}
