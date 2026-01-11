/*
  Warnings:

  - The `type` column on the `Section` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BlockType" AS ENUM ('HERO', 'TEXT', 'HEADING', 'PARAGRAPH', 'QUOTE', 'LIST', 'IMAGE', 'GALLERY', 'VIDEO', 'FILE', 'COLUMNS', 'GRID', 'SPACER', 'DIVIDER', 'CONTAINER', 'BUTTON', 'LINK_BLOCK', 'ACCORDION', 'TABS', 'TABLE', 'STATS', 'TIMELINE', 'CARDS', 'IFRAME', 'MAP', 'SOCIAL', 'TEAM', 'TESTIMONIALS', 'PRICING', 'FAQ', 'CONTACT_FORM', 'NEWSLETTER', 'FEATURES');

-- CreateEnum
CREATE TYPE "TextAlign" AS ENUM ('LEFT', 'CENTER', 'RIGHT', 'JUSTIFY');

-- CreateEnum
CREATE TYPE "ContainerWidth" AS ENUM ('NARROW', 'MEDIUM', 'WIDE', 'FULL', 'EDGE');

-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_pageId_fkey";

-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "backgroundColor" TEXT NOT NULL DEFAULT '#000000',
ADD COLUMN     "customCSS" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "navLabel" TEXT,
ADD COLUMN     "navOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "parentSlug" TEXT,
ADD COLUMN     "showInNav" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "template" TEXT NOT NULL DEFAULT 'default',
ADD COLUMN     "textColor" TEXT NOT NULL DEFAULT '#ffffff';

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'TEXT';

-- DropEnum
DROP TYPE "SectionType";

-- CreateTable
CREATE TABLE "PageRevision" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "template" TEXT NOT NULL,
    "backgroundColor" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "customCSS" TEXT,
    "published" BOOLEAN NOT NULL,
    "showInNav" BOOLEAN NOT NULL,
    "navOrder" INTEGER NOT NULL,
    "navLabel" TEXT,
    "parentSlug" TEXT,
    "blocksSnapshot" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "changeNote" TEXT,

    CONSTRAINT "PageRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageBlock" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "type" "BlockType" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "content" JSONB NOT NULL,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "styles" JSONB NOT NULL DEFAULT '{}',
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PageBlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PageRevision_pageId_createdAt_idx" ON "PageRevision"("pageId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PageRevision_pageId_version_key" ON "PageRevision"("pageId", "version");

-- CreateIndex
CREATE INDEX "PageBlock_pageId_order_idx" ON "PageBlock"("pageId", "order");

-- CreateIndex
CREATE INDEX "PageBlock_type_idx" ON "PageBlock"("type");

-- CreateIndex
CREATE INDEX "Page_navOrder_idx" ON "Page"("navOrder");

-- CreateIndex
CREATE INDEX "Page_deletedAt_idx" ON "Page"("deletedAt");

-- AddForeignKey
ALTER TABLE "PageRevision" ADD CONSTRAINT "PageRevision_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageBlock" ADD CONSTRAINT "PageBlock_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
