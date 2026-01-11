-- AlterTable
ALTER TABLE "NavigationItem" ADD COLUMN     "cssClass" TEXT,
ADD COLUMN     "depth" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dropdownStyle" TEXT NOT NULL DEFAULT 'dropdown',
ADD COLUMN     "highlighted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "iconPosition" TEXT NOT NULL DEFAULT 'left',
ADD COLUMN     "menuId" TEXT,
ADD COLUMN     "openInNewTab" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pageSlug" TEXT,
ADD COLUMN     "style" JSONB NOT NULL DEFAULT '{}',
ALTER COLUMN "href" DROP NOT NULL;

-- CreateTable
CREATE TABLE "NavigationMenu" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'header',
    "position" TEXT NOT NULL DEFAULT 'top',
    "layout" TEXT NOT NULL DEFAULT 'horizontal',
    "alignment" TEXT NOT NULL DEFAULT 'center',
    "animation" TEXT NOT NULL DEFAULT 'none',
    "animationDuration" INTEGER NOT NULL DEFAULT 200,
    "backgroundColor" TEXT,
    "textColor" TEXT,
    "hoverColor" TEXT,
    "activeColor" TEXT,
    "borderColor" TEXT,
    "itemSpacing" INTEGER NOT NULL DEFAULT 24,
    "padding" TEXT,
    "dropdownAnimation" TEXT NOT NULL DEFAULT 'fadeDown',
    "dropdownDelay" INTEGER NOT NULL DEFAULT 0,
    "customCSS" TEXT,
    "cssClasses" TEXT,
    "mobileBreakpoint" INTEGER NOT NULL DEFAULT 768,
    "mobileStyle" TEXT NOT NULL DEFAULT 'hamburger',
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NavigationMenu_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NavigationMenu_slug_key" ON "NavigationMenu"("slug");

-- CreateIndex
CREATE INDEX "NavigationMenu_slug_idx" ON "NavigationMenu"("slug");

-- CreateIndex
CREATE INDEX "NavigationMenu_type_idx" ON "NavigationMenu"("type");

-- CreateIndex
CREATE INDEX "NavigationMenu_published_idx" ON "NavigationMenu"("published");

-- CreateIndex
CREATE INDEX "NavigationItem_menuId_order_idx" ON "NavigationItem"("menuId", "order");

-- CreateIndex
CREATE INDEX "NavigationItem_pageSlug_idx" ON "NavigationItem"("pageSlug");

-- AddForeignKey
ALTER TABLE "NavigationItem" ADD CONSTRAINT "NavigationItem_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "NavigationMenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
