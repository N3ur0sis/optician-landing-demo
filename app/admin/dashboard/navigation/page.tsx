import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import NavigationManagerClient from './NavigationManagerClient';
import { hasPermission, parsePermissions } from '@/types/permissions';

export default async function NavigationPage() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  // Check permission for navigation feature
  const role = session.user?.role as "ADMIN" | "WEBMASTER";
  const permissions = parsePermissions(session.user?.permissions);
  
  if (!hasPermission(role, permissions, "navigation")) {
    redirect('/admin/dashboard');
  }

  return (
    <AdminLayout session={session}>
      <NavigationManagerClient />
    </AdminLayout>
  );
}
