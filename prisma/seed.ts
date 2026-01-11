import 'dotenv/config'
import { PrismaClient } from './generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
})
const prisma = new PrismaClient({ adapter })

// Image placeholder par défaut
const PLACEHOLDER_IMAGE = '/images/placeholder.svg'

// Données des boutiques ODB (source: odb.re)
const STORES_DATA = [
  {
    slug: 'odb-le-port',
    name: 'ODB Le Port',
    address: '11 Boulevard de Verdun',
    city: 'Le Port',
    postalCode: '97420',
    phone: '0262 42 55 21',
    phone2: '0692 27 27 01',
    email: 'le-port@odb.re',
    hours: 'Lundi au vendredi : 8h30 – 12h30 et 14h00 – 18h00\nSamedi : 8h30 – 12h00',
    minutpassId: '3781',
    trustvilleUrl: 'https://trustville.com/avis-clients/pc/vXb7Zz/optique_et_audition/le_port/odb_le_port_centre-ville',
    rating: 4.7,
    reviewCount: 192,
    features: ['ODB Sport', 'ODB Kids', 'Espace Oakley', 'Espace Ray-Ban'],
    description: 'Retrouvez vos montures préférées, votre espace ODB Sport et ODB Kids chez ODB Le Port. En centre-ville sur le boulevard Verdun, à côté de la clinique Avicenne.',
  },
  {
    slug: 'odb-saint-paul',
    name: 'ODB Saint-Paul',
    address: 'Centre Commercial',
    city: 'Saint-Paul',
    postalCode: '97460',
    phone: '0262 45 XX XX',
    phone2: '0692 27 27 02',
    email: 'st-paul@odb.re',
    hours: 'Lundi au vendredi : 8h30 – 12h30 et 14h00 – 18h00\nSamedi : 8h30 – 12h00',
    minutpassId: '3782',
    features: ['ODB Kids', 'Espace Ray-Ban'],
    description: 'Votre magasin ODB Saint-Paul vous accueille avec une équipe expérimentée pour tous vos besoins optiques.',
  },
  {
    slug: 'odb-saint-denis',
    name: 'ODB Saint-Denis',
    address: '216 boulevard Jean Jaurès',
    city: 'Sainte-Clotilde',
    postalCode: '97490',
    phone: '0262 20 38 47',
    phone2: '0692 27 27 03',
    email: 'st-denis@odb.re',
    hours: 'Lundi au vendredi : 8h00 – 13h00 et 14h00 – 18h00\nSamedi : 8h00 – 13h00 et 14h00 – 17h00',
    minutpassId: '3783',
    trustvilleUrl: 'https://trustville.com/avis-clients/pc/cBLsve/optique_et_audition/re/odb_saint-denis',
    rating: 4.6,
    reviewCount: 308,
    features: ['ODB Kids', 'Espace Ray-Ban', 'Espace Oakley', 'Espace détente'],
    description: 'Situé au Quartz sur le Boulevard Sud, votre magasin est positionné à côté de Pizza Uno. Vous y trouverez les montures optiques et solaires qu\'il vous faut pour briller de mille feux !',
  },
  {
    slug: 'odb-saint-andre',
    name: 'ODB Saint-André',
    address: 'Centre Commercial',
    city: 'Saint-André',
    postalCode: '97440',
    phone: '0262 XX XX XX',
    phone2: '0692 27 27 04',
    email: 'st-andre@odb.re',
    hours: 'Lundi au vendredi : 8h30 – 12h30 et 14h00 – 18h00\nSamedi : 8h30 – 12h00',
    minutpassId: '3785',
    features: ['ODB Kids'],
    description: 'Dans l\'est de l\'île, une équipe chaleureuse et un large choix de montures vous attendent.',
  },
  {
    slug: 'odb-bras-panon',
    name: 'ODB Bras-Panon',
    address: 'Centre Commercial',
    city: 'Bras-Panon',
    postalCode: '97412',
    phone: '0262 XX XX XX',
    email: 'bras-panon@odb.re',
    hours: 'Lundi au vendredi : 8h30 – 12h30 et 14h00 – 18h00\nSamedi : 8h30 – 12h00',
    minutpassId: '4057',
    features: [],
    description: 'Votre magasin ODB Bras-Panon, au service de votre vision.',
  },
  {
    slug: 'odb-saint-louis',
    name: 'ODB Saint-Louis',
    address: 'Centre Commercial',
    city: 'Saint-Louis',
    postalCode: '97450',
    phone: '0262 XX XX XX',
    email: 'st-louis@odb.re',
    hours: 'Lundi au vendredi : 8h30 – 12h30 et 14h00 – 18h00\nSamedi : 8h30 – 12h00',
    minutpassId: '3784',
    features: [],
    description: 'Votre magasin ODB Saint-Louis vous accueille.',
  },
  {
    slug: 'odb-saint-pierre',
    name: 'ODB Saint-Pierre Casabona',
    address: 'Centre Commercial Casabona',
    city: 'Saint-Pierre',
    postalCode: '97410',
    phone: '0262 XX XX XX',
    email: 'st-pierre@odb.re',
    hours: 'Lundi au vendredi : 8h30 – 12h30 et 14h00 – 18h00\nSamedi : 8h30 – 12h00',
    minutpassId: '3786',
    features: ['ODB Sport', 'ODB Kids'],
    description: 'Votre magasin ODB Saint-Pierre Casabona, spécialisé dans les montures sport et solaires.',
  },
  {
    slug: 'odb-saint-joseph',
    name: 'ODB Saint-Joseph',
    address: 'Centre-Ville',
    city: 'Saint-Joseph',
    postalCode: '97480',
    phone: '0262 XX XX XX',
    email: 'st-joseph@odb.re',
    hours: 'Lundi au vendredi : 8h30 – 12h30 et 14h00 – 18h00\nSamedi : 8h30 – 12h00',
    minutpassId: '3787',
    features: [],
    description: 'Votre magasin ODB Saint-Joseph au sud de l\'île.',
  },
  {
    slug: 'odb-le-tampon',
    name: 'ODB Le Tampon',
    address: 'Centre Commercial',
    city: 'Le Tampon',
    postalCode: '97430',
    phone: '0262 XX XX XX',
    email: 'le-tampon@odb.re',
    hours: 'Lundi au vendredi : 8h30 – 12h30 et 14h00 – 18h00\nSamedi : 8h30 – 12h00',
    minutpassId: '3788',
    features: [],
    description: 'Votre magasin ODB Le Tampon, votre opticien santé dans les hauts du sud.',
  },
  {
    slug: 'odb-saint-leu',
    name: 'ODB Saint-Leu',
    address: 'Centre-Ville',
    city: 'Saint-Leu',
    postalCode: '97436',
    phone: '0262 XX XX XX',
    email: 'st-leu@odb.re',
    hours: 'Lundi au vendredi : 8h30 – 12h30 et 14h00 – 18h00\nSamedi : 8h30 – 12h00',
    minutpassId: '3789',
    features: [],
    description: 'Votre magasin ODB Saint-Leu sur la côte ouest.',
  },
  {
    slug: 'odb-mon-caprice',
    name: 'ODB Mon Caprice',
    address: 'Ravine des Cabris',
    city: 'Saint-Pierre',
    postalCode: '97432',
    phone: '0262 XX XX XX',
    email: 'mon-caprice@odb.re',
    hours: 'Lundi au vendredi : 8h30 – 12h30 et 14h00 – 18h00\nSamedi : 8h30 – 12h00',
    minutpassId: '3790',
    features: [],
    description: 'Votre magasin ODB Mon Caprice à la Ravine des Cabris.',
  },
  {
    slug: 'odb-sacre-coeur',
    name: 'ODB Sacré-Cœur',
    address: 'Centre Commercial Jumbo',
    city: 'Le Port',
    postalCode: '97420',
    phone: '0262 XX XX XX',
    email: 'sacre-coeur@odb.re',
    hours: 'Lundi au vendredi : 8h30 – 12h30 et 14h00 – 18h00\nSamedi : 8h30 – 18h00',
    minutpassId: '3791',
    features: ['Espace Ray-Ban', 'Corner Oakley', 'Espace détente USB'],
    description: 'Retrouvez votre magasin Optique de Bourbon Sacré-Cœur au Port ! Il vous réserve une nouvelle façon de voir l\'optique avec un espace dédié à la marque Ray-Ban et un corner Oakley.',
  },
  {
    slug: 'odb-eperon',
    name: 'ODB Éperon',
    address: 'Centre Commercial',
    city: 'Saint-Paul',
    postalCode: '97460',
    phone: '0262 XX XX XX',
    email: 'eperon@odb.re',
    hours: 'Lundi au vendredi : 8h30 – 12h30 et 14h00 – 18h00\nSamedi : 8h30 – 12h00',
    minutpassId: '3792',
    features: [],
    description: 'Votre magasin ODB Éperon à Saint-Paul.',
  },
  {
    slug: 'odb-sainte-marie',
    name: 'ODB Sainte-Marie',
    address: 'Centre Commercial',
    city: 'Sainte-Marie',
    postalCode: '97438',
    phone: '0262 XX XX XX',
    email: 'ste-marie@odb.re',
    hours: 'Lundi au vendredi : 8h30 – 12h30 et 14h00 – 18h00\nSamedi : 8h30 – 12h00',
    minutpassId: '3793',
    features: [],
    description: 'Votre magasin ODB Sainte-Marie, proche de l\'aéroport.',
  },
  {
    slug: 'odb-mayotte',
    name: 'ODB Mayotte',
    address: 'Mamoudzou',
    city: 'Mamoudzou',
    postalCode: '97600',
    phone: '0269 XX XX XX',
    email: 'mayotte@odb.re',
    hours: 'Lundi au vendredi : 8h00 – 12h00 et 14h00 – 17h30\nSamedi : 8h00 – 12h00',
    features: [],
    description: 'Votre magasin ODB Mayotte à Mamoudzou.',
  },
]

