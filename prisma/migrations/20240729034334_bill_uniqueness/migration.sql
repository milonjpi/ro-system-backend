/*
  Warnings:

  - A unique constraint covering the columns `[meterId,month,year]` on the table `electricityBills` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "electricityBills_month_year_key";

-- CreateIndex
CREATE UNIQUE INDEX "electricityBills_meterId_month_year_key" ON "electricityBills"("meterId", "month", "year");
