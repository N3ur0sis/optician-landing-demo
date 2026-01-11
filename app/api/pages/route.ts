import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET all pages (with optional filtering)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    const includeBlocks = searchParams.get('includeBlocks') === 'true';
    const includeDeleted = searchParams.get('includeDeleted') === 'true';
    const onlyDeleted = searchParams.get('onlyDeleted') === 'true';
    
    const where: Record<string, unknown> = {};
    
    // Filter by published status
    if (published !== null) {
      where.published = published === 'true';
    }
    
    // Filter by deletion status
    if (onlyDeleted) {
      where.deletedAt = { not: null };
    } else if (!includeDeleted) {
      where.deletedAt = null;
    }
    
    const pages = await prisma.page.findMany({
      where,
      include: {
        blocks: includeBlocks ? {
          orderBy: { order: 'asc' },
          where: { visible: true },
        } : false,
      },
      orderBy: [
        { navOrder: 'asc' },
        { title: 'asc' },
      ],
    });
    
    return NextResponse.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}

// POST create a new page
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      title, 
      slug, 
      metaTitle, 
      metaDescription, 
      template = 'default',
      backgroundColor = '#000000',
      textColor = '#ffffff',
      showInNav = true,
      navOrder = 0,
      navLabel,
      parentSlug,
      blocks = [],
    } = body;

    // Validate required fields
    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Title and slug are required' }, 
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPage = await prisma.page.findUnique({
      where: { slug },
    });

    if (existingPage) {
      return NextResponse.json(
        { error: 'A page with this slug already exists' }, 
        { status: 400 }
      );
    }

    // Create page with blocks
    const page = await prisma.page.create({
      data: {
        title,
        slug: slug.startsWith('/') ? slug : `/${slug}`,
        metaTitle,
        metaDescription,
        template,
        backgroundColor,
        textColor,
        showInNav,
        navOrder,
        navLabel,
        parentSlug,
        published: false,
        blocks: {
          create: blocks.map((block: Record<string, unknown>, index: number) => ({
            type: block.type,
            order: index,
            content: block.content || {},
            settings: block.settings || {},
            styles: block.styles || {},
            visible: block.visible ?? true,
          })),
        },
      },
      include: {
        blocks: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}
