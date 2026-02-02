import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// GET a single menu by slug with all items
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const onlyPublished = searchParams.get('onlyPublished') === 'true';

    const menu = await prisma.navigationMenu.findUnique({
      where: { slug },
      include: {
        items: {
          where: onlyPublished ? { published: true } : undefined,
          orderBy: [{ depth: 'asc' }, { order: 'asc' }],
        },
      },
    });

    if (!menu) {
      return NextResponse.json({ error: 'Menu not found' }, { status: 404 });
    }

    // Build nested structure for easier frontend consumption
    const buildNestedItems = (items: typeof menu.items, parentId: string | null = null): unknown[] => {
      return items
        .filter(item => item.parentId === parentId)
        .map(item => ({
          ...item,
          children: buildNestedItems(items, item.id),
        }));
    };

    const nestedItems = buildNestedItems(menu.items);

    return NextResponse.json({
      ...menu,
      items: menu.items, // Flat list
      nestedItems, // Nested structure
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
  }
}

// PUT update a menu
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const body = await request.json();

    const existingMenu = await prisma.navigationMenu.findUnique({
      where: { slug },
    });

    if (!existingMenu) {
      return NextResponse.json({ error: 'Menu not found' }, { status: 404 });
    }

    // If slug is changing, check for conflicts
    if (body.slug && body.slug !== slug) {
      const slugConflict = await prisma.navigationMenu.findUnique({
        where: { slug: body.slug },
      });
      if (slugConflict) {
        return NextResponse.json(
          { error: 'A menu with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const menu = await prisma.navigationMenu.update({
      where: { slug },
      data: {
        name: body.name ?? existingMenu.name,
        slug: body.slug ?? existingMenu.slug,
        description: body.description !== undefined ? body.description : existingMenu.description,
        type: body.type ?? existingMenu.type,
        position: body.position ?? existingMenu.position,
        layout: body.layout ?? existingMenu.layout,
        alignment: body.alignment ?? existingMenu.alignment,
        animation: body.animation ?? existingMenu.animation,
        animationDuration: body.animationDuration ?? existingMenu.animationDuration,
        navbarHeight: body.navbarHeight ?? existingMenu.navbarHeight,
        fontSize: body.fontSize ?? existingMenu.fontSize,
        mobileFontSize: body.mobileFontSize ?? existingMenu.mobileFontSize,
        backgroundColor: body.backgroundColor !== undefined ? body.backgroundColor : existingMenu.backgroundColor,
        textColor: body.textColor !== undefined ? body.textColor : existingMenu.textColor,
        hoverColor: body.hoverColor !== undefined ? body.hoverColor : existingMenu.hoverColor,
        activeColor: body.activeColor !== undefined ? body.activeColor : existingMenu.activeColor,
        borderColor: body.borderColor !== undefined ? body.borderColor : existingMenu.borderColor,
        mobileMenuBg: body.mobileMenuBg !== undefined ? body.mobileMenuBg : existingMenu.mobileMenuBg,
        mobileMenuText: body.mobileMenuText !== undefined ? body.mobileMenuText : existingMenu.mobileMenuText,
        mobileMenuHover: body.mobileMenuHover !== undefined ? body.mobileMenuHover : existingMenu.mobileMenuHover,
        mobileMenuAccent: body.mobileMenuAccent !== undefined ? body.mobileMenuAccent : existingMenu.mobileMenuAccent,
        itemSpacing: body.itemSpacing ?? existingMenu.itemSpacing,
        padding: body.padding !== undefined ? body.padding : existingMenu.padding,
        dropdownAnimation: body.dropdownAnimation ?? existingMenu.dropdownAnimation,
        dropdownDelay: body.dropdownDelay ?? existingMenu.dropdownDelay,
        displayMode: body.displayMode ?? existingMenu.displayMode,
        shadowOnScroll: body.shadowOnScroll ?? existingMenu.shadowOnScroll,
        shrinkOnScroll: body.shrinkOnScroll ?? existingMenu.shrinkOnScroll,
        scrollOpacity: body.scrollOpacity ?? existingMenu.scrollOpacity,
        hideOnScrollDown: body.hideOnScrollDown ?? existingMenu.hideOnScrollDown,
        customCSS: body.customCSS !== undefined ? body.customCSS : existingMenu.customCSS,
        cssClasses: body.cssClasses !== undefined ? body.cssClasses : existingMenu.cssClasses,
        mobileBreakpoint: body.mobileBreakpoint ?? existingMenu.mobileBreakpoint,
        mobileStyle: body.mobileStyle ?? existingMenu.mobileStyle,
        published: body.published ?? existingMenu.published,
      },
      include: {
        items: {
          orderBy: [{ depth: 'asc' }, { order: 'asc' }],
        },
      },
    });

    return NextResponse.json(menu);
  } catch (error) {
    console.error('Error updating menu:', error);
    return NextResponse.json({ error: 'Failed to update menu' }, { status: 500 });
  }
}

// DELETE a menu
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;

    const existingMenu = await prisma.navigationMenu.findUnique({
      where: { slug },
    });

    if (!existingMenu) {
      return NextResponse.json({ error: 'Menu not found' }, { status: 404 });
    }

    // Cascade delete will remove all items
    await prisma.navigationMenu.delete({
      where: { slug },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting menu:', error);
    return NextResponse.json({ error: 'Failed to delete menu' }, { status: 500 });
  }
}
