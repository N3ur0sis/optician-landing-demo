-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BlockType" ADD VALUE 'INFO_BOX';
ALTER TYPE "BlockType" ADD VALUE 'HOURS_TABLE';
ALTER TYPE "BlockType" ADD VALUE 'SERVICES_LIST';
ALTER TYPE "BlockType" ADD VALUE 'CTA_CARD';
ALTER TYPE "BlockType" ADD VALUE 'REVIEW_BADGE';
ALTER TYPE "BlockType" ADD VALUE 'LOCATION_CARD';
ALTER TYPE "BlockType" ADD VALUE 'ICON_FEATURE';
