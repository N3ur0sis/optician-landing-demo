-- AlterTable
ALTER TABLE "GridTile" ADD COLUMN "overlayColor" TEXT;
ALTER TABLE "GridTile" ADD COLUMN "overlayOpacity" INTEGER NOT NULL DEFAULT 60;
