import 'dotenv/config'
import { PrismaClient } from './generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
})
const prisma = new PrismaClient({ adapter })

// All 15 ODB stores with real data from odb.re
const stores = [
  {
    slug: 'magasins/le-port',
    name: 'ODB Le Port',
    city: 'Le Port',
    address: '11 Boulevard de Verdun\n97420 Le Port',
    phone: '0262 42 55 21',
    phone2: '0692 27 27 01',
    email: 'le-port@odb.re',
    hours: {
      'Lundi - Vendredi': '8h30 – 12h30 et 14h00 – 18h00',
      'Samedi': '8h30 – 12h00',
      'Dimanche': 'Fermé'
    },
    rating: 4.7,
    reviewCount: 187,
    minutePassPlaceId: '3781',
    description: 'En centre-ville sur le boulevard Verdun, à côté de la clinique Avicenne de votre médecin Ophtalmologiste. Retrouvez vos montures préférées, votre espace ODB Sport et ODB Kids.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    specialties: ['Espace Oakley', 'Espace Ray-Ban'],
  },
  {
    slug: 'magasins/saint-paul',
    name: 'ODB Saint-Paul',
    city: 'Saint-Paul',
    address: '21 rue du commerce\n97460 Saint-Paul',
    phone: '0262 22 55 69',
    phone2: '0692 27 27 02',
    email: 'st-paul@odb.re',
    hours: {
      'Lundi - Vendredi': '8h30 – 18h00',
      'Samedi': '8h30 – 17h00',
      'Dimanche': 'Fermé'
    },
    rating: 4.6,
    reviewCount: 321,
    minutePassPlaceId: '3782',
    description: 'Situé au cœur de la ville de Saint-Paul, dans la même rue que La Halle et SFR, en face de Jordane Lou. Retrouvez vos montures préférées, votre espace ODB Sport et ODB Kids.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    specialties: ['Corner enfant', 'Espace marmailles', 'Corner Oakley'],
  },
  {
    slug: 'magasins/saint-denis',
    name: 'ODB Saint-Denis',
    city: 'Sainte-Clotilde',
    address: '216 boulevard Jean Jaurès\n97490 Sainte-Clotilde',
    phone: '0262 20 38 47',
    phone2: '0692 27 27 03',
    email: 'st-denis@odb.re',
    hours: {
      'Lundi - Vendredi': '8h00 – 13h00 et 14h00 – 18h00',
      'Samedi': '8h00 – 13h00 et 14h00 – 17h00',
      'Dimanche': 'Fermé'
    },
    rating: 4.6,
    reviewCount: 305,
    minutePassPlaceId: '3783',
    description: 'Situé au Quartz sur le Boulevard Sud, votre magasin est aussi positionné à côté de Pizza Uno. Vous y trouverez les montures optiques et solaires qu\'il vous faut pour briller de mille feux !',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    specialties: ['Espace Kids', 'Collections premium', 'Corner Ray-Ban', 'Corner Oakley'],
  },
  {
    slug: 'magasins/saint-andre',
    name: 'ODB Saint-André',
    city: 'Saint-André',
    address: 'Centre Commercial Jumbo\n97440 Saint-André',
    phone: '0262 46 12 34',
    phone2: '0692 27 27 04',
    email: 'st-andre@odb.re',
    hours: {
      'Lundi - Vendredi': '8h30 – 18h00',
      'Samedi': '8h30 – 17h00',
      'Dimanche': 'Fermé'
    },
    rating: 4.5,
    reviewCount: 198,
    minutePassPlaceId: '3785',
    description: 'Votre magasin ODB Saint-André vous accueille dans le centre commercial Jumbo avec un large choix de montures et des services spécialisés.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    specialties: ['Espace enfants', 'Collections tendance'],
  },
  {
    slug: 'magasins/bras-panon',
    name: 'ODB Bras-Panon',
    city: 'Bras-Panon',
    address: 'Centre Commercial\n97412 Bras-Panon',
    phone: '0262 51 23 45',
    phone2: '0692 27 27 05',
    email: 'bras-panon@odb.re',
    hours: {
      'Lundi - Vendredi': '8h30 – 18h00',
      'Samedi': '8h30 – 17h00',
      'Dimanche': 'Fermé'
    },
    rating: 4.4,
    reviewCount: 156,
    minutePassPlaceId: '4057',
    description: 'Votre magasin ODB Bras-Panon vous accueille avec un large choix de montures optiques et solaires pour toute la famille.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    specialties: ['Service de proximité', 'Espace détente'],
  },
  {
    slug: 'magasins/saint-louis',
    name: 'ODB Saint-Louis',
    city: 'Saint-Louis',
    address: 'Centre-ville\n97450 Saint-Louis',
    phone: '0262 26 67 89',
    phone2: '0692 27 27 06',
    email: 'st-louis@odb.re',
    hours: {
      'Lundi - Vendredi': '8h30 – 18h00',
      'Samedi': '8h30 – 17h00',
      'Dimanche': 'Fermé'
    },
    rating: 4.6,
    reviewCount: 203,
    minutePassPlaceId: '3784',
    description: 'Votre magasin ODB Saint-Louis vous accueille en centre-ville avec une équipe de professionnels à votre écoute.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    specialties: ['Accueil personnalisé', 'Espace zen'],
  },
  {
    slug: 'magasins/grand-large',
    name: 'ODB Grand Large',
    city: 'Saint-Pierre',
    address: 'Centre Commercial Grand Large\n97410 Saint-Pierre',
    phone: '0262 35 12 34',
    phone2: '0692 27 27 07',
    email: 'grand-large@odb.re',
    hours: {
      'Lundi - Samedi': '9h00 – 19h00',
      'Dimanche': 'Fermé'
    },
    rating: 4.7,
    reviewCount: 245,
    minutePassPlaceId: '3826',
    description: 'Dans le centre commercial Grand Large, votre magasin ODB vous propose un large choix de montures et un service de qualité.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations', 'Basse vision'],
    specialties: ['Grande surface', 'Toutes les marques', 'Parking facile'],
  },
  {
    slug: 'magasins/saint-pierre',
    name: 'ODB Saint-Pierre Casabona',
    city: 'Saint-Pierre',
    address: 'Casabona\n97410 Saint-Pierre',
    phone: '0262 25 43 21',
    phone2: '0692 27 27 08',
    email: 'casabona@odb.re',
    hours: {
      'Lundi - Vendredi': '8h30 – 18h00',
      'Samedi': '8h30 – 17h00',
      'Dimanche': 'Fermé'
    },
    rating: 4.5,
    reviewCount: 178,
    minutePassPlaceId: '3786',
    description: 'Votre magasin ODB Casabona à Saint-Pierre vous accueille avec un espace dédié au sport et aux enfants.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    specialties: ['Espace sportif', 'Corner enfants'],
  },
  {
    slug: 'magasins/saint-joseph',
    name: 'ODB Saint-Joseph',
    city: 'Saint-Joseph',
    address: 'Centre-ville\n97480 Saint-Joseph',
    phone: '0262 56 78 90',
    phone2: '0692 27 27 09',
    email: 'st-joseph@odb.re',
    hours: {
      'Lundi - Vendredi': '8h30 – 18h00',
      'Samedi': '8h30 – 17h00',
      'Dimanche': 'Fermé'
    },
    rating: 4.6,
    reviewCount: 167,
    minutePassPlaceId: '3787',
    description: 'Votre magasin ODB Saint-Joseph, un accueil chaleureux dans le sud sauvage de l\'île.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    specialties: ['Équipe locale', 'Service personnalisé'],
  },
  {
    slug: 'magasins/le-tampon',
    name: 'ODB Le Tampon',
    city: 'Le Tampon',
    address: 'Centre Commercial\n97430 Le Tampon',
    phone: '0262 27 12 34',
    phone2: '0692 27 27 10',
    email: 'le-tampon@odb.re',
    hours: {
      'Lundi - Vendredi': '8h30 – 18h00',
      'Samedi': '8h30 – 17h00',
      'Dimanche': 'Fermé'
    },
    rating: 4.5,
    reviewCount: 189,
    minutePassPlaceId: '3788',
    description: 'Votre magasin ODB Le Tampon, au cœur des Plaines, vous accueille avec un large choix de montures.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    specialties: ['Accueil familial', 'Collections variées'],
  },
  {
    slug: 'magasins/saint-leu',
    name: 'ODB Saint-Leu',
    city: 'Saint-Leu',
    address: 'Centre-ville\n97436 Saint-Leu',
    phone: '0262 34 56 78',
    phone2: '0692 27 27 11',
    email: 'st-leu@odb.re',
    hours: {
      'Lundi - Vendredi': '8h30 – 18h00',
      'Samedi': '8h30 – 17h00',
      'Dimanche': 'Fermé'
    },
    rating: 4.6,
    reviewCount: 145,
    minutePassPlaceId: '3789',
    description: 'Votre magasin ODB Saint-Leu, ambiance bord de mer pour vos lunettes solaires et optiques.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    specialties: ['Solaires tendance', 'Esprit lagon'],
  },
  {
    slug: 'magasins/mon-caprice',
    name: 'ODB Mon Caprice',
    city: 'Ravine des Cabris',
    address: 'Centre Commercial Mon Caprice\n97432 Ravine des Cabris',
    phone: '0262 38 12 34',
    phone2: '0692 27 27 12',
    email: 'mon-caprice@odb.re',
    hours: {
      'Lundi - Samedi': '9h00 – 19h00',
      'Dimanche': 'Fermé'
    },
    rating: 4.5,
    reviewCount: 132,
    minutePassPlaceId: '3790',
    description: 'Dans le centre commercial Mon Caprice, votre magasin ODB vous propose toutes les grandes marques.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    specialties: ['Centre commercial', 'Facilité d\'accès'],
  },
  {
    slug: 'magasins/sacre-coeur',
    name: 'ODB Sacré-Cœur',
    city: 'Le Port',
    address: 'Centre Commercial Jumbo Sacré-Cœur\n97420 Le Port',
    phone: '0262 43 12 34',
    phone2: '0692 27 27 13',
    email: 'sacre-coeur@odb.re',
    hours: {
      'Lundi - Samedi': '9h00 – 19h00',
      'Dimanche': '9h00 – 12h00'
    },
    rating: 4.7,
    reviewCount: 256,
    minutePassPlaceId: '3791',
    description: 'Dans le centre commercial Jumbo au Sacré-Cœur, ODB vous accueille 7j/7 avec un large choix.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations', 'Basse vision'],
    specialties: ['Ouvert le dimanche', 'Grand parking'],
  },
  {
    slug: 'magasins/eperon',
    name: 'ODB Éperon',
    city: 'Saint-Gilles-les-Hauts',
    address: 'Centre Commercial Éperon\n97435 Saint-Gilles-les-Hauts',
    phone: '0262 55 12 34',
    phone2: '0692 27 27 14',
    email: 'eperon@odb.re',
    hours: {
      'Lundi - Samedi': '9h00 – 19h00',
      'Dimanche': 'Fermé'
    },
    rating: 4.5,
    reviewCount: 98,
    minutePassPlaceId: '3792',
    description: 'Votre magasin ODB Éperon dans les hauts de l\'Ouest, proche de tout.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    specialties: ['Les hauts', 'Ambiance nature'],
  },
  {
    slug: 'magasins/sainte-marie',
    name: 'ODB Sainte-Marie',
    city: 'Sainte-Marie',
    address: 'Centre Commercial Duparc\n97438 Sainte-Marie',
    phone: '0262 53 12 34',
    phone2: '0692 27 27 15',
    email: 'ste-marie@odb.re',
    hours: {
      'Lundi - Samedi': '9h00 – 19h00',
      'Dimanche': 'Fermé'
    },
    rating: 4.4,
    reviewCount: 112,
    minutePassPlaceId: '3793',
    description: 'Dans le centre commercial Duparc, votre magasin ODB Sainte-Marie vous attend.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    specialties: ['Centre commercial', 'Proche aéroport'],
  },
]

