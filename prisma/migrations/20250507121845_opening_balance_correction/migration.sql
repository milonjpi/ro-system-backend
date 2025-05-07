-- DropIndex
DROP INDEX "openingBalances_year_month_key";

-- AlterTable
ALTER TABLE "openingBalances" ADD COLUMN     "date" TIMESTAMP(3),
ADD COLUMN     "sourceId" TEXT;

-- CreateTable
CREATE TABLE "sources" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sources_label_key" ON "sources"("label");

-- AddForeignKey
ALTER TABLE "openingBalances" ADD CONSTRAINT "openingBalances_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;
