import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/AdminLayout"
import UsersClient from "./UsersClient"

export const metadata: Metadata = {
  title: "Utilisateurs | Admin ODB",
  description: "Gestion des comptes utilisateurs",
}

export default async function UsersPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/admin/login")
  }

  // Only admins can access user management
  if (session.user?.role !== "ADMIN") {
    redirect("/admin/dashboard")
  }

  return (
    <AdminLayout session={session}>
      <UsersClient />
    </AdminLayout>
  )
}
