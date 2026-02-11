-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BlockType" ADD VALUE 'STORE_LIST';
ALTER TYPE "BlockType" ADD VALUE 'STORE_HERO';
ALTER TYPE "BlockType" ADD VALUE 'STORE_CONTACT';
ALTER TYPE "BlockType" ADD VALUE 'STORE_SERVICES';
ALTER TYPE "BlockType" ADD VALUE 'STORE_CTA';
ALTER TYPE "BlockType" ADD VALUE 'STORE_REVIEWS';
ALTER TYPE "BlockType" ADD VALUE 'STORE_MAP';
ALTER TYPE "BlockType" ADD VALUE 'STORE_LAYOUT';

-- AlterTable
ALTER TABLE "Page" ALTER COLUMN "backgroundColor" SET DEFAULT '#ffffff',
ALTER COLUMN "textColor" SET DEFAULT '#171717';

-- CreateTable
CREATE TABLE "PageView" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "pageId" TEXT,
    "sessionId" TEXT NOT NULL,
    "userAgent" TEXT,
    "referrer" TEXT,
    "country" TEXT,
    "city" TEXT,
    "device" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyStats" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "path" TEXT NOT NULL,
    "pageId" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "uniqueVisitors" INTEGER NOT NULL DEFAULT 0,
    "avgDuration" DOUBLE PRECISION,
    "bounceRate" DOUBLE PRECISION,
    "desktopViews" INTEGER NOT NULL DEFAULT 0,
    "mobileViews" INTEGER NOT NULL DEFAULT 0,
    "tabletViews" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActiveSession" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pageViews" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ActiveSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PageView_path_idx" ON "PageView"("path");

-- CreateIndex
CREATE INDEX "PageView_pageId_idx" ON "PageView"("pageId");

-- CreateIndex
CREATE INDEX "PageView_sessionId_idx" ON "PageView"("sessionId");

-- CreateIndex
CREATE INDEX "PageView_createdAt_idx" ON "PageView"("createdAt");

-- CreateIndex
CREATE INDEX "PageView_device_idx" ON "PageView"("device");

-- CreateIndex
CREATE INDEX "DailyStats_date_idx" ON "DailyStats"("date");

-- CreateIndex
CREATE INDEX "DailyStats_path_idx" ON "DailyStats"("path");

-- CreateIndex
CREATE INDEX "DailyStats_pageId_idx" ON "DailyStats"("pageId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyStats_date_path_key" ON "DailyStats"("date", "path");

-- CreateIndex
CREATE UNIQUE INDEX "ActiveSession_sessionId_key" ON "ActiveSession"("sessionId");

-- CreateIndex
CREATE INDEX "ActiveSession_lastSeenAt_idx" ON "ActiveSession"("lastSeenAt");

-- CreateIndex
CREATE INDEX "ActiveSession_path_idx" ON "ActiveSession"("path");
