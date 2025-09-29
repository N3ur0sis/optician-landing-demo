'use client';

import Link from 'next/link';
import PageNavigation from '../../components/PageNavigation';
import { motion } from 'framer-motion';

const MaisonPage = () => {
  const features = [
    {
      title: 'Nos engagements',
      description: 'Qualité, transparence et proximité au cœur de notre accompagnement quotidien.',
      href: '/services',
      image: 'url(https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=800&q=80)',
    },
    {
      title: 'Rencontrer l\'équipe',
      description: 'Portraits de nos opticiennes et opticiens qui façonnent l\'expérience ODB.',
      href: '/magazine',
      image: 'url(https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=800&q=80)',
    },
    {
      title: 'Notre histoire',
      description: 'Quarante années d\'expertise au service de votre vision et de votre style.',
      href: '/magazine',
      image: 'url(https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80)',
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <PageNavigation title="Qui est ODB ?" subtitle="Découvrir la maison" />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
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
              <p className="text-white/60 text-sm tracking-[0.3em] uppercase mb-4">Optique de Bourbon</p>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight mb-8">
                L'histoire de la maison
              </h1>
              <p className="text-xl text-white/80 leading-relaxed max-w-3xl">
                Depuis plus de quarante ans, notre équipe d'opticiens mêle expertise santé, créativité et sélection de montures
                d'exception pour révéler chaque regard. Découvrez nos valeurs, nos ateliers et les personnalités qui donnent vie à
                l'expérience ODB.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group"
              >
                <Link
                  href={feature.href}
                  className="block relative overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:shadow-white/5"
                >
                  {/* Background Image */}
                  <div
                    className="aspect-[4/3] bg-cover bg-center relative group-hover:scale-105 transition-transform duration-700"
                    style={{
                      backgroundImage: feature.image,
                    }}
                  >
                    <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500" />
                  </div>
                  
                  {/* Content */}
                  <div className="p-8">
                    <h2 className="text-2xl font-bold tracking-tight mb-4 group-hover:text-white/90 transition-colors duration-300">
                      {feature.title}
                    </h2>
                    <p className="text-white/70 leading-relaxed mb-6">
                      {feature.description}
                    </p>
                    <div className="flex items-center text-white/60 group-hover:text-white transition-colors duration-300">
                      <span className="text-sm font-medium tracking-[0.15em] uppercase mr-3">
                        Explorer
                      </span>
                      <div className="flex items-center space-x-1 transform group-hover:translate-x-2 transition-transform duration-300">
                        <div className="w-8 h-px bg-current"></div>
                        <div className="w-0 h-0 border-l-[6px] border-l-current border-y-[3px] border-y-transparent"></div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '40+', label: 'Années d\'expérience' },
              { number: '1000+', label: 'Montures en stock' },
              { number: '50+', label: 'Marques partenaires' },
              { number: '5', label: 'Boutiques à La Réunion' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center border border-white/10 p-6 hover:border-white/20 transition-colors duration-300"
              >
                <div className="text-4xl lg:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-white/60 text-sm tracking-[0.2em] uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default MaisonPage;
