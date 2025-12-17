'use client';

import PageNavigation from '../../components/PageNavigation';
import Footer from '../../components/Footer';
import { motion } from 'framer-motion';

const NosBoutiquesPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-900 to-black text-white">
      <PageNavigation title="Nos boutiques" subtitle="Trouvez votre magasin" />

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
              Nos boutiques
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              14 boutiques à La Réunion pour vous accueillir et vous conseiller
            </p>
          </motion.div>
        </div>
      </section>

      {/* Boutiques Grid (placeholder) */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(14)].map((_, index) => (
                <div
                  key={index}
                  className="p-6 bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
                >
                  <h3 className="text-xl font-bold mb-2">Boutique {index + 1}</h3>
                  <p className="text-sm text-white/60 mb-4">Adresse à définir</p>
                  <div className="text-sm text-white/40">
                    <p>Téléphone: À définir</p>
                    <p>Horaires: À définir</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 p-8 bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-sm text-white/50 italic">
                Note: Ce contenu est temporaire. Merci de fournir les informations complètes pour chaque boutique
                (nom, adresse, téléphone, horaires, photos) selon le document de recueil de contenus.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default NosBoutiquesPage;
