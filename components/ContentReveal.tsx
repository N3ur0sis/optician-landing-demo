'use client';

import { motion, useTransform } from 'framer-motion';
import { MotionValue } from 'framer-motion';

type ContentRevealProps = {
  scrollProgress?: MotionValue<number>;
  cameraZ?: number;
};

const ContentReveal = ({ scrollProgress, cameraZ = 100 }: ContentRevealProps) => {
  // Calculate blur based on camera position
  // When camera is at 100, blur is maximum (20px)
  // When camera is at 0, blur is 0px
  const blurAmount = Math.max(0, (cameraZ / 100) * 20);
  const opacity = Math.max(0.1, 1 - (cameraZ / 100) * 0.8);

  return (
    <motion.div 
      className="absolute inset-0 z-1"
      style={{
        filter: `blur(${blurAmount}px)`,
        opacity: opacity,
        transition: 'filter 0.3s ease-out, opacity 0.3s ease-out'
      }}
    >
      {/* Background gradient - subtle, luxury-inspired */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-neutral-100 to-amber-50" />

      {/* Content sections that appear behind glasses */}
      <div className="relative h-full w-full overflow-y-auto">
        {/* Main content section - visible during glasses animation */}
        <div className="min-h-screen flex flex-col justify-center items-center p-8 space-y-20">
          {/* Hero Section */}
          <motion.div 
            className="text-center max-w-3xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-semibold text-neutral-900 mb-6 leading-tight tracking-tight" style={{letterSpacing: '0.04em'}}>
              Votre partenaire santé depuis plus de 40 ans
            </h1>
            <p className="text-lg md:text-xl text-neutral-500 leading-relaxed font-light">
              Toujours la même passion et la même détermination à rendre la qualité accessible à tous.
            </p>
          </motion.div>

          {/* Services Grid - minimalist, luxury style */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl w-full"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {/* Optikid */}
            <div className="bg-white/90 rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-start border border-neutral-100">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2 tracking-wide uppercase">Optikid</h3>
              <div className="h-1 w-10 bg-amber-200 rounded-full mb-4" />
              <p className="text-neutral-500 text-base leading-relaxed font-light">
                La vue des enfants, c'est sérieux. Une approche médicale et pédagogique pour garantir une expertise de qualité.
              </p>
            </div>

            {/* ODB Sport */}
            <div className="bg-white/90 rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-start border border-neutral-100">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2 tracking-wide uppercase">ODB Sport</h3>
              <div className="h-1 w-10 bg-amber-200 rounded-full mb-4" />
              <p className="text-neutral-500 text-base leading-relaxed font-light">
                Les solaires de sport à votre vue. Bien voir est la clé de la performance dans tous vos sports.
              </p>
            </div>

            {/* ODB à Domicile */}
            <div className="bg-white/90 rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-start border border-neutral-100">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2 tracking-wide uppercase">À Domicile</h3>
              <div className="h-1 w-10 bg-amber-200 rounded-full mb-4" />
              <p className="text-neutral-500 text-base leading-relaxed font-light">
                Le magasin et l'opticien viennent à vous. Bénéficiez de notre expertise comme en magasin.
              </p>
            </div>
          </motion.div>

          {/* Expertise Section */}
          <motion.div 
            className="text-center max-w-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 mb-4 tracking-tight">
              Nos opticiens qualifiés pour vous conseiller
            </h2>
            <p className="text-neutral-500 leading-relaxed mb-6 font-light">
              Rien de mieux que nos opticiens qualifiés pour vous indiquer le meilleur choix. Ils restent toujours à votre disposition.
            </p>
            <div className="inline-flex px-6 py-3 bg-neutral-900 text-white rounded-full font-medium text-base shadow-sm tracking-wide">
              ODB, votre opticien santé
            </div>
          </motion.div>
        </div>

        {/* Additional content sections - appear when glasses are fully on */}
        {blurAmount < 5 && (
          <>
            {/* Brands Section - minimalist luxury */}
            <div className="min-h-screen bg-gradient-to-br from-white to-neutral-100 flex items-center justify-center p-8">
              <motion.div 
                className="text-center max-w-5xl w-full"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 mb-12 tracking-tight">
                  Marques partenaires
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {['Oakley', 'Maui Jim', 'Essilor', 'Varilux'].map((brand, index) => (
                    <motion.div
                      key={brand}
                      className="bg-white/95 text-neutral-900 p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-lg font-semibold tracking-wide border border-neutral-100"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      {brand}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Services Detail Section - minimalist luxury */}
            <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white flex items-center justify-center p-8">
              <motion.div 
                className="max-w-6xl w-full"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 mb-6 tracking-tight">
                    Nos services spécialisés
                  </h2>
                  <p className="text-lg text-neutral-500 font-light">Une expertise reconnue dans tous les domaines de l'optique</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Conseils */}
                  <motion.div 
                    className="bg-white/95 rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-neutral-100"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-semibold text-neutral-900 mb-4 tracking-wide uppercase">Conseils d'experts</h3>
                    <div className="h-1 w-10 bg-amber-200 rounded-full mb-4" />
                    <p className="text-neutral-500 leading-relaxed font-light">
                      Protection contre les UV, lumière bleue des écrans, verres adaptés à votre mode de vie. Nos opticiens vous guident dans tous vos choix.
                    </p>
                  </motion.div>

                  {/* Ophtalmologistes */}
                  <motion.div 
                    className="bg-white/95 rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-neutral-100"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-semibold text-neutral-900 mb-4 tracking-wide uppercase">Réseau d'ophtalmologistes</h3>
                    <div className="h-1 w-10 bg-amber-200 rounded-full mb-4" />
                    <p className="text-neutral-500 leading-relaxed font-light">
                      Collaboration avec les meilleurs ophtalmologistes de l'île pour un suivi médical complet.
                    </p>
                  </motion.div>

                  {/* Lentilles */}
                  <motion.div 
                    className="bg-white/95 rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-neutral-100"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-semibold text-neutral-900 mb-4 tracking-wide uppercase">Lentilles de contact</h3>
                    <div className="h-1 w-10 bg-amber-200 rounded-full mb-4" />
                    <p className="text-neutral-500 leading-relaxed font-light">
                      Choisir ses lentilles adaptées à votre vue et votre style de vie. Essai gratuit et conseils personnalisés.
                    </p>
                  </motion.div>

                  {/* Recrutement */}
                  <motion.div 
                    className="bg-white/95 rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-neutral-100"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-semibold text-neutral-900 mb-4 tracking-wide uppercase">Nous rejoindre</h3>
                    <div className="h-1 w-10 bg-amber-200 rounded-full mb-4" />
                    <p className="text-neutral-500 leading-relaxed font-light">
                      Rejoignez notre équipe passionnée. Nous recrutons des opticiens qualifiés pour renforcer notre réseau sur l'île.
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ContentReveal;
