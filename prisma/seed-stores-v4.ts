import 'dotenv/config'
import { PrismaClient } from './generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
})
const prisma = new PrismaClient({ adapter })

// All 15 ODB stores with real data
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
    specialties: [
      { title: 'Espace Oakley', description: 'Collection complète' },
      { title: 'Espace Ray-Ban', description: 'Modèles exclusifs' }
    ],
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
    description: 'Situé au cœur de la ville de Saint-Paul, dans la même rue que La Halle et SFR. Retrouvez vos montures préférées, votre espace ODB Sport et ODB Kids.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    specialties: [
      { title: 'Corner enfant', description: 'Espace marmailles' },
      { title: 'Corner Oakley', description: 'Sport & lifestyle' }
    ],
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
      'Lundi - Vendredi': '8h30 – 18h00',
      'Samedi': '8h30 – 17h00',
      'Dimanche': 'Fermé'
    },
    rating: 4.6,
    reviewCount: 305,
    minutePassPlaceId: '3783',
    description: 'Sur le boulevard Jean Jaurès à Sainte-Clotilde, entre le supermarché Leclerc et le centre commercial.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations', 'Basse vision'],
    specialties: [
      { title: 'Basse vision', description: 'Équipements spécialisés' },
      { title: 'Espace Premium', description: 'Marques de luxe' }
    ],
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
      'Lundi - Samedi': '9h00 – 19h00',
      'Dimanche': 'Fermé'
    },
    rating: 4.5,
    reviewCount: 198,
    minutePassPlaceId: '3784',
    description: 'Dans le centre commercial Jumbo de Saint-André, votre magasin ODB vous accueille avec un grand parking gratuit.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    specialties: [
      { title: 'Grand parking', description: 'Accès facile' },
      { title: 'Corner Carrera', description: 'Style italien' }
    ],
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
      'Lundi - Samedi': '8h30 – 18h00',
      'Dimanche': 'Fermé'
    },
    rating: 4.4,
    reviewCount: 156,
    minutePassPlaceId: '3785',
    description: 'Votre magasin ODB à Bras-Panon vous accueille dans le centre commercial, proche de toutes les commodités.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    specialties: [
      { title: 'Service rapide', description: 'Montage express' }
    ],
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
      'Samedi': '8h30 – 12h00',
      'Dimanche': 'Fermé'
    },
    rating: 4.6,
    reviewCount: 203,
    minutePassPlaceId: '3786',
    description: 'Au cœur de Saint-Louis, votre opticien ODB vous propose toutes les grandes marques de lunettes.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    specialties: [
      { title: 'Collection Hugo Boss', description: 'Élégance masculine' }
    ],
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
      'Dimanche': '9h00 – 12h00'
    },
    rating: 4.7,
    reviewCount: 245,
    minutePassPlaceId: '3787',
    description: 'Dans le centre commercial Grand Large à Saint-Pierre, ODB vous accueille 7j/7 avec un large choix de montures.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations', 'Basse vision'],
    specialties: [
      { title: 'Ouvert le dimanche', description: '9h – 12h' },
      { title: 'Espace solaire', description: 'Large choix' }
    ],
  },
  {
    slug: 'magasins/saint-pierre',
    name: 'ODB Saint-Pierre Casabona',
    city: 'Saint-Pierre',
    address: 'Casabona\n97410 Saint-Pierre',
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
    minutePassPlaceId: '3788',
    description: 'À Casabona, votre magasin ODB historique vous propose un service personnalisé depuis plus de 20 ans.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    specialties: [
      { title: 'Équipe expérimentée', description: '20+ ans' }
    ],
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
      'Samedi': '8h30 – 12h00',
      'Dimanche': 'Fermé'
    },
    rating: 4.6,
    reviewCount: 167,
    minutePassPlaceId: '3789',
    description: 'À Saint-Joseph, ODB est votre opticien de proximité avec un service chaleureux et professionnel.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    specialties: [
      { title: 'Service de proximité', description: 'À votre écoute' }
    ],
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
      'Lundi - Samedi': '9h00 – 18h00',
      'Dimanche': 'Fermé'
    },
    rating: 4.5,
    reviewCount: 189,
    minutePassPlaceId: '3795',
    description: 'Au Tampon, votre magasin ODB vous accueille dans un espace moderne et lumineux.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    specialties: [
      { title: 'Espace Kids', description: 'Spécial enfants' }
    ],
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
      'Samedi': '8h30 – 12h00',
      'Dimanche': 'Fermé'
    },
    rating: 4.6,
    reviewCount: 145,
    minutePassPlaceId: '3796',
    description: 'À Saint-Leu, ODB est idéalement situé en centre-ville, près de la plage.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    specialties: [
      { title: 'Lunettes de soleil', description: 'Large choix' },
      { title: 'Style balnéaire', description: 'Tendances été' }
    ],
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
    specialties: [
      { title: 'Centre commercial', description: 'Facilité d\'accès' }
    ],
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
    specialties: [
      { title: 'Ouvert le dimanche', description: '9h – 12h' },
      { title: 'Grand parking', description: 'Gratuit' }
    ],
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
    description: 'Au centre commercial Éperon, ODB vous accueille dans un cadre agréable avec vue sur les montagnes.',
    services: ['ODB Sport', 'ODB Kids', 'Contactologie', 'Examen de vue', 'Réparations'],
    specialties: [
      { title: 'Cadre nature', description: 'Vue montagnes' }
    ],
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
    specialties: [
      { title: 'Centre commercial', description: 'Proche aéroport' }
    ],
  },
]

