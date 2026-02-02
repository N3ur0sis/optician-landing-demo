-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "navbarSubtitle" TEXT,
ADD COLUMN     "navbarTitle" TEXT,
ADD COLUMN     "showNavbarTitle" BOOLEAN NOT NULL DEFAULT false;
