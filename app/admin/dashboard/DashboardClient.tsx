'use client';

import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { FiLogOut, FiUser, FiGrid, FiSettings, FiFileText, FiImage } from 'react-icons/fi';
import LogoMark from '@/components/LogoMark';

interface DashboardClientProps {
  session: Session;
}

export default function DashboardClient({ session }: DashboardClientProps) {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/admin/login' });
  };

  const stats = [
    { label: 'Pages Actives', value: '8', icon: FiFileText },
    { label: 'Images', value: '24', icon: FiImage },
    { label: 'Sections', value: '15', icon: FiGrid },
  ];

  const quickActions = [
    { label: 'Gérer le Contenu', icon: FiGrid, href: '#', color: 'from-blue-500 to-blue-600' },
    { label: 'Médias', icon: FiImage, href: '#', color: 'from-purple-500 to-purple-600' },
    { label: 'Pages', icon: FiFileText, href: '#', color: 'from-green-500 to-green-600' },
    { label: 'Paramètres', icon: FiSettings, href: '#', color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <LogoMark className="w-8 h-8 text-[#d4af37]" />
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                <FiUser className="text-gray-400" />
                <div className="text-sm">
                  <p className="text-white font-medium">{session.user?.name || 'Admin'}</p>
                  <p className="text-gray-400 text-xs">{session.user?.email}</p>
                </div>
              </div>
              
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 transition-colors"
              >
                <FiLogOut />
                <span className="text-sm font-medium">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">
            Bienvenue, {session.user?.name || 'Admin'} 👋
          </h2>
          <p className="text-gray-400">
            Gérez et mettez à jour votre site web depuis ce tableau de bord
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className="bg-[#d4af37]/10 p-3 rounded-lg">
                  <stat.icon className="text-[#d4af37] text-2xl" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Actions Rapides</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`bg-gradient-to-br ${action.color} p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-shadow`}
              >
                <action.icon className="text-3xl mb-3" />
                <p className="font-semibold">{action.label}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Coming Soon Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-[#d4af37]/10 to-[#f4d47c]/10 backdrop-blur-xl rounded-xl p-8 border border-[#d4af37]/20"
        >
          <h3 className="text-2xl font-bold text-white mb-3">
            🚀 Fonctionnalités à venir
          </h3>
          <p className="text-gray-300 mb-4">
            Le système de gestion de contenu complet sera bientôt disponible avec :
          </p>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center gap-2">
              <span className="text-[#d4af37]">✓</span> 
              Éditeur de grille drag & drop pour la page d'accueil
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#d4af37]">✓</span> 
              Modification des textes, images et couleurs
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#d4af37]">✓</span> 
              Gestion des pages et sections
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#d4af37]">✓</span> 
              Bibliothèque de médias
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#d4af37]">✓</span> 
              Prévisualisation en temps réel
            </li>
          </ul>
        </motion.div>
      </main>
    </div>
  );
}
