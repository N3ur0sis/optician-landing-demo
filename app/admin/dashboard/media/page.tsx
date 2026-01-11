import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import AdminLayout from '@/components/AdminLayout';
import MediaDashboard from './MediaDashboard';

export default async function MediaPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <AdminLayout session={session}>
      <MediaDashboard />
    </AdminLayout>
  );
}
