'use client';

import PageNavigation from '../../components/PageNavigation';
import { motion } from 'framer-motion';

const articles = [
  {
    title: 'Sélection solaires printemps',
    excerpt: 'Inspirations couleur sable et montures translucides pour capter la lumière réunionnaise.',
    category: 'Style',
    image: 'url(https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80)',
    date: '15 Mars 2024',
    readTime: '3 min'
  },
  {
    title: 'Notre atelier de montage',
    excerpt: 'Zoom sur les étapes de fabrication et le contrôle qualité de vos verres.',
    category: 'Maison',
    image: 'url(https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=800&q=80)',
    date: '8 Mars 2024',
    readTime: '5 min'
  },
  {
    title: 'Rencontre avec Coralie',
    excerpt: 'Opticienne depuis 12 ans, elle partage ses conseils pour choisir ses progressifs.',
    category: 'Rencontres',
    image: 'url(https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=800&q=80)',
    date: '1 Mars 2024',
    readTime: '4 min'
  },
  {
    title: 'Tendances automne-hiver',
    excerpt: 'Les matières et formes qui définiront votre style cette saison.',
    category: 'Style',
    image: 'url(https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=800&q=80)',
    date: '22 Février 2024',
    readTime: '3 min'
  },
];

const MagazinePage = () => {
  return (
    <main className="min-h-screen bg-black text-white">
      <PageNavigation title="Actualités" subtitle="Le journal ODB" />
      
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
              <p className="text-white/60 text-sm tracking-[0.3em] uppercase mb-4">Journal ODB</p>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight mb-8">
                Histoires et inspirations
              </h1>
              <p className="text-xl text-white/80 leading-relaxed max-w-3xl">
                Articles courts pour suivre nos nouveautés, comprendre nos expertises et rencontrer celles et ceux qui donnent vie à
                nos maisons.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {articles.map((article, index) => (
              <motion.article
                key={article.title}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group border border-white/10 hover:border-white/30 transition-all duration-500 overflow-hidden hover:shadow-2xl hover:shadow-white/5 cursor-pointer"
              >
                {/* Featured Image */}
                <div
                  className="aspect-[16/10] bg-cover bg-center relative group-hover:scale-105 transition-transform duration-700"
                  style={{
                    backgroundImage: article.image,
                  }}
                >
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-500" />
                  
                  {/* Category Tag */}
                  <div className="absolute top-6 left-6">
                    <div className="bg-white/10 backdrop-blur-sm px-3 py-1 text-xs font-medium tracking-[0.2em] text-white uppercase">
                      {article.category}
                    </div>
                  </div>
                  
                  {/* Reading Time */}
                  <div className="absolute top-6 right-6">
                    <div className="bg-black/30 backdrop-blur-sm px-3 py-1 text-xs text-white/80">
                      {article.readTime}
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-8">
                  <div className="flex items-center text-white/50 text-sm mb-4">
                    <span>{article.date}</span>
                  </div>
                  
                  <h2 className="text-2xl font-bold tracking-tight mb-4 group-hover:text-white/90 transition-colors duration-300">
                    {article.title}
                  </h2>
                  
                  <p className="text-white/70 leading-relaxed mb-6">
                    {article.excerpt}
                  </p>
                  
                  {/* Read More CTA */}
                  <div className="flex items-center text-white/60 group-hover:text-white transition-colors duration-300">
                    <span className="text-sm font-medium tracking-[0.15em] uppercase mr-3">
                      Lire l'article
                    </span>
                    <div className="flex items-center space-x-1 transform group-hover:translate-x-2 transition-transform duration-300">
                      <div className="w-8 h-px bg-current"></div>
                      <div className="w-0 h-0 border-l-[6px] border-l-current border-y-[3px] border-y-transparent"></div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-bold tracking-tight">Restez informé</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Recevez nos dernières actualités, conseils d'experts et offres exclusives directement dans votre boîte mail.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors duration-200"
              />
              <button className="px-8 py-3 bg-white text-black font-medium text-sm uppercase tracking-[0.1em] hover:bg-white/90 transition-colors duration-200">
                S'abonner
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default MagazinePage;
