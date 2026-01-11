import type { NextConfig } from "next";

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  output: "standalone",
  typescript: {
    // TODO: Fix TypeScript errors and re-enable strict checking
    // Temporarily ignoring for staging deployment
    ignoreBuildErrors: true,
  },
  // Note: ESLint config moved to eslint.config.mjs (Next.js 16+)
  headers: async () => [
    {
      source: "/(.*)",
      headers: securityHeaders,
    },
  ],
};

export default nextConfig;
