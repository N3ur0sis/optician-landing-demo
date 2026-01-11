import { MetadataRoute } from "next"
import prisma from "@/lib/prisma"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://optiquedebourbon.re"

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/maison`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/magasins`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/collections/createurs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/rendez-vous`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/magazine`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ]

  // Dynamic CMS pages
  let cmsPages: MetadataRoute.Sitemap = []
  
  try {
    const pages: Array<{ slug: string; updatedAt: Date }> = await prisma.page.findMany({
      where: {
        published: true,
        deletedAt: null,
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    cmsPages = pages.map((page: { slug: string; updatedAt: Date }) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: page.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
  } catch (error) {
    console.error("Error fetching CMS pages for sitemap:", error)
  }

  // Store pages
  const storePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/magasins/reunion`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/magasins/maurice`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]

  return [...staticPages, ...storePages, ...cmsPages]
}
