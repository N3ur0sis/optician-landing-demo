import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';
import AdminLayout from '@/components/AdminLayout';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <AdminLayout session={session}>
      <DashboardClient session={session} />
    </AdminLayout>
  );
}
