import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { hasPermission, parsePermissions } from '@/types/permissions';

// Helper to check navigation permission
async function checkNavigationPermission() {
  const session = await auth();
  if (!session) {
    return { authorized: false, error: "Unauthorized" };
  }
  
  const role = session.user?.role as "ADMIN" | "WEBMASTER";
  const permissions = parsePermissions(session.user?.permissions);
  
  if (!hasPermission(role, permissions, "navigation")) {
    return { authorized: false, error: "Permission denied" };
  }
  
  return { authorized: true, session };
}

// GET all navigation menus
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeItems = searchParams.get('includeItems') === 'true';
    const onlyPublished = searchParams.get('onlyPublished') === 'true';
    
    const menus = await prisma.navigationMenu.findMany({
      where: onlyPublished ? { published: true } : undefined,
      orderBy: { createdAt: 'asc' },
      include: includeItems ? {
        items: {
          where: onlyPublished ? { published: true } : undefined,
          orderBy: [{ depth: 'asc' }, { order: 'asc' }],
        },
      } : undefined,
    });

    return NextResponse.json(menus);
  } catch (error) {
    console.error('Error fetching menus:', error);
    return NextResponse.json({ error: 'Failed to fetch menus' }, { status: 500 });
  }
}

// POST create a new menu
export async function POST(request: Request) {
  try {
    const check = await checkNavigationPermission();
    if (!check.authorized) {
      return NextResponse.json({ error: check.error }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      slug,
      description,
      type = 'header',
      position = 'top',
      layout = 'horizontal',
      alignment = 'center',
      animation = 'none',
      animationDuration = 200,
      backgroundColor,
      textColor,
      hoverColor,
      activeColor,
      borderColor,
      itemSpacing = 24,
      padding,
      dropdownAnimation = 'fadeDown',
      dropdownDelay = 0,
      customCSS,
      cssClasses,
      mobileBreakpoint = 768,
      mobileStyle = 'hamburger',
      published = true,
    } = body;

    // Check for duplicate slug
    const existingMenu = await prisma.navigationMenu.findUnique({
      where: { slug },
    });

    if (existingMenu) {
      return NextResponse.json(
        { error: 'A menu with this slug already exists' },
        { status: 400 }
      );
    }

    const menu = await prisma.navigationMenu.create({
      data: {
        name,
        slug,
        description,
        type,
        position,
        layout,
        alignment,
        animation,
        animationDuration,
        backgroundColor,
        textColor,
        hoverColor,
        activeColor,
        borderColor,
        itemSpacing,
        padding,
        dropdownAnimation,
        dropdownDelay,
        customCSS,
        cssClasses,
        mobileBreakpoint,
        mobileStyle,
        published,
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(menu, { status: 201 });
  } catch (error) {
    console.error('Error creating menu:', error);
    return NextResponse.json({ error: 'Failed to create menu' }, { status: 500 });
  }
}
