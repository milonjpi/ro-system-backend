/*
  Warnings:

  - Added the required column `accountHeadId` to the `equipmentOuts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "equipmentOuts" ADD COLUMN     "accountHeadId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "equipmentOuts" ADD CONSTRAINT "equipmentOuts_accountHeadId_fkey" FOREIGN KEY ("accountHeadId") REFERENCES "accountHeads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
