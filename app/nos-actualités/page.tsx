'use client';

import PageNavigation from '../../components/PageNavigation';
import Footer from '../../components/Footer';
import { motion } from 'framer-motion';

const NosActualitesPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-900 to-black text-white">
      <PageNavigation title="Zinfos" subtitle="Nos actualités" />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: '36px 36px',
          }}
        />
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl sm:text-7xl font-bold mb-8 tracking-tight">
              Nos actualités
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Restez informé de nos dernières nouveautés et événements
            </p>
          </motion.div>
        </div>
      </section>

      {/* News Grid (placeholder) */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div
                  key={index}
                  className="group cursor-pointer"
                >
                  <div className="aspect-video bg-white/5 border border-white/10 mb-4 group-hover:border-white/30 transition-colors" />
                  <h3 className="text-xl font-bold mb-2 group-hover:text-white/80 transition-colors">
                    Actualité {index}
                  </h3>
                  <p className="text-sm text-white/60 mb-2">Date à définir</p>
                  <p className="text-white/50">
                    Texte de l'actualité à définir selon le document de recueil de contenus.
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-12 p-8 bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-sm text-white/50 italic">
                Note: Cette section nécessite un système de gestion d'actualités (CMS).
                Merci de fournir le contenu selon le document de recueil de contenus.
                Un slider peut être ajouté pour la page d'accueil selon les spécifications.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default NosActualitesPage;
