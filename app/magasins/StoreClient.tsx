'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaClock, FaMapMarkerAlt, FaStar, FaCalendarAlt } from 'react-icons/fa';
import Link from 'next/link';

const storesData = {
  'le-port': {
    name: 'ODB LE PORT',
    address: '21 rue du Port, 97420 Le Port',
    phone: '0262 43 12 34',
    email: 'le-port@odb.re',
    hours: {
      'Lundi au vendredi': '8h30 – 18h00',
      'Samedi': '8h30 – 17h00',
      'Dimanche': 'Fermé'
    },
    rating: 4.6,
    reviews: 279,
    description: 'Retrouvez votre magasin Optique de Bourbon Le Port ! Il vous réserve une nouvelle façon de voir l\'optique. Avec un espace dédié à la marque Ray-Ban et un corner Oakley.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    images: [
      '/api/placeholder/600/400',
      '/api/placeholder/600/400',
      '/api/placeholder/600/400'
    ],
    specialties: ['Espace Ray-Ban', 'Corner Oakley', 'Espace détente avec recharge USB']
  },
  'saint-paul': {
    name: 'ODB SAINT-PAUL',
    address: '21 rue du commerce, 97460 Saint-Paul',
    phone: '0262 22 55 69',
    email: 'st-paul@odb.re',
    hours: {
      'Lundi au vendredi': '8h30 – 18h00',
      'Samedi': '8h30 – 17h00',
      'Dimanche': 'Fermé'
    },
    rating: 4.6,
    reviews: 279,
    description: 'Situé au cœur de la ville de Saint-Paul, dans la même rue que La Halle et SFR, en face de Jordane Lou. Rien de mieux que nos opticiens qualifiés pour vous indiquer le meilleur choix.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    images: [
      '/api/placeholder/600/400',
      '/api/placeholder/600/400',
      '/api/placeholder/600/400'
    ],
    specialties: ['Corner enfant', 'Espace marmailles', 'Corner Oakley']
  },
  'saint-denis': {
    name: 'ODB SAINT-DENIS',
    address: 'Quartz Boulevard Sud, 97400 Saint-Denis',
    phone: '0262 21 43 56',
    email: 'saint-denis@odb.re',
    hours: {
      'Lundi au vendredi': '8h30 – 18h00',
      'Samedi': '8h30 – 17h00',
      'Dimanche': 'Fermé'
    },
    rating: 4.5,
    reviews: 312,
    description: 'Votre magasin ODB Saint-Denis vous accueille dans un espace moderne avec un large choix de montures et des services spécialisés.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    images: [
      '/api/placeholder/600/400',
      '/api/placeholder/600/400',
      '/api/placeholder/600/400'
    ],
    specialties: ['Espace Kids', 'Collections premium', 'Service express']
  }
};

// Skeleton components for loading state
const InfoCardSkeleton = () => (
  <div className="bg-white/90 rounded-2xl shadow-lg p-8 animate-pulse">
    <div className="h-8 bg-neutral-200 rounded w-1/4 mb-6"></div>
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-neutral-200"></div>
          <div>
            <div className="h-5 bg-neutral-200 rounded w-24 mb-2"></div>
            <div className="h-4 bg-neutral-200 rounded w-48"></div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-neutral-200"></div>
          <div>
            <div className="h-5 bg-neutral-200 rounded w-24 mb-2"></div>
            <div className="h-4 bg-neutral-200 rounded w-32"></div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-neutral-200"></div>
          <div>
            <div className="h-5 bg-neutral-200 rounded w-24 mb-2"></div>
            <div className="h-4 bg-neutral-200 rounded w-40"></div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-neutral-200"></div>
          <div className="w-full">
            <div className="h-5 bg-neutral-200 rounded w-36 mb-4"></div>
            <div className="space-y-3 w-full">
              <div className="flex justify-between w-full">
                <div className="h-4 bg-neutral-200 rounded w-24"></div>
                <div className="h-4 bg-neutral-200 rounded w-16"></div>
              </div>
              <div className="flex justify-between w-full">
                <div className="h-4 bg-neutral-200 rounded w-24"></div>
                <div className="h-4 bg-neutral-200 rounded w-16"></div>
              </div>
              <div className="flex justify-between w-full">
                <div className="h-4 bg-neutral-200 rounded w-24"></div>
                <div className="h-4 bg-neutral-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ServicesCardSkeleton = () => (
  <div className="bg-white/90 rounded-2xl shadow-lg p-8 animate-pulse">
    <div className="h-8 bg-neutral-200 rounded w-1/4 mb-6"></div>
    <div className="grid md:grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-neutral-100 rounded-lg">
          <div className="w-2 h-2 bg-neutral-200 rounded-full"></div>
          <div className="h-5 bg-neutral-200 rounded w-24"></div>
        </div>
      ))}
    </div>
  </div>
);

