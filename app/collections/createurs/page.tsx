'use client';

import Link from 'next/link';
import PageNavigation from '../../../components/PageNavigation';
import { motion } from 'framer-motion';

const houses = [
  {
    name: 'AHLEM',
    origin: 'Paris & Italie',
    description: 'Lignes intemporelles, acétate poli à la main et verres minéraux qui magnifient la lumière réunionnaise.',
    focus: 'Montures optiques & solaires',
    image: 'url(https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80)',
  },
  {
    name: 'Anne & Valentin',
    origin: 'Toulouse',
    description: 'Couleurs vitaminées et géométries audacieuses pour souligner chaque tempérament.',
    focus: 'Créations capsules & sur-mesure',
    image: 'url(https://images.unsplash.com/photo-1568043210943-0f131e8fc698?auto=format&fit=crop&w=900&q=80)',
  },
  {
    name: 'Kuboraum',
    origin: 'Berlin',
    description: 'Masques sculpturaux façonnés comme des objets de collection, pour personnalités affirmées.',
    focus: 'Pièces iconiques',
    image: 'url(https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80)',
  },
  {
    name: 'Mykita',
    origin: 'Berlin',
    description: 'Technicité allemande, charnières brevetées et silhouettes ultra légères en acier inoxydable.',
    focus: 'Optique & solaires ultralight',
    image: 'url(https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80)',
  },
];

const services = [
  {
    title: 'Essayages privatifs',
    description: "Accès à l'ensemble de la sélection accompagnés d'un opticien-styliste dédié.",
  },
  {
    title: 'Commandes exclusives',
    description: 'Recherche de montures rares et personnalisation des finitions selon vos envies.',
  },
  {
    title: 'Retouches atelier',
    description: 'Ajustements morphologiques, patines et traitements spécifiques réalisés sur place.',
  },
];

const capsules = [
  {
    season: 'Capsule solaires 2024',
    highlight: 'Dégradés sable, verres légers et montures translucides pensées pour la lumière volcanique.',
  },
  {
    season: 'Édition Titanium',
    highlight: 'Pièces japonaises en bêta-titanium, alliances mates / polies pour un confort aérien.',
  },
  {
    season: 'ODB x Créateur invité',
    highlight: 'Collaboration annuelle avec un designer indépendant, disponible uniquement sur rendez-vous.',
  },
];

const CreateursPage = () => {
  return (
    <main className="min-h-screen bg-black text-white">
      <PageNavigation title="Créateurs" subtitle="Sélection exclusive" />

      {/* Hero Section */}
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
              <p className="text-white/60 text-sm tracking-[0.3em] uppercase mb-4">Sélection signature</p>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight mb-8">
                Les maisons que nous représentons
              </h1>
              <p className="text-xl text-white/80 leading-relaxed max-w-3xl">
                Pièces rares, éditions limitées et montures iconiques, sélectionnées pour leur savoir-faire, leur créativité et
                l'émotion qu'elles procurent à ceux qui les portent.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Houses Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {houses.map((house, index) => (
              <motion.div
                key={house.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group border border-white/10 hover:border-white/30 transition-all duration-500 overflow-hidden backdrop-blur-sm"
              >
                <div
                  className="aspect-[4/3] bg-cover bg-center relative group-hover:scale-105 transition-transform duration-700"
                  style={{ backgroundImage: house.image }}
                >
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500" />
                  <div className="absolute top-6 left-6">
                    <div className="bg-white/10 px-3 py-1 text-xs font-medium tracking-[0.2em] uppercase">
                      {house.origin}
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6">
                    <span className="text-white/80 text-xs tracking-[0.3em] uppercase">{house.focus}</span>
                  </div>
                </div>

                <div className="p-8">
                  <h2 className="text-3xl font-bold tracking-tight mb-4 group-hover:text-white/90 transition-colors duration-300">
                    {house.name}
                  </h2>
                  <p className="text-white/70 leading-relaxed">
                    {house.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capsule & Services */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold tracking-tight mb-6">Capsules spéciales</h3>
            <div className="space-y-6">
              {capsules.map((capsule) => (
                <div key={capsule.season} className="border border-white/10 p-6 hover:border-white/25 transition-colors duration-300">
                  <p className="text-sm uppercase tracking-[0.3em] text-white/60 mb-3">{capsule.season}</p>
                  <p className="text-white/80 leading-relaxed">{capsule.highlight}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-8"
          >
            <h3 className="text-3xl font-bold tracking-tight">Expérience ODB</h3>
            <p className="text-white/70 leading-relaxed">
              Chaque rendez-vous se déroule dans un salon dédié, pensé pour révéler la monture qui accompagnera votre regard au
              quotidien.
            </p>
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.title} className="border border-white/10 p-6 flex flex-col gap-2 hover:border-white/25 transition-colors duration-300">
                  <span className="text-sm uppercase tracking-[0.3em] text-white/60">{service.title}</span>
                  <p className="text-white/80 leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/rendez-vous"
                className="border border-white/30 hover:bg-white hover:text-black px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] transition-all duration-300"
              >
                Planifier un essayage
              </Link>
              <Link
                href="/services"
                className="border border-white/30 hover:border-white/60 px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] text-white/80 hover:text-white transition-all duration-300"
              >
                Découvrir nos expertises
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default CreateursPage;
