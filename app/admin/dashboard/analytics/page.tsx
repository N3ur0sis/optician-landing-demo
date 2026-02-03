import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/AdminLayout"
import AnalyticsClient from "./AnalyticsClient"
import { hasPermission, parsePermissions } from "@/types/permissions"

export const metadata: Metadata = {
  title: "Analytics | Admin ODB",
  description: "Statistiques de fréquentation du site",
}

export default async function AnalyticsPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/admin/login")
  }

  // Check permission for analytics feature
  const role = session.user?.role as "ADMIN" | "WEBMASTER";
  const permissions = parsePermissions(session.user?.permissions);
  
  if (!hasPermission(role, permissions, "analytics")) {
    redirect("/admin/dashboard");
  }

  return (
    <AdminLayout session={session}>
      <AnalyticsClient />
    </AdminLayout>
  )
}
