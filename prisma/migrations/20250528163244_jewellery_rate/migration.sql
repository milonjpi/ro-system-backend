-- CreateTable
CREATE TABLE "jewelleryRates" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "caratId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jewelleryRates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "jewelleryRates_date_caratId_key" ON "jewelleryRates"("date", "caratId");

-- AddForeignKey
ALTER TABLE "jewelleryRates" ADD CONSTRAINT "jewelleryRates_caratId_fkey" FOREIGN KEY ("caratId") REFERENCES "carats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
