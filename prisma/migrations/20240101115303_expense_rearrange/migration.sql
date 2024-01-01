/*
  Warnings:

  - You are about to drop the column `discount` on the `expenses` table. All the data in the column will be lost.
  - You are about to drop the column `paidAmount` on the `expenses` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `expenses` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `expenses` table. All the data in the column will be lost.
  - You are about to drop the column `totalQty` on the `expenses` table. All the data in the column will be lost.
  - You are about to drop the `expenseDetails` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `expenseHeadId` to the `expenses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "expenseDetails" DROP CONSTRAINT "expenseDetails_expenseHeadId_fkey";

-- DropForeignKey
ALTER TABLE "expenseDetails" DROP CONSTRAINT "expenseDetails_expenseId_fkey";

-- AlterTable
ALTER TABLE "expenses" DROP COLUMN "discount",
DROP COLUMN "paidAmount",
DROP COLUMN "status",
DROP COLUMN "totalPrice",
DROP COLUMN "totalQty",
ADD COLUMN     "expenseHeadId" TEXT NOT NULL;

-- DropTable
DROP TABLE "expenseDetails";

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_expenseHeadId_fkey" FOREIGN KEY ("expenseHeadId") REFERENCES "expenseHeads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
