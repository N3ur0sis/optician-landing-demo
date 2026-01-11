import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/AdminLayout"
import SettingsClient from "./SettingsClient"

export const metadata: Metadata = {
  title: "Paramètres | Admin ODB",
  description: "Configuration générale du site",
}

export default async function SettingsPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/admin/login")
  }

  return (
    <AdminLayout session={session}>
      <SettingsClient />
    </AdminLayout>
  )
}
