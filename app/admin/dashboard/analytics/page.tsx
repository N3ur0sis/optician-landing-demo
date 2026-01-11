import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/AdminLayout"
import AnalyticsClient from "./AnalyticsClient"

export const metadata: Metadata = {
  title: "Analytics | Admin ODB",
  description: "Statistiques de fréquentation du site",
}

export default async function AnalyticsPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/admin/login")
  }

  return (
    <AdminLayout session={session}>
      <AnalyticsClient />
    </AdminLayout>
  )
}
