import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ApparenceClient from "./ApparenceClient";
import AdminLayout from "@/components/AdminLayout";
import { Metadata } from "next";
import { hasPermission, parsePermissions } from "@/types/permissions";

export const metadata: Metadata = {
  title: "Apparence | Admin ODB",
  description:
    "Personnalisation de l'apparence globale, logos, couleurs et animations",
};

export default async function ApparencePage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  // Check permission for apparence feature
  const role = session.user?.role as "ADMIN" | "WEBMASTER";
  const permissions = parsePermissions(session.user?.permissions);
  
  if (!hasPermission(role, permissions, "apparence")) {
    redirect('/admin/dashboard');
  }

  return (
    <AdminLayout session={session}>
      <ApparenceClient />
    </AdminLayout>
  );
}
