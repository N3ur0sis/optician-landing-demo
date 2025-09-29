'use client';

import Link from 'next/link';
import PageNavigation from '../../components/PageNavigation';
import { motion } from 'framer-motion';

const BoutiquesPage = () => {
  const locations = [
    { 
      city: 'Saint-Denis', 
      description: 'Flagship lumineux avec atelier de montage et espace solaires.',
      address: '12 Rue de Paris, 97400 Saint-Denis',
      phone: '0262 20 12 34',
      image: 'url(https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80)',
      hours: 'Lun-Sam 9h-18h'
    },
    { 
      city: 'Saint-Pierre', 
      description: "Vitrine dédiée aux créateurs et à l'optique sportive.",
      address: '45 Avenue de la République, 97410 Saint-Pierre',
      phone: '0262 25 67 89',
      image: 'url(https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800&q=80)',
      hours: 'Lun-Sam 9h-18h'
    },
    { 
      city: 'Le Port', 
      description: "Corner santé avec salle d'examen et adaptation lentilles.",
      address: '8 Boulevard du Port, 97420 Le Port',
      phone: '0262 42 15 78',
      image: 'url(https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=800&q=80)',
      hours: 'Lun-Sam 9h-18h'
    },
    { 
      city: 'Saint-Gilles', 
      description: 'Adresse balnéaire pour une sélection solaires et beach lifestyle.',
      address: '23 Rue des Bains, 97434 Saint-Gilles',
      phone: '0262 24 33 45',
      image: 'url(https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80)',
      hours: 'Lun-Sam 9h-18h'
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <PageNavigation title="Nos boutiques" subtitle="Toutes les adresses" />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
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
              <p className="text-white/60 text-sm tracking-[0.3em] uppercase mb-4">Nos boutiques</p>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight mb-8">
                Trouvez l'adresse la plus proche
              </h1>
              <p className="text-xl text-white/80 leading-relaxed max-w-3xl">
                Des espaces pensés pour l'essayage, le conseil et l'accompagnement santé. Prenez rendez-vous ou passez nous voir
                spontanément pour vivre l'expérience ODB.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {locations.map((location, index) => (
              <motion.div
                key={location.city}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group border border-white/10 hover:border-white/30 transition-all duration-500 overflow-hidden hover:shadow-2xl hover:shadow-white/5"
              >
                {/* Background Image */}
                <div
                  className="aspect-[16/9] bg-cover bg-center relative group-hover:scale-105 transition-transform duration-700"
                  style={{
                    backgroundImage: location.image,
                  }}
                >
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500" />
                  <div className="absolute top-6 left-6">
                    <div className="bg-white/10 backdrop-blur-sm px-3 py-1 text-xs font-medium tracking-[0.2em] text-white uppercase">
                      {location.hours}
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-8">
                  <h2 className="text-3xl font-bold tracking-tight mb-4 group-hover:text-white/90 transition-colors duration-300">
                    {location.city}
                  </h2>
                  <p className="text-white/70 leading-relaxed mb-6">
                    {location.description}
                  </p>
                  
                  {/* Contact Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-white/60">
                      <div className="w-4 h-4 border border-white/30 rounded-full mr-3 flex-shrink-0"></div>
                      <span className="text-sm">{location.address}</span>
                    </div>
                    <div className="flex items-center text-white/60">
                      <div className="w-4 h-4 border border-white/30 rounded-full mr-3 flex-shrink-0"></div>
                      <span className="text-sm">{location.phone}</span>
                    </div>
                  </div>
                  
                  {/* CTA */}
                  <div className="flex items-center text-white/60 group-hover:text-white transition-colors duration-300">
                    <span className="text-sm font-medium tracking-[0.15em] uppercase mr-3">
                      Voir détails
                    </span>
                    <div className="flex items-center space-x-1 transform group-hover:translate-x-2 transition-transform duration-300">
                      <div className="w-8 h-px bg-current"></div>
                      <div className="w-0 h-0 border-l-[6px] border-l-current border-y-[3px] border-y-transparent"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-bold tracking-tight">Prêt pour votre visite ?</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Réservez votre créneau ou découvrez nos services exclusifs
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/rendez-vous"
                className="border border-white/30 hover:bg-white hover:text-black px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] transition-all duration-300"
              >
                Prendre rendez-vous
              </Link>
              <Link
                href="/services"
                className="border border-white/30 hover:border-white/60 px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] text-white/80 hover:text-white transition-all duration-300"
              >
                Voir nos services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default BoutiquesPage;
