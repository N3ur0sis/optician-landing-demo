'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPhone, FaStar, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';

// Store data
const stores = [
  {
    id: 'le-port',
    name: 'ODB LE PORT',
    address: '21 rue du Port, 97420 Le Port',
    phone: '0262 43 12 34',
    rating: 4.6,
    reviews: 279,
    image: '/api/placeholder/400/250'
  },
  {
    id: 'saint-paul',
    name: 'ODB SAINT-PAUL',
    address: '21 rue du commerce, 97460 Saint-Paul',
    phone: '0262 22 55 69',
    rating: 4.6,
    reviews: 279,
    image: '/api/placeholder/400/250'
  },
  {
    id: 'saint-denis',
    name: 'ODB SAINT-DENIS',
    address: 'Quartz Boulevard Sud, 97400 Saint-Denis',
    phone: '0262 21 43 56',
    rating: 4.5,
    reviews: 312,
    image: '/api/placeholder/400/250'
  },
  {
    id: 'saint-andre',
    name: 'ODB SAINT-ANDRÉ',
    address: 'Centre Commercial, 97440 Saint-André',
    phone: '0262 46 78 90',
    rating: 4.7,
    reviews: 198,
    image: '/api/placeholder/400/250'
  },
  {
    id: 'bras-panon',
    name: 'ODB BRAS-PANON',
    address: 'Rue de la République, 97412 Bras-Panon',
    phone: '0262 51 23 45',
    rating: 4.4,
    reviews: 156,
    image: '/api/placeholder/400/250'
  },
  {
    id: 'saint-louis',
    name: 'ODB SAINT-LOUIS',
    address: 'Avenue du Général de Gaulle, 97450 Saint-Louis',
    phone: '0262 26 67 89',
    rating: 4.6,
    reviews: 203,
    image: '/api/placeholder/400/250'
  }
];

// Skeleton component for store cards while loading
const StoreCardSkeleton = () => (
  <div className="bg-white/80 rounded-2xl shadow-lg overflow-hidden animate-pulse">
    <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200" />
    <div className="p-6">
      <div className="flex items-start justify-between mb-5">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-5 bg-gray-200 rounded w-10"></div>
      </div>
      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-2">
          <div className="h-4 w-4 bg-gray-200 rounded-full mt-1"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="flex items-start gap-2">
          <div className="h-4 w-4 bg-gray-200 rounded-full mt-1"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
      </div>
      <div className="space-y-3">
        <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
        <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
      </div>
    </div>
  </div>
);

