import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET all navigation items (optionally filtered by menu)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const menuId = searchParams.get('menuId');
    const menuSlug = searchParams.get('menuSlug');
    const onlyPublished = searchParams.get('onlyPublished') === 'true';
    const nested = searchParams.get('nested') === 'true';

    // Build where clause
    const where: Record<string, unknown> = {};
    
    if (menuId) {
      where.menuId = menuId;
    } else if (menuSlug) {
      const menu = await prisma.navigationMenu.findUnique({
        where: { slug: menuSlug },
        select: { id: true },
      });
      if (menu) {
        where.menuId = menu.id;
      }
    }
    
    if (onlyPublished) {
      where.published = true;
    }

    const items = await prisma.navigationItem.findMany({
      where,
      orderBy: [{ depth: 'asc' }, { order: 'asc' }],
      include: {
        menu: {
          select: { id: true, slug: true, name: true },
        },
      },
    });

    if (nested) {
      // Build nested structure
      type NavItem = typeof items[number];
      const buildNestedItems = (allItems: NavItem[], parentId: string | null = null): (NavItem & { children: unknown[] })[] => {
        return allItems
          .filter((item: NavItem) => item.parentId === parentId)
          .map((item: NavItem) => ({
            ...item,
            children: buildNestedItems(allItems, item.id),
          }));
      };
      
      return NextResponse.json(buildNestedItems(items));
    }

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching navigation items:', error);
    return NextResponse.json({ error: 'Failed to fetch navigation items' }, { status: 500 });
  }
}

// POST create a new navigation item
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      label,
      href,
      menuId,
      parentId,
      order,
      depth = 0,
      pageSlug,
      openInNewTab = false,
      icon,
      iconPosition = 'left',
      cssClass,
      style = {},
      dropdownStyle = 'dropdown',
      published = true,
      highlighted = false,
    } = body;

    // Validate menu exists
    if (menuId) {
      const menu = await prisma.navigationMenu.findUnique({
        where: { id: menuId },
      });
      if (!menu) {
        return NextResponse.json({ error: 'Menu not found' }, { status: 404 });
      }
    }

    // If parent is specified, validate and calculate depth
    let calculatedDepth = depth;
    if (parentId) {
      const parent = await prisma.navigationItem.findUnique({
        where: { id: parentId },
      });
      if (!parent) {
        return NextResponse.json({ error: 'Parent item not found' }, { status: 404 });
      }
      calculatedDepth = parent.depth + 1;
    }

    // Get next order if not provided
    let calculatedOrder = order;
    if (calculatedOrder === undefined) {
      const lastItem = await prisma.navigationItem.findFirst({
        where: { menuId, parentId: parentId || null },
        orderBy: { order: 'desc' },
      });
      calculatedOrder = (lastItem?.order ?? -1) + 1;
    }

    const item = await prisma.navigationItem.create({
      data: {
        label,
        href,
        menuId,
        parentId,
        order: calculatedOrder,
        depth: calculatedDepth,
        pageSlug,
        openInNewTab,
        icon,
        iconPosition,
        cssClass,
        style,
        dropdownStyle,
        published,
        highlighted,
      },
      include: {
        menu: {
          select: { id: true, slug: true, name: true },
        },
        children: true,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating navigation item:', error);
    return NextResponse.json({ error: 'Failed to create navigation item' }, { status: 500 });
  }
}

// PUT bulk update items (for reordering, moving between menus, etc.)
export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { items } = body;

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Items must be an array' }, { status: 400 });
    }

    // Update all items in a transaction
    const updates = await prisma.$transaction(
      items.map((item: { id: string; order?: number; parentId?: string | null; depth?: number; menuId?: string }) =>
        prisma.navigationItem.update({
          where: { id: item.id },
          data: {
            order: item.order,
            parentId: item.parentId,
            depth: item.depth,
            menuId: item.menuId,
          },
        })
      )
    );

    return NextResponse.json({ success: true, updated: updates.length });
  } catch (error) {
    console.error('Error bulk updating items:', error);
    return NextResponse.json({ error: 'Failed to update items' }, { status: 500 });
  }
}
