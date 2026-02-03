import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import PageBuilderEditor from '../PageBuilderEditor';
import { Page } from '@/types/page-builder';
import { hasPermission, parsePermissions } from '@/types/permissions';

export default async function NewPagePage() {
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

  // Create a blank page template
  const newPage: Page = {
    id: '',
    slug: '/nouvelle-page',
    title: 'Nouvelle page',
    metaTitle: undefined,
    metaDescription: undefined,
    published: false,
    publishedAt: undefined,
    template: 'default',
    backgroundColor: '#000000',
    textColor: '#ffffff',
    customCSS: undefined,
    showNavbarTitle: false,
    navbarTitle: undefined,
    navbarSubtitle: undefined,
    showInNav: false,
    navOrder: 0,
    navLabel: undefined,
    parentSlug: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    blocks: [],
  };

  return (
    <PageBuilderEditor page={newPage} isNew />
  );
}
