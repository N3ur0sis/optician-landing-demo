'use client';

import Link from 'next/link';
import PageNavigation from '../../components/PageNavigation';
import { motion } from 'framer-motion';

const services = [
  {
    title: 'Examen de la vue',
    description: "Bilans complets avec technologies de dernière génération, renouvellement d'ordonnance et suivi médical coordonné.",
    tags: ['Myopie & presbytie', 'Contrôle enfant', 'Suivi lentilles'],
  },
  {
    title: 'Adaptation lentilles',
    description: 'Essais, apprentissage à la manipulation, lentilles techniques pour sport et solutions de confort prolongé.',
    tags: ['Souples & rigides', 'Lentilles nocturnes', 'Entretien personnalisé'],
  },
  {
    title: 'Atelier stylisme',
    description: 'Sélection de montures en fonction de votre morphologie, de votre palette de couleurs et de votre quotidien.',
    tags: ['Diagnostic visage', 'Conseil image', 'Collections exclusives'],
  },
  {
    title: 'Atelier de montage',
    description: 'Fabrication de vos verres en 1h selon correction, ajustements morphologiques et finitions premium.',
    tags: ['Verres haute précision', 'Traitements anti-lumière bleue', 'Finitions main'],
  },
  {
    title: 'Services après-vente',
    description: "Réglages illimités, nettoyage ultrason, réparations et contrôle de la vision toute l'année.",
    tags: ['Diagnostic express', 'Remplacement vis et plaquettes', 'Entretien offert'],
  },
  {
    title: 'Programmes entreprise',
    description: 'Solutions optiques pour vos équipes, tri par métiers, accompagnement santé visuelle sur site.',
    tags: ['Convention mutuelle', 'Essayages nomades', 'Suivi dédié RH'],
  },
];

const steps = [
  {
    title: 'Comprendre votre vision',
    detail: 'Analyse de la correction, de votre mode de vie et de vos attentes esthétiques.',
  },
  {
    title: 'Proposer sur mesure',
    detail: 'Sélection de verres et de montures avec simulation en boutique ou en salon privé.',
  },
  {
    title: 'Accompagner dans la durée',
    detail: 'Contrôle annuel offert, ajustements gratuits et conseils de posture numérique.',
  },
];

const partners = [
  'Essilor Stellest',
  'Zeiss Lenses',
  'Novacel Signature',
  'Transitions',
  'BBGR Blue Shock',
];

const ServicesPage = () => {
  return (
    <main className="min-h-screen bg-black text-white">
      <PageNavigation title="Services" subtitle="Expertises santé & style" />

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
            className="max-w-4xl"
          >
            <div className="border-l-2 border-white/30 pl-8 mb-12">
              <p className="text-white/60 text-sm tracking-[0.3em] uppercase mb-4">Services & soins visuels</p>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight mb-8">
                L'accompagnement Optique de Bourbon
              </h1>
              <p className="text-xl text-white/80 leading-relaxed max-w-3xl">
                De la prévention enfant à la performance sportive, nos opticiens diplômés orchestrent un parcours sur mesure pour
                votre santé visuelle et votre style.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="border border-white/10 p-8 hover:border-white/30 transition-colors duration-300 flex flex-col gap-6"
              >
                <div>
                  <span className="text-sm uppercase tracking-[0.3em] text-white/60">{String(index + 1).padStart(2, '0')}</span>
                  <h2 className="text-3xl font-bold tracking-tight mt-4 mb-3">{service.title}</h2>
                  <p className="text-white/70 leading-relaxed">{service.description}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white/60 border border-white/15"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process & Partners */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h3 className="text-3xl font-bold tracking-tight">Votre parcours chez ODB</h3>
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={step.title} className="border border-white/10 p-6 hover:border-white/25 transition-colors duration-300">
                  <p className="text-sm uppercase tracking-[0.3em] text-white/50 mb-3">Étape {index + 1}</p>
                  <h4 className="text-2xl font-semibold tracking-tight mb-2">{step.title}</h4>
                  <p className="text-white/80 leading-relaxed">{step.detail}</p>
                </div>
              ))}
            </div>
            <Link
              href="/rendez-vous"
              className="inline-flex items-center gap-3 border border-white/30 hover:bg-white hover:text-black px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] transition-all duration-300"
            >
              Planifier une consultation
              <span className="flex items-center space-x-1">
                <span className="block w-8 h-px bg-current"></span>
                <span className="block w-0 h-0 border-l-[6px] border-l-current border-y-[3px] border-y-transparent" />
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-8"
          >
            <h3 className="text-3xl font-bold tracking-tight">Technologies & partenaires</h3>
            <p className="text-white/70 leading-relaxed">
              Nous collaborons avec les meilleurs verriers internationaux et investissons dans des équipements de mesure de
              dernière génération afin de garantir précision et confort.
            </p>
            <div className="border border-white/10 p-8 grid gap-6 sm:grid-cols-2">
              {partners.map((partner) => (
                <span key={partner} className="text-sm uppercase tracking-[0.25em] text-white/60">
                  {partner}
                </span>
              ))}
            </div>
            <div className="border border-white/10 p-8 space-y-4">
              <h4 className="text-xl font-semibold tracking-tight">Espace santé visuelle</h4>
              <p className="text-white/70 leading-relaxed">
                Diagnostic lumière bleue, ateliers prévention écran pour entreprises et suivi post-opératoire avec nos opticiens
                partenaires en clinique.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default ServicesPage;
