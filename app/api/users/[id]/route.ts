import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import bcrypt from "bcryptjs"

// GET /api/users/[id] - Get single user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé - Admin requis" }, { status: 401 })
    }

    const { id } = await params
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    )
  }
}

// PUT /api/users/[id] - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé - Admin requis" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { email, password, name, role } = body as {
      email?: string
      password?: string
      name?: string
      role?: "ADMIN" | "WEBMASTER"
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    // If email is being changed, check it's not already taken
    if (email && email !== existingUser.email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email }
      })
      if (emailTaken) {
        return NextResponse.json(
          { error: "Cet email est déjà utilisé" },
          { status: 400 }
        )
      }
    }

    // Build update data
    const updateData: {
      email?: string
      password?: string
      name?: string
      role?: "ADMIN" | "WEBMASTER"
    } = {}
    
    if (email) updateData.email = email
    if (name) updateData.name = name
    if (role) updateData.role = role
    if (password) {
      updateData.password = await bcrypt.hash(password, 12)
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    )
  }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé - Admin requis" }, { status: 401 })
    }

    const { id } = await params

    // Prevent self-deletion
    if (session.user.id === id) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas supprimer votre propre compte" },
        { status: 400 }
      )
    }

    // Check user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    // Count remaining admins if deleting an admin
    if (existingUser.role === "ADMIN") {
      const adminCount = await prisma.user.count({
        where: { role: "ADMIN" }
      })
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Impossible de supprimer le dernier administrateur" },
          { status: 400 }
        )
      }
    }

    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    )
  }
}
