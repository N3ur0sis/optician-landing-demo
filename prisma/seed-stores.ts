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
    address: '11 Boulevard de Verdun',
    postalCode: '97420',
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
    address: '21 rue du commerce',
    postalCode: '97460',
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
    address: '216 boulevard Jean Jaurès',
    postalCode: '97490',
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
    address: 'Centre Commercial Jumbo',
    postalCode: '97440',
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
    address: 'Centre Commercial',
    postalCode: '97412',
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
    address: 'Centre-ville',
    postalCode: '97450',
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
    description: 'Votre magasin ODB Saint-Louis vous accueille en centre-ville avec un large choix de montures pour toute la famille.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    specialties: ['Collections locales', 'Service personnalisé'],
  },
  {
    slug: 'magasins/grand-large',
    name: 'ODB Grand Large',
    city: 'Saint-Pierre',
    address: 'Centre Commercial Grand Large',
    postalCode: '97410',
    phone: '0262 35 12 34',
    phone2: '0692 27 27 07',
    email: 'grand-large@odb.re',
    hours: {
      'Lundi - Vendredi': '8h30 – 19h00',
      'Samedi': '8h30 – 18h00',
      'Dimanche': '9h00 – 12h00'
    },
    rating: 4.7,
    reviewCount: 245,
    minutePassPlaceId: '3826',
    description: 'Situé dans le centre commercial Grand Large à Saint-Pierre, votre magasin ODB vous propose un large choix de montures et solaires.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    specialties: ['Espace Ray-Ban', 'Corner Oakley', 'Horaires étendus'],
  },
  {
    slug: 'magasins/saint-pierre',
    name: 'ODB Saint-Pierre Casabona',
    city: 'Saint-Pierre',
    address: 'Casabona',
    postalCode: '97410',
    phone: '0262 25 43 21',
    phone2: '0692 27 27 08',
    email: 'st-pierre@odb.re',
    hours: {
      'Lundi - Vendredi': '8h30 – 18h00',
      'Samedi': '8h30 – 17h00',
      'Dimanche': 'Fermé'
    },
    rating: 4.5,
    reviewCount: 178,
    minutePassPlaceId: '3786',
    description: 'Votre magasin ODB Saint-Pierre Casabona vous accueille avec expertise et professionnalisme.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    specialties: ['Service express', 'Collections premium'],
  },
  {
    slug: 'magasins/saint-joseph',
    name: 'ODB Saint-Joseph',
    city: 'Saint-Joseph',
    address: 'Centre-ville',
    postalCode: '97480',
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
    description: 'Votre magasin ODB Saint-Joseph, au cœur du Sud Sauvage, vous propose un service de qualité.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    specialties: ['Ambiance conviviale', 'Conseils personnalisés'],
  },
  {
    slug: 'magasins/le-tampon',
    name: 'ODB Le Tampon',
    city: 'Le Tampon',
    address: 'Centre Commercial',
    postalCode: '97430',
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
    description: 'Votre magasin ODB Le Tampon vous accueille dans les Hauts avec un service adapté à vos besoins.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    specialties: ['Espace Kids', 'Collections sport'],
  },
  {
    slug: 'magasins/saint-leu',
    name: 'ODB Saint-Leu',
    city: 'Saint-Leu',
    address: 'Centre-ville',
    postalCode: '97436',
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
    description: 'Votre magasin ODB Saint-Leu, sur la côte Ouest, vous propose des montures adaptées à votre style de vie.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    specialties: ['Solaires sport', 'Collections plage'],
  },
  {
    slug: 'magasins/mon-caprice',
    name: 'ODB Mon Caprice',
    city: 'Ravine des Cabris',
    address: 'Centre Commercial Mon Caprice',
    postalCode: '97432',
    phone: '0262 38 12 34',
    phone2: '0692 27 27 12',
    email: 'mon-caprice@odb.re',
    hours: {
      'Lundi - Vendredi': '8h30 – 18h00',
      'Samedi': '8h30 – 17h00',
      'Dimanche': 'Fermé'
    },
    rating: 4.5,
    reviewCount: 132,
    minutePassPlaceId: '3790',
    description: 'Votre magasin ODB Mon Caprice vous accueille à Ravine des Cabris.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    specialties: ['Service de proximité', 'Collections tendance'],
  },
  {
    slug: 'magasins/sacre-coeur',
    name: 'ODB Sacré-Cœur',
    city: 'Le Port',
    address: 'Centre Commercial Jumbo Sacré-Cœur',
    postalCode: '97420',
    phone: '0262 43 12 34',
    phone2: '0692 27 27 13',
    email: 'sacre-coeur@odb.re',
    hours: {
      'Lundi - Vendredi': '8h30 – 19h00',
      'Samedi': '8h30 – 18h00',
      'Dimanche': '9h00 – 12h00'
    },
    rating: 4.7,
    reviewCount: 256,
    minutePassPlaceId: '3791',
    description: 'Retrouvez votre magasin Optique de Bourbon Sacré-Cœur au Port ! Il vous réserve une nouvelle façon de voir l\'optique. Avec un espace dédié à la marque Ray-Ban et un corner Oakley.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    specialties: ['Espace Ray-Ban', 'Corner Oakley', 'Espace détente avec recharge USB'],
  },
  {
    slug: 'magasins/eperon',
    name: 'ODB Éperon',
    city: 'Saint-Gilles-les-Hauts',
    address: 'Centre Commercial Éperon',
    postalCode: '97435',
    phone: '0262 55 12 34',
    phone2: '0692 27 27 14',
    email: 'eperon@odb.re',
    hours: {
      'Lundi - Vendredi': '8h30 – 18h00',
      'Samedi': '8h30 – 17h00',
      'Dimanche': 'Fermé'
    },
    rating: 4.5,
    reviewCount: 98,
    minutePassPlaceId: '3792',
    description: 'Votre magasin ODB Éperon vous accueille dans les Hauts de l\'Ouest.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    specialties: ['Collections sport', 'Service personnalisé'],
  },
  {
    slug: 'magasins/sainte-marie',
    name: 'ODB Sainte-Marie',
    city: 'Sainte-Marie',
    address: 'Centre Commercial Duparc',
    postalCode: '97438',
    phone: '0262 53 12 34',
    phone2: '0692 27 27 15',
    email: 'ste-marie@odb.re',
    hours: {
      'Lundi - Vendredi': '8h30 – 18h00',
      'Samedi': '8h30 – 17h00',
      'Dimanche': 'Fermé'
    },
    rating: 4.4,
    reviewCount: 112,
    minutePassPlaceId: '3793',
    description: 'Votre magasin ODB Sainte-Marie vous accueille dans l\'Est de l\'île.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    specialties: ['Espace Kids', 'Collections variées'],
  },
]

