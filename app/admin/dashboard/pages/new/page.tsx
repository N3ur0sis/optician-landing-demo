import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import PageBuilderEditor from '../PageBuilderEditor';
import { Page } from '@/types/page-builder';

export default async function NewPagePage() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
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
