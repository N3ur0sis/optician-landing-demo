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
    href: "#",
    cta: "Bientôt Disponible",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: Navigation,
    name: "Navigation",
    description: "Configurez la navigation du site, les menus et la structure de routage.",
    href: "#",
    cta: "Bientôt Disponible",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: ImageIcon,
    name: "Bibliothèque Média",
    description: "Téléchargez, organisez et gérez vos images et fichiers multimédias.",
    href: "#",
    cta: "Bientôt Disponible",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: BarChart,
    name: "Analytiques",
    description: "Consultez les statistiques du site, l'analyse du trafic et les indicateurs de performance.",
    href: "#",
    cta: "Bientôt Disponible",
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
          <p className="text-gray-500">
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

        {/* Old Stats Grid - Hidden */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="hidden grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">8</p>
            <p className="text-sm text-gray-600">Active Pages</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">24</p>
            <p className="text-sm text-gray-600">Media Files</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">15</p>
            <p className="text-sm text-gray-600">Content Sections</p>
          </div>
        </motion.div>

        {/* Quick Actions - Hidden, replaced by Bento Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="hidden mb-12"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="/admin/dashboard/grid"
              className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                Grid Manager
              </h4>
              <p className="text-sm text-gray-600">
                Manage landing page grid tiles with drag & drop
              </p>
            </a>

            <div className="bg-white rounded-xl p-6 border border-gray-200 opacity-50 cursor-not-allowed">
              <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Page Manager
              </h4>
              <p className="text-sm text-gray-600">
                Coming soon - Manage pages and sections
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 opacity-50 cursor-not-allowed">
              <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Navigation Manager
              </h4>
              <p className="text-sm text-gray-600">
                Coming soon - Configure site navigation
              </p>
            </div>
          </div>
        </motion.div>

        {/* Feature Overview - Hidden, replaced by Bento Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 text-white"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">
                CMS Features
              </h3>
              <p className="text-white/80 mb-4">
                Full content management capabilities being built:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-white/80">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Grid tile management (Active)
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Page builder with sections
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Navigation editor
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Media library
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
