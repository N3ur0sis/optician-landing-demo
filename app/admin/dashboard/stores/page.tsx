import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import StoresClient from './StoresClient';
import { hasPermission, parsePermissions } from '@/types/permissions';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Boutiques | Admin ODB",
  description: "Gestion des boutiques et points de vente",
};

export default async function StoresPage() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  // Check permission for stores feature
  const role = session.user?.role as "ADMIN" | "WEBMASTER";
  const permissions = parsePermissions(session.user?.permissions);
  
  if (!hasPermission(role, permissions, "stores")) {
    redirect('/admin/dashboard');
  }

  return (
    <AdminLayout session={session}>
      <StoresClient />
    </AdminLayout>
  );
}
