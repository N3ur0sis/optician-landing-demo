import 'dotenv/config'
import { PrismaClient } from './generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
})
const prisma = new PrismaClient({ adapter })

async function updateNosBoutiques() {
  console.log('📝 Updating /nos-boutiques page to use STORE_LIST block...\n')

  // Find the page
  const page = await prisma.page.findFirst({
    where: { 
      OR: [
        { slug: '/nos-boutiques' },
        { slug: 'nos-boutiques' }
      ]
    },
    include: { blocks: true }
  })

  if (!page) {
    console.log('❌ Page /nos-boutiques not found!')
    return
  }

  console.log(`Found page: ${page.title} (${page.slug})`)
  console.log(`Current blocks: ${page.blocks.length}`)

  // Delete all existing blocks
  await prisma.pageBlock.deleteMany({
    where: { pageId: page.id }
  })
  console.log('✓ Deleted old blocks')

  // Create new blocks with STORE_LIST
  await prisma.pageBlock.createMany({
    data: [
      // HERO
      {
        pageId: page.id,
        type: 'HERO',
        order: 1,
        visible: true,
        content: {
          title: 'Nos boutiques',
          subtitle: '15 adresses à La Réunion',
          description: 'Trouvez la boutique Optique de Bourbon la plus proche de chez vous. Une équipe passionnée vous attend pour prendre soin de votre vision.',
          alignment: 'CENTER',
          height: 'medium',
          backgroundImage: 'https://images.unsplash.com/photo-1560179406-1c6c60e0dc76?auto=format&fit=crop&w=1920&q=80',
          overlayColor: '#000000',
          overlayOpacity: 55
        },
        settings: {},
        styles: {
          paddingTop: 'none',
          paddingBottom: 'none',
          containerWidth: 'FULL'
        }
      },
      // STORE_LIST - Dynamic list of all stores
      {
        pageId: page.id,
        type: 'STORE_LIST',
        order: 2,
        visible: true,
        content: {
          title: 'Toutes nos adresses',
          subtitle: 'Un réseau de 15 boutiques pour vous servir',
          columns: 3,
          showRating: true,
          showPhone: true
        },
        settings: {},
        styles: {
          paddingTop: 'xl',
          paddingBottom: 'xl',
          containerWidth: 'WIDE',
          animation: 'fade-in'
        }
      },
      // CTA Button
      {
        pageId: page.id,
        type: 'BUTTON',
        order: 3,
        visible: true,
        content: {
          text: 'Prendre rendez-vous',
          url: '/prendre-rendez-vous',
          variant: 'primary',
          size: 'lg'
        },
        settings: {},
        styles: {
          alignment: 'center',
          paddingBottom: 'xl'
        }
      }
    ]
  })

  console.log('✓ Created new blocks with STORE_LIST')
  console.log('\n✅ Page /nos-boutiques updated successfully!')
}

updateNosBoutiques()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
