import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { hasPermission, parsePermissions } from '@/types/permissions';

// Helper to check navigation permission
async function checkNavigationPermission() {
  const session = await auth();
  if (!session?.user) {
    return { authorized: false, error: "Unauthorized", status: 401 };
  }
  const role = session.user.role as "ADMIN" | "WEBMASTER";
  const permissions = parsePermissions(session.user.permissions);
  if (!hasPermission(role, permissions, "navigation")) {
    return { authorized: false, error: "Permission denied", status: 403 };
  }
  return { authorized: true, session, status: 200 };
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET a single navigation item
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const item = await prisma.navigationItem.findUnique({
      where: { id },
      include: {
        menu: {
          select: { id: true, slug: true, name: true },
        },
        parent: {
          select: { id: true, label: true },
        },
        children: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!item) {
      return NextResponse.json({ error: 'Navigation item not found' }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error fetching navigation item:', error);
    return NextResponse.json({ error: 'Failed to fetch navigation item' }, { status: 500 });
  }
}

// PUT update a navigation item
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const check = await checkNavigationPermission();
    if (!check.authorized) {
      return NextResponse.json({ error: check.error }, { status: check.status });
    }

    const { id } = await params;
    const body = await request.json();

    const existingItem = await prisma.navigationItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json({ error: 'Navigation item not found' }, { status: 404 });
    }

    // Calculate depth if parent changed
    let newDepth = existingItem.depth;
    if (body.parentId !== undefined && body.parentId !== existingItem.parentId) {
      if (body.parentId === null) {
        newDepth = 0;
      } else {
        const newParent = await prisma.navigationItem.findUnique({
          where: { id: body.parentId },
        });
        if (!newParent) {
          return NextResponse.json({ error: 'Parent item not found' }, { status: 404 });
        }
        newDepth = newParent.depth + 1;
      }
    }

    const item = await prisma.navigationItem.update({
      where: { id },
      data: {
        label: body.label ?? existingItem.label,
        href: body.href !== undefined ? body.href : existingItem.href,
        menuId: body.menuId !== undefined ? body.menuId : existingItem.menuId,
        parentId: body.parentId !== undefined ? body.parentId : existingItem.parentId,
        order: body.order ?? existingItem.order,
        depth: newDepth,
        pageSlug: body.pageSlug !== undefined ? body.pageSlug : existingItem.pageSlug,
        openInNewTab: body.openInNewTab ?? existingItem.openInNewTab,
        icon: body.icon !== undefined ? body.icon : existingItem.icon,
        iconPosition: body.iconPosition ?? existingItem.iconPosition,
        cssClass: body.cssClass !== undefined ? body.cssClass : existingItem.cssClass,
        style: body.style ?? existingItem.style,
        dropdownStyle: body.dropdownStyle ?? existingItem.dropdownStyle,
        published: body.published ?? existingItem.published,
        highlighted: body.highlighted ?? existingItem.highlighted,
        parentClickable: body.parentClickable ?? existingItem.parentClickable,
      },
      include: {
        menu: {
          select: { id: true, slug: true, name: true },
        },
        children: {
          orderBy: { order: 'asc' },
        },
      },
    });

    // If depth changed and item has children, update children's depth recursively
    if (newDepth !== existingItem.depth) {
      await updateChildrenDepth(id, newDepth);
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating navigation item:', error);
    return NextResponse.json({ error: 'Failed to update navigation item' }, { status: 500 });
  }
}

// Helper to recursively update children depth
async function updateChildrenDepth(parentId: string, parentDepth: number) {
  const children = await prisma.navigationItem.findMany({
    where: { parentId },
  });

  for (const child of children) {
    await prisma.navigationItem.update({
      where: { id: child.id },
      data: { depth: parentDepth + 1 },
    });
    await updateChildrenDepth(child.id, parentDepth + 1);
  }
}

// DELETE a navigation item
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const check = await checkNavigationPermission();
    if (!check.authorized) {
      return NextResponse.json({ error: check.error }, { status: check.status });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const deleteChildren = searchParams.get('deleteChildren') !== 'false';

    const existingItem = await prisma.navigationItem.findUnique({
      where: { id },
      include: { children: true },
    });

    if (!existingItem) {
      return NextResponse.json({ error: 'Navigation item not found' }, { status: 404 });
    }

    if (!deleteChildren && existingItem.children.length > 0) {
      // Move children to parent's parent (promote them)
      await prisma.navigationItem.updateMany({
        where: { parentId: id },
        data: {
          parentId: existingItem.parentId,
          depth: existingItem.depth,
        },
      });
    }

    // Delete the item (cascade will delete children if not moved)
    await prisma.navigationItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting navigation item:', error);
    return NextResponse.json({ error: 'Failed to delete navigation item' }, { status: 500 });
  }
}
