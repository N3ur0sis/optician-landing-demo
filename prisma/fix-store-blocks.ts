import 'dotenv/config'
import { PrismaClient } from './generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function fixStoreBlocks() {
  console.log('🔧 Fixing store page blocks...\n')
  
  // Delete all COLUMNS blocks from store pages
  const deleted = await prisma.pageBlock.deleteMany({
    where: {
      type: 'COLUMNS',
      page: {
        parentSlug: 'magasins'
      }
    }
  })
  console.log(`✅ Deleted ${deleted.count} COLUMNS blocks`)
  
  // Update order for remaining blocks
  const pages = await prisma.page.findMany({
    where: { parentSlug: 'magasins' },
    include: { blocks: { orderBy: { order: 'asc' } } }
  })
  
  for (const page of pages) {
    for (let i = 0; i < page.blocks.length; i++) {
      await prisma.pageBlock.update({
        where: { id: page.blocks[i].id },
        data: { order: i }
      })
    }
  }
  console.log(`✅ Fixed block orders for ${pages.length} pages`)
  
  await prisma.$disconnect()
}

fixStoreBlocks().catch(console.error)
