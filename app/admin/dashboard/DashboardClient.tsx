'use client';

import { Session } from 'next-auth';
import { motion } from 'framer-motion';
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { Grid3x3, FileText, Navigation, Image as ImageIcon, Settings, BarChart, Palette, Users, Store } from "lucide-react";
import { hasPermission, parsePermissions, DashboardFeature } from "@/types/permissions";
import { useMemo } from "react";

interface DashboardClientProps {
  session: Session;
}

// Feature configuration with permission requirement
interface FeatureConfig {
  Icon: React.ComponentType<{ className?: string }>;
  name: string;
  description: string;
  href: string;
  cta: string;
  background: React.ReactNode;
  permission: DashboardFeature | "admin-only" | "all";
  // Priority for layout (higher = more important = bigger card)
  priority: number;
}

const allFeatures: FeatureConfig[] = [
  {
    Icon: Grid3x3,
    name: "Gestionnaire de Grille",
    description: "Gérez les tuiles de votre grille avec glisser-déposer. Contrôlez la mise en page, les images et le contenu.",
    href: "/admin/dashboard/grid",
    cta: "Ouvrir le Gestionnaire",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
    ),
    permission: "grid",
    priority: 3,
  },
  {
    Icon: FileText,
    name: "Pages & Contenu",
    description: "Créez et modifiez des pages, gérez les sections de contenu et configurez les mises en page.",
    href: "/admin/dashboard/pages",
    cta: "Gérer les Pages",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />
    ),
    permission: "pages",
    priority: 3,
  },
  {
    Icon: Navigation,
    name: "Navigation",
    description: "Configurez la navigation du site, les menus et la structure de routage.",
    href: "/admin/dashboard/navigation",
    cta: "Configurer",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
    ),
    permission: "navigation",
    priority: 1,
  },
  {
    Icon: ImageIcon,
    name: "Bibliothèque Média",
    description: "Téléchargez, organisez et gérez vos images et fichiers multimédias.",
    href: "/admin/dashboard/media",
    cta: "Parcourir",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />
    ),
    permission: "media",
    priority: 2,
  },
  {
    Icon: BarChart,
    name: "Analytiques",
    description: "Consultez les statistiques du site, l'analyse du trafic et les indicateurs de performance.",
    href: "/admin/dashboard/analytics",
    cta: "Voir les Stats",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
    ),
    permission: "analytics",
    priority: 2,
  },
  {
    Icon: Store,
    name: "Boutiques",
    description: "Gérez les informations des boutiques, horaires d'ouverture et coordonnées.",
    href: "/admin/dashboard/stores",
    cta: "Gérer les Boutiques",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />
    ),
    permission: "stores",
    priority: 1,
  },
  {
    Icon: Palette,
    name: "Apparence",
    description: "Personnalisez l'apparence du site, les couleurs et les styles visuels.",
    href: "/admin/dashboard/apparence",
    cta: "Personnaliser",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
    ),
    permission: "apparence",
    priority: 1,
  },
  {
    Icon: Users,
    name: "Utilisateurs",
    description: "Gérez les comptes utilisateurs, les rôles et les permissions d'accès.",
    href: "/admin/dashboard/users",
    cta: "Gérer les Utilisateurs",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />
    ),
    permission: "admin-only",
    priority: 2,
  },
  {
    Icon: Settings,
    name: "Paramètres",
    description: "Configurez les paramètres généraux du site et les options système.",
    href: "/admin/dashboard/settings",
    cta: "Configurer",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
    ),
    permission: "admin-only",
    priority: 1,
  },
];

