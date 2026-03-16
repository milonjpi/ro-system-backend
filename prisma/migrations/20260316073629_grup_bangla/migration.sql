/*
  Warnings:

  - A unique constraint covering the columns `[labelBn]` on the table `recipientGroups` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `labelBn` to the `recipientGroups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "recipientGroups" ADD COLUMN     "labelBn" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "recipientGroups_labelBn_key" ON "recipientGroups"("labelBn");
