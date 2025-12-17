import 'dotenv/config'
import prisma from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('🌱 Starting database seed...\n')

  // ============================================
  // 1. Create Admin/Webmaster User
  // ============================================
  const email = process.env.ADMIN_EMAIL || 'admin@optician.com'
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
        name: 'Webmaster',
        role: 'WEBMASTER'
      }
    })
    console.log('✓ Webmaster user created:', admin.email)
  } else {
    console.log('✓ Webmaster user already exists:', email)
  }

  // ============================================
  // 2. Seed Grid Tiles (ContentReveal)
  // ============================================
  console.log('\n📊 Seeding grid tiles...')
  
  const existingTiles = await prisma.gridTile.count()
  if (existingTiles === 0) {
    await prisma.gridTile.createMany({
      data: [
        {
          title: 'Qui est ODB ?',
          caption: 'Découvrir la maison',
          href: '/maison',
          backgroundUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80',
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
          caption: 'Toutes les adresses',
          href: '/boutiques',
          backgroundUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&h=400&fit=crop&crop=center',
          colSpan: 2,
          rowSpan: 1,
          colStart: 1,
          rowStart: 3,
          overlayType: 'DARK',
          order: 2,
          published: true,
        },
        {
          title: 'Actualités',
          caption: 'Le journal ODB',
          href: '/magazine',
          backgroundUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=400&fit=crop&crop=center',
          colSpan: 2,
          rowSpan: 1,
          colStart: 3,
          rowStart: 3,
          overlayType: 'DARK',
          order: 3,
          published: true,
        },
        {
          title: 'Prenez rendez-vous',
          caption: 'Réserver en ligne',
          href: '/rendez-vous',
          backgroundUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1400&q=80',
          colSpan: 4,
          rowSpan: 2,
          colStart: 1,
          rowStart: 4,
          overlayType: 'DARK',
          order: 4,
          published: true,
        },
        {
          title: 'Créateurs',
          caption: 'Sélection exclusive',
          href: '/collections/createurs',
          backgroundUrl: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=400&fit=crop&crop=center',
          colSpan: 2,
          rowSpan: 1,
          colStart: 1,
          rowStart: 6,
          overlayType: 'DARK',
          order: 5,
          published: true,
        },
        {
          title: 'Services',
          caption: 'Voir les expertises',
          href: '/services',
          backgroundUrl: 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=600&h=400&fit=crop&crop=center',
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
  } else {
    console.log('✓ Grid tiles already exist')
  }

  // ============================================
  // 3. Seed Navigation Items
  // ============================================
  console.log('\n🧭 Seeding navigation items...')
  
  const existingNav = await prisma.navigationItem.count()
  if (existingNav === 0) {
    await prisma.navigationItem.createMany({
      data: [
        { label: 'Accueil', href: '/', order: 1, published: true },
        { label: 'Qui est ODB ?', href: '/maison', order: 2, published: true },
        { label: 'Nos boutiques', href: '/boutiques', order: 3, published: true },
        { label: 'Actualités', href: '/magazine', order: 4, published: true },
        { label: 'Créateurs', href: '/collections/createurs', order: 5, published: true },
        { label: 'Services', href: '/services', order: 6, published: true },
        { label: 'Rendez-vous', href: '/rendez-vous', order: 7, published: true },
      ],
    })
    console.log('✓ Created 7 navigation items')
  } else {
    console.log('✓ Navigation items already exist')
  }

  // ============================================
  // 4. Seed Pages with Sections
  // ============================================
  console.log('\n📄 Seeding pages with sections...')
  
  const existingPages = await prisma.page.count()
  if (existingPages === 0) {
    // Maison page
    const maisonPage = await prisma.page.create({
      data: {
        slug: 'maison',
        title: 'Qui est ODB ?',
        metaTitle: 'Optique de Bourbon - Qui sommes-nous ?',
        metaDescription: 'Découvrez la maison Optique de Bourbon, opticien français de référence.',
        published: true,
        publishedAt: new Date(),
        sections: {
          create: [
            {
              type: 'HERO',
              order: 1,
              config: {
                title: 'Qui est ODB ?',
                subtitle: 'Découvrir la maison',
                description: 'Optique de Bourbon est une maison française d\'optique de luxe, combinant savoir-faire artisanal et excellence du service.',
                backgroundUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80',
              },
            },
            {
              type: 'GRID',
              order: 2,
              config: {
                title: 'Notre expertise',
                items: [
                  {
                    title: 'Savoir-faire artisanal',
                    description: 'Des montures façonnées avec passion',
                    icon: 'craft',
                  },
                  {
                    title: 'Service personnalisé',
                    description: 'Un accompagnement sur-mesure',
                    icon: 'service',
                  },
                  {
                    title: 'Innovation optique',
                    description: 'Les technologies les plus avancées',
                    icon: 'innovation',
                  },
                ],
              },
            },
          ],
        },
      },
    })

    // Boutiques page
    const boutiquesPage = await prisma.page.create({
      data: {
        slug: 'boutiques',
        title: 'Nos boutiques',
        metaTitle: 'Optique de Bourbon - Nos boutiques',
        metaDescription: 'Retrouvez nos boutiques Optique de Bourbon à La Réunion.',
        published: true,
        publishedAt: new Date(),
        sections: {
          create: [
            {
              type: 'HERO',
              order: 1,
              config: {
                title: 'Nos boutiques',
                subtitle: 'Toutes les adresses',
                description: 'Retrouvez-nous dans nos différentes boutiques à travers La Réunion.',
              },
            },
            {
              type: 'GRID',
              order: 2,
              config: {
                items: [
                  {
                    title: 'Saint-Denis',
                    description: 'Flagship lumineux au cœur de la capitale',
                    address: '12 Rue de Paris, 97400 Saint-Denis',
                    phone: '0262 20 12 34',
                    hours: 'Lun-Sam 9h-18h',
                  },
                  {
                    title: 'Saint-Pierre',
                    description: 'Espace moderne dans le sud de l\'île',
                    address: '45 Rue des Bons Enfants, 97410 Saint-Pierre',
                    phone: '0262 25 67 89',
                    hours: 'Lun-Sam 9h-18h',
                  },
                ],
              },
            },
          ],
        },
      },
    })

    // Magazine page
    const magazinePage = await prisma.page.create({
      data: {
        slug: 'magazine',
        title: 'Actualités',
        metaTitle: 'Optique de Bourbon - Magazine',
        metaDescription: 'Suivez nos actualités, tendances et nouveautés.',
        published: true,
        publishedAt: new Date(),
        sections: {
          create: [
            {
              type: 'HERO',
              order: 1,
              config: {
                title: 'Le journal ODB',
                subtitle: 'Actualités',
                description: 'Découvrez nos dernières actualités, tendances et conseils.',
              },
            },
          ],
        },
      },
    })

    // Services page
    const servicesPage = await prisma.page.create({
      data: {
        slug: 'services',
        title: 'Services',
        metaTitle: 'Optique de Bourbon - Nos services',
        metaDescription: 'Découvrez nos services optiques et nos expertises.',
        published: true,
        publishedAt: new Date(),
        sections: {
          create: [
            {
              type: 'HERO',
              order: 1,
              config: {
                title: 'Nos services',
                subtitle: 'Voir les expertises',
                description: 'Un accompagnement complet pour votre vue et votre style.',
              },
            },
            {
              type: 'GRID',
              order: 2,
              config: {
                items: [
                  {
                    title: 'Examen de la vue',
                    description: 'Bilans complets avec équipements de pointe',
                    tags: ['Myopie & presbytie', 'Contrôle enfant'],
                  },
                  {
                    title: 'Conseil personnalisé',
                    description: 'Sélection de montures adaptée à votre morphologie',
                    tags: ['Analyse morphologique', 'Colorimétrie'],
                  },
                ],
              },
            },
          ],
        },
      },
    })

    // Rendez-vous page
    const rendezvousPage = await prisma.page.create({
      data: {
        slug: 'rendez-vous',
        title: 'Prenez rendez-vous',
        metaTitle: 'Optique de Bourbon - Prendre rendez-vous',
        metaDescription: 'Réservez votre rendez-vous en ligne dans l\'une de nos boutiques.',
        published: true,
        publishedAt: new Date(),
        sections: {
          create: [
            {
              type: 'HERO',
              order: 1,
              config: {
                title: 'Prenez rendez-vous',
                subtitle: 'Réserver en ligne',
                description: 'Choisissez votre boutique et réservez votre créneau en quelques clics.',
              },
            },
          ],
        },
      },
    })

    // Collections/Créateurs page
    const createursPage = await prisma.page.create({
      data: {
        slug: 'collections/createurs',
        title: 'Créateurs',
        metaTitle: 'Optique de Bourbon - Nos créateurs',
        metaDescription: 'Découvrez notre sélection exclusive de créateurs de lunettes.',
        published: true,
        publishedAt: new Date(),
        sections: {
          create: [
            {
              type: 'HERO',
              order: 1,
              config: {
                title: 'Nos créateurs',
                subtitle: 'Sélection exclusive',
                description: 'Une curation pointue de créateurs internationaux et de marques d\'exception.',
              },
            },
          ],
        },
      },
    })

    // Magasins page (stores list)
    const magasinsPage = await prisma.page.create({
      data: {
        slug: 'magasins',
        title: 'Nos magasins',
        metaTitle: 'Optique de Bourbon - Nos magasins',
        metaDescription: 'Trouvez le magasin Optique de Bourbon le plus proche de chez vous.',
        published: true,
        publishedAt: new Date(),
        sections: {
          create: [
            {
              type: 'HERO',
              order: 1,
              config: {
                title: 'Nos magasins',
                subtitle: 'Trouvez votre boutique',
                description: 'Découvrez tous nos points de vente à La Réunion.',
              },
            },
          ],
        },
      },
    })

    console.log('✓ Created 7 pages with sections:')
    console.log('  - /maison')
    console.log('  - /boutiques')
    console.log('  - /magazine')
    console.log('  - /services')
    console.log('  - /rendez-vous')
    console.log('  - /collections/createurs')
    console.log('  - /magasins')
  } else {
    console.log('✓ Pages already exist')
  }

  console.log('\n✅ Database seeding completed successfully!')
  console.log('\n📝 Summary:')
  console.log(`  - Users: ${await prisma.user.count()}`)
  console.log(`  - Grid Tiles: ${await prisma.gridTile.count()}`)
  console.log(`  - Navigation Items: ${await prisma.navigationItem.count()}`)
  console.log(`  - Pages: ${await prisma.page.count()}`)
  console.log(`  - Sections: ${await prisma.section.count()}`)
}

main()
  .catch((e) => {
    console.error('Error creating admin user:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
