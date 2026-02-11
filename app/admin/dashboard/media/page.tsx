import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import AdminLayout from '@/components/AdminLayout';
import MediaDashboard from './MediaDashboard';
import { hasPermission, parsePermissions } from '@/types/permissions';

export default async function MediaPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/admin/login');
  }

  // Check permission for media feature
  const role = session.user?.role as "ADMIN" | "WEBMASTER";
  const permissions = parsePermissions(session.user?.permissions);
  
  if (!hasPermission(role, permissions, "media")) {
    redirect('/admin/dashboard');
  }

  return (
    <AdminLayout session={session}>
      <MediaDashboard />
    </AdminLayout>
  );
}
