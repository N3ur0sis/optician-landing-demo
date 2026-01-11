'use client';

import { Session } from 'next-auth';
import { motion } from 'framer-motion';
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { Grid3x3, FileText, Navigation, Image as ImageIcon, Settings, BarChart } from "lucide-react";

interface DashboardClientProps {
  session: Session;
}

const features = [
  {
    Icon: Grid3x3,
    name: "Gestionnaire de Grille",
    description: "Gérez les tuiles de votre grille avec glisser-déposer. Contrôlez la mise en page, les images et le contenu.",
    href: "/admin/dashboard/grid",
    cta: "Ouvrir le Gestionnaire",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
    ),
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: FileText,
    name: "Pages & Contenu",
    description: "Créez et modifiez des pages, gérez les sections de contenu et configurez les mises en page.",
    href: "/admin/dashboard/pages",
    cta: "Gérer les Pages",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100" />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: Navigation,
    name: "Navigation",
    description: "Configurez la navigation du site, les menus et la structure de routage.",
    href: "/admin/dashboard/navigation",
    cta: "Configurer",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: ImageIcon,
    name: "Bibliothèque Média",
    description: "Téléchargez, organisez et gérez vos images et fichiers multimédias.",
    href: "/admin/dashboard/media",
    cta: "Parcourir",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: BarChart,
    name: "Analytiques",
    description: "Consultez les statistiques du site, l'analyse du trafic et les indicateurs de performance.",
    href: "/admin/dashboard/analytics",
    cta: "Voir les Stats",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

export default function DashboardClient({ session }: DashboardClientProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenue, {session.user?.name || 'Admin'}
          </h2>
          <p className="text-gray-600">
            Votre système de gestion de contenu est prêt
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <BentoGrid className="lg:grid-rows-3">
            {features.map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
        </motion.div>
      </main>
    </div>
  );
}
