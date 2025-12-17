'use client';

import PageNavigation from '../../components/PageNavigation';
import { motion } from 'framer-motion';

const PrendreRendezVousPage = () => {
  return (
    <main className="min-h-screen bg-black text-white">
      <PageNavigation title="Prendre rendez-vous" subtitle="Planifier votre visite" />

      {/* Hero */}
      <section className="relative pt-32 pb-12 overflow-hidden">
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
            className="text-center mb-12"
          >
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 tracking-tight">
              Réservez votre rendez-vous
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Prenez rendez-vous en ligne avec nos opticiens pour un service personnalisé
            </p>
          </motion.div>
        </div>
      </section>

      {/* MinuPass Iframe */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden"
            style={{ minHeight: '800px' }}
          >
            <iframe
              src="https://devices.minutpass.com/iframe.html?header=1&context=OPTIQUEBOURBON&configuration=2803"
              width="100%"
              height="800"
              frameBorder="0"
              title="Prendre rendez-vous avec Optique de Bourbon"
              className="w-full"
              style={{ minHeight: '800px' }}
            />
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold mb-6">Besoin d'aide ?</h2>
            <p className="text-white/70 mb-8">
              Notre équipe est disponible pour répondre à vos questions
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <div>
                <p className="text-sm text-white/50 mb-1">Téléphone</p>
                <a href="tel:0692501865" className="text-lg hover:text-white/80 transition-colors">
                  0692 50 18 65
                </a>
              </div>
              <div>
                <p className="text-sm text-white/50 mb-1">Email</p>
                <a href="mailto:communication@opticdev.re" className="text-lg hover:text-white/80 transition-colors">
                  communication@opticdev.re
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default PrendreRendezVousPage;
