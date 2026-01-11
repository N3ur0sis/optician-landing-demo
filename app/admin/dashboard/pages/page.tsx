import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import PagesListClient from './PagesListClient';

export default async function PagesPage() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <AdminLayout session={session}>
      <PagesListClient />
    </AdminLayout>
  );
}
