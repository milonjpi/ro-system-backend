-- DropForeignKey
ALTER TABLE "buildingExpenses" DROP CONSTRAINT "buildingExpenses_brandId_fkey";

-- AlterTable
ALTER TABLE "buildingExpenses" ALTER COLUMN "brandId" DROP NOT NULL,
ALTER COLUMN "paidAmount" SET DEFAULT 0;

-- AddForeignKey
ALTER TABLE "buildingExpenses" ADD CONSTRAINT "buildingExpenses_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "buildingBrands"("id") ON DELETE SET NULL ON UPDATE CASCADE;
