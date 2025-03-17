/*
  Warnings:

  - You are about to drop the column `expenseTypeId` on the `monthlyExpenseHeads` table. All the data in the column will be lost.
  - You are about to drop the column `expenseTypeId` on the `monthlyExpenses` table. All the data in the column will be lost.
  - You are about to drop the `expenseTypes` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[label]` on the table `monthlyExpenseHeads` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "monthlyExpenseHeads" DROP CONSTRAINT "monthlyExpenseHeads_expenseTypeId_fkey";

-- DropForeignKey
ALTER TABLE "monthlyExpenses" DROP CONSTRAINT "monthlyExpenses_expenseTypeId_fkey";

-- DropIndex
DROP INDEX "monthlyExpenseHeads_expenseTypeId_label_key";

-- AlterTable
ALTER TABLE "monthlyExpenseHeads" DROP COLUMN "expenseTypeId";

-- AlterTable
ALTER TABLE "monthlyExpenses" DROP COLUMN "expenseTypeId";

-- DropTable
DROP TABLE "expenseTypes";

-- CreateIndex
CREATE UNIQUE INDEX "monthlyExpenseHeads_label_key" ON "monthlyExpenseHeads"("label");
