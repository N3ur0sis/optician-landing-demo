'use client';

import { motion } from 'framer-motion';
import PageNavigation from '@/components/PageNavigation';
import Footer from '@/components/Footer';
import BlockRenderer from '@/components/page-builder/BlockRenderer';
import { Page, PageBlock } from '@/types/page-builder';

interface DynamicPageRendererProps {
  page: Page;
}

export default function DynamicPageRenderer({ page }: DynamicPageRendererProps) {
  // Get first heading block for page title, or use page title
  const firstHeroBlock = page.blocks.find(b => b.type === 'HERO');
  const heroContent = firstHeroBlock?.content as Record<string, unknown> | undefined;
  const pageTitle = heroContent?.title as string || page.title;
  const pageSubtitle = heroContent?.subtitle as string || '';

  // Determine if we should show the navigation header
  const showNavHeader = !firstHeroBlock || page.template !== 'landing';

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: page.backgroundColor,
        color: page.textColor,
      }}
    >
      {/* Page Navigation */}
      {showNavHeader && (
        <PageNavigation
          title={pageTitle}
          subtitle={pageSubtitle}
        />
      )}

      {/* Page Content */}
      <div className={showNavHeader ? 'pt-20' : ''}>
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
      </div>

      {/* Footer */}
      {page.template !== 'minimal' && <Footer />}

      {/* Custom CSS */}
      {page.customCSS && (
        <style dangerouslySetInnerHTML={{ __html: page.customCSS }} />
      )}
    </main>
  );
}
