import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import DynamicPageRenderer from '@/components/page-builder/DynamicPageRenderer';
import { Page, PageBlock } from '@/types/page-builder';

interface DynamicPageProps {
  params: Promise<{ slug: string[] }>;
}

// Generate metadata from page data
export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const slugPath = slug.join('/');
  const slugWithSlash = '/' + slugPath;
  
  // Try both slug formats
  let page = await prisma.page.findUnique({
    where: { slug: slugPath },
    select: {
      title: true,
      metaTitle: true,
      metaDescription: true,
    },
  });

  if (!page) {
    page = await prisma.page.findUnique({
      where: { slug: slugWithSlash },
      select: {
        title: true,
        metaTitle: true,
        metaDescription: true,
      },
    });
  }

  if (!page) {
    return {
      title: 'Page non trouvée',
    };
  }

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || undefined,
  };
}

// Dynamic rendering - pages are generated on-demand
// This allows the app to be built without database connection
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export default async function DynamicPage({ params }: DynamicPageProps) {
  const { slug } = await params;
  const slugPath = slug.join('/');
  const slugWithSlash = '/' + slugPath;

  // First check if this is a known static route that should be handled by existing pages
  const staticRoutes = [
    '/admin',
    '/api',
  ];
  
  if (staticRoutes.some(route => slugWithSlash.startsWith(route))) {
    notFound();
  }

  // Try to find page with both slug formats (with and without leading slash)
  let page = await prisma.page.findUnique({
    where: { slug: slugPath },
    include: {
      blocks: {
        where: { visible: true },
        orderBy: { order: 'asc' },
      },
    },
  });

  // Fallback: try with leading slash
  if (!page) {
    page = await prisma.page.findUnique({
      where: { slug: slugWithSlash },
      include: {
        blocks: {
          where: { visible: true },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  // If no page found in DB, return 404
  if (!page) {
    notFound();
  }

  // If page is not published and we're not in preview mode, return 404
  if (!page.published) {
    notFound();
  }

  // Convert to our Page type
  const pageData: Page = {
    id: page.id,
    slug: page.slug,
    title: page.title,
    metaTitle: page.metaTitle ?? undefined,
    metaDescription: page.metaDescription ?? undefined,
    published: page.published,
    publishedAt: page.publishedAt ?? undefined,
    template: page.template,
    backgroundColor: page.backgroundColor,
    textColor: page.textColor,
    customCSS: page.customCSS ?? undefined,
    showInNav: page.showInNav,
    navOrder: page.navOrder,
    navLabel: page.navLabel ?? undefined,
    parentSlug: page.parentSlug ?? undefined,
    createdAt: page.createdAt,
    updatedAt: page.updatedAt,
    blocks: page.blocks.map((block): PageBlock => ({
      id: block.id,
      pageId: block.pageId,
      type: block.type as PageBlock['type'],
      order: block.order,
      content: block.content as Record<string, unknown>,
      settings: block.settings as PageBlock['settings'],
      styles: block.styles as PageBlock['styles'],
      visible: block.visible,
      createdAt: block.createdAt,
      updatedAt: block.updatedAt,
    })),
  };

  return <DynamicPageRenderer page={pageData} />;
}
