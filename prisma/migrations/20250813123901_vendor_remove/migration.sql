/*
  Warnings:

  - You are about to drop the column `invoiceNo` on the `soldJewelleries` table. All the data in the column will be lost.
  - You are about to drop the column `vendorId` on the `soldJewelleries` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "soldJewelleries" DROP CONSTRAINT "soldJewelleries_vendorId_fkey";

-- AlterTable
ALTER TABLE "soldJewelleries" DROP COLUMN "invoiceNo",
DROP COLUMN "vendorId";
