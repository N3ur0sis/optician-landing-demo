-- AlterTable: Add new scroll options columns
ALTER TABLE "NavigationMenu" ADD COLUMN "shadowOnScroll" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "NavigationMenu" ADD COLUMN "shrinkOnScroll" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "NavigationMenu" ADD COLUMN "scrollOpacity" INTEGER NOT NULL DEFAULT 100;

-- Migrate data from blurOnScroll to shadowOnScroll (preserving existing values)
UPDATE "NavigationMenu" SET "shadowOnScroll" = "blurOnScroll";

-- Drop the old blurOnScroll column
ALTER TABLE "NavigationMenu" DROP COLUMN "blurOnScroll";
