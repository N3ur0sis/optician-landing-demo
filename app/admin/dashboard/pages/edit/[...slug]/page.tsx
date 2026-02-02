import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import PageBuilderEditor from "../../PageBuilderEditor";
import { Page, PageBlock } from "@/types/page-builder";

interface EditPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function EditPagePage({ params }: EditPageProps) {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  const { slug: slugParts } = await params;
  const slug = slugParts.join("/");

  // Try to find the page by slug (without leading slash)
  let page = await prisma.page.findUnique({
    where: { slug },
    include: {
      blocks: {
        orderBy: { order: "asc" },
      },
    },
  });

  // If not found, try with leading slash for backward compatibility
  if (!page) {
    page = await prisma.page.findUnique({
      where: { slug: `/${slug}` },
      include: {
        blocks: {
          orderBy: { order: "asc" },
        },
      },
    });
  }

  if (!page) {
    notFound();
  }

  // Convert Prisma data to our Page type
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
    // Navbar title settings
    showNavbarTitle: page.showNavbarTitle,
    navbarTitle: page.navbarTitle ?? undefined,
    navbarSubtitle: page.navbarSubtitle ?? undefined,
    // Navigation settings
    showInNav: page.showInNav,
    navOrder: page.navOrder,
    navLabel: page.navLabel ?? undefined,
    parentSlug: page.parentSlug ?? undefined,
    createdAt: page.createdAt,
    updatedAt: page.updatedAt,
    blocks: page.blocks.map(
      (block): PageBlock => ({
        id: block.id,
        pageId: block.pageId,
        type: block.type as PageBlock["type"],
        order: block.order,
        content: block.content as Record<string, unknown>,
        settings: block.settings as PageBlock["settings"],
        styles: block.styles as PageBlock["styles"],
        visible: block.visible,
        createdAt: block.createdAt,
        updatedAt: block.updatedAt,
      }),
    ),
  };

  return <PageBuilderEditor page={pageData} />;
}
