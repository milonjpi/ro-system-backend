/*
  Warnings:

  - You are about to drop the column `unitPrice` on the `jewelleries` table. All the data in the column will be lost.
  - You are about to drop the column `uomId` on the `jewelleries` table. All the data in the column will be lost.
  - You are about to drop the `jewelleryUom` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[label,category]` on the table `carats` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "JewelleryCategory" AS ENUM ('DIAMOND', 'GOLD', 'SILVER');

-- DropForeignKey
ALTER TABLE "jewelleries" DROP CONSTRAINT "jewelleries_uomId_fkey";

-- DropIndex
DROP INDEX "carats_label_key";

-- AlterTable
ALTER TABLE "carats" ADD COLUMN     "category" "JewelleryCategory" NOT NULL DEFAULT 'GOLD';

-- AlterTable
ALTER TABLE "jewelleries" DROP COLUMN "unitPrice",
DROP COLUMN "uomId",
ADD COLUMN     "category" "JewelleryCategory" NOT NULL DEFAULT 'GOLD';

-- DropTable
DROP TABLE "jewelleryUom";

-- CreateIndex
CREATE UNIQUE INDEX "carats_label_category_key" ON "carats"("label", "category");