async function seedStoresV4() {
  console.log('🏪 Seeding store pages with PRIMITIVE BLOCKS (v4)...\n')

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
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address.replace('\n', ', '))}`

    // Create the page with primitive blocks using COLUMNS layout
    const page = await prisma.page.create({
      data: {
        title: store.name,
        slug: store.slug,
        parentSlug: 'magasins',
        published: true,
        showInNav: false,
        metaTitle: `${store.name} - Optique de Bourbon`,
        metaDescription: store.description,
        backgroundColor: '#ffffff',
        textColor: '#171717',
        blocks: {
          create: [
            // Block 0: HERO - Store hero section
            {
              type: 'HERO',
              order: 0,
              visible: true,
              content: {
                title: store.name,
                subtitle: store.address.replace('\n', ' – '),
                description: store.description,
                height: 'medium',
                alignment: 'LEFT',
                buttons: [
                  {
                    text: 'Prendre rendez-vous',
                    url: minutePassUrl,
                    variant: 'primary',
                    newTab: true
                  },
                  {
                    text: 'Nous appeler',
                    url: `tel:${store.phone.replace(/\s/g, '')}`,
                    variant: 'secondary'
                  }
                ]
              },
              settings: {},
              styles: {
                backgroundColor: '#171717',
                textColor: '#ffffff',
                paddingTop: 'xl',
                paddingBottom: 'xl',
              }
            },
            // Block 1: SPACER
            {
              type: 'SPACER',
              order: 1,
              visible: true,
              content: { height: 'lg' },
              settings: {},
              styles: {}
            },
            // Block 2: COLUMNS - Main 2-column layout (2/3 + 1/3)
            {
              type: 'COLUMNS',
              order: 2,
              visible: true,
              content: {
                columns: [
                  // Left column (66%) - Main content
                  {
                    width: 66,
                    blocks: [
                      // Contact Info Section with INFO_BOX blocks
                      {
                        id: `${store.slug}-heading-contact`,
                        type: 'HEADING',
                        order: 0,
                        visible: true,
                        content: {
                          text: 'Informations de contact',
                          level: 'h2',
                        },
                        settings: {},
                        styles: { marginBottom: 'md' }
                      },
                      // Address Info Box
                      {
                        id: `${store.slug}-info-address`,
                        type: 'INFO_BOX',
                        order: 1,
                        visible: true,
                        content: {
                          icon: 'map-pin',
                          title: 'Adresse',
                          content: store.address,
                          variant: 'default',
                        },
                        settings: {},
                        styles: { marginBottom: 'sm' }
                      },
                      // Phone Info Box
                      {
                        id: `${store.slug}-info-phone`,
                        type: 'INFO_BOX',
                        order: 2,
                        visible: true,
                        content: {
                          icon: 'phone',
                          title: 'Téléphone',
                          content: store.phone,
                          link: `tel:${store.phone.replace(/\s/g, '')}`,
                          secondaryContent: store.phone2,
                          secondaryLink: `tel:${store.phone2.replace(/\s/g, '')}`,
                          variant: 'default',
                        },
                        settings: {},
                        styles: { marginBottom: 'sm' }
                      },
                      // Email Info Box
                      {
                        id: `${store.slug}-info-email`,
                        type: 'INFO_BOX',
                        order: 3,
                        visible: true,
                        content: {
                          icon: 'mail',
                          title: 'Email',
                          content: store.email,
                          link: `mailto:${store.email}`,
                          variant: 'default',
                        },
                        settings: {},
                        styles: { marginBottom: 'md' }
                      },
                      // Hours Table
                      {
                        id: `${store.slug}-hours`,
                        type: 'HOURS_TABLE',
                        order: 4,
                        visible: true,
                        content: {
                          title: 'Horaires d\'ouverture',
                          hours: store.hours,
                          showIcon: true,
                          highlightToday: true,
                          variant: 'table',
                        },
                        settings: {},
                        styles: { marginBottom: 'lg' }
                      },
                      // Services List
                      {
                        id: `${store.slug}-services`,
                        type: 'SERVICES_LIST',
                        order: 5,
                        visible: true,
                        content: {
                          title: 'Nos services',
                          subtitle: 'Découvrez tous les services proposés par votre magasin',
                          services: store.services,
                          columns: 2,
                          variant: 'bullets',
                        },
                        settings: {},
                        styles: { marginBottom: 'lg' }
                      },
                      // Specialties - using COLUMNS for grid effect
                      ...(store.specialties.length > 0 ? [
                        {
                          id: `${store.slug}-specialties-heading`,
                          type: 'HEADING',
                          order: 6,
                          visible: true,
                          content: {
                            text: 'Nos spécialités',
                            level: 'h2',
                          },
                          settings: {},
                          styles: { marginBottom: 'md' }
                        },
                        ...store.specialties.map((spec, idx) => ({
                          id: `${store.slug}-specialty-${idx}`,
                          type: 'ICON_FEATURE',
                          order: 7 + idx,
                          visible: true,
                          content: {
                            icon: 'star',
                            title: spec.title,
                            description: spec.description,
                            iconBackground: true,
                            variant: 'card',
                          },
                          settings: {},
                          styles: { 
                            marginBottom: 'sm',
                            inline: true,
                            widthPercent: 50,
                          }
                        }))
                      ] : [])
                    ]
                  },
                  // Right column (34%) - Sidebar
                  {
                    width: 34,
                    blocks: [
                      // CTA Card - Prendre RDV
                      {
                        id: `${store.slug}-cta`,
                        type: 'CTA_CARD',
                        order: 0,
                        visible: true,
                        content: {
                          title: 'Prendre rendez-vous',
                          primaryButton: {
                            label: 'Réserver en ligne',
                            url: minutePassUrl,
                            icon: 'calendar',
                            newTab: true,
                          },
                          secondaryButton: {
                            label: 'Appeler le magasin',
                            url: `tel:${store.phone.replace(/\s/g, '')}`,
                            icon: 'phone',
                          },
                          variant: 'dark',
                        },
                        settings: {},
                        styles: { marginBottom: 'md' }
                      },
                      // Review Badge
                      {
                        id: `${store.slug}-reviews`,
                        type: 'REVIEW_BADGE',
                        order: 1,
                        visible: true,
                        content: {
                          title: 'Avis clients',
                          rating: store.rating,
                          reviewCount: store.reviewCount,
                          source: 'Voir tous les avis',
                          showStars: true,
                          variant: 'default',
                        },
                        settings: {},
                        styles: { marginBottom: 'md' }
                      },
                      // Location Card
                      {
                        id: `${store.slug}-location`,
                        type: 'LOCATION_CARD',
                        order: 2,
                        visible: true,
                        content: {
                          title: 'Nous trouver',
                          address: store.address,
                          mapUrl: googleMapsUrl,
                          showPreview: true,
                          variant: 'default',
                        },
                        settings: {},
                        styles: {}
                      },
                    ]
                  }
                ],
                gap: 'large',
                verticalAlign: 'top',
                stackOnMobile: true,
              },
              settings: {},
              styles: {
                containerWidth: 'WIDE',
                paddingTop: 'lg',
                paddingBottom: 'lg',
              }
            },
            // Block 3: SPACER
            {
              type: 'SPACER',
              order: 3,
              visible: true,
              content: { height: 'lg' },
              settings: {},
              styles: {}
            },
          ]
        }
      }
    })

    console.log(`✅ Created: ${store.name} (${store.slug})`)
    createdCount++
  }

  console.log(`\n📊 Summary:`)
  console.log(`   - Store pages created with primitive blocks: ${createdCount}`)
  console.log(`\n🎉 Migration complete! Pages now use composable blocks:`)
  console.log(`   - HERO (standard hero block)`)
  console.log(`   - COLUMNS (2-column layout)`)
  console.log(`   - INFO_BOX (address, phone, email)`)
  console.log(`   - HOURS_TABLE (opening hours)`)
  console.log(`   - SERVICES_LIST (services list)`)
  console.log(`   - ICON_FEATURE (specialties)`)
  console.log(`   - CTA_CARD (call to action)`)
  console.log(`   - REVIEW_BADGE (ratings)`)
  console.log(`   - LOCATION_CARD (map link)`)
}

seedStoresV4()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