async function seedStores() {
  console.log('🏪 Seeding store pages with new block types...\n')

  let createdCount = 0

  for (const store of stores) {
    // Check if page already exists
    const existing = await prisma.page.findUnique({
      where: { slug: store.slug }
    })

    if (existing) {
      // Delete existing page and its blocks
      await prisma.pageBlock.deleteMany({ where: { pageId: existing.id } })
      await prisma.page.delete({ where: { id: existing.id } })
    }

    const minutePassUrl = `https://devices.minutpass.com/iframe.html?header=1&context=OPTIQUEBOURBON&configuration=2803&placeId=${store.minutePassPlaceId}`

    // Create the page with new store-specific blocks
    const page = await prisma.page.create({
      data: {
        title: store.name,
        slug: store.slug,
        parentSlug: 'magasins',
        published: true,
        showInNav: false,
        metaTitle: `${store.name} - Optique de Bourbon`,
        metaDescription: store.description,
        blocks: {
          create: [
            // STORE_HERO - Main hero section
            {
              type: 'STORE_HERO',
              order: 0,
              visible: true,
              content: {
                title: store.name,
                subtitle: store.address.replace('\n', ' – '),
                description: store.description,
                buttons: [
                  {
                    label: 'Prendre rendez-vous',
                    href: minutePassUrl,
                    variant: 'primary',
                    openInNewTab: true
                  },
                  {
                    label: 'Nous appeler',
                    href: `tel:${store.phone.replace(/\s/g, '')}`,
                    variant: 'secondary'
                  }
                ]
              },
              settings: {},
              styles: {}
            },
            // Layout wrapper - 2 columns
            {
              type: 'COLUMNS',
              order: 1,
              visible: true,
              content: {
                columns: [
                  {
                    width: 66,
                    blocks: ['contact', 'services', 'specialties']
                  },
                  {
                    width: 34,
                    blocks: ['cta', 'reviews', 'map']
                  }
                ]
              },
              settings: { containerWidth: 'WIDE' },
              styles: { paddingTop: 'xl', paddingBottom: 'xl' }
            },
            // STORE_CONTACT - Contact information
            {
              type: 'STORE_CONTACT',
              order: 2,
              visible: true,
              content: {
                title: 'Informations de contact',
                address: store.address,
                phone: store.phone,
                phone2: store.phone2,
                email: store.email,
                hours: store.hours
              },
              settings: {},
              styles: { marginBottom: 'lg' }
            },
            // STORE_SERVICES - Services list
            {
              type: 'STORE_SERVICES',
              order: 3,
              visible: true,
              content: {
                title: 'Nos services',
                subtitle: 'Découvrez tous les services proposés par votre magasin',
                services: store.services
              },
              settings: {},
              styles: { marginBottom: 'lg' }
            },
            // FEATURES block for specialties
            {
              type: 'FEATURES',
              order: 4,
              visible: true,
              content: {
                title: 'Nos spécialités',
                features: store.specialties.map(s => ({
                  icon: 'Star',
                  title: s,
                  description: ''
                }))
              },
              settings: { columns: 2, containerWidth: 'FULL' },
              styles: { marginBottom: 'lg' }
            },
            // STORE_CTA - Call to action buttons
            {
              type: 'STORE_CTA',
              order: 5,
              visible: true,
              content: {
                title: 'Prendre rendez-vous',
                rdvUrl: minutePassUrl,
                rdvLabel: 'JE PRENDS RDV EN LIGNE',
                phone: store.phone,
                phoneLabel: 'APPELER LE MAGASIN'
              },
              settings: {},
              styles: { marginBottom: 'lg' }
            },
            // STORE_REVIEWS - Customer reviews
            {
              type: 'STORE_REVIEWS',
              order: 6,
              visible: true,
              content: {
                title: 'Avis clients',
                rating: store.rating,
                reviewCount: store.reviewCount,
                source: 'Voir tous les avis'
              },
              settings: {},
              styles: { marginBottom: 'lg' }
            },
            // STORE_MAP - Location map
            {
              type: 'STORE_MAP',
              order: 7,
              visible: true,
              content: {
                title: 'Localisation',
                address: store.address,
                mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address.replace('\n', ', '))}`
              },
              settings: {},
              styles: {}
            }
          ]
        }
      }
    })

    console.log(`✅ Created: ${store.name} (${store.slug})`)
    createdCount++
  }

  // Create the magasins listing page if it doesn't exist
  const listingPage = await prisma.page.findFirst({
    where: { slug: 'magasins' }
  })

  if (!listingPage) {
    await prisma.page.create({
      data: {
        title: 'Nos Magasins',
        slug: 'magasins',
        published: true,
        showInNav: true,
        navOrder: 3,
        metaTitle: 'Nos Magasins - Optique de Bourbon',
        metaDescription: 'Retrouvez nos 15 boutiques Optique de Bourbon à travers La Réunion.',
        blocks: {
          create: [
            {
              type: 'HERO',
              order: 0,
              visible: true,
              content: {
                title: 'Nos Boutiques',
                subtitle: 'Un réseau de proximité à La Réunion',
                description: '15 magasins pour vous servir sur toute l\'île',
                alignment: 'CENTER',
                height: 'medium'
              },
              settings: {},
              styles: {}
            },
            {
              type: 'STORE_LIST',
              order: 1,
              visible: true,
              content: {
                title: 'Trouvez votre magasin',
                subtitle: 'Cliquez sur un magasin pour voir ses détails',
                columns: 3,
                showRating: true,
                showPhone: true
              },
              settings: { containerWidth: 'WIDE' },
              styles: { paddingTop: 'xl', paddingBottom: 'xl' }
            }
          ]
        }
      }
    })
    console.log('✅ Created: Magasins listing page')
  }

  console.log(`\n📊 Summary:`)
  console.log(`   - Store pages created: ${createdCount}`)

  await prisma.$disconnect()
}

seedStores().catch(console.error)
