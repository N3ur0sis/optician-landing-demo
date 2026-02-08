'use client';

import { motion } from 'framer-motion';
import DynamicNavbar from '@/components/DynamicNavbar';
import Footer from '@/components/Footer';
import BlockRenderer from '@/components/page-builder/BlockRenderer';
import { PageBuilderProvider } from '@/components/page-builder/PageBuilderContext';
import { Page, PageBlock } from '@/types/page-builder';

interface DynamicPageRendererProps {
  page: Page;
}

export default function DynamicPageRenderer({ page }: DynamicPageRendererProps) {
  // Check if page wants to show navbar title
  const showNavbarTitle = (page as Page & { showNavbarTitle?: boolean }).showNavbarTitle ?? false;
  const navbarTitle = (page as Page & { navbarTitle?: string }).navbarTitle || page.title;
  const navbarSubtitle = (page as Page & { navbarSubtitle?: string }).navbarSubtitle || '';

  // Determine if we should show the navigation header (always show on pages)
  const firstHeroBlock = page.blocks.find(b => b.type === 'HERO');
  const showNavHeader = !firstHeroBlock || page.template !== 'landing';

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: page.backgroundColor,
        color: page.textColor,
      }}
    >
      {/* Page Navigation - includes spacer for fixed navbar */}
      {showNavHeader && (
        <DynamicNavbar
          title={showNavbarTitle ? navbarTitle : undefined}
          subtitle={showNavbarTitle ? navbarSubtitle : undefined}
          showBackButton={showNavbarTitle}
        />
      )}

      {/* Page Content - no padding needed, navbar has spacer */}
      <PageBuilderProvider isEditing={false}>
        <div className="page-blocks-container">
          {page.blocks
            .filter(block => block.visible)
            .map((block, index) => {
              const styles = block.styles as Record<string, unknown>;
              const isInline = styles?.inline === true;
              
              if (isInline) {
                return (
                  <BlockRenderer key={block.id} block={block} />
                );
              }
              
              return (
                <motion.div
                  key={block.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <BlockRenderer block={block} />
                </motion.div>
              );
            })}
        </div>
      </PageBuilderProvider>

      {/* Footer */}
      {page.template !== 'minimal' && <Footer />}

      {/* Custom CSS */}
      {page.customCSS && (
        <style dangerouslySetInnerHTML={{ __html: page.customCSS }} />
      )}
    </main>
  );
}
