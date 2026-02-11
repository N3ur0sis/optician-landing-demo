import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { hasPermission, parsePermissions } from '@/types/permissions';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// Helper to check pages permission
async function checkPagesPermission() {
  const session = await auth();
  if (!session) {
    return { authorized: false, error: "Unauthorized" };
  }
  
  const role = session.user?.role as "ADMIN" | "WEBMASTER";
  const permissions = parsePermissions(session.user?.permissions);
  
  if (!hasPermission(role, permissions, "pages")) {
    return { authorized: false, error: "Permission denied" };
  }
  
  return { authorized: true, session };
}

// Helper to find page by slug, trying both with and without leading slash
async function findPageBySlug(slug: string, includeBlocks: true): Promise<(Awaited<ReturnType<typeof prisma.page.findUnique>> & { blocks: Awaited<ReturnType<typeof prisma.pageBlock.findMany>> }) | null>;
async function findPageBySlug(slug: string, includeBlocks?: false): Promise<Awaited<ReturnType<typeof prisma.page.findUnique>>>;
async function findPageBySlug(slug: string, includeBlocks = false) {
  const decodedSlug = decodeURIComponent(slug);
  const normalizedSlug = decodedSlug.replace(/^\//, ''); // Remove leading slash if present
  
  const includeOptions = includeBlocks ? {
    blocks: {
      orderBy: { order: 'asc' as const },
    },
  } : undefined;
  
  // Try without leading slash first (new format)
  let page = await prisma.page.findUnique({
    where: { slug: normalizedSlug },
    include: includeOptions,
  });
  
  // Fallback: try with leading slash (legacy format)
  if (!page) {
    page = await prisma.page.findUnique({
      where: { slug: `/${normalizedSlug}` },
      include: includeOptions,
    });
  }
  
  return page;
}

// GET a single page by slug
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    
    const { searchParams } = new URL(request.url);
    const includeDeleted = searchParams.get('includeDeleted') === 'true';
    
    const page = await findPageBySlug(slug, true);

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    
    // Don't return soft-deleted pages unless explicitly requested
    if (page.deletedAt && !includeDeleted) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
}

