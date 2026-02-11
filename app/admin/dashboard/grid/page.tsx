import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import GridManagerClient from './GridManagerClient';
import AdminLayout from '@/components/AdminLayout';
import { hasPermission, parsePermissions } from '@/types/permissions';

export default async function GridManagerPage() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  // Check permission for grid feature
  const role = session.user?.role as "ADMIN" | "WEBMASTER";
  const permissions = parsePermissions(session.user?.permissions);
  
  if (!hasPermission(role, permissions, "grid")) {
    redirect('/admin/dashboard');
  }

  return (
    <AdminLayout session={session}>
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <GridManagerClient />
        </main>
      </div>
    </AdminLayout>
  );
}
