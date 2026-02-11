import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SettingsClient from './SettingsClient';
import AdminLayout from '@/components/AdminLayout';

export default async function SettingsPage() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  // Only admins can access settings
  if (session.user?.role !== "ADMIN") {
    redirect('/admin/dashboard');
  }

  return (
    <AdminLayout session={session}>
      <SettingsClient />
    </AdminLayout>
  );
}
