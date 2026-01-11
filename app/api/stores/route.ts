import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch all published store pages (pages with parentSlug 'magasins')
    const storePages = await prisma.page.findMany({
      where: {
        parentSlug: 'magasins',
        published: true,
        deletedAt: null,
      },
      include: {
        blocks: {
          where: { visible: true },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: {
        title: 'asc'
      }
    });

    // Transform pages into store data format for the listing
    const stores = storePages.map((page) => {
      // Get the slug without the 'magasins/' prefix for the ID
      const storeId = page.slug.replace('magasins/', '');
      
      // Extract store data from blocks
      let address = '';
      let phone = '';
      let rating = 0;
      let reviews = 0;

      // First try STORE_LAYOUT block (new format)
      const layoutBlock = page.blocks.find(b => b.type === 'STORE_LAYOUT');
      if (layoutBlock?.content) {
        const content = layoutBlock.content as Record<string, unknown>;
        
        // Contact info
        const contact = content.contact as Record<string, unknown> | undefined;
        if (contact) {
          address = (contact.address as string || '').replace(/\n/g, ', ');
          phone = contact.phone as string || '';
        }

        // Reviews
        const reviewsData = content.reviews as Record<string, unknown> | undefined;
        if (reviewsData) {
          rating = reviewsData.rating as number || 0;
          reviews = reviewsData.reviewCount as number || 0;
        }
      }

      // Find STORE_HERO block for basic info (fallback or additional)
      if (!address) {
        const heroBlock = page.blocks.find(b => b.type === 'STORE_HERO');
        if (heroBlock?.content) {
          const content = heroBlock.content as Record<string, unknown>;
          address = (content.subtitle as string)?.replace(' – ', ', ') || '';
        }
      }

      // Find STORE_CONTACT block for phone (fallback)
      if (!phone || !address) {
        const contactBlock = page.blocks.find(b => b.type === 'STORE_CONTACT');
        if (contactBlock?.content) {
          const content = contactBlock.content as Record<string, unknown>;
          phone = phone || content.phone as string || '';
          if (!address && content.address) {
            address = (content.address as string).replace('\n', ', ');
          }
        }
      }

      // Find STORE_REVIEWS block for rating (fallback)
      if (!rating) {
        const reviewsBlock = page.blocks.find(b => b.type === 'STORE_REVIEWS');
        if (reviewsBlock?.content) {
          const content = reviewsBlock.content as Record<string, unknown>;
          rating = content.rating as number || 0;
          reviews = content.reviewCount as number || 0;
        }
      }

      // Fallback to old block types for backward compatibility
      if (!address || !phone) {
        const cardsBlock = page.blocks.find(b => b.type === 'CARDS');
        if (cardsBlock?.content) {
          const content = cardsBlock.content as Record<string, unknown>;
          const cards = content.cards as Array<{ title: string; description: string }> || [];
          
          for (const card of cards) {
            if (card.title === 'Adresse' && !address) {
              address = card.description.replace(/\n/g, ', ');
            }
            if (card.title === 'Téléphone' && !phone) {
              const phones = card.description.split('\n');
              phone = phones[0] || '';
            }
            if (card.title === 'Note clients' && !rating) {
              const match = card.description.match(/(\d+\.?\d*)\/5.*\((\d+)/);
              if (match) {
                rating = parseFloat(match[1]);
                reviews = parseInt(match[2], 10);
              }
            }
          }
        }
      }

      return {
        id: storeId,
        name: page.title,
        address,
        phone,
        rating,
        reviews,
        image: `/uploads/stores/${storeId}.jpg`,
      };
    });

    return NextResponse.json({ stores });
  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json({ error: 'Failed to fetch stores' }, { status: 500 });
  }
}
