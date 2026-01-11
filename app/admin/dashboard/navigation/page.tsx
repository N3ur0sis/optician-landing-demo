import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import NavigationManagerClient from './NavigationManagerClient';

export default async function NavigationPage() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <AdminLayout session={session}>
      <NavigationManagerClient />
    </AdminLayout>
  );
}
