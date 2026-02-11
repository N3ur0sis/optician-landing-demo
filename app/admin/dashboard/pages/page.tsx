import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import PagesListClient from './PagesListClient';
import { hasPermission, parsePermissions } from '@/types/permissions';

export default async function PagesPage() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  // Check permission for pages feature
  const role = session.user?.role as "ADMIN" | "WEBMASTER";
  const permissions = parsePermissions(session.user?.permissions);
  
  if (!hasPermission(role, permissions, "pages")) {
    redirect('/admin/dashboard');
  }

  return (
    <AdminLayout session={session}>
      <PagesListClient />
    </AdminLayout>
  );
}
