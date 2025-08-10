/*
  Warnings:

  - Added the required column `weight` to the `soldJewelleries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "soldJewelleries" ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL;
