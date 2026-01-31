import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ApparenceClient from "./ApparenceClient";
import AdminLayout from "@/components/AdminLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apparence | Admin ODB",
  description: "Personnalisation de l'apparence globale, logos, couleurs et animations",
};

export default async function ApparencePage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <AdminLayout session={session}>
      <ApparenceClient />
    </AdminLayout>
  );
}