export default function StoreClient({ slug }: { slug: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const store = storesData[slug as keyof typeof storesData];
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    // First loading phase - skeleton state
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    // Second phase - content appear animation
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 1000);
    
    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="p-8 text-center">
          <div className="text-amber-500 text-5xl mb-4">404</div>
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">Magasin introuvable</h2>
          <p className="text-neutral-600 mb-6">Nous n'avons pas trouvé le magasin que vous cherchez.</p>
          <Link href="/magasins" className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-neutral-800 transition-colors">
            Retour à la liste des magasins
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white">
      {/* Header */}
      <motion.header 
        className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <motion.div 
                className="w-8 h-8 sm:w-10 sm:h-10 bg-black rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                O
              </motion.div>
              <span className="text-lg sm:text-xl font-semibold tracking-widest text-black group-hover:text-amber-800 transition-colors duration-300">
                <span className="hidden sm:inline">OPTIQUE DE BOURBON</span>
                <span className="sm:hidden">ODB</span>
              </span>
            </Link>
            <nav className="flex items-center gap-3 sm:gap-4 md:gap-6">
              <Link href="/" className="text-sm sm:text-base text-neutral-600 hover:text-amber-800 transition-colors duration-300">
                Accueil
              </Link>
              <Link href="/magasins" className="text-sm sm:text-base text-neutral-600 hover:text-amber-800 transition-colors duration-300">
                Magasins
              </Link>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        className="relative h-96 bg-gradient-to-r from-neutral-900 to-neutral-800 overflow-hidden"
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
        
        <div className="absolute inset-0 bg-black/30" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <motion.div 
              className="flex items-center gap-3 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
              transition={{ delay: 0.1 }}
            >
              <FaMapMarkerAlt className="text-2xl text-amber-400" />
              <span className="text-lg opacity-90">Votre magasin</span>
            </motion.div>
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-4 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
              transition={{ delay: 0.2 }}
            >
              {store.name}
            </motion.h1>
            <motion.p 
              className="text-xl opacity-90 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
              transition={{ delay: 0.3 }}
            >
              {store.description}
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Store Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            {isLoading ? (
              <InfoCardSkeleton />
            ) : (
              <motion.div 
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-neutral-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold mb-6 text-neutral-900 flex items-center">
                  <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                  Informations de contact
                </h2>
                <div className="h-px w-16 bg-gradient-to-r from-amber-300 to-amber-100 mb-6"></div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-5">
                    <div className="flex items-start gap-3 group">
                      <FaMapMarkerAlt className="text-xl text-amber-500 mt-1 opacity-80 group-hover:scale-110 transition-transform duration-300" />
                      <div>
                        <h3 className="font-semibold text-neutral-900">Adresse</h3>
                        <p className="text-neutral-600">{store.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 group">
                      <FaPhone className="text-xl text-amber-500 mt-1 opacity-80 group-hover:scale-110 transition-transform duration-300" />
                      <div>
                        <h3 className="font-semibold text-neutral-900">Téléphone</h3>
                        <a href={`tel:${store.phone}`} className="text-amber-700 hover:text-amber-900 transition-colors duration-300">
                          {store.phone}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 group">
                      <FaEnvelope className="text-xl text-amber-500 mt-1 opacity-80 group-hover:scale-110 transition-transform duration-300" />
                      <div>
                        <h3 className="font-semibold text-neutral-900">Email</h3>
                        <a href={`mailto:${store.email}`} className="text-amber-700 hover:text-amber-900 transition-colors duration-300">
                          {store.email}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-start gap-3 group">
                      <FaClock className="text-xl text-amber-500 mt-1 opacity-80 group-hover:scale-110 transition-transform duration-300" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900 mb-3">Horaires d'ouverture</h3>
                        <div className="space-y-2">
                          {Object.entries(store.hours).map(([day, hours]) => (
                            <div key={day} className="flex justify-between border-b border-neutral-100 pb-1">
                              <span className="text-neutral-600">{day}</span>
                              <span className="font-medium text-neutral-800">{hours}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Services */}
            {isLoading ? (
              <ServicesCardSkeleton />
            ) : (
              <motion.div 
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-neutral-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-6 text-neutral-900 flex items-center">
                  <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                  Nos services
                </h2>
                <div className="h-px w-16 bg-gradient-to-r from-amber-300 to-amber-100 mb-6"></div>
                <div className="grid md:grid-cols-2 gap-4">
                  {store.services.map((service, index) => (
                    <motion.div
                      key={service}
                      className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg hover:bg-amber-50 transition-colors duration-300 group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-2 h-2 bg-amber-400 rounded-full" />
                      <span className="font-medium text-neutral-800 group-hover:text-amber-700 transition-colors duration-300">{service}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Specialties */}
            {isLoading ? (
              <ServicesCardSkeleton />
            ) : (
              <motion.div 
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-neutral-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-2xl font-bold mb-6 text-neutral-900 flex items-center">
                  <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                  Nos spécialités
                </h2>
                <div className="h-px w-16 bg-gradient-to-r from-amber-300 to-amber-100 mb-6"></div>
                <div className="space-y-3">
                  {store.specialties.map((specialty, index) => (
                    <motion.div
                      key={specialty}
                      className="flex items-center gap-3 p-4 bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-lg hover:from-amber-50 hover:to-amber-100 transition-colors duration-500 group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <FaStar className="text-amber-500" />
                      <span className="font-medium text-neutral-800 group-hover:text-amber-700 transition-colors duration-300">{specialty}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - CTA and Reviews */}
          <div className="space-y-8">
            {/* CTA Buttons */}
            {isLoading ? (
              <div className="bg-white/90 rounded-2xl shadow-lg p-8 animate-pulse">
                <div className="h-6 bg-neutral-200 rounded w-3/4 mb-6"></div>
                <div className="space-y-4">
                  <div className="h-14 bg-neutral-200 rounded-lg w-full"></div>
                  <div className="h-14 bg-neutral-200 rounded-lg w-full"></div>
                </div>
              </div>
            ) : (
              <motion.div 
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-neutral-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-xl font-bold mb-6 text-neutral-900 flex items-center">
                  <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                  Prendre rendez-vous
                </h3>
                <div className="space-y-4">
                  <motion.button
                    className="w-full bg-neutral-900 text-white py-4 px-6 rounded-lg font-semibold hover:bg-amber-700 transition-all duration-500 flex items-center justify-center gap-2 shadow-sm"
                    whileHover={{ 
                      y: -2,
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)"
                    }}
                    whileTap={{ y: 0 }}
                  >
                    <FaCalendarAlt />
                    <span>JE PRENDS RDV EN LIGNE</span>
                  </motion.button>
                  <motion.a
                    href={`tel:${store.phone}`}
                    className="w-full border-2 border-neutral-800 text-neutral-900 py-4 px-6 rounded-lg font-semibold hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-300 flex items-center justify-center gap-2"
                    whileHover={{ 
                      y: -2,
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)"
                    }}
                    whileTap={{ y: 0 }}
                  >
                    <FaPhone />
                    <span>APPELER LE MAGASIN</span>
                  </motion.a>
                </div>
              </motion.div>
            )}

            {/* Reviews */}
            {isLoading ? (
              <div className="bg-white/90 rounded-2xl shadow-lg p-8 animate-pulse">
                <div className="h-6 bg-neutral-200 rounded w-1/2 mb-4"></div>
                <div className="flex justify-center mb-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-neutral-200 rounded-full"></div>
                    ))}
                  </div>
                </div>
                <div className="h-8 bg-neutral-200 rounded w-16 mx-auto mb-2"></div>
                <div className="h-4 bg-neutral-200 rounded w-32 mx-auto mb-4"></div>
                <div className="h-4 bg-neutral-200 rounded w-24 mx-auto"></div>
              </div>
            ) : (
              <motion.div 
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-neutral-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-xl font-bold mb-6 text-neutral-900 flex items-center">
                  <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                  Avis clients
                </h3>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < Math.floor(store.rating) ? 'text-amber-500' : 'text-neutral-300'}
                          size={20}
                        />
                      ))}
                    </div>
                    <span className="text-2xl font-bold text-neutral-900">{store.rating}/5</span>
                  </div>
                  <p className="text-neutral-600 mb-4">
                    Sur {store.reviews} avis vérifiés
                  </p>
                  <motion.button
                    className="text-amber-700 hover:text-amber-900 font-medium border-b-2 border-transparent hover:border-amber-300 transition-all duration-300"
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    Voir tous les avis
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Map Placeholder */}
            {isLoading ? (
              <div className="bg-white/90 rounded-2xl shadow-lg p-8 animate-pulse">
                <div className="h-6 bg-neutral-200 rounded w-1/2 mb-4"></div>
                <div className="aspect-square bg-neutral-200 rounded-lg"></div>
              </div>
            ) : (
              <motion.div 
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-neutral-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-xl font-bold mb-6 text-neutral-900 flex items-center">
                  <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                  Localisation
                </h3>
                <motion.div 
                  className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-lg flex items-center justify-center overflow-hidden relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <div className="text-center text-neutral-500 absolute inset-0 flex flex-col items-center justify-center z-10">
                    <motion.div
                      initial={{ y: 10 }}
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    >
                      <FaMapMarkerAlt className="text-4xl mx-auto mb-2 text-amber-500" />
                    </motion.div>
                    <p className="font-medium text-neutral-700">Carte interactive</p>
                    <p className="text-sm">À venir</p>
                  </div>
                  {/* Map grid pattern */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0" style={{
                      backgroundSize: '20px 20px',
                      backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)'
                    }}></div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12 text-neutral-900 relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
            Découvrez notre magasin
            <div className="h-px w-32 bg-gradient-to-r from-amber-300 to-amber-100 mx-auto mt-4"></div>
          </motion.h2>
          
          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="aspect-[4/3] bg-neutral-200 animate-pulse rounded-xl"></div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {store.images.map((image, index) => (
                <motion.div
                  key={index}
                  className={`aspect-[4/3] rounded-xl overflow-hidden cursor-pointer ${activeImage === index ? 'ring-2 ring-amber-500' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)"
                  }}
                  onClick={() => setActiveImage(index)}
                >
                  <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center relative group">
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-4">
                      <span className="text-white font-medium">Vue {index + 1}</span>
                    </div>
                    <span className="text-neutral-600 font-medium group-hover:opacity-0 transition-opacity duration-300">Photo {index + 1}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
