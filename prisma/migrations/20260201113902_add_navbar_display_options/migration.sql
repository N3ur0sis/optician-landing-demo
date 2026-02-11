-- AlterTable
ALTER TABLE "NavigationItem" ADD COLUMN     "parentClickable" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "NavigationMenu" ADD COLUMN     "blurOnScroll" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "displayMode" TEXT NOT NULL DEFAULT 'hamburger-only',
ADD COLUMN     "hideOnScrollDown" BOOLEAN NOT NULL DEFAULT false;
