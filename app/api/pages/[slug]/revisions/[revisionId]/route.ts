import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { BlockType } from '@/prisma/generated/prisma/client';

interface RouteParams {
  params: Promise<{ slug: string; revisionId: string }>;
}

// Helper to find page by slug, trying both with and without leading slash
async function findPageBySlug(slug: string) {
  const decodedSlug = decodeURIComponent(slug);
  const normalizedSlug = decodedSlug.replace(/^\//, '');
  
  let page = await prisma.page.findUnique({
    where: { slug: normalizedSlug },
    include: {
      blocks: {
        orderBy: { order: 'asc' },
      },
    },
  });
  
  if (!page) {
    page = await prisma.page.findUnique({
      where: { slug: `/${normalizedSlug}` },
      include: {
        blocks: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }
  
  return page;
}

// GET a specific revision with full details
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug, revisionId } = await params;

    // Find the page first
    const page = await findPageBySlug(slug);

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Get the specific revision
    const revision = await prisma.pageRevision.findFirst({
      where: {
        id: revisionId,
        pageId: page.id,
      },
    });

    if (!revision) {
      return NextResponse.json({ error: 'Revision not found' }, { status: 404 });
    }

    return NextResponse.json(revision);
  } catch (error) {
    console.error('Error fetching revision:', error);
    return NextResponse.json({ error: 'Failed to fetch revision' }, { status: 500 });
  }
}

// POST restore a revision (copies revision data to current page)
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug, revisionId } = await params;

    // Find the page with current blocks
    const page = await findPageBySlug(slug);

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Get the revision to restore
    const revision = await prisma.pageRevision.findFirst({
      where: {
        id: revisionId,
        pageId: page.id,
      },
    });

    if (!revision) {
      return NextResponse.json({ error: 'Revision not found' }, { status: 404 });
    }

    // Restore in a transaction
    const restoredPage = await prisma.$transaction(async (tx) => {
      // First, create a revision of the CURRENT state before restoring
      const latestRevision = await tx.pageRevision.findFirst({
        where: { pageId: page.id },
        orderBy: { version: 'desc' },
      });
      const nextVersion = (latestRevision?.version || 0) + 1;
      
      await tx.pageRevision.create({
        data: {
          pageId: page.id,
          version: nextVersion,
          title: page.title,
          slug: page.slug,
          metaTitle: page.metaTitle,
          metaDescription: page.metaDescription,
          template: page.template,
          backgroundColor: page.backgroundColor,
          textColor: page.textColor,
          customCSS: page.customCSS,
          published: page.published,
          showInNav: page.showInNav,
          navOrder: page.navOrder,
          navLabel: page.navLabel,
          parentSlug: page.parentSlug,
          blocksSnapshot: page.blocks,
          createdBy: session.user?.id,
          changeNote: `Avant restauration de la version ${revision.version}`,
        },
      });

      // Delete current blocks
      await tx.pageBlock.deleteMany({
        where: { pageId: page.id },
      });

      // Restore blocks from revision
      const blocksToRestore = revision.blocksSnapshot as Array<{
        type: string;
        order: number;
        content: unknown;
        settings: unknown;
        styles: unknown;
        visible: boolean;
      }>;
      
      if (blocksToRestore && blocksToRestore.length > 0) {
        await tx.pageBlock.createMany({
          data: blocksToRestore.map((block, index) => ({
            pageId: page.id,
            type: block.type as BlockType,
            order: index,
            content: block.content || {},
            settings: block.settings || {},
            styles: block.styles || {},
            visible: block.visible ?? true,
          })),
        });
      }

      // Update page metadata from revision
      const updatedPage = await tx.page.update({
        where: { id: page.id },
        data: {
          title: revision.title,
          metaTitle: revision.metaTitle,
          metaDescription: revision.metaDescription,
          template: revision.template,
          backgroundColor: revision.backgroundColor,
          textColor: revision.textColor,
          customCSS: revision.customCSS,
          // Keep current navigation and publish settings
        },
        include: {
          blocks: {
            orderBy: { order: 'asc' },
          },
        },
      });

      return updatedPage;
    });

    return NextResponse.json({
      success: true,
      page: restoredPage,
      restoredFromVersion: revision.version,
    });
  } catch (error) {
    console.error('Error restoring revision:', error);
    return NextResponse.json({ error: 'Failed to restore revision' }, { status: 500 });
  }
}

// DELETE a revision (cleanup old revisions)
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug, revisionId } = await params;

    // Find the page first
    const page = await findPageBySlug(slug);

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Delete the revision
    await prisma.pageRevision.delete({
      where: {
        id: revisionId,
        pageId: page.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting revision:', error);
    return NextResponse.json({ error: 'Failed to delete revision' }, { status: 500 });
  }
}
