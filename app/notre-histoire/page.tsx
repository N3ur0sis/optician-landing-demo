'use client';

import PageNavigation from '../../components/PageNavigation';
import Footer from '../../components/Footer';
import { motion } from 'framer-motion';

const NotreHistoirePage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-900 to-black text-white">
      <PageNavigation title="Qui sommes nous ?" subtitle="Notre histoire" />

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
              Tout commence...
            </h1>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="border-l border-white/20 pl-4">
                  <div className="text-3xl font-bold mb-2">40+</div>
                  <div className="text-sm text-white/60">années d'expériences</div>
                </div>
                <div className="border-l border-white/20 pl-4">
                  <div className="text-3xl font-bold mb-2">14</div>
                  <div className="text-sm text-white/60">boutiques</div>
                </div>
                <div className="border-l border-white/20 pl-4">
                  <div className="text-3xl font-bold mb-2">+200</div>
                  <div className="text-sm text-white/60">collaborateurs</div>
                </div>
                <div className="border-l border-white/20 pl-4">
                  <div className="text-3xl font-bold mb-2">30+</div>
                  <div className="text-sm text-white/60">marques partenaires</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section (placeholder for client content) */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="prose prose-invert prose-lg max-w-none">
              <h2 className="text-3xl font-bold mb-6">Notre histoire</h2>
              <p className="text-white/70 mb-6">
                Depuis plus de 40 ans, Optique de Bourbon accompagne les Réunionnais dans le soin de leur vision.
                Notre engagement envers l'excellence et le service personnalisé nous a permis de devenir une référence
                de l'optique à La Réunion.
              </p>
              <p className="text-white/70 mb-6">
                Avec 14 boutiques réparties sur l'île et une équipe de plus de 200 collaborateurs passionnés,
                nous sommes au plus près de vous pour répondre à tous vos besoins en matière de vision et d'esthétique.
              </p>
              <div className="mt-12 p-8 bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-sm text-white/50 italic">
                  Note: Ce contenu est temporaire. Merci de fournir les textes, images et détails complets
                  selon le document de recueil de contenus.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default NotreHistoirePage;