export default function MagasinsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState<Record<string, boolean>>({});
  const [hoveredStore, setHoveredStore] = useState<string | null>(null);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setIsLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleImageLoaded = (storeId: string) => {
    setImgLoaded(prev => ({ ...prev, [storeId]: true }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white">
      {/* Header */}
      <motion.header 
        className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div 
                className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold text-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                O
              </motion.div>
              <span className="text-xl font-semibold tracking-widest text-black group-hover:text-amber-800 transition-colors duration-300">
                OPTIQUE DE BOURBON
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                href="/" 
                className="text-neutral-600 hover:text-amber-800 transition-colors duration-300"
              >
                Accueil
              </Link>
              <span className="text-black font-medium relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-amber-400">
                Magasins
              </span>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        className="relative py-20 bg-gradient-to-r from-neutral-900 to-neutral-800 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, white 2%, transparent 0%)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white relative z-10">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-6 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 20,
              delay: 0.1
            }}
          >
            Nos magasins ODB
          </motion.h1>
          <motion.p 
            className="text-xl opacity-90 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 20,
              delay: 0.2
            }}
          >
            Retrouvez tous nos magasins Optique de Bourbon à travers l'île de La Réunion. 
            Prenez rendez-vous en ligne avec nos opticiens spécialisés.
          </motion.p>
        </div>
      </motion.section>

      {/* Stores Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Trouvez votre magasin le plus proche
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Chaque magasin ODB dispose d'espaces spécialisés : ODB Sport, ODB Kids, 
              et propose les plus grandes marques de l'optique.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {!isLoaded ? (
                // Show skeletons while loading
                Array.from({ length: 6 }).map((_, index) => (
                  <motion.div
                    key={`skeleton-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <StoreCardSkeleton />
                  </motion.div>
                ))
              ) : (
                // Show actual store cards
                stores.map((store, index) => (
                  <motion.div
                    key={store.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: index * 0.08,
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    }}
                    className="group"
                    onMouseEnter={() => setHoveredStore(store.id)}
                    onMouseLeave={() => setHoveredStore(null)}
                  >
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 h-full flex flex-col transform-gpu">
                      {/* Store Image with gradient overlay */}
                      <div className="aspect-[4/3] bg-gradient-to-br from-neutral-200 to-neutral-300 relative overflow-hidden group-hover:from-amber-100 group-hover:to-amber-200 transition-colors duration-700">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-neutral-600 font-medium">Photo magasin</span>
                        </div>
                        
                        {/* Floating decoration elements */}
                        <motion.div 
                          className="absolute top-4 right-4 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center"
                          animate={{ 
                            scale: hoveredStore === store.id ? [1, 1.1, 1] : 1,
                            rotate: hoveredStore === store.id ? [0, 5, 0, -5, 0] : 0
                          }}
                          transition={{ duration: 2, repeat: hoveredStore === store.id ? Infinity : 0, repeatDelay: 1 }}
                        >
                          <div className="w-2 h-2 bg-amber-400 rounded-full" />
                        </motion.div>
                      </div>

                      {/* Store Info */}
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-bold text-neutral-900 group-hover:text-amber-800 transition-colors duration-300">{store.name}</h3>
                          <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-full">
                            <FaStar className="text-amber-500 text-sm" />
                            <span className="text-sm font-medium text-amber-800">{store.rating}</span>
                          </div>
                        </div>

                        <div className="space-y-3 mb-6 flex-1">
                          <div className="flex items-start gap-2">
                            <FaMapMarkerAlt className="text-amber-600 mt-1 text-sm opacity-80" />
                            <span className="text-neutral-600 text-sm">{store.address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaPhone className="text-amber-600 text-sm opacity-80" />
                            <a 
                              href={`tel:${store.phone}`} 
                              className="text-amber-700 hover:text-amber-900 text-sm font-medium transition-colors duration-300"
                            >
                              {store.phone}
                            </a>
                          </div>
                          <p className="text-neutral-500 text-xs">
                            {store.reviews} avis clients
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                          <Link 
                            href={`/magasins/${store.id}`}
                            className="block w-full bg-neutral-900 text-white py-3 px-4 rounded-lg font-semibold text-center group-hover:bg-amber-700 transition-colors duration-500 flex items-center justify-center gap-2"
                          >
                            <span>Voir le magasin</span>
                            <FaChevronRight className="text-xs opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                          </Link>
                          <button className="w-full border-2 border-neutral-300 text-neutral-700 py-3 px-4 rounded-lg font-semibold hover:border-amber-500 hover:text-amber-700 transition-all duration-300 group-hover:border-amber-400">
                            Prendre RDV
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <motion.section 
        className="bg-neutral-50 py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Les magasins ODB c'est aussi de la spécialisation
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-neutral-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <h3 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center">
                <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                ODB Sport
              </h3>
              <div className="h-px w-16 bg-gradient-to-r from-amber-300 to-amber-100 mb-6"></div>
              <p className="text-neutral-600 leading-relaxed">
                Conçue pour les sportifs et adaptée à notre mode de vie sous le soleil, 
                ODB Sport propose un large choix de montures optiques et solaires adaptées 
                à votre vue et à vos activités ! Nos opticiens passionnés et spécialisés 
                sauront vous conseiller !
              </p>
            </motion.div>

            <motion.div 
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-neutral-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
            >
              <h3 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center">
                <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                ODB Kids
              </h3>
              <div className="h-px w-16 bg-gradient-to-r from-amber-300 to-amber-100 mb-6"></div>
              <p className="text-neutral-600 leading-relaxed">
                La vue est essentielle à notre quotidien, et encore plus pour nos petits bouts. 
                Parce que la vue des enfants nécessite des compétences et des besoins spécifiques, 
                ODB Kids a vu le jour. Avec plus de 800 montures optiques et solaires, 
                vos enfants trouveront forcément leur bonheur.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 bg-neutral-900 text-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, white 2%, transparent 0%)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h2 
            className="text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            « Mes yeux c'est pour la vie, Optique de Bourbon en prend soin »
          </motion.h2>
          <motion.p 
            className="text-xl opacity-90 mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
          >
            Depuis 1981, Optique de Bourbon s'est engagé à rendre accessible 
            la qualité et la santé visuelle pour tous.
          </motion.p>
          <motion.button
            className="bg-white text-neutral-900 py-4 px-8 rounded-lg font-bold text-lg hover:bg-amber-100 transition-colors duration-300 shadow-md"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)"
            }}
            whileTap={{ scale: 0.97 }}
          >
            PRENDRE RENDEZ-VOUS
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
}
