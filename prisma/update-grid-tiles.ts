import 'dotenv/config'
import prisma from '../lib/prisma'

/**
 * Update script for grid tiles based on client requirements
 * Document: DOCUMENT DE RECUEIL DE CONTENUS – PAGE D'ACCUEIL
 * Date: Décembre 2025
 */

async function main() {
  console.log('🔄 Updating grid tiles based on client document...\n')

  // Delete existing grid tiles to start fresh
  await prisma.gridTile.deleteMany({})
  console.log('✓ Cleared existing grid tiles')

  // Create new grid tiles according to client requirements
  const tiles = [
    {
      title: 'Tout commence...',
      caption: 'Découvrir ODB',
      href: '/notre-histoire',
      backgroundUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80',
      colSpan: 4,
      rowSpan: 2,
      colStart: 1,
      rowStart: 1,
      overlayType: 'DARK' as const,
      order: 1,
      published: true,
    },
    {
      title: 'Nos boutiques',
      caption: 'Découvrir',
      href: '/nos-boutiques',
      backgroundUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&h=400&fit=crop&crop=center',
      colSpan: 2,
      rowSpan: 1,
      colStart: 1,
      rowStart: 3,
      overlayType: 'DARK' as const,
      order: 2,
      published: true,
    },
    {
      title: 'Prenez rendez-vous',
      caption: 'Réserver en ligne',
      href: '/prendre-rendez-vous',
      backgroundUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1400&q=80',
      colSpan: 2,
      rowSpan: 1,
      colStart: 3,
      rowStart: 3,
      overlayType: 'DARK' as const,
      order: 3,
      published: true,
    },
    {
      title: 'Nos actus',
      caption: '[SLIDER]',
      href: '/nos-actualités',
      backgroundUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=400&fit=crop&crop=center',
      colSpan: 4,
      rowSpan: 2,
      colStart: 1,
      rowStart: 4,
      overlayType: 'DARK' as const,
      order: 4,
      published: true,
    },
    {
      title: 'Nos services',
      caption: 'Découvrir',
      href: '/services',
      backgroundUrl: 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=600&h=400&fit=crop&crop=center',
      colSpan: 2,
      rowSpan: 1,
      colStart: 1,
      rowStart: 6,
      overlayType: 'DARK' as const,
      order: 5,
      published: true,
    },
    {
      title: 'Notre savoir-faire',
      caption: 'Découvrir',
      href: '/notre-savoir-faire',
      backgroundUrl: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=400&fit=crop&crop=center',
      colSpan: 2,
      rowSpan: 1,
      colStart: 3,
      rowStart: 6,
      overlayType: 'DARK' as const,
      order: 6,
      published: true,
    },
  ]

  for (const tile of tiles) {
    await prisma.gridTile.create({ data: tile })
    console.log(`✓ Created tile: ${tile.title}`)
  }

  console.log('\n✅ Grid tiles update complete!')
  console.log('\nNOTE: The following need client input:')
  console.log('  - Specific images for each card (upload to Drive)')
  console.log('  - Content details for "Tout commence..." card (subtitle text)')
  console.log('  - MinuPass iframe implementation for "Prenez rendez-vous"')
  console.log('  - Slider functionality for "Nos actus" card')
}

main()
  .catch((e) => {
    console.error('Error updating grid tiles:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
