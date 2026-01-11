import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// Helper to find page by slug, trying both with and without leading slash
async function findPageBySlug(slug: string) {
  const decodedSlug = decodeURIComponent(slug);
  const normalizedSlug = decodedSlug.replace(/^\//, ''); // Remove leading slash if present
  
  // Try without leading slash first (new format)
  let page = await prisma.page.findUnique({
    where: { slug: normalizedSlug },
    select: { id: true },
  });
  
  // Fallback: try with leading slash (legacy format)
  if (!page) {
    page = await prisma.page.findUnique({
      where: { slug: `/${normalizedSlug}` },
      select: { id: true },
    });
  }
  
  return page;
}

// GET all revisions for a page
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Find the page first
    const page = await findPageBySlug(slug);

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Get revisions
    const [revisions, total] = await Promise.all([
      prisma.pageRevision.findMany({
        where: { pageId: page.id },
        orderBy: { version: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          version: true,
          title: true,
          createdAt: true,
          createdBy: true,
          changeNote: true,
          published: true,
        },
      }),
      prisma.pageRevision.count({
        where: { pageId: page.id },
      }),
    ]);

    return NextResponse.json({
      revisions,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching revisions:', error);
    return NextResponse.json({ error: 'Failed to fetch revisions' }, { status: 500 });
  }
}

// POST create a manual revision snapshot
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    
    const body = await request.json();
    const { changeNote } = body;

    // Get the page with blocks using the helper
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

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Get the latest version number
    const latestRevision = await prisma.pageRevision.findFirst({
      where: { pageId: page.id },
      orderBy: { version: 'desc' },
    });
    const nextVersion = (latestRevision?.version || 0) + 1;

    // Create the revision
    const revision = await prisma.pageRevision.create({
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
        changeNote: changeNote || 'Snapshot manuel',
      },
    });

    return NextResponse.json(revision, { status: 201 });
  } catch (error) {
    console.error('Error creating revision:', error);
    return NextResponse.json({ error: 'Failed to create revision' }, { status: 500 });
  }
}
