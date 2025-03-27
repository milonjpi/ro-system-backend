/*
  Warnings:

  - A unique constraint covering the columns `[year,recipientId]` on the table `zakats` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "zakats_year_recipientId_key" ON "zakats"("year", "recipientId");