// Bento-style layout patterns for different item counts
// Creates asymmetric, visually interesting layouts that fit in viewport
function getBentoLayout(itemCount: number): { classes: string[]; rows: string; gridClass: string } {
  switch (itemCount) {
    case 1:
      // 1 item: Full width, centered
      return {
        classes: ["lg:col-span-3 lg:row-span-2"],
        rows: "lg:grid-rows-2",
        gridClass: "lg:h-[calc(100vh-10rem)]",
      };
    case 2:
      // 2 items: Large left (2/3), tall right (1/3)
      return {
        classes: [
          "lg:col-span-2 lg:row-span-2",  // Large left
          "lg:col-span-1 lg:row-span-2",  // Tall right
        ],
        rows: "lg:grid-rows-2",
        gridClass: "lg:h-[calc(100vh-10rem)]",
      };
    case 3:
      // 3 items: Tall left, stacked right
      return {
        classes: [
          "lg:col-span-1 lg:row-span-2",  // Tall left
          "lg:col-span-2 lg:row-span-1",  // Wide top right
          "lg:col-span-2 lg:row-span-1",  // Wide bottom right
        ],
        rows: "lg:grid-rows-2",
        gridClass: "lg:h-[calc(100vh-10rem)]",
      };
    case 4:
      // 4 items: Large featured + 3 small around
      return {
        classes: [
          "lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:row-end-3",  // Large top-left (2x2)
          "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",  // Small top-right
          "lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-3",  // Small bottom-right
          "lg:col-start-1 lg:col-end-4 lg:row-start-3 lg:row-end-4",  // Wide bottom
        ],
        rows: "lg:grid-rows-3",
        gridClass: "lg:h-[calc(100vh-10rem)]",
      };
    case 5:
      // 5 items: 2 tall pillars + 3 stacked between
      return {
        classes: [
          "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",  // Tall left
          "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2",  // Top mid
          "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-3",  // Tall right
          "lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-3",  // Bottom mid
          "lg:col-start-1 lg:col-end-4 lg:row-start-3 lg:row-end-4",  // Wide bottom
        ],
        rows: "lg:grid-rows-3",
        gridClass: "lg:h-[calc(100vh-10rem)]",
      };
    case 6:
      // 6 items: 2 tall + 4 small in grid
      return {
        classes: [
          "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",  // Tall left
          "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2",  // Top mid
          "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",  // Top right
          "lg:col-start-2 lg:col-end-4 lg:row-start-2 lg:row-end-3",  // Wide mid-right
          "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",  // Bottom left
          "lg:col-start-2 lg:col-end-4 lg:row-start-3 lg:row-end-4",  // Wide bottom right
        ],
        rows: "lg:grid-rows-3",
        gridClass: "lg:h-[calc(100vh-10rem)]",
      };
    case 7:
      // 7 items: Featured large + tall + small mix
      return {
        classes: [
          "lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:row-end-3",  // Large featured (2x2)
          "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",  // Top right
          "lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-4",  // Tall right
          "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",  // Bottom left
          "lg:col-start-2 lg:col-end-3 lg:row-start-3 lg:row-end-4",  // Bottom mid
          "lg:col-start-1 lg:col-end-2 lg:row-start-4 lg:row-end-5",  // Row 4 left
          "lg:col-start-2 lg:col-end-4 lg:row-start-4 lg:row-end-5",  // Row 4 wide right
        ],
        rows: "lg:grid-rows-4",
        gridClass: "lg:h-[calc(100vh-10rem)]",
      };
    case 8:
      // 8 items: Asymmetric mix with 2 tall and varied sizes
      return {
        classes: [
          "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",  // Tall left
          "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2",  // Top mid
          "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-3",  // Tall right
          "lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-4",  // Tall center (overlaps)
          "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",  // Bottom left
          "lg:col-start-3 lg:col-end-4 lg:row-start-3 lg:row-end-4",  // Bottom right
          "lg:col-start-1 lg:col-end-2 lg:row-start-4 lg:row-end-5",  // Row 4 left
          "lg:col-start-2 lg:col-end-4 lg:row-start-4 lg:row-end-5",  // Row 4 wide
        ],
        rows: "lg:grid-rows-4",
        gridClass: "lg:h-[calc(100vh-10rem)]",
      };
    case 9:
    default:
      // 9 items - Chaotic but organized bento style
      // 3 tall pillars with items stacked between and below
      return {
        classes: [
          "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",  // Grille - TALL left (2 rows)
          "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2",  // Pages - top mid
          "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-3",  // Navigation - TALL right (2 rows)
          "lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-4",  // Média - TALL mid (2 rows)
          "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",  // Analytics - bottom left
          "lg:col-start-3 lg:col-end-4 lg:row-start-3 lg:row-end-4",  // Boutiques - bottom right
          "lg:col-start-1 lg:col-end-2 lg:row-start-4 lg:row-end-5",  // Apparence - row 4 left
          "lg:col-start-2 lg:col-end-3 lg:row-start-4 lg:row-end-5",  // Users - row 4 mid
          "lg:col-start-3 lg:col-end-4 lg:row-start-4 lg:row-end-5",  // Settings - row 4 right
        ],
        rows: "lg:grid-rows-4",
        gridClass: "lg:h-[calc(100vh-10rem)]",
      };
  }
}

export default function DashboardClient({ session }: DashboardClientProps) {
  const userRole = session.user?.role as "ADMIN" | "WEBMASTER";
  const userPermissions = parsePermissions(session.user?.permissions);
  
  // Filter features based on user permissions
  const visibleFeatures = useMemo(() => {
    return allFeatures.filter((feature) => {
      if (feature.permission === "all") {
        return true;
      }
      if (feature.permission === "admin-only") {
        return userRole === "ADMIN";
      }
      return hasPermission(userRole, userPermissions, feature.permission);
    });
  }, [userRole, userPermissions]);
  
  // Get bento layout based on visible feature count
  const layout = useMemo(() => {
    return getBentoLayout(visibleFeatures.length);
  }, [visibleFeatures.length]);

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6 lg:h-full lg:flex lg:flex-col">
        {/* Welcome Section - Compact on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 lg:mb-6 flex-shrink-0"
        >
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
            Bienvenue, {session.user?.name || 'Admin'}
          </h2>
          <p className="text-gray-600 text-sm lg:text-base">
            Votre système de gestion de contenu est prêt
          </p>
        </motion.div>

        {/* Bento Grid - Fills remaining space on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex-1 lg:min-h-0"
        >
          <BentoGrid className={`${layout.rows} ${layout.gridClass}`}>
            {visibleFeatures.map((feature, index) => (
              <BentoCard 
                key={feature.name} 
                Icon={feature.Icon}
                name={feature.name}
                description={feature.description}
                href={feature.href}
                cta={feature.cta}
                background={feature.background}
                className={layout.classes[index] || "lg:col-span-1"}
              />
            ))}
          </BentoGrid>
        </motion.div>
      </main>
    </div>
  );
}
