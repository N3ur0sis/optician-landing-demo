'use client';

import Link from 'next/link';
import PageNavigation from '../../components/PageNavigation';
import { motion } from 'framer-motion';

const reasons = [
  {
    title: 'Contrôle visuel complet',
    detail: 'Bilan santé vision, prévention myopie enfant, suivi post-opératoire.',
  },
  {
    title: 'Conseil montures & stylisme',
    detail: 'Sélection privée, diagnostic morphologique et essayages guidés.',
  },
  {
    title: 'Adaptation lentilles',
    detail: "Essais, apprentissage manipulation et protocoles d'entretien personnalisés.",
  },
];

const contact = [
  { label: 'Service client', value: '0262 20 12 34' },
  { label: 'Email', value: 'maison@optique-de-bourbon.com' },
  { label: 'Disponibilité', value: 'Réponse sous 24h' },
];

const RendezVousPage = () => {
  return (
    <main className="min-h-screen bg-black text-white">
      <PageNavigation title="Rendez-vous" subtitle="Planifier votre visite" />

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
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="border-l-2 border-white/30 pl-8"
            >
              <p className="text-white/60 text-sm tracking-[0.3em] uppercase mb-4">Expérience personnalisée</p>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight mb-8">
                Prenons soin de votre vision
              </h1>
              <p className="text-xl text-white/80 leading-relaxed mb-8">
                Sélectionnez un motif de rendez-vous, indiquez vos disponibilités et notre équipe vous contacte sous 24 heures pour
                confirmer votre créneau.
              </p>
              <div className="space-y-5">
                {reasons.map((reason) => (
                  <div key={reason.title} className="flex items-start gap-4">
                    <div className="w-3 h-3 rounded-full bg-white/40 mt-2" />
                    <div>
                      <h2 className="text-lg font-semibold tracking-tight mb-1">{reason.title}</h2>
                      <p className="text-white/70 leading-relaxed">{reason.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-white/5 blur-3xl opacity-30" />
              <form className="relative border border-white/10 bg-black/50 backdrop-blur-xl p-10 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="flex flex-col text-sm uppercase tracking-[0.2em] text-white/60">
                    Nom complet
                    <input
                      type="text"
                      placeholder="Votre nom"
                      className="mt-3 bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
                    />
                  </label>
                  <label className="flex flex-col text-sm uppercase tracking-[0.2em] text-white/60">
                    Email
                    <input
                      type="email"
                      placeholder="vous@email.com"
                      className="mt-3 bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
                    />
                  </label>
                  <label className="flex flex-col text-sm uppercase tracking-[0.2em] text-white/60">
                    Téléphone
                    <input
                      type="tel"
                      placeholder="06 00 00 00 00"
                      className="mt-3 bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
                    />
                  </label>
                  <label className="flex flex-col text-sm uppercase tracking-[0.2em] text-white/60">
                    Ville souhaitée
                    <select
                      className="mt-3 bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors"
                    >
                      {['Saint-Denis', 'Saint-Pierre', 'Saint-Gilles', 'Le Port', 'Saint-Paul'].map((city) => (
                        <option key={city} className="bg-black text-white">{city}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="flex flex-col text-sm uppercase tracking-[0.2em] text-white/60">
                  Motif de rendez-vous
                  <textarea
                    rows={4}
                    placeholder="Dites-nous comment nous pouvons vous aider"
                    className="mt-3 bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
                  />
                </label>
                <button
                  type="submit"
                  className="w-full border border-white/30 hover:bg-white hover:text-black px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] transition-all duration-300"
                >
                  Envoyer ma demande
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact & follow-up */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-[2fr,1fr] gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold tracking-tight">Après votre demande</h2>
            <p className="text-white/70 leading-relaxed">
              Un conseiller ODB vous contacte pour confirmer le créneau, préparer vos besoins (documents, ordonnances, essayages) et
              vous proposer des services complémentaires si besoin.
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              {['Préparation dossier mutuelle', 'Salon privé ou visio', 'Ajustements illimités'].map((item) => (
                <div key={item} className="border border-white/10 p-5 text-sm uppercase tracking-[0.25em] text-white/60 text-center">
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="border border-white/10 p-8 space-y-5"
          >
            <h3 className="text-xl font-semibold tracking-tight">Besoin d'un contact direct ?</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Appelez-nous ou écrivez-nous, notre équipe boutique vous répond du lundi au samedi.
            </p>
            <div className="space-y-4">
              {contact.map((item) => (
                <div key={item.label} className="text-white/70">
                  <span className="text-xs uppercase tracking-[0.3em] text-white/50 block mb-1">{item.label}</span>
                  <span className="text-base">{item.value}</span>
                </div>
              ))}
            </div>
            <Link
              href="/boutiques"
              className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors"
            >
              Trouver une boutique
              <span className="block w-8 h-px bg-current" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default RendezVousPage;
