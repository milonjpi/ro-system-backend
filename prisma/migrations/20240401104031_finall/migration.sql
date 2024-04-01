/*
  Warnings:

  - A unique constraint covering the columns `[type,categoryId,label]` on the table `incomeExpenseHeads` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "incomeExpenseHeads_label_key";

-- CreateIndex
CREATE UNIQUE INDEX "incomeExpenseHeads_type_categoryId_label_key" ON "incomeExpenseHeads"("type", "categoryId", "label");