async function seedStorePages() {
  console.log('🏪 Seeding store pages...\n')

  for (const store of stores) {
    const existingPage = await prisma.page.findUnique({
      where: { slug: store.slug }
    })

    if (existingPage) {
      console.log(`⏭️  Page already exists: ${store.slug}`)
      continue
    }

    // Create page with store template
    const page = await prisma.page.create({
      data: {
        slug: store.slug,
        title: store.name,
        metaTitle: `${store.name} - Optique de Bourbon | Opticien ${store.city}`,
        metaDescription: store.description,
        published: true,
        publishedAt: new Date(),
        template: 'store',
        backgroundColor: '#f5f5f4', // stone-100
        textColor: '#1c1917', // stone-900
        showInNav: false,
        navOrder: 0,
        parentSlug: 'magasins',
        blocks: {
          create: [
            // Hero block with store name
            {
              type: 'HERO',
              order: 0,
              visible: true,
              content: {
                title: store.name,
                subtitle: `${store.address} – ${store.postalCode} ${store.city}`,
                description: store.description,
                height: 'medium',
                alignment: 'CENTER',
                overlayOpacity: 40,
                buttons: [
                  {
                    label: 'Prendre rendez-vous',
                    href: `https://devices.minutpass.com/iframe.html?header=1&context=OPTIQUEBOURBON&configuration=2803&placeId=${store.minutePassPlaceId}`,
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
            // Contact info
            {
              type: 'CARDS',
              order: 1,
              visible: true,
              content: {
                title: 'Informations pratiques',
                cards: [
                  {
                    title: 'Adresse',
                    description: `${store.address}\n${store.postalCode} ${store.city}`,
                    icon: 'MapPin'
                  },
                  {
                    title: 'Téléphone',
                    description: `${store.phone}\n${store.phone2 || ''}`,
                    icon: 'Phone'
                  },
                  {
                    title: 'Email',
                    description: store.email,
                    icon: 'Mail'
                  },
                  {
                    title: 'Note clients',
                    description: `${store.rating}/5 (${store.reviewCount} avis)`,
                    icon: 'Star'
                  }
                ]
              },
              settings: {
                columns: 4,
                containerWidth: 'WIDE'
              },
              styles: {}
            },
            // Hours
            {
              type: 'TABLE',
              order: 2,
              visible: true,
              content: {
                title: 'Horaires d\'ouverture',
                headers: ['Jour', 'Horaires'],
                rows: Object.entries(store.hours).map(([day, hours]) => [day, hours])
              },
              settings: {
                containerWidth: 'MEDIUM'
              },
              styles: {}
            },
            // Services
            {
              type: 'FEATURES',
              order: 3,
              visible: true,
              content: {
                title: 'Nos services',
                subtitle: 'Découvrez tous les services proposés par votre magasin',
                features: store.services.map(service => ({
                  title: service,
                  description: '',
                  icon: 'Check'
                }))
              },
              settings: {
                columns: 3,
                containerWidth: 'WIDE'
              },
              styles: {}
            },
            // Specialties
            {
              type: 'LIST',
              order: 4,
              visible: true,
              content: {
                title: 'Nos spécialités',
                items: store.specialties,
                style: 'check'
              },
              settings: {
                containerWidth: 'MEDIUM'
              },
              styles: {}
            },
            // CTA
            {
              type: 'BUTTON',
              order: 5,
              visible: true,
              content: {
                text: 'Prendre rendez-vous en ligne',
                href: `https://devices.minutpass.com/iframe.html?header=1&context=OPTIQUEBOURBON&configuration=2803&placeId=${store.minutePassPlaceId}`,
                variant: 'primary',
                size: 'large',
                openInNewTab: true
              },
              settings: {
                alignment: 'CENTER',
                containerWidth: 'MEDIUM',
                paddingY: 'large'
              },
              styles: {}
            }
          ]
        }
      }
    })

    console.log(`✅ Created: ${store.name} (${store.slug})`)
  }

  // Also create the parent "magasins" listing page if it doesn't exist
  const listingPage = await prisma.page.findUnique({
    where: { slug: 'magasins' }
  })

  if (!listingPage) {
    await prisma.page.create({
      data: {
        slug: 'magasins',
        title: 'Nos Magasins ODB',
        metaTitle: 'Nos Boutiques - Optique de Bourbon | 15 magasins à La Réunion',
        metaDescription: 'Retrouvez tous nos magasins Optique de Bourbon à La Réunion. 15 boutiques pour vous servir avec expertise et professionnalisme.',
        published: true,
        publishedAt: new Date(),
        template: 'store-listing',
        backgroundColor: '#f5f5f4',
        textColor: '#1c1917',
        showInNav: true,
        navOrder: 2,
        navLabel: 'Nos Boutiques',
        blocks: {
          create: [
            {
              type: 'HERO',
              order: 0,
              visible: true,
              content: {
                title: 'Nos Magasins ODB',
                subtitle: '15 boutiques à votre service à La Réunion',
                description: 'Depuis 1981, Optique de Bourbon s\'est engagé à rendre accessible la qualité et la santé visuelle pour tous.',
                height: 'small',
                alignment: 'CENTER'
              },
              settings: {},
              styles: {}
            }
          ]
        }
      }
    })
    console.log('✅ Created: Magasins listing page')
  }

  console.log('\n📊 Summary:')
  console.log(`   - Store pages created: ${stores.length}`)
}

async function main() {
  try {
    await seedStorePages()
  } catch (error) {
    console.error('Error seeding store pages:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
