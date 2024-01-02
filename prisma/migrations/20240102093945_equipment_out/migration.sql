/*
  Warnings:

  - You are about to drop the column `accountHeadId` on the `equipmentIns` table. All the data in the column will be lost.
  - You are about to drop the column `accountHeadId` on the `equipmentOuts` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `equipmentOuts` table. All the data in the column will be lost.
  - You are about to drop the column `unitPrice` on the `equipmentOuts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "equipmentIns" DROP CONSTRAINT "equipmentIns_accountHeadId_fkey";

-- DropForeignKey
ALTER TABLE "equipmentOuts" DROP CONSTRAINT "equipmentOuts_accountHeadId_fkey";

-- AlterTable
ALTER TABLE "equipmentIns" DROP COLUMN "accountHeadId";

-- AlterTable
ALTER TABLE "equipmentOuts" DROP COLUMN "accountHeadId",
DROP COLUMN "totalPrice",
DROP COLUMN "unitPrice";
