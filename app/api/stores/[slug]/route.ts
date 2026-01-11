import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    
    // Fetch the store page with blocks
    const page = await prisma.page.findFirst({
      where: {
        OR: [
          { slug: `magasins/${slug}` },
          { slug: slug }
        ],
        published: true,
        deletedAt: null,
      },
      include: {
        blocks: {
          where: { visible: true },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!page) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    // Extract store data from blocks
    let address = '';
    let phone = '';
    let phone2 = '';
    let email = '';
    let rating = 0;
    let reviews = 0;
    let minutePassId = '';
    let city = '';
    let description = '';
    const hours: Record<string, string> = {};
    const services: string[] = [];
    const specialties: string[] = [];

    // Look for STORE_LAYOUT block (new format)
    const layoutBlock = page.blocks.find(b => b.type === 'STORE_LAYOUT');
    if (layoutBlock?.content) {
      const content = layoutBlock.content as Record<string, unknown>;
      
      // Contact info
      const contact = content.contact as Record<string, unknown> | undefined;
      if (contact) {
        address = contact.address as string || '';
        phone = contact.phone as string || '';
        phone2 = contact.phone2 as string || '';
        email = contact.email as string || '';
        Object.assign(hours, contact.hours || {});
      }

      // Services
      const servicesData = content.services as Record<string, unknown> | undefined;
      if (servicesData?.items) {
        services.push(...(servicesData.items as string[]));
      }

      // Specialties
      const specialtiesData = content.specialties as Record<string, unknown> | undefined;
      if (specialtiesData?.items) {
        const items = specialtiesData.items as Array<{ title: string; description?: string }>;
        items.forEach(s => specialties.push(s.title));
      }

      // CTA for minutePass
      const cta = content.cta as Record<string, unknown> | undefined;
      if (cta?.rdvUrl) {
        const rdvUrl = cta.rdvUrl as string;
        const placeIdMatch = rdvUrl.match(/placeId=(\d+)/);
        if (placeIdMatch) {
          minutePassId = placeIdMatch[1];
        }
      }

      // Reviews
      const reviewsData = content.reviews as Record<string, unknown> | undefined;
      if (reviewsData) {
        rating = reviewsData.rating as number || 0;
        reviews = reviewsData.reviewCount as number || 0;
      }
    }

    // Look for STORE_HERO block for description
    const heroBlock = page.blocks.find(b => b.type === 'STORE_HERO');
    if (heroBlock?.content) {
      const content = heroBlock.content as Record<string, unknown>;
      description = content.description as string || '';
      
      // Try to extract address from subtitle if not set
      if (!address && content.subtitle) {
        address = (content.subtitle as string).replace(' – ', '\n');
      }
    }

    // Fallback: Look for old STORE_CONTACT block
    const contactBlock = page.blocks.find(b => b.type === 'STORE_CONTACT');
    if (contactBlock?.content && !address) {
      const content = contactBlock.content as Record<string, unknown>;
      address = content.address as string || '';
      phone = phone || content.phone as string || '';
      phone2 = phone2 || content.phone2 as string || '';
      email = email || content.email as string || '';
      Object.assign(hours, content.hours || {});
    }

    // Fallback: Look for old STORE_SERVICES block
    const servicesBlock = page.blocks.find(b => b.type === 'STORE_SERVICES');
    if (servicesBlock?.content && services.length === 0) {
      const content = servicesBlock.content as Record<string, unknown>;
      const items = content.services as string[] | undefined;
      if (items) {
        services.push(...items);
      }
    }

    // Fallback: Look for old STORE_REVIEWS block
    const reviewsBlock = page.blocks.find(b => b.type === 'STORE_REVIEWS');
    if (reviewsBlock?.content && !rating) {
      const content = reviewsBlock.content as Record<string, unknown>;
      rating = content.rating as number || 0;
      reviews = content.reviewCount as number || 0;
    }

    // Extract city from address
    const addressLines = address.split('\n');
    if (addressLines.length > 1) {
      const lastLine = addressLines[addressLines.length - 1].trim();
      const cityMatch = lastLine.match(/\d{5}\s+(.+)/);
      if (cityMatch) {
        city = cityMatch[1];
      }
    }

    const store = {
      id: slug,
      name: page.title,
      address,
      phone,
      phone2,
      email,
      rating,
      reviews,
      minutePassId: minutePassId || null,
      city,
      description: description || page.metaDescription || '',
      featuredImage: `/uploads/stores/${slug}.jpg`,
      hours,
      services,
      specialties,
    };

    return NextResponse.json({ store });
  } catch (error) {
    console.error('Error fetching store:', error);
    return NextResponse.json({ error: 'Failed to fetch store' }, { status: 500 });
  }
}
