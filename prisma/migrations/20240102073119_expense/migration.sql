/*
  Warnings:

  - You are about to drop the column `refNo` on the `expenses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "expenses" DROP COLUMN "refNo",
ADD COLUMN     "remarks" TEXT;
