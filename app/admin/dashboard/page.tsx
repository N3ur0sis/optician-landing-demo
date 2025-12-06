import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  return <DashboardClient session={session} />;
}
