/*
  Warnings:

  - You are about to drop the column `paymentSourceId` on the `openingBalances` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[year,month]` on the table `openingBalances` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "openingBalances" DROP CONSTRAINT "openingBalances_paymentSourceId_fkey";

-- DropIndex
DROP INDEX "openingBalances_year_month_paymentSourceId_key";

-- AlterTable
ALTER TABLE "openingBalances" DROP COLUMN "paymentSourceId";

-- CreateIndex
CREATE UNIQUE INDEX "openingBalances_year_month_key" ON "openingBalances"("year", "month");
