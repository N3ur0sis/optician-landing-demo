-- AlterTable
ALTER TABLE "NavigationMenu" ADD COLUMN     "mobileMenuAccent" TEXT DEFAULT '#f59e0b',
ADD COLUMN     "mobileMenuBg" TEXT DEFAULT 'rgba(0,0,0,0.95)',
ADD COLUMN     "mobileMenuText" TEXT DEFAULT '#ffffff',
ADD COLUMN     "navbarHeight" INTEGER NOT NULL DEFAULT 64;
