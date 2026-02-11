-- CreateEnum
CREATE TYPE "BackupType" AS ENUM ('MANUAL', 'AUTO_PRE_IMPORT', 'AUTO_PRE_EXPORT', 'SCHEDULED');

-- CreateTable
CREATE TABLE "DatabaseBackup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "BackupType" NOT NULL DEFAULT 'MANUAL',
    "data" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "compressedSize" INTEGER,
    "version" TEXT NOT NULL DEFAULT '2.0',
    "stats" JSONB NOT NULL,
    "description" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isProtected" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "DatabaseBackup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DatabaseBackup_type_idx" ON "DatabaseBackup"("type");

-- CreateIndex
CREATE INDEX "DatabaseBackup_createdAt_idx" ON "DatabaseBackup"("createdAt");

-- CreateIndex
CREATE INDEX "DatabaseBackup_isProtected_idx" ON "DatabaseBackup"("isProtected");
