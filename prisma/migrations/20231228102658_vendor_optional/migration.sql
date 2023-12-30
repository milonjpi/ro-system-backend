-- DropForeignKey
ALTER TABLE "expenses" DROP CONSTRAINT "expenses_vendorId_fkey";

-- AlterTable
ALTER TABLE "expenses" ALTER COLUMN "vendorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
