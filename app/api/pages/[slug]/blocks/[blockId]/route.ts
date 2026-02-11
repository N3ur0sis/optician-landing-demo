import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { hasPermission, parsePermissions } from '@/types/permissions';

// Helper to check pages permission
async function checkPagesPermission() {
  const session = await auth();
  if (!session?.user) {
    return { authorized: false, error: "Unauthorized", status: 401 };
  }
  const role = session.user.role as "ADMIN" | "WEBMASTER";
  const permissions = parsePermissions(session.user.permissions);
  if (!hasPermission(role, permissions, "pages")) {
    return { authorized: false, error: "Permission denied", status: 403 };
  }
  return { authorized: true, session, status: 200 };
}

interface RouteParams {
  params: Promise<{ slug: string; blockId: string }>;
}

// GET a single block
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { blockId } = await params;
    
    const block = await prisma.pageBlock.findUnique({
      where: { id: blockId },
    });

    if (!block) {
      return NextResponse.json({ error: 'Block not found' }, { status: 404 });
    }

    return NextResponse.json(block);
  } catch (error) {
    console.error('Error fetching block:', error);
    return NextResponse.json({ error: 'Failed to fetch block' }, { status: 500 });
  }
}

// PUT update a block
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const check = await checkPagesPermission();
    if (!check.authorized) {
      return NextResponse.json({ error: check.error }, { status: check.status });
    }

    const { blockId } = await params;
    const body = await request.json();

    const existingBlock = await prisma.pageBlock.findUnique({
      where: { id: blockId },
    });

    if (!existingBlock) {
      return NextResponse.json({ error: 'Block not found' }, { status: 404 });
    }

    const { type, content, settings, styles, visible } = body;

    const block = await prisma.pageBlock.update({
      where: { id: blockId },
      data: {
        type: type ?? existingBlock.type,
        content: content !== undefined ? content : existingBlock.content,
        settings: settings !== undefined ? settings : existingBlock.settings,
        styles: styles !== undefined ? styles : existingBlock.styles,
        visible: visible ?? existingBlock.visible,
      },
    });

    return NextResponse.json(block);
  } catch (error) {
    console.error('Error updating block:', error);
    return NextResponse.json({ error: 'Failed to update block' }, { status: 500 });
  }
}

// DELETE a block
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const check = await checkPagesPermission();
    if (!check.authorized) {
      return NextResponse.json({ error: check.error }, { status: check.status });
    }

    const { blockId } = await params;

    const existingBlock = await prisma.pageBlock.findUnique({
      where: { id: blockId },
    });

    if (!existingBlock) {
      return NextResponse.json({ error: 'Block not found' }, { status: 404 });
    }

    // Delete the block
    await prisma.pageBlock.delete({
      where: { id: blockId },
    });

    // Reorder remaining blocks
    const remainingBlocks = await prisma.pageBlock.findMany({
      where: { pageId: existingBlock.pageId },
      orderBy: { order: 'asc' },
    });

    await prisma.$transaction(
      remainingBlocks.map((block, index) =>
        prisma.pageBlock.update({
          where: { id: block.id },
          data: { order: index },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting block:', error);
    return NextResponse.json({ error: 'Failed to delete block' }, { status: 500 });
  }
}

// PATCH - toggle visibility or quick update
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const check = await checkPagesPermission();
    if (!check.authorized) {
      return NextResponse.json({ error: check.error }, { status: check.status });
    }

    const { blockId } = await params;
    const body = await request.json();

    const existingBlock = await prisma.pageBlock.findUnique({
      where: { id: blockId },
    });

    if (!existingBlock) {
      return NextResponse.json({ error: 'Block not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    
    if (body.visible !== undefined) {
      updateData.visible = body.visible;
    }
    
    if (body.order !== undefined) {
      updateData.order = body.order;
    }

    const block = await prisma.pageBlock.update({
      where: { id: blockId },
      data: updateData,
    });

    return NextResponse.json(block);
  } catch (error) {
    console.error('Error patching block:', error);
    return NextResponse.json({ error: 'Failed to patch block' }, { status: 500 });
  }
}

// POST - duplicate a block
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const check = await checkPagesPermission();
    if (!check.authorized) {
      return NextResponse.json({ error: check.error }, { status: check.status });
    }

    const { blockId } = await params;

    const existingBlock = await prisma.pageBlock.findUnique({
      where: { id: blockId },
    });

    if (!existingBlock) {
      return NextResponse.json({ error: 'Block not found' }, { status: 404 });
    }

    // Shift blocks after current position
    await prisma.pageBlock.updateMany({
      where: {
        pageId: existingBlock.pageId,
        order: { gt: existingBlock.order },
      },
      data: {
        order: { increment: 1 },
      },
    });

    // Create duplicate
    const duplicateBlock = await prisma.pageBlock.create({
      data: {
        pageId: existingBlock.pageId,
        type: existingBlock.type,
        order: existingBlock.order + 1,
        content: existingBlock.content as object,
        settings: (existingBlock.settings as object) || undefined,
        styles: (existingBlock.styles as object) || undefined,
        visible: existingBlock.visible,
      },
    });

    return NextResponse.json(duplicateBlock, { status: 201 });
  } catch (error) {
    console.error('Error duplicating block:', error);
    return NextResponse.json({ error: 'Failed to duplicate block' }, { status: 500 });
  }
}
