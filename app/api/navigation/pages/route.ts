import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET all pages available for linking in navigation
export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pages = await prisma.page.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        slug: true,
        title: true,
        published: true,
        navLabel: true,
        showInNav: true,
      },
      orderBy: [{ navOrder: 'asc' }, { title: 'asc' }],
    });

    return NextResponse.json(pages);
  } catch (error) {
    console.error('Error fetching pages for navigation:', error);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}
