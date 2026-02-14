import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Optique de Bourbon - Opticien Français | Eyewear Premium",
  description: "Optique de Bourbon - Découvrez nos collections premium de lunettes. Plus de 40 ans d'expérience, 14 boutiques, +200 collaborateurs. Votre vision notre priorité.",
  keywords: "optique, lunettes, opticien, optique de bourbon, vue, verres, lunettes soleil",
};

import ClientLayout from "./ClientLayout";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