// PUT update a page
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const check = await checkPagesPermission();
    if (!check.authorized) {
      return NextResponse.json({ error: check.error }, { status: 401 });
    }

    const { slug } = await params;
    
    const body = await request.json();
    const {
      title,
      newSlug,
      slug: bodySlug, // Also capture slug from body for backward compatibility
      metaTitle,
      metaDescription,
      template,
      backgroundColor,
      textColor,
      customCSS,
      showNavbarTitle,
      navbarTitle,
      navbarSubtitle,
      showInNav,
      navOrder,
      navLabel,
      parentSlug,
      published,
      blocks,
      createRevision = true, // Auto-create revision by default
      changeNote,
    } = body;
    
    // Determine the intended new slug (prefer newSlug over bodySlug)
    const intendedNewSlug = newSlug || bodySlug;

    // Check if page exists (including soft-deleted for recovery)
    const existingPage = await findPageBySlug(slug, true);

    if (!existingPage) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Check if this is the protected homepage
    const normalizedExistingSlug = existingPage.slug.replace(/^\//, '').toLowerCase();
    const isHomePage = normalizedExistingSlug === '' || normalizedExistingSlug === 'accueil' || normalizedExistingSlug === 'home';

    // Protect homepage: block content/block modifications (but allow SEO updates)
    if (isHomePage && blocks) {
      return NextResponse.json(
        { error: 'Le contenu de la page d\'accueil est géré via le Gestionnaire de Grille' },
        { status: 403 }
      );
    }

    // Protect homepage slug from being changed
    if (isHomePage && intendedNewSlug) {
      const normalizedNewSlug = intendedNewSlug.replace(/^\//, '').toLowerCase();
      if (normalizedNewSlug !== normalizedExistingSlug) {
        return NextResponse.json(
          { error: 'Le slug de la page d\'accueil ne peut pas être modifié' },
          { status: 403 }
        );
      }
    }

    // If slug is changing, check for conflicts
    // Exclude soft-deleted pages from conflict check
    if (intendedNewSlug) {
      const normalizedNewSlug = intendedNewSlug.replace(/^\//, '');
      if (normalizedNewSlug !== existingPage.slug.replace(/^\//, '')) {
        const slugConflict = await prisma.page.findFirst({
          where: {
            deletedAt: null,
            OR: [
              { slug: normalizedNewSlug },
              { slug: `/${normalizedNewSlug}` },
            ],
          },
        });
        if (slugConflict) {
          return NextResponse.json(
            { error: 'A page with this slug already exists' },
            { status: 400 }
          );
        }
      }
    }

    // Update page in a transaction
    const updatedPage = await prisma.$transaction(async (tx) => {
      // Create a revision of the CURRENT state before updating (if enabled)
      if (createRevision) {
        // Get the latest version number
        const latestRevision = await tx.pageRevision.findFirst({
          where: { pageId: existingPage.id },
          orderBy: { version: 'desc' },
        });
        const nextVersion = (latestRevision?.version || 0) + 1;
        
        await tx.pageRevision.create({
          data: {
            pageId: existingPage.id,
            version: nextVersion,
            title: existingPage.title,
            slug: existingPage.slug,
            metaTitle: existingPage.metaTitle,
            metaDescription: existingPage.metaDescription,
            template: existingPage.template,
            backgroundColor: existingPage.backgroundColor,
            textColor: existingPage.textColor,
            customCSS: existingPage.customCSS,
            published: existingPage.published,
            showInNav: existingPage.showInNav,
            navOrder: existingPage.navOrder,
            navLabel: existingPage.navLabel,
            parentSlug: existingPage.parentSlug,
            blocksSnapshot: existingPage.blocks as object[],
            createdBy: check.session?.user?.id,
            changeNote: changeNote || null,
          },
        });
      }
      
      // If blocks are provided, delete existing and create new ones
      if (blocks) {
        await tx.pageBlock.deleteMany({
          where: { pageId: existingPage.id },
        });

        await tx.pageBlock.createMany({
          data: blocks.map((block: Record<string, unknown>, index: number) => ({
            pageId: existingPage.id,
            type: block.type as string,
            order: index,
            content: block.content || {},
            settings: block.settings || {},
            styles: block.styles || {},
            visible: block.visible ?? true,
          })),
        });
      }

      // Normalize the new slug (remove leading slash)
      const finalSlug = intendedNewSlug ? intendedNewSlug.replace(/^\//, '') : existingPage.slug;

      // Update page metadata
      const page = await tx.page.update({
        where: { id: existingPage.id },
        data: {
          title: title ?? existingPage.title,
          slug: finalSlug,
          metaTitle: metaTitle !== undefined ? metaTitle : existingPage.metaTitle,
          metaDescription: metaDescription !== undefined ? metaDescription : existingPage.metaDescription,
          template: template ?? existingPage.template,
          backgroundColor: backgroundColor ?? existingPage.backgroundColor,
          textColor: textColor ?? existingPage.textColor,
          customCSS: customCSS !== undefined ? customCSS : existingPage.customCSS,
          showNavbarTitle: showNavbarTitle ?? existingPage.showNavbarTitle,
          navbarTitle: navbarTitle !== undefined ? navbarTitle : existingPage.navbarTitle,
          navbarSubtitle: navbarSubtitle !== undefined ? navbarSubtitle : existingPage.navbarSubtitle,
          showInNav: showInNav ?? existingPage.showInNav,
          navOrder: navOrder ?? existingPage.navOrder,
          navLabel: navLabel !== undefined ? navLabel : existingPage.navLabel,
          parentSlug: parentSlug !== undefined ? parentSlug : existingPage.parentSlug,
          published: published ?? existingPage.published,
          publishedAt: published && !existingPage.published ? new Date() : existingPage.publishedAt,
        },
        include: {
          blocks: {
            orderBy: { order: 'asc' },
          },
        },
      });

      return page;
    });

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
}

// DELETE a page (soft delete by default, permanent with ?permanent=true)
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const check = await checkPagesPermission();
    if (!check.authorized) {
      return NextResponse.json({ error: check.error }, { status: 401 });
    }

    const { slug } = await params;
    
    const { searchParams } = new URL(request.url);
    const permanent = searchParams.get('permanent') === 'true';

    // Check if page exists
    const existingPage = await findPageBySlug(slug, false);

    if (!existingPage) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Protect homepage from deletion
    const normalizedSlug = existingPage.slug.replace(/^\//, '').toLowerCase();
    if (normalizedSlug === '' || normalizedSlug === '/' || normalizedSlug === 'accueil') {
      return NextResponse.json(
        { error: 'La page d\'accueil ne peut pas être supprimée' }, 
        { status: 403 }
      );
    }

    if (permanent) {
      // Permanent delete - cascade deletes blocks and revisions
      await prisma.page.delete({
        where: { id: existingPage.id },
      });
      return NextResponse.json({ success: true, permanent: true });
    } else {
      // Soft delete - set deletedAt timestamp
      const deletedPage = await prisma.page.update({
        where: { id: existingPage.id },
        data: {
          deletedAt: new Date(),
          showInNav: false, // Remove from navigation
        },
      });
      return NextResponse.json({ success: true, page: deletedPage });
    }
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}

// PATCH - partial update (for publish/unpublish, reorder, restore, etc.)
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const check = await checkPagesPermission();
    if (!check.authorized) {
      return NextResponse.json({ error: check.error }, { status: 401 });
    }

    const { slug } = await params;
    
    const body = await request.json();

    const existingPage = await findPageBySlug(slug, false);

    if (!existingPage) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    
    // Restore from trash
    if (body.restore === true) {
      // Check if another active page has taken this slug
      const slugConflict = await prisma.page.findFirst({
        where: {
          deletedAt: null,
          id: { not: existingPage.id },
          OR: [
            { slug: existingPage.slug },
            { slug: existingPage.slug.replace(/^\//, '') },
            { slug: `/${existingPage.slug.replace(/^\//, '')}` },
          ],
        },
      });
      
      if (slugConflict) {
        return NextResponse.json(
          { error: 'Impossible de restaurer: une autre page utilise déjà ce slug' },
          { status: 400 }
        );
      }
      
      updateData.deletedAt = null;
    }
    
    if (body.published !== undefined) {
      updateData.published = body.published;
      if (body.published && !existingPage.published) {
        updateData.publishedAt = new Date();
      }
    }
    
    if (body.navOrder !== undefined) {
      updateData.navOrder = body.navOrder;
    }

    if (body.showInNav !== undefined) {
      updateData.showInNav = body.showInNav;
    }

    const page = await prisma.page.update({
      where: { id: existingPage.id },
      data: updateData,
      include: {
        blocks: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error patching page:', error);
    return NextResponse.json({ error: 'Failed to patch page' }, { status: 500 });
  }
}
