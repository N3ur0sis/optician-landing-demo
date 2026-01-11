import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://optiquedebourbon.re"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/_next/",
          "/private/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
