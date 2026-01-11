import 'dotenv/config'
import { PrismaClient } from './generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function updateBoutiquesPage() {
  console.log('🔧 Updating /nos-boutiques page...\n')

  // Find the nos-boutiques page
  const page = await prisma.page.findFirst({
    where: { slug: '/nos-boutiques' },
    include: { blocks: true }
  })

  if (!page) {
    console.log('❌ Page /nos-boutiques not found')
    await prisma.$disconnect()
    return
  }

  // Find the CARDS block and the HEADING block after it
  const cardsBlock = page.blocks.find(b => b.type === 'CARDS')
  const headingAfterCards = page.blocks.find(b => b.type === 'HEADING' && b.order === 4)
  
  if (cardsBlock) {
    // Delete the old CARDS block
    await prisma.pageBlock.delete({
      where: { id: cardsBlock.id }
    })
    console.log('✅ Deleted old CARDS block')
  }

  // Delete the "Et 8 autres boutiques..." heading since we're showing all stores
  if (headingAfterCards) {
    await prisma.pageBlock.delete({
      where: { id: headingAfterCards.id }
    })
    console.log('✅ Deleted "Et 8 autres boutiques" heading')
  }

  // Create a new STORE_LIST block
  await prisma.pageBlock.create({
    data: {
      pageId: page.id,
      type: 'STORE_LIST',
      order: 3,
      visible: true,
      content: {
        title: 'Toutes nos adresses',
        subtitle: 'Un réseau de 15 boutiques pour vous servir à La Réunion',
        columns: 3,
        showRating: true,
        showPhone: true
      },
      settings: {},
      styles: {
        animation: 'fade-in',
        paddingTop: 'lg',
        paddingBottom: 'xl',
        containerWidth: 'WIDE'
      }
    }
  })
  console.log('✅ Created STORE_LIST block')

  // Reorder remaining blocks
  const remainingBlocks = await prisma.pageBlock.findMany({
    where: { pageId: page.id },
    orderBy: { order: 'asc' }
  })

  for (let i = 0; i < remainingBlocks.length; i++) {
    await prisma.pageBlock.update({
      where: { id: remainingBlocks[i].id },
      data: { order: i + 1 }
    })
  }
  console.log('✅ Reordered blocks')

  // Update meta description
  await prisma.page.update({
    where: { id: page.id },
    data: {
      metaDescription: 'Retrouvez nos 15 boutiques Optique de Bourbon à travers La Réunion. Saint-Denis, Saint-Pierre, Saint-Paul, Le Port et plus encore.'
    }
  })
  console.log('✅ Updated meta description')

  console.log('\n✨ Done!')
  await prisma.$disconnect()
}

updateBoutiquesPage().catch(console.error)
