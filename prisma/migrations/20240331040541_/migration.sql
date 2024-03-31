/*
  Warnings:

  - A unique constraint covering the columns `[type,categoryId,label]` on the table `incomeExpenseHeads` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `incomeExpenseHeads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `incomeExpenseHeads` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "incomeExpenseHeads_label_key";

-- AlterTable
ALTER TABLE "incomeExpenseHeads" ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "type" "IncomeExpenseType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "incomeExpenseHeads_type_categoryId_label_key" ON "incomeExpenseHeads"("type", "categoryId", "label");

-- AddForeignKey
ALTER TABLE "incomeExpenseHeads" ADD CONSTRAINT "incomeExpenseHeads_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