async function main() {
  console.log('🌱 Starting Optique de Bourbon database seed...\n')
  console.log('═══════════════════════════════════════════════════')
  console.log('   OPTIQUE DE BOURBON - "Vos yeux, notre priorité"')
  console.log('═══════════════════════════════════════════════════\n')

  // ============================================
  // 1. Create Admin/Webmaster User
  // ============================================
  const email = process.env.ADMIN_EMAIL || 'admin@odb.re'
  const password = process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!'
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email }
  })

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(password, 12)
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: 'Webmaster ODB',
        role: 'WEBMASTER'
      }
    })
    console.log('✓ Webmaster user created:', admin.email)
  } else {
    console.log('✓ Webmaster user already exists:', email)
  }

  // ============================================
  // 2. Seed Grid Tiles (Homepage Bento Grid)
  // ============================================
  console.log('\n📊 Seeding grid tiles...')
  
  await prisma.gridTile.deleteMany()
  
  await prisma.gridTile.createMany({
    data: [
      {
        title: 'Qui sommes-nous ?',
        caption: '40+ ans d\'expertise optique',
        href: '/qui-sommes-nous',
        backgroundUrl: PLACEHOLDER_IMAGE,
        colSpan: 4,
        rowSpan: 2,
        colStart: 1,
        rowStart: 1,
        overlayType: 'DARK',
        order: 1,
        published: true,
      },
      {
        title: 'Nos boutiques',
        caption: '15 adresses à La Réunion et Mayotte',
        href: '/nos-boutiques',
        backgroundUrl: PLACEHOLDER_IMAGE,
        colSpan: 2,
        rowSpan: 1,
        colStart: 1,
        rowStart: 3,
        overlayType: 'DARK',
        order: 2,
        published: true,
      },
      {
        title: 'Zinfos',
        caption: 'Nos actualités',
        href: '/nos-actualites',
        backgroundUrl: PLACEHOLDER_IMAGE,
        colSpan: 2,
        rowSpan: 1,
        colStart: 3,
        rowStart: 3,
        overlayType: 'DARK',
        order: 3,
        published: true,
      },
      {
        title: 'Prendre rendez-vous',
        caption: 'Réservez en ligne',
        href: '/prendre-rendez-vous',
        backgroundUrl: PLACEHOLDER_IMAGE,
        colSpan: 4,
        rowSpan: 2,
        colStart: 1,
        rowStart: 4,
        overlayType: 'DARK',
        order: 4,
        published: true,
      },
      {
        title: 'ODB Sport',
        caption: 'Les solaires de sport à votre vue',
        href: '/odb-sport',
        backgroundUrl: PLACEHOLDER_IMAGE,
        colSpan: 2,
        rowSpan: 1,
        colStart: 1,
        rowStart: 6,
        overlayType: 'DARK',
        order: 5,
        published: true,
      },
      {
        title: 'ODB Kids',
        caption: 'La vue des enfants c\'est sérieux',
        href: '/odb-kids',
        backgroundUrl: PLACEHOLDER_IMAGE,
        colSpan: 2,
        rowSpan: 1,
        colStart: 3,
        rowStart: 6,
        overlayType: 'DARK',
        order: 6,
        published: true,
      },
    ],
  })
  console.log('✓ Created 6 grid tiles')

  // ============================================
  // 3. Seed Navigation Menu
  // ============================================
  console.log('\n🧭 Seeding navigation menus and items...')
  
  await prisma.navigationItem.deleteMany()
  await prisma.navigationMenu.deleteMany()
  
  const mainMenu = await prisma.navigationMenu.create({
    data: {
      name: 'Main Navigation',
      slug: 'main',
      description: 'Navigation principale du site ODB',
      published: true,
    },
  })
  console.log('✓ Created main navigation menu')

  // Navigation items basés sur le vrai site odb.re
  await prisma.navigationItem.createMany({
    data: [
      { menuId: mainMenu.id, label: 'Accueil', href: '/', order: 0, published: true },
      { menuId: mainMenu.id, label: 'Magasins', href: '/nos-boutiques', order: 1, published: true },
      { menuId: mainMenu.id, label: 'Sport', href: '/odb-sport', order: 2, published: true },
      { menuId: mainMenu.id, label: 'Kids', href: '/odb-kids', order: 3, published: true },
      { menuId: mainMenu.id, label: 'ODB à Domicile', href: '/odb-a-domicile', order: 4, published: true },
      { menuId: mainMenu.id, label: 'Conseils', href: '/conseils', order: 5, published: true },
      { menuId: mainMenu.id, label: 'Nous rejoindre', href: '/recrutement', order: 6, published: true },
    ],
  })
  console.log('✓ Created 7 navigation items')

  // ============================================
  // 4. Seed Pages
  // ============================================
  console.log('\n📄 Seeding pages...')
  
  await prisma.pageBlock.deleteMany()
  await prisma.page.deleteMany()
  console.log('✓ Cleared existing pages')

  // ===========================================
  // PAGE: Homepage
  // ===========================================
  await prisma.page.create({
    data: {
      slug: '/',
      title: 'Accueil',
      metaTitle: 'Optique de Bourbon | Votre opticien à La Réunion depuis 1981',
      metaDescription: 'Optique de Bourbon, votre opticien santé à La Réunion depuis plus de 40 ans. 15 boutiques, équipe d\'experts. Prenez rendez-vous en ligne.',
      published: true,
      publishedAt: new Date(),
      showInNav: false,
      blocks: {
        create: [
          {
            type: 'HERO',
            order: 1,
            content: {
              title: 'Optique de Bourbon',
              subtitle: 'Vos yeux, notre priorité',
              description: 'Votre opticien santé à La Réunion depuis plus de 40 ans',
              backgroundImage: PLACEHOLDER_IMAGE,
              overlayOpacity: 50,
              overlayColor: '#000000',
              height: 'full',
              alignment: 'CENTER',
              buttons: [
                { text: 'Je prends RDV', url: 'https://devices.minutpass.com/iframe.html?header=1&context=OPTIQUEBOURBON&configuration=2803', variant: 'primary' },
                { text: 'Trouver un magasin', url: '/nos-boutiques', variant: 'secondary' },
              ],
            },
            styles: { containerWidth: 'FULL', paddingTop: 'none', paddingBottom: 'none' },
            visible: true,
          },
        ],
      },
    },
  })
  console.log('✓ Created page: Homepage')

  // ===========================================
  // PAGE: Nos Boutiques
  // ===========================================
  await prisma.page.create({
    data: {
      slug: '/nos-boutiques',
      title: 'Nos magasins ODB',
      metaTitle: 'Nos 15 boutiques à La Réunion et Mayotte | Optique de Bourbon',
      metaDescription: 'Retrouvez nos 15 magasins Optique de Bourbon à La Réunion et Mayotte. Prenez rendez-vous en ligne dans le magasin le plus proche de chez vous.',
      published: true,
      publishedAt: new Date(),
      showInNav: true,
      navOrder: 1,
      navLabel: 'Magasins',
      blocks: {
        create: [
          {
            type: 'HERO',
            order: 1,
            content: {
              title: 'Nos magasins ODB',
              subtitle: '15 adresses à votre service',
              description: 'Depuis 1981, Optique de Bourbon s\'est engagé à rendre accessible la qualité et la santé visuelle pour tous. Notre partenariat avec Essilor, leader mondial des verres de lunettes, permet de vous garantir un haut niveau de qualité.',
              backgroundImage: PLACEHOLDER_IMAGE,
              overlayOpacity: 55,
              overlayColor: '#000000',
              height: 'medium',
              alignment: 'CENTER',
            },
            styles: { containerWidth: 'FULL', paddingTop: 'none', paddingBottom: 'none' },
            visible: true,
          },
          {
            type: 'HEADING',
            order: 2,
            content: {
              text: 'Prenez rendez-vous en ligne',
              level: 'h2',
              subtitle: 'Sélectionnez votre magasin et réservez votre créneau',
            },
            styles: { containerWidth: 'WIDE', paddingTop: 'xl', paddingBottom: 'lg', alignment: 'center' },
            visible: true,
          },
          {
            type: 'CARDS',
            order: 3,
            content: {
              cards: STORES_DATA.slice(0, 6).map(store => ({
                title: store.name,
                description: `${store.address}, ${store.postalCode} ${store.city}`,
                image: PLACEHOLDER_IMAGE,
                tags: store.features.slice(0, 2),
                link: `/nos-boutiques/${store.slug}`,
              })),
              columns: 3,
              variant: 'elevated',
            },
            styles: { containerWidth: 'WIDE', paddingBottom: 'lg' },
            visible: true,
          },
          {
            type: 'CARDS',
            order: 4,
            content: {
              cards: STORES_DATA.slice(6, 12).map(store => ({
                title: store.name,
                description: `${store.address}, ${store.postalCode} ${store.city}`,
                image: PLACEHOLDER_IMAGE,
                tags: store.features.slice(0, 2),
                link: `/nos-boutiques/${store.slug}`,
              })),
              columns: 3,
              variant: 'elevated',
            },
            styles: { containerWidth: 'WIDE', paddingBottom: 'lg' },
            visible: true,
          },
          {
            type: 'CARDS',
            order: 5,
            content: {
              cards: STORES_DATA.slice(12).map(store => ({
                title: store.name,
                description: `${store.address}, ${store.postalCode} ${store.city}`,
                image: PLACEHOLDER_IMAGE,
                tags: store.features.slice(0, 2),
                link: `/nos-boutiques/${store.slug}`,
              })),
              columns: 3,
              variant: 'elevated',
            },
            styles: { containerWidth: 'WIDE', paddingBottom: 'xl' },
            visible: true,
          },
          {
            type: 'PARAGRAPH',
            order: 6,
            content: {
              text: '« Mes yeux c\'est pour la vie, Optique de Bourbon en prend soin »',
            },
            styles: { containerWidth: 'MEDIUM', paddingBottom: 'xl', alignment: 'center' },
            visible: true,
          },
        ],
      },
    },
  })
  console.log('✓ Created page: Nos Boutiques')

  // ===========================================
  // PAGES: Boutiques individuelles (exemples)
  // ===========================================
  const exampleStores = [STORES_DATA[0], STORES_DATA[2], STORES_DATA[11]] // Le Port, Saint-Denis, Sacré-Cœur
  
  for (const store of exampleStores) {
    const blocks = [
      {
        type: 'HERO',
        order: 1,
        content: {
          title: store.name.toUpperCase(),
          subtitle: `${store.address} — ${store.postalCode} ${store.city}`,
          backgroundImage: PLACEHOLDER_IMAGE,
          overlayOpacity: 55,
          overlayColor: '#000000',
          height: 'medium',
          alignment: 'CENTER',
          buttons: [
            { text: 'Je prends rendez-vous en ligne', url: `https://devices.minutpass.com/iframe.html?header=1&context=OPTIQUEBOURBON&configuration=2803&placeId=${store.minutpassId}`, variant: 'primary' },
          ],
        },
        styles: { containerWidth: 'FULL', paddingTop: 'none', paddingBottom: 'none' },
        visible: true,
      },
      {
        type: 'FEATURES',
        order: 2,
        content: {
          features: [
            {
              icon: '📍',
              title: 'Adresse',
              description: `${store.address}\n${store.postalCode} ${store.city}`,
            },
            {
              icon: '🕐',
              title: 'Horaires',
              description: store.hours,
            },
            {
              icon: '📞',
              title: 'Téléphones',
              description: `${store.phone}${store.phone2 ? '\n' + store.phone2 : ''}\n\nSi les lignes sont occupées :\n0262 430 430`,
            },
            {
              icon: '✉️',
              title: 'Email',
              description: store.email,
            },
          ],
          columns: 4,
          layout: 'cards',
        },
        styles: { containerWidth: 'WIDE', paddingTop: 'xl', paddingBottom: 'lg' },
        visible: true,
      },
      {
        type: 'HEADING',
        order: 3,
        content: {
          text: store.features.length > 0 
            ? `Chez ${store.name}, vous trouverez des montures pour toute la famille`
            : 'Nous serons ravis de vous accueillir',
          level: 'h2',
        },
        styles: { containerWidth: 'WIDE', paddingTop: 'lg', paddingBottom: 'md', alignment: 'center' },
        visible: true,
      },
      {
        type: 'PARAGRAPH',
        order: 4,
        content: {
          text: store.description,
        },
        styles: { containerWidth: 'MEDIUM', paddingBottom: 'lg', alignment: 'center' },
        visible: true,
      },
    ]

    if (store.features.length > 0) {
      blocks.push({
        type: 'LIST',
        order: 5,
        content: {
          items: store.features,
          style: 'check',
        },
        styles: { containerWidth: 'MEDIUM', paddingBottom: 'lg', alignment: 'center' },
        visible: true,
      })
    }

    blocks.push({
      type: 'QUOTE',
      order: 6,
      content: {
        text: 'Rien de mieux que nos opticiens qualifiés pour vous indiquer le meilleur choix. N\'hésitez pas à les questionner, ils restent toujours à votre disposition.',
        author: 'ODB, votre opticien santé !',
      },
      styles: { containerWidth: 'MEDIUM', paddingTop: 'lg', paddingBottom: 'xl', alignment: 'center' },
      visible: true,
    })

    if (store.rating) {
      blocks.push({
        type: 'STATS',
        order: 7,
        content: {
          stats: [
            { value: store.rating.toString(), suffix: '/5', label: 'Note clients' },
            { value: store.reviewCount?.toString() || '0', label: 'Avis vérifiés' },
          ],
          columns: 2,
        },
        styles: { containerWidth: 'MEDIUM', paddingBottom: 'xl', backgroundColor: 'rgba(255,255,255,0.05)' },
        visible: true,
      })
    }

    blocks.push({
      type: 'BUTTON',
      order: 8,
      content: {
        text: 'Prendre rendez-vous',
        url: `https://devices.minutpass.com/iframe.html?header=1&context=OPTIQUEBOURBON&configuration=2803&placeId=${store.minutpassId}`,
        variant: 'primary',
        size: 'lg',
      },
      styles: { paddingBottom: 'xl', alignment: 'center' },
      visible: true,
    })

    await prisma.page.create({
      data: {
        slug: `/nos-boutiques/${store.slug}`,
        title: store.name,
        metaTitle: `${store.name} | Optique de Bourbon`,
        metaDescription: `${store.description} Adresse : ${store.address}, ${store.postalCode} ${store.city}. Téléphone : ${store.phone}`,
        published: true,
        publishedAt: new Date(),
        showInNav: false,
        blocks: {
          create: blocks,
        },
      },
    })
    console.log(`✓ Created page: ${store.name}`)
  }

  // ===========================================
  // PAGE: ODB Sport
  // ===========================================
  await prisma.page.create({
    data: {
      slug: '/odb-sport',
      title: 'ODB Sport',
      metaTitle: 'ODB Sport - Solaires de sport à votre vue | Optique de Bourbon',
      metaDescription: 'Les solaires de sport à votre vue, c\'est possible ! ODB Sport propose un large choix de montures optiques et solaires adaptées à votre sport et à vos activités.',
      published: true,
      publishedAt: new Date(),
      showInNav: true,
      navOrder: 2,
      navLabel: 'Sport',
      blocks: {
        create: [
          {
            type: 'HERO',
            order: 1,
            content: {
              title: 'ODB Sport',
              subtitle: 'Les solaires de sport à votre vue, c\'est possible !',
              description: 'Bien voir est la clé de la performance ! En compétition comme en pratique amateur, les solaires adaptées à votre sport et à votre vue deviendront un atout indispensable à votre réussite.',
              backgroundImage: PLACEHOLDER_IMAGE,
              overlayOpacity: 60,
              overlayColor: '#000000',
              height: 'large',
              alignment: 'CENTER',
              buttons: [
                { text: 'En savoir plus', url: '#concept', variant: 'primary' },
                { text: 'Prendre RDV', url: '/prendre-rendez-vous', variant: 'secondary' },
              ],
            },
            styles: { containerWidth: 'FULL', paddingTop: 'none', paddingBottom: 'none' },
            visible: true,
          },
          {
            type: 'PARAGRAPH',
            order: 2,
            content: {
              text: 'Conçue pour les sportifs et adaptée à notre mode de vie sous le soleil, ODB Sport propose un large choix de montures optiques et solaires adaptées à votre vue et à vos activités ! Nos opticiens passionnés et spécialisés sauront vous conseiller !',
            },
            styles: { containerWidth: 'MEDIUM', paddingTop: 'xl', paddingBottom: 'xl', alignment: 'center' },
            visible: true,
          },
          {
            type: 'FEATURES',
            order: 3,
            content: {
              features: [
                { icon: '🏃', title: 'Running & Trail', description: 'Montures légères et stables pour vos courses.' },
                { icon: '🚴', title: 'Cyclisme', description: 'Protection optimale contre le vent et les UV.' },
                { icon: '🏊', title: 'Natation', description: 'Lunettes de piscine correctrices.' },
                { icon: '⛳', title: 'Golf', description: 'Verres pour optimiser votre lecture du terrain.' },
                { icon: '🎾', title: 'Tennis', description: 'Vision parfaite pour suivre la balle.' },
                { icon: '🏄', title: 'Sports nautiques', description: 'Résistance à l\'eau salée et flottabilité.' },
              ],
              columns: 3,
              layout: 'cards',
            },
            styles: { containerWidth: 'WIDE', paddingBottom: 'xl' },
            visible: true,
          },
        ],
      },
    },
  })
  console.log('✓ Created page: ODB Sport')

  // ===========================================
  // PAGE: ODB Kids
  // ===========================================
  await prisma.page.create({
    data: {
      slug: '/odb-kids',
      title: 'ODB Kids',
      metaTitle: 'ODB Kids - Optique enfant | Optique de Bourbon',
      metaDescription: 'La vue des enfants c\'est sérieux ! Nos opticiens sont formés au concept Optikid pour une approche médicale et pédagogique adaptée aux enfants.',
      published: true,
      publishedAt: new Date(),
      showInNav: true,
      navOrder: 3,
      navLabel: 'Kids',
      blocks: {
        create: [
          {
            type: 'HERO',
            order: 1,
            content: {
              title: 'OPTIKID',
              subtitle: 'La vue des enfants c\'est sérieux !',
              description: 'Être opticien pour les enfants à la Réunion ne s\'improvise pas. Les opticiens d\'ODB sont formés chaque année au concept « Optikid » sur une approche médicale et pédagogique.',
              backgroundImage: PLACEHOLDER_IMAGE,
              overlayOpacity: 55,
              overlayColor: '#000000',
              height: 'large',
              alignment: 'CENTER',
              buttons: [
                { text: 'En savoir plus', url: '#concept', variant: 'primary' },
              ],
            },
            styles: { containerWidth: 'FULL', paddingTop: 'none', paddingBottom: 'none' },
            visible: true,
          },
          {
            type: 'PARAGRAPH',
            order: 2,
            content: {
              text: 'La vue est essentielle à notre quotidien, et encore plus pour nos petits bouts. Parce que la vue des enfants nécessite des compétences et des besoins spécifiques, ODB Kids a vu le jour. Nos spécialistes sont là pour conseiller vos enfants en fonction de la forme de leurs visages et de leurs besoins.',
            },
            styles: { containerWidth: 'MEDIUM', paddingTop: 'xl', paddingBottom: 'lg', alignment: 'center' },
            visible: true,
          },
          {
            type: 'STATS',
            order: 3,
            content: {
              stats: [
                { value: '800', suffix: '+', label: 'Montures enfants' },
                { value: '100', suffix: '%', label: 'Expertise Optikid' },
              ],
              columns: 2,
            },
            styles: { containerWidth: 'MEDIUM', paddingBottom: 'xl' },
            visible: true,
          },
          {
            type: 'PARAGRAPH',
            order: 4,
            content: {
              text: 'Retrouvez vos héros préférés : Spiderman, Cars, La Reine des Neiges, Disney, Barbapapa, Hello Kitty, Avengers, Star Wars… mais aussi des indémodables comme : Ray-Ban, Oakley, Guess… et bien plus encore !',
            },
            styles: { containerWidth: 'MEDIUM', paddingBottom: 'xl', alignment: 'center' },
            visible: true,
          },
        ],
      },
    },
  })
  console.log('✓ Created page: ODB Kids')

  // ===========================================
  // PAGE: ODB à Domicile
  // ===========================================
  await prisma.page.create({
    data: {
      slug: '/odb-a-domicile',
      title: 'ODB à Domicile',
      metaTitle: 'ODB à Domicile - L\'opticien vient chez vous | Optique de Bourbon',
      metaDescription: 'Le magasin et l\'opticien viennent à vous ! Vous ne pouvez pas vous déplacer ? Bénéficiez de notre expertise comme en magasin, chez vous.',
      published: true,
      publishedAt: new Date(),
      showInNav: true,
      navOrder: 4,
      navLabel: 'ODB à Domicile',
      blocks: {
        create: [
          {
            type: 'HERO',
            order: 1,
            content: {
              title: 'ODB à Domicile',
              subtitle: 'Le magasin et l\'opticien viennent à vous !',
              description: 'Vous ne pouvez pas vous déplacer ? Bénéficiez de notre expertise et de notre savoir-faire, comme en magasin.',
              backgroundImage: PLACEHOLDER_IMAGE,
              overlayOpacity: 60,
              overlayColor: '#000000',
              height: 'large',
              alignment: 'CENTER',
              buttons: [
                { text: 'Prendre rendez-vous', url: 'tel:0692272785', variant: 'primary' },
              ],
            },
            styles: { containerWidth: 'FULL', paddingTop: 'none', paddingBottom: 'none' },
            visible: true,
          },
          {
            type: 'FEATURES',
            order: 2,
            content: {
              features: [
                { icon: '🏠', title: 'À domicile', description: 'Notre opticienne se déplace chez vous avec tout le matériel nécessaire.' },
                { icon: '👓', title: 'Large choix', description: 'Une sélection de montures apportée directement à votre domicile.' },
                { icon: '📞', title: 'Sur rendez-vous', description: 'Contactez notre opticienne au 0692 27 27 85 pour prendre RDV.' },
              ],
              columns: 3,
              layout: 'cards',
            },
            styles: { containerWidth: 'WIDE', paddingTop: 'xl', paddingBottom: 'xl' },
            visible: true,
          },
        ],
      },
    },
  })
  console.log('✓ Created page: ODB à Domicile')

  // ===========================================
  // PAGE: Prendre Rendez-vous
  // ===========================================
  await prisma.page.create({
    data: {
      slug: '/prendre-rendez-vous',
      title: 'Prendre rendez-vous',
      metaTitle: 'Prendre rendez-vous en ligne | Optique de Bourbon',
      metaDescription: 'Réservez votre rendez-vous en ligne dans l\'une de nos 15 boutiques Optique de Bourbon à La Réunion et Mayotte.',
      published: true,
      publishedAt: new Date(),
      showInNav: false,
      blocks: {
        create: [
          {
            type: 'HEADING',
            order: 1,
            content: {
              text: 'Prendre rendez-vous',
              level: 'h1',
              subtitle: 'Vous avez besoin d\'un opticien ou d\'un contactologue ?',
            },
            styles: { containerWidth: 'MEDIUM', paddingTop: 'xl', paddingBottom: 'lg', alignment: 'center' },
            visible: true,
          },
          {
            type: 'IFRAME',
            order: 2,
            content: {
              url: 'https://devices.minutpass.com/iframe.html?header=1&context=OPTIQUEBOURBON&configuration=2803',
              title: 'Réservation Minutpass',
              height: 800,
              allowFullscreen: true,
            },
            styles: { containerWidth: 'WIDE', paddingBottom: 'xl' },
            visible: true,
          },
        ],
      },
    },
  })
  console.log('✓ Created page: Prendre Rendez-vous')

  // ===========================================
  // PAGE: Qui sommes-nous
  // ===========================================
  await prisma.page.create({
    data: {
      slug: '/qui-sommes-nous',
      title: 'Qui sommes-nous ?',
      metaTitle: 'Qui sommes-nous ? | Optique de Bourbon',
      metaDescription: 'Optique de Bourbon est votre partenaire santé depuis plus de 40 ans. Toujours la même passion et la même détermination à rendre la qualité accessible à tous.',
      published: true,
      publishedAt: new Date(),
      showInNav: false,
      blocks: {
        create: [
          {
            type: 'HERO',
            order: 1,
            content: {
              title: 'Qui sommes-nous ?',
              subtitle: 'Votre partenaire santé depuis plus de 40 ans',
              description: 'Toujours la même passion et la même détermination à rendre la qualité accessible à tous.',
              backgroundImage: PLACEHOLDER_IMAGE,
              overlayOpacity: 55,
              overlayColor: '#000000',
              height: 'medium',
              alignment: 'CENTER',
            },
            styles: { containerWidth: 'FULL', paddingTop: 'none', paddingBottom: 'none' },
            visible: true,
          },
          {
            type: 'PARAGRAPH',
            order: 2,
            content: {
              text: 'Optique de Bourbon est votre partenaire santé depuis plus de 40 ans. Toujours la même passion et la même détermination à rendre la qualité accessible à tous. Avec un réseau de magasins sur toute l\'île de la Réunion, nous sommes toujours au plus proche de vous et de vos besoins.',
            },
            styles: { containerWidth: 'MEDIUM', paddingTop: 'xl', paddingBottom: 'lg', alignment: 'center' },
            visible: true,
          },
          {
            type: 'STATS',
            order: 3,
            content: {
              stats: [
                { value: '40', suffix: '+', label: 'Années d\'expérience' },
                { value: '15', label: 'Boutiques' },
                { value: '200', suffix: '+', label: 'Collaborateurs' },
              ],
              columns: 3,
            },
            styles: { containerWidth: 'WIDE', paddingBottom: 'xl' },
            visible: true,
          },
          {
            type: 'PARAGRAPH',
            order: 4,
            content: {
              text: 'Grâce à Essilor, notre partenaire depuis 1981, vous êtes donc sûrs à 100% de la qualité de vos verres ! Optique de Bourbon a fait le choix d\'équiper les montures « 100% santé » de verres Essilor.',
            },
            styles: { containerWidth: 'MEDIUM', paddingBottom: 'xl', alignment: 'center' },
            visible: true,
          },
          {
            type: 'QUOTE',
            order: 5,
            content: {
              text: 'Rien de mieux que nos opticiens qualifiés pour vous indiquer le meilleur choix. N\'hésitez pas à les questionner, ils restent toujours à votre disposition.',
              author: 'ODB, votre opticien santé !',
            },
            styles: { containerWidth: 'MEDIUM', paddingBottom: 'xl', alignment: 'center' },
            visible: true,
          },
        ],
      },
    },
  })
  console.log('✓ Created page: Qui sommes-nous')

  // ============================================
  // Summary
  // ============================================
  const pageCount = await prisma.page.count()
  const blockCount = await prisma.pageBlock.count()
  
  console.log('\n═══════════════════════════════════════════════════')
  console.log('✅ Optique de Bourbon seed completed successfully!')
  console.log('═══════════════════════════════════════════════════')
  console.log('\n📝 Summary:')
  console.log(`  - Users: ${await prisma.user.count()}`)
  console.log(`  - Grid Tiles: ${await prisma.gridTile.count()}`)
  console.log(`  - Navigation Menus: ${await prisma.navigationMenu.count()}`)
  console.log(`  - Navigation Items: ${await prisma.navigationItem.count()}`)
  console.log(`  - Pages: ${pageCount}`)
  console.log(`  - Page Blocks: ${blockCount}`)
  
  console.log('\n🔗 Pages créées:')
  console.log('  - / (Accueil)')
  console.log('  - /nos-boutiques (Liste des 15 magasins)')
  console.log('  - /nos-boutiques/odb-le-port (Exemple boutique)')
  console.log('  - /nos-boutiques/odb-saint-denis (Exemple boutique)')
  console.log('  - /nos-boutiques/odb-sacre-coeur (Exemple boutique)')
  console.log('  - /odb-sport')
  console.log('  - /odb-kids')
  console.log('  - /odb-a-domicile')
  console.log('  - /prendre-rendez-vous')
  console.log('  - /qui-sommes-nous')
  
  console.log('\n🧭 Navigation principale:')
  console.log('  - Accueil → /')
  console.log('  - Magasins → /nos-boutiques')
  console.log('  - Sport → /odb-sport')
  console.log('  - Kids → /odb-kids')
  console.log('  - ODB à Domicile → /odb-a-domicile')
  console.log('  - Conseils → /conseils')
  console.log('  - Nous rejoindre → /recrutement')
  
  console.log('\n⚠️  Note: Les images utilisent un placeholder.')
  console.log('    Remplacez-les via la médiathèque du CMS.')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
