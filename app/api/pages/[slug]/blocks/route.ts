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
  params: Promise<{ slug: string }>;
}

// GET blocks for a page
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const fullSlug = decodedSlug.startsWith('/') ? decodedSlug : `/${decodedSlug}`;
    
    const page = await prisma.page.findUnique({
      where: { slug: fullSlug },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    const blocks = await prisma.pageBlock.findMany({
      where: { pageId: page.id },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(blocks);
  } catch (error) {
    console.error('Error fetching blocks:', error);
    return NextResponse.json({ error: 'Failed to fetch blocks' }, { status: 500 });
  }
}

// POST add a new block to a page
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const check = await checkPagesPermission();
    if (!check.authorized) {
      return NextResponse.json({ error: check.error }, { status: check.status });
    }

    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const fullSlug = decodedSlug.startsWith('/') ? decodedSlug : `/${decodedSlug}`;
    
    const page = await prisma.page.findUnique({
      where: { slug: fullSlug },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    const body = await request.json();
    const { type, content = {}, settings = {}, styles = {}, insertAfter } = body;

    if (!type) {
      return NextResponse.json({ error: 'Block type is required' }, { status: 400 });
    }

    // Get current max order
    const maxOrderBlock = await prisma.pageBlock.findFirst({
      where: { pageId: page.id },
      orderBy: { order: 'desc' },
    });

    let newOrder = (maxOrderBlock?.order ?? -1) + 1;

    // If insertAfter is specified, insert after that block and reorder
    if (insertAfter) {
      const afterBlock = await prisma.pageBlock.findUnique({
        where: { id: insertAfter },
      });
      
      if (afterBlock) {
        newOrder = afterBlock.order + 1;
        
        // Shift all blocks after the insertion point
        await prisma.pageBlock.updateMany({
          where: {
            pageId: page.id,
            order: { gte: newOrder },
          },
          data: {
            order: { increment: 1 },
          },
        });
      }
    }

    const block = await prisma.pageBlock.create({
      data: {
        pageId: page.id,
        type,
        order: newOrder,
        content,
        settings,
        styles,
        visible: true,
      },
    });

    return NextResponse.json(block, { status: 201 });
  } catch (error) {
    console.error('Error creating block:', error);
    return NextResponse.json({ error: 'Failed to create block' }, { status: 500 });
  }
}

// PUT reorder blocks
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const check = await checkPagesPermission();
    if (!check.authorized) {
      return NextResponse.json({ error: check.error }, { status: check.status });
    }

    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const fullSlug = decodedSlug.startsWith('/') ? decodedSlug : `/${decodedSlug}`;
    
    const page = await prisma.page.findUnique({
      where: { slug: fullSlug },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    const body = await request.json();
    const { blockIds } = body;

    if (!Array.isArray(blockIds)) {
      return NextResponse.json(
        { error: 'blockIds array is required' },
        { status: 400 }
      );
    }

    // Update all block orders in a transaction
    await prisma.$transaction(
      blockIds.map((id: string, index: number) =>
        prisma.pageBlock.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    const blocks = await prisma.pageBlock.findMany({
      where: { pageId: page.id },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(blocks);
  } catch (error) {
    console.error('Error reordering blocks:', error);
    return NextResponse.json({ error: 'Failed to reorder blocks' }, { status: 500 });
  }
}
