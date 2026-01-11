// Seed script to migrate existing static pages to dynamic CMS pages
// Run with: npx tsx prisma/seed-pages.ts
import 'dotenv/config'

import { PrismaClient } from './generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🚀 Starting page migration...');

  // Maison Page
  const maisonPage = await prisma.page.upsert({
    where: { slug: '/maison' },
    update: {},
    create: {
      slug: '/maison',
      title: 'Qui est ODB ?',
      metaTitle: 'Qui est ODB ? | Optique de Bourbon',
      metaDescription: 'Découvrez notre maison, nos valeurs et notre histoire depuis plus de 40 ans.',
      published: true,
      publishedAt: new Date(),
      template: 'default',
      backgroundColor: '#000000',
      textColor: '#ffffff',
      showInNav: true,
      navOrder: 1,
      navLabel: 'La Maison',
      blocks: {
        create: [
          {
            type: 'HERO',
            order: 0,
            content: {
              title: "L'histoire de la maison",
              subtitle: 'Optique de Bourbon',
              description: "Depuis plus de quarante ans, notre équipe d'opticiens mêle expertise santé, créativité et sélection de montures d'exception pour révéler chaque regard. Découvrez nos valeurs, nos ateliers et les personnalités qui donnent vie à l'expérience ODB.",
              height: 'medium',
              alignment: 'LEFT',
            },
            styles: {
              paddingTop: 'xl',
              paddingBottom: 'xl',
              containerWidth: 'WIDE',
            },
            visible: true,
          },
          {
            type: 'CARDS',
            order: 1,
            content: {
              cards: [
                {
                  title: 'Nos engagements',
                  description: 'Qualité, transparence et proximité au cœur de notre accompagnement quotidien.',
                  image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=800&q=80',
                  link: '/services',
                },
                {
                  title: "Rencontrer l'équipe",
                  description: "Portraits de nos opticiennes et opticiens qui façonnent l'expérience ODB.",
                  image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=800&q=80',
                  link: '/magazine',
                },
                {
                  title: 'Notre histoire',
                  description: "Quarante années d'expertise au service de votre vision et de votre style.",
                  image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
                  link: '/notre-histoire',
                },
              ],
              columns: 3,
              variant: 'bordered',
            },
            styles: {
              paddingTop: 'xl',
              paddingBottom: 'xl',
              containerWidth: 'WIDE',
            },
            visible: true,
          },
        ],
      },
    },
  });
  console.log('✅ Created/updated page:', maisonPage.slug);

  // Services Page
  const servicesPage = await prisma.page.upsert({
    where: { slug: '/services' },
    update: {},
    create: {
      slug: '/services',
      title: 'Services',
      metaTitle: 'Nos Services | Optique de Bourbon',
      metaDescription: 'Découvrez nos services : examen de vue, adaptation lentilles, atelier stylisme et bien plus.',
      published: true,
      publishedAt: new Date(),
      template: 'default',
      backgroundColor: '#000000',
      textColor: '#ffffff',
      showInNav: true,
      navOrder: 2,
      navLabel: 'Services',
      blocks: {
        create: [
          {
            type: 'HERO',
            order: 0,
            content: {
              title: "L'accompagnement Optique de Bourbon",
              subtitle: 'Services & soins visuels',
              description: "De la prévention enfant à la performance sportive, nos opticiens diplômés orchestrent un parcours sur mesure pour votre santé visuelle et votre style.",
              height: 'medium',
              alignment: 'LEFT',
            },
            styles: {
              paddingTop: 'xl',
              paddingBottom: 'xl',
              containerWidth: 'WIDE',
            },
            visible: true,
          },
          {
            type: 'FEATURES',
            order: 1,
            content: {
              features: [
                {
                  title: 'Examen de la vue',
                  description: "Bilans complets avec technologies de dernière génération, renouvellement d'ordonnance et suivi médical coordonné.",
                },
                {
                  title: 'Adaptation lentilles',
                  description: 'Essais, apprentissage à la manipulation, lentilles techniques pour sport et solutions de confort prolongé.',
                },
                {
                  title: 'Atelier stylisme',
                  description: 'Sélection de montures en fonction de votre morphologie, de votre palette de couleurs et de votre quotidien.',
                },
                {
                  title: 'Atelier de montage',
                  description: 'Fabrication de vos verres en 1h selon correction, ajustements morphologiques et finitions premium.',
                },
                {
                  title: 'Services après-vente',
                  description: "Réglages illimités, nettoyage ultrason, réparations et contrôle de la vision toute l'année.",
                },
                {
                  title: 'Programmes entreprise',
                  description: 'Solutions optiques pour vos équipes, tri par métiers, accompagnement santé visuelle sur site.',
                },
              ],
              columns: 3,
              layout: 'cards',
            },
            styles: {
              paddingTop: 'xl',
              paddingBottom: 'xl',
              containerWidth: 'WIDE',
            },
            visible: true,
          },
        ],
      },
    },
  });
  console.log('✅ Created/updated page:', servicesPage.slug);

  // Magazine Page
  const magazinePage = await prisma.page.upsert({
    where: { slug: '/magazine' },
    update: {},
    create: {
      slug: '/magazine',
      title: 'Actualités',
      metaTitle: 'Journal ODB | Optique de Bourbon',
      metaDescription: 'Articles courts pour suivre nos nouveautés, comprendre nos expertises et rencontrer notre équipe.',
      published: true,
      publishedAt: new Date(),
      template: 'default',
      backgroundColor: '#000000',
      textColor: '#ffffff',
      showInNav: true,
      navOrder: 3,
      navLabel: 'Magazine',
      blocks: {
        create: [
          {
            type: 'HERO',
            order: 0,
            content: {
              title: 'Histoires et inspirations',
              subtitle: 'Journal ODB',
              description: 'Articles courts pour suivre nos nouveautés, comprendre nos expertises et rencontrer celles et ceux qui donnent vie à nos maisons.',
              height: 'medium',
              alignment: 'LEFT',
            },
            styles: {
              paddingTop: 'xl',
              paddingBottom: 'xl',
              containerWidth: 'WIDE',
            },
            visible: true,
          },
          {
            type: 'CARDS',
            order: 1,
            content: {
              cards: [
                {
                  title: 'Sélection solaires printemps',
                  description: 'Inspirations couleur sable et montures translucides pour capter la lumière réunionnaise.',
                  image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80',
                },
                {
                  title: 'Notre atelier de montage',
                  description: 'Zoom sur les étapes de fabrication et le contrôle qualité de vos verres.',
                  image: 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=800&q=80',
                },
                {
                  title: 'Rencontre avec Coralie',
                  description: 'Opticienne depuis 12 ans, elle partage ses conseils pour choisir ses progressifs.',
                  image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=800&q=80',
                },
                {
                  title: 'Tendances automne-hiver',
                  description: 'Les matières et formes qui définiront votre style cette saison.',
                  image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=800&q=80',
                },
              ],
              columns: 2,
              variant: 'bordered',
            },
            styles: {
              paddingTop: 'lg',
              paddingBottom: 'xl',
              containerWidth: 'WIDE',
            },
            visible: true,
          },
        ],
      },
    },
  });
  console.log('✅ Created/updated page:', magazinePage.slug);

  // Notre Histoire Page
  const histoirePage = await prisma.page.upsert({
    where: { slug: '/notre-histoire' },
    update: {},
    create: {
      slug: '/notre-histoire',
      title: 'Notre Histoire',
      metaTitle: 'Notre Histoire | Optique de Bourbon',
      metaDescription: 'Découvrez 40 ans d\'histoire, 14 boutiques et plus de 200 collaborateurs au service de votre vision.',
      published: true,
      publishedAt: new Date(),
      template: 'default',
      backgroundColor: '#000000',
      textColor: '#ffffff',
      showInNav: true,
      navOrder: 4,
      navLabel: 'Notre Histoire',
      blocks: {
        create: [
          {
            type: 'HERO',
            order: 0,
            content: {
              title: 'Tout commence...',
              height: 'medium',
              alignment: 'CENTER',
            },
            styles: {
              paddingTop: 'xl',
              paddingBottom: 'lg',
            },
            visible: true,
          },
          {
            type: 'STATS',
            order: 1,
            content: {
              stats: [
                { value: '40+', label: "années d'expériences" },
                { value: '14', label: 'boutiques' },
                { value: '+200', label: 'collaborateurs' },
                { value: '30+', label: 'marques partenaires' },
              ],
              columns: 4,
            },
            styles: {
              paddingTop: 'lg',
              paddingBottom: 'xl',
              containerWidth: 'MEDIUM',
            },
            visible: true,
          },
          {
            type: 'TEXT',
            order: 2,
            content: {
              html: `<h2>Notre histoire</h2>
<p>Depuis plus de 40 ans, Optique de Bourbon accompagne les Réunionnais dans le soin de leur vision. Notre engagement envers l'excellence et le service personnalisé nous a permis de devenir une référence de l'optique à La Réunion.</p>
<p>Avec 14 boutiques réparties sur l'île et une équipe de plus de 200 collaborateurs passionnés, nous sommes au plus près de vous pour répondre à tous vos besoins en matière de vision et d'esthétique.</p>`,
            },
            styles: {
              paddingTop: 'lg',
              paddingBottom: 'xl',
              containerWidth: 'MEDIUM',
            },
            visible: true,
          },
        ],
      },
    },
  });
  console.log('✅ Created/updated page:', histoirePage.slug);

  // Créateurs Page
  const createursPage = await prisma.page.upsert({
    where: { slug: '/collections/createurs' },
    update: {},
    create: {
      slug: '/collections/createurs',
      title: 'Créateurs',
      metaTitle: 'Sélection Créateurs | Optique de Bourbon',
      metaDescription: 'Pièces rares, éditions limitées et montures iconiques sélectionnées pour leur savoir-faire.',
      published: true,
      publishedAt: new Date(),
      template: 'default',
      backgroundColor: '#000000',
      textColor: '#ffffff',
      showInNav: true,
      navOrder: 5,
      navLabel: 'Créateurs',
      parentSlug: '/collections',
      blocks: {
        create: [
          {
            type: 'HERO',
            order: 0,
            content: {
              title: 'Les maisons que nous représentons',
              subtitle: 'Sélection signature',
              description: "Pièces rares, éditions limitées et montures iconiques, sélectionnées pour leur savoir-faire, leur créativité et l'émotion qu'elles procurent à ceux qui les portent.",
              height: 'medium',
              alignment: 'LEFT',
            },
            styles: {
              paddingTop: 'xl',
              paddingBottom: 'xl',
              containerWidth: 'WIDE',
            },
            visible: true,
          },
          {
            type: 'CARDS',
            order: 1,
            content: {
              cards: [
                {
                  title: 'AHLEM',
                  description: 'Lignes intemporelles, acétate poli à la main et verres minéraux qui magnifient la lumière réunionnaise.',
                  image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
                },
                {
                  title: 'Anne & Valentin',
                  description: 'Couleurs vitaminées et géométries audacieuses pour souligner chaque tempérament.',
                  image: 'https://images.unsplash.com/photo-1568043210943-0f131e8fc698?auto=format&fit=crop&w=900&q=80',
                },
                {
                  title: 'Kuboraum',
                  description: 'Masques sculpturaux façonnés comme des objets de collection, pour personnalités affirmées.',
                  image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
                },
                {
                  title: 'Mykita',
                  description: 'Technicité allemande, charnières brevetées et silhouettes ultra légères en acier inoxydable.',
                  image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80',
                },
              ],
              columns: 2,
              variant: 'default',
            },
            styles: {
              paddingTop: 'lg',
              paddingBottom: 'xl',
              containerWidth: 'WIDE',
            },
            visible: true,
          },
        ],
      },
    },
  });
  console.log('✅ Created/updated page:', createursPage.slug);

  // Prendre RDV Page
  const rdvPage = await prisma.page.upsert({
    where: { slug: '/prendre-rendez-vous' },
    update: {},
    create: {
      slug: '/prendre-rendez-vous',
      title: 'Prendre rendez-vous',
      metaTitle: 'Prendre rendez-vous | Optique de Bourbon',
      metaDescription: 'Prenez rendez-vous en ligne avec nos opticiens pour un service personnalisé.',
      published: true,
      publishedAt: new Date(),
      template: 'default',
      backgroundColor: '#000000',
      textColor: '#ffffff',
      showInNav: true,
      navOrder: 6,
      navLabel: 'Rendez-vous',
      blocks: {
        create: [
          {
            type: 'HERO',
            order: 0,
            content: {
              title: 'Réservez votre rendez-vous',
              description: 'Prenez rendez-vous en ligne avec nos opticiens pour un service personnalisé',
              height: 'small',
              alignment: 'CENTER',
            },
            styles: {
              paddingTop: 'xl',
              paddingBottom: 'md',
            },
            visible: true,
          },
          {
            type: 'IFRAME',
            order: 1,
            content: {
              url: 'https://devices.minutpass.com/iframe.html?header=1&context=OPTIQUEBOURBON&configuration=2803',
              height: 800,
              title: 'Prendre rendez-vous avec Optique de Bourbon',
            },
            styles: {
              paddingTop: 'md',
              paddingBottom: 'xl',
              containerWidth: 'WIDE',
            },
            visible: true,
          },
        ],
      },
    },
  });
  console.log('✅ Created/updated page:', rdvPage.slug);

  console.log('🎉 Page migration completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during migration:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
